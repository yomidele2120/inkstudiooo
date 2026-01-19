import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Mail, Instagram } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Get In Touch</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10">
              Whether you have a clear vision or just the spark of an idea, I'd love to hear 
              from you. Book a consultation and let's create something extraordinary together.
            </p>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gold mt-1" />
                <div>
                  <p className="text-foreground font-medium">Studio Location</p>
                  <p className="text-muted-foreground text-sm">123 Art District, Brooklyn, NY 11201</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-gold mt-1" />
                <div>
                  <p className="text-foreground font-medium">Studio Hours</p>
                  <p className="text-muted-foreground text-sm">Tue - Sat: 11:00 AM - 8:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-gold mt-1" />
                <div>
                  <p className="text-foreground font-medium">Phone</p>
                  <p className="text-muted-foreground text-sm">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-gold mt-1" />
                <div>
                  <p className="text-foreground font-medium">Email</p>
                  <p className="text-muted-foreground text-sm">hello@inkstudio.com</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-10 pt-10 border-t border-border">
              <p className="text-muted-foreground text-sm mb-4">Follow My Work</p>
              <a 
                href="#" 
                className="inline-flex items-center gap-2 text-foreground hover:text-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span className="text-sm">@inkstudio</span>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-charcoal p-8 md:p-10 border border-border">
            <h3 className="font-display text-2xl text-foreground mb-6">Book a Consultation</h3>
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm text-muted-foreground mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-muted-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="style" className="block text-sm text-muted-foreground mb-2">
                  Tattoo Style
                </label>
                <select
                  id="style"
                  className="w-full bg-secondary border border-border px-4 py-3 text-foreground focus:outline-none focus:border-gold transition-colors"
                >
                  <option value="">Select a style</option>
                  <option value="fine-line">Fine Line</option>
                  <option value="blackwork">Blackwork</option>
                  <option value="custom">Custom Design</option>
                  <option value="cover-up">Cover-Up</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm text-muted-foreground mb-2">
                  Tell Me About Your Idea
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors resize-none"
                  placeholder="Describe your tattoo idea, placement, size, and any reference images you have..."
                />
              </div>
              <Button variant="hero" size="xl" className="w-full" asChild>
                <a href="https://paystack.com/buy/consultation-cbhizq" target="_blank" rel="noopener noreferrer">
                  Book & Pay Now
                </a>
              </Button>
              <p className="text-muted-foreground text-xs text-center">
                Typically respond within 24-48 hours
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
