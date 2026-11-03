import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Sparkles,
  Clock,
  Star,
  ChevronRight,
  SlidersHorizontal,
  Calendar,
  Check,
  Maximize2,
  X,
} from 'lucide-react';
import { Reservation } from '../types';

interface HeroSectionProps {
  selectedTreatment: string;
  onSelectTreatment: (treatment: string) => void;
  onReservationCreated: (reservation: Reservation) => void;
  onOpenDbModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedTreatment,
  onSelectTreatment,
  onReservationCreated,
  onOpenDbModal,
}) => {
  // Hero mode: 'cinematic' (matching the Pinterest reference) or 'booking' (direct reservation desk)
  const [heroMode, setHeroMode] = useState<'cinematic' | 'booking'>('cinematic');
  const [activePhoto, setActivePhoto] = useState<'closeup' | 'suite'>('closeup');

  // Booking Form State
  const [selectedSlot, setSelectedSlot] = useState('Tomorrow 10:15 AM');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [insurance, setInsurance] = useState('Delta Dental PPO');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const treatments = [
    { name: 'Comprehensive Check & 3D Scan', label: 'Dental Checkup', price: '$150', icon: '✨' },
    { name: 'Laser Teeth Whitening', label: 'Teeth Whitening', price: '$399', icon: '⚡' },
    { name: 'Aesthetic Smile Consult', label: 'Porcelain Veneers', price: 'Consult', icon: '💎' },
    { name: 'Invisalign® Diamond Alignment', label: 'Invisalign® Diamond', price: '$3.8k+', icon: '🦷' },
    { name: 'Urgent Tooth Relief', label: 'Urgent Care', price: 'Same-Day', isUrgent: true, icon: '🚨' },
  ];

  const slots = [
    { day: 'Tomorrow', time: '10:15 AM' },
    { day: 'Thursday', time: '2:30 PM' },
    { day: 'Friday', time: '9:00 AM' },
  ];

  const currentTreatmentObj =
    treatments.find((t) => t.name === selectedTreatment || t.label === selectedTreatment) || treatments[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      setErrorMessage('Please provide your full name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treatment: selectedTreatment,
          treatmentPrice: currentTreatmentObj.price,
          slot: selectedSlot,
          patientName: patientName.trim(),
          patientPhone: patientPhone.trim(),
          insurance,
          notes,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setConfirmedReservation(json.data);
        onReservationCreated(json.data);
      } else {
        setErrorMessage(json.message || 'Unable to hold suite. Please try again.');
      }
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedReservation(null);
    setPatientName('');
    setPatientPhone('');
    setNotes('');
  };

  // Image source paths based on generated high-resolution studio assets
  const closeupPhoto = '/src/assets/images/dental_patient_smile_closeup_1793522084144.jpg';
  const suitePhoto = '/src/assets/images/dental_hero_patient_care_1793522059595.jpg';

  const currentHeroImage = activePhoto === 'closeup' ? closeupPhoto : suitePhoto;

  return (
    <div className="relative bg-[#FBFBF9] pt-3 pb-16">
      {/* =========================================================================
          HERO CARD CONTAINER (Framed Luxury Window matching Pinterest concept)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div
          id="reservationSection"
          className="relative rounded-[32px] sm:rounded-[36px] overflow-hidden shadow-2xl border border-stone-800/40 bg-[#081714] text-white min-h-[640px] lg:min-h-[720px] flex flex-col justify-between transition-all"
        >
          {/* =====================================================================
              LAYER 0 (z-0): High-Resolution Background Imagery
              ===================================================================== */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={currentHeroImage}
              alt="Bespoke Patient Dental Care"
              className="w-full h-full object-cover object-right sm:object-center transform scale-102 transition-transform duration-700 ease-out"
              onError={(e) => {
                // Fallback to local screenshot if hotlink needed
                (e.target as HTMLImageElement).src = '/public/assets/aistudio/Image_1_0d8ea4d3.png';
              }}
            />
          </div>

          {/* =====================================================================
              LAYER 1 (z-10): Cinematic Multi-Stop Gradient Scrims (Ensures Text Legibility)
              ===================================================================== */}
          {/* Left-to-right gradient: deep dark opacity on left for crystal-clear typography */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#081714]/95 via-[#081714]/80 sm:via-[#081714]/65 to-[#081714]/25 pointer-events-none" />

          {/* Top-to-bottom subtle gradient: softens the header navigation */}
          <div className="absolute inset-x-0 top-0 h-40 z-10 bg-gradient-to-b from-[#081714]/90 via-[#081714]/50 to-transparent pointer-events-none" />

          {/* Bottom vignette: protects the floating pills and ticker */}
          <div className="absolute inset-x-0 bottom-0 h-48 z-10 bg-gradient-to-t from-[#081714]/95 via-[#081714]/60 to-transparent pointer-events-none" />

          {/* Warm Champagne ambient glow accent */}
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none z-10" />

          {/* =====================================================================
              LAYER 2 (z-30): In-Hero Floating Navigation Bar (Matching Reference)
              ===================================================================== */}
          <div className="relative z-30 pt-6 px-6 sm:px-10 flex items-center justify-between gap-4">
            {/* Left Brand Lockup */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#122B26] text-[#E6D7C3] flex items-center justify-center border border-[#C5A880]/40 shadow-sm">
                <svg
                  className="w-4 h-4"
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
              <div className="leading-tight">
                <span className="font-serif text-lg tracking-tight text-white font-semibold block">
                  BRIGHT SMILE
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#C5A880] uppercase font-semibold block">
                  Tribeca Dental Studio
                </span>
              </div>
            </div>

            {/* Center Floating Frosted Nav Capsule (Like in Pinterest image) */}
            <nav className="hidden md:flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 text-xs text-stone-200">
              <a
                href="#experience"
                className="px-3 py-1 rounded-full hover:bg-white/10 hover:text-white transition-colors"
              >
                Experience
              </a>
              <a
                href="#doctor"
                className="px-3 py-1 rounded-full hover:bg-white/10 hover:text-white transition-colors"
              >
                Clinical Director
              </a>
              <a
                href="#treatments"
                className="px-3 py-1 rounded-full hover:bg-white/10 hover:text-white transition-colors"
              >
                Care & Menu
              </a>
              <a
                href="#reviews"
                className="px-3 py-1 rounded-full hover:bg-white/10 hover:text-white transition-colors"
              >
                Transformations
              </a>
              <button
                onClick={onOpenDbModal}
                className="px-3 py-1 rounded-full bg-[#15332D] text-[#E6D7C3] hover:text-white transition-colors flex items-center gap-1.5 font-mono text-[11px]"
              >
                <span>MongoDB</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </button>
            </nav>

            {/* Right Action: Photo Switcher & Booking Trigger */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Perspective toggle (Closeup vs Suite view) */}
              <button
                onClick={() => setActivePhoto(activePhoto === 'closeup' ? 'suite' : 'closeup')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-stone-300 hover:text-white hover:border-white/40 text-[11px] transition-all cursor-pointer"
                title="Switch between close-up smile and private suite photography"
              >
                <SlidersHorizontal className="w-3 h-3 text-[#C5A880]" />
                <span>{activePhoto === 'closeup' ? 'View Suite' : 'View Smile'}</span>
              </button>

              {/* Book Call / Reserve Visit Button */}
              <button
                onClick={() => setHeroMode(heroMode === 'cinematic' ? 'booking' : 'cinematic')}
                className="bg-[#C5A880] hover:bg-white text-[#081714] font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>{heroMode === 'cinematic' ? 'Book a Visit' : 'Back to View'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* =====================================================================
              LAYER 3 (z-20): Hero Editorial Content & Interactive Controls
              ===================================================================== */}
          <div className="relative z-20 px-6 sm:px-10 lg:px-14 py-8 sm:py-12 my-auto">
            {heroMode === 'cinematic' ? (
              /* Standard Cinematic View (Exact match to the Pinterest reference layout) */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column: Bold Typography & Floating Elements */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Studio Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-stone-300 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[#E6D7C3]">
                      Tribeca Flagship Studio • Next-Gen Dentistry
                    </span>
                  </div>

                  {/* Main Headline (like "Family-Friendly Dental Care" / "Dentistry re-imagined as restorative self-care") */}
                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] font-normal text-balance">
                    Dentistry re-imagined as <br />
                    <span className="italic text-[#E6D7C3] font-normal">restorative self-care.</span>
                  </h1>

                  {/* Editorial Subtitle */}
                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal text-balance opacity-95">
                    Permanent natural-looking solutions, 3D laser precision, and an architectural sanctuary
                    free from sterile waiting rooms and anxiety-inducing drills.
                  </p>

                  {/* Primary CTA Button with Circle Arrow (Just like in Pinterest screenshot) */}
                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setHeroMode('booking')}
                      className="group inline-flex items-center gap-3 bg-white hover:bg-[#E6D7C3] text-[#081714] font-semibold pl-6 pr-2.5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-xl active:scale-95 cursor-pointer"
                    >
                      <span>Book an Appointment</span>
                      <div className="w-8 h-8 rounded-full bg-[#081714] text-[#E6D7C3] group-hover:bg-[#122B26] flex items-center justify-center transition-colors">
                        <ArrowRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        const target = document.getElementById('experience');
                        target?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-stone-200 hover:text-white hover:border-white/40 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <span>Explore The Experience</span>
                    </button>
                  </div>

                  {/* Floating Glass Feature Card (Matching bottom-left card in reference image) */}
                  <div className="pt-4">
                    <div className="max-w-md bg-[#081714]/85 backdrop-blur-xl border border-white/15 p-4 rounded-2xl shadow-2xl flex items-center gap-4 group hover:border-[#C5A880]/50 transition-all">
                      <div className="relative shrink-0">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4f6xdCDRRT4AvARJczTOWREuWEypX8K295DtWoD730OCj7pP4pQM9YjsZB8RiWkFNCdE84awNcsIGrpzpS8OdK64RyyT6XOdJhXc6nPM0jtxucJQEyJXNWl4GMUnw6jfLDHtPq5n4lbSeXTMYdurduNK6y2D76HB2EfjxCHpuJ3AfUPIzoi3pv-Ogp5unrYfRTB4MzuFOpqnwRdFoTqXNvpJT2R_cLJ0YsXBXbBp3pKT9VkquJM9s"
                          alt="Dr. Elena Vance"
                          className="w-14 h-14 rounded-xl object-cover border border-white/20"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/public/assets/aistudio/Image_1_0d8ea4d3.png';
                          }}
                        />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#081714]" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-white leading-snug">
                          Restore natural healthy confident dental growth.
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-stone-300">
                          <span className="flex items-center gap-1 text-amber-400 font-semibold font-mono">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            4.9 Rating
                          </span>
                          <span className="text-white/30">•</span>
                          <span className="text-stone-400">00 min wait guarantee</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Floating Pill Tags Over Image (Direct match to reference image bottom-right pills) */}
                <div className="lg:col-span-5 flex flex-col justify-end items-start lg:items-end space-y-4 pt-6 lg:pt-0">
                  <div className="text-left lg:text-right space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880] block">
                      Curated Studio Menu
                    </span>
                    <p className="text-xs text-stone-300">Tap any treatment to pre-select or view pricing</p>
                  </div>

                  {/* Translucent Frosted Glass Pills (Matching Reference) */}
                  <div className="flex flex-wrap lg:justify-end gap-2 max-w-sm">
                    {treatments.map((t) => {
                      const isSelected = selectedTreatment === t.name || selectedTreatment === t.label;
                      return (
                        <button
                          key={t.name}
                          type="button"
                          onClick={() => {
                            onSelectTreatment(t.name);
                            setHeroMode('booking');
                          }}
                          className={`px-4 py-2 rounded-full text-xs font-medium transition-all backdrop-blur-md cursor-pointer flex items-center gap-2 ${
                            isSelected
                              ? 'bg-[#C5A880] text-[#081714] font-semibold shadow-lg scale-105 border border-white'
                              : 'bg-black/50 border border-white/20 text-white hover:bg-white/20 hover:border-white/40'
                          }`}
                        >
                          <span>{t.label}</span>
                          <span className="text-[10px] opacity-75 font-mono">{t.price}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Direct Switch to Reservation Form */}
                  <button
                    onClick={() => setHeroMode('booking')}
                    className="mt-2 text-xs text-[#E6D7C3] hover:text-white flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 hover:border-white/30 transition-all cursor-pointer font-medium"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Instant Studio Reservation Form &rarr;</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Interactive Booking View inside the Framed Hero */
              <div className="max-w-2xl mx-auto bg-[#081714]/90 backdrop-blur-2xl border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl animate-scale-up">
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A880] block">
                      Direct Concierge Booking
                    </span>
                    <h3 className="font-serif text-2xl font-semibold text-white">
                      Express Studio Reservation
                    </h3>
                  </div>
                  <button
                    onClick={() => setHeroMode('cinematic')}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {confirmedReservation ? (
                  /* Confirmed State */
                  <div className="mt-5 space-y-4 animate-fade-in">
                    <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-emerald-100">
                      <div className="flex items-center gap-2 mb-1 text-emerald-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="font-semibold text-sm">Suite Reserved in MongoDB!</span>
                      </div>
                      <p className="text-xs leading-relaxed text-emerald-200">
                        Welcome, <strong>{confirmedReservation.patientName}</strong>. Your private studio suite is
                        now secured with Dr. Vance’s clinical team.
                      </p>
                    </div>

                    <div className="bg-black/50 p-4 rounded-2xl space-y-2 text-xs border border-white/10 font-sans">
                      <div className="flex justify-between py-1 border-b border-white/10">
                        <span className="text-stone-400">Treatment:</span>
                        <span className="font-medium text-white">{confirmedReservation.treatment}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/10">
                        <span className="text-stone-400">Window:</span>
                        <span className="font-medium text-[#C5A880] font-mono">{confirmedReservation.slot}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/10">
                        <span className="text-stone-400">Assigned Suite:</span>
                        <span className="font-semibold text-white">{confirmedReservation.suiteAssigned}</span>
                      </div>
                      <div className="flex justify-between pt-1 text-[11px] text-stone-400 font-mono">
                        <span>MongoDB Document ID:</span>
                        <span>{confirmedReservation._id}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={onOpenDbModal}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#C5A880] text-[#081714] font-semibold text-xs uppercase tracking-wider transition-all"
                      >
                        Inspect in MongoDB
                      </button>
                      <button
                        onClick={handleReset}
                        className="py-2.5 px-4 rounded-xl border border-white/30 text-white hover:bg-white/10 text-xs font-semibold transition-all"
                      >
                        Book Another
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Form Flow */
                  <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                    {/* 1. Treatment Selector */}
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1.5 uppercase tracking-wider text-[10px]">
                        1. Treatment Purpose
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {treatments.map((t) => {
                          const isSelected = selectedTreatment === t.name;
                          return (
                            <button
                              key={t.name}
                              type="button"
                              onClick={() => onSelectTreatment(t.name)}
                              className={`text-left px-3 py-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'border-[#C5A880] bg-[#122B26] text-white ring-1 ring-[#C5A880]'
                                  : 'border-white/15 bg-black/40 text-stone-300 hover:border-white/40'
                              }`}
                            >
                              <span className="font-medium truncate mr-1">
                                {t.icon} {t.label}
                              </span>
                              <span className="text-[10px] font-mono text-stone-400 shrink-0">{t.price}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Arrival Window */}
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1.5 uppercase tracking-wider text-[10px]">
                        2. Preferred Arrival Window
                      </label>
                      <div className="grid grid-cols-3 gap-2 text-xs text-center font-medium">
                        {slots.map((s) => {
                          const val = `${s.day} ${s.time}`;
                          const isChecked = selectedSlot === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setSelectedSlot(val)}
                              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                isChecked
                                  ? 'border-[#C5A880] bg-[#C5A880] text-[#081714] font-bold'
                                  : 'border-white/15 bg-black/40 text-stone-300 hover:border-white/40'
                              }`}
                            >
                              <span className="block">{s.day}</span>
                              <span className="text-[10px] font-mono opacity-80">{s.time}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Patient Contact & Insurance */}
                    <div className="space-y-2">
                      <label className="block font-semibold text-stone-300 uppercase tracking-wider text-[10px]">
                        3. Contact & Insurance
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          className="w-full text-xs rounded-xl border border-white/20 focus:border-[#C5A880] focus:outline-none py-2.5 px-3 bg-black/50 text-white placeholder-stone-500"
                          placeholder="Full Name"
                          required
                          type="text"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                        />
                        <input
                          className="w-full text-xs rounded-xl border border-white/20 focus:border-[#C5A880] focus:outline-none py-2.5 px-3 bg-black/50 text-white placeholder-stone-500"
                          placeholder="Mobile Phone (for SMS confirmation)"
                          required
                          type="tel"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                        />
                      </div>

                      <select
                        className="w-full text-xs rounded-xl border border-white/20 focus:border-[#C5A880] focus:outline-none py-2 px-3 bg-black/70 text-stone-200"
                        value={insurance}
                        onChange={(e) => setInsurance(e.target.value)}
                      >
                        <option value="Delta Dental PPO">Delta Dental PPO (In-Network Direct Triage)</option>
                        <option value="Aetna PPO">Aetna Dental PPO</option>
                        <option value="Cigna Healthcare">Cigna Dental Advantage</option>
                        <option value="MetLife PDP Plus">MetLife PDP Plus</option>
                        <option value="Guardian">Guardian Any Doctor</option>
                        <option value="Direct Private Pay">Direct Private Pay / Studio Membership</option>
                      </select>
                    </div>

                    {errorMessage && (
                      <p className="text-xs text-rose-300 bg-rose-950/70 p-2.5 rounded-xl border border-rose-500/30">
                        {errorMessage}
                      </p>
                    )}

                    {/* Submit Button */}
                    <button
                      disabled={isSubmitting}
                      className="w-full mt-2 bg-[#C5A880] hover:bg-white text-[#081714] py-3.5 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      type="submit"
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin text-[#081714]" />
                          <span>Holding Private Suite in MongoDB...</span>
                        </>
                      ) : (
                        <>
                          <span>Hold My Studio Suite</span>
                          <ArrowRight className="w-4 h-4 text-[#081714]" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-4 text-[10px] text-stone-400 pt-1 font-medium">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                        HIPAA Encrypted
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
                        No Payment Required Today
                      </span>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* =====================================================================
              LAYER 4 (z-20): Bottom Status Ticker (Matching Reference Image Footnote)
              ===================================================================== */}
          <div className="relative z-20 px-6 sm:px-10 py-4 border-t border-white/10 bg-black/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-400 font-medium">
            <div className="flex items-center gap-2">
              <span className="text-[#C5A880] font-serif font-bold">BRIGHT SMILE</span>
              <span className="text-white/20">•</span>
              <span>Your Teeth · Our Science</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-stone-300">
                Preview <span className="text-white font-bold">01 / 04</span> Sanctuary Suites
              </span>
              <span className="text-white/20">•</span>
              <button
                onClick={() => {
                  const target = document.getElementById('experience');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Scroll for Sanctuary Standard</span>
                <span>↓</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PROCESS STEPPER RIBBON (Directly beneath Hero, matching Pinterest concept)
            ========================================================================= */}
        <div className="mt-8 pt-6 pb-4 border-b border-stone-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-stone-600 font-medium">
              <span className="w-6 h-6 rounded-full bg-[#122B26] text-[#E6D7C3] flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                01
              </span>
              <span>Smile Assessment & 3D Scan</span>
            </div>

            <div className="flex items-center gap-2.5 text-stone-600 font-medium">
              <span className="w-6 h-6 rounded-full bg-[#122B26] text-[#E6D7C3] flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                02
              </span>
              <span>Care Planning & Upfront Pricing</span>
            </div>

            <div className="flex items-center gap-2.5 text-stone-600 font-medium">
              <span className="w-6 h-6 rounded-full bg-[#122B26] text-[#E6D7C3] flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                03
              </span>
              <span>Treatment in Private Suite</span>
            </div>

            <div className="flex items-center gap-2.5 text-stone-600 font-medium">
              <span className="w-6 h-6 rounded-full bg-[#122B26] text-[#E6D7C3] flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                04
              </span>
              <span>Dental Longevity & Maintenance</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            EDITORIAL "ABOUT US" MANIFESTO (Matching lower half of Pinterest concept)
            ========================================================================= */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex items-center gap-4">
            <div className="flex -space-x-3">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4f6xdCDRRT4AvARJczTOWREuWEypX8K295DtWoD730OCj7pP4pQM9YjsZB8RiWkFNCdE84awNcsIGrpzpS8OdK64RyyT6XOdJhXc6nPM0jtxucJQEyJXNWl4GMUnw6jfLDHtPq5n4lbSeXTMYdurduNK6y2D76HB2EfjxCHpuJ3AfUPIzoi3pv-Ogp5unrYfRTB4MzuFOpqnwRdFoTqXNvpJT2R_cLJ0YsXBXbBp3pKT9VkquJM9s"
                alt="Dr. Elena Vance"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/public/assets/aistudio/Image_1_0d8ea4d3.png';
                }}
              />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjW6L01FspZPCRZnSAQYWatd413AnEdaiyRfU9KxPmdNYiYR4_B9dLURMlFD3K_W8mEIbs8J0kp7PUil5bz8WTkfOimwksSwuQBnDeG5QsZEGtuVZK5U979dBEeVJAN-fJbCileUc1uGBx_BR4ReW9m_crUeAONTixlsFQUEVk6VWLTz32ZQNhtYNbPAkoRzUJHJX_HJPeYPWC8OMTBFOIjh7whmRx0fU95ImAGrM7U7iTSbH0ywzx"
                alt="Clinical Associate"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#AB8E65] block">
                Tribeca Clinical Team
              </span>
              <p className="text-xs font-semibold text-[#122B26]">Dr. Vance & Associates</p>
            </div>
          </div>

          <div className="md:col-span-8">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#122B26] leading-snug font-normal text-balance">
              We deliver personalized dental treatments with modern technology and gentle care ensuring healthy,
              confident smiles for every patient.
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};
