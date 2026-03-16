import { Helmet } from 'react-helmet';
import { useState } from 'react';
import { motion } from 'framer-motion';
import LanguageSelector from '@/components/LanguageSelector';
import { useNavigate } from 'react-router-dom';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const explorationTopics = [
  { label: 'Jesus in Christianity', icon: '✝️' },
  { label: 'Jesus in Islam', icon: '☪️' },
  { label: 'Jewish view of Jesus', icon: '✡️' },
  { label: 'Trinity explained', icon: '🔺' },
  { label: 'Islamic Tawhid', icon: '☪️' },
  { label: 'Prophets in Islam', icon: '📖' },
  { label: 'Salvation in Christianity', icon: '✝️' },
  { label: 'Prayer in different religions', icon: '🤲' },
  { label: 'Fasting across faiths', icon: '🌙' },
  { label: 'Ethiopian Orthodox unique teachings', icon: '⛪' },
  { label: 'Jewish beliefs and practices', icon: '✡️' },
  { label: 'Shared values across Abrahamic faiths', icon: '🕊️' },
  { label: 'The concept of sin across religions', icon: '📜' },
  { label: 'Angels in different traditions', icon: '👼' },
  { label: 'End times prophecies compared', icon: '⏳' },
];

const sharedValues = [
  { title: 'Mercy and Compassion', icon: '❤️', desc: 'All Abrahamic traditions emphasize God\'s mercy and call believers to show compassion.' },
  { title: 'Justice and Fairness', icon: '⚖️', desc: 'The Qur\'an, Bible, and Ethiopian scriptures all command justice and standing against oppression.' },
  { title: 'Kindness to Neighbors', icon: '🤝', desc: 'Treating neighbors with kindness and respect is a shared principle across all three traditions.' },
  { title: 'Honoring Parents', icon: '👨‍👩‍👧', desc: 'Reverence for parents is commanded in the Qur\'an, Bible, and Ethiopian Orthodox tradition.' },
  { title: 'Charity and Generosity', icon: '🎁', desc: 'Giving to those in need is central in Islam (Zakat), Christianity (Tithing), and Ethiopian tradition.' },
  { title: 'Seeking Knowledge', icon: '📖', desc: 'All traditions encourage the pursuit of knowledge and understanding of God\'s creation.' },
];

export default function UnderstandingPage() {
  const [language, setLanguage] = useState('en');
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const navigate = useNavigate();

  const goToTopic = (query: string) => {
    const slug = encodeURIComponent(query);
    navigate(`/topic/${slug}?source=faith&lang=${language}`);
  };

  const handleExplore = (label: string) => {
    setActiveLabel(label);
    goToTopic(label);
  };

  const handleValueClick = (title: string) => {
    setActiveLabel(title);
    const query = `${title} — How do Christianity, Islam, Judaism, and Ethiopian Orthodox Christianity teach about ${title.toLowerCase()}? Include relevant scripture references.`;
    goToTopic(query);
  };

  return (
    <>
      <Helmet>
        <title>Understanding Faiths — Scripture Unity AI</title>
        <meta name="description" content="Deeply explore Christianity, Islam, Judaism, and Ethiopian Orthodox traditions with AI-assisted scripture study." />
      </Helmet>
      <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center mb-10">
          <span className="text-4xl mb-3 block">🕊</span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Understanding Faiths
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto leading-relaxed">
            Explore and learn about Christianity, Islam, Judaism, and Ethiopian Orthodox Christianity. 
            Click any topic below for a detailed AI-powered explanation.
          </p>
        </motion.div>

        <div className="flex justify-center mb-6">
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>

        <div className="gold-divider mb-8" />

        {/* Exploration buttons */}
        <section className="mb-8">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-4 text-center">
            Explore Religious Topics
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {explorationTopics.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => handleExplore(label)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeLabel === label
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent/20'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </section>

        <div className="mb-8 rounded-lg border border-border bg-card p-5 text-center">
          <p className="text-sm text-muted-foreground">
            Select any topic above or inside shared values to open a dedicated topic route for deep exploration and direct sharing.
          </p>
        </div>

        <div className="gold-divider mb-8" />

        {/* Shared values — clickable */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-6 text-center">
            Shared Moral Teachings
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-6">Click any value to learn more from each tradition</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {sharedValues.map((val, i) => (
              <motion.button
                key={val.title}
                {...fadeUp}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => handleValueClick(val.title)}
                className="bg-card border border-border rounded-lg p-5 text-left hover:border-accent/40 hover:shadow-md transition-all"
              >
                <span className="text-2xl mb-2 block">{val.icon}</span>
                <h3 className="font-heading text-lg font-semibold text-foreground">{val.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{val.desc}</p>
              </motion.button>
            ))}
          </div>
        </section>

        <div className="bg-primary/5 border border-accent/20 rounded-lg p-6 text-center">
          <p className="font-heading text-lg text-foreground italic">
            "O mankind, indeed We have created you from male and female and made you peoples and 
            tribes that you may know one another."
          </p>
          <p className="text-sm text-muted-foreground mt-2">— Qur'an 49:13</p>
        </div>
      </div>
    </div>
  </>
  );
}
