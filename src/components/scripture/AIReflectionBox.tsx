import { useState, useCallback } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAIStream } from '@/hooks/useAIStream';

interface AIReflectionBoxProps {
  type: string;
  book: string;
  chapter: number | null;
}

export default function AIReflectionBox({ type, book, chapter }: AIReflectionBoxProps) {
  const [input, setInput] = useState('');
  const { response, isLoading, query } = useAIStream();

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const scripture = type === 'quran' ? 'Quran' : type === 'bible' ? 'Bible' : 'Ethiopian Scripture';
    const ref = type === 'quran' ? book : `${book} Chapter ${chapter}`;
    query({
      query: `The user is reading ${ref} from the ${scripture} and asks: "${input.trim()}". Provide a thoughtful, scholarly answer with scripture references.`,
      mode: 'scripture',
      language: 'en',
    });
  }, [input, isLoading, type, book, chapter, query]);

  return (
    <div className="bg-card border border-border rounded-xl p-5 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-heading text-lg font-semibold text-foreground">AI Reflection</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Ask any question about this chapter — get instant AI-powered scholarly insights.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about themes, context, meaning…"
          className="flex-1 px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>

      {response && (
        <div className="mt-4 p-4 rounded-lg border border-border bg-muted/30">
          <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
