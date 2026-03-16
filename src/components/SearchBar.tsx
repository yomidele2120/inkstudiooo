import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { queryDetailUrl } from '@/lib/searchRoutes';

interface SearchBarProps {
  large?: boolean;
  language?: string;
}

export default function SearchBar({ large = false, language }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const lang = language || sessionStorage.getItem('su-search-lang') || 'en';
      navigate(queryDetailUrl(query.trim(), 'search', 'search', lang));
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className={`relative ${large ? 'max-w-2xl mx-auto' : ''}`}>
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground ${large ? 'h-5 w-5' : 'h-4 w-4'}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search scriptures across traditions..."
          className={`w-full bg-card border border-border rounded-xl pl-11 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all ${
            large ? 'py-4 text-base' : 'py-2.5 text-sm'
          }`}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
