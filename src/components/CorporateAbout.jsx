import React from 'react';

export default function CorporateAbout() {
  return (
    <section id="about" className="corp-section corp-bg-soft">
      <div className="corp-container">
        <div className="corp-section-header">
          <span className="corp-section-tag">VỀ FORHER BEAUTY & SPA</span>
          <h2 className="corp-section-title">Tiên Phong Trong Chuẩn Mực Thẩm Mỹ Y Khoa Thực Chứng</h2>
          <p className="corp-section-desc">
            Được xây dựng trên nền tảng y khoa chuyên sâu, FORHER Beauty & Spa cam kết mang lại sự an tâm tuyệt đối cho khách hàng thông qua phác đồ điều trị an toàn, công nghệ hiện đại và chính sách bảo hành minh bạch.
          </p>
        </div>

        <div className="corp-pillars-grid">
          <div className="corp-pillar-card">
            <div className="corp-pillar-icon-wrap">
              <span className="corp-pillar-icon">⚖️</span>
            </div>
            <h3 className="corp-pillar-title">Minh Bạch Bảng Giá 100%</h3>
            <p className="corp-pillar-desc">
              Tất cả các dịch vụ từ buổi lẻ đến gói liệu trình 5 buổi đều được niêm yết công khai. Tuyệt đối không chèo kéo, không phụ phí phát sinh trong suốt quá trình thực hiện.
            </p>
          </div>

          <div className="corp-pillar-card">
            <div className="corp-pillar-icon-wrap" style={{ background: '#E8F5E9', color: '#2E7D32' }}>
              <span className="corp-pillar-icon">🛡️</span>
            </div>
            <h3 className="corp-pillar-title">Bảo Hành 2 Năm Bằng Văn Bản</h3>
            <p className="corp-pillar-desc">
              Khách hàng triệt lông công nghệ cao Diode Laser được cấp thẻ bảo hành chính thức 2 năm (24 tháng), cam kết dặm lông định kỳ hoàn toàn miễn phí theo phác đồ.
            </p>
          </div>

          <div className="corp-pillar-card">
            <div className="corp-pillar-icon-wrap" style={{ background: '#EDE7F6', color: '#5E35B1' }}>
              <span className="corp-pillar-icon">🔬</span>
            </div>
            <h3 className="corp-pillar-title">Quy Chuẩn Vô Khuẩn Y Tế</h3>
            <p className="corp-pillar-desc">
              Tuân thủ nghiêm ngặt nguyên tắc vô trùng khép kín: Dụng cụ nặn mụn y tế dùng riêng 1 lần, tia điện tím sát trùng P.Acnes và phòng dịch vụ tiệt khuẩn bằng tia cực tím.
            </p>
          </div>

          <div className="corp-pillar-card">
            <div className="corp-pillar-icon-wrap" style={{ background: '#FCE4EC', color: '#C2185B' }}>
              <span className="corp-pillar-icon">👩‍⚕️</span>
            </div>
            <h3 className="corp-pillar-title">Đội Ngũ Kỹ Thuật Viên 1:1</h3>
            <p className="corp-pillar-desc">
              100% kỹ thuật viên được đào tạo bài bản về da liễu thẩm mỹ, thao tác êm ái, tận tình theo dõi quá trình hồi phục của từng khách hàng qua hệ thống quản lý hồ sơ điện tử.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
