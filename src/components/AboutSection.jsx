import React from 'react';
import { COMPANY_INFO } from '../data/servicesData';
import forherStorefrontReal from '../assets/forher_storefront_real.jpg';
import forherGoidauReal from '../assets/forher_goidau_real.jpg';
import forherNailReal from '../assets/forher_nail_real.jpg';
import forherSpaRoomReal from '../assets/forher_spa_room_real.jpg';
import forherFacialTreatmentReal from '../assets/forher_facial_treatment_real.jpg';
import forherSkincareCareReal from '../assets/forher_skincare_care_real.jpg';

export default function AboutSection({ onBookClick, onPricingClick }) {
  const visualTreatments = [
    {
      id: 'storefront',
      title: 'Mặt Tiền FORHER Beauty & Spa',
      desc: 'Tọa lạc tại mặt tiền 515 Bà Hạt, P. Diên Hồng, Quận 10. Điểm đến làm đẹp ấm cúng, sang trọng với trọn vẹn 3 tầng trải nghiệm thư giãn dành riêng cho bạn.',
      image: forherStorefrontReal,
      tag: '515 BÀ HẠT, P. DIÊN HỒNG',
      btnText: 'Đặt lịch ghé spa →',
      action: 'book'
    },
    {
      id: 'nail',
      title: 'Three House Nails – Đa Dạng Màu Sắc, Trọn Vẹn Cá Tính',
      desc: 'Ngay từ cửa bước vào là không gian Three House Nails trẻ trung, hiện đại với đa dạng bảng màu sơn được cập nhật thường xuyên, từ những gam màu nhẹ nhàng, thanh lịch đến những sắc màu nổi bật, cá tính. Bạn có thể thoải mái lựa chọn màu yêu thích, kết hợp cùng nhiều kiểu design, mắt mèo, thạch, nhũ, French, ombre, charm và đính đá để tạo nên một bộ móng mang dấu ấn riêng.',
      slogan: 'Nhiều màu để chọn – nhiều kiểu để yêu – một bộ nail dành riêng cho bạn.',
      image: forherNailReal,
      tag: 'TẦNG TRỆT • THREE HOUSE NAILS',
      btnText: 'Xem Mẫu Móng Three House Nails ↗',
      action: 'external',
      fbUrl: 'https://www.facebook.com/threehousenails',
      tiktokUrl: 'https://www.tiktok.com/@three.house.nails'
    },
    {
      id: 'goidau',
      title: 'Gội Đầu Dưỡng Sinh & Thư Giãn Nhẹ Nhàng',
      desc: 'Tiếp nối hành trình thư giãn tại lầu 1, là không gian gội đầu dưỡng sinh & thư giãn nhẹ nhàng với giường êm ái, bồn gội thư giãn, nước bồ kết thảo mộc nấu ấm, massage ấn huyệt giải tỏa đau mỏi cổ vai gáy, giúp bạn tạm gác lại những bộn bề và tận hưởng những phút giây chăm sóc bản thân.',
      image: forherGoidauReal,
      tag: 'LẦU 1 • DƯỠNG SINH THẢO MỘC',
      btnText: 'Khám phá không gian Lầu 1 →',
      action: 'book'
    },
    {
      id: 'khonggian-spa',
      title: 'Phòng Spa Chăm Sóc Da & Triệt Lông',
      desc: 'Tại lầu 2, không gian Spa mang đến các liệu trình chăm sóc da chuyên sâu và triệt lông Diode Laser. Giường spa êm ái với rèm che ngăn cách từng giường kín đáo, không gian yên tĩnh thư giãn tối đa cho khách hàng.',
      image: forherSpaRoomReal,
      tag: 'LẦU 2 • RÈM NGĂN RIÊNG BIỆT',
      btnText: 'Xem bảng giá dịch vụ Spa →',
      action: 'pricing'
    },
    {
      id: 'chamsoc-da',
      title: 'Chăm Sóc & Lấy Mụn Kỹ Thuật Cao',
      desc: 'Tại lầu 2, quy trình lấy mụn chuẩn y khoa với dụng cụ tiệt trùng 1 lần riêng biệt, kỹ thuật viên tay nghề êm ái, kết hợp tia điện tím và ánh sáng sinh học giúp làm dịu da nhanh chóng, phục hồi da sạch mụn và khỏe đẹp.',
      image: forherFacialTreatmentReal,
      tag: 'LẦU 2 • TIỆT TRÙNG 100%',
      btnText: 'Xem bảng giá dịch vụ Spa →',
      action: 'pricing'
    },
    {
      id: 'phuchoi-da',
      title: 'Nuôi Dưỡng & Phục Hồi Làn Da Khỏe Đẹp',
      desc: 'Tại lầu 2, sử dụng mỹ phẩm và tinh chất lành tính dịu nhẹ. Tẩy tế bào chết, điện di cấp ẩm đa tầng và đắp mặt nạ nuôi dưỡng làn da khỏe mạnh, căng bóng và rạng rỡ từ sâu bên trong.',
      image: forherSkincareCareReal,
      tag: 'LẦU 2 • DƯỠNG CHẤT CHÍNH HÃNG',
      btnText: 'Xem bảng giá dịch vụ Spa →',
      action: 'pricing'
    }
  ];

  const handleCardClick = (item) => {
    if (item.action === 'external' && item.fbUrl) {
      window.open(item.fbUrl, '_blank');
    } else if (item.action === 'pricing' && onPricingClick) {
      onPricingClick();
    } else if (onBookClick) {
      onBookClick();
    }
  };

  return (
    <section id="about" className="section-padding bg-warm-white">
      <div className="site-container">
        {/* Section Header */}
        <div className="section-header-center">
          <span className="section-subtitle">VỀ FORHER BEAUTY & SPA • {COMPANY_INFO.addressShort}</span>
          <h2 className="section-title">Một Không Gian – Trọn Vẹn Hành Trình Chăm Sóc Bản Thân</h2>
          <div className="section-divider-gold"></div>
        </div>

        {/* 3-Tier Journey Experience Highlight */}
        <div className="about-journey-container">
          <div className="journey-floors-grid">
            {/* Floor 0: Ground Floor Nail */}
            <div className="journey-floor-card">
              <div className="floor-badge">TẦNG TRỆT</div>
              <h4 className="floor-title">Three House Nails Hiện Đại</h4>
              <p className="floor-desc">
                Từ khi bước vào, bạn sẽ được chào đón bởi không gian Nail hiện đại, nơi chăm chút đôi tay và đôi chân với những thiết kế xinh xắn, tinh tế và phù hợp với phong cách riêng của mỗi khách hàng.
              </p>
            </div>

            {/* Floor 1: First Floor Head Spa */}
            <div className="journey-floor-card">
              <div className="floor-badge">LẦU 1</div>
              <h4 className="floor-title">Gội Đầu Dưỡng Sinh & Thư Giãn</h4>
              <p className="floor-desc">
                Tiếp nối hành trình thư giãn tại lầu 1, là không gian gội đầu dưỡng sinh & thư giãn nhẹ nhàng, giúp bạn tạm gác lại những bộn bề và tận hưởng những phút giây chăm sóc bản thân.
              </p>
            </div>

            {/* Floor 2: Second Floor Skincare Spa */}
            <div className="journey-floor-card">
              <div className="floor-badge">LẦU 2</div>
              <h4 className="floor-title">Spa Chăm Sóc Da Chuyên Sâu</h4>
              <p className="floor-desc">
                Tại lầu 2, không gian Spa chăm sóc da mang đến các liệu trình chăm sóc da chuyên sâu, từ làm sạch, chăm sóc da mụn đến phục hồi và nuôi dưỡng làn da khỏe đẹp.
              </p>
            </div>
          </div>

          {/* Core Philosophy Quote */}
          <div className="journey-summary-quote">
            <p className="journey-highlight-line">
              <strong>Ba tầng – ba trải nghiệm – một điểm đến dành riêng cho vẻ đẹp và sự thư giãn của bạn.</strong>
            </p>
            <p className="journey-philosophy-line">
              Từ đôi tay xinh đẹp, mái tóc được thư giãn đến làn da khỏe rạng rỡ – chúng tôi mong muốn mỗi lần bạn ghé thăm đều là một khoảng thời gian thật dễ chịu để yêu thương và chăm sóc chính mình.
            </p>
          </div>
        </div>

        {/* 6 Visual Cards Grid with authentic spa imagery */}
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
                {item.slogan && (
                  <p className="card-slogan-highlight">
                    {item.slogan}
                  </p>
                )}
                {item.fbUrl && (
                  <div className="card-social-pills-row">
                    <a 
                      href={item.fbUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="card-mini-social-link fb"
                    >
                      FB: @threehousenails ↗
                    </a>
                    {item.tiktokUrl && (
                      <a 
                        href={item.tiktokUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="card-mini-social-link tiktok"
                      >
                        TikTok: @three.house.nails ↗
                      </a>
                    )}
                  </div>
                )}
                <button 
                  type="button" 
                  className="card-book-link"
                  onClick={() => handleCardClick(item)}
                >
                  {item.btnText || 'Đặt lịch hẹn →'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick invite banner */}
        <div className="about-invite-box">
          <div className="invite-text-col">
            <h4 className="invite-title">Bạn Cần Tư Vấn Liệu Trình Hoặc Đặt Chỗ Trước?</h4>
            <p className="invite-desc">
              Chuyên viên FORHER luôn sẵn sàng hỗ trợ tư vấn liệu trình chăm sóc da, giải đáp mọi thắc mắc và tiếp đón bạn chu đáo nhất.
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
