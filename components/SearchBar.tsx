"use client";
import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { Article } from "@/types/article";

interface SearchBarProps {
  onResults: (results: Article[], query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onResults }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hasSearched, setHasSearched] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const lastQueryRef = useRef<string>("");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSuggestions([]);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      setActiveIndex(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected =
        activeIndex >= 0 ? suggestions[activeIndex].title : query.trim();
      if (selected) handleSelect(selected);
    }
  };

  // Fetch suggestions with debounce
  useEffect(() => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(() => {
      if (lastQueryRef.current === query.trim()) return;
      fetchSuggestions(query.trim());
    }, 350);

    return () => clearTimeout(delay);
  }, [query]);

  const fetchSuggestions = async (keyword: string) => {
    try {
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();

      setLoading(true);
      lastQueryRef.current = keyword;

      // Call server API instead of NewsAPI directly
      const url = `/api/news?q=${encodeURIComponent(keyword)}&pageSize=5`;
      const res = await fetch(url, { signal: controllerRef.current.signal });
      const data = await res.json();

      setSuggestions(data.articles || []);
      setActiveIndex(-1);
      setHasSearched(true);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Fetch error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (keyword: string) => {
    if (!keyword.trim()) return;
    setQuery(keyword);
    setSuggestions([]);
    setLoading(true);
    setHasSearched(true);

    try {
      const url = `/api/news?q=${encodeURIComponent(keyword)}&pageSize=10`;
      const res = await fetch(url);
      const data = await res.json();

      onResults(data.articles || [], keyword);
    } catch (err) {
      console.error("Error fetching search results:", err);
      onResults([], keyword);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setActiveIndex(-1);
    setHasSearched(false);
    lastQueryRef.current = "";
    onResults([], "");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div
      ref={searchRef}
      className="relative w-full max-w-xl mx-auto mb-4 px-2 sm:px-0"
    >
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search articles..."
          className="w-full rounded-2xl border border-gray-300 px-4 py-3 pr-12 bg-white text-gray-900 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm sm:text-base"
        />

        {loading && (
          <div className="absolute right-4 top-3 text-gray-400 animate-pulse">
            ⏳
          </div>
        )}
        {!loading && query.trim().length > 0 && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        )}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto animate-fadeIn">
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(item.title)}
              className={`px-4 py-3 cursor-pointer text-sm transition ${
                idx === activeIndex
                  ? "bg-blue-100 text-blue-900"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {!loading && hasSearched && query.trim().length > 2 && suggestions.length === 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm text-gray-500">
          No results found
        </div>
      )}
    </div>
  );
};

export default SearchBar;
