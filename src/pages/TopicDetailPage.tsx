import { Helmet } from 'react-helmet';
import { useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AIResponse from '@/components/AIResponse';
import { useAIStream } from '@/hooks/useAIStream';

const relatedTopics = [
  'Mercy and Compassion',
  'Justice and Fairness',
  'Prayer across religions',
  'Prophets in Abrahamic scriptures',
  'Life after death comparisons',
];

export default function TopicDetailPage() {
  const { topicSlug } = useParams();
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source') || 'faith';
  const language = searchParams.get('lang') || 'en';

  const { response, isLoading, error, query: aiQuery } = useAIStream();
  const topic = topicSlug ? decodeURIComponent(topicSlug) : '';
  const query = topic;

  useEffect(() => {
    if (!topic) return;
    aiQuery({ query, mode: 'topic', language });
  }, [topic, query, language, aiQuery]);

  if (!topicSlug) {
    return (
      <div className="min-h-screen py-8">
        <div className="container max-w-4xl">
          <p className="text-red-500">Invalid topic URL. Please go back and select a topic.</p>
          <Link to="/understanding" className="text-primary hover:underline">Back to Understanding</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{topic ? `${topic} — Understanding Faith` : 'Topic Detail'}</title>
        <meta name="description" content={`Deep dive into ${topic} across faiths.`} />
      </Helmet>
      <div className="min-h-screen py-8">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <Link
              to={`/understanding?source=${source}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Understanding
            </Link>
          </div>

          <h1 className="text-3xl font-semibold text-foreground mb-2">{topic}</h1>
          <p className="text-sm text-muted-foreground mb-4">Source: {source} | lang: {language}</p>

          <AIResponse
            content={response}
            isLoading={isLoading}
            error={error}
            placeholder={`Loading analysis for “${topic}”...`}
          />

          <div className="mt-6 rounded-xl border border-border bg-card p-4">
            <h2 className="text-lg font-semibold mb-2">Related discussions</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-foreground/85">
              {relatedTopics.map((item) => (
                <li key={item}>
                  <Link
                    to={`/topic/${encodeURIComponent(item)}?source=${source}&lang=${language}`}
                    className="text-primary hover:underline"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card p-4">
            <h2 className="text-lg font-semibold mb-2">Further reading</h2>
            <p className="text-sm text-muted-foreground">
              Use the relation links above for comparisons and debates. Click any to open a dedicated topic URL for sharing/bookmarking.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
