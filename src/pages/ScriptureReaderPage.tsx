import { Helmet } from 'react-helmet';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Scripture structure data
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

const quranSurahs = Array.from({ length: 114 }, (_, i) => `Surah ${i + 1}`);

const ethiopianBooks = [
  '1 Enoch', '2 Enoch', 'Jubilees', '1 Meqabyan', '2 Meqabyan', '3 Meqabyan',
  'Sirach', 'Wisdom of Solomon', 'Tobit', 'Judith', 'Baruch',
  '1 Esdras', '2 Esdras', 'Prayer of Manasseh',
];

const scriptureTypes: Record<string, { title: string; books: string[]; color: string }> = {
  bible: { title: 'The Holy Bible', books: bibleBooks, color: 'scripture-bible' },
  quran: { title: 'The Holy Quran', books: quranSurahs, color: 'scripture-quran' },
  other: { title: 'Ethiopian & Other Scriptures', books: ethiopianBooks, color: 'scripture-ethiopian' },
};

export default function ScriptureReaderPage() {
  const { type } = useParams<{ type: string }>();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);

  const scripture = type ? scriptureTypes[type] : null;

  if (!scripture) {
    return (
      <div className="min-h-screen py-16 text-center">
        <p className="text-muted-foreground">Scripture type not found.</p>
        <Link to="/" className="text-primary mt-4 inline-block">← Return Home</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{scripture.title} — Scripture Unity AI</title>
        <meta name="description" content={`Read ${scripture.title} with full chapters and verses.`} />
      </Helmet>
      <div className="min-h-screen py-8">
        <div className="container max-w-4xl">
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
              {scripture.title}
            </h1>
            <p className="text-muted-foreground mt-2">
              Select a book to begin reading
            </p>
          </div>

          {selectedBook ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button
                onClick={() => setSelectedBook(null)}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
              >
                <ArrowLeft className="h-4 w-4" /> All Books
              </button>
              <div className="bg-card border border-border rounded-xl p-6 md:p-10">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">{selectedBook}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Full scripture reading for <strong>{selectedBook}</strong> will be loaded from the database.
                  This feature connects to your scripture database to display the complete text with
                  proper chapter and verse formatting.
                </p>
                <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground italic">
                    📖 Scripture content is loaded from the database. Import scripture data via the
                    admin panel to populate this reader with full text.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {scripture.books.map((book, i) => (
                <motion.button
                  key={book}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.5) }}
                  onClick={() => setSelectedBook(book)}
                  className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:glow-border transition-all text-left group"
                >
                  <span className="font-heading text-foreground font-medium">{book}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
