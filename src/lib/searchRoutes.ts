export type SearchMode = 'search' | 'compare' | 'debate' | 'topic' | 'scripture';
export type QuerySource = 'search' | 'compare' | 'debate' | 'faith' | 'scripture';

export function toSearchResultsUrl(
  query: string,
  mode: SearchMode = 'search',
  source: QuerySource = 'search',
  language = 'en',
) {
  return `/results?q=${encodeURIComponent(query)}&mode=${mode}&source=${source}&lang=${language}`;
}

export function createQueryId(query: string, mode: SearchMode = 'search', source: QuerySource = 'search', language = 'en') {
  const payload = { query, mode, source, language };
  const json = JSON.stringify(payload);
  return encodeURIComponent(btoa(json));
}

export function parseQueryId(queryId: string | undefined) {
  if (!queryId) return null;

  try {
    const decoded = decodeURIComponent(queryId);
    const parsed = JSON.parse(atob(decoded));

    if (typeof parsed.query !== 'string') return null;

    return {
      query: parsed.query,
      mode: (parsed.mode as SearchMode) || 'search',
      source: (parsed.source as QuerySource) || 'search',
      language: parsed.language || 'en',
    };
  } catch {
    return null;
  }
}

export function queryDetailUrl(query: string, mode: SearchMode = 'search', source: QuerySource = 'search', language = 'en') {
  return `/query/${createQueryId(query, mode, source, language)}`;
}
