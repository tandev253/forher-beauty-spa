import React from 'react';
import { COMPANY_INFO } from '../data/servicesData';

export default function Hero({ onBookClick, onPricingClick }) {
  return (
    <section id="hero" className="hero-section">
      <div className="site-container hero-container-grid">
        {/* Left Column: Brand Message & CTAs */}
        <div className="hero-text-col">
          <div className="hero-badge">
            <span>CHĂM SÓC DA & THẨM MỸ CÔNG NGHỆ CAO CHUẨN Y KHOA</span>
          </div>

          <h1 className="hero-title">
            FORHER Beauty & Spa
            <span className="hero-title-sub">Nâng Tầm Vẻ Đẹp Tự Nhiên & Tỏa Sáng</span>
          </h1>

          <p className="hero-description">
            Chào mừng bạn đến với <strong>FORHER Beauty & Spa</strong> tại <strong>515 Bà Hạt, Quận 10, TP.HCM</strong>. 
            Không gian làm đẹp thư thái riêng tư, phác đồ điều trị da chuẩn y khoa: <strong>Triệt lông Diode Laser bảo hành 2 năm</strong>, 
            điều trị mụn tiêu khuẩn, Chemical Peel thay da sinh học & cấy tinh chất Meso căng bóng da.
          </p>

          {/* Action buttons */}
          <div className="hero-actions">
            <button 
              type="button" 
              className="btn-primary-gold" 
              onClick={onBookClick}
            >
              Đặt Lịch Hẹn Ngay
            </button>
            <button 
              type="button" 
              className="btn-outline-gold" 
              onClick={onPricingClick}
            >
              Xem Bảng Giá Dịch Vụ
            </button>
            <a 
              href={COMPANY_INFO.social.zalo} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-zalo-chat"
            >
              Tư Vấn Zalo: {COMPANY_INFO.phone}
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="hero-trust-bar">
            <div className="trust-item">
              <div>
                <strong>Bảo Hành 02 Năm</strong>
                <p>Cam kết bằng văn bản</p>
              </div>
            </div>

            <div className="trust-item">
              <div>
                <strong>Chuẩn Y Khoa 100%</strong>
                <p>Dụng cụ vô trùng riêng biệt</p>
              </div>
            </div>

            <div className="trust-item">
              <div>
                <strong>Bảng Giá Niêm Yết</strong>
                <p>Không phát sinh chi phí</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High-end Spa Imagery Showcase */}
        <div className="hero-visual-col">
          <div className="hero-image-frame">
            <img 
              src="./assets/spa_vip_room.jpg" 
              alt="Phòng trị liệu VIP tại FORHER Beauty & Spa 515 Bà Hạt Quận 10" 
              className="hero-main-img"
              loading="eager"
            />
            {/* Floating luxury badge */}
            <div className="hero-floating-badge">
              <div>
                <strong>Không Gian VIP Riêng Tư 1:1</strong>
                <p>515 Bà Hạt, P. Diên Hồng, Q.10 • TP.HCM</p>
              </div>
            </div>

            {/* Secondary guarantee pill */}
            <div className="hero-guarantee-pill">
              <span>100% Dụng Cụ Tiệt Trùng Y Khoa</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
