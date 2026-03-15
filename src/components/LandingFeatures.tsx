import { motion } from 'framer-motion';
import { GitCompareArrows, MessageSquare, BookOpen, Volume2, Globe, Users } from 'lucide-react';

const features = [
  {
    icon: GitCompareArrows,
    title: 'Verse Comparison Mode',
    description: 'Compare specific verses across Bible, Quran, and Ethiopian Bible side-by-side with scholarly context.',
  },
  {
    icon: MessageSquare,
    title: 'Debate Mode',
    description: 'Explore theological questions from multiple perspectives with balanced, neutral AI analysis.',
  },
  {
    icon: BookOpen,
    title: 'AI Scripture Explanation',
    description: 'Get deep, scholarly explanations of any verse with historical context and cross-references.',
  },
  {
    icon: Volume2,
    title: 'Text-to-Speech Reading',
    description: 'Listen to scripture explanations with built-in audio playback across all devices.',
  },
  {
    icon: Globe,
    title: 'Multi-Language Search',
    description: 'Search and receive answers in English, Arabic, Hebrew, Amharic, French, and more.',
  },
  {
    icon: Users,
    title: 'Interfaith Dialogue',
    description: 'Bridge understanding between faiths with respectful, neutral AI-powered discussions.',
  },
];

export default function LandingFeatures() {
  return (
    <section className="py-20 relative">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sacred Spaces for Study
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore specialized modes designed for deep study, comparison, and interfaith understanding.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group p-6 rounded-xl bg-card border border-border hover:glow-border transition-all duration-300"
            >
              <feature.icon className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
