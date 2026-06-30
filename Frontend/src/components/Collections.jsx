import { useState, useEffect } from 'react';
import Footer from './Footer';
import Nav from './Nav';

// Import assets
import c1Img from '../assets/0.png';

const apiHost = window.location.hostname;
const BACKEND_URL = `http://${apiHost}:5005`;

export default function Collections() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/collections`);
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map(c => ({
            id: c.id,
            title: c.name,
            description: c.description || 'No description provided.',
            image: c.imageId ? `${BACKEND_URL}/api/admin/images/${c.imageId}` : null,
            badge: c.badge || ''
          }));
          setCollections(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch collections:", err);
      }
    };
    fetchCollections();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans select-none">
      {/* Navigation Header */}
      <Nav />

      {/* Hero Banner Section */}
      <section 
        className="w-full bg-cover bg-center py-20 px-6 md:px-12 lg:px-24 flex items-center relative"
        style={{ 
          backgroundImage: `url(${c1Img})`,
          minHeight: '280px'
        }}
      >
        <div className="absolute inset-0 bg-black/15 z-0 pointer-events-none"></div>

        <div className="container mx-auto z-10 flex flex-col justify-center items-start text-left max-w-4xl">
          <div className="max-w-2xl w-full flex flex-col">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4 text-center w-full">
              Our Collections
            </h1>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed font-light font-sans text-left">
              Browse our complete collection of premium guarantee imitation jewellery
            </p>
          </div>
        </div>
      </section>

      {/* Collections Cards Grid */}
      <section className="bg-white py-20 px-6 md:px-12 lg:px-24 flex-grow">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((col) => (
              <div 
                key={col.id} 
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                {/* Image Section */}
                <div className="aspect-square w-full overflow-hidden">
                  {col.image ? (
                    <img 
                      src={col.image} 
                      alt={col.title} 
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-sans font-light">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Dark Bronze Content Section */}
                <div className="bg-gradient-to-b from-[#8c624c] to-[#4c3222] text-white p-6 flex flex-col flex-grow items-start justify-start min-h-[220px]">
                  <h3 className="font-serif text-lg md:text-xl font-medium text-white mb-2">
                    {col.title}
                  </h3>
                  <p className="text-white/85 text-xs md:text-sm font-light font-sans leading-relaxed mb-4">
                    {col.description}
                  </p>

                  {/* Red Pill Badge */}
                  <div className="mb-4">
                    <span className="bg-[#e53e3e] text-white text-[10px] md:text-xs font-medium px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                      {col.badge}
                    </span>
                  </div>

                  {/* View Collection Link */}
                  <div className="mt-auto">
                    <a 
                      href={`#catalogue?collection=${encodeURIComponent(col.title)}`} 
                      className="inline-flex items-center text-white hover:text-gold-400 text-xs md:text-sm font-semibold transition-colors duration-300 group"
                    >
                      View Collection
                      <svg 
                        className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1.5 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth={2}
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </a>
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
