import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <Link to="/" className="font-heading text-lg font-semibold text-foreground tracking-wider">
              <span className="gold-text">✦</span> ScriptureUnity AI
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              Promoting understanding through scripture study
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Link to="/search" className="hover:text-foreground transition-colors">Search</Link>
            <Link to="/topics" className="hover:text-foreground transition-colors">Topics</Link>
            <Link to="/compare" className="hover:text-foreground transition-colors">Compare</Link>
            <Link to="/understanding" className="hover:text-foreground transition-colors">Understanding</Link>
          </div>

          <p className="text-xs text-muted-foreground">
            Educational · Neutral · Respectful · Scholarly
          </p>
        </div>
      </div>
    </footer>
  );
}
