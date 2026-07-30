interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class ResumeCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  /**
   * Store data in memory cache with TTL (in milliseconds)
   */
  set<T>(key: string, data: T, ttlMs: number = 300000): void {
    const expiresAt = Date.now() + ttlMs;
    this.cache.set(key, { data, expiresAt });
  }

  /**
   * Retrieve data from memory cache if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Invalidate a specific key or pattern
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cached items
   */
  clear(): void {
    this.cache.clear();
  }
}

export const resumeCache = new ResumeCache();
