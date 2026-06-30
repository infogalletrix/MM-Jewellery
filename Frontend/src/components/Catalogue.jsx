import { useState, useEffect } from 'react';
import Footer from './Footer';
import Nav from './Nav';

// Import assets
import c1Img from '../assets/0.png';

const apiHost = window.location.hostname;
const BACKEND_URL = `http://${apiHost}:5005`;

export default function Catalogue() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Select");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [collectionFilter, setCollectionFilter] = useState(() => {
    const hash = window.location.hash;
    const match = hash.match(/[?&]collection=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : "All";
  });
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/products`);
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
                image: p.imageIds && p.imageIds.length > 0 ? `${BACKEND_URL}/api/admin/images/${p.imageIds[0]}` : null,
                badgeLeft: p.customBadge || "",
                badgeRight: discPercent > 0 ? `${discPercent}% OFF` : "",
                collection: p.collectionName || ""
              };
            });
            setProducts(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to fetch live products from backend:", err);
      }
    };

    const fetchFilters = async () => {
      try {
        const catRes = await fetch(`${BACKEND_URL}/api/categories`);
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }

      try {
        const colRes = await fetch(`${BACKEND_URL}/api/collections`);
        if (colRes.ok) {
          const colData = await colRes.json();
          setCollections(colData);
        }
      } catch (err) {
        console.error("Failed to fetch collections:", err);
      }
    };

    fetchProducts();
    fetchFilters();
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const match = hash.match(/[?&]collection=([^&]+)/);
      setCollectionFilter(match ? decodeURIComponent(match[1]) : "All");
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleCollectionChange = (val) => {
    setCollectionFilter(val);
    if (val === "All") {
      window.location.hash = "#catalogue";
    } else {
      window.location.hash = `#catalogue?collection=${encodeURIComponent(val)}`;
    }
  };

  // Dynamic categories list, with fallback to unique categories in products when offline/empty
  const displayCategories = categories.length > 0
    ? categories.map(cat => cat.name)
    : Array.from(new Set(products.map(p => p.category))).filter(Boolean).reduce((acc, cat) => {
        if (!acc.some(c => c.toLowerCase() === cat.toLowerCase())) {
          acc.push(cat);
        }
        return acc;
      }, []);

  // Dynamic collections list, with fallback to unique collections in products when offline/empty
  const displayCollections = collections.length > 0
    ? collections.map(col => col.name)
    : Array.from(new Set(products.map(p => p.collection))).filter(Boolean).reduce((acc, col) => {
        if (!acc.some(c => c.toLowerCase() === col.toLowerCase())) {
          acc.push(col);
        }
        return acc;
      }, []);

  // Extract custom badges found dynamically on products fetched from database
  const displayBadges = Array.from(
    new Set(products.map(p => p.badgeLeft).filter(Boolean))
  ).reduce((acc, badge) => {
    if (!acc.some(b => b.toLowerCase() === badge.toLowerCase())) {
      acc.push(badge);
    }
    return acc;
  }, []);

  // Filter products based on search term, category, collection, and custom badge options
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "All" || product.category.toLowerCase() === categoryFilter.toLowerCase();
    
    const matchesCollection = collectionFilter === "All" || (product.collection && product.collection.toLowerCase() === collectionFilter.toLowerCase());

    const isCustomBadge = displayBadges.some(b => b.toLowerCase() === sortBy.toLowerCase());
    const matchesCustom = !isCustomBadge || (product.badgeLeft && product.badgeLeft.toLowerCase() === sortBy.toLowerCase());

    return matchesSearch && matchesCategory && matchesCollection && matchesCustom;
  });

  // Sort the filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "lowToHigh") {
      return a.price - b.price;
    } else if (sortBy === "highToLow") {
      return b.price - a.price;
    }
    return 0;
  });

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
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>

        <div className="container mx-auto z-10 flex flex-col justify-center items-start text-left max-w-4xl">
          <div className="max-w-2xl w-full flex flex-col">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4 text-center w-full">
              Jewellery Catalogue
            </h1>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed font-light font-sans text-left">
              Browse our complete collection of premium guarantee imitation jewellery
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar Section */}
      <section className="bg-white py-10 px-6 md:px-12 lg:px-24 border-b border-gray-100">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 justify-start items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Search Jewellery" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-gold-500 focus:bg-white transition-colors"
              />
            </div>

            {/* Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700 focus:outline-none focus:border-gold-500 focus:bg-white transition-colors"
              >
                <option value="All">All Categories</option>
                {displayCategories.map(catName => (
                  <option key={catName} value={catName}>{catName}</option>
                ))}
              </select>

              <select 
                value={collectionFilter}
                onChange={(e) => handleCollectionChange(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700 focus:outline-none focus:border-gold-500 focus:bg-white transition-colors"
              >
                <option value="All">All Collections</option>
                {displayCollections.map(colName => (
                  <option key={colName} value={colName}>{colName}</option>
                ))}
              </select>

              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700 focus:outline-none focus:border-gold-500 focus:bg-white transition-colors"
              >
                <option value="Select">Select</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
                {displayBadges.map(badgeName => (
                  <option key={badgeName} value={badgeName}>{badgeName}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue Cards Grid */}
      <section className="bg-white py-16 px-6 md:px-12 lg:px-24 flex-grow">
        <div className="container mx-auto">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {sortedProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[362/336] w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {/* Absolute Badges */}
                    {product.badgeLeft && (
                      <span className="absolute top-4 left-4 z-10 bg-white text-black font-semibold text-[10px] px-2.5 py-1 rounded tracking-wider uppercase shadow-sm">
                        {product.badgeLeft}
                      </span>
                    )}
                    {product.badgeRight && (
                      <span className="absolute top-4 right-4 z-10 bg-[#ab8d6d]/90 text-white font-medium text-[10px] px-2.5 py-1 rounded tracking-wider">
                        {product.badgeRight}
                      </span>
                    )}

                    {/* Product Image */}
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700" 
                      />
                    ) : (
                      /* Blank placeholder if image not found */
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 text-xs font-light">
                        No Image Available
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="p-4 sm:p-6 flex flex-col flex-grow">
                    <span className="text-[#e28743] text-xs font-semibold uppercase tracking-wider mb-2 block font-sans">
                      {product.category}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-gray-900 mb-4 line-clamp-1">
                      {product.title}
                    </h3>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-baseline">
                        {product.originalPrice && (
                          <span className="text-gray-400 line-through text-xs mr-2 font-sans">
                            ₹ {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-gray-900 font-bold text-base font-serif">
                          ₹ {product.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors duration-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </svg>
                        </button>
                        <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-black hover:border-black transition-colors duration-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                        </button>
                        <a 
                          href={`https://wa.me/919876543210?text=Hello,%20I%20am%20interested%20in%20purchasing%20the%20${encodeURIComponent(product.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-[#25D366] hover:border-[#25D366] transition-colors duration-300"
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
          )}
        </div>
      </section>

      {/* Footer component */}
      <Footer />
    </div>
  );
}
