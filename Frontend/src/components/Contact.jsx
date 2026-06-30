import { useState } from 'react';
import Footer from './Footer';
import Nav from './Nav';

// Import assets
import contactHeroImg from '../assets/0.png';

// Popular country codes list
const COUNTRY_CODES = [
  { code: '+91', country: 'IN', name: 'India', digits: 10 },
  { code: '+1', country: 'US', name: 'USA / Canada', digits: 10 },
  { code: '+44', country: 'GB', name: 'United Kingdom', digits: 10 },
  { code: '+61', country: 'AU', name: 'Australia', digits: 9 },
  { code: '+971', country: 'AE', name: 'UAE', digits: 9 },
  { code: '+966', country: 'SA', name: 'Saudi Arabia', digits: 9 },
  { code: '+65', country: 'SG', name: 'Singapore', digits: 8 },
  { code: '+60', country: 'MY', name: 'Malaysia', digits: 9 },
  { code: '+974', country: 'QA', name: 'Qatar', digits: 8 },
  { code: '+973', country: 'BH', name: 'Bahrain', digits: 8 },
  { code: '+968', country: 'OM', name: 'Oman', digits: 8 },
  { code: '+965', country: 'KW', name: 'Kuwait', digits: 8 },
  { code: '+64', country: 'NZ', name: 'New Zealand', digits: 9 },
  { code: '+27', country: 'ZA', name: 'South Africa', digits: 9 },
  { code: '+49', country: 'DE', name: 'Germany', digits: 11 },
  { code: '+33', country: 'FR', name: 'France', digits: 9 },
  { code: '+39', country: 'IT', name: 'Italy', digits: 10 },
  { code: '+34', country: 'ES', name: 'Spain', digits: 9 },
  { code: '+31', country: 'NL', name: 'Netherlands', digits: 9 },
  { code: '+7', country: 'RU', name: 'Russia', digits: 10 },
  { code: '+86', country: 'CN', name: 'China', digits: 11 },
  { code: '+81', country: 'JP', name: 'Japan', digits: 10 },
  { code: '+82', country: 'KR', name: 'South Korea', digits: 10 },
  { code: '+92', country: 'PK', name: 'Pakistan', digits: 10 },
  { code: '+880', country: 'BD', name: 'Bangladesh', digits: 10 },
  { code: '+94', country: 'LK', name: 'Sri Lanka', digits: 9 },
  { code: '+977', country: 'NP', name: 'Nepal', digits: 10 },
  { code: '+55', country: 'BR', name: 'Brazil', digits: 11 },
  { code: '+52', country: 'MX', name: 'Mexico', digits: 10 },
  { code: '+20', country: 'EG', name: 'Egypt', digits: 10 },
  { code: '+234', country: 'NG', name: 'Nigeria', digits: 10 },
  { code: '+254', country: 'KE', name: 'Kenya', digits: 9 },
];

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export default function Contact() {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]); // India default
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ success: false, text: '' });
  const [codeDropdownOpen, setCodeDropdownOpen] = useState(false);
  const [codeSearch, setCodeSearch] = useState('');

  // Filter country codes by search
  const filteredCodes = codeSearch.trim()
    ? COUNTRY_CODES.filter(c =>
        c.name.toLowerCase().includes(codeSearch.toLowerCase()) ||
        c.code.includes(codeSearch) ||
        c.country.toLowerCase().includes(codeSearch.toLowerCase())
      )
    : COUNTRY_CODES;

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (val && !EMAIL_REGEX.test(val)) {
      setEmailError('Please enter a valid email address (e.g. name@example.com)');
    } else {
      setEmailError('');
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setPhone('');
    setCodeDropdownOpen(false);
    setCodeSearch('');
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ success: false, text: '' });

    // Email validation
    if (!EMAIL_REGEX.test(email)) {
      setEmailError('Please enter a valid email address (e.g. name@example.com)');
      return;
    }

    // Phone validation (optional field but if entered must match country digits)
    if (phone && phone.length !== selectedCountry.digits) {
      setStatusMsg({ success: false, text: `Please enter a valid ${selectedCountry.digits}-digit phone number for ${selectedCountry.name}.` });
      return;
    }

    setIsSubmitting(true);

    try {
      const apiHost = window.location.hostname;
      const formattedPhone = phone ? `${selectedCountry.code} ${phone}` : '';
      const response = await fetch(`http://${apiHost}:5005/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, email, phone: formattedPhone, message }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setStatusMsg({ success: true, text: 'Your inquiry has been submitted successfully. Our specialists will contact you shortly.' });
        setCustomerName('');
        setEmail('');
        setEmailError('');
        setPhone('');
        setMessage('');
        setSelectedCountry(COUNTRY_CODES[0]);
      } else {
        setStatusMsg({ success: false, text: data.message || 'Failed to submit inquiry.' });
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ success: false, text: 'Could not connect to the server. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans select-none">
      {/* Navigation Header */}
      <Nav />

      {/* Hero Banner Section */}
      <section
        className="w-full bg-cover bg-center py-20 px-6 md:px-12 lg:px-24 flex items-center relative"
        style={{
          backgroundImage: `url(${contactHeroImg})`,
          minHeight: '280px'
        }}
      >
        <div className="absolute inset-0 bg-black/15 z-0 pointer-events-none"></div>

        <div className="container mx-auto z-10 flex flex-col justify-center items-center text-center max-w-4xl">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4">
            Visit Our Showroom
          </h1>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed font-light font-sans max-w-2xl">
            We would love to help you find the perfect piece
          </p>
        </div>
      </section>

      {/* Contact Content Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white flex-grow">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* Left Column: Contact Cards */}
            <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
              {/* Address Card */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gold-50 flex items-center justify-center shrink-0 border border-gold-100">
                  <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-[#aa7c11] uppercase tracking-wider mb-1">
                    Store Address
                  </h4>
                  <p className="text-gray-600 text-xs md:text-sm font-light font-sans leading-relaxed">
                    123 Jewellery Lane, Gold Market, Mumbai, Maharashtra 400001, India
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gold-50 flex items-center justify-center shrink-0 border border-gold-100">
                  <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.017 12.017 0 01-4.708-4.708c-.154-.44.01-1.21.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v1.25z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-[#aa7c11] uppercase tracking-wider mb-1">
                    Phone
                  </h4>
                  <div className="text-gray-600 text-xs md:text-sm font-light font-sans leading-relaxed">
                    <p>+91 98765 43210</p>
                    <p>+91 98765 43211</p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gold-50 flex items-center justify-center shrink-0 border border-gold-100">
                  <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-[#aa7c11] uppercase tracking-wider mb-1">
                    Email
                  </h4>
                  <p className="text-gray-600 text-xs md:text-sm font-light font-sans leading-relaxed">
                    info@mmjewellery.com
                  </p>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gold-50 flex items-center justify-center shrink-0 border border-gold-100">
                  <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-[#aa7c11] uppercase tracking-wider mb-1">
                    Working Hours
                  </h4>
                  <div className="text-gray-600 text-xs md:text-sm font-light font-sans leading-relaxed">
                    <p>Monday - Saturday: 10:00 AM - 8:00 PM</p>
                    <p>Sunday: 11:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-2">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#1fba55] text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.628 3.825 14.16 2.8 11.535 2.8c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.453 3.39 1.31 4.88L2.012 21.9l4.635-1.746z"/>
                  </svg>
                  WhatsApp Us
                </a>
                <a
                  href="tel:+919876543210"
                  className="flex-1 py-3 px-4 bg-[#dfb074] hover:bg-[#d09e5f] text-black text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.017 12.017 0 01-4.708-4.708c-.154-.44.01-1.21.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v1.25z" />
                  </svg>
                  Call Now
                </a>
              </div>
            </div>

            {/* Right Column: Google Maps Iframe */}
            <div className="lg:col-span-7">
              <div className="w-full h-full min-h-[300px] sm:min-h-[400px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <iframe
                  title="MM Jewellery Showroom Map"
                  src="https://maps.google.com/maps?q=Kalbadevi,%20Mumbai,%20India&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full min-h-[300px] sm:min-h-[400px] border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section className="bg-gray-50 py-20 px-6 md:px-12 lg:px-24 border-t border-gray-100">
        <div className="container mx-auto max-w-3xl bg-white border border-gray-100 rounded-2xl p-5 sm:p-8 md:p-12 shadow-sm">
          <div className="text-center mb-10">
            <span className="text-[#aa7c11] font-medium text-xs md:text-sm tracking-wider uppercase block mb-2 font-serif">
              Inquiry Form
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
              Send Us a Message
            </h2>
            <p className="text-gray-600 text-xs md:text-sm font-light max-w-lg mx-auto leading-relaxed">
              Have questions about sizing, diamond grades, or customization? Send us an inquiry and our jewelry experts will assist you.
            </p>
          </div>

          {statusMsg.text && (
            <div className={`p-4 rounded-xl text-xs mb-6 ${statusMsg.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleInquirySubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-gray-500 font-medium">Your Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#aa7c11] transition-colors"
                />
              </div>

              {/* Email with live validation */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-gray-500 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="name@example.com"
                  className={`w-full bg-white border rounded-lg px-4 py-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                    emailError ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#aa7c11]'
                  }`}
                />
                {emailError && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {emailError}
                  </p>
                )}
              </div>
            </div>

            {/* Phone with country code dropdown */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-gray-500 font-medium">
                Phone Number <span className="text-gray-400 normal-case tracking-normal font-normal">(optional)</span>
              </label>
              <div className="flex rounded-lg border border-gray-200 focus-within:border-[#aa7c11] overflow-visible transition-colors relative">

                {/* Country code dropdown trigger */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => { setCodeDropdownOpen(v => !v); setCodeSearch(''); }}
                    className="h-full bg-gray-50 border-r border-gray-200 px-3 py-3 text-xs text-gray-700 flex items-center gap-1.5 hover:bg-gray-100 transition-colors font-medium select-none rounded-l-lg min-w-[80px]"
                  >
                    <span className="text-sm">{selectedCountry.country}</span>
                    <span>{selectedCountry.code}</span>
                    <svg className={`w-3 h-3 text-gray-400 transition-transform ${codeDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {/* Dropdown panel */}
                  {codeDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                      {/* Search box */}
                      <div className="p-2 border-b border-gray-100">
                        <input
                          type="text"
                          value={codeSearch}
                          onChange={(e) => setCodeSearch(e.target.value)}
                          placeholder="Search country..."
                          autoFocus
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#aa7c11] transition-colors"
                        />
                      </div>
                      {/* Country list */}
                      <ul className="max-h-56 overflow-y-auto divide-y divide-gray-50">
                        {filteredCodes.length === 0 ? (
                          <li className="px-4 py-3 text-xs text-gray-400 text-center">No results</li>
                        ) : filteredCodes.map((c) => (
                          <li key={c.code + c.country}>
                            <button
                              type="button"
                              onClick={() => handleCountrySelect(c)}
                              className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-gold-50 transition-colors ${
                                selectedCountry.code === c.code && selectedCountry.country === c.country
                                  ? 'bg-amber-50 text-[#aa7c11] font-semibold'
                                  : 'text-gray-700'
                              }`}
                            >
                              <span>{c.name}</span>
                              <span className="text-gray-400 font-mono">{c.code}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Phone input */}
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, selectedCountry.digits))}
                  placeholder={`${'0'.repeat(selectedCountry.digits)} (${selectedCountry.digits} digits)`}
                  className="w-full bg-white px-4 py-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none rounded-r-lg"
                  onClick={() => setCodeDropdownOpen(false)}
                />
              </div>
              {phone && phone.length > 0 && phone.length < selectedCountry.digits && (
                <p className="text-[11px] text-amber-600 flex items-center gap-1 mt-1">
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {selectedCountry.digits - phone.length} more digit{selectedCountry.digits - phone.length !== 1 ? 's' : ''} needed for {selectedCountry.name}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-gray-500 font-medium">Your Inquiry Message</label>
              <textarea
                rows="4"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe what you are looking for..."
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#aa7c11] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !!emailError}
              className="w-full py-3.5 bg-[#aa7c11] hover:bg-gold-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-300 shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer component */}
      <Footer />
    </div>
  );
}
