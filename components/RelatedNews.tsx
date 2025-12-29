"use client";
import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import { Loader2 } from "lucide-react";
import { Article } from "@/types/article"; 

interface RelatedNewsProps {
  keyword: string;
  apiKey: string;
  searchResults?: Article[];
  compact?: boolean;
  excludeUrls?: string[];
}

const truncateText = (text: string, maxLength: number): string =>
  text && text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

const RelatedNews: React.FC<RelatedNewsProps> = ({
  keyword,
  apiKey,
  searchResults = [],
  compact = false,
}) => {
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const existingUrls = searchResults.map((a) => a.url);

  useEffect(() => {
    if (!keyword) return;

    const fetchRelated = async () => {
      setLoading(true);
      try {
        const query = keyword.split(" ").join(" OR ");
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          query
        )}&sortBy=relevancy&pageSize=20&language=en&apiKey=${apiKey}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.articles) {
          setRelated([]);
          setLoading(false);
          return;
        }

        // ✅ Cast to Article[]
        const fetchedArticles: Article[] = data.articles as Article[];

        const filtered = fetchedArticles.filter(
          (a) => !existingUrls.includes(a.url)
        );

        const unique = Array.from(
          new Map(filtered.map((a) => [a.url, a])).values()
        );

        setRelated(unique.slice(0, 3));
      } catch (err) {
        console.error("Error fetching related news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [keyword, apiKey, existingUrls]);

  if (loading) {
    return (
      <div className="mt-10 flex justify-center items-center gap-2 text-gray-500">
        <Loader2 className="animate-spin" />
        <span>Loading more articles...</span>
      </div>
    );
  }

  if (!related.length) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">More Articles</h2>
      <div
        className={`grid gap-6 animate-fadeIn grid-cols-1 sm:grid-cols-2 ${
          compact ? "" : "lg:grid-cols-3"
        }`}
      >
        {related.map((article, index) => (
          <NewsItem
            key={article.url || index}
            title={article.title}
            description={
              compact
                ? truncateText(article.description, 80)
                : article.description || "No description available."
            }
            imageUrl={article.urlToImage}
            newsUrl={article.url}
            author={article.author}
            date={article.publishedAt}
            source={article.source?.name}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedNews;
