import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ServicesPricing from './components/ServicesPricing';
import BookingSection from './components/BookingSection';
import FaqSection from './components/FaqSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [selectedService, setSelectedService] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const checkAdminInUrl = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      if (hash.toLowerCase().includes('admin') || search.toLowerCase().includes('admin')) {
        setIsAdminOpen(true);
      }
    };
    checkAdminInUrl();
    window.addEventListener('hashchange', checkAdminInUrl);
    return () => window.removeEventListener('hashchange', checkAdminInUrl);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceToBook = (service) => {
    setSelectedService(service);
    scrollToSection('booking');
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash.toLowerCase().includes('admin')) {
      history.replaceState(null, document.title, window.location.pathname);
    }
  };

  return (
    <div className="forher-app-root">
      {/* 1. Header with brand logo, nav links and Book CTA */}
      <Header onBookClick={() => scrollToSection('booking')} />

      {/* Main Content Sections */}
      <main id="main-content">
        {/* 2. Hero Section: Introduction & Call to Action */}
        <Hero 
          onBookClick={() => scrollToSection('booking')}
          onPricingClick={() => scrollToSection('services')}
        />

        {/* 3. About Section: Introduction to FORHER Beauty & Spa & 3 Floors */}
        <AboutSection 
          onBookClick={() => scrollToSection('booking')} 
          onPricingClick={() => scrollToSection('services')}
        />

        {/* 4. Services & Pricing: 35 services with direct booking buttons */}
        <ServicesPricing 
          onSelectServiceToBook={handleSelectServiceToBook}
        />

        {/* 5. Central Booking Section: Online appointment form with Zalo & Hotline integration */}
        <BookingSection 
          selectedService={selectedService}
          onClearSelectedService={() => setSelectedService(null)}
        />

        {/* 6. FAQ & Local SEO Section: Questions & answers for District 10 spa searches */}
        <FaqSection 
          onBookClick={() => scrollToSection('booking')}
        />

        {/* 7. Contact & Location: Address, Opening Hours, Map & Social Links */}
        <ContactSection />
      </main>

      {/* 7. Footer: Brand information, commitments, and links */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Floating Action Dock: Quick Zalo, Phone & Book triggers */}
      <FloatingActions onBookClick={() => scrollToSection('booking')} />

      {/* Admin Panel: Bookings management & Audit Logs */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={handleCloseAdmin} 
      />
    </div>
  );
}
