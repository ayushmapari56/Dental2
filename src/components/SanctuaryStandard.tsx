import React, { useState } from 'react';
import { Eye, Volume2, ShieldCheck, Check, Sparkles } from 'lucide-react';

export const SanctuaryStandard: React.FC = () => {
  const [activeModal, setActiveModal] = useState<number | null>(null);

  const pillars = [
    {
      num: '01',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
        </svg>
      ),
      title: 'Digital Triage & 3D Scan',
      desc: 'Eliminating uncomfortable alginate molds. Our 60-second intraoral laser creates millimeter-precise 3D scans of your bite and soft tissue in true color.',
      badge: 'Zero Radiation • Live Visuals',
      details: [
        'Color accurate 60-second laser intraoral surface mapping',
        'Sub-millimeter tooth wear & microscopic fracture detection',
        'Instant 3D simulation of cosmetic outcomes before touch',
        'Zero messy alginate or gag-inducing impression trays',
      ],
    },
    {
      num: '02',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4 21l3.39-.97C8.93 20.26 10.88 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z" />
          <path d="M9 12a3 3 0 106 0 3 3 0 00-6 0z" />
        </svg>
      ),
      title: 'Calm, Private Suites',
      desc: 'Settle into ergonomic memory-foam chairs, noise-canceling Bowers & Wilkins headsets, ceiling-mounted streaming screens, and gentle localized numbness protocols.',
      badge: 'Aromatherapeutic Air • Whisper Motors',
      details: [
        'Bowers & Wilkins active noise-cancelling headphones',
        'Ceiling-mounted 4K displays with cinema streaming library',
        'Medical-grade HEPA & santal organic aromatherapy filtration',
        'Micro-vibration computer-assisted anesthesia delivery',
      ],
    },
    {
      num: '03',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Transparent Longevity Care',
      desc: 'No fear-mongering treatment plans. Receive a personalized digital dashboard illustrating prioritized health vs. elective cosmetic options with fixed pricing.',
      badge: 'Itemized Clarity • Digital Records',
      details: [
        'Real-time insurance pre-verification before clinical work',
        'Categorized: Urgent Health vs. Preventative vs. Elective',
        'Direct patient portal with 3D models and tooth history',
        '5-Year structural warranty on all restorative craftsmanship',
      ],
    },
  ];

  return (
    <section className="py-24 bg-white border-b border-stone-200" id="experience">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-[11px] font-bold tracking-[0.25em] text-[#AB8E65] uppercase block mb-2">
            The Sanctuary Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#122B26] tracking-tight">
            How visits should always feel
          </h2>
          <p className="text-stone-500 text-sm mt-3 leading-relaxed">
            We rebuilt the entire dental journey around sensory calmness, biological precision, and respectful pace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {pillars.map((item, idx) => (
            <div
              key={item.num}
              onClick={() => setActiveModal(idx)}
              className="bg-[#FBFBF9] p-8 rounded-3xl border border-stone-200 hover:border-[#C5A880]/70 transition-all duration-300 relative group cursor-pointer hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <span className="font-serif text-5xl text-stone-300 font-light block mb-4 group-hover:text-[#AB8E65] transition-colors">
                  {item.num}
                </span>

                <div className="w-10 h-10 rounded-2xl bg-[#122B26] text-[#D5C1A7] flex items-center justify-center mb-6 group-hover:bg-[#15332D] transition-colors">
                  {item.icon}
                </div>

                <h3 className="font-serif text-xl font-semibold text-[#122B26] mb-2">{item.title}</h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200/80 flex items-center justify-between text-[11px] text-[#AB8E65] font-semibold tracking-wider uppercase">
                <span>{item.badge}</span>
                <span className="text-[10px] text-stone-400 group-hover:text-[#122B26] font-sans lowercase">
                  details &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Card Details */}
        {activeModal !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setActiveModal(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-3xl font-light text-[#AB8E65]">
                    {pillars[activeModal].num}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#122B26]">
                    {pillars[activeModal].title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 my-4 leading-relaxed">
                {pillars[activeModal].desc}
              </p>

              <div className="space-y-2 bg-[#F5F3EF] p-4 rounded-2xl">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#AB8E65] block mb-1">
                  Clinical Protocols
                </span>
                {pillars[activeModal].details.map((point, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2.5 rounded-full bg-[#122B26] text-[#E6D7C3] hover:text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
