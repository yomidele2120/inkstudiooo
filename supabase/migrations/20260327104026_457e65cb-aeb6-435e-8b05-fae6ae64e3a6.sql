
CREATE TABLE public.search_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash text NOT NULL UNIQUE,
  query_text text NOT NULL,
  mode text NOT NULL DEFAULT 'search',
  language text NOT NULL DEFAULT 'en',
  response text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  hit_count integer NOT NULL DEFAULT 1
);

CREATE INDEX idx_search_cache_hash ON public.search_cache(query_hash);
CREATE INDEX idx_search_cache_created ON public.search_cache(created_at DESC);
CREATE INDEX idx_search_history_query ON public.search_history(query);

ALTER TABLE public.search_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read search cache" ON public.search_cache FOR SELECT TO public USING (true);
CREATE POLICY "Service role can insert search cache" ON public.search_cache FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Service role can update search cache" ON public.search_cache FOR UPDATE TO public USING (true) WITH CHECK (true);
