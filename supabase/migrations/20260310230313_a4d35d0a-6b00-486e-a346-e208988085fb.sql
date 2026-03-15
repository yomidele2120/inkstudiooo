CREATE TABLE public.bible_verses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book text NOT NULL,
  chapter integer NOT NULL,
  verse integer NOT NULL,
  text text NOT NULL,
  translation text NOT NULL,
  canon_type text NOT NULL DEFAULT 'Protestant',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_bible_verses_book ON public.bible_verses (book);
CREATE INDEX idx_bible_verses_translation ON public.bible_verses (translation);
CREATE INDEX idx_bible_verses_book_chapter_verse ON public.bible_verses (book, chapter, verse);
CREATE UNIQUE INDEX idx_bible_verses_unique ON public.bible_verses (book, chapter, verse, translation);

ALTER TABLE public.bible_verses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read bible verses"
  ON public.bible_verses
  FOR SELECT
  TO anon, authenticated
  USING (true);