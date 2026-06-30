import { useState, useEffect } from 'react';
import Footer from './Footer';
import Nav from './Nav';

import galleryHeroImg from '../assets/0.png';

export default function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const apiHost = window.location.hostname;
        const res = await fetch(`http://${apiHost}:5005/api/galleryitems`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const mapped = data.map(item => ({
              id: item.id,
              title: item.title,
              category: item.category,
              image: item.imageUrl
            }));
            setGallery(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to fetch gallery items:", err);
      }
    };

    fetchGalleryData();
  }, []);

  // Filter gallery items
  const filteredItems = gallery.filter(item => {
    if (activeFilter === "ALL") return true;
    return item.category === activeFilter;
  });

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans select-none">
      {/* Navigation Header */}
      <Nav />

      {/* Hero Banner Section */}
      <section 
        className="w-full bg-cover bg-center py-20 px-6 md:px-12 lg:px-24 flex items-center relative"
        style={{ 
          backgroundImage: `url(${galleryHeroImg})`,
          minHeight: '280px'
        }}
      >
        <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>

        <div className="container mx-auto z-10 flex flex-col justify-center items-start text-left max-w-4xl">
          <div className="max-w-2xl w-full flex flex-col">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4 text-center w-full">
              Gallery
            </h1>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed font-light font-sans text-left">
              A visual journey through our jewellery collections and styling inspirations
            </p>
          </div>
        </div>
      </section>

      {/* Filters Area */}
      <section className="bg-white pt-12 pb-6 px-6 md:px-12 lg:px-24 flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {["ALL", "JEWELLERY", "COLLECTIONS", "STORE", "EVENTS"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-1.5 border rounded-sm text-[10px] md:text-xs font-semibold tracking-wider uppercase transition-colors duration-300 ${
                activeFilter === category
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-200 hover:border-black"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Cards Grid */}
      <section className="bg-white pb-20 pt-6 px-6 md:px-12 lg:px-24 flex-grow">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="overflow-hidden rounded-xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 flex flex-col group"
              >
                {/* Image Section */}
                <div className="aspect-square w-full overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                  />
                  {/* Subtle hover overlay with title */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white text-xs md:text-sm font-sans tracking-wide truncate w-full">
                      {item.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer component */}
      <Footer />
    </div>
  );
}
