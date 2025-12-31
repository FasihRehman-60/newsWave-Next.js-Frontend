import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country") || "us";
    const category = searchParams.get("category") || "general";
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "20";
    const q = searchParams.get("q") || "";

    let url = "";

    if (q) {
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}&language=en`;
    } else {
      url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&page=${page}&pageSize=${pageSize}`;
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.NEWS_API_KEY}`,
      },
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error in /api/news:", err);
    return NextResponse.json({ articles: [] });
  }
}
