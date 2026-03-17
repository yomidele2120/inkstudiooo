import { useState, useCallback } from 'react';
import { Bookmark, Copy, Share2, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';

interface VerseActionsProps {
  verseRef: string;
  verseText: string;
  onAskAI?: () => void;
}

export default function VerseActions({ verseRef, verseText, onAskAI }: VerseActionsProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(() => {
    const saved = localStorage.getItem('su-bookmarks');
    if (!saved) return false;
    try { return JSON.parse(saved).includes(verseRef); } catch { return false; }
  });

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(`${verseRef}\n${verseText}`);
    setCopied(true);
    toast.success('Verse copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }, [verseRef, verseText]);

  const handleBookmark = useCallback(() => {
    const saved = localStorage.getItem('su-bookmarks');
    let bookmarks: string[] = [];
    try { bookmarks = saved ? JSON.parse(saved) : []; } catch { /* */ }
    if (bookmarks.includes(verseRef)) {
      bookmarks = bookmarks.filter((b) => b !== verseRef);
      setBookmarked(false);
      toast.info('Bookmark removed');
    } else {
      bookmarks.push(verseRef);
      setBookmarked(true);
      toast.success('Verse bookmarked');
    }
    localStorage.setItem('su-bookmarks', JSON.stringify(bookmarks));
  }, [verseRef]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: verseRef, text: verseText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${verseRef}\n${verseText}`);
      toast.success('Verse copied for sharing');
    }
  }, [verseRef, verseText]);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-md hover:bg-accent/40 text-muted-foreground hover:text-foreground transition-colors"
        title="Copy verse"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <button
        onClick={handleShare}
        className="p-1.5 rounded-md hover:bg-accent/40 text-muted-foreground hover:text-foreground transition-colors"
        title="Share verse"
      >
        <Share2 className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={handleBookmark}
        className={`p-1.5 rounded-md hover:bg-accent/40 transition-colors ${bookmarked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        title={bookmarked ? 'Remove bookmark' : 'Bookmark verse'}
      >
        <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? 'fill-current' : ''}`} />
      </button>
      {onAskAI && (
        <button
          onClick={onAskAI}
          className="p-1.5 rounded-md hover:bg-accent/40 text-muted-foreground hover:text-primary transition-colors"
          title="Ask AI for reflection"
        >
          <Sparkles className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
