import { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAIStream } from '@/hooks/useAIStream';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ChunkExplanationProps {
  type: string;
  book: string;
  chapter: number | null;
  startVerse: number;
  endVerse: number;
}

export default function ChunkExplanation({ type, book, chapter, startVerse, endVerse }: ChunkExplanationProps) {
  const [open, setOpen] = useState(false);
  const [fetched, setFetched] = useState(false);
  const { response, isLoading, error, query } = useAIStream();

  const handleToggle = useCallback(() => {
    if (!fetched) {
      setFetched(true);
      const ref = type === 'quran'
        ? `${book} ayahs ${startVerse}–${endVerse}`
        : `${book} Chapter ${chapter}, verses ${startVerse}–${endVerse}`;
      const scripture = type === 'quran' ? 'Quran' : type === 'bible' ? 'Bible' : 'Ethiopian Scripture';
      query({
        query: `Provide a concise spiritual and scholarly explanation for ${ref} from the ${scripture}. Cover themes, context, and key takeaways. Keep it focused and insightful.`,
        mode: 'scripture',
        language: 'en',
      });
    }
    setOpen((prev) => !prev);
  }, [fetched, type, book, chapter, startVerse, endVerse, query]);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          onClick={handleToggle}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-accent/50 hover:bg-accent text-accent-foreground text-sm font-medium transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span>
            {open ? 'Hide' : 'View'} Explanation for Verses {startVerse}–{endVerse}
          </span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-3 p-4 rounded-lg border border-border bg-muted/30 text-sm leading-relaxed">
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating explanation…
            </div>
          )}
          {error && <p className="text-destructive">Error: {error}</p>}
          {!isLoading && response && (
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          )}
          {!isLoading && !error && !response && (
            <p className="text-muted-foreground">Loading…</p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
