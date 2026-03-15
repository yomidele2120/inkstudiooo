import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Dr. Amina Hassan',
    role: 'Islamic Studies Scholar',
    text: 'ScriptureUnity AI provides an unprecedented level of balanced, scholarly comparison. It represents each tradition with genuine respect and depth.',
  },
  {
    name: 'Rev. Michael Thompson',
    role: 'Interfaith Dialogue Coordinator',
    text: 'This platform has transformed how our interfaith groups study together. The AI responses are nuanced, educational, and always respectful.',
  },
  {
    name: 'Yohannes Bekele',
    role: 'Ethiopian Orthodox Studies Researcher',
    text: 'Finally a platform that includes the Ethiopian Orthodox canon. The coverage of books like 1 Enoch and Jubilees is remarkable.',
  },
  {
    name: 'Sarah Cohen',
    role: 'Graduate Student, Religious Studies',
    text: 'I use ScriptureUnity AI daily for my research. The comparative analysis saves hours of work and the multilingual support is invaluable.',
  },
];

export default function LandingTestimonials() {
  return (
    <section className="py-20">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Scholars & Seekers
          </h2>
          <p className="text-muted-foreground">
            Hear from those who use ScriptureUnity AI for study and dialogue.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/90 leading-relaxed mb-4 italic">
                "{t.text}"
              </p>
              <div>
                <p className="font-heading font-semibold text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
