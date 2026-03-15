import { motion } from 'framer-motion';
import SearchBar from '@/components/SearchBar';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function LandingHero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center starfield">
      <div className="relative z-10 container max-w-4xl text-center py-20">
        <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
          <span className="inline-block text-5xl mb-6 gold-text">✦</span>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight">
            Explore Scripture.
            <br />
            <span className="gold-text">Discover Unity.</span>
          </h1>
          <p className="text-muted-foreground mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            An AI-powered interfaith scripture platform. Search, compare, and study the
            Qur'an, Bible, and Ethiopian Bible with scholarly context and reverence.
          </p>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.3 }} className="mt-10">
          <SearchBar large />
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.5 }} className="mt-8 flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50">
            📖 Qur'an
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50">
            ✝️ Bible
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50">
            ⛪ Ethiopian Bible
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50">
            🤖 AI Powered
          </span>
        </motion.div>
      </div>
    </section>
  );
}
