import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'scriptura' | 'unity'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('su-theme') as 'scriptura' | 'unity') || 'scriptura';
    }
    return 'scriptura';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('su-theme', theme);
  }, [theme]);

  const toggle = () => setTheme(theme === 'scriptura' ? 'unity' : 'scriptura');

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      title={theme === 'scriptura' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      {theme === 'scriptura' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
