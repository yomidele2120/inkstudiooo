import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';
import { useFontSize } from '@/hooks/useFontSize';

interface AIResponseProps {
  content: string;
  isLoading: boolean;
  error: string | null;
  placeholder?: string;
}

export default function AIResponse({ content, isLoading, error, placeholder }: AIResponseProps) {
  const { fontSize, setFontSize } = useFontSize();

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-5 text-center">
        <p className="text-destructive font-medium">{error}</p>
        <p className="text-sm text-muted-foreground mt-1">Please try again.</p>
      </div>
    );
  }

  if (isLoading && !content) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-accent mb-3" />
        <p className="text-muted-foreground text-sm">Consulting religious knowledge...</p>
      </div>
    );
  }

  if (!content && placeholder) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{placeholder}</p>
      </div>
    );
  }

  if (!content) return null;

  const adjustFont = (amount: number) => {
    setFontSize((prev) => Math.min(28, Math.max(12, prev + amount)));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 md:p-8">
      <div className="mb-4 flex items-center justify-end gap-2">
        <button
          onClick={() => adjustFont(-2)}
          className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-secondary"
          aria-label="Decrease font size"
        >
          A-
        </button>
        <span className="inline-block px-2 text-xs text-foreground">{fontSize}px</span>
        <button
          onClick={() => adjustFont(2)}
          className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-secondary"
          aria-label="Increase font size"
        >
          A+
        </button>
      </div>
      <div className="prose prose-sm max-w-none
        prose-headings:font-heading prose-headings:text-foreground
        prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
        prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
        prose-p:text-foreground/90 prose-p:leading-relaxed
        prose-strong:text-foreground
        prose-blockquote:border-l-accent prose-blockquote:bg-accent/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-md prose-blockquote:text-foreground/80 prose-blockquote:not-italic
        prose-li:text-foreground/90
        prose-ul:my-2 prose-ol:my-2
        prose-a:text-accent
      " style={{ fontSize: `${fontSize}px` }}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      {isLoading && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
          <Loader2 className="h-3 w-3 animate-spin text-accent" />
          <span className="text-xs text-muted-foreground">Still generating...</span>
        </div>
      )}
      {!isLoading && content && (
        <AudioPlayer text={content} />
      )}
    </div>
  );
}
