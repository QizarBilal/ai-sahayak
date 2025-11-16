// Simple in-memory cache (can be replaced with Redis in production)
interface CacheEntry {
  value: any;
  expires: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry> = new Map();
  private cleanupInterval: ReturnType<typeof setInterval>;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  set(key: string, value: any, ttlSeconds: number = 3600): void {
    const expires = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expires });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    Array.from(this.cache.entries()).forEach(([key, entry]) => {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    });
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

export const cache = new SimpleCache();

// Helper function for cached API calls
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  const cached = cache.get<T>(key);
  
  if (cached !== null) {
    return cached;
  }

  const fresh = await fetcher();
  cache.set(key, fresh, ttlSeconds);
  return fresh;
}
