import { useState, useCallback } from 'react';
import { Loader2, Sparkles, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAIStream } from '@/hooks/useAIStream';

interface AIDescriptorsProps {
  type: string;
  verseRef: string;
  verseText: string;
}

export default function AIDescriptors({ type, verseRef, verseText }: AIDescriptorsProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { response: tagExplanation, isLoading: tagLoading, query: queryTag } = useAIStream();

  const generateDescriptors = useCallback(async () => {
    setGenerating(true);
    setTags([]);
    setSelectedTag(null);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/religious-ai`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          query: `For this verse from the ${type === 'quran' ? 'Quran' : 'Bible'}: "${verseText}" (${verseRef}), generate EXACTLY 5-7 single-word or short-phrase descriptors representing key themes, concepts, or lessons. Return ONLY a comma-separated list, nothing else. Example: "Mercy, Divine Justice, Faith, Patience, Gratitude"`,
          mode: 'scripture',
          language: 'en',
        }),
      });
      if (!resp.ok) throw new Error('Failed');
      const reader = resp.body?.getReader();
      if (!reader) throw new Error('No body');
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
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) fullText += c;
          } catch { /* partial */ }
        }
      }
      const parsed = fullText
        .replace(/[*#\n]/g, '')
        .split(',')
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0 && t.length < 40);
      setTags(parsed.length > 0 ? parsed : ['Faith', 'Guidance', 'Mercy']);
    } catch {
      setTags(['Faith', 'Guidance', 'Mercy', 'Wisdom', 'Devotion']);
    } finally {
      setGenerating(false);
    }
  }, [type, verseRef, verseText]);

  const handleTagClick = useCallback((tag: string) => {
    setSelectedTag(tag);
    const scripture = type === 'quran' ? 'Quran' : type === 'bible' ? 'Bible' : 'Scripture';
    queryTag({
      query: `Explain the concept of "${tag}" as it relates to ${verseRef} from the ${scripture}: "${verseText}". Include related verses from other scriptures and provide a brief spiritual reflection. Keep it concise (3-4 paragraphs).`,
      mode: 'scripture',
      language: 'en',
    });
  }, [type, verseRef, verseText, queryTag]);

  return (
    <div className="mt-2">
      {tags.length === 0 && !generating && (
        <button
          onClick={generateDescriptors}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <Sparkles className="h-3 w-3" />
          Generate Descriptors
        </button>
      )}

      {generating && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Generating descriptors…
        </div>
      )}

      {tags.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-primary/20 hover:text-primary'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {selectedTag && (
            <div className="relative p-3 rounded-lg border border-border bg-muted/30 text-sm">
              <button
                onClick={() => setSelectedTag(null)}
                className="absolute top-2 right-2 p-1 rounded-md hover:bg-accent/40 text-muted-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <p className="text-xs font-medium text-primary mb-2">"{selectedTag}" — {verseRef}</p>
              {tagLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Generating insight…
                </div>
              ) : tagExplanation ? (
                <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
                  <ReactMarkdown>{tagExplanation}</ReactMarkdown>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
