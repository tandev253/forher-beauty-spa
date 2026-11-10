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
import ArticlesPage, { BlogPreviewSection } from './components/ArticlesPage';

export default function App() {
  const [selectedService, setSelectedService] = useState(null);
  const [isAdminPage, setIsAdminPage] = useState(false);
  const [isArticlesPage, setIsArticlesPage] = useState(false);
  const [activeArticleSlug, setActiveArticleSlug] = useState(null);

  useEffect(() => {
    const checkRoute = () => {
      const rawPath = window.location.pathname;
      const pathname = rawPath.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      // 1. Check Admin route (/admin, #admin, ?admin)
      const isAdmin =
        pathname.startsWith('/admin') ||
        pathname === '/admin' ||
        pathname === '/admin/' ||
        hash.includes('admin') ||
        search.includes('admin') ||
        search.includes('p=/admin');

      if (isAdmin) {
        setIsAdminPage(true);
        setIsArticlesPage(false);
        setActiveArticleSlug(null);
        return;
      }

      // 2. Check Articles / Blog route (/bai-viet, /bai-viet/:slug, #bai-viet)
      if (
        pathname.startsWith('/bai-viet') ||
        pathname.startsWith('/blog') ||
        hash.startsWith('#bai-viet')
      ) {
        setIsAdminPage(false);
        setIsArticlesPage(true);

        let slug = null;
        if (pathname.startsWith('/bai-viet/')) {
          slug = rawPath.slice('/bai-viet/'.length).replace(/\/+$/, '') || null;
        } else if (pathname.startsWith('/blog/')) {
          slug = rawPath.slice('/blog/'.length).replace(/\/+$/, '') || null;
        } else if (hash.startsWith('#bai-viet/')) {
          slug = window.location.hash.slice('#bai-viet/'.length).replace(/\/+$/, '') || null;
        }
        setActiveArticleSlug(slug);
        return;
      }

      // 3. Default Homepage
      setIsAdminPage(false);
      setIsArticlesPage(false);
      setActiveArticleSlug(null);
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
    const lower = path.toLowerCase();
    if (lower.startsWith('/admin')) {
      setIsAdminPage(true);
      setIsArticlesPage(false);
      setActiveArticleSlug(null);
    } else if (lower.startsWith('/bai-viet') || lower.startsWith('/blog')) {
      setIsAdminPage(false);
      setIsArticlesPage(true);
      let slug = null;
      if (lower.startsWith('/bai-viet/')) {
        slug = path.slice('/bai-viet/'.length).replace(/\/+$/, '') || null;
      } else if (lower.startsWith('/blog/')) {
        slug = path.slice('/blog/'.length).replace(/\/+$/, '') || null;
      }
      setActiveArticleSlug(slug);
    } else {
      setIsAdminPage(false);
      setIsArticlesPage(false);
      setActiveArticleSlug(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    if (isArticlesPage || isAdminPage) {
      history.pushState(null, '', '/');
      setIsArticlesPage(false);
      setIsAdminPage(false);
      setActiveArticleSlug(null);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 80);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceToBook = (service) => {
    if (service) {
      setSelectedService(service);
    }
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
      <Header
        onBookClick={() => scrollToSection('booking')}
        onNavigateSection={(sectionId) => scrollToSection(sectionId)}
        onNavigateArticles={() => navigateTo('/bai-viet')}
        isArticlesActive={isArticlesPage}
      />

      {/* Main Content: Either Dedicated Articles Page OR Homepage Sections */}
      {isArticlesPage ? (
        <main id="main-content">
          <ArticlesPage
            activeSlug={activeArticleSlug}
            onSelectArticle={(slug) => navigateTo(`/bai-viet/${slug}`)}
            onBackToList={() => navigateTo('/bai-viet')}
            onBackHome={() => navigateTo('/')}
            onBookService={(service) => handleSelectServiceToBook(service)}
            onOpenAdmin={() => navigateTo('/admin')}
          />
        </main>
      ) : (
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

          {/* 6. Blog & Beauty Guide Preview Section */}
          <BlogPreviewSection
            onNavigateToArticles={() => navigateTo('/bai-viet')}
            onOpenArticle={(slug) => navigateTo(`/bai-viet/${slug}`)}
            onBookClick={() => scrollToSection('booking')}
          />

          {/* 7. FAQ & Local SEO Section: Questions & answers for District 10 spa searches */}
          <FaqSection
            onBookClick={() => scrollToSection('booking')}
          />

          {/* 8. Contact & Location: Address, Opening Hours, Map & Social Links */}
          <ContactSection />
        </main>
      )}

      {/* 9. Footer: Brand information, commitments, and link to /admin */}
      <Footer
        onOpenAdmin={() => navigateTo('/admin')}
        onNavigateArticles={() => navigateTo('/bai-viet')}
        onNavigateSection={(sectionId) => scrollToSection(sectionId)}
      />

      {/* Floating Action Dock: Quick Zalo, Phone & Book triggers */}
      <FloatingActions onBookClick={() => scrollToSection('booking')} />
    </div>
  );
}
