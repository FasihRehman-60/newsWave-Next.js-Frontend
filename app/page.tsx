"use client";

import React from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import News from "@/components/News";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY || "";

  const categories = [
    { name: "Business", path: "/category/business", color: "bg-blue-100 text-blue-800" },
    { name: "Technology", path: "/category/technology", color: "bg-purple-100 text-purple-800" },
    { name: "Sports", path: "/category/sports", color: "bg-green-100 text-green-800" },
    { name: "Entertainment", path: "/category/entertainment", color: "bg-pink-100 text-pink-800" },
    { name: "Health", path: "/category/health", color: "bg-teal-100 text-teal-800" },
    { name: "Science", path: "/category/science", color: "bg-indigo-100 text-indigo-800" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="grow">
        {/* Main News Feed */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <News category="general" country="us" pageSize={12} />
          </div>
        </section>
      </main>
    </div>
  );
}
