import { useState, useRef, useEffect, useCallback } from 'react';
import { Pause, Play, Volume2, Loader2, Square } from 'lucide-react';

interface AudioPlayerProps {
  text: string;
}

export default function AudioPlayer({ text }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const chunksRef = useRef<string[]>([]);
  const currentIndexRef = useRef(0);
  const cancelledRef = useRef(false);
  const totalCharsRef = useRef(0);
  const spokenCharsRef = useRef(0);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const cleanText = (raw: string) =>
    raw
      .replace(/#{1,6}\s*/g, '')
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
      .replace(/>\s*/g, '')
      .replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[-*_]{3,}/g, '')
      .replace(/\n{2,}/g, '. ')
      .replace(/\n/g, ' ')
      .trim();

  const splitIntoChunks = (input: string): string[] => {
    const cleaned = cleanText(input);
    // Split on sentence boundaries, keeping chunks ~100-200 chars for fast first-audio
    const sentences = cleaned.match(/[^.!?]+[.!?]+\s*/g) || [cleaned];
    const chunks: string[] = [];
    let current = '';

    for (const sentence of sentences) {
      if (current.length + sentence.length > 200 && current.length > 0) {
        chunks.push(current.trim());
        current = sentence;
      } else {
        current += sentence;
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks.filter(c => c.length > 0);
  };

  const speakChunk = useCallback((index: number) => {
    if (cancelledRef.current) return;
    if (index >= chunksRef.current.length) {
      setIsPlaying(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
      return;
    }

    const chunk = chunksRef.current[index];
    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.rate = 0.92;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
      voices.find(v => v.lang.startsWith('en') && v.localService);
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => {
      setIsLoading(false);
      currentIndexRef.current = index;
    };

    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        const charsSpoken = spokenCharsRef.current + e.charIndex;
        setProgress(Math.min(99, (charsSpoken / totalCharsRef.current) * 100));
      }
    };

    utterance.onend = () => {
      spokenCharsRef.current += chunk.length;
      setProgress((spokenCharsRef.current / totalCharsRef.current) * 100);
      speakChunk(index + 1);
    };

    utterance.onerror = (e) => {
      if (e.error === 'canceled' || e.error === 'interrupted') return;
      console.error('TTS error:', e.error);
      // Stop entirely on synthesis failure (no voices available)
      cancelledRef.current = true;
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsLoading(false);
      setProgress(0);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const handlePlay = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
      return;
    }

    // Start fresh
    setIsLoading(true);
    setIsPlaying(true);
    setIsPaused(false);
    setProgress(0);
    cancelledRef.current = false;
    spokenCharsRef.current = 0;
    currentIndexRef.current = 0;

    window.speechSynthesis.cancel();

    const chunks = splitIntoChunks(text);
    chunksRef.current = chunks;
    totalCharsRef.current = chunks.reduce((sum, c) => sum + c.length, 0);

    // Small delay to let voices load
    const startSpeaking = () => {
      speakChunk(0);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        startSpeaking();
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      startSpeaking();
    }
  };

  const handleStop = () => {
    cancelledRef.current = true;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setIsLoading(false);
    setProgress(0);
    spokenCharsRef.current = 0;
  };

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
      <button
        onClick={handlePlay}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-3.5 w-3.5" />
        ) : isPaused ? (
          <Play className="h-3.5 w-3.5" />
        ) : (
          <Volume2 className="h-3.5 w-3.5" />
        )}
        {isLoading ? 'Starting...' : isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Listen'}
      </button>

      {(isPlaying || isPaused) && (
        <>
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[200px]">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <button
            onClick={handleStop}
            className="flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Square className="h-3 w-3" />
          </button>
        </>
      )}
    </div>
  );
}
