import React, { useState } from 'react';
import { Phone, MapPin, Menu, X, Database } from 'lucide-react';

interface NavigationProps {
  onReserveClick: () => void;
  onOpenDbModal: () => void;
  reservationCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  onReserveClick,
  onOpenDbModal,
  reservationCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBF9]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Brandmark */}
        <a
          href="#"
          className="flex items-center gap-3.5 group select-none"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="w-10 h-10 rounded-full bg-[#122B26] text-[#D5C1A7] flex items-center justify-center border border-[#C5A880]/40 group-hover:bg-[#15332D] transition-all shadow-sm">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.5 2 6 4.5 6 8c0 3.5 1.5 8 3 13 1 1 2 1 3 0 1-3.5 1-3.5 2 0 1 1 2 1 3 0 1.5-5 3-9.5 3-13 0-3.5-2.5-6-6-6z" />
              <path d="M9 8c.5-1 1.5-1.5 3-1.5s2.5.5 3 1.5" />
            </svg>
          </div>
          <div>
            <span className="font-serif text-xl tracking-tight text-[#122B26] font-semibold block leading-none">
              BRIGHT SMILE
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#AB8E65] font-semibold uppercase block mt-1">
              Private Dental Studio
            </span>
          </div>
        </a>

        {/* Center Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-wide text-stone-600">
          <button
            onClick={() => scrollTo('experience')}
            className="hover:text-[#122B26] transition-colors cursor-pointer"
          >
            The Experience
          </button>
          <button
            onClick={() => scrollTo('doctor')}
            className="hover:text-[#122B26] transition-colors cursor-pointer"
          >
            Clinical Director
          </button>
          <button
            onClick={() => scrollTo('treatments')}
            className="hover:text-[#122B26] transition-colors cursor-pointer"
          >
            Care & Menu
          </button>
          <button
            onClick={() => scrollTo('reviews')}
            className="hover:text-[#122B26] transition-colors cursor-pointer"
          >
            Transformations
          </button>
          <button
            onClick={onOpenDbModal}
            className="flex items-center gap-1.5 text-[#122B26] hover:text-[#AB8E65] transition-colors cursor-pointer font-medium"
          >
            <Database className="w-3.5 h-3.5 text-[#AB8E65]" />
            <span>MongoDB Data</span>
            {reservationCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#F5F3EF] border border-[#C5A880]/50 rounded-full text-[10px] font-mono">
                {reservationCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Actions: Location & Reserve Button */}
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-stone-500 bg-[#F5F3EF]/90 px-3 py-1.5 rounded-full border border-stone-200">
            <MapPin className="w-3.5 h-3.5 text-[#AB8E65]" />
            <span>481 Greenwich St, Tribeca</span>
          </div>

          <a
            href="tel:18005553284"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-[#122B26] transition-colors px-2 font-mono tabular-nums"
          >
            <Phone className="w-3.5 h-3.5 text-[#AB8E65]" />
            <span>(800) 555-3284</span>
          </a>

          <button
            onClick={onReserveClick}
            className="bg-[#122B26] hover:bg-[#15332D] text-[#E6D7C3] hover:text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-sm border border-[#C5A880]/30 active:scale-95 cursor-pointer"
          >
            Reserve Visit
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-black"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#FBFBF9] px-6 py-4 space-y-3">
          <button
            onClick={() => scrollTo('experience')}
            className="block w-full text-left py-2 text-sm font-medium text-stone-700"
          >
            The Experience
          </button>
          <button
            onClick={() => scrollTo('doctor')}
            className="block w-full text-left py-2 text-sm font-medium text-stone-700"
          >
            Clinical Director
          </button>
          <button
            onClick={() => scrollTo('treatments')}
            className="block w-full text-left py-2 text-sm font-medium text-stone-700"
          >
            Care & Menu
          </button>
          <button
            onClick={() => scrollTo('reviews')}
            className="block w-full text-left py-2 text-sm font-medium text-stone-700"
          >
            Transformations
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDbModal();
            }}
            className="flex items-center gap-2 w-full text-left py-2 text-sm font-medium text-[#122B26]"
          >
            <Database className="w-4 h-4 text-[#AB8E65]" />
            <span>MongoDB Database Records ({reservationCount})</span>
          </button>
          <div className="pt-2 border-t border-stone-200 flex flex-col gap-2">
            <a
              href="tel:18005553284"
              className="flex items-center gap-2 text-xs font-mono text-stone-600"
            >
              <Phone className="w-4 h-4 text-[#AB8E65]" />
              (800) 555-3284
            </a>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <MapPin className="w-4 h-4 text-[#AB8E65]" />
              481 Greenwich St, Tribeca, NYC
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
