interface CacheEntry {
    data: any;
    timestamp: number;
    ttl: number;
  }
  
  class SearchCache {
    private cache = new Map<string, CacheEntry>();
    private defaultTTL = 5 * 60 * 1000; // 5 minutes
  
    set(key: string, data: any, ttl = this.defaultTTL) {
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl,
      });
    }
  
    get(key: string) {
      const entry = this.cache.get(key);
      if (!entry) return null;
  
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        return null;
      }
  
      return entry.data;
    }
  
    clear() {
      this.cache.clear();
    }
  }
  
  export const searchCache = new SearchCache();