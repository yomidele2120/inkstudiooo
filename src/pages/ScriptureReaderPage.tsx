import { Helmet } from 'react-helmet';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAIStream } from '@/hooks/useAIStream';
import type { QuranVerse, BibleVerse, EthiopianVerse } from '@/data/mockScriptures';
import { sampleQuranVerses, sampleBibleVerses, sampleEthiopianVerses } from '@/data/mockScriptures';

const bibleBooks = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
  'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians',
  'Ephesians', 'Philippians', 'Colossians',
  '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy',
  'Titus', 'Philemon', 'Hebrews', 'James',
  '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation',
];

const bibleChapterCounts: Record<string, number> = {
  Genesis: 50, Exodus: 40, Leviticus: 27, Numbers: 36, Deuteronomy: 34,
  Joshua: 24, Judges: 21, Ruth: 4, '1 Samuel': 31, '2 Samuel': 24,
  '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36,
  Ezra: 10, Nehemiah: 13, Esther: 10, Job: 42, Psalms: 150, Proverbs: 31,
  Ecclesiastes: 12, 'Song of Solomon': 8, Isaiah: 66, Jeremiah: 52,
  Lamentations: 5, Ezekiel: 48, Daniel: 12, Hosea: 14, Joel: 3,
  Amos: 9, Obadiah: 1, Jonah: 4, Micah: 7, Nahum: 3, Habakkuk: 3,
  Zephaniah: 3, Haggai: 2, Zechariah: 14, Malachi: 4,
  Matthew: 28, Mark: 16, Luke: 24, John: 21, Acts: 28,
  Romans: 16, '1 Corinthians': 16, '2 Corinthians': 13, Galatians: 6,
  Ephesians: 6, Philippians: 4, Colossians: 4, '1 Thessalonians': 5,
  '2 Thessalonians': 3, '1 Timothy': 6, '2 Timothy': 4,
  Titus: 3, Philemon: 1, Hebrews: 13, James: 5,
  '1 Peter': 5, '2 Peter': 3, '1 John': 5, '2 John': 1, '3 John': 1,
  Jude: 1, Revelation: 22,
};

const ethiopianBooks = [
  '1 Enoch', '2 Enoch', 'Jubilees', '1 Meqabyan', '2 Meqabyan', '3 Meqabyan',
  'Sirach', 'Wisdom of Solomon', 'Tobit', 'Judith', 'Baruch',
  '1 Esdras', '2 Esdras', 'Prayer of Manasseh',
];

const ethiopianChapterCounts: Record<string, number> = {
  '1 Enoch': 108, '2 Enoch': 100, Jubilees: 50, '1 Meqabyan': 36,
  '2 Meqabyan': 24, '3 Meqabyan': 32, Sirach: 51, 'Wisdom of Solomon': 19,
  Tobit: 14, Judith: 16, Baruch: 6, '1 Esdras': 9, '2 Esdras': 16,
  'Prayer of Manasseh': 1,
};

const quranSurahs = Array.from({ length: 114 }, (_, i) => `Surah ${i + 1}`);

const scriptureTypes: Record<string, { title: string; books: string[]; color: string }> = {
  bible: { title: 'The Holy Bible', books: bibleBooks, color: 'scripture-bible' },
  quran: { title: 'The Holy Quran', books: quranSurahs, color: 'scripture-quran' },
  other: { title: 'Ethiopian & Other Scriptures', books: ethiopianBooks, color: 'scripture-ethiopian' },
};

function getBookChapterCount(type: string, book: string): number {
  if (type === 'bible') return bibleChapterCounts[book] || 1;
  if (type === 'other') return ethiopianChapterCounts[book] || 1;
  if (type === 'quran') return 1;
  return 1;
}

function getChapterContent(type: string, book: string, chapter?: number) {
  if (type === 'quran') {
    const surahNumber = Number(book.replace(/\D/g, '').trim()) || null;
    if (!surahNumber) return [];
    const results = sampleQuranVerses
      .filter((v) => v.surah === surahNumber)
      .sort((a, b) => a.ayah - b.ayah);
    return results.map((v) => ({ ayah: v.ayah, arabicText: v.arabicText, englishText: v.englishText }));
  }

  if (type === 'bible') {
    const chapterNumber = Number(chapter);
    const results = sampleBibleVerses
      .filter((v) => v.book === book && v.chapter === chapterNumber)
      .sort((a, b) => a.verse - b.verse);
    return results.map((v) => ({ verse: v.verse, text: v.text }));
  }

  const chapterNumber = Number(chapter);
  const results = sampleEthiopianVerses
    .filter((v) => v.book === book && v.chapter === chapterNumber)
    .sort((a, b) => a.verse - b.verse);
  return results.map((v) => ({ verse: v.verse, text: v.text }));
}

export default function ScriptureReaderPage() {
  const { type, bookSlug, chapter } = useParams<{ type: string; bookSlug?: string; chapter?: string }>();
  const navigate = useNavigate();

  const scripture = type ? scriptureTypes[type] : null;
  const normalizedBook = useMemo(() => (bookSlug ? decodeURIComponent(bookSlug) : null), [bookSlug]);
  const chapterNumber = chapter ? Number(chapter) : null;

  const selectedBook = normalizedBook;
  const selectedChapter = chapterNumber && !Number.isNaN(chapterNumber) ? chapterNumber : null;

  const [fontSize, setFontSize] = useState(18);
  const [jumpVerse, setJumpVerse] = useState<number | ''>('');
  const [showVerseOnly, setShowVerseOnly] = useState<number | null>(null);
  const [aiMainText, setAiMainText] = useState('');
  const [aiExplanationText, setAiExplanationText] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('su-scripture-font-size');
    if (saved) {
      const parsed = Number(saved);
      if (!Number.isNaN(parsed)) setFontSize(parsed);
    }
  }, []);

  const { response: aiResponse, isLoading, error, query: aiQuery } = useAIStream();

  const isBookSelected = Boolean(selectedBook);
  const isChapterSelected = Boolean(selectedChapter) || type === 'quran';
  const chapterCount = type === 'quran' ? 114 : (selectedBook ? getBookChapterCount(type, selectedBook) : 0);
  const fallbackChapterContent = isChapterSelected
    ? getChapterContent(type, selectedBook || '', selectedChapter || 1)
    : [];

  const isSectionForReading = isBookSelected && isChapterSelected;

  useEffect(() => {
    if (!aiResponse) {
      setAiMainText('');
      setAiExplanationText('');
      return;
    }

    if (type === 'quran') {
      setAiMainText(aiResponse.trim());
      setAiExplanationText('');
    } else {
      const split = aiResponse.split(/(?:Explanation|explanation)\s*[:]?/i);
      setAiMainText(split[0]?.trim() || '');
      setAiExplanationText(split.slice(1).join('\n').trim() || '');
    }
  }, [aiResponse, type]);

  useEffect(() => {
    if (!isSectionForReading || !scripture) {
      return;
    }

    const selection = type === 'quran'
      ? `Surah ${selectedBook}`
      : `${selectedBook} Chapter ${selectedChapter}`;

    let prompt = '';

    if (type === 'quran') {
      const surahNumber = Number(selectedBook?.replace(/\D/g, '').trim()) || null;
      const totalAyahs = fallbackChapterContent.length;

      if (surahNumber) {
        if (totalAyahs > 20) {
          prompt = `Provide only the scripture text for Surah ${selectedBook} (Surah ${surahNumber}) from the Quran. For each ayah, show Arabic first on one line then English translation directly below. Number each ayah. Divide the surah into blocks of up to 20 ayahs. After each block of verses, add an 'Explanation:' paragraph for that block. Do not add a global explanation at the start.`;
        } else {
          prompt = `Provide only the scripture text for Surah ${selectedBook} (Surah ${surahNumber}) from the Quran. For each ayah, show Arabic first on one line then English translation directly below. Number each ayah. After all ayahs, add one 'Explanation:' paragraph.`;
        }
      } else {
        prompt = `Provide only scripture text for ${selection} from the Quran with Arabic first and English translation beneath each ayah. Number each ayah. If this section has more than 20 ayahs, divide into blocks of up to 20 and add an 'Explanation:' paragraph after each block. If 20 or fewer ayahs, add one 'Explanation:' section at the end.`;
      }
    } else if (type === 'bible') {
      prompt = `Provide only scripture text for ${selection} from the Bible (chapter content). List each verse in order with verse numbers (1., 2., 3.), then append an 'Explanation:' section after the chapter text.`;
    } else {
      prompt = `Provide only scripture text for ${selection} from Ethiopian scripture, list verse numbers, then append 'Explanation:' section after.`;
    }

    aiQuery({ query: prompt, mode: 'scripture', language: 'en' });
  }, [isSectionForReading, scripture, type, selectedBook, selectedChapter, aiQuery]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('su-scripture-font-size', String(fontSize));
  }, [fontSize]);

  if (!scripture) {
    return (
      <div className="min-h-screen py-16 text-center">
        <p className="text-muted-foreground">Scripture type not found or unsupported.</p>
        <Link to="/" className="text-primary mt-4 inline-block"> Return Home</Link>
      </div>
    );
  }

  const pageTitle = isSectionForReading
    ? type === 'quran'
      ? `${selectedBook} (Surah)`
      : `${selectedBook} Chapter ${selectedChapter}`
    : scripture.title;

  const quranVerseGroups = type === 'quran'
    ? Array.from({ length: Math.ceil(fallbackChapterContent.length / 20) }, (_, i) =>
        fallbackChapterContent.slice(i * 20, i * 20 + 20))
    : [];

  return (
    <>
      <Helmet>
        <title>{pageTitle} — Scripture Unity AI</title>
        <meta name="description" content={`Read ${pageTitle} on Scripture Unity AI.`} />
      </Helmet>

      <div className="min-h-screen py-8">
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Home
            </Link>
          </div>

          <div className="text-center mb-10">
            <BookOpen className={`h-12 w-12 text-${scripture.color} mx-auto mb-4`} />
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              {pageTitle}
            </h1>
            <p className="text-muted-foreground mt-2">Read the full chapter with verse number formatting.</p>
          </div>

          {!isBookSelected && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {scripture.books.map((book, i) => (
                <motion.button
                  key={book}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.5) }}
                  onClick={() => navigate(`/scripture/${type}/${encodeURIComponent(book)}`)}
                  className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:glow-border transition-all text-left"
                >
                  <span className="font-heading text-foreground font-medium">{book}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </motion.button>
              ))}
            </div>
          )}

          {isBookSelected && type !== 'quran' && (
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <h2 className="font-semibold text-foreground mb-3">Select Chapter</h2>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {Array.from({ length: chapterCount }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => navigate(`/scripture/${type}/${encodeURIComponent(selectedBook)}/${num}`)}
                    className={`rounded-md px-2 py-1 text-sm ${selectedChapter === num ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-primary/10'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isSectionForReading && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (type === 'quran') {
                        const current = Number(selectedBook?.replace(/\D/g, '').trim()) || 0;
                        if (current > 1) {
                          const prev = current - 1;
                          navigate(`/scripture/${type}/Surah%20${prev}`);
                        }
                      } else if (selectedChapter && selectedChapter > 1) {
                        navigate(`/scripture/${type}/${encodeURIComponent(selectedBook!)}/${selectedChapter - 1}`);
                      }
                    }}
                    className="rounded-md border px-3 py-1 text-sm"
                  >Previous</button>
                  <button
                    onClick={() => {
                      if (type === 'quran') {
                        const current = Number(selectedBook?.replace(/\D/g, '').trim()) || 0;
                        if (current < chapterCount) {
                          const next = current + 1;
                          navigate(`/scripture/${type}/Surah%20${next}`);
                        }
                      } else if (selectedChapter && selectedChapter < chapterCount) {
                        navigate(`/scripture/${type}/${encodeURIComponent(selectedBook!)}/${selectedChapter + 1}`);
                      }
                    }}
                    className="rounded-md border px-3 py-1 text-sm"
                  >Next</button>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground">Jump to verse:</label>
                  <input
                    type="number"
                    min={1}
                    value={jumpVerse}
                    onChange={(e) => setJumpVerse(Number(e.target.value) || '')}
                    className="w-20 rounded-md border px-2 py-1 text-sm"
                  />
                  <button
                    onClick={() => {
                      if (typeof jumpVerse === 'number') setShowVerseOnly(jumpVerse);
                    }}
                    className="rounded-md border px-3 py-1 text-sm"
                  >Go</button>
                  <button
                    onClick={() => setShowVerseOnly(null)}
                    className="rounded-md border px-3 py-1 text-sm"
                  >Full</button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFontSize((prev) => Math.max(14, prev - 2))}
                    className="rounded-md border px-3 py-1 text-sm"
                  >A-</button>
                  <button
                    onClick={() => setFontSize((prev) => Math.min(26, prev + 2))}
                    className="rounded-md border px-3 py-1 text-sm"
                  >A+</button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                You can adjust the reading size for scripture text. Click A+ to enlarge the text or A- to reduce it. This only affects the verse text and will not change the website layout.
              </p>

              <div
                className="space-y-4 overflow-y-auto max-h-[65vh] p-3 rounded-lg border border-border"
                style={{ fontSize: `${fontSize}px` }}
              >
                {isLoading && (
                  <p className="text-muted-foreground">Generating scripture content… please wait.</p>
                )}

                {error && (
                  <p className="text-destructive">AI error: {error}. Showing fallback content where available.</p>
                )}

                {!isLoading && !error && aiMainText && (
                  <pre className="whitespace-pre-wrap text-left font-body">{aiMainText.trim()}</pre>
                )}

                {!isLoading && !error && aiExplanationText && (
                  <div className="mt-4 rounded-lg border border-muted-foreground p-3 bg-muted/5">
                    <h4 className="font-semibold">Explanation</h4>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">{aiExplanationText.trim()}</p>
                  </div>
                )}

                {!isLoading && !error && !aiMainText && fallbackChapterContent.length > 0 && (
                  <div className="space-y-4">
                    {showVerseOnly ? fallbackChapterContent
                      .filter((item) => item.verse === showVerseOnly || item.ayah === showVerseOnly)
                      .map((item) => (
                        type === 'quran' ? (
                          <article key={item.ayah} className="space-y-1">
                            <div className="font-arabic text-right">{item.ayah}. {item.arabicText}</div>
                            <div>{item.englishText}</div>
                          </article>
                        ) : (
                          <article key={item.verse as number} className="space-y-1">
                            <div className="font-semibold">{item.verse}.</div>
                            <p>{item.text}</p>
                          </article>
                        )
                      ))
                      : type === 'quran' ? (
                        quranVerseGroups.map((group, groupIndex) => (
                          <section key={`group-${groupIndex}`} className="space-y-3">
                            {group.map((item) => (
                              <article key={item.ayah} className="space-y-1">
                                <div className="font-arabic text-right">{item.ayah}. {item.arabicText}</div>
                                <div>{item.englishText}</div>
                              </article>
                            ))}
                            {aiExplanationText && (
                              <div className="rounded-lg border border-muted-foreground p-3 bg-muted/5">
                                <h4 className="font-semibold">Explanation{quranVerseGroups.length > 1 ? ` (Part ${groupIndex + 1})` : ''}</h4>
                                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{aiExplanationText.trim()}</p>
                              </div>
                            )}
                          </section>
                        ))
                      ) : (
                        fallbackChapterContent.map((item) => (
                          <article key={item.verse as number} className="space-y-1">
                            <div className="font-semibold">{item.verse}.</div>
                            <p>{item.text}</p>
                          </article>
                        ))
                      )}
                  </div>
                )}

                {!isLoading && !error && !aiResponse && fallbackChapterContent.length === 0 && (
                  <p className="text-muted-foreground">Request sent, waiting for AI content...</p>
                )}
              </div>
            </div>
          )}

          {isBookSelected && (
            <div className="mt-6">
              <button
                onClick={() => navigate(`/scripture/${type}`)}
                className="text-sm text-primary hover:underline"
              >
                 ← Back to {scripture.title} list
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
