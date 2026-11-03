import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar.tsx';
import { Navigation } from './components/Navigation.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { SanctuaryStandard } from './components/SanctuaryStandard.tsx';
import { DirectorSpotlight } from './components/DirectorSpotlight.tsx';
import { CuratedOfferings } from './components/CuratedOfferings.tsx';
import { PatientTransformations } from './components/PatientTransformations.tsx';
import { Footer } from './components/Footer.tsx';
import { ClinicalConcierge } from './components/ClinicalConcierge.tsx';
import { DatabaseRecordsModal } from './components/DatabaseRecordsModal.tsx';
import { Reservation, DBStatusResponse, ConciergeMessage, Testimonial } from './types.ts';

export default function App() {
  const [selectedTreatment, setSelectedTreatment] = useState('Comprehensive Check & 3D Scan');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [messages, setMessages] = useState<ConciergeMessage[]>([]);
  const [dbStatus, setDbStatus] = useState<DBStatusResponse | null>(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  const fetchDatabaseStatus = async () => {
    try {
      const res = await fetch('/api/db/status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (err) {
      console.warn('Failed to fetch DB status', err);
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/reservations');
      if (res.ok) {
        const json = await res.json();
        if (json.data) setReservations(json.data);
      }
    } catch (err) {
      console.warn('Failed to fetch reservations', err);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      if (res.ok) {
        const json = await res.json();
        if (json.data) setTestimonials(json.data);
      }
    } catch (err) {
      console.warn('Failed to fetch testimonials', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/concierge/messages');
      if (res.ok) {
        const json = await res.json();
        if (json.data) setMessages(json.data);
      }
    } catch (err) {
      console.warn('Failed to fetch concierge messages', err);
    }
  };

  const refreshAllData = async () => {
    await Promise.all([
      fetchDatabaseStatus(),
      fetchReservations(),
      fetchTestimonials(),
      fetchMessages(),
    ]);
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const scrollToReserve = (treatmentName?: string) => {
    if (treatmentName) {
      setSelectedTreatment(treatmentName);
    }
    const target = document.getElementById('reservationSection');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReservationCreated = (newReservation: Reservation) => {
    setReservations((prev) => [newReservation, ...prev]);
    fetchDatabaseStatus();
  };

  const handleStatusChange = async (id: string, status: Reservation['status']) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setReservations((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReservation = async (id: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r._id !== id));
        fetchDatabaseStatus();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestimonialAdded = (testimonial: Testimonial) => {
    setTestimonials((prev) => [testimonial, ...prev]);
    fetchDatabaseStatus();
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-stone-800 font-sans antialiased selection:bg-[#E6D7C3] selection:text-[#081714]">
      {/* Luxury Announcement Banner */}
      <AnnouncementBar
        dbStatus={dbStatus}
        onOpenDbModal={() => setIsDbModalOpen(true)}
      />

      {/* Main Studio Navigation */}
      <Navigation
        onReserveClick={() => scrollToReserve()}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        reservationCount={reservations.length}
      />

      {/* Hero Section with Live MongoDB Express Booking */}
      <HeroSection
        selectedTreatment={selectedTreatment}
        onSelectTreatment={(t) => setSelectedTreatment(t)}
        onReservationCreated={handleReservationCreated}
        onOpenDbModal={() => setIsDbModalOpen(true)}
      />

      {/* Section 2: The Sanctuary Standard */}
      <SanctuaryStandard />

      {/* Section 3: Clinical Director Dr. Elena Vance DDS Spotlight */}
      <DirectorSpotlight
        onBookWithDoctor={() => scrollToReserve('Aesthetic Smile Consult')}
      />

      {/* Section 4: Curated Studio Offerings Menu */}
      <CuratedOfferings
        onSelectOffering={(treatment) => scrollToReserve(treatment)}
      />

      {/* Section 5: Real Patient Transformations */}
      <PatientTransformations
        testimonials={testimonials}
        onTestimonialAdded={handleTestimonialAdded}
      />

      {/* Studio Footer */}
      <Footer onOpenDbModal={() => setIsDbModalOpen(true)} />

      {/* Interactive Clinical Desk & Concierge Drawer */}
      <ClinicalConcierge
        initialMessages={messages}
        onMessageLogged={fetchMessages}
        onReserveTreatment={(t) => scrollToReserve(t)}
      />

      {/* Real-time MongoDB Collections Modal */}
      <DatabaseRecordsModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        dbStatus={dbStatus}
        reservations={reservations}
        messages={messages}
        testimonials={testimonials}
        onRefresh={refreshAllData}
        onStatusChange={handleStatusChange}
        onDeleteReservation={handleDeleteReservation}
      />
    </div>
  );
}
