import React from 'react';
import { Phone, MapPin, Sparkles, Database } from 'lucide-react';
import { DBStatusResponse } from '../types';

interface AnnouncementBarProps {
  dbStatus: DBStatusResponse | null;
  onOpenDbModal: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ dbStatus, onOpenDbModal }) => {
  return (
    <div className="bg-[#0E221E] text-[#D5C1A7] text-xs font-medium py-2 px-4 border-b border-[#15332D]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
          <span className="flex items-center gap-1.5 text-white font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            Tribeca Flagship Studio
          </span>
          <span className="text-[#C5A880]/60">·</span>
          <span>Accepting Select New Private Patients</span>
          <span className="hidden sm:inline text-[#C5A880]/60">·</span>
          <span className="hidden sm:inline">Private Soundproof Suites</span>
          <span className="hidden sm:inline text-[#C5A880]/60">·</span>
          <span className="hidden sm:inline">Bespoke Conscious Sedation</span>
        </div>

        <div className="flex items-center gap-4 text-xs shrink-0">
          <a
            href="https://maps.google.com/?q=142+Franklin+St+New+York+NY"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <MapPin className="w-3 h-3 text-[#C5A880]" />
            142 Franklin St, Tribeca
          </a>

          <a
            href="tel:8005553284"
            className="flex items-center gap-1.5 hover:text-white transition-colors font-mono tabular-nums"
          >
            <Phone className="w-3 h-3 text-[#C5A880]" />
            (800) 555-3284
          </a>

          {/* MongoDB Live Status badge */}
          <button
            onClick={onOpenDbModal}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#15332D] hover:bg-[#1C423B] text-[#E6D7C3] border border-[#C5A880]/30 transition-all cursor-pointer"
            title="Inspect live MongoDB collection records"
          >
            <Database className="w-3 h-3 text-[#C5A880]" />
            <span className="font-mono text-[10px]">
              Mongo DB: {dbStatus?.engine === 'mongodb-native' ? 'Atlas' : 'Active'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </button>
        </div>
      </div>
    </div>
  );
};
