"use client";

import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import NewsItem from "./NewsItem";
import SearchBar from "./SearchBar";
import RelatedNews from "./RelatedNews";
import { Article } from "@/types/article";

interface NewsProps {
  country?: string;
  pageSize?: number;
  category: string;
  setProgress?: (progress: number) => void;
}

function capitalize(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : "";
}

const isTrending = (article: Article): boolean => {
  const text = `${article.title || ""} ${article.description || ""} ${article.source?.name || ""}`.toLowerCase();

  const hotWords = [
    "breaking",
    "trending",
    "exclusive",
    "viral",
    "must watch",
    "hot news",
    "update",
    "revealed",
    "announcement",
    "ai",
    "crypto",
  ];

  return hotWords.some((word) => text.includes(word));
};

const News: React.FC<NewsProps> = ({
  country = "us",
  pageSize = 8,
  category = "general",
  setProgress,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchActive, setSearchActive] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  // Fetch news via server-side API route
  const fetchPage = async (p = 1) => {
    try {
      setProgress?.(20);

      const url = `/api/news?country=${country}&category=${category}&page=${p}&pageSize=${pageSize}`;
      const res = await fetch(url);
      setProgress?.(60);

      const data = await res.json();

      if (data.articles) {
        const sortedArticles: Article[] = [...data.articles].sort(
          (a, b) => Number(isTrending(b)) - Number(isTrending(a))
        );

        setArticles((prev) =>
          p === 1 ? sortedArticles : [...prev, ...sortedArticles]
        );
      }

      setTotalResults(data.totalResults || 0);
      setProgress?.(100);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
  };

  useEffect(() => {
    document.title = `${capitalize(category)} - NewsWave`;
    setPage(1);
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, country]);

  const fetchMoreData = async () => {
    if (searchActive) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchPage(nextPage);
  };

  const handleSearchResults = (results: Article[], query: string) => {
    setLastQuery(query);

    if (!query.trim()) {
      setSearchActive(false);
      setPage(1);
      fetchPage(1);
      return;
    }

    const sortedResults = [...results].sort(
      (a, b) => Number(isTrending(b)) - Number(isTrending(a))
    );

    setArticles(sortedResults);
    setSearchActive(true);
  };

  return (
    <section className="px-3 sm:px-6 lg:px-10 mt-4 sm:mt-6">
      <SearchBar onResults={handleSearchResults} />

      <h1 className="text-center font-bold tracking-tight text-gray-900 text-xl sm:text-2xl lg:text-3xl mt-4 mb-6">
        {capitalize(category)} Headlines
      </h1>

      {searchActive ? (
        <>
          <div className="mb-10">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-center">
              Search Results for "{lastQuery}"
            </h2>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {articles.length ? (
                articles.map((article, index) => (
                  <NewsItem
                    key={index}
                    title={article.title}
                    description={article.description}
                    imageUrl={article.urlToImage}
                    newsUrl={article.url}
                    author={article.author}
                    date={article.publishedAt}
                    source={article.source?.name}
                    isTrending={isTrending(article)}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No results found.
                </p>
              )}
            </div>
          </div>

          <div className="mt-10 border-t pt-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-center">
              More Articles You Might Like
            </h2>

            <RelatedNews
              keyword={lastQuery}
              excludeUrls={articles.map((a) => a.url)}
            />
          </div>
        </>
      ) : (
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length < totalResults}
          loader={<h4 className="text-center py-4">Loading more...</h4>}
        >
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {articles.map((article, index) => (
              <NewsItem
                key={index}
                title={article.title}
                description={article.description}
                imageUrl={article.urlToImage}
                newsUrl={article.url}
                author={article.author}
                date={article.publishedAt}
                source={article.source?.name}
                isTrending={isTrending(article)}
              />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </section>
  );
};

export default News;
