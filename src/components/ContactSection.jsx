import React from 'react';
import { COMPANY_INFO } from '../data/servicesData';

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding bg-soft-beige">
      <div className="site-container">
        <div className="section-header-center">
          <span className="section-subtitle">ĐỊA CHỈ SPA QUẬN 10 & THÔNG TIN LIÊN HỆ</span>
          <h2 className="section-title">Ghé Thăm FORHER Beauty & Spa</h2>
          <div className="section-divider-gold"></div>
          <p className="section-lead-text">
            Cơ sở tọa lạc tại mặt tiền 515 Bà Hạt, Phường Diên Hồng, TP.HCM (khu vực Quận 10), giao thông thuận tiện từ các quận trung tâm, có chỗ để xe máy & ô tô an ninh.
          </p>
        </div>

        <div className="contact-main-grid">
          {/* Info cards column */}
          <div className="contact-details-col">
            <div className="contact-info-card">
              <div>
                <h3 className="contact-card-label">Địa Chỉ Cơ Sở:</h3>
                <p className="contact-card-val">
                  <strong>{COMPANY_INFO.address}</strong>
                </p>
                <small className="contact-card-hint">
                  (Khu vực Quận 10 – Gần ngã tư Ngô Quyền & Bà Hạt, thuận tiện di chuyển & đỗ xe)
                </small>
                <div style={{ marginTop: '12px' }}>
                  <a 
                    href={COMPANY_INFO.googleMaps} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-btn-link"
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      padding: '8px 16px', 
                      fontSize: '0.85rem', 
                      fontWeight: 600, 
                      background: 'linear-gradient(135deg, #A8894E, #8C6D37)', 
                      color: '#fff', 
                      borderRadius: '8px', 
                      textDecoration: 'none',
                      boxShadow: '0 2px 6px rgba(140, 109, 55, 0.25)'
                    }}
                  >
                    📍 Mở Chỉ Đường Google Maps ↗
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-info-card">
              <div>
                <h3 className="contact-card-label">Tổng Đài Hotline & Zalo:</h3>
                <p className="contact-card-val">
                  <a href={`tel:${COMPANY_INFO.phoneClean}`} className="contact-hotline-link">
                    {COMPANY_INFO.phone}
                  </a>
                </p>
                <small className="contact-card-hint">
                  (Hỗ trợ tư vấn da, giải đáp phác đồ & đặt lịch hẹn 24/7)
                </small>
              </div>
            </div>

            <div className="contact-info-card">
              <div>
                <h3 className="contact-card-label">Thời Gian Phục Vụ:</h3>
                <p className="contact-card-val">
                  <strong>{COMPANY_INFO.workingHours}</strong>
                </p>
                <small className="contact-card-hint">
                  (Đón khách trưa & tối sau giờ tan làm)
                </small>
              </div>
            </div>

            <div className="contact-social-links-bar">
              <a 
                href={COMPANY_INFO.googleMaps} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-btn-link"
              >
                📍 Google Maps: FORHER Beauty & Spa
              </a>
              <a 
                href={COMPANY_INFO.social.zalo} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-btn-link"
              >
                Chat Zalo Doanh Nghiệp
              </a>
              <a 
                href={COMPANY_INFO.social.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-btn-link"
              >
                Facebook: FORHER Beauty & Spa
              </a>
              <a 
                href={COMPANY_INFO.social.tiktok} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-btn-link"
              >
                TikTok: @forherbeautyclinic
              </a>
            </div>
          </div>

          {/* Google Maps column */}
          <div className="contact-map-col">
            <div className="map-embed-box">
              <iframe
                title="Bản đồ chỉ đường FORHER Beauty & Spa 515 Bà Hạt Phường Diên Hồng Quận 10"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.605282464797!2d106.66099957586866!3d10.764800159371723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f9cec7c0d95%3A0xc85861d1fae02b27!2sFORHER%20Beauty%20%26%20Spa%20-%20Ch%C4%83m%20S%C3%B3c%20Da%20%26%20Tr%E1%BB%8B%20M%E1%BB%A5n%20Qu%E1%BA%ADn%2010!5e0!3m2!1svi!2svn!4v1761611084206!5m2!1svi!2svn"
                width="100%"
                height="380"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
