import React, { useState, useEffect } from 'react';
import { COMPANY_INFO } from '../data/servicesData';

export default function FloatingActions({ onBookClick }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className="floating-quick-dock" aria-label="Phím tắt liên hệ và đặt lịch">
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          type="button"
          className="dock-circle-action dock-action-top"
          onClick={scrollToTop}
          title="Lên đầu trang"
          aria-label="Lên đầu trang"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      )}

      {/* Book appointment shortcut */}
      <button
        type="button"
        className="dock-circle-action dock-action-book"
        onClick={onBookClick}
        title="Đặt lịch hẹn ngay"
        aria-label="Đặt lịch hẹn"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </button>

      {/* Zalo Direct Chat */}
      <a
        href={COMPANY_INFO.social.zalo}
        target="_blank"
        rel="noopener noreferrer"
        className="dock-circle-action dock-action-zalo"
        title="Chat Zalo 0703 994 683"
        aria-label="Chat Zalo"
      >
        <span className="zalo-pulse-ring"></span>
        <span className="dock-zalo-text">Zalo</span>
      </a>

      {/* Hotline call */}
      <a
        href={`tel:${COMPANY_INFO.phoneClean}`}
        className="dock-circle-action dock-action-phone"
        title={`Gọi Hotline ${COMPANY_INFO.phone}`}
        aria-label="Gọi Hotline"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      </a>
    </aside>
  );
}
