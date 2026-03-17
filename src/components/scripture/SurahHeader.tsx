import { BookOpen, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SurahHeaderProps {
  type: string;
  book: string;
  chapter: number | null;
  totalVerses: number;
  chapterCount: number;
}

const SURAH_NAMES: Record<number, { arabic: string; english: string; meaning: string }> = {
  1: { arabic: 'الفاتحة', english: 'Al-Fatiha', meaning: 'The Opening' },
  2: { arabic: 'البقرة', english: 'Al-Baqarah', meaning: 'The Cow' },
  3: { arabic: 'آل عمران', english: 'Ali \'Imran', meaning: 'Family of Imran' },
  4: { arabic: 'النساء', english: 'An-Nisa', meaning: 'The Women' },
  5: { arabic: 'المائدة', english: 'Al-Ma\'idah', meaning: 'The Table Spread' },
  36: { arabic: 'يس', english: 'Ya-Sin', meaning: 'Ya Sin' },
  55: { arabic: 'الرحمن', english: 'Ar-Rahman', meaning: 'The Most Merciful' },
  67: { arabic: 'الملك', english: 'Al-Mulk', meaning: 'The Sovereignty' },
  112: { arabic: 'الإخلاص', english: 'Al-Ikhlas', meaning: 'The Sincerity' },
  113: { arabic: 'الفلق', english: 'Al-Falaq', meaning: 'The Daybreak' },
  114: { arabic: 'الناس', english: 'An-Nas', meaning: 'Mankind' },
};

export default function SurahHeader({ type, book, chapter, totalVerses, chapterCount }: SurahHeaderProps) {
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(() => {
    const key = type === 'quran' ? book : `${book}-${chapter}`;
    const saved = localStorage.getItem('su-chapter-bookmarks');
    try { return saved ? JSON.parse(saved).includes(key) : false; } catch { return false; }
  });

  const surahNum = type === 'quran' ? Number(book.replace(/\D/g, '')) || 0 : 0;
  const surahInfo = SURAH_NAMES[surahNum];

  const handleBookmark = useCallback(() => {
    const key = type === 'quran' ? book : `${book}-${chapter}`;
    const saved = localStorage.getItem('su-chapter-bookmarks');
    let list: string[] = [];
    try { list = saved ? JSON.parse(saved) : []; } catch { /* */ }
    if (list.includes(key)) {
      list = list.filter((b) => b !== key);
      setBookmarked(false);
      toast.info('Bookmark removed');
    } else {
      list.push(key);
      setBookmarked(true);
      toast.success('Chapter bookmarked');
    }
    localStorage.setItem('su-chapter-bookmarks', JSON.stringify(list));
  }, [type, book, chapter]);

  const goPrev = () => {
    if (type === 'quran') {
      if (surahNum > 1) navigate(`/scripture/quran/Surah%20${surahNum - 1}`);
    } else if (chapter && chapter > 1) {
      navigate(`/scripture/${type}/${encodeURIComponent(book)}/${chapter - 1}`);
    }
  };

  const goNext = () => {
    if (type === 'quran') {
      if (surahNum < 114) navigate(`/scripture/quran/Surah%20${surahNum + 1}`);
    } else if (chapter && chapter < chapterCount) {
      navigate(`/scripture/${type}/${encodeURIComponent(book)}/${chapter + 1}`);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
      {/* Decorative top bar */}
      <div className="h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
      
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {type === 'quran' && surahInfo ? (
              <>
                <p className="font-arabic text-2xl text-primary font-bold mb-1" dir="rtl">
                  {surahInfo.arabic}
                </p>
                <h2 className="font-heading text-xl font-bold text-foreground">
                  {surahInfo.english} <span className="text-muted-foreground font-normal text-base">— {surahInfo.meaning}</span>
                </h2>
              </>
            ) : type === 'quran' ? (
              <h2 className="font-heading text-xl font-bold text-foreground">{book}</h2>
            ) : (
              <h2 className="font-heading text-xl font-bold text-foreground">
                {book} <span className="text-muted-foreground font-normal text-base">— Chapter {chapter}</span>
              </h2>
            )}
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                {totalVerses} {type === 'quran' ? 'Ayahs' : 'Verses'}
              </span>
              {type === 'quran' && surahNum > 0 && (
                <span>Surah {surahNum} of 114</span>
              )}
            </div>
          </div>

          <button
            onClick={handleBookmark}
            className={`p-2.5 rounded-lg border transition-colors ${
              bookmarked
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-border hover:border-primary/30 text-muted-foreground hover:text-primary'
            }`}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark chapter'}
          >
            <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <button
            onClick={goPrev}
            disabled={type === 'quran' ? surahNum <= 1 : !chapter || chapter <= 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-border hover:bg-accent/30 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={goNext}
            disabled={type === 'quran' ? surahNum >= 114 : !chapter || chapter >= chapterCount}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-border hover:bg-accent/30 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
