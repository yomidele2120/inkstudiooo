import { memo } from 'react';

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
}

const VerseBlock = memo(function VerseBlock({ verses, type, fontSize }: VerseBlockProps) {
  if (type === 'quran') {
    return (
      <div className="space-y-5" style={{ fontSize: `${fontSize}px` }}>
        {verses.map((item) => {
          if (!isQuranVerse(item)) return null;
          return (
            <article key={item.ayah} className="border-b border-border/40 pb-4 last:border-0">
              <div className="flex items-start gap-3 mb-2">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                  {item.ayah}
                </span>
                <p
                  className="flex-1 text-right font-arabic leading-loose font-bold text-foreground"
                  style={{ fontSize: `${fontSize + 4}px` }}
                  dir="rtl"
                >
                  {item.arabicText}
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed pl-11">
                {item.englishText}
              </p>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3" style={{ fontSize: `${fontSize}px` }}>
      {verses.map((item) => {
        if (isQuranVerse(item)) return null;
        return (
          <article key={item.verse} className="flex gap-3 leading-relaxed">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold mt-0.5">
              {item.verse}
            </span>
            <p className="text-foreground flex-1">{item.text}</p>
          </article>
        );
      })}
    </div>
  );
});

export default VerseBlock;
