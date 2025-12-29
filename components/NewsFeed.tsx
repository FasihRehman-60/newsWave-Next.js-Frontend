"use client";
import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import NewsItem from "./NewsItem";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  author: string;
  publishedAt: string;
  source: {
    name: string;
  };
  [key: string]: any; // for extra properties
}

interface NewsFeedProps {
  apiKey: string;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ apiKey }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&pageSize=20&apiKey=${apiKey}`
      );
      const data = await res.json();
      if (data.articles) {
        setArticles(data.articles);
        setFilteredArticles(data.articles);
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [apiKey]);

  const handleSearchResults = (results: Article[], query?: string) => {
    setFilteredArticles(results);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-6">
      <SearchBar apiKey={apiKey} onResults={handleSearchResults} />
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading articles...</p>
      ) : filteredArticles.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No articles found</p>
      ) : (
        <div className="grid gap-4 sm:gap-6 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredArticles.map((article, idx) => (
            <NewsItem
              key={article.url || `article-${idx}`}
              title={article.title}
              description={article.description}
              imageUrl={article.urlToImage} // map to expected prop
              newsUrl={article.url}         // map to expected prop
              author={article.author}
              date={article.publishedAt}    // map to expected prop
              source={article.source?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
