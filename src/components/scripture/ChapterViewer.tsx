import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import VerseBlock, { VerseItem } from './VerseBlock';
import ChunkExplanation from './ChunkExplanation';
import JumpToVerse from './JumpToVerse';

interface ChapterViewerProps {
  type: string;
  book: string;
  chapter: number | null;
  allVerses: VerseItem[];
  fontSize: number;
}

const DEFAULT_CHUNK = 15;

export default function ChapterViewer({ type, book, chapter, allVerses, fontSize }: ChapterViewerProps) {
  const chunkSize = DEFAULT_CHUNK;
  const [visibleCount, setVisibleCount] = useState(chunkSize);
  const bottomRef = useRef<HTMLDivElement>(null);

  const totalVerses = allVerses.length;
  const displayedVerses = allVerses.slice(0, visibleCount);
  const hasMore = visibleCount < totalVerses;
  const progress = totalVerses > 0 ? Math.round((Math.min(visibleCount, totalVerses) / totalVerses) * 100) : 0;

  // Build chunks for explanation links
  const chunks = useMemo(() => {
    const result: { start: number; end: number; verses: VerseItem[] }[] = [];
    for (let i = 0; i < displayedVerses.length; i += chunkSize) {
      const slice = displayedVerses.slice(i, i + chunkSize);
      const first = 'ayah' in slice[0] ? (slice[0] as any).ayah : (slice[0] as any).verse;
      const last = 'ayah' in slice[slice.length - 1]
        ? (slice[slice.length - 1] as any).ayah
        : (slice[slice.length - 1] as any).verse;
      result.push({ start: first, end: last, verses: slice });
    }
    return result;
  }, [displayedVerses, chunkSize]);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + chunkSize, totalVerses));
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [chunkSize, totalVerses]);

  const handleJump = useCallback((verseNum: number) => {
    // Make sure enough verses are visible
    const neededCount = allVerses.findIndex((v) =>
      'ayah' in v ? v.ayah === verseNum : ('verse' in v ? (v as any).verse === verseNum : false)
    ) + 1;
    if (neededCount > visibleCount) {
      setVisibleCount(Math.min(neededCount + chunkSize, totalVerses));
    }
    setTimeout(() => {
      const el = document.getElementById(`verse-${verseNum}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.classList.add('ring-2', 'ring-primary/40', 'rounded-lg');
      setTimeout(() => el?.classList.remove('ring-2', 'ring-primary/40', 'rounded-lg'), 2000);
    }, 150);
  }, [allVerses, visibleCount, chunkSize, totalVerses]);

  // Reset when chapter/book changes
  useEffect(() => {
    setVisibleCount(chunkSize);
  }, [book, chapter, chunkSize]);

  if (totalVerses === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading verses…
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <JumpToVerse totalVerses={totalVerses} type={type} onJump={handleJump} />
        <div className="flex items-center gap-3 flex-1 justify-end">
          <Progress value={progress} className="h-2 w-32 sm:w-48" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {Math.min(visibleCount, totalVerses)}/{totalVerses}
          </span>
        </div>
      </div>

      {/* Chunked verse display with per-chunk explanations */}
      {chunks.map((chunk, idx) => (
        <div key={`chunk-${idx}`} className="space-y-4">
          <VerseBlock
            verses={chunk.verses}
            type={type}
            fontSize={fontSize}
            book={book}
            chapter={chapter}
          />
          <ChunkExplanation
            type={type}
            book={book}
            chapter={chapter}
            startVerse={chunk.start}
            endVerse={chunk.end}
          />
        </div>
      ))}

      {/* View More button */}
      {hasMore && (
        <div ref={bottomRef}>
          <button
            onClick={loadMore}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-border bg-card hover:bg-accent/30 text-foreground text-sm font-medium transition-colors"
          >
            <ChevronDown className="h-4 w-4" />
            View More Verses ({totalVerses - visibleCount} remaining)
          </button>
        </div>
      )}

      {!hasMore && totalVerses > 0 && (
        <p className="text-center text-xs text-muted-foreground py-2">
          — End of {type === 'quran' ? 'Surah' : 'chapter'} —
        </p>
      )}
    </div>
  );
}
