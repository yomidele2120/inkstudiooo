import { Palette, Pen, Sparkles, Clock } from "lucide-react";

const services = [
  {
    icon: Pen,
    title: "Fine Line",
    description: "Delicate, precise linework for minimalist and botanical designs that age gracefully.",
    price: "From $150",
  },
  {
    icon: Palette,
    title: "Blackwork",
    description: "Bold geometric patterns, mandalas, and ornamental designs using solid black ink.",
    price: "From $200",
  },
  {
    icon: Sparkles,
    title: "Custom Design",
    description: "Fully bespoke artwork created collaboratively to bring your unique vision to life.",
    price: "From $300",
  },
  {
    icon: Clock,
    title: "Cover-Ups",
    description: "Transform old or unwanted tattoos into beautiful new pieces with expert cover-up work.",
    price: "From $250",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-charcoal noise-overlay">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">What I Offer</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Services & Styles
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From delicate fine line work to bold blackwork designs, I offer a range of 
            styles tailored to your personal aesthetic.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group p-8 bg-secondary/50 border border-border hover:border-gold/50 transition-all duration-500"
            >
              <service.icon className="w-10 h-10 text-gold mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-display text-xl text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {service.description}
              </p>
              <p className="text-gold font-semibold text-sm tracking-wider">{service.price}</p>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="mt-24 text-center">
          <h3 className="font-display text-2xl md:text-3xl text-foreground mb-12">The Process</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consultation", desc: "We discuss your ideas and vision" },
              { step: "02", title: "Design", desc: "I create custom artwork for approval" },
              { step: "03", title: "Session", desc: "We bring your tattoo to life" },
              { step: "04", title: "Aftercare", desc: "Full support for healing" },
            ].map((item, index) => (
              <div key={index} className="relative">
                <p className="font-display text-5xl text-gold/20 mb-4">{item.step}</p>
                <h4 className="font-display text-lg text-foreground mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-gold/30 to-transparent -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
