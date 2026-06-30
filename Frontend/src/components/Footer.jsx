
import logImg from '../assets/log.png';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10 pt-16 pb-8 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-col items-center justify-center gap-1 self-start">
              <img src={logImg} alt="MM Jewellery Logo" className="h-10 w-auto object-contain mb-1" />
              <span className="font-serif text-sm tracking-[0.2em] text-gold-400 font-semibold whitespace-nowrap">
                MM Jewellery
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm font-sans">
              Premium guarantee imitation jewellery for weddings, parties, festivals, and daily wear. Elegance made affordable.
            </p>
            <a 
              href="https://wa.me/919876543210" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center bg-[#25D366] hover:bg-[#20ba56] text-white font-medium px-5 py-2.5 rounded-full transition-all duration-300 text-sm shadow-md font-sans"
            >
              {/* WhatsApp SVG Icon */}
              <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.628 3.825 14.16 2.8 11.535 2.8c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.453 3.39 1.31 4.88L2.012 21.9l4.635-1.746z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-start font-sans">
            <h4 className="font-serif text-sm tracking-[0.15em] uppercase text-gold-400 font-semibold mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 block">Home</a></li>
              <li><a href="#collections" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 block">Collections</a></li>
              <li><a href="#catalogue" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 block">Catalogue</a></li>
              <li><a href="#offers" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 block">Offers</a></li>
              <li><a href="#gallery" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 block">Gallery</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 block">About Us</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 block">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Collections */}
          <div className="flex flex-col items-start font-sans">
            <h4 className="font-serif text-sm tracking-[0.15em] uppercase text-gold-400 font-semibold mb-5">
              Collections
            </h4>
            <ul className="space-y-3">
              <li><a href="#catalogue?collection=Bridal%20Collection" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 block">Bridal Collection</a></li>
              <li><a href="#catalogue?collection=Wedding%20Collection" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 block">Wedding Collection</a></li>
              <li><a href="#catalogue?collection=Traditional%20Collection" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 block">Traditional Collection</a></li>
              <li><a href="#catalogue?collection=Modern%20Collection" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 block">Modern Collection</a></li>
              <li><a href="#catalogue?collection=Party%20Wear%20Collection" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 block">Party Wear Collection</a></li>
              <li><a href="#catalogue?collection=Festival%20Collections" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 block">Festival Collections</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="flex flex-col items-start gap-4 font-sans">
            <h4 className="font-serif text-sm tracking-[0.15em] uppercase text-gold-400 font-semibold mb-5">
              Contact Us
            </h4>
            <div className="flex flex-col gap-4 text-gray-400 text-sm">
              <a href="tel:+919876543210" className="flex items-start gap-3 hover:text-white transition-colors group">
                <svg className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.017 12.017 0 01-4.708-4.708c-.154-.44.01-1.21.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v1.25z" />
                </svg>
                <span>+91 98765 43210</span>
              </a>
              <a href="mailto:info@mmjewellery.com" className="flex items-start gap-3 hover:text-white transition-colors group">
                <svg className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span>info@mmjewellery.com</span>
              </a>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                </svg>
                <span>MM Jewellery Showroom, MG Road, Kochi, Kerala 682001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-sans">
          <span>© 2026 MM Jewellery. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors duration-200">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
