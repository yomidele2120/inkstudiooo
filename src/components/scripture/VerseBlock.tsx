import { memo, useState } from 'react';
import VerseActions from './VerseActions';
import AIDescriptors from './AIDescriptors';

export interface QuranVerseItem {
  ayah: number;
  arabicText: string;
  englishText: string;
}

export interface BibleVerseItem {
  verse: number;
  text: string;
}

export type VerseItem = QuranVerseItem | BibleVerseItem;

export function isQuranVerse(item: VerseItem): item is QuranVerseItem {
  return 'ayah' in item;
}

interface VerseBlockProps {
  verses: VerseItem[];
  type: string;
  fontSize: number;
  book?: string;
  chapter?: number | null;
}

const VerseBlock = memo(function VerseBlock({ verses, type, fontSize, book, chapter }: VerseBlockProps) {
  const [activeAI, setActiveAI] = useState<number | null>(null);

  if (type === 'quran') {
    return (
      <div className="space-y-1" style={{ fontSize: `${fontSize}px` }}>
        {verses.map((item) => {
          if (!isQuranVerse(item)) return null;
          const verseRef = `${book || 'Quran'} ${item.ayah}`;
          return (
            <article
              key={item.ayah}
              id={`verse-${item.ayah}`}
              className="border-b border-border/30 pb-4 last:border-0 pt-3 group"
            >
              {/* Ayah number badge & actions row */}
              <div className="flex items-center justify-between mb-3">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold">
                  {item.ayah}
                </span>
                <VerseActions
                  verseRef={verseRef}
                  verseText={`${item.arabicText}\n${item.englishText}`}
                  onAskAI={() => setActiveAI(activeAI === item.ayah ? null : item.ayah)}
                />
              </div>

              {/* Arabic text - bold, large, right-aligned */}
              <p
                className="font-arabic leading-[2.2] font-bold text-foreground text-right mb-3"
                style={{ fontSize: `${fontSize + 6}px` }}
                dir="rtl"
              >
                {item.arabicText}
              </p>

              {/* English translation - smaller, left-aligned */}
              <p className="text-muted-foreground leading-relaxed text-left" style={{ fontSize: `${fontSize - 1}px` }}>
                {item.englishText}
              </p>

              {/* AI Descriptors */}
              <AIDescriptors
                type={type}
                verseRef={verseRef}
                verseText={item.englishText}
              />

              {/* AI Reflection for this verse */}
              {activeAI === item.ayah && (
                <div className="mt-3 p-3 rounded-lg border border-primary/20 bg-primary/5 text-sm">
                  <p className="text-muted-foreground text-xs">
                    Click "Generate Descriptors" or use the AI Reflection box below to explore this verse.
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    );
  }

  // Bible / Ethiopian
  return (
    <div className="space-y-1" style={{ fontSize: `${fontSize}px` }}>
      {verses.map((item) => {
        if (isQuranVerse(item)) return null;
        const verseRef = `${book || 'Scripture'} ${chapter ? `${chapter}:` : ''}${item.verse}`;
        return (
          <article
            key={item.verse}
            id={`verse-${item.verse}`}
            className="group py-2.5 border-b border-border/20 last:border-0"
          >
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold mt-0.5">
                {item.verse}
              </span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-foreground flex-1 leading-relaxed">{item.text}</p>
                  <VerseActions
                    verseRef={verseRef}
                    verseText={item.text}
                    onAskAI={() => setActiveAI(activeAI === item.verse ? null : item.verse)}
                  />
                </div>
                <AIDescriptors type={type} verseRef={verseRef} verseText={item.text} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
});

export default VerseBlock;
