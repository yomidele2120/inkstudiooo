import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import TopicCard from '@/components/TopicCard';
import VerseCard from '@/components/VerseCard';
import { topics, verseOfTheDay } from '@/data/mockScriptures';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Index() {
  return (
    <>
      <Helmet>
        <title>Scripture Unity AI – Compare Scriptures and Promote Oneness</title>
        <meta
          name="description"
          content="Explore AI-powered scripture comparison, listen to audio teachings, and discover insights promoting unity and oneness."
        />
      </Helmet>
      <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 text-center">
        <div className="container max-w-3xl">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
            <span className="text-4xl mb-4 block">✦</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Explore Scriptures.<br />
              <span className="text-accent">Discover Unity.</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-lg max-w-xl mx-auto leading-relaxed">
              An AI-powered interfaith scripture research platform. Search, compare, and study the Qur'an, Bible, and Ethiopian Bible with scholarly context.
            </p>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="mt-8">
            <SearchBar large />
          </motion.div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Verse of the Day */}
      <section className="py-12">
        <div className="container">
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-6 text-center">
              Verse of the Day
            </h2>
            <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              <VerseCard data={{ type: 'quran', verse: verseOfTheDay.quran }} />
              <VerseCard data={{ type: 'bible', verse: verseOfTheDay.bible }} />
              <VerseCard data={{ type: 'ethiopian', verse: verseOfTheDay.ethiopian }} />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Topic Explorer */}
      <section className="py-12">
        <div className="container">
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-2 text-center">
            Explore Topics
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Browse scriptures by theme across all traditions
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {topics.slice(0, 6).map((topic, i) => (
              <motion.div
                key={topic.id}
                {...fadeUp}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <TopicCard topic={topic} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-6">
            <a
              href="/topics"
              className="text-sm text-accent hover:underline font-medium"
            >
              View all topics →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            ScriptureUnity AI — Promoting understanding through scripture study
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Educational · Neutral · Respectful · Scholarly
          </p>
        </div>
      </footer>
    </div>
  </>
  );
}
