CREATE TABLE public.search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anon_id TEXT NOT NULL,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert search history"
ON public.search_history FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can read own search history"
ON public.search_history FOR SELECT
USING (true);

CREATE INDEX idx_search_history_anon_id ON public.search_history(anon_id);
CREATE INDEX idx_search_history_created_at ON public.search_history(created_at DESC);