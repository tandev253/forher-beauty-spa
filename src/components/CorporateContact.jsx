import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/servicesData';

export default function CorporateContact() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', service: '', note: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const message = `Chào FORHER Beauty, mình cần tư vấn dịch vụ:\n- Khách hàng: ${formData.name} (${formData.phone})\n- Nhu cầu quan tâm: ${formData.service || 'Tư vấn tổng quát'}\n- Ghi chú: ${formData.note || 'Không có'}`;
    const zaloUrl = `https://zalo.me/${COMPANY_INFO.phoneClean}?text=${encodeURIComponent(message)}`;
    
    window.open(zaloUrl, '_blank');
    setSent(true);
  };

  return (
    <section id="contact" className="corp-section corp-bg-soft">
      <div className="corp-container">
        <div className="corp-contact-grid">
          {/* Corporate Information Column */}
          <div className="corp-contact-info-col">
            <span className="corp-section-tag">THÔNG TIN LIÊN HỆ & CƠ SỞ</span>
            <h2 className="corp-section-title" style={{ marginTop: '8px' }}>
              Ghé Thăm Viện Thẩm Mỹ FORHER Beauty
            </h2>
            <p className="corp-section-desc">
              Cơ sở tọa lạc tại trung tâm Quận 10, thuận tiện di chuyển, bãi đỗ xe ô tô và xe máy an ninh, không gian làm đẹp riêng tư chuẩn đẳng cấp.
            </p>

            <div className="corp-contact-cards-list">
              <div className="corp-contact-card-item">
                <div className="contact-icon-box">📍</div>
                <div>
                  <h4 className="contact-label">Địa Chỉ Trực Tiếp:</h4>
                  <p className="contact-value">
                    <strong>515 Bà Hạt, Phường Diên Hồng, Quận 10, TP. Hồ Chí Minh</strong>
                  </p>
                </div>
              </div>

              <div className="corp-contact-card-item">
                <div className="contact-icon-box">📞</div>
                <div>
                  <h4 className="contact-label">Hotline Chăm Sóc Khách Hàng (24/7):</h4>
                  <p className="contact-value">
                    <a href={`tel:${COMPANY_INFO.phoneClean}`} style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-script)' }}>
                      {COMPANY_INFO.phone}
                    </a>
                  </p>
                </div>
              </div>

              <div className="corp-contact-card-item">
                <div className="contact-icon-box">⏰</div>
                <div>
                  <h4 className="contact-label">Thời Gian Hoạt Động:</h4>
                  <p className="contact-value">
                    09:00 - 20:00 (Thứ Hai đến Chủ Nhật - Phục vụ xuyên trưa)
                  </p>
                </div>
              </div>
            </div>

            {/* Social channels buttons */}
            <div className="corp-social-buttons">
              <a href={COMPANY_INFO.social.zalo} target="_blank" rel="noopener noreferrer" className="corp-social-pill" style={{ background: '#0068FF', color: '#FFF' }}>
                <span>💬 Nhắn Zalo Hotline</span>
              </a>
              <a href={COMPANY_INFO.social.tiktok} target="_blank" rel="noopener noreferrer" className="corp-social-pill">
                <span>🎵 TikTok: {COMPANY_INFO.social.tiktokTag}</span>
              </a>
              <a href={COMPANY_INFO.social.instagram} target="_blank" rel="noopener noreferrer" className="corp-social-pill">
                <span>📸 Instagram: {COMPANY_INFO.social.instagramTag}</span>
              </a>
            </div>
          </div>

          {/* Interactive Map & Direct Directions Card */}
          <div className="corp-contact-map-col">
            <div className="corp-map-frame-card">
              <div className="map-badge-header">
                <div>
                  <strong>BẢN ĐỒ CƠ SỞ CHÍNH THỨC</strong>
                  <p style={{ fontSize: '0.8rem', color: '#7D6B60', margin: 0 }}>515 Bà Hạt, Phường Diên Hồng, Quận 10, TP.HCM</p>
                </div>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(COMPANY_INFO.address)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="corp-btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  Mở Google Maps
                </a>
              </div>

              {/* Map embed iframe */}
              <div className="map-embed-wrapper">
                <iframe 
                  title="Bản đồ chỉ đường FORHER Beauty Spa 515 Bà Hạt Quận 10"
                  src="https://maps.google.com/maps?q=515+Ba+Hat+Phuong+Dien+Hong+Quan+10+Ho+Chi+Minh&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%" 
                  height="340" 
                  style={{ border: 0, borderRadius: '8px' }} 
                  allowFullScreen="" 
                  loading="lazy"
                />
              </div>

              <div className="map-card-footer">
                <span>🚗 Có chỗ đỗ ô tô & xe máy miễn phí • Bảo vệ hỗ trợ dắt xe chu đáo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
