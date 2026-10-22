import React from 'react';
import { COMPANY_INFO } from '../data/servicesData';

export default function Footer({ onOpenAdmin }) {
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
              <li><button type="button" onClick={() => handleScrollTo('faq')}>Hỏi Đáp Dịch Vụ (FAQ)</button></li>
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

        {/* SEO On-Page Keywords Cluster */}
        <div className="footer-seo-cluster">
          <span className="seo-cluster-title">Từ Khóa Tìm Kiếm Spa Quận 10 & Dịch Vụ Làm Đẹp Nổi Bật:</span>
          <div className="seo-cluster-tags">
            <span className="seo-tag">Spa Quận 10</span>
            <span className="seo-dot">•</span>
            <span className="seo-tag">Spa Uy Tín Quận 10</span>
            <span className="seo-dot">•</span>
            <span className="seo-tag">Triệt Lông Diode Laser Quận 10 (BH 2 Năm)</span>
            <span className="seo-dot">•</span>
            <span className="seo-tag">Lấy Nhân Mụn Chuẩn Y Khoa Quận 10</span>
            <span className="seo-dot">•</span>
            <span className="seo-tag">Chăm Sóc Da Quận 10</span>
            <span className="seo-dot">•</span>
            <span className="seo-tag">Chemical Peel Da Sinh Học</span>
            <span className="seo-dot">•</span>
            <span className="seo-tag">Gội Đầu Dưỡng Sinh Thảo Mộc Quận 10</span>
            <span className="seo-dot">•</span>
            <span className="seo-tag">Three House Nails Nghệ Thuật</span>
            <span className="seo-dot">•</span>
            <span className="seo-tag">Spa 515 Bà Hạt Phường Diên Hồng</span>
            <span className="seo-dot">•</span>
            <span className="seo-tag">FORHER Beauty & Spa TP.HCM</span>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© {currentYear} {COMPANY_INFO.name}. Trang giới thiệu & đặt lịch dịch vụ làm đẹp chính thức.</p>
          <div className="footer-bottom-links">
            <span>{COMPANY_INFO.addressShort}</span>
            <span>•</span>
            <a href={COMPANY_INFO.social.facebook} target="_blank" rel="noopener noreferrer">FB: FORHER Beauty & Spa</a>
            <span>•</span>
            <a href={COMPANY_INFO.social.tiktok} target="_blank" rel="noopener noreferrer">TikTok: @forherbeautyclinic</a>
            <span>•</span>
            <a href={COMPANY_INFO.social.zalo} target="_blank" rel="noopener noreferrer">Zalo: {COMPANY_INFO.phone}</a>
            <span>•</span>
            <button 
              type="button" 
              onClick={onOpenAdmin} 
              className="footer-admin-btn"
              title="Đăng nhập quản trị đơn đặt lịch"
            >
              Quản Trị Đơn
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
