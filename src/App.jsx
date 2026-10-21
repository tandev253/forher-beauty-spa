import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ServicesPricing from './components/ServicesPricing';
import BookingSection from './components/BookingSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';

export default function App() {
  const [selectedService, setSelectedService] = useState(null);

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

        {/* 6. Contact & Location: Address, Opening Hours, Map & Social Links */}
        <ContactSection />
      </main>

      {/* 7. Footer: Brand information, commitments, and links */}
      <Footer />

      {/* Floating Action Dock: Quick Zalo, Phone & Book triggers */}
      <FloatingActions onBookClick={() => scrollToSection('booking')} />
    </div>
  );
}
