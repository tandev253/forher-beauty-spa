import React from 'react';
import { COMPANY_INFO } from '../data/servicesData';
import forherStorefrontReal from '../assets/forher_storefront_real.jpg';
import forherFacialTreatmentReal from '../assets/forher_facial_treatment_real.jpg';
import forherSkincareCareReal from '../assets/forher_skincare_care_real.jpg';
import forherSpaRoomReal from '../assets/forher_spa_room_real.jpg';

export default function AboutSection({ onBookClick }) {
  const visualTreatments = [
    {
      id: 'storefront',
      title: 'Cơ Sở FORHER Beauty & Spa',
      desc: 'Tọa lạc tại mặt tiền 515 Bà Hạt, P.8, Quận 10. Không gian ấm cúng, tinh tế, trang thiết bị chăm sóc da và làm đẹp hiện đại, sạch sẽ.',
      image: forherStorefrontReal,
      tag: '515 BÀ HẠT, Q.10'
    },
    {
      id: 'chamsoc-da',
      title: 'Chăm Sóc & Lấy Mụn Chuẩn Kỹ Thuật',
      desc: 'Dụng cụ tiệt trùng 1 lần riêng biệt, kỹ thuật viên tay nghề êm ái, kết hợp tia điện tím và ánh sáng sinh học giúp làm dịu da, ngừa thâm mụn.',
      image: forherFacialTreatmentReal,
      tag: 'TIỆT TRÙNG 100%'
    },
    {
      id: 'phuchoi-da',
      title: 'Nuôi Dưỡng & Phục Hồi Làn Da',
      desc: 'Sử dụng mỹ phẩm và tinh chất lành tính, dịu nhẹ. Tẩy tế bào chết, điện di cấp ẩm đa tầng và đắp mặt nạ nuôi dưỡng da mềm mịn, căng mướt.',
      image: forherSkincareCareReal,
      tag: 'DƯỠNG CHẤT CHÍNH HÃNG'
    },
    {
      id: 'khonggian-spa',
      title: 'Không Gian Thư Giãn & Rèm Riêng Biệt',
      desc: 'Phòng spa sạch sẽ, giường nệm êm ái với rèm che ngăn cách riêng tư. Chuyên viên chăm sóc chu đáo, bảng giá niêm yết rõ ràng, không chèo kéo.',
      image: forherSpaRoomReal,
      tag: 'TẬN TÂM & CHU ĐÁO'
    }
  ];

  return (
    <section id="about" className="section-padding bg-warm-white">
      <div className="site-container">
        <div className="section-header-center">
          <span className="section-subtitle">VỀ FORHER BEAUTY & SPA</span>
          <h2 className="section-title">Không Gian Thư Thái & Dịch Vụ Chăm Sóc Tận Tâm</h2>
          <div className="section-divider-gold"></div>
          <p className="section-lead-text">
            Tọa lạc tại <strong>{COMPANY_INFO.address}</strong>, FORHER Beauty & Spa là điểm đến quen thuộc của các bạn trẻ, chuyên viên công sở và quý cô yêu thích phương pháp chăm sóc da an toàn, gội đầu dưỡng sinh thư giãn và làm nail tỉ mỉ.
          </p>
        </div>

        {/* 4 Visual Cards Grid with authentic spa imagery */}
        <div className="about-visual-grid">
          {visualTreatments.map((item) => (
            <div key={item.id} className="about-visual-card">
              <div className="card-image-wrap">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="card-treatment-img"
                  loading="lazy"
                />
                <span className="card-floating-tag">{item.tag}</span>
              </div>
              <div className="card-info-wrap">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-desc">{item.desc}</p>
                <button 
                  type="button" 
                  className="card-book-link"
                  onClick={onBookClick}
                >
                  Đặt lịch dịch vụ này →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick invite banner */}
        <div className="about-invite-box">
          <div className="invite-text-col">
            <h4 className="invite-title">Bạn Cần Tư Vấn Dịch Vụ Hoặc Đặt Chỗ Trước?</h4>
            <p className="invite-desc">
              Chuyên viên FORHER luôn sẵn sàng hỗ trợ tư vấn liệu trình da, gội đầu dưỡng sinh & làm nail chu đáo cho bạn.
            </p>
          </div>
          <div className="invite-action-col">
            <button type="button" className="btn-primary-gold" onClick={onBookClick}>
              Đặt Lịch Hẹn Ngay
            </button>
            <a href={`tel:${COMPANY_INFO.phoneClean}`} className="btn-call-sub">
              Hotline: {COMPANY_INFO.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
