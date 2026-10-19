import React, { useState } from 'react';
import { FAQS } from '../data/servicesData';

export default function CorporateFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? -1 : i);
  };

  return (
    <section className="corp-section">
      <div className="corp-container">
        <div className="corp-section-header">
          <span className="corp-section-tag">HỎI ĐÁP & CHÍNH SÁCH</span>
          <h2 className="corp-section-title">Câu Hỏi Thường Gặp (FAQ)</h2>
          <p className="corp-section-desc">
            Những thông tin giải đáp chi tiết về bảng giá niêm yết, chế độ bảo hành và thời gian hồi phục khi làm đẹp tại FORHER Beauty & Spa.
          </p>
        </div>

        <div className="corp-faq-wrapper">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className={`corp-faq-item ${isOpen ? 'open' : ''}`}>
                <button 
                  type="button" 
                  className="corp-faq-header"
                  onClick={() => toggle(i)}
                >
                  <span className="corp-faq-q">{faq.q}</span>
                  <span className="corp-faq-toggle-symbol">{isOpen ? '−' : '+'}</span>
                </button>
                <div className="corp-faq-body">
                  <p>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
