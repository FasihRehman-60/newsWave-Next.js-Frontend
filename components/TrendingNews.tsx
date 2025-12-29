"use client";
import React, { useEffect } from "react";

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
  popularity?: number;

  [key: string]: any;
}

interface TrendingArticle extends Article {
  trendingScore: number;
}

interface TrendingNewsProps {
  apiKey: string;
  country?: string;
  onTrendingFetched?: (articles: TrendingArticle[]) => void;
  getLocalScore?: (article: Article) => number;
}

const TrendingNews: React.FC<TrendingNewsProps> = ({
  apiKey,
  country = "us",
  onTrendingFetched,
  getLocalScore,
}) => {
  useEffect(() => {
    let ignore = false;

    const fetchTrending = async () => {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=breaking OR top OR latest&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`
        );
        const data = await res.json();
        if (!data.articles || ignore) return;

        const scoredArticles: TrendingArticle[] = data.articles.map((article: Article) => {
          const baseScore = article.popularity || 0;
          const localScore = getLocalScore ? getLocalScore(article) : 0;
          return {
            ...article,
            trendingScore: baseScore + localScore,
          };
        });

        scoredArticles.sort((a: TrendingArticle, b: TrendingArticle) => 
          b.trendingScore - a.trendingScore
        );
        onTrendingFetched?.(scoredArticles);
      } catch (err) {
        console.error("Error fetching trending news:", err);
      }
    };

    fetchTrending();
    return () => {
      ignore = true;
    };
  }, [apiKey, country, onTrendingFetched, getLocalScore]);

  return null;
};

export default TrendingNews;