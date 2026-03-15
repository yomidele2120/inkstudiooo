import { Helmet } from 'react-helmet';
import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ABBREV_TO_BOOK: Record<string, string> = {
  gn: 'Genesis', ex: 'Exodus', lv: 'Leviticus', nm: 'Numbers', dt: 'Deuteronomy',
  js: 'Joshua', jg: 'Judges', rt: 'Ruth', '1sm': '1 Samuel', '2sm': '2 Samuel',
  '1kn': '1 Kings', '2kn': '2 Kings', '1ch': '1 Chronicles', '2ch': '2 Chronicles',
  er: 'Ezra', ne: 'Nehemiah', et: 'Esther', jb: 'Job', ps: 'Psalms',
  pr: 'Proverbs', ec: 'Ecclesiastes', ss: 'Song of Solomon', is: 'Isaiah',
  jr: 'Jeremiah', lm: 'Lamentations', ez: 'Ezekiel', dn: 'Daniel', hs: 'Hosea',
  jl: 'Joel', am: 'Amos', ob: 'Obadiah', jn: 'Jonah', mc: 'Micah',
  na: 'Nahum', hk: 'Habakkuk', zp: 'Zephaniah', hg: 'Haggai', zc: 'Zechariah',
  ml: 'Malachi', mt: 'Matthew', mk: 'Mark', lk: 'Luke', jo: 'John',
  ac: 'Acts', rm: 'Romans', '1co': '1 Corinthians', '2co': '2 Corinthians',
  gl: 'Galatians', ep: 'Ephesians', pp: 'Philippians', cl: 'Colossians',
  '1ts': '1 Thessalonians', '2ts': '2 Thessalonians', '1tm': '1 Timothy',
  '2tm': '2 Timothy', tt: 'Titus', pm: 'Philemon', hb: 'Hebrews',
  jm: 'James', '1pt': '1 Peter', '2pt': '2 Peter', '1jo': '1 John',
  '2jo': '2 John', '3jo': '3 John', jd: 'Jude', rv: 'Revelation',
};

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  canon_type: string;
}

interface QuranVerse {
  surah_no: number;
  surah_name_en: string;
  surah_name_ar: string | null;
  surah_name_roman: string | null;
  ayah_no: number;
  ayah_no_quran: number | null;
  text_ar: string | null;
  text_en: string;
  juz_no: number | null;
  place_of_revelation: string | null;
}

function parseBibleCSV(csvText: string): BibleVerse[] {
  const lines = csvText.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  
  const headers = parseCSVLine(lines[0]);
  // Parse chapter/verse structure from headers: chapters/X/Y
  const chapterVerseMap: { colIdx: number; chapter: number; verse: number }[] = [];
  
  headers.forEach((h, idx) => {
    const match = h.match(/^chapters\/(\d+)\/(\d+)$/);
    if (match) {
      chapterVerseMap.push({
        colIdx: idx,
        chapter: parseInt(match[1]) + 1, // 0-based to 1-based
        verse: parseInt(match[2]) + 1,
      });
    }
  });

  const verses: BibleVerse[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const abbrev = cols[0]?.toLowerCase()?.trim();
    if (!abbrev) continue;
    
    const bookName = ABBREV_TO_BOOK[abbrev] || abbrev;
    
    for (const cv of chapterVerseMap) {
      const text = cols[cv.colIdx]?.trim();
      if (text) {
        verses.push({
          book: bookName,
          chapter: cv.chapter,
          verse: cv.verse,
          text,
          translation: 'KJV',
          canon_type: 'Protestant',
        });
      }
    }
  }
  
  return verses;
}

function parseQuranCSV(csvText: string): QuranVerse[] {
  const lines = csvText.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  
  const headers = parseCSVLine(lines[0]);
  const getIdx = (name: string) => headers.findIndex(h => h.trim() === name);
  
  const surahNoIdx = getIdx('surah_no');
  const surahNameEnIdx = getIdx('surah_name_en');
  const surahNameArIdx = getIdx('surah_name_ar');
  const surahNameRomanIdx = getIdx('surah_name_roman');
  const ayahNoSurahIdx = getIdx('ayah_no_surah');
  const ayahNoQuranIdx = getIdx('ayah_no_quran');
  const ayahArIdx = getIdx('ayah_ar');
  const ayahEnIdx = getIdx('ayah_en');
  const juzNoIdx = getIdx('juz_no');
  const placeIdx = getIdx('place_of_revelation');

  const verses: QuranVerse[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const surahNo = parseInt(cols[surahNoIdx]);
    const ayahNo = parseInt(cols[ayahNoSurahIdx]);
    const textEn = cols[ayahEnIdx]?.trim();
    
    if (isNaN(surahNo) || isNaN(ayahNo) || !textEn) continue;
    
    verses.push({
      surah_no: surahNo,
      surah_name_en: cols[surahNameEnIdx]?.trim() || '',
      surah_name_ar: cols[surahNameArIdx]?.trim() || null,
      surah_name_roman: cols[surahNameRomanIdx]?.trim() || null,
      ayah_no: ayahNo,
      ayah_no_quran: parseInt(cols[ayahNoQuranIdx]) || null,
      text_ar: cols[ayahArIdx]?.trim() || null,
      text_en: textEn,
      juz_no: parseInt(cols[juzNoIdx]) || null,
      place_of_revelation: cols[placeIdx]?.trim() || null,
    });
  }
  
  return verses;
}

type ImportType = 'bible' | 'quran';

export default function AdminImport() {
  return (
    <>
      <Helmet>
        <title>Admin Import — Scripture Unity AI</title>
        <meta name="description" content="Admin page for importing scripture data into the database." />
      </Helmet>
      <AdminImportContent />
    </>
  );
}

function AdminImportContent() {
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [importType, setImportType] = useState<ImportType>('bible');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setStatus('Please select a CSV file');
      return;
    }

    setIsImporting(true);
    setStatus('Reading file...');
    
    try {
      const csvText = await file.text();
      
      if (importType === 'bible') {
        setStatus('Parsing Bible CSV (flattening nested chapters)...');
        const verses = parseBibleCSV(csvText);
        setTotal(verses.length);
        setStatus(`Parsed ${verses.length} Bible verses. Uploading...`);

        const batchSize = 1000;
        let uploaded = 0;

        for (let i = 0; i < verses.length; i += batchSize) {
          const batch = verses.slice(i, i + batchSize);
          const { error } = await supabase.functions.invoke('import-bible-verses', {
            body: { verses: batch },
          });

          if (error) {
            setStatus(`Error at batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
            setIsImporting(false);
            return;
          }

          uploaded += batch.length;
          setProgress(uploaded);
          setStatus(`Uploaded ${uploaded} / ${verses.length} Bible verses...`);
        }

        setStatus(`✅ Bible import complete! ${uploaded} verses imported.`);
      } else {
        setStatus('Parsing Quran CSV...');
        const verses = parseQuranCSV(csvText);
        setTotal(verses.length);
        setStatus(`Parsed ${verses.length} Quran verses. Uploading...`);

        const batchSize = 1000;
        let uploaded = 0;

        for (let i = 0; i < verses.length; i += batchSize) {
          const batch = verses.slice(i, i + batchSize);
          const { error } = await supabase.functions.invoke('import-quran-verses', {
            body: { verses: batch },
          });

          if (error) {
            setStatus(`Error at batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
            setIsImporting(false);
            return;
          }

          uploaded += batch.length;
          setProgress(uploaded);
          setStatus(`Uploaded ${uploaded} / ${verses.length} Quran verses...`);
        }

        setStatus(`✅ Quran import complete! ${uploaded} verses imported.`);
      }
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-6">Scripture Data Import</h1>
        <p className="text-muted-foreground mb-6">
          Upload CSV files to import Bible or Quran verses into the database.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Dataset Type</label>
            <select
              value={importType}
              onChange={(e) => setImportType(e.target.value as ImportType)}
              className="w-full border border-border rounded-md p-2 bg-card text-foreground"
              disabled={isImporting}
            >
              <option value="bible">Bible (nested chapters CSV)</option>
              <option value="quran">Quran (surah/ayah CSV)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">CSV File</label>
            <input
              type="file"
              accept=".csv"
              ref={fileRef}
              className="w-full border border-border rounded-md p-2 bg-card text-foreground"
              disabled={isImporting}
            />
          </div>

          <button
            onClick={handleImport}
            disabled={isImporting}
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:opacity-90 disabled:opacity-50"
          >
            {isImporting ? 'Importing...' : 'Import Verses'}
          </button>

          {status && (
            <div className="p-4 rounded-md bg-muted text-foreground">
              <p>{status}</p>
              {total > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-border rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(progress / total) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {progress} / {total} ({Math.round((progress / total) * 100)}%)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
