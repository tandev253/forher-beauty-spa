import React from 'react';
import { COMPANY_INFO } from '../data/servicesData';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="site-container footer-content-wrap">
        <div className="footer-top-row">
          {/* Brand info */}
          <div className="footer-brand-box">
            <span className="footer-logo-script">{COMPANY_INFO.brandTitle}</span>
            <p className="footer-brand-tagline">{COMPANY_INFO.tagline}</p>
            <p className="footer-brand-address">
              {COMPANY_INFO.address}
            </p>
            <p className="footer-brand-phone">
              Hotline / Zalo đặt lịch: <strong>{COMPANY_INFO.phone}</strong>
            </p>
          </div>

          {/* Quick links */}
          <div className="footer-links-box">
            <h4 className="footer-heading">Liên Kết Nhanh</h4>
            <ul className="footer-nav-list">
              <li><button type="button" onClick={() => handleScrollTo('hero')}>Trang Chủ</button></li>
              <li><button type="button" onClick={() => handleScrollTo('about')}>Giới Thiệu FORHER</button></li>
              <li><button type="button" onClick={() => handleScrollTo('services')}>Bảng Giá Dịch Vụ</button></li>
              <li><button type="button" onClick={() => handleScrollTo('booking')}>Đặt Lịch Hẹn Trực Tuyến</button></li>
              <li><button type="button" onClick={() => handleScrollTo('contact')}>Địa Chỉ & Bản Đồ</button></li>
            </ul>
          </div>

          {/* Business commitments */}
          <div className="footer-commit-box">
            <h4 className="footer-heading">Cam Kết Doanh Nghiệp</h4>
            <ul className="footer-commit-list">
              <li><strong>Bảo Hành 2 Năm:</strong> Bằng văn bản cho mọi vùng triệt lông Diode Laser.</li>
              <li><strong>Tiệt Trùng Riêng Biệt:</strong> Dụng cụ 1 lần riêng biệt, an toàn tuyệt đối.</li>
              <li><strong>Minh Bạch Giá:</strong> Tuyệt đối không chèo kéo, không phát sinh phụ phí.</li>
              <li><strong>Giờ Mở Cửa:</strong> {COMPANY_INFO.workingHours}.</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© {currentYear} {COMPANY_INFO.name}. Trang giới thiệu & đặt lịch dịch vụ làm đẹp chính thức.</p>
          <div className="footer-bottom-links">
            <span>515 Bà Hạt, P.8, Q.10, TP.HCM</span>
            <span>•</span>
            <a href={COMPANY_INFO.social.zalo} target="_blank" rel="noopener noreferrer">Zalo: {COMPANY_INFO.phone}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
