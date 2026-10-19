import React from 'react';
import { COMPANY_INFO } from '../data/servicesData';
import diodeLaser from '../assets/diode_laser_machine.jpg';
import facialTreatment from '../assets/facial_treatment.jpg';
import chemicalPeel from '../assets/chemical_peel.jpg';
import spaVipRoom from '../assets/spa_vip_room.jpg';

export default function AboutSection({ onBookClick }) {
  const visualTreatments = [
    {
      id: 'triet-long',
      title: 'Triệt Lông Diode Laser BH 2 Năm',
      desc: 'Công nghệ đầu lạnh âm độ, êm ái không đau rát, se khít nang lông. Cam kết cấp thẻ bảo hành chính thức 2 năm (24 tháng) dặm miễn phí.',
      image: diodeLaser,
      tag: 'BẢO HÀNH 2 NĂM'
    },
    {
      id: 'nan-mun',
      title: 'Điều Trị Mụn Chuẩn Y Khoa',
      desc: 'Dụng cụ tiệt trùng 1 lần riêng biệt, lấy sạch cồi già, sát khuẩn tia điện tím và ánh sáng Biolight giúp giảm sưng đỏ, ngừa thâm mụn tối đa.',
      image: facialTreatment,
      tag: 'VÔ KHUẨN 100%'
    },
    {
      id: 'peel-meso',
      title: 'Chemical Peel & Cấy Meso Vi Điểm',
      desc: 'Peel thay da sinh học (Peel Tảo, TCA, Image Skincare) kết hợp điện di tinh chất HA/Mulgwang nuôi dưỡng tầng sâu cho da căng mướt, rạng ngời.',
      image: chemicalPeel,
      tag: 'TINH CHẤT CHÍNH HÃNG'
    },
    {
      id: 'khong-gian',
      title: 'Không Gian VIP & Kỹ Thuật Viên 1:1',
      desc: 'Phòng dịch vụ riêng tư, yên tĩnh tại 515 Bà Hạt Quận 10. Chuyên viên chăm sóc chu đáo, bảng giá niêm yết minh bạch, không chèo kéo phát sinh.',
      image: spaVipRoom,
      tag: 'KHÔNG GIAN VIP 1:1'
    }
  ];

  return (
    <section id="about" className="section-padding bg-warm-white">
      <div className="site-container">
        <div className="section-header-center">
          <span className="section-subtitle">VỀ FORHER BEAUTY & SPA</span>
          <h2 className="section-title">Không Gian Thư Thái & Phác Đồ Làm Đẹp Chuẩn Y Khoa</h2>
          <div className="section-divider-gold"></div>
          <p className="section-lead-text">
            Tọa lạc tại <strong>{COMPANY_INFO.address}</strong>, FORHER Beauty & Spa là điểm đến quen thuộc của các bạn trẻ, chuyên viên công sở và quý cô yêu thích phương pháp chăm sóc da khoa học, an toàn và hiệu quả thực tế.
          </p>
        </div>

        {/* 4 Visual Cards Grid with high quality clinic imagery */}
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
            <h4 className="invite-title">Bạn Cần Tư Vấn Tình Trạng Da Hoặc Đặt Giữ Chỗ?</h4>
            <p className="invite-desc">
              Chuyên viên FORHER luôn sẵn sàng kiểm tra lịch và giữ phòng riêng 1:1 chu đáo cho bạn.
            </p>
          </div>
          <div className="invite-action-col">
            <button type="button" className="btn-primary-gold" onClick={onBookClick}>
              Đặt Lịch Khám & Tư Vấn Ngay
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
