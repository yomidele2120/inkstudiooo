import { Helmet } from 'react-helmet';
import LandingHero from '@/components/Hero';
import LandingDemo from '@/components/LandingDemo';
import LandingFeatures from '@/components/LandingFeatures';
import ScriptureReadingSection from '@/components/ScriptureReadingSection';
import LandingMission from '@/components/LandingMission';
import LandingTestimonials from '@/components/LandingTestimonials';
import LandingFAQ from '@/components/LandingFAQ';
import LandingCTA from '@/components/LandingCTA';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
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
          content="Explore AI-powered scripture comparison across the Quran, Bible, and Ethiopian Bible. Discover unity, listen to audio teachings, and gain scholarly insights."
        />
      </Helmet>
      <div className="min-h-screen">
        {/* Hero */}
        <LandingHero />

        <div className="gold-divider" />

        {/* Verse of the Day */}
        <section className="py-16">
          <div className="container">
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-8 text-center">
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

        {/* Interactive AI Demo */}
        <LandingDemo />

        <div className="gold-divider" />

        {/* Scripture Reading Section */}
        <ScriptureReadingSection />

        <div className="gold-divider" />

        {/* Feature Showcase */}
        <LandingFeatures />

        <div className="gold-divider" />

        {/* Topic Explorer Preview */}
        <section className="py-16">
          <div className="container">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-2 text-center">
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
            <div className="text-center mt-8">
              <a
                href="/topics"
                className="text-sm text-primary hover:underline font-medium"
              >
                View all topics →
              </a>
            </div>
          </div>
        </section>

        <div className="gold-divider" />

        {/* Mission */}
        <LandingMission />

        <div className="gold-divider" />

        {/* Testimonials */}
        <LandingTestimonials />

        <div className="gold-divider" />

        {/* FAQ */}
        <LandingFAQ />

        <div className="gold-divider" />

        {/* CTA */}
        <LandingCTA />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
