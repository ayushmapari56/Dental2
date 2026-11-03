import React from 'react';
import { Database } from 'lucide-react';

interface FooterProps {
  onOpenDbModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDbModal }) => {
  return (
    <footer className="bg-[#122B26] text-stone-300 py-16 border-t border-[#15332D]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#15332D]/80">
          <div className="space-y-4 md:col-span-1">
            <span className="font-serif text-2xl text-white font-normal block">BRIGHT SMILE</span>
            <p className="text-xs text-stone-400 leading-relaxed">
              Private Oral Health Studio & Cosmetic Architecture. Tribeca, New York.
            </p>
            <div className="text-xs text-[#D5C1A7] font-mono">NY State Dental License #058291</div>
          </div>

          <div>
            <h4 className="text-xs uppercase font-semibold text-white tracking-widest mb-3">
              Sanctuary Hours
            </h4>
            <p className="text-xs text-stone-400 leading-loose">
              Monday – Thursday: 7:30 AM – 7:00 PM
              <br />
              Friday: 8:00 AM – 5:00 PM
              <br />
              Saturday: By Private Appointment
              <br />
              Sunday: Emergency On-Call
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase font-semibold text-white tracking-widest mb-3">
              Tribeca Studio
            </h4>
            <p className="text-xs text-stone-400 leading-loose">
              481 Greenwich Street, Suite 300
              <br />
              New York, NY 10013
              <br />
              Direct:{' '}
              <a className="text-[#D5C1A7] hover:underline font-mono" href="tel:18005553284">
                (800) 555-3284
              </a>
              <br />
              concierge@brightsmileprivate.com
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase font-semibold text-white tracking-widest mb-3">
              Accreditations
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              American Academy of Cosmetic Dentistry • International Congress of Oral Implantologists • ADA &
              NYS Dental Association.
            </p>
            <div className="flex flex-col gap-2">
              <span className="inline-block px-3 py-1 bg-[#0E221E] border border-[#15332D] rounded-full text-[10px] text-[#E6D7C3]">
                ★ Top Dental Studio NYC 2024
              </span>
              <button
                onClick={onOpenDbModal}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#15332D] hover:bg-[#1C423B] border border-[#C5A880]/30 rounded-full text-[10px] text-[#D5C1A7] text-left cursor-pointer transition-colors"
              >
                <Database className="w-3 h-3 text-[#C5A880]" />
                <span>MongoDB Studio Records</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2025 Bright Smile Dental Studio NYC. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a className="hover:text-stone-300 transition-colors" href="#">
              Privacy Notice
            </a>
            <a className="hover:text-stone-300 transition-colors" href="#">
              Patient Bill of Rights
            </a>
            <a className="hover:text-stone-300 transition-colors" href="#">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
