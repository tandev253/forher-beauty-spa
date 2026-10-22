import React, { useState } from 'react';

export default function FaqSection({ onBookClick }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'FORHER Beauty & Spa tọa lạc ở đâu tại khu vực Quận 10?',
      a: 'FORHER Beauty & Spa tọa lạc tại mặt tiền số 515 Bà Hạt, Phường Diên Hồng, TP. Hồ Chí Minh (khu vực Quận 10, giao lộ thuận tiện giữa Ngô Quyền và Nguyễn Tri Phương). Cơ sở có chỗ để xe máy trước cửa và bãi đỗ xe ô tô an ninh, rất thuận tiện cho khách hàng tại Quận 10, Quận 3, Quận 5, Quận 11 và các quận lân cận ghé làm đẹp.'
    },
    {
      q: 'Dịch vụ triệt lông Diode Laser tại Spa có được bảo hành 02 năm không?',
      a: 'Có. FORHER Beauty & Spa cam kết cấp sổ bảo hành bằng văn bản 02 năm cho tất cả các vùng triệt lông công nghệ Diode Laser hiện đại (từ triệt nách, tay, chân, bikini đến toàn thân). Đầu máy làm lạnh âm độ êm ái, se khít lỗ chân lông và trong suốt 24 tháng bảo hành, khách hàng được dặm lại miễn phí theo lịch hẹn.'
    },
    {
      q: 'Quy trình lấy nhân mụn và chăm sóc da tại FORHER có đau hay để lại thâm không?',
      a: 'Quy trình chăm sóc da mụn tại FORHER sử dụng 100% bộ dụng cụ tiệt trùng vô khuẩn dùng một lần riêng biệt cho từng khách. Kỹ thuật viên tay nghề khéo léo, chỉ lấy cồi mụn đã gom già, hạn chế tối đa cảm giác đau. Sau khi lấy mụn, da được khử khuẩn bằng tia điện tím và chiếu ánh sáng sinh học giảm sưng đỏ, giúp da nhanh lành và không để lại sẹo thâm.'
    },
    {
      q: 'Cơ sở 515 Bà Hạt có dịch vụ Gội đầu dưỡng sinh và Làm móng Nail không?',
      a: 'Có, tòa nhà 3 tầng FORHER Beauty & Spa mang đến hành trình làm đẹp trọn vẹn: Tầng trệt là không gian Three House Nails phong cách trẻ trung với đa dạng màu sơn và design trendy; Lầu 1 là không gian Gội đầu dưỡng sinh thảo dược nấu ấm massage cổ vai gáy; Lầu 2 là phòng Spa chuyên sâu chăm sóc da & triệt lông với rèm ngăn kín đáo.'
    },
    {
      q: 'Bảng giá dịch vụ tại FORHER Beauty & Spa có phát sinh phụ phí không?',
      a: 'Cam kết 100% KHÔNG phát sinh chi phí. Bảng giá dịch vụ chăm sóc da và triệt lông tại FORHER Beauty & Spa được niêm yết rõ ràng và minh bạch. Chuyên viên tư vấn đúng tình trạng thực tế của quý khách, không mồi chài hay ép mua thêm dịch vụ.'
    }
  ];

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="section-padding bg-warm-white">
      <div className="site-container">
        <div className="section-header-center">
          <span className="section-subtitle">HỎI ĐÁP DỊCH VỤ & THÔNG TIN SPA QUẬN 10</span>
          <h2 className="section-title">Câu Hỏi Thường Gặp Khi Ghé FORHER Spa</h2>
          <div className="section-divider-gold"></div>
          <p className="section-lead-text">
            Giải đáp chi tiết các thắc mắc phổ biến về vị trí cơ sở, chính sách bảo hành 2 năm và quy trình chăm sóc da chuẩn y khoa tại FORHER Beauty & Spa.
          </p>
        </div>

        <div className="faq-accordion-container">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className={`faq-card-item ${isOpen ? 'active' : ''}`}>
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{item.q}</span>
                  <span className="faq-icon-indicator" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="faq-answer-pane">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick CTA banner */}
        <div className="faq-cta-banner">
          <div className="faq-cta-content">
            <h4>Bạn Cần Tư Vấn Liệu Trình Phù Hợp Riêng Cho Mình?</h4>
            <p>Liên hệ hotline hoặc đặt lịch online để chuyên viên FORHER tiếp đón và soi da tận tình.</p>
          </div>
          <div className="faq-cta-actions">
            <button type="button" className="btn-primary-gold" onClick={onBookClick}>
              Đặt Lịch Tiếp Đón Ngay
            </button>
            <a href="tel:0703994683" className="btn-outline-gold">
              Hotline: 0703 994 683
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
