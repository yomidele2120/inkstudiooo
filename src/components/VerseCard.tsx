import { Bookmark } from 'lucide-react';
import type { QuranVerse, BibleVerse, EthiopianVerse } from '@/data/mockScriptures';

type VerseType = 
  | { type: 'quran'; verse: QuranVerse }
  | { type: 'bible'; verse: BibleVerse }
  | { type: 'ethiopian'; verse: EthiopianVerse };

function getReference(data: VerseType): string {
  switch (data.type) {
    case 'quran':
      return `Surah ${data.verse.surahName} ${data.verse.surah}:${data.verse.ayah}`;
    case 'bible':
      return `${data.verse.book} ${data.verse.chapter}:${data.verse.verse}`;
    case 'ethiopian':
      return `${data.verse.book} ${data.verse.chapter}:${data.verse.verse}`;
  }
}

function getCardClass(type: string) {
  switch (type) {
    case 'quran': return 'scripture-card-quran';
    case 'bible': return 'scripture-card-bible';
    case 'ethiopian': return 'scripture-card-ethiopian';
    default: return '';
  }
}

function getSourceLabel(type: string) {
  switch (type) {
    case 'quran': return 'Qur\'an';
    case 'bible': return 'Bible';
    case 'ethiopian': return 'Ethiopian Bible';
    default: return '';
  }
}

function getSourceBadgeClass(type: string) {
  switch (type) {
    case 'quran': return 'bg-scripture-quran/10 text-scripture-quran';
    case 'bible': return 'bg-scripture-bible/10 text-scripture-bible';
    case 'ethiopian': return 'bg-scripture-ethiopian/10 text-scripture-ethiopian';
    default: return '';
  }
}

export default function VerseCard({ data }: { data: VerseType }) {
  const reference = getReference(data);

  return (
    <div className={`rounded-lg bg-card p-5 ${getCardClass(data.type)} transition-shadow hover:shadow-md`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getSourceBadgeClass(data.type)}`}>
            {getSourceLabel(data.type)}
          </span>
          <span className="text-xs text-muted-foreground">{reference}</span>
        </div>
        <button className="text-muted-foreground hover:text-accent transition-colors p-1">
          <Bookmark className="h-4 w-4" />
        </button>
      </div>

      {data.type === 'quran' && (
        <p className="font-arabic text-xl mb-3 text-foreground/90 leading-relaxed">
          {data.verse.arabicText}
        </p>
      )}

      <p className="text-foreground leading-relaxed font-body">
        {data.type === 'quran' ? data.verse.englishText : 
         data.type === 'bible' ? data.verse.text : data.verse.text}
      </p>

      {data.type === 'ethiopian' && data.verse.notes && (
        <p className="text-xs text-muted-foreground mt-3 italic border-t border-border pt-2">
          {data.verse.notes}
        </p>
      )}

      <div className="mt-3 text-xs text-muted-foreground">
        {data.type === 'quran' && `Translation: ${data.verse.translationName}`}
        {data.type === 'bible' && `${data.verse.translation} · ${data.verse.canonType}`}
        {data.type === 'ethiopian' && `Translation: ${data.verse.translation}`}
      </div>
    </div>
  );
}
