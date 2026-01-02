const About = () => {
  const stats = [
    { number: "12+", label: "Years Experience" },
    { number: "2K+", label: "Happy Clients" },
    { number: "15+", label: "Awards Won" },
  ];

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="aspect-[4/5] bg-charcoal overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-charcoal-light to-charcoal flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center">
                    <span className="font-display text-5xl text-gold">M</span>
                  </div>
                  <p className="font-display text-2xl text-foreground">Marcus Rivera</p>
                  <p className="text-muted-foreground text-sm tracking-wider uppercase mt-2">Lead Artist</p>
                </div>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-gold/30 -z-10" />
          </div>

          {/* Content Side */}
          <div>
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">The Artist</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6 leading-tight">
              Crafting Art That Lives on Skin
            </h2>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                With over a decade of experience in the tattoo industry, I've dedicated my life 
                to mastering the art of permanent expression. What started as a passion for 
                drawing evolved into a profound respect for the sacred tradition of tattooing.
              </p>
              <p>
                Every piece I create is a collaboration between artist and canvas. I believe 
                that the best tattoos come from understanding not just what my clients want, 
                but who they are and what story they wish to tell through their ink.
              </p>
              <p>
                Specializing in fine line work, blackwork, and custom designs, I strive to 
                push the boundaries of what's possible while maintaining the timeless quality 
                that ensures your tattoo ages beautifully.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-border">
              {stats.map((stat, index) => (
                <div key={index}>
                  <p className="font-display text-3xl md:text-4xl text-gold">{stat.number}</p>
                  <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
