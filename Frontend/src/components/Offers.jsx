import { useState, useEffect } from 'react';
import Footer from './Footer';
import Nav from './Nav';

// Import assets
import offersHeroImg from '../assets/0.png';

// Offers Data
const offersData = [
  {
    id: 1,
    title: "Bridal Season Sale",
    badge: "25% OFF",
    description: "Flat 25% off on all bridal sets. Make your dream wedding look affordable.",
    date: "01 Jan - 31 Dec 2026",
    category: "Bridal Set"
  },
  {
    id: 2,
    title: "Festive Diwali Offer",
    badge: "15% OFF",
    description: "Celebrate Diwali with dazzling jewellery. Special discounts on traditional and party wear collections.",
    date: "01 Oct - 15 Nov 2026",
    category: "Traditional Jewellery, Party Wear Jewellery"
  },
  {
    id: 3,
    title: "New Arrival Flash Sale",
    badge: "20% OFF",
    description: "Get 15% off on all new arrivals this month. Grab the latest designs before they sell out.",
    date: "01 Jul - 31 Jul 2026",
    category: "Traditional Jewellery, Party Wear Jewellery"
  },
  {
    id: 4,
    title: "Combo Offer – Buy 3 Save More",
    badge: "10% OFF",
    description: "Purchase any 3 jewellery pieces and get flat ₹1,000 off on your total. Mix and match from any collection.",
    date: "01 Jan - 31 Dec 2026",
    category: "Traditional Jewellery, Party Wear Jewellery"
  }
];

export default function Offers() {
  const [offers, setOffers] = useState(offersData);

  useEffect(() => {
    const fetchOffersAndProducts = async () => {
      try {
        const apiHost = window.location.hostname;
        const productsRes = await fetch(`http://${apiHost}:5005/api/products`);
        let liveProducts = [];
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          liveProducts = productsData.map(p => ({
            id: p.id,
            category: p.categoryName
          }));
        }

        const res = await fetch(`http://${apiHost}:5005/api/offers`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            const mapped = data.map(o => {
              const startDate = new Date(o.startDate);
              const endDate = new Date(o.endDate);
              const startDateStr = startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
              const endDateStr = endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
              
              // Find linked product categories
              const linkedProds = liveProducts.filter(p => o.applicableProductIds.includes(p.id));
              const categories = Array.from(new Set(linkedProds.map(p => p.category))).filter(Boolean).join(", ") || "All Jewellery";
              
              return {
                id: o.id,
                title: o.name,
                badge: `${o.discountPercent}% OFF`,
                description: `Enjoy a flat ${o.discountPercent}% off on our curated ${categories.toLowerCase()} selection. Limited time offer!`,
                date: `${startDateStr} - ${endDateStr}`,
                category: categories
              };
            });
            setOffers(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to fetch live offers:", err);
      }
    };

    fetchOffersAndProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-black flex flex-col font-sans select-none">
      {/* Navigation Header */}
      <Nav />

      {/* Hero Banner Section */}
      <section 
        className="w-full bg-cover bg-center py-20 px-6 md:px-12 lg:px-24 flex items-center relative"
        style={{ 
          backgroundImage: `url(${offersHeroImg})`,
          minHeight: '280px'
        }}
      >
        <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>

        <div className="container mx-auto z-10 flex flex-col justify-center items-start text-left max-w-4xl">
          <div className="max-w-2xl w-full flex flex-col">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4 text-center w-full">
              Special Offers
            </h1>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed font-light font-sans text-left">
              Exclusive deals on our premium guarantee imitation jewellery
            </p>
          </div>
        </div>
      </section>

      {/* Offers Cards Grid */}
      <section className="py-20 px-6 md:px-12 lg:px-24 flex-grow bg-[#fcfbf9]">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offers.map((offer) => (
              <div 
                key={offer.id} 
                className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Title & Badge Row */}
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="font-serif text-lg md:text-xl font-bold text-gray-900 leading-tight">
                      {offer.title}
                    </h3>
                    <span className="bg-[#e53e3e] text-white text-[10px] md:text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap shrink-0">
                      {offer.badge}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-xs md:text-sm font-light font-sans leading-relaxed mb-6">
                    {offer.description}
                  </p>
                </div>

                <div>
                  {/* Meta items: Date and Category */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5 mb-6 text-xs text-gray-500 font-sans">
                    {/* Date Info */}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      <span>{offer.date}</span>
                    </div>

                    {/* Category Info */}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 003.182 0l4.318-4.318a2.25 2.25 0 000-3.182L11.16 3.659A2.25 2.25 0 009.568 3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h.008v.008H6V7.5z" />
                      </svg>
                      <span className="text-right max-w-[200px] truncate" title={offer.category}>
                        {offer.category}
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Button */}
                  <div>
                    <a 
                      href={`https://wa.me/919876543210?text=Hello,%20I%20am%20interested%20in%20inquiring%20about%20the%20${encodeURIComponent(offer.title)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-[#25D366] hover:bg-[#1fba55] text-white font-semibold text-xs md:text-sm px-5 py-2.5 rounded-lg transition-colors duration-300 gap-2 shadow-sm font-sans"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.628 3.825 14.16 2.8 11.535 2.8c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.453 3.39 1.31 4.88L2.012 21.9l4.635-1.746z"/>
                      </svg>
                      Inquire on WhatsApp
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
