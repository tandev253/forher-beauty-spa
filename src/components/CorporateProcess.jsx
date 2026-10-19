import React from 'react';
import { CLINICAL_STEPS } from '../data/servicesData';

export default function CorporateProcess() {
  return (
    <section id="process" className="corp-section corp-bg-soft">
      <div className="corp-container">
        <div className="corp-section-header">
          <span className="corp-section-tag">QUY TRÌNH CHUẨN Y KHOA</span>
          <h2 className="corp-section-title">Quy Trình 6 Bước Điều Trị Vô Khuẩn Khép Kín</h2>
          <p className="corp-section-desc">
            Mọi thao tác tại FORHER Beauty & Spa đều được chuẩn hóa theo quy định kiểm soát nhiễm khuẩn của ngành y tế, bảo đảm an toàn tuyệt đối và hiệu quả phục hồi nhanh nhất.
          </p>
        </div>

        <div className="corp-steps-grid">
          {CLINICAL_STEPS.map((item) => (
            <div key={item.step} className="corp-step-card">
              <div className="step-badge-num">{item.step}</div>
              <h3 className="step-card-title">{item.title}</h3>
              <p className="step-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
