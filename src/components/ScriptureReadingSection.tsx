import { motion } from 'framer-motion';
import { BookOpen, BookText, Library } from 'lucide-react';
import { Link } from 'react-router-dom';

const scriptures = [
  {
    title: 'Read Full Bible',
    icon: BookOpen,
    description: 'Explore the complete Bible with all books, chapters, and verses.',
    path: '/read/bible',
    color: 'scripture-bible',
  },
  {
    title: 'Read Full Quran',
    icon: BookText,
    description: 'Read the Holy Quran with Arabic text and English translations.',
    path: '/read/quran',
    color: 'scripture-quran',
  },
  {
    title: 'Read Other Scriptures',
    icon: Library,
    description: 'Explore Ethiopian Bible books including 1 Enoch, Jubilees, and more.',
    path: '/read/other',
    color: 'scripture-ethiopian',
  },
];

export default function ScriptureReadingSection() {
  return (
    <section className="py-20">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Read Full Scriptures
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Immerse yourself in the complete sacred texts. Read, study, and navigate
            through chapters and verses like a digital holy book.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {scriptures.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={s.path}
                className="block p-6 rounded-xl bg-card border border-border hover:glow-border transition-all duration-300 text-center group h-full"
              >
                <s.icon className={`h-12 w-12 text-${s.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
