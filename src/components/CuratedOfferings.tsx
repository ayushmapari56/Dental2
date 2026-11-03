import React, { useState } from 'react';
import { Check, Calculator, Sparkles, Shield } from 'lucide-react';

interface CuratedOfferingsProps {
  onSelectOffering: (treatmentName: string) => void;
}

export const CuratedOfferings: React.FC<CuratedOfferingsProps> = ({ onSelectOffering }) => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcAmount, setCalcAmount] = useState(4350); // e.g. 3 veneers
  const [calcMonths, setCalcMonths] = useState(24);

  const monthlyPayment = Math.round(calcAmount / calcMonths);

  return (
    <section className="py-24 bg-white border-b border-stone-200" id="treatments">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#AB8E65] uppercase block mb-2">
              Clarity Without Secrets
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#122B26] tracking-tight">
              Curated Studio Offerings
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-stone-500 text-xs sm:text-sm max-w-md">
              Transparent clinical fees. All treatments are backed by our 5-year structural warranty on restorative
              craftsmanship.
            </p>
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F3EF] hover:bg-stone-200 text-stone-700 text-xs font-medium border border-stone-300 transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <Calculator className="w-3.5 h-3.5 text-[#AB8E65]" />
              <span>{showCalculator ? 'Hide Calculator' : '0% APR Calculator'}</span>
            </button>
          </div>
        </div>

        {/* Optional 0% APR Financing Calculator */}
        {showCalculator && (
          <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-[#F5F3EF] border border-[#C5A880]/40 shadow-sm animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#122B26] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#AB8E65]" />
                  Bespoke Patient Financing (Cherry & CareCredit 0% APR)
                </span>
                <span className="text-xs text-stone-500 font-mono">No hard credit check</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                      <span>Total Procedure Investment:</span>
                      <span className="font-mono font-bold text-[#122B26]">${calcAmount.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={18000}
                      step={250}
                      value={calcAmount}
                      onChange={(e) => setCalcAmount(Number(e.target.value))}
                      className="w-full accent-[#122B26] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                      <span>$1,000</span>
                      <span>$8,000</span>
                      <span>$18,000</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {[12, 18, 24, 36].map((m) => (
                      <button
                        key={m}
                        onClick={() => setCalcMonths(m)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                          calcMonths === m
                            ? 'bg-[#122B26] text-[#E6D7C3]'
                            : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {m} Mo 0%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">
                    Estimated Monthly
                  </span>
                  <div className="font-serif text-3xl font-bold text-[#122B26] mb-1 font-mono">
                    ${monthlyPayment}
                    <span className="text-xs font-sans font-normal text-stone-400">/mo</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium block">
                    Zero interest for {calcMonths} months
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Treatment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tier 1: Preventative */}
          <div className="bg-[#FBFBF9] rounded-3xl p-6 border border-stone-200 flex flex-col justify-between hover:border-[#122B26] transition-all duration-300">
            <div>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-500 block mb-2">
                Foundation Health
              </span>
              <h3 className="font-serif text-xl font-bold text-[#122B26] mb-2">
                Bespoke Cleanse & Diagnostic
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-6">
                Gentle ultrasonic airflow hygiene, digital low-radiation diagnostics, cancer screening, and fluoride
                polish.
              </p>
              <div className="mb-6">
                <span className="text-2xl font-serif font-bold text-[#122B26]">$150</span>
                <span className="text-stone-400 text-xs ml-1 font-sans">/ or 100% In-Network PPO</span>
              </div>
              <ul className="text-xs space-y-2 text-stone-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>60-Minute Private Session</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>3D Intraoral Occlusion Scan</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Custom Enamel Care Guide</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectOffering('Comprehensive Check & 3D Scan')}
              className="mt-8 w-full py-2.5 rounded-full border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-[#122B26] hover:text-[#E6D7C3] transition-all uppercase tracking-wider cursor-pointer"
            >
              Select Offering
            </button>
          </div>

          {/* Tier 2: Veneers (Featured) */}
          <div className="bg-[#122B26] text-white rounded-3xl p-6 border border-[#C5A880]/50 flex flex-col justify-between relative shadow-xl transform lg:-translate-y-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C5A880] text-[#081714] font-bold text-[9px] uppercase tracking-widest px-3 py-0.5 rounded-full shadow-sm">
              Flagship Specialization
            </div>
            <div>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-[#D5C1A7] block mb-2">
                Cosmetic Artistry
              </span>
              <h3 className="font-serif text-xl font-bold text-white mb-2">
                Handmade Porcelain Veneers
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed mb-6">
                Ultra-thin feldspathic porcelain crafted layer-by-layer to match your facial symmetry and optical warmth.
              </p>
              <div className="mb-6">
                <span className="text-2xl font-serif font-bold text-[#E6D7C3]">From $1,450</span>
                <span className="text-stone-400 text-xs ml-1 font-sans">/ per tooth</span>
              </div>
              <ul className="text-xs space-y-2 text-stone-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                  <span>3D Digital Smile Mockup</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                  <span>Zero or Minimal Tooth Prep</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                  <span>10-Year Craftsmanship Guarantee</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectOffering('Aesthetic Smile Consult')}
              className="mt-8 w-full py-2.5 rounded-full bg-[#C5A880] text-[#081714] text-xs font-bold hover:bg-white transition-all uppercase tracking-wider cursor-pointer"
            >
              Consult With Dr. Vance
            </button>
          </div>

          {/* Tier 3: Invisalign Diamond */}
          <div className="bg-[#FBFBF9] rounded-3xl p-6 border border-stone-200 flex flex-col justify-between hover:border-[#122B26] transition-all duration-300">
            <div>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-500 block mb-2">
                Orthodontic Precision
              </span>
              <h3 className="font-serif text-xl font-bold text-[#122B26] mb-2">
                Invisalign® Diamond Alignment
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-6">
                Predictable clear aligner therapy designed for adults. Discreet, painless, and monitored digitally
                between visits.
              </p>
              <div className="mb-6">
                <span className="text-2xl font-serif font-bold text-[#122B26]">$3,800 – $5,400</span>
                <span className="text-stone-400 text-xs ml-1 font-sans">/ complete</span>
              </div>
              <ul className="text-xs space-y-2 text-stone-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Virtual AI Check-ins</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Complimentary Whitening Gel</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Retainers Included</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectOffering('Aesthetic Smile Consult')}
              className="mt-8 w-full py-2.5 rounded-full border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-[#122B26] hover:text-[#E6D7C3] transition-all uppercase tracking-wider cursor-pointer"
            >
              Explore Options
            </button>
          </div>

          {/* Tier 4: Same-Day Emergency */}
          <div className="bg-[#FBFBF9] rounded-3xl p-6 border border-stone-200 flex flex-col justify-between hover:border-[#122B26] transition-all duration-300">
            <div>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-amber-700 block mb-2">
                Rapid Relief
              </span>
              <h3 className="font-serif text-xl font-bold text-[#122B26] mb-2">
                Same-Day Emergency Triage
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-6">
                Immediate comfort for cracked teeth, sudden toothaches, or lost crowns in our dedicated rapid-access chair.
              </p>
              <div className="mb-6">
                <span className="text-2xl font-serif font-bold text-[#122B26]">$190</span>
                <span className="text-stone-400 text-xs ml-1 font-sans">/ emergency exam + imaging</span>
              </div>
              <ul className="text-xs space-y-2 text-stone-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Walk-in or 60-min window</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Immediate local anesthesia</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct Pharmacy Coordination</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectOffering('Urgent Tooth Relief')}
              className="mt-8 w-full py-2.5 rounded-full bg-stone-200 hover:bg-[#122B26] hover:text-[#E6D7C3] text-stone-800 text-xs font-semibold transition-all uppercase tracking-wider cursor-pointer"
            >
              Request Emergency Slot
            </button>
          </div>
        </div>

        {/* Financial footnote */}
        <div className="mt-12 text-center text-xs text-stone-500 max-w-xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span>Flexible 0% APR via Cherry &amp; CareCredit</span>
          <span>•</span>
          <span>HSA/FSA Eligible</span>
          <span>•</span>
          <span>Itemized Claims Submitted On Your Behalf</span>
        </div>
      </div>
    </section>
  );
};
