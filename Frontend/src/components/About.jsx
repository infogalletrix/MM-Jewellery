import Footer from './Footer';
import Nav from './Nav';

// Import assets
import aboutHeroImg from '../assets/0.png';
import storyImg from '../assets/cz.png';

// Features Data
const featuresData = [
  {
    id: 1,
    text: "Every piece comes with our quality guarantee for lasting beauty",
    icon: (
      <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    )
  },
  {
    id: 2,
    text: "Finest materials and craftsmanship in every jewellery piece",
    icon: (
      <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L12 3L18 12L12 21L6 12Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12H18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3V21" />
      </svg>
    )
  },
  {
    id: 3,
    text: "Luxury looks without the luxury price tag",
    icon: (
      <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" d="M6 4h10M6 8h9M6 4c6 0 6 8 0 8m0 0h9M9 12l8 8" />
      </svg>
    )
  },
  {
    id: 4,
    text: "Trendy collections updated for every season and occasion",
    icon: (
      <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="6" />
        <circle cx="10" cy="10" r="4" />
      </svg>
    )
  },
  {
    id: 5,
    text: "Thousands of happy customers across the country",
    icon: (
      <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    )
  },
  {
    id: 6,
    text: "Quick and personal inquiry process via WhatsApp",
    icon: (
      <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    )
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans select-none">
      {/* Navigation Header */}
      <Nav />

      {/* Hero Banner Section */}
      <section 
        className="w-full bg-cover bg-center py-20 px-6 md:px-12 lg:px-24 flex items-center relative"
        style={{ 
          backgroundImage: `url(${aboutHeroImg})`,
          minHeight: '280px'
        }}
      >
        <div className="absolute inset-0 bg-black/15 z-0 pointer-events-none"></div>

        <div className="container mx-auto z-10 flex flex-col justify-center items-center text-center max-w-4xl">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4">
            Our Story
          </h1>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed font-light font-sans max-w-2xl">
            About MM Jewellery
          </p>
        </div>
      </section>

      {/* Legacy / Story Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Image Column */}
            <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/3] w-full">
              <img 
                src={storyImg} 
                alt="Jewellery Craftsmanship" 
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Right Text Column */}
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                A Legacy of Craftsmanship
              </h2>
              <div className="space-y-5 text-gray-600 text-xs md:text-sm font-light font-sans leading-relaxed">
                <p>
                  Founded in 2018, MM Jewellery has grown from a small family workshop into one of the most trusted names in fine jewellery. Our journey began with a simple belief: that every person deserves to own jewellery that is as unique and precious as the moments it celebrates.
                </p>
                <p>
                  Every piece in our collection is a testament to the skill of our master artisans, who combine centuries-old techniques with contemporary design sensibilities. From the sourcing of ethically mined gemstones to the final polish, we oversee every step of the creation process.
                </p>
                <p>
                  Today, we serve thousands of happy customers across India, helping them find the perfect piece for weddings, anniversaries, festivals, and everyday elegance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="pb-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Our Mission Box */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 flex flex-col justify-start">
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-3">
                Our Mission
              </h3>
              <p className="text-gray-600 text-xs md:text-sm font-light font-sans leading-relaxed">
                To provide exceptional quality jewellery with trusted service, transparent pricing, and a personal touch that makes every customer feel valued. We aim to make luxury accessible without compromising on craftsmanship.
              </p>
            </div>

            {/* Our Vision Box */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 flex flex-col justify-start">
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-3">
                Our Vision
              </h3>
              <p className="text-gray-600 text-xs md:text-sm font-light font-sans leading-relaxed">
                To become India's most beloved and trusted jewellery brand – a name synonymous with quality, elegance, and integrity. We envision a future where every home has a cherished MM Jewellery piece.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="pb-24 px-6 md:px-12 lg:px-24 bg-white border-t border-gray-100 pt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-[#aa7c11] font-medium text-xs md:text-sm tracking-wider uppercase block mb-2 font-serif">
              The MM Difference
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900">
              Why Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8 max-w-5xl mx-auto">
            {featuresData.map((feature) => (
              <div key={feature.id} className="text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#ede4da]/50 border border-[#ede4da] flex items-center justify-center mb-4 shrink-0 shadow-sm">
                  {feature.icon}
                </div>
                <p className="text-gray-900 text-xs md:text-sm font-semibold leading-relaxed font-sans max-w-[260px]">
                  {feature.text}
                </p>
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
