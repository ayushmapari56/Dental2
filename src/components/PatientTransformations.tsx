import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import { Testimonial } from '../types';

interface PatientTransformationsProps {
  testimonials: Testimonial[];
  onTestimonialAdded: (testimonial: Testimonial) => void;
}

export const PatientTransformations: React.FC<PatientTransformationsProps> = ({
  testimonials,
  onTestimonialAdded,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Tribeca, NYC');
  const [treatment, setTreatment] = useState('Handmade Porcelain Veneers');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, location, treatment, quote, rating }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        onTestimonialAdded(json.data);
        setSuccessMsg(true);
        setTimeout(() => {
          setSuccessMsg(false);
          setShowAddModal(false);
          setName('');
          setQuote('');
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-[#F5F3EF]/40 border-b border-stone-200" id="reviews">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="text-center md:text-left">
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#AB8E65] uppercase block mb-2">
              Verified Testimonials
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#122B26] tracking-tight">
              The difference in detail
            </h2>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-300 bg-white hover:border-[#122B26] text-xs font-semibold uppercase tracking-wider text-stone-800 transition-all cursor-pointer self-center md:self-auto"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-[#AB8E65]" />
            <span>Share Studio Experience</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item._id}
              className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-0.5 text-amber-500 text-xs">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="font-serif italic text-stone-800 text-base leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#E6D7C3] text-[#122B26] font-bold text-xs flex items-center justify-center font-mono">
                  {item.initials}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#122B26]">{item.name}</p>
                  <p className="text-[11px] text-stone-400">
                    {item.location} • {item.treatment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal to submit testimonial */}
        {showAddModal && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#AB8E65]">
                    Patient Reflection
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#122B26]">Share Your Experience</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {successMsg ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-serif text-lg font-bold text-[#122B26]">Thank You</h4>
                  <p className="text-xs text-stone-600">Your reflection has been recorded in MongoDB.</p>
                </div>
              ) : (
                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">
                        Your Name
                      </label>
                      <input
                        className="w-full text-xs rounded-xl border border-stone-200 py-2 px-3 bg-white focus:outline-none focus:border-[#122B26]"
                        placeholder="e.g. Eleanor Gray"
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">
                        Neighborhood
                      </label>
                      <input
                        className="w-full text-xs rounded-xl border border-stone-200 py-2 px-3 bg-white focus:outline-none focus:border-[#122B26]"
                        placeholder="e.g. West Village"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">
                      Treatment Received
                    </label>
                    <select
                      className="w-full text-xs rounded-xl border border-stone-200 py-2 px-3 bg-white focus:outline-none focus:border-[#122B26]"
                      value={treatment}
                      onChange={(e) => setTreatment(e.target.value)}
                    >
                      <option value="Handmade Porcelain Veneers">Handmade Porcelain Veneers</option>
                      <option value="Bespoke Cleanse & Diagnostic">Bespoke Cleanse & Diagnostic</option>
                      <option value="Invisalign Diamond Alignment">Invisalign Diamond Alignment</option>
                      <option value="Laser Teeth Whitening">Laser Teeth Whitening</option>
                      <option value="Same-Day Emergency Triage">Same-Day Emergency Triage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[5, 4, 3, 2, 1].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRating(r)}
                          className={`flex-1 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            rating === r
                              ? 'bg-[#122B26] text-[#E6D7C3]'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {r} ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">
                      Review / Transformation Reflection
                    </label>
                    <textarea
                      rows={3}
                      className="w-full text-xs rounded-xl border border-stone-200 p-3 bg-white focus:outline-none focus:border-[#122B26]"
                      placeholder="Share your experience regarding sensory comfort, clinical mastership, or transparency..."
                      required
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 rounded-xl text-xs text-stone-600 hover:bg-stone-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded-xl bg-[#122B26] text-[#E6D7C3] hover:text-white text-xs font-semibold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? 'Posting...' : 'Post Verified Reflection'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
