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
  const [isAdminPage, setIsAdminPage] = useState(false);

  useEffect(() => {
    const checkRoute = () => {
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      // Check if user is navigating to /admin, /admin/, #admin, ?admin, or ?p=/admin
      const isAdmin = (
        pathname.startsWith('/admin') ||
        pathname === '/admin' ||
        pathname === '/admin/' ||
        hash.includes('admin') ||
        search.includes('admin') ||
        search.includes('p=/admin')
      );
      setIsAdminPage(isAdmin);
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const navigateTo = (path) => {
    history.pushState(null, '', path);
    if (path.startsWith('/admin')) {
      setIsAdminPage(true);
    } else {
      setIsAdminPage(false);
    }
    window.scrollTo(0, 0);
  };

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

  // If on /admin route: Render standalone Admin Page (NOT a popup modal)
  if (isAdminPage) {
    return (
      <AdminPanel 
        isStandalone={true} 
        onBackToWebsite={() => navigateTo('/')}
      />
    );
  }

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

      {/* 8. Footer: Brand information, commitments, and link to /admin */}
      <Footer onOpenAdmin={() => navigateTo('/admin')} />

      {/* Floating Action Dock: Quick Zalo, Phone & Book triggers */}
      <FloatingActions onBookClick={() => scrollToSection('booking')} />
    </div>
  );
}
