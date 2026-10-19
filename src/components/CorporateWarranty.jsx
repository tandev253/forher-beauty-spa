import React from 'react';
import { WARRANTY_POLICY } from '../data/servicesData';

export default function CorporateWarranty() {
  return (
    <section id="warranty" className="corp-section">
      <div className="corp-container">
        <div className="corp-warranty-banner">
          <div className="warranty-banner-header">
            <span className="corp-section-tag" style={{ background: '#E8F5E9', color: '#2E7D32' }}>
              CAM KẾT DOANH NGHIỆP ĐỘC QUYỀN
            </span>
            <h2 className="corp-section-title" style={{ marginTop: '10px' }}>
              {WARRANTY_POLICY.title}
            </h2>
            <p className="corp-section-desc">
              {WARRANTY_POLICY.subtitle}
            </p>
          </div>

          <div className="warranty-cards-grid">
            {WARRANTY_POLICY.benefits.map((b, i) => (
              <div key={i} className="warranty-feature-box">
                <div className="warranty-check-icon">✓</div>
                <div>
                  <h4 className="warranty-feature-title">{b.title}</h4>
                  <p className="warranty-feature-desc">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="warranty-banner-footer">
            <div className="warranty-seal">
              <span style={{ fontSize: '1.8rem' }}>🛡️</span>
              <div>
                <strong>BẢO CHỨNG CHẤT LƯỢNG FORHER</strong>
                <p>Cam kết dặm lông định kỳ 2 năm miễn phí - Không phát sinh chi phí phụ thu</p>
              </div>
            </div>

            <a href="#pricing" className="corp-btn-primary" style={{ flexShrink: 0 }}>
              Xem Các Vùng Triệt Lông & Đăng Ký
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
