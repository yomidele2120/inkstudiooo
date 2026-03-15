import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <section id="contact" className="py-16 bg-card/50">
      <div className="container max-w-3xl text-center">
        <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
          Get in Touch
        </h2>
        <p className="text-muted-foreground mb-8">
          Have questions about ScriptureUnity AI? We'd love to hear from you.
        </p>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          Start Exploring Scriptures
        </Link>
      </div>
    </section>
  );
};

export default Contact;
