import { useEffect, useState } from 'react';

const STORAGE_KEY = 'su-font-size';

export function useFontSize() {
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = Number(saved);
      if (!Number.isNaN(parsed) && parsed >= 12 && parsed <= 28) {
        setFontSize(parsed);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(fontSize));
  }, [fontSize]);

  return { fontSize, setFontSize };
}
