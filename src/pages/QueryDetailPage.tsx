import { Helmet } from 'react-helmet';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AIResponse from '@/components/AIResponse';
import { useAIStream } from '@/hooks/useAIStream';
import { parseQueryId, queryDetailUrl, toSearchResultsUrl } from '@/lib/searchRoutes';

export default function QueryDetailPage() {
  const { queryId } = useParams();
  const navigate = useNavigate();
  const { response, isLoading, error, query: aiQuery } = useAIStream();
  const queryData = parseQueryId(queryId);
  const lastQueryRef = useRef('');
  const [activeRole, setActiveRole] = useState<'General' | 'Student' | 'Scholar' | 'Interfaith'>('General');

  const roleSuggestions: Record<string, string[]> = {
    General: ['Compare mercy in Bible and Quran', 'What is Trinity?', 'Debate question: Is Jesus God?'],
    Student: ['How to cite Matthew 5 in class', 'Understanding redemption', 'Quick summary of the Ten Commandments'],
    Scholar: ['Intertextual analysis of Genesis and Quran', 'Historical debate on resurrection accounts', 'Comparative theology on Allah/Jehovah'],
    Interfaith: ['Building mutual respect in religious dialogue', 'Common faith statements across Abrahamic religions', 'How to moderate interfaith debate'],
  };

  useEffect(() => {
    if (!queryData?.query) return;
    if (lastQueryRef.current === queryData.query) return;

    lastQueryRef.current = queryData.query;
    aiQuery({ query: queryData.query, mode: queryData.mode, language: queryData.language });
  }, [aiQuery, queryData]);

  if (!queryData) {
    return (
      <div className="min-h-screen py-8">
        <div className="container max-w-4xl">
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </div>
          <h1 className="text-2xl font-bold mb-4">Invalid query identifier</h1>
          <p className="text-muted-foreground">The query ID is not valid. Please return to Search Results.</p>
          <Link to="/results" className="mt-4 inline-block text-primary hover:underline">Go to Search Results</Link>
        </div>
      </div>
    );
  }

  const { query, source, mode, language } = queryData;
  const backToResults = toSearchResultsUrl(query, mode, source, language);

  return (
    <>
      <Helmet>
        <title>{query ? `${query} — Scripture Unity AI` : 'Query Detail'}</title>
        <meta name="description" content={`Detailed page for query ${query}`} />
      </Helmet>
      <div className="min-h-screen py-8">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <Link
              to={backToResults}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to search results
            </Link>
          </div>

          <div className="mb-5">
            <p className="text-sm text-muted-foreground">Source: <strong>{source}</strong> | Mode: <strong>{mode}</strong></p>
            <h1 className="text-3xl font-semibold text-foreground">{query}</h1>
            <p className="text-sm text-muted-foreground">Full-page view for bookmarking and sharing.</p>
          </div>

          <section className="mb-6 rounded-lg border border-border bg-card p-4">
            <h2 className="font-semibold text-sm mb-2">Role-based suggestions</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {(['General', 'Student', 'Scholar', 'Interfaith'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${activeRole === role ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent/20'}`}
                >
                  {role}
                </button>
              ))}
            </div>
            <div className="space-y-1">
              {roleSuggestions[activeRole].map((s) => (
                <button
                  key={s}
                  onClick={() => navigate(queryDetailUrl(s, 'search', source, language))}
                  className="block text-left text-sm text-foreground/80 hover:text-foreground hover:underline"
                >
                  • {s}
                </button>
              ))}
            </div>
          </section>

          <AIResponse
            content={response}
            isLoading={isLoading}
            error={error}
            placeholder="Loading full query content..."
          />

          <div className="mt-6 rounded-lg border border-border bg-card p-4">
            <h2 className="font-semibold text-lg text-foreground mb-2">Related content</h2>
            <p className="text-sm text-muted-foreground" >
              This page fetches content dynamically from the AI backend using the query identifier.
              You can bookmark and share this URL directly.
            </p>
            <ul className="mt-3 list-disc list-inside text-sm text-foreground/90">
              <li>Query: {query}</li>
              <li>Mode: {mode}</li>
              <li>Source: {source}</li>
              <li>Language: {language}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
