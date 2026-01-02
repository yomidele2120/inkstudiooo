import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-tattoo.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Tattoo artwork"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <p className="text-gold text-sm tracking-[0.3em] uppercase mb-6 animate-fade-in opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
          Custom Tattoo Artistry
        </p>
        
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold text-foreground mb-6 animate-fade-up opacity-0 leading-tight" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
          Ink That Tells
          <br />
          <span className="text-gradient-gold">Your Story</span>
        </h1>

        <p className="max-w-xl mx-auto text-muted-foreground text-lg mb-10 animate-fade-up opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
          Award-winning tattoo artist specializing in fine line, blackwork, and custom designs. 
          Each piece is crafted with precision and passion.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up opacity-0" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
          <Button variant="hero" size="xl" asChild>
            <a href="#contact">Book a Consultation</a>
          </Button>
          <Button variant="heroOutline" size="xl" asChild>
            <a href="#gallery">View Portfolio</a>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
