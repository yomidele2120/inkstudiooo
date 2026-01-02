import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const galleryItems = [
  { src: gallery1, alt: "Fine line botanical tattoo", category: "Fine Line" },
  { src: gallery2, alt: "Japanese dragon sleeve", category: "Japanese" },
  { src: gallery3, alt: "Geometric blackwork", category: "Blackwork" },
  { src: gallery4, alt: "Minimalist script", category: "Minimalist" },
  { src: gallery5, alt: "Neo-traditional portrait", category: "Neo-Traditional" },
  { src: gallery6, alt: "Realism portrait", category: "Realism" },
];

const Gallery = () => {
  return (
    <section id="gallery" className="py-24 bg-charcoal noise-overlay">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Portfolio</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Recent Work
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A curated selection of custom tattoo designs, each piece telling a unique story 
            through ink and artistry.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-secondary aspect-[4/5] cursor-pointer"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/60 transition-all duration-500 flex items-end justify-start p-6">
                <div className="translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-gold text-xs tracking-[0.2em] uppercase mb-2">{item.category}</p>
                  <p className="text-foreground font-display text-xl">{item.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Link */}
        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-gold text-sm font-medium tracking-wider uppercase hover:gap-4 transition-all duration-300"
          >
            View Full Gallery
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
