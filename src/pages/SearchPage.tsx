import { Helmet } from 'react-helmet';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { History, X } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import AIResponse from '@/components/AIResponse';
import LanguageSelector from '@/components/LanguageSelector';
import SearchHistoryPanel from '@/components/SearchHistoryPanel';
import { useAIStream } from '@/hooks/useAIStream';
import { useSearchHistory, SearchHistoryItem } from '@/hooks/useSearchHistory';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [language, setLanguage] = useState('en');
  const [showHistory, setShowHistory] = useState(false);
  const lastQueryRef = useRef('');

  const { history, isLoading: historyLoading, saveSearch } = useSearchHistory();

  const handleComplete = useCallback((fullText: string) => {
    if (lastQueryRef.current && fullText) {
      saveSearch(lastQueryRef.current, fullText);
    }
  }, [saveSearch]);

  const { response, isLoading, error, query: aiQuery, setManualResponse } = useAIStream({
    onComplete: handleComplete,
  });

  useEffect(() => {
    if (query && query !== lastQueryRef.current) {
      lastQueryRef.current = query;
      aiQuery({ query, mode: 'search', language });
    }
  }, [query, language]);

  const handleHistorySelect = (item: SearchHistoryItem) => {
    lastQueryRef.current = '';
    setManualResponse(item.response);
    setShowHistory(false);
  };

  return (
    <>
      <Helmet>
        <title>Search Scripture — Scripture Unity AI</title>
        <meta name="description" content="Search across religious texts with AI powered relevance and comparative scripture context." />
      </Helmet>
      <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-6 text-center">
          Scripture Search
        </h1>

        <div className="flex items-center justify-between gap-4 mb-4">
          <LanguageSelector value={language} onChange={setLanguage} />
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-accent/20 transition-colors"
          >
            {showHistory ? <X className="h-4 w-4" /> : <History className="h-4 w-4" />}
            {showHistory ? 'Close' : 'Recent'}
          </button>
        </div>

        <SearchBar large />

        {showHistory && (
          <div className="mt-4 bg-card border border-border rounded-lg p-4 max-h-80 overflow-y-auto">
            <SearchHistoryPanel
              history={history}
              isLoading={historyLoading}
              onSelect={handleHistorySelect}
            />
          </div>
        )}

        <div className="mt-8">
          <AIResponse
            content={response}
            isLoading={isLoading}
            error={error}
            placeholder={!query ? 'Enter a question or topic to search across religious traditions — "Is Jesus God?", "Genesis 1:1", "Quran Surah Al-Fatihah"' : undefined}
          />
        </div>
      </div>
    </div>
  </>
  );
}
