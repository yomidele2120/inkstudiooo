import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import VerseBlock, { VerseItem } from './VerseBlock';
import ChunkExplanation from './ChunkExplanation';

interface ChapterViewerProps {
  type: string;
  book: string;
  chapter: number | null;
  allVerses: VerseItem[];
  fontSize: number;
}

function getChunkSize() {
  if (typeof window === 'undefined') return 10;
  const vh = window.innerHeight;
  if (vh > 900) return 15;
  if (vh > 600) return 10;
  return 7;
}

export default function ChapterViewer({ type, book, chapter, allVerses, fontSize }: ChapterViewerProps) {
  const chunkSize = useMemo(() => getChunkSize(), []);
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
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <Progress value={progress} className="h-2 flex-1" />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {Math.min(visibleCount, totalVerses)}/{totalVerses} verses
        </span>
      </div>

      {/* Chunked verse display with per-chunk explanations */}
      {chunks.map((chunk, idx) => (
        <div key={`chunk-${idx}`} className="space-y-4">
          <VerseBlock verses={chunk.verses} type={type} fontSize={fontSize} />
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
            View More Verses
          </button>
        </div>
      )}

      {!hasMore && totalVerses > 0 && (
        <p className="text-center text-xs text-muted-foreground py-2">
          — End of chapter —
        </p>
      )}
    </div>
  );
}
