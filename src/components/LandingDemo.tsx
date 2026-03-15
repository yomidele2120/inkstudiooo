import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const demoPrompts = [
  { text: 'Compare Bible and Quran verses about mercy', icon: '⚖️' },
  { text: 'What do both scriptures say about prophets?', icon: '📖' },
  { text: 'Explain the teachings of Jesus in both scriptures', icon: '✝️' },
  { text: 'How do Islam and Christianity view forgiveness?', icon: '❤️' },
];

export default function LandingDemo() {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-20 relative">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Experience the Dialogue
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose a question that resonates with your curiosity and receive AI-powered
              scholarly insights from across religious traditions.
            </p>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {demoPrompts.map((prompt, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              onClick={() => navigate(`/search?q=${encodeURIComponent(prompt.text)}`)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group text-left p-5 rounded-xl glow-border bg-card/60 backdrop-blur-sm hover:bg-card transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{prompt.icon}</span>
                <div className="flex-1">
                  <p className="text-foreground font-medium leading-relaxed">{prompt.text}</p>
                  <div className={`flex items-center gap-1 mt-2 text-sm text-primary transition-opacity ${hoveredIndex === i ? 'opacity-100' : 'opacity-0'}`}>
                    Try this <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
