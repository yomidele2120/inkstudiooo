import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Work", href: "#gallery" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="font-display text-2xl font-semibold tracking-wide text-foreground">
            <span className="text-gold">INK</span>STUDIO
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-gold transition-colors duration-300 tracking-wide uppercase"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Book Now Button (Desktop) */}
          <a
            href="https://paystack.com/buy/consultation-cbhizq"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex px-6 py-2 border border-gold text-gold text-sm font-semibold tracking-wider uppercase hover:bg-gold hover:text-background transition-all duration-300"
          >
            Book Now
          </a>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4 animate-fade-in">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 text-sm font-medium text-muted-foreground hover:text-gold transition-colors tracking-wide uppercase"
              >
                {link.name}
              </a>
            ))}
            <a
              href="https://paystack.com/buy/consultation-cbhizq"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="inline-block mt-4 px-6 py-2 border border-gold text-gold text-sm font-semibold tracking-wider uppercase hover:bg-gold hover:text-background transition-all duration-300"
            >
              Book Now
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
