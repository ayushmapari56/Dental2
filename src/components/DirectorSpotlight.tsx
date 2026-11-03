import React from 'react';
import { Award, GraduationCap, Sparkles, CheckCircle2 } from 'lucide-react';

interface DirectorSpotlightProps {
  onBookWithDoctor: () => void;
}

export const DirectorSpotlight: React.FC<DirectorSpotlightProps> = ({ onBookWithDoctor }) => {
  return (
    <section className="py-24 bg-[#F5F3EF]/60 border-b border-stone-200" id="doctor">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Doctor Portrait & Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-stone-300 shadow-2xl relative bg-stone-200">
                <img
                  alt="Dr. Elena Vance DDS, FICOI"
                  className="w-full h-full object-cover grayscale-[10%] contrast-[1.05]"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4f6xdCDRRT4AvARJczTOWREuWEypX8K295DtWoD730OCj7pP4pQM9YjsZB8RiWkFNCdE84awNcsIGrpzpS8OdK64RyyT6XOdJhXc6nPM0jtxucJQEyJXNWl4GMUnw6jfLDHtPq5n4lbSeXTMYdurduNK6y2D76HB2EfjxCHpuJ3AfUPIzoi3pv-Ogp5unrYfRTB4MzuFOpqnwRdFoTqXNvpJT2R_cLJ0YsXBXbBp3pKT9VkquJM9s"
                  onError={(e) => {
                    // Fallback to local screenshot or styled backdrop if remote fails
                    (e.target as HTMLImageElement).src = '/assets/aistudio/Image_1_0d8ea4d3.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#122B26]/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="font-serif text-2xl font-light">Dr. Elena Vance, DDS, FICOI</p>
                  <p className="text-xs text-[#E6D7C3] tracking-wider uppercase mt-0.5">
                    Founding Clinical Director • Tribeca Studio
                  </p>
                </div>
              </div>

              {/* Luxury credential badge */}
              <div className="absolute -top-4 -right-4 bg-white border border-stone-200 rounded-2xl p-4 shadow-xl text-center hidden sm:block">
                <span className="block font-serif text-2xl font-bold text-[#122B26]">15+</span>
                <span className="text-[10px] tracking-wider uppercase text-stone-500 font-semibold block">
                  Years Clinical Master
                </span>
              </div>
            </div>
          </div>

          {/* Bio & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#AB8E65] uppercase">
              <span>Leadership & Philosophy</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl text-[#122B26] tracking-tight font-normal leading-tight text-balance">
              "True aesthetic dentistry does not look done. It preserves biological vitality and restores natural harmony."
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Dr. Vance completed her doctoral surgical training at Columbia University College of Dental Medicine,
              followed by advanced surgical fellowship honors at the International Congress of Oral Implantologists.
              She specializes in minimally invasive microscopic veneer artistry, bio-emulative composite restorations,
              and complex full-arch smile rehabilitations.
            </p>

            {/* Accreditations & Specialties Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <div className="flex items-center gap-1.5 text-stone-900 mb-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#AB8E65]" />
                  <span className="text-xs font-bold">Columbia University</span>
                </div>
                <span className="text-[11px] text-stone-500 block">Doctor of Dental Surgery</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <div className="flex items-center gap-1.5 text-stone-900 mb-0.5">
                  <Award className="w-3.5 h-3.5 text-[#AB8E65]" />
                  <span className="text-xs font-bold">FICOI Fellow</span>
                </div>
                <span className="text-[11px] text-stone-500 block">Intl Congress of Implantologists</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <div className="flex items-center gap-1.5 text-stone-900 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#AB8E65]" />
                  <span className="text-xs font-bold">Invisalign Diamond</span>
                </div>
                <span className="text-[11px] text-stone-500 block">Top 1% Provider in NYC</span>
              </div>
            </div>

            {/* Signature block & CTA */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="font-serif italic text-2xl text-stone-800 tracking-wider">
                  Elena Vance, DDS
                </div>
                <div className="h-6 w-px bg-stone-300" />
                <div className="text-xs text-stone-500 max-w-[200px]">
                  Board Certified • American Academy of Cosmetic Dentistry (AACD)
                </div>
              </div>

              <button
                onClick={onBookWithDoctor}
                className="px-4 py-2 rounded-full border border-[#122B26] text-[#122B26] hover:bg-[#122B26] hover:text-[#E6D7C3] transition-all text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Consult Dr. Vance
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
