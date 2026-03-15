import { History, Clock, ChevronRight } from 'lucide-react';
import { SearchHistoryItem } from '@/hooks/useSearchHistory';

interface SearchHistoryPanelProps {
  history: SearchHistoryItem[];
  isLoading: boolean;
  onSelect: (item: SearchHistoryItem) => void;
}

export default function SearchHistoryPanel({ history, isLoading, onSelect }: SearchHistoryPanelProps) {
  if (isLoading) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground">
        Loading history...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-6">
        <History className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No recent searches yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-2">
        Recent Searches
      </h3>
      {history.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm hover:bg-secondary transition-colors group"
        >
          <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="truncate text-foreground/80 group-hover:text-foreground flex-1">
            {item.query}
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
    </div>
  );
}
