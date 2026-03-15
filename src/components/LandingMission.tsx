import { motion } from 'framer-motion';

export default function LandingMission() {
  return (
    <section className="py-20 relative starfield">
      <div className="container max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-4xl mb-6 block">🕊</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
            Our Mission
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            ScriptureUnity AI exists to promote understanding, peaceful dialogue, and
            religious literacy. We believe that by studying scriptures together — with
            respect, curiosity, and scholarly rigor — we can build bridges between
            communities and discover the shared values that unite humanity.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mt-10">
            {[
              { icon: '📖', title: 'Understanding', desc: 'Deep scholarly insights across traditions' },
              { icon: '🤝', title: 'Peaceful Dialogue', desc: 'Neutral, respectful interfaith conversation' },
              { icon: '🎓', title: 'Religious Literacy', desc: 'Accurate, educational scripture study' },
              { icon: '🌍', title: 'Unity Through Scripture', desc: 'Finding common ground across faiths' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-xl bg-card/60 backdrop-blur-sm border border-border text-left"
              >
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <h3 className="font-heading text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
