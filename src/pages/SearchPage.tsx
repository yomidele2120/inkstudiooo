import { Helmet } from 'react-helmet';
import { useState } from 'react';
import { History, X } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { queryDetailUrl } from '@/lib/searchRoutes';
import LanguageSelector from '@/components/LanguageSelector';
import SearchHistoryPanel from '@/components/SearchHistoryPanel';
import { useSearchHistory, SearchHistoryItem } from '@/hooks/useSearchHistory';
import { useNavigate } from 'react-router-dom';

export default function SearchPage() {
  const [language, setLanguage] = useState(() => {
    return sessionStorage.getItem('su-search-lang') || 'en';
  });
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  const { history, isLoading: historyLoading } = useSearchHistory();

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    sessionStorage.setItem('su-search-lang', lang);
  };

  const handleHistorySelect = (item: SearchHistoryItem) => {
    navigate(queryDetailUrl(item.query, 'search', 'search', language));
    setShowHistory(false);
  };

  return (
    <>
      <Helmet>
        <title>Search Scripture — Scripture Unity AI</title>
        <meta name="description" content="Search across religious texts with AI powered relevance and comparative scripture context." />
      </Helmet>
      <div className="min-h-screen py-12 starfield">
        <div className="container max-w-3xl relative z-10">
          <div className="text-center mb-10">
            <span className="text-4xl mb-4 block gold-text">✦</span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              Scripture Search
            </h1>
            <p className="text-muted-foreground">
              Ask any question about scriptures across traditions
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 mb-5">
            <LanguageSelector value={language} onChange={handleLanguageChange} />
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              {showHistory ? <X className="h-4 w-4" /> : <History className="h-4 w-4" />}
              {showHistory ? 'Close' : 'Recent'}
            </button>
          </div>

          <SearchBar large language={language} />

          {showHistory && (
            <div className="mt-4 bg-card border border-border rounded-xl p-4 max-h-80 overflow-y-auto">
              <SearchHistoryPanel
                history={history}
                isLoading={historyLoading}
                onSelect={handleHistorySelect}
              />
            </div>
          )}

          {/* Suggestion prompts */}
          <div className="mt-10">
            <p className="text-sm text-muted-foreground text-center mb-4">Try asking:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                'Is Jesus God?',
                'Genesis 1:1',
                'Quran Surah Al-Fatihah',
                'What is the Trinity?',
                'Compare mercy in Bible and Quran',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => navigate(queryDetailUrl(q, 'search', 'search', language))}
                  className="px-3 py-1.5 rounded-full text-sm bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
