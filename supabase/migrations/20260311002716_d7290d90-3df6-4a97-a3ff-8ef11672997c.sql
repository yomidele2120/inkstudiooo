
CREATE TABLE public.quran_verses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  surah_no integer NOT NULL,
  surah_name_en text NOT NULL,
  surah_name_ar text,
  surah_name_roman text,
  ayah_no integer NOT NULL,
  ayah_no_quran integer,
  text_ar text,
  text_en text NOT NULL,
  juz_no integer,
  place_of_revelation text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (surah_no, ayah_no)
);

ALTER TABLE public.quran_verses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read quran verses"
  ON public.quran_verses
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX idx_quran_surah_ayah ON public.quran_verses (surah_no, ayah_no);
CREATE INDEX idx_quran_text_search ON public.quran_verses USING gin (to_tsvector('english', text_en));
