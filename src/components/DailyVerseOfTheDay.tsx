import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Share2 } from 'lucide-react';
import VerseCard from '@/components/VerseCard';
import type { QuranVerse, BibleVerse, EthiopianVerse } from '@/data/mockScriptures';
import { sampleQuranVerses, sampleBibleVerses, sampleEthiopianVerses } from '@/data/mockScriptures';

type VerseSource = 'quran' | 'bible' | 'ethiopian';

type DailyVerseData =
  | { source: 'quran'; verse: QuranVerse }
  | { source: 'bible'; verse: BibleVerse }
  | { source: 'ethiopian'; verse: EthiopianVerse };

interface CachedDailyVerse {
  date: string;
  data: Record<VerseSource, DailyVerseData>;
}

const STORAGE_KEY = 'su-daily-verse';

function getLagosDateKey() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const lagosOffset = 1 * 60 * 60000;
  const lagosDate = new Date(utc + lagosOffset);
  return lagosDate.toISOString().slice(0, 10);
}

function stableHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function chooseDailyVerse(dateKey: string): Record<VerseSource, DailyVerseData> {
  const qIndex = stableHash(`${dateKey}-quran`) % sampleQuranVerses.length;
  const bIndex = stableHash(`${dateKey}-bible`) % sampleBibleVerses.length;
  const eIndex = stableHash(`${dateKey}-ethiopian`) % sampleEthiopianVerses.length;

  return {
    quran: { source: 'quran', verse: sampleQuranVerses[qIndex] },
    bible: { source: 'bible', verse: sampleBibleVerses[bIndex] },
    ethiopian: { source: 'ethiopian', verse: sampleEthiopianVerses[eIndex] },
  };
}

function toReadPath(source: VerseSource) {
  if (source === 'quran') return '/read/quran';
  if (source === 'bible') return '/read/bible';
  return '/read/ethiopian';
}

export default function DailyVerseOfTheDay() {
  const dateKey = useMemo(() => getLagosDateKey(), []);

  const [dailyVerses, setDailyVerses] = useState<Record<VerseSource, DailyVerseData>>({
    quran: { source: 'quran', verse: sampleQuranVerses[0] },
    bible: { source: 'bible', verse: sampleBibleVerses[0] },
    ethiopian: { source: 'ethiopian', verse: sampleEthiopianVerses[0] },
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cachedRaw = localStorage.getItem(STORAGE_KEY);
    let nextVerses = chooseDailyVerse(dateKey);

    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw) as CachedDailyVerse;
        if (cached?.date === dateKey && cached.data) {
          nextVerses = cached.data;
        }
      } catch {
        // ignore corrupted cache
      }
    }

    setDailyVerses(nextVerses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: dateKey, data: nextVerses }));
    setLoaded(true);
  }, [dateKey]);

  const copyToClipboard = async (data: DailyVerseData) => {
    const verse = data.verse;
    const textToCopy = data.source === 'quran'
      ? `${verse.surahName} ${verse.surah}:${verse.ayah}\n${verse.arabicText}\n${verse.englishText}`
      : `${verse.book} ${verse.chapter}:${verse.verse}\n${verse.text}`;

    await navigator.clipboard.writeText(textToCopy);
    window.alert('Verse copied to clipboard');
  };

  const shareVerse = async (data: DailyVerseData) => {
    const verse = data.verse;
    const textToShare = data.source === 'quran'
      ? `${verse.surahName} ${verse.surah}:${verse.ayah} - ${verse.englishText}`
      : `${verse.book} ${verse.chapter}:${verse.verse} - ${verse.text}`;

    if (navigator.share) {
      await navigator.share({ title: 'Verse of the Day', text: textToShare, url: window.location.href });
    } else {
      await copyToClipboard(data);
    }
  };

  if (!loaded) {
    return (
      <section className="py-10">
        <div className="container max-w-4xl text-center">
          <p className="text-muted-foreground">Loading Verse of the Day...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container max-w-6xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-8">Verse of the Day</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {(Object.keys(dailyVerses) as VerseSource[]).map((source) => {
            const data = dailyVerses[source];
            const verse = data.verse;

            const subtitle = source === 'quran'
              ? `Surah ${verse.surahName} ${verse.surah}:${verse.ayah}`
              : `${verse.book} ${verse.chapter}:${verse.verse}`;

            return (
              <div key={source} className="rounded-xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {source === 'quran' ? 'Quran' : source === 'bible' ? 'Bible' : 'Ethiopian Bible'}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => copyToClipboard(data)} className="text-muted-foreground hover:text-foreground"><Copy className="h-4 w-4" /></button>
                    <button onClick={() => shareVerse(data)} className="text-muted-foreground hover:text-foreground"><Share2 className="h-4 w-4" /></button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-primary mb-1">{subtitle}</h3>
                <div className="mb-3 text-sm text-muted-foreground">{dateKey}</div>

                <VerseCard data={{ type: source, verse }} />

                <div className="mt-4 flex items-center justify-between">
                  <Link to={toReadPath(source)} className="text-primary hover:underline text-sm">
                    Read full {source === 'quran' ? 'Quran' : source === 'bible' ? 'Bible' : 'scripture'} 
                  </Link>
                  <span className="text-xs text-muted-foreground">Updated daily</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
