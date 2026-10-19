import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/servicesData';

export default function Header({ onBookClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="site-header">
      {/* Top micro bar */}
      <div className="top-micro-bar">
        <div className="site-container top-micro-inner">
          <div className="micro-left">
            <span>{COMPANY_INFO.addressShort}</span>
            <span className="micro-sep">•</span>
            <span>{COMPANY_INFO.workingHours}</span>
          </div>
          <div className="micro-right">
            <span>Hotline / Zalo: </span>
            <a href={`tel:${COMPANY_INFO.phoneClean}`} className="micro-hotline">
              {COMPANY_INFO.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="main-nav-bar">
        <div className="site-container nav-inner">
          {/* Brand Logo */}
          <a href="#" className="brand-logo" onClick={(e) => handleNavClick(e, 'hero')}>
            <span className="brand-script">{COMPANY_INFO.brandTitle}</span>
            <span className="brand-sub">Spa & Aesthetic Clinic</span>
          </a>

          {/* Desktop Nav links */}
          <ul className={`nav-menu-list ${mobileMenuOpen ? 'open' : ''}`}>
            <li>
              <a href="#hero" onClick={(e) => handleNavClick(e, 'hero')}>Trang Chủ</a>
            </li>
            <li>
              <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>Giới Thiệu</a>
            </li>
            <li>
              <a href="#services" onClick={(e) => handleNavClick(e, 'services')}>Dịch Vụ & Bảng Giá</a>
            </li>
            <li>
              <a href="#booking" onClick={(e) => handleNavClick(e, 'booking')}>Đặt Lịch Hẹn</a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Liên Hệ</a>
            </li>
            <li className="mobile-cta-item">
              <button 
                type="button" 
                className="btn-book-nav mobile-only"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBookClick();
                }}
              >
                Đặt Lịch Hẹn Ngay
              </button>
            </li>
          </ul>

          {/* Nav Right CTA */}
          <div className="nav-right-actions">
            <a 
              href={`tel:${COMPANY_INFO.phoneClean}`} 
              className="btn-nav-call"
              title="Gọi hotline"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span className="hotline-text-full">Hotline: {COMPANY_INFO.phone}</span>
              <span className="hotline-text-short">Gọi Spa</span>
            </a>

            <button 
              type="button" 
              className="btn-book-nav desktop-only"
              onClick={onBookClick}
            >
              Đặt Lịch Hẹn
            </button>

            {/* Mobile Hamburger button */}
            <button 
              type="button" 
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
