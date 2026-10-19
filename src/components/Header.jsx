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
              <span>Hotline: {COMPANY_INFO.phone}</span>
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
