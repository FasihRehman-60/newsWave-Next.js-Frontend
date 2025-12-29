"use client";
import React, { useState, useEffect, useCallback } from "react";
import {api} from "@/utils/api";
import { Copy, RefreshCw } from "lucide-react";
import BackButton from "@/components/BackButton";

interface ApiKeyInfo {
  apiKey: string;
  dailyLimit: number;
  usageToday: number;
  // Add other properties that might exist in the API response
  [key: string]: any;
}

export default function DeveloperAPI() {
  const [loading, setLoading] = useState<boolean>(false);
  const [apiKeyInfo, setApiKeyInfo] = useState<ApiKeyInfo | null>(null);

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  const previewURL = `${baseURL}/api/public/news?category=default&company=default`;

  // Fetch API key data
  const fetchKey = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/user/api-key/stats");
      if (res.data.apiKey) {
        setApiKeyInfo(res.data);
      } else {
        setApiKeyInfo(null);
      }
    } catch (err: any) {
      console.error("Failed to get API key:", err?.response?.data || err.message);
      setApiKeyInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKey();
  }, [fetchKey]);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text)
      .then(() => alert("Copied to clipboard"))
      .catch(() => alert("Failed to copy"));
  };

  const handleCreateKey = async () => {
    if (!window.confirm("Create a new API key?")) return;
    try {
      setLoading(true);
      const res = await api.post("/api/user/api-key/create");
      setApiKeyInfo(res.data);
      alert("API key created successfully");
    } catch (err: any) {
      console.error("Failed to create API key:", err);
      alert(err?.response?.data?.error || "Failed to create API key");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!window.confirm("Regenerate your API key? This will disable the old key.")) return;
    try {
      setLoading(true);
      const res = await api.post("/api/user/api-key/regenerate");
      setApiKeyInfo((prev) => prev ? { ...prev, apiKey: res.data.apiKey } : null);
      alert("API key regenerated. Old key disabled.");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to regenerate API key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <BackButton />

      <h1 className="text-2xl font-bold mb-6">Developer API</h1>

      {/* Explanation Banner */}
      <p className="text-gray-600 mb-6 bg-blue-50 p-4 rounded-lg border">
        The <strong>Preview API</strong> allows anyone to test the endpoint in a browser 
        without an API key. It is limited and only for testing.
        <br />
        To use the news data inside your <strong>apps, websites, scripts, or backend</strong>, 
        you must use the <strong>Full Access API</strong> with your API Key included.
      </p>

      {/* API Key Section */}
      <div className="bg-white p-5 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-3">Your API Key</h2>

        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : apiKeyInfo ? (
          <>
            {/* Key + Buttons */}
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <div className="bg-gray-100 px-3 py-2 rounded-md break-all">{apiKeyInfo.apiKey}</div>

              <button 
                onClick={() => copyToClipboard(apiKeyInfo.apiKey)} 
                className="px-3 py-1 bg-blue-600 text-white rounded flex items-center gap-2"
              >
                <Copy size={14} /> Copy
              </button>

              <button 
                onClick={handleRegenerate} 
                className="px-3 py-1 bg-orange-500 text-white rounded flex items-center gap-2"
              >
                <RefreshCw size={14} /> Regenerate
              </button>

              <div className="text-sm text-gray-500 ml-auto">
                Daily limit: {apiKeyInfo.dailyLimit} • Used: {apiKeyInfo.usageToday}
              </div>
            </div>

            {/* API URL Templates */}
            <div className="space-y-4">
              {/* Preview URL */}
              <p className="text-sm text-gray-600 font-semibold">Preview API (No Key Required)</p>
              <p className="text-sm text-gray-500">Anyone can open this link in their browser. Limited results.</p>

              <div className="flex items-center gap-3 flex-wrap">
                <code className="bg-gray-100 px-3 py-2 rounded break-all">{previewURL}</code>

                <button 
                  onClick={() => copyToClipboard(previewURL)} 
                  className="px-3 py-1 bg-blue-600 text-white rounded flex items-center gap-2"
                >
                  <Copy size={14} /> Copy Link
                </button>
              </div>

              {/* Full Access URL */}
              <p className="text-sm text-gray-600 font-semibold mt-4">Full Access API (Requires API Key)</p>
              <p className="text-sm text-gray-500">
                Use in apps, websites, mobile apps, or backend systems. Higher limits + search support.
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                <code className="bg-gray-100 px-3 py-2 rounded break-all">
                  {`${baseURL}/api/public/news?category=default&company=default&api_key=${apiKeyInfo.apiKey}`}
                </code>

                <button 
                  onClick={() => copyToClipboard(`${baseURL}/api/public/news?category=default&company=default&api_key=${apiKeyInfo.apiKey}`)}
                  className="px-3 py-1 bg-blue-600 text-white rounded flex items-center gap-2"
                >
                  <Copy size={14} /> Copy Link
                </button>
              </div>
            </div>
          </>
        ) : (
          // No key yet
          <div>
            <p className="text-gray-500 mb-2">You do not have an API key yet.</p>
            <button 
              onClick={handleCreateKey} 
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Create API Key
            </button>
          </div>
        )}
      </div>
    </div>
  );
}