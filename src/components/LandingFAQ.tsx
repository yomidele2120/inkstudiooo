import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'What is ScriptureUnity AI?',
    a: 'ScriptureUnity AI is an AI-powered interfaith scripture research platform that helps users search, compare, and study the Qur\'an, Bible, and Ethiopian Bible with scholarly context. It promotes understanding and unity across religious traditions.',
  },
  {
    q: 'Can I compare Bible and Quran verses?',
    a: 'Yes! Our Compare & Debate feature allows you to compare specific topics, verses, and theological concepts across Christianity, Islam, Judaism, and Ethiopian Orthodox Christianity side-by-side.',
  },
  {
    q: 'Is this platform meant to create debate?',
    a: 'No. While we offer a "Debate Mode" that presents multiple perspectives, the goal is always education and understanding — never argument. Every response is neutral, respectful, and scholarly.',
  },
  {
    q: 'How does the AI interpret scripture?',
    a: 'The AI draws from scholarly traditions, historical context, and multiple theological interpretations. It presents each faith\'s perspective fairly and includes relevant scripture references without favoring any tradition.',
  },
  {
    q: 'Are conversations private?',
    a: 'Your searches are stored locally using an anonymous identifier. We do not require accounts or collect personal information. Your study sessions remain private.',
  },
  {
    q: 'What languages are supported?',
    a: 'ScriptureUnity AI supports English, Arabic, Hebrew, Amharic, Yoruba, Hausa, and French. You can search and receive responses in any supported language.',
  },
];

export default function LandingFAQ() {
  return (
    <section className="py-20">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <AccordionItem value={`faq-${i}`} className="bg-card border border-border rounded-xl px-5">
                <AccordionTrigger className="font-heading text-lg font-semibold text-foreground hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
