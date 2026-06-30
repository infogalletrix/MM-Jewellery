import { useState } from 'react';
import logImg from '../assets/log.png';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-black text-white border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between relative sticky top-0 z-50">
      {/* Left Links */}
      <nav className="hidden md:flex items-center gap-8 lg:gap-12 flex-1 justify-end pr-8 lg:pr-16">
        <a href="#collections" className="text-white hover:text-gold-400 font-medium text-sm tracking-wide transition-colors duration-300">
          Collections
        </a>
        <a href="#catalogue" className="text-white hover:text-gold-400 font-medium text-sm tracking-wide transition-colors duration-300">
          Catalogue
        </a>
        <a href="#offers" className="text-white hover:text-gold-400 font-medium text-sm tracking-wide transition-colors duration-300">
          Offers
        </a>
      </nav>

      {/* Center Logo */}
      <div className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 flex items-center justify-center">
        <a href="#" className="flex flex-col items-center justify-center">
          <img src={logImg} alt="MM Jewellery Logo" className="h-10 w-auto object-contain mb-1" />
          <span className="font-serif text-sm tracking-[0.2em] text-gold-400 font-semibold whitespace-nowrap">
            MM Jewellery
          </span>
        </a>
      </div>

      {/* Right Links */}
      <nav className="hidden md:flex items-center gap-8 lg:gap-12 flex-1 justify-start pl-8 lg:pl-16">
        <a href="#gallery" className="text-white hover:text-gold-400 font-medium text-sm tracking-wide transition-colors duration-300">
          Gallery
        </a>
        <a href="#about" className="text-white hover:text-gold-400 font-medium text-sm tracking-wide transition-colors duration-300">
          About
        </a>
        <a href="#contact" className="text-white hover:text-gold-400 font-medium text-sm tracking-wide transition-colors duration-300">
          Contact
        </a>
      </nav>

      {/* Mobile Menu Icon (Hamburger) */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-gold-400 transition-colors focus:outline-none" aria-label="Toggle Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu with premium design */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-md border-b border-white/10 flex flex-col items-center py-6 gap-6 md:hidden transition-all duration-300 ease-in-out z-50">
          <a href="#collections" onClick={() => setIsOpen(false)} className="text-white hover:text-gold-400 font-medium text-base tracking-wide transition-colors duration-300">
            Collections
          </a>
          <a href="#catalogue" onClick={() => setIsOpen(false)} className="text-white hover:text-gold-400 font-medium text-base tracking-wide transition-colors duration-300">
            Catalogue
          </a>
          <a href="#offers" onClick={() => setIsOpen(false)} className="text-white hover:text-gold-400 font-medium text-base tracking-wide transition-colors duration-300">
            Offers
          </a>
          <a href="#gallery" onClick={() => setIsOpen(false)} className="text-white hover:text-gold-400 font-medium text-base tracking-wide transition-colors duration-300">
            Gallery
          </a>
          <a href="#about" onClick={() => setIsOpen(false)} className="text-white hover:text-gold-400 font-medium text-base tracking-wide transition-colors duration-300">
            About
          </a>
          <a href="#contact" onClick={() => setIsOpen(false)} className="text-white hover:text-gold-400 font-medium text-base tracking-wide transition-colors duration-300">
            Contact
          </a>
        </div>
      )}
    </header>
  );
}
