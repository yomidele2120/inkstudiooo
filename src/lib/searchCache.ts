// In-memory session cache for search results
const cache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function makeKey(query: string, mode: string, language: string): string {
  return `${mode}:${language}:${query}`.toLowerCase().trim();
}

export function getCachedResponse(query: string, mode = 'search', language = 'en'): string | null {
  const key = makeKey(query, mode, language);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.response;
}

export function setCachedResponse(query: string, mode = 'search', language = 'en', response: string): void {
  const key = makeKey(query, mode, language);
  cache.set(key, { response, timestamp: Date.now() });

  // Evict old entries if cache grows too large
  if (cache.size > 100) {
    const oldest = [...cache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp);
    for (let i = 0; i < 20; i++) {
      cache.delete(oldest[i][0]);
    }
  }
}
