import { useState } from 'react';
import { Search } from 'lucide-react';

interface JumpToVerseProps {
  totalVerses: number;
  type: string;
  onJump: (verseNum: number) => void;
}

export default function JumpToVerse({ totalVerses, type, onJump }: JumpToVerseProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(value, 10);
    if (num >= 1 && num <= totalVerses) {
      onJump(num);
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="number"
          min={1}
          max={totalVerses}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Jump to ${type === 'quran' ? 'ayah' : 'verse'} (1-${totalVerses})`}
          className="pl-8 pr-3 py-1.5 w-48 rounded-lg bg-secondary border border-border text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>
      <button
        type="submit"
        disabled={!value}
        className="px-3 py-1.5 rounded-lg text-xs bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors"
      >
        Go
      </button>
    </form>
  );
}
