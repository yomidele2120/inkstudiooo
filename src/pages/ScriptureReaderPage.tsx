import { Helmet } from 'react-helmet';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ChapterViewer from '@/components/scripture/ChapterViewer';
import type { VerseItem } from '@/components/scripture/VerseBlock';
import { sampleQuranVerses, sampleBibleVerses, sampleEthiopianVerses } from '@/data/mockScriptures';

// ─── Static Data ────────────────────────────────────────────
const bibleBooks = [
  'Genesis','Exodus','Leviticus','Numbers','Deuteronomy',
  'Joshua','Judges','Ruth','1 Samuel','2 Samuel',
  '1 Kings','2 Kings','1 Chronicles','2 Chronicles',
  'Ezra','Nehemiah','Esther','Job','Psalms','Proverbs',
  'Ecclesiastes','Song of Solomon','Isaiah','Jeremiah',
  'Lamentations','Ezekiel','Daniel','Hosea','Joel',
  'Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk',
  'Zephaniah','Haggai','Zechariah','Malachi',
  'Matthew','Mark','Luke','John','Acts',
  'Romans','1 Corinthians','2 Corinthians','Galatians',
  'Ephesians','Philippians','Colossians',
  '1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy',
  'Titus','Philemon','Hebrews','James',
  '1 Peter','2 Peter','1 John','2 John','3 John',
  'Jude','Revelation',
];

const bibleChapterCounts: Record<string, number> = {
  Genesis:50,Exodus:40,Leviticus:27,Numbers:36,Deuteronomy:34,
  Joshua:24,Judges:21,Ruth:4,'1 Samuel':31,'2 Samuel':24,
  '1 Kings':22,'2 Kings':25,'1 Chronicles':29,'2 Chronicles':36,
  Ezra:10,Nehemiah:13,Esther:10,Job:42,Psalms:150,Proverbs:31,
  Ecclesiastes:12,'Song of Solomon':8,Isaiah:66,Jeremiah:52,
  Lamentations:5,Ezekiel:48,Daniel:12,Hosea:14,Joel:3,
  Amos:9,Obadiah:1,Jonah:4,Micah:7,Nahum:3,Habakkuk:3,
  Zephaniah:3,Haggai:2,Zechariah:14,Malachi:4,
  Matthew:28,Mark:16,Luke:24,John:21,Acts:28,
  Romans:16,'1 Corinthians':16,'2 Corinthians':13,Galatians:6,
  Ephesians:6,Philippians:4,Colossians:4,'1 Thessalonians':5,
  '2 Thessalonians':3,'1 Timothy':6,'2 Timothy':4,
  Titus:3,Philemon:1,Hebrews:13,James:5,
  '1 Peter':5,'2 Peter':3,'1 John':5,'2 John':1,'3 John':1,
  Jude:1,Revelation:22,
};

const ethiopianBooks = [
  '1 Enoch','2 Enoch','Jubilees','1 Meqabyan','2 Meqabyan','3 Meqabyan',
  'Sirach','Wisdom of Solomon','Tobit','Judith','Baruch',
  '1 Esdras','2 Esdras','Prayer of Manasseh',
];

const ethiopianChapterCounts: Record<string, number> = {
  '1 Enoch':108,'2 Enoch':100,Jubilees:50,'1 Meqabyan':36,
  '2 Meqabyan':24,'3 Meqabyan':32,Sirach:51,'Wisdom of Solomon':19,
  Tobit:14,Judith:16,Baruch:6,'1 Esdras':9,'2 Esdras':16,
  'Prayer of Manasseh':1,
};

const quranSurahs = Array.from({ length: 114 }, (_, i) => `Surah ${i + 1}`);

const scriptureTypes: Record<string, { title: string; books: string[]; color: string }> = {
  bible: { title: 'The Holy Bible', books: bibleBooks, color: 'scripture-bible' },
  quran: { title: 'The Holy Quran', books: quranSurahs, color: 'scripture-quran' },
  other: { title: 'Ethiopian & Other Scriptures', books: ethiopianBooks, color: 'scripture-ethiopian' },
};

function getBookChapterCount(type: string | undefined, book: string): number {
  if (type === 'bible') return bibleChapterCounts[book] || 1;
  if (type === 'other') return ethiopianChapterCounts[book] || 1;
  return 1;
}

function getChapterVerses(type: string | undefined, book: string, chapter?: number): VerseItem[] {
  if (type === 'quran') {
    const surahNumber = Number(book.replace(/\D/g, '').trim()) || null;
    if (!surahNumber) return [];
    return sampleQuranVerses
      .filter((v) => v.surah === surahNumber)
      .sort((a, b) => a.ayah - b.ayah)
      .map((v) => ({ ayah: v.ayah, arabicText: v.arabicText, englishText: v.englishText }));
  }
  if (type === 'bible') {
    const ch = Number(chapter);
    return sampleBibleVerses
      .filter((v) => v.book === book && v.chapter === ch)
      .sort((a, b) => a.verse - b.verse)
      .map((v) => ({ verse: v.verse, text: v.text }));
  }
  const ch = Number(chapter);
  return sampleEthiopianVerses
    .filter((v) => v.book === book && v.chapter === ch)
    .sort((a, b) => a.verse - b.verse)
    .map((v) => ({ verse: v.verse, text: v.text }));
}

// ─── Page Component ─────────────────────────────────────────
export default function ScriptureReaderPage() {
  const { type, bookSlug, chapter } = useParams<{ type: string; bookSlug?: string; chapter?: string }>();
  const navigate = useNavigate();

  const scripture = type ? scriptureTypes[type] : null;
  const selectedBook = useMemo(() => (bookSlug ? decodeURIComponent(bookSlug) : null), [bookSlug]);
  const selectedChapter = chapter && !Number.isNaN(Number(chapter)) ? Number(chapter) : null;

  const [fontSize, setFontSize] = useState(18);

  useEffect(() => {
    const saved = localStorage.getItem('su-scripture-font-size');
    if (saved) { const n = Number(saved); if (!Number.isNaN(n)) setFontSize(n); }
  }, []);
  useEffect(() => { localStorage.setItem('su-scripture-font-size', String(fontSize)); }, [fontSize]);

  const isBookSelected = Boolean(selectedBook);
  const isChapterSelected = Boolean(selectedChapter) || type === 'quran';
  const chapterCount = type === 'quran' ? 114 : (selectedBook ? getBookChapterCount(type, selectedBook) : 0);
  const isSectionForReading = isBookSelected && isChapterSelected;

  const allVerses = useMemo(() => {
    if (!isSectionForReading || !selectedBook) return [];
    return getChapterVerses(type, selectedBook, selectedChapter || 1);
  }, [isSectionForReading, type, selectedBook, selectedChapter]);

  if (!scripture) {
    return (
      <div className="min-h-screen py-16 text-center">
        <p className="text-muted-foreground">Scripture type not found.</p>
        <Link to="/" className="text-primary mt-4 inline-block">Return Home</Link>
      </div>
    );
  }

  const pageTitle = isSectionForReading
    ? type === 'quran' ? `${selectedBook}` : `${selectedBook} Chapter ${selectedChapter}`
    : scripture.title;

  // Breadcrumb parts
  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: scripture.title, to: `/scripture/${type}` },
    ...(selectedBook ? [{ label: selectedBook, to: `/scripture/${type}/${encodeURIComponent(selectedBook)}` }] : []),
    ...(selectedChapter && type !== 'quran' ? [{ label: `Chapter ${selectedChapter}`, to: '' }] : []),
  ];

  return (
    <>
      <Helmet>
        <title>{pageTitle} — Scripture Unity AI</title>
        <meta name="description" content={`Read ${pageTitle} on Scripture Unity AI.`} />
      </Helmet>

      <div className="min-h-screen py-8">
        <div className="container max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8 flex-wrap">
            {breadcrumbs.map((bc, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                {bc.to ? (
                  <Link to={bc.to} className="hover:text-foreground transition-colors">{bc.label}</Link>
                ) : (
                  <span className="text-foreground font-medium">{bc.label}</span>
                )}
              </span>
            ))}
          </nav>

          {/* Header */}
          <div className="text-center mb-10">
            <BookOpen className="h-10 w-10 text-primary mx-auto mb-3" />
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{pageTitle}</h1>
            {isSectionForReading && (
              <p className="text-muted-foreground mt-2 text-sm">
                Read, scroll, and explore verse explanations below.
              </p>
            )}
          </div>

          {/* Book list */}
          {!isBookSelected && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {scripture.books.map((book, i) => (
                <motion.button
                  key={book}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.5) }}
                  onClick={() => navigate(`/scripture/${type}/${encodeURIComponent(book)}`)}
                  className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-all text-left"
                >
                  <span className="font-heading text-foreground font-medium">{book}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </motion.button>
              ))}
            </div>
          )}

          {/* Chapter selector (Bible/Ethiopian) */}
          {isBookSelected && type !== 'quran' && !selectedChapter && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-4">Select Chapter</h2>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {Array.from({ length: chapterCount }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => navigate(`/scripture/${type}/${encodeURIComponent(selectedBook!)}/${num}`)}
                    className="rounded-lg px-2 py-2 text-sm bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chapter reading view */}
          {isSectionForReading && (
            <div className="bg-card border border-border rounded-xl p-6">
              {/* Navigation controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (type === 'quran') {
                        const cur = Number(selectedBook?.replace(/\D/g, '')) || 0;
                        if (cur > 1) navigate(`/scripture/${type}/Surah%20${cur - 1}`);
                      } else if (selectedChapter && selectedChapter > 1) {
                        navigate(`/scripture/${type}/${encodeURIComponent(selectedBook!)}/${selectedChapter - 1}`);
                      }
                    }}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent transition-colors"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => {
                      if (type === 'quran') {
                        const cur = Number(selectedBook?.replace(/\D/g, '')) || 0;
                        if (cur < 114) navigate(`/scripture/${type}/Surah%20${cur + 1}`);
                      } else if (selectedChapter && selectedChapter < chapterCount) {
                        navigate(`/scripture/${type}/${encodeURIComponent(selectedBook!)}/${selectedChapter + 1}`);
                      }
                    }}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent transition-colors"
                  >
                    Next →
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFontSize((p) => Math.max(14, p - 2))}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent transition-colors"
                  >
                    A−
                  </button>
                  <span className="text-xs text-muted-foreground">{fontSize}px</span>
                  <button
                    onClick={() => setFontSize((p) => Math.min(28, p + 2))}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent transition-colors"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* Chapter viewer with chunked display */}
              <ChapterViewer
                type={type!}
                book={selectedBook!}
                chapter={selectedChapter}
                allVerses={allVerses}
                fontSize={fontSize}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
