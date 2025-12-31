
import React from "react";
import News from "@/components/News";

export default async function CategoryPage({ params }: { params: { name: string } }) {

  const { name: category } = await params; // <-- This is the key change
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY || "";

  return (
    <div className="flex flex-col min-h-screen">
      <main className="grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <News category={category} country="us" pageSize={12} />
        </div>
      </main>
    </div>
  );
}
