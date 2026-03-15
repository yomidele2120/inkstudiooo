import { Helmet } from 'react-helmet';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TopicCard from '@/components/TopicCard';
import AIResponse from '@/components/AIResponse';
import LanguageSelector from '@/components/LanguageSelector';
import { useAIStream } from '@/hooks/useAIStream';
import { topics } from '@/data/mockScriptures';

export default function TopicsPage() {
  const { topicId } = useParams();
  const [language, setLanguage] = useState('en');
  const { response, isLoading, error, query: aiQuery } = useAIStream();
  const [activeSubtopic, setActiveSubtopic] = useState<string | null>(null);

  if (topicId) {
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) return <div className="container py-16 text-center text-muted-foreground">Topic not found</div>;

    const handleTopicExplore = () => {
      setActiveSubtopic(null);
      aiQuery({ query: `${topic.name}: ${topic.description}`, mode: 'topic', language });
    };

    const handleSubtopicClick = (subName: string) => {
      setActiveSubtopic(subName);
      aiQuery({ query: `${subName} in the context of ${topic.name}`, mode: 'topic', language });
    };

    return (
      <>
        <Helmet>
          <title>Topic Details — Scripture Unity AI</title>
          <meta name="description" content="Explore religious topics with AI-driven context and comparative scripture insights." />
        </Helmet>
        <div className="min-h-screen py-8">
        <div className="container max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <Link to="/topics" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> All topics
            </Link>
            <LanguageSelector value={language} onChange={setLanguage} />
          </div>
          <div className="mb-6">
            <span className="text-3xl mb-2 block">{topic.icon}</span>
            <h1 className="font-heading text-3xl font-bold text-foreground">{topic.name}</h1>
            <p className="text-muted-foreground mt-2">{topic.description}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={handleTopicExplore}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !activeSubtopic && (response || isLoading)
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent/20'
              }`}
            >
              Overview
            </button>
            {topic.subtopics.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSubtopicClick(sub.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeSubtopic === sub.name
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent/20'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          <AIResponse
            content={response}
            isLoading={isLoading}
            error={error}
            placeholder="Click a topic above to explore it across Christianity, Islam, Judaism, and Ethiopian Orthodox traditions."
          />
        </div>
      </div>
    </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Topic Explorer — Scripture Unity AI</title>
        <meta name="description" content="Browse subjects across sacred texts and uncover shared themes with AI-powered insights." />
      </Helmet>
      <div className="min-h-screen py-8">
      <div className="container max-w-5xl">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2 text-center">Topic Explorer</h1>
        <p className="text-muted-foreground text-center mb-8">Browse topics across traditions — click any topic to get AI-powered explanations</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  </>
  );
}
