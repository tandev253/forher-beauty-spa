import React, { useState, useEffect } from 'react';
import { COMPANY_INFO } from '../data/servicesData';

export default function FloatingDock({ cartCount, onOpenCart }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className="corp-floating-dock" aria-label="Phím tắt liên hệ nhanh">
      {/* Scroll to Top */}
      {showScrollTop && (
        <button 
          type="button" 
          className="dock-item dock-scroll-top"
          onClick={scrollToTop}
          title="Cuộn lên đầu trang"
          aria-label="Cuộn lên đầu trang"
        >
          ▲
        </button>
      )}

      {/* Cart Drawer Trigger */}
      <button 
        type="button" 
        className="dock-item dock-cart"
        onClick={onOpenCart}
        title="Xem danh sách dịch vụ đã chọn & dự toán"
        aria-label="Xem giỏ dịch vụ"
      >
        <span className="dock-icon">📋</span>
        {cartCount > 0 && <span className="dock-badge">{cartCount}</span>}
      </button>

      {/* Zalo Direct Chat */}
      <a 
        href={COMPANY_INFO.social.zalo} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="dock-item dock-zalo"
        title="Chat tư vấn trực tiếp qua Zalo 0703 994 683"
        aria-label="Chat Zalo"
      >
        <span className="dock-pulse" />
        <span className="dock-icon">💬</span>
      </a>

      {/* Hotline Call Button */}
      <a 
        href={`tel:${COMPANY_INFO.phoneClean}`} 
        className="dock-item dock-phone"
        title={`Gọi Hotline ${COMPANY_INFO.phone}`}
        aria-label="Gọi Hotline"
      >
        <span className="dock-icon">📞</span>
      </a>
    </aside>
  );
}
