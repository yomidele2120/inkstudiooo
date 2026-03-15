import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingCTA() {
  return (
    <section className="py-24 relative starfield">
      <div className="container max-w-3xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-5xl mb-6 block gold-text">✦</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Explore Scripture With Understanding
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Begin your journey of discovery. Ask questions, compare traditions,
            and deepen your understanding of the world's sacred texts.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-heading text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            Start Exploring <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
