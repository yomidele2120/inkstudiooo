import { Helmet } from 'react-helmet';
import { useEffect, useCallback, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import AIResponse from '@/components/AIResponse';
import { useAIStream } from '@/hooks/useAIStream';
import { useSearchHistory } from '@/hooks/useSearchHistory';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const langParam = searchParams.get('lang') || sessionStorage.getItem('su-search-lang') || 'en';
  const cached = searchParams.get('cached');
  const lastQueryRef = useRef('');
  const [language] = useState(langParam);

  const { saveSearch } = useSearchHistory();

  const handleComplete = useCallback((fullText: string) => {
    if (lastQueryRef.current && fullText) {
      saveSearch(lastQueryRef.current, fullText);
    }
  }, [saveSearch]);

  const { response, isLoading, error, query: aiQuery, setManualResponse } = useAIStream({
    onComplete: handleComplete,
  });

  useEffect(() => {
    if (!query) return;
    if (query === lastQueryRef.current) return;
    lastQueryRef.current = query;

    if (cached) {
      // If cached, response was from history — don't re-query
      return;
    }

    aiQuery({ query, mode: 'search', language });
  }, [query, language, cached, aiQuery]);

  return (
    <>
      <Helmet>
        <title>{query ? `${query} — Scripture Unity AI` : 'Search Results'}</title>
        <meta name="description" content="AI-powered scripture search results with comparative insights." />
      </Helmet>
      <div className="min-h-screen py-8">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <Link
              to="/search"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Search
            </Link>
          </div>

          {/* New search from results page — uses same language */}
          <div className="mb-8">
            <SearchBar large language={language} />
          </div>

          {query && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Results for: <span className="text-foreground font-medium">"{query}"</span>
              </p>
            </div>
          )}

          <AIResponse
            content={response}
            isLoading={isLoading}
            error={error}
            placeholder={!query ? 'Enter a question to search across religious traditions.' : undefined}
          />
        </div>
      </div>
    </>
  );
}
