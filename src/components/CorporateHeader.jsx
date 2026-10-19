import React, { useState, useEffect } from 'react';
import { COMPANY_INFO } from '../data/servicesData';

export default function CorporateHeader({ cartCount, onOpenCart }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Corporate Utility Top Bar */}
      <aside className="corp-top-bar" aria-label="Thông tin liên hệ doanh nghiệp">
        <div className="corp-container corp-top-inner">
          <div className="corp-top-left">
            <span className="corp-top-item">
              <span className="corp-icon">📍</span> {COMPANY_INFO.addressShort}
            </span>
            <span className="corp-divider">•</span>
            <span className="corp-top-item">
              <span className="corp-icon">⏰</span> {COMPANY_INFO.workingHours}
            </span>
          </div>

          <div className="corp-top-right">
            <a href={`tel:${COMPANY_INFO.phoneClean}`} className="corp-top-phone">
              <span className="corp-icon">📞</span> Hotline: <strong>{COMPANY_INFO.phone}</strong>
            </a>
            <span className="corp-divider">•</span>
            <a href={COMPANY_INFO.social.zalo} target="_blank" rel="noopener noreferrer" className="corp-top-link">
              Zalo Doanh Nghiệp
            </a>
            <span className="corp-divider">•</span>
            <a href={COMPANY_INFO.social.facebook} target="_blank" rel="noopener noreferrer" className="corp-top-link">
              Facebook
            </a>
            <span className="corp-divider">•</span>
            <a href={COMPANY_INFO.social.tiktok} target="_blank" rel="noopener noreferrer" className="corp-top-link">
              TikTok
            </a>
          </div>
        </div>
      </aside>

      {/* Main Corporate Header */}
      <header className={`corp-main-header ${isScrolled ? 'corp-header-scrolled' : ''}`}>
        <div className="corp-container corp-nav-inner">
          {/* Brand Logo */}
          <a href="#hero" className="corp-brand-logo" aria-label="FORHER Beauty & Spa">
            <div className="corp-brand-name-wrap">
              <span className="corp-brand-cursive">{COMPANY_INFO.brandTitle}</span>
              <span className="corp-brand-badge">AESTHETIC CLINIC</span>
            </div>
            <div className="corp-brand-sub">{COMPANY_INFO.tagline}</div>
          </a>

          {/* Navigation Menu */}
          <nav aria-label="Menu điều hướng doanh nghiệp">
            <ul className={`corp-nav-links ${mobileOpen ? 'mobile-visible' : ''}`}>
              <li>
                <a href="#hero" className="corp-nav-link active" onClick={() => setMobileOpen(false)}>
                  Trang Chủ
                </a>
              </li>
              <li>
                <a href="#about" className="corp-nav-link" onClick={() => setMobileOpen(false)}>
                  Về FORHER
                </a>
              </li>
              <li>
                <a href="#pricing" className="corp-nav-link" onClick={() => setMobileOpen(false)}>
                  Dịch Vụ & Bảng Giá <span className="nav-tag-pill">BH 2 Năm</span>
                </a>
              </li>
              <li>
                <a href="#process" className="corp-nav-link" onClick={() => setMobileOpen(false)}>
                  Quy Trình Y Khoa
                </a>
              </li>
              <li>
                <a href="#warranty" className="corp-nav-link" onClick={() => setMobileOpen(false)}>
                  Chính Sách Bảo Hành
                </a>
              </li>
              <li>
                <a href="#reviews" className="corp-nav-link" onClick={() => setMobileOpen(false)}>
                  Đánh Giá
                </a>
              </li>
              <li>
                <a href="#contact" className="corp-nav-link" onClick={() => setMobileOpen(false)}>
                  Liên Hệ & Bản Đồ
                </a>
              </li>
            </ul>
          </nav>

          {/* Nav Actions */}
          <div className="corp-nav-actions">
            <button 
              type="button" 
              className="corp-cart-btn" 
              onClick={onOpenCart}
              aria-label="Xem dịch vụ đã chọn"
            >
              <span>🛍️ Giỏ Dịch Vụ</span>
              <span className="corp-cart-counter">{cartCount}</span>
            </button>

            <a href="#pricing" className="corp-btn-primary">
              <span>Đặt Lịch Ngay</span>
            </a>

            {/* Mobile Hamburger */}
            <button 
              type="button" 
              className="corp-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Mở menu di động"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
