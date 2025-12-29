// utils/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// Create a class to handle token storage more safely
class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
      headers: { "Content-Type": "application/json" },
    });

    this.setupInterceptors();
  }

  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          typeof window !== "undefined" &&
          error.response?.status === 401 &&
          error.config?.headers?.Authorization
        ) {
          // Handle session expiration
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiry");
          window.location.href = "/signin";
        }
        return Promise.reject(error);
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Create a singleton instance
const apiClient = new ApiClient();
export const api = apiClient.getInstance();

// Cache utility with TypeScript
const CACHE_DURATION = 10 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class CacheManager<T = any> {
  private cache = new Map<string, CacheEntry<T>>();

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const relatedNewsCache = new CacheManager<any[]>();

export const fetchRelatedNews = async (keyword: string): Promise<any[]> => {
  if (!keyword) return [];

  const key = keyword.toLowerCase().trim();
  const cached = relatedNewsCache.get(key);
  if (cached) return cached;

  try {
    const res = await api.get(`/news/related?q=${encodeURIComponent(key)}`);
    const articles = res.data.articles || [];
    relatedNewsCache.set(key, articles);
    return articles;
  } catch (err) {
    console.error("Error fetching related news:", err);
    return [];
  }
};