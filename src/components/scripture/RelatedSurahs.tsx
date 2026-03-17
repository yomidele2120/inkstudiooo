import { useState, useCallback } from 'react';
import { Loader2, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAIStream } from '@/hooks/useAIStream';

interface RelatedSurahsProps {
  type: string;
  book: string;
  chapter: number | null;
}

export default function RelatedSurahs({ type, book, chapter }: RelatedSurahsProps) {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<{ name: string; reason: string; link: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const generateRelated = useCallback(async () => {
    if (fetched) return;
    setLoading(true);
    setFetched(true);
    try {
      const scripture = type === 'quran' ? 'Quran' : type === 'bible' ? 'Bible' : 'Ethiopian Scripture';
      const ref = type === 'quran' ? book : `${book} Chapter ${chapter}`;
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/religious-ai`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          query: `For ${ref} from the ${scripture}, suggest exactly 3 related chapters/surahs that share similar themes. For each, provide the name and a one-sentence reason. Format EXACTLY as: "NAME|REASON" on each line, nothing else.`,
          mode: 'scripture',
          language: 'en',
        }),
      });
      if (!resp.ok || !resp.body) throw new Error('Failed');
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') break;
          try {
            const p = JSON.parse(json);
            const c = p.choices?.[0]?.delta?.content;
            if (c) fullText += c;
          } catch { /* partial */ }
        }
      }
      const lines = fullText.split('\n').filter((l) => l.includes('|'));
      const parsed = lines.slice(0, 3).map((l) => {
        const [name, reason] = l.replace(/^[\d\.\-\*\s]+/, '').split('|').map((s) => s.trim());
        return { name: name || 'Related Chapter', reason: reason || 'Shares similar themes', link: '#' };
      });
      setSuggestions(parsed);
    } catch {
      setSuggestions([
        { name: 'Surah Al-Fatiha', reason: 'Foundation of Quranic themes', link: '#' },
        { name: 'Surah Al-Baqarah', reason: 'Comprehensive guidance', link: '#' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [type, book, chapter, fetched]);

  return (
    <div className="bg-card border border-border rounded-xl p-5 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Related {type === 'quran' ? 'Surahs' : 'Chapters'}
        </h3>
        {!fetched && (
          <button
            onClick={generateRelated}
            className="text-xs text-primary hover:underline"
          >
            Generate suggestions
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          Finding related content…
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group"
              onClick={() => {/* Could navigate to the suggested chapter */}}
            >
              <div>
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.reason}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          ))}
        </div>
      )}

      {!loading && !fetched && (
        <p className="text-sm text-muted-foreground">
          Click "Generate suggestions" to discover thematically related content.
        </p>
      )}
    </div>
  );
}
