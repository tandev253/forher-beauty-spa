import React, { useState } from 'react';
import { COMPANY_INFO, SERVICES_CATALOG } from '../data/servicesData';

export default function CorporateHero({ onQuickBook }) {
  const [selectedService, setSelectedService] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedService || !phone) return;
    onQuickBook({
      serviceId: selectedService,
      name,
      phone,
      date,
      time
    });
  };

  return (
    <section id="hero" className="corp-hero-section">
      <div className="corp-container corp-hero-grid">
        {/* Left Column: Corporate Brand Statement */}
        <div className="corp-hero-text">
          <div className="corp-hero-badge">
            <span className="corp-badge-star">★</span>
            <span>VIỆN THẨM MỸ & ĐIỀU TRỊ DA CHUYÊN SÂU CHUẨN Y KHOA</span>
          </div>

          <h1 className="corp-hero-title">
            Nâng Tầm Nhan Sắc Với Phác Đồ <span className="corp-text-gold">Chuẩn Y Khoa & Bảo Hành 2 Năm</span>
          </h1>

          <p className="corp-hero-desc">
            <strong>FORHER Beauty & Spa</strong> tự hào là trung tâm chăm sóc da và thẩm mỹ công nghệ cao hàng đầu tại Quận 10. Chúng tôi cam kết <strong>Bảo hành triệt lông 2 năm bằng văn bản</strong>, quy trình lấy mụn và Chemical Peel vô trùng 100%, cùng bảng giá niêm yết minh bạch tuyệt đối.
          </p>

          <div className="corp-trust-pills">
            <div className="corp-trust-pill">
              <span className="trust-pill-icon">🛡️</span>
              <div>
                <strong>Bảo Hành 2 Năm</strong>
                <p>Cam kết bằng văn bản có giá trị pháp lý</p>
              </div>
            </div>

            <div className="corp-trust-pill">
              <span className="trust-pill-icon">🔬</span>
              <div>
                <strong>Vô Khuẩn Y Tế 100%</strong>
                <p>Quy trình kiểm soát nhiễm khuẩn khép kín</p>
              </div>
            </div>

            <div className="corp-trust-pill">
              <span className="trust-pill-icon">💎</span>
              <div>
                <strong>Bảng Giá Minh Bạch</strong>
                <p>Không phát sinh bất kỳ chi phí ẩn nào</p>
              </div>
            </div>
          </div>

          <div className="corp-hero-actions">
            <a href="#pricing" className="corp-btn-primary">
              <span>Xem Bảng Giá Niêm Yết</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
            <a href={`https://zalo.me/${COMPANY_INFO.phoneClean}`} target="_blank" rel="noopener noreferrer" className="corp-btn-outline">
              <span>💬 Tư Vấn Zalo Trực Tiếp</span>
            </a>
          </div>

          {/* Key Corporate Metrics */}
          <div className="corp-metrics-grid">
            {COMPANY_INFO.stats.map((st, i) => (
              <div key={i} className="corp-metric-item">
                <div className="corp-metric-val">{st.value}</div>
                <div className="corp-metric-label">{st.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Integrated Online Booking Card */}
        <div className="corp-hero-form-wrap">
          <div className="corp-booking-card">
            <div className="booking-card-header">
              <span className="corp-form-tag">ĐẶT LỊCH TRỰC TUYẾN 24/7</span>
              <h3>Đăng Ký Khám Da & Giữ Chỗ Ưu Tiên</h3>
              <p>Khách hàng đăng ký online được ưu tiên tiếp đón 1:1 không phải chờ đợi.</p>
            </div>

            <form onSubmit={handleSubmit} className="booking-form-inner">
              <div className="form-group-field">
                <label htmlFor="hero-service">Dịch Vụ Cần Làm (*):</label>
                <select 
                  id="hero-service"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                >
                  <option value="">-- Chọn dịch vụ từ bảng giá --</option>
                  {SERVICES_CATALOG.map((s) => (
                    <option key={s.id} value={s.id}>
                      [{s.categoryName}] {s.name} ({s.singlePriceDisplay})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-field">
                <label htmlFor="hero-name">Họ và Tên Khách Hàng (*):</label>
                <input 
                  type="text" 
                  id="hero-name"
                  placeholder="Ví dụ: Nguyễn Phương Mai"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-field">
                <label htmlFor="hero-phone">Số Điện Thoại Nhận Xác Nhận (*):</label>
                <input 
                  type="tel" 
                  id="hero-phone"
                  placeholder="Ví dụ: 0909 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group-field">
                  <label htmlFor="hero-date">Ngày Hẹn:</label>
                  <input 
                    type="date" 
                    id="hero-date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group-field">
                  <label htmlFor="hero-time">Khung Giờ:</label>
                  <select 
                    id="hero-time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  >
                    <option value="09:30">09:30 Sáng</option>
                    <option value="11:00">11:00 Trưa</option>
                    <option value="14:00">14:00 Đầu Chiều</option>
                    <option value="16:00">16:00 Chiều</option>
                    <option value="18:00">18:00 Tối</option>
                    <option value="19:00">19:00 Tối</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="corp-btn-submit">
                <span>Xác Nhận Giữ Chỗ Ngay</span>
              </button>

              <div className="corp-form-footer-note">
                🔒 Thông tin được bảo mật theo tiêu chuẩn y tế doanh nghiệp.
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
