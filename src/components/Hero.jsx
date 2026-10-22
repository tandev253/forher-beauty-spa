import React from 'react';
import { COMPANY_INFO } from '../data/servicesData';
import forherSpaRoomReal from '../assets/forher_spa_room_real.jpg';

export default function Hero({ onBookClick, onPricingClick }) {
  return (
    <section id="hero" className="hero-section">
      <div className="site-container hero-container-grid">
        {/* Left Column: Brand Message & CTAs */}
        <div className="hero-text-col">
          <div className="hero-badge">
            <span>SPA UY TÍN QUẬN 10 • CHĂM SÓC DA • TRIỆT LÔNG DIODE LASER • DƯỠNG SINH & NAIL</span>
          </div>

          <h1 className="hero-title">
            FORHER Beauty & Spa
            <span className="hero-title-sub">Nâng Tầm Vẻ Đẹp Tự Nhiên & Tỏa Sáng</span>
          </h1>

          <p className="hero-description">
            Chào mừng bạn đến với <strong>FORHER Beauty & Spa</strong> – địa chỉ spa chăm sóc da & triệt lông uy tín tại <strong>515 Bà Hạt, P. Diên Hồng, TP.HCM (khu vực Quận 10)</strong>. 
            Không gian làm đẹp thư thái 3 tầng chuyên biệt: <strong>Triệt lông Diode Laser bảo hành 2 năm</strong>, 
            chăm sóc & lấy nhân mụn chuẩn y khoa vô trùng, Chemical Peel tái tạo da, cùng <strong>Gội đầu dưỡng sinh thảo dược</strong> và <strong>Three House Nails</strong> nghệ thuật.
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
                <strong>Tiệt Trùng 100%</strong>
                <p>Dụng cụ riêng biệt từng khách</p>
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

        {/* Right Column: Authentic Spa Imagery Showcase */}
        <div className="hero-visual-col">
          <div className="hero-image-frame">
            <img 
              src={forherSpaRoomReal} 
              alt="Không gian phòng thư giãn tại FORHER Beauty & Spa 515 Bà Hạt Phường Diên Hồng" 
              className="hero-main-img"
              loading="eager"
            />
            {/* Floating luxury badge */}
            <div className="hero-floating-badge">
              <div>
                <strong>Không Gian Thư Thái & Ấm Cúng</strong>
                <p>515 Bà Hạt, P. Diên Hồng • TP.HCM</p>
              </div>
            </div>

            {/* Secondary guarantee pill */}
            <div className="hero-guarantee-pill">
              <span>Dụng Cụ Tiệt Trùng Riêng Biệt</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
