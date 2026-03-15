import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Topic } from '@/data/mockScriptures';

export default function TopicCard({ topic }: { topic: Topic }) {
  return (
    <Link
      to={`/topics/${topic.id}`}
      className="group block rounded-lg bg-card p-5 border border-border hover:border-accent/40 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-2xl mb-2 block">{topic.icon}</span>
          <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
            {topic.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {topic.description}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors mt-1 shrink-0" />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {topic.subtopics.slice(0, 3).map((sub) => (
          <span key={sub.id} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
            {sub.name}
          </span>
        ))}
        {topic.subtopics.length > 3 && (
          <span className="text-xs text-muted-foreground px-1">
            +{topic.subtopics.length - 3} more
          </span>
        )}
      </div>
    </Link>
  );
}
