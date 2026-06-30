import Footer from './Footer';
import Nav from './Nav';
import { useState, useEffect } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [banners, setBanners] = useState([]);
  const [showAllCollections, setShowAllCollections] = useState(false);
  const [showAllFeatured, setShowAllFeatured] = useState(false);
  const [showAllNewArrivals, setShowAllNewArrivals] = useState(false);

  useEffect(() => {
    const apiHost = window.location.hostname;

    const fetchProducts = async () => {
      try {
        const res = await fetch(`http://${apiHost}:5005/api/products`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            const mapped = data.map(p => {
              const discPercent = p.discount || 0;
              const originalPrice = discPercent > 0 ? Number(p.price) : null;
              const sellingPrice = discPercent > 0 ? Number(p.price) * (1 - discPercent / 100) : Number(p.price);
              return {
                id: p.id,
                title: p.name,
                category: p.categoryName,
                price: sellingPrice,
                originalPrice: originalPrice,
                image: p.imageIds && p.imageIds.length > 0 ? `http://${apiHost}:5005/api/admin/images/${p.imageIds[0]}` : null,
                badgeLeft: p.customBadge || "",
                badgeRight: discPercent > 0 ? `${discPercent}% OFF` : "",
                collection: p.collectionName || "",
                isFeatured: p.isFeatured || false,
                isNewArrival: p.isNewArrival || false
              };
            });
            setProducts(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to fetch live products on Home:", err);
      }
    };

    const fetchCollections = async () => {
      try {
        const res = await fetch(`http://${apiHost}:5005/api/collections`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            const mapped = data.map(c => ({
              id: c.id,
              title: c.name,
              description: c.description || 'No description provided.',
              image: c.imageId ? `http://${apiHost}:5005/api/admin/images/${c.imageId}` : null,
              badge: c.badge || ''
            }));
            setCollections(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to fetch live collections on Home:", err);
      }
    };

    const fetchBanners = async () => {
      try {
        const res = await fetch(`http://${apiHost}:5005/api/banners`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setBanners(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch live banners on Home:", err);
      }
    };

    fetchProducts();
    fetchCollections();
    fetchBanners();
  }, []);
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none">
      {/* Navigation Header */}
      <Nav />

      {/* Hero Section */}
      {(() => {
        const homepageBanner = banners.find(b => b.bannerType === 'Homepage Banner');
        let subtitle = "Guarantee Imitation Jewellery";
        let title1 = "Shine Like ";
        let titleGold = "Royalty,";
        let title2 = "Without the Heavy Price.";
        let description = "Premium imitation jewellery crafted with precision — necklaces, bridal sets, bangles and earrings, designed to elevate every occasion.";
        let badge1 = "6 Month Guarantee";
        let badge2 = "6 Premium Polish";

        if (homepageBanner) {
          if (homepageBanner.name.includes('|')) {
            const parts = homepageBanner.name.split('|');
            subtitle = parts[0] || subtitle;
            title1 = parts[1] || "";
            titleGold = parts[2] || "";
            title2 = parts[3] || "";
            description = parts[4] || description;
            badge1 = parts[5] || badge1;
            badge2 = parts[6] || badge2;
          } else {
            title1 = homepageBanner.name;
            titleGold = "";
            title2 = "";
          }
        }

        return (
          <main 
            className="flex-grow w-full relative bg-cover bg-center flex items-center min-h-[calc(100vh-84px)]"
            style={
              homepageBanner
                ? { backgroundImage: `url(${homepageBanner.imageUrl})` }
                : { background: 'linear-gradient(135deg, #120e0a 0%, #1a1510 50%, #0a0806 100%)' }
            }
          >
            {/* Subtle Dark Overlay to balance visibility */}
            <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none"></div>

            {/* Content Container */}
            <div className="container mx-auto px-6 md:px-16 lg:px-24 py-16 md:py-24 z-10 flex flex-col justify-between h-full relative">
              <div className="max-w-2xl mt-8">
                {/* Top Subtitle */}
                <span className="text-gray-300 font-sans tracking-[0.25em] text-xs md:text-sm uppercase font-semibold mb-5 block">
                  {subtitle}
                </span>

                {/* Main Header */}
                <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-medium text-white leading-tight mb-6">
                  {title1}
                  {titleGold && (
                    <span className="text-gold-400 font-serif">{titleGold}</span>
                  )}
                  {title2 && (
                    <>
                      <br className="hidden sm:inline" />
                      {title2}
                    </>
                  )}
                </h1>

                {/* Description */}
                <p className="text-gray-300/90 text-sm sm:text-base md:text-lg max-w-xl mb-10 leading-relaxed font-light font-sans">
                  {description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-16">
                  {/* Explore Collection Button */}
                  <a 
                    href={homepageBanner?.linkUrl || "#collections"} 
                    className="inline-flex items-center justify-center bg-white text-black font-semibold px-8 py-3.5 rounded-lg hover:bg-gold-400 hover:text-black transition-all duration-300 shadow-xl group text-sm md:text-base"
                  >
                    Explore Collection
                    <svg 
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1.5 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>

                  {/* WhatsApp Enquiry Button */}
                  <a 
                    href="https://wa.me/919999999999" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center border border-gold-400/50 bg-black/40 hover:bg-gold-400/10 text-white font-medium px-8 py-3.5 rounded-lg transition-all duration-300 backdrop-blur-sm text-sm md:text-base"
                  >
                    {/* Custom WhatsApp SVG Icon */}
                    <svg 
                      className="w-5 h-5 mr-2 text-[#25D366] fill-current" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12.031 2c-5.514 0-9.989 4.478-9.989 9.99 0 1.763.459 3.483 1.332 5.006L2 22l5.143-1.348c1.477.807 3.136 1.233 4.884 1.233 5.514 0 9.99-4.478 9.99-9.99 0-5.514-4.476-9.99-9.988-9.99zm5.736 14.281c-.246.693-1.427 1.353-1.954 1.412-.477.053-.93.245-3.031-.628-2.656-1.104-4.331-3.79-4.464-3.967-.132-.177-1.081-1.441-1.081-2.75 0-1.309.68-1.954.921-2.217.241-.263.528-.329.704-.329.176 0 .352.001.505.009.158.007.371-.059.581.451.216.528.739 1.804.805 1.936.066.132.11.286.022.462-.088.176-.132.286-.264.44-.132.154-.277.344-.396.462-.132.132-.271.277-.116.544.154.264.685 1.134 1.472 1.835.986.88 1.815 1.155 2.079 1.287.264.132.418.11.572-.066.154-.176.66-.77.836-1.034.176-.264.352-.22.594-.132.241.088 1.54.726 1.804.858.264.132.44.198.505.308.067.11.067.638-.179 1.331z"/>
                    </svg>
                    WhatsApp Enquiry
                  </a>
                </div>
              </div>

              {/* Bottom Badges */}
              <div className="flex flex-wrap gap-x-8 gap-y-2 mt-auto text-sm tracking-[0.15em] text-white/90">
                <div className="flex items-center gap-2">
                  <span className="text-gold-400 font-bold text-lg">★</span>
                  <span className="uppercase font-medium">{badge1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gold-400 font-bold text-lg">★</span>
                  <span className="uppercase font-medium">{badge2}</span>
                </div>
              </div>
            </div>
          </main>
        );
      })()}

      {/* Second Page Top Rose Bar */}
      <div className="w-full h-8 bg-[#966363] shrink-0 z-10 relative"></div>

      {/* Features Bar */}
      <section className="bg-[#ede4da] text-[#2c221e] py-8 border-t border-[#dfd6cc] z-10 relative">
        <div className="container mx-auto px-6 md:px-16 lg:px-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 text-center">
            {/* Feature 1 */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent border border-[#2c221e]/20 mb-2">
                <svg className="w-5 h-5 text-[#2c221e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="font-serif text-sm md:text-base font-semibold tracking-wide">Guarantee Quality</h3>
              <p className="text-xs text-[#2c221e]/70 mt-1">Tested premium Finish</p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent border border-[#2c221e]/20 mb-2">
                <svg className="w-5 h-5 text-[#2c221e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="font-serif text-sm md:text-base font-semibold tracking-wide">Latest Designs</h3>
              <p className="text-xs text-[#2c221e]/70 mt-1">Fresh drops every week</p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent border border-[#2c221e]/20 mb-2">
                <svg className="w-5 h-5 text-[#2c221e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="font-serif text-sm md:text-base font-semibold tracking-wide">Pan-India Enquiry</h3>
              <p className="text-xs text-[#2c221e]/70 mt-1">WhatsApp delivery support</p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent border border-[#2c221e]/20 mb-2">
                <svg className="w-5 h-5 text-[#2c221e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="font-serif text-sm md:text-base font-semibold tracking-wide">Instant Support</h3>
              <p className="text-xs text-[#2c221e]/70 mt-1">Chat on WhatsApp</p>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Collections Section */}
      <section id="collections" className="bg-white text-black py-20 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <span className="text-[#aa7c11] font-medium text-sm md:text-base tracking-wider uppercase block mb-3 font-serif">
                Curated Collections
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight">
                Discover Our Signature Lines
              </h2>
            </div>
            <div>
              {collections.length > 3 && (
                <button 
                  onClick={() => setShowAllCollections(!showAllCollections)}
                  className="inline-flex items-center text-gray-500 hover:text-gold-600 font-semibold text-xs tracking-wider uppercase transition-all duration-300 group cursor-pointer"
                >
                  {showAllCollections ? 'see less' : 'view all'}
                  <span className={`ml-1 transform transition-transform duration-300 ${showAllCollections ? '-rotate-90' : 'group-hover:translate-x-0.5'}`}>
                    &gt;
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(showAllCollections ? collections : collections.slice(0, 3)).map(col => (
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
                    {col.badge && (
                      <span className="bg-[#e53e3e] text-white text-[10px] md:text-xs font-medium px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                        {col.badge}
                      </span>
                    )}
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
            {collections.length === 0 && (
              <div className="col-span-full text-center py-12 text-neutral-500 font-light text-sm bg-neutral-50 border border-gray-100 rounded-2xl">
                No collections available.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="bg-white text-black pb-20 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <span className="text-[#aa7c11] font-medium text-sm md:text-base tracking-wider uppercase block mb-3 font-serif">
                Handpicked pieces
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight">
                Featured Collection
              </h2>
            </div>
            <div>
              {products.filter(p => p.isFeatured).length > 3 && (
                <button 
                  onClick={() => setShowAllFeatured(!showAllFeatured)}
                  className="inline-flex items-center text-gray-500 hover:text-gold-600 font-semibold text-xs tracking-wider uppercase transition-all duration-300 group cursor-pointer"
                >
                  {showAllFeatured ? 'show less' : 'view all'}
                  <span className={`ml-1 transform transition-transform duration-300 ${showAllFeatured ? '-rotate-90' : 'group-hover:translate-x-0.5'}`}>
                    &gt;
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.filter(p => p.isFeatured).length === 0 && (
              <div className="col-span-full text-center py-12 text-neutral-500 font-light text-sm bg-neutral-50 border border-gray-100 rounded-2xl">
                No featured products yet. Mark products as featured in the Admin Dashboard.
              </div>
            )}
            {(showAllFeatured ? products.filter(p => p.isFeatured) : products.filter(p => p.isFeatured).slice(0, 3)).map(product => (
              <div key={product.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="relative aspect-square w-full overflow-hidden bg-gray-50 flex items-center justify-center">
                  {product.badgeLeft && (
                    <span className="absolute top-4 left-4 z-10 bg-black text-white font-semibold text-[10px] px-2.5 py-1 rounded tracking-wider uppercase shadow-sm font-sans">
                      {product.badgeLeft}
                    </span>
                  )}
                  {product.badgeRight && (
                    <span className="absolute top-4 right-4 z-10 bg-[#ab8d6d]/90 text-white font-medium text-[10px] px-2.5 py-1 rounded tracking-wider font-sans">
                      {product.badgeRight}
                    </span>
                  )}
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-sans font-light">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-6 flex flex-col flex-grow text-left">
                  <span className="text-[#e28743] text-xs font-semibold uppercase tracking-wider mb-2 block font-sans">
                    {product.category ? product.category.toUpperCase() : ""}
                  </span>
                  <h3 className="font-serif text-base md:text-lg font-bold text-gray-900 mb-4 line-clamp-1">
                    {product.title}
                  </h3>
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-baseline">
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through text-xs mr-2 font-sans">
                          ₹ {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-gray-900 font-bold text-sm md:text-base font-serif">
                        ₹ {product.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500 hover:bg-white transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      </button>
                      <button className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 hover:text-black hover:border-black hover:bg-white transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </button>
                      <a 
                        href={`https://wa.me/919999999999?text=Hello,%20I%20am%20interested%20in%20purchasing%20the%2520${encodeURIComponent(product.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#25D366] hover:border-[#25D366] hover:bg-white transition-all duration-300"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.628 3.825 14.16 2.8 11.535 2.8c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.453 3.39 1.31 4.88L2.012 21.9l4.635-1.746z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pieces Section (New Arrivals) */}
      <section id="catalogue" className="bg-white text-black pb-24 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <span className="font-serif italic text-gray-500 text-sm tracking-wide lowercase block mb-1">
                latest pieces
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 leading-tight">
                New Arrivals
              </h2>
            </div>
            <div>
              {products.filter(p => p.isNewArrival).length > 3 && (
                <button 
                  onClick={() => setShowAllNewArrivals(!showAllNewArrivals)}
                  className="inline-flex items-center text-gray-500 hover:text-gold-600 font-semibold text-xs tracking-wider uppercase transition-all duration-300 group cursor-pointer"
                >
                  {showAllNewArrivals ? 'show less' : 'view all'}
                  <span className={`ml-1 transform transition-transform duration-300 ${showAllNewArrivals ? '-rotate-90' : 'group-hover:translate-x-0.5'}`}>
                    &gt;
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {products.filter(p => p.isNewArrival).length === 0 && (
              <div className="col-span-full text-center py-12 text-neutral-500 font-light text-sm bg-neutral-50 border border-gray-100 rounded-2xl">
                No new arrivals yet. Mark products as new arrivals in the Admin Dashboard.
              </div>
            )}
            {(showAllNewArrivals ? products.filter(p => p.isNewArrival) : products.filter(p => p.isNewArrival).slice(0, 3)).map(product => (
              <div key={product.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="relative aspect-square w-full overflow-hidden bg-gray-50 flex items-center justify-center">
                  {product.badgeLeft && (
                    <span className="absolute top-4 left-4 z-10 bg-black text-white font-semibold text-[10px] px-2.5 py-1 rounded tracking-wider uppercase shadow-sm font-sans">
                      {product.badgeLeft}
                    </span>
                  )}
                  {product.badgeRight && (
                    <span className="absolute top-4 right-4 z-10 bg-[#ab8d6d]/90 text-white font-medium text-[10px] px-2.5 py-1 rounded tracking-wider font-sans">
                      {product.badgeRight}
                    </span>
                  )}
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-sans font-light">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-6 flex flex-col flex-grow text-left">
                  <span className="text-[#e28743] text-xs font-semibold uppercase tracking-wider mb-2 block font-sans">
                    {product.category ? product.category.toUpperCase() : ""}
                  </span>
                  <h3 className="font-serif text-base md:text-lg font-bold text-gray-900 mb-4 line-clamp-1">
                    {product.title}
                  </h3>
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-baseline">
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through text-xs mr-2 font-sans">
                          ₹ {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-gray-900 font-bold text-sm md:text-base font-serif">
                        ₹ {product.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500 hover:bg-white transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      </button>
                      <button className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 hover:text-black hover:border-black hover:bg-white transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </button>
                      <a 
                        href={`https://wa.me/919999999999?text=Hello,%20I%20am%20interested%20in%20purchasing%20the%2520${encodeURIComponent(product.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#25D366] hover:border-[#25D366] hover:bg-white transition-all duration-300"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.953-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.628 3.825 14.16 2.8 11.535 2.8c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.453 3.39 1.31 4.88L2.012 21.9l4.635-1.746z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Offers grid */}
          {(() => {
            const promoBanners = banners.filter(b => b.bannerType !== "Homepage Banner");
            if (promoBanners.length === 0) {
              return (
                <div className="col-span-full text-center py-8 text-neutral-500 font-light text-sm bg-neutral-50 border border-gray-100 rounded-2xl mb-12">
                  No active promotional offers.
                </div>
              );
            }

            const leftBanner = promoBanners[0];
            const rightBanners = promoBanners.slice(1);

            const renderContent = (banner) => {
              const parts = banner.name.split('|');
              const discountText = parts.length > 1 ? parts[0] : null;
              const title = parts.length > 1 ? parts[1] : banner.name;

              return (
                <div className="absolute inset-0 flex flex-col justify-center p-8 lg:p-12 z-10 text-left w-full lg:w-2/3">
                  {discountText && (
                    <span className="bg-[#e63946] text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full tracking-wider w-max mb-4 shadow-sm">
                      {discountText}
                    </span>
                  )}
                  <h3 className="font-serif text-2xl lg:text-3xl font-medium text-white mb-4 leading-snug drop-shadow-md">
                    {title}
                  </h3>
                  <a 
                    href={banner.linkUrl || "#"} 
                    className="text-white font-medium text-sm flex items-center gap-2 group/btn hover:text-gold-400 transition-colors tracking-wider w-max"
                  >
                    shop Now
                    <span className="transform group-hover/btn:translate-x-1 transition-transform duration-300 font-sans">→</span>
                  </a>
                </div>
              );
            };

            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                {/* Left Large Banner */}
                {leftBanner && (
                  <div className="relative overflow-hidden rounded-2xl min-h-[300px] lg:min-h-[504px] group">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${leftBanner.imageUrl})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent transition-opacity duration-300 group-hover:bg-black/50" />
                    {renderContent(leftBanner)}
                  </div>
                )}

                {/* Right Stacked Banners */}
                {rightBanners.length > 0 && (
                  <div className="flex flex-col gap-6 h-full">
                    {rightBanners.map((banner) => (
                      <div key={banner.id} className="relative overflow-hidden rounded-2xl flex-1 min-h-[240px] group">
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                          style={{ backgroundImage: `url(${banner.imageUrl})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent transition-opacity duration-300 group-hover:bg-black/50" />
                        {renderContent(banner)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Centered CTA button */}
          <div className="flex justify-center mb-12">
            <a 
              href="#offers" 
              className="inline-flex items-center justify-center bg-[#a27b38] hover:bg-black text-white hover:text-[#a27b38] border border-transparent hover:border-[#a27b38] font-serif text-sm px-10 py-3.5 rounded-lg transition-all duration-300 font-semibold"
            >
              View All Offers
              <span className="ml-1.5">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Trust & Quality Section (black background) */}
      <section className="bg-black text-white py-24 px-6 md:px-12 lg:px-24 border-t border-white/5">
        <div className="container mx-auto">
          <p className="text-gray-400 text-xs tracking-[0.25em] uppercase text-center mb-16 font-sans">
            Trust, quality, and elegance in every piece
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-16 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-5 text-[#a27b38] bg-white/5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12l4 6-10 12L2 9z" />
                </svg>
              </div>
              <h4 className="font-serif text-sm md:text-base font-semibold text-white mb-2 tracking-wide">
                A wide selection of sizes
              </h4>
              <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed font-sans max-w-[280px]">
                Find the perfect fit for your style and occasion.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-5 text-[#a27b38] bg-white/5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c-.195-.39-.587-.628-1.023-.628s-.828.238-1.023.63L7.357 7.636l-4.57.664c-.43.063-.787.35-.928.756a1.03 1.03 0 00.26 1.077l3.307 3.223-.78 4.552c-.073.43.097.868.442 1.138a1.03 1.03 0 001.076.082l4.088-2.15 4.088 2.15a1.03 1.03 0 001.076-.082c.345-.27.515-.708.442-1.138l-.78-4.552 3.307-3.223a1.03 1.03 0 00.26-1.077c-.14-.406-.498-.693-.928-.756l-4.57-.664-2.078-4.137z" />
                </svg>
              </div>
              <h4 className="font-serif text-sm md:text-base font-semibold text-white mb-2 tracking-wide">
                Premium materials used
              </h4>
              <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed font-sans max-w-[280px]">
                Crafted with highest quality alloys and stones.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-5 text-[#a27b38] bg-white/5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h4 className="font-serif text-sm md:text-base font-semibold text-white mb-2 tracking-wide">
                Shop with absolute confidence
              </h4>
              <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed font-sans max-w-[280px]">
                Backed by our 6-month guarantee on all pieces.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-5 text-[#a27b38] bg-white/5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <h4 className="font-serif text-sm md:text-base font-semibold text-white mb-2 tracking-wide">
                7-day returns
              </h4>
              <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed font-sans max-w-[280px]">
                Hassle-free exchange or return if you're not satisfied.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-5 text-[#a27b38] bg-white/5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="font-serif text-sm md:text-base font-semibold text-white mb-2 tracking-wide">
                Direct chat support
              </h4>
              <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed font-sans max-w-[280px]">
                Connect with us on WhatsApp for personal assistance.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-5 text-[#a27b38] bg-white/5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h4 className="font-serif text-sm md:text-base font-semibold text-white mb-2 tracking-wide">
                Made with love
              </h4>
              <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed font-sans max-w-[280px]">
                Each piece is handpicked and designed with care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (white background) */}
      <section className="bg-white text-black py-24 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-center text-gray-900 mb-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 text-xs tracking-wider uppercase text-center mb-16 font-sans">
            Real experiences from our valued customers
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="border border-gray-150 rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
              <div>
                {/* 5 Stars */}
                <div className="flex text-gold-500 gap-0.5 mb-4">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <p className="text-gray-600 font-sans font-light text-sm italic leading-relaxed mb-6 text-left">
                  "The bridal set I purchased from MM Jewellery was absolutely stunning! Everyone at the wedding thought it was real gold. The quality and finish are truly premium."
                </p>
              </div>
              <div className="text-left">
                <span className="font-serif text-sm font-semibold text-gray-900 block">Priya Menon</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Kochi</span>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="border border-gray-150 rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
              <div>
                {/* 5 Stars */}
                <div className="flex text-gold-500 gap-0.5 mb-4">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <p className="text-gray-600 font-sans font-light text-sm italic leading-relaxed mb-6 text-left">
                  "I love how affordable yet elegant their jewellery is. The guarantee gives me confidence, and the WhatsApp inquiry made the process so smooth and personal."
                </p>
              </div>
              <div className="text-left">
                <span className="font-serif text-sm font-semibold text-gray-900 block">Anita Sharma</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Mumbai</span>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="border border-gray-150 rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
              <div>
                {/* 5 Stars */}
                <div className="flex text-gold-500 gap-0.5 mb-4">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <p className="text-gray-600 font-sans font-light text-sm italic leading-relaxed mb-6 text-left">
                  "My go-to for party wear jewellery! The modern selection is gorgeous, and the polish quality lasts for a really long time. Highly recommended for anyone wanting luxury looks."
                </p>
              </div>
              <div className="text-left">
                <span className="font-serif text-sm font-semibold text-gray-900 block">Lakshmi Nair</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Trivandrum</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

