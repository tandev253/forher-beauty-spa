import React from 'react';
import { TESTIMONIALS } from '../data/servicesData';

export default function CorporateTestimonials() {
  return (
    <section id="reviews" className="corp-section corp-bg-soft">
      <div className="corp-container">
        <div className="corp-section-header">
          <span className="corp-section-tag">ĐÁNH GIÁ TỪ KHÁCH HÀNG</span>
          <h2 className="corp-section-title">Niềm Tin Được Xây Dựng Từ Trải Nghiệm Thực Tế</h2>
          <p className="corp-section-desc">
            Hơn 10.000 khách hàng là các chuyên viên, nữ doanh nhân và bạn trẻ tại TP.HCM đã gửi trọn niềm tin cho FORHER Beauty.
          </p>
        </div>

        <div className="corp-reviews-grid">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="corp-review-card">
              <div className="review-stars">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="star-gold">★</span>
                ))}
              </div>

              <p className="review-comment">"{t.comment}"</p>

              <div className="review-author-box">
                <div className="review-author-avatar">
                  {t.name.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <h4 className="review-author-name">{t.name}</h4>
                  <div className="review-author-role">{t.role}</div>
                  <div className="review-author-treatment">Liệu trình: {t.treatment}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
