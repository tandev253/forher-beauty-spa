import React from 'react';
import { COMPANY_INFO, CATEGORIES } from '../data/servicesData';

export default function CorporateFooter({ onOpenOriginalMenu }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="corp-footer">
      {/* Top Banner with Brand Promise */}
      <div className="corp-footer-highlight-bar">
        <div className="corp-container corp-footer-highlights">
          <div className="corp-highlight-col">
            <span className="corp-highlight-icon">🛡️</span>
            <div>
              <strong>Bảo Hành 02 Năm</strong>
              <p>Cam kết bằng văn bản cho mọi vùng triệt lông Diode Laser</p>
            </div>
          </div>
          <div className="corp-highlight-col">
            <span className="corp-highlight-icon">🔬</span>
            <div>
              <strong>Chuẩn Y Khoa 100%</strong>
              <p>Dụng cụ tiệt trùng khép kín, kỹ thuật viên 1:1 chuyên nghiệp</p>
            </div>
          </div>
          <div className="corp-highlight-col">
            <span className="corp-highlight-icon">💎</span>
            <div>
              <strong>Bảng Giá Niêm Yết</strong>
              <p>Tuyệt đối không phát sinh chi phí, minh bạch từng liệu trình</p>
            </div>
          </div>
          <div className="corp-highlight-col">
            <span className="corp-highlight-icon">📞</span>
            <div>
              <strong>Hỗ Trợ 24/7</strong>
              <p>Hotline & Zalo: {COMPANY_INFO.phone} chăm sóc tận tâm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Corporate Footer Content */}
      <div className="corp-footer-main">
        <div className="corp-container corp-footer-grid">
          {/* Column 1: Brand Info */}
          <div className="corp-footer-col corp-footer-brand">
            <div className="corp-footer-logo">
              <span className="corp-brand-cursive">{COMPANY_INFO.brandTitle}</span>
              <span className="corp-brand-badge">AESTHETIC CLINIC</span>
            </div>
            <p className="corp-footer-tagline">
              {COMPANY_INFO.tagline}
            </p>
            <p className="corp-footer-desc">
              Địa chỉ chăm sóc da & thẩm mỹ công nghệ cao tin cậy tại TP. Hồ Chí Minh. Tiên phong áp dụng phác đồ điều trị da khoa học, công nghệ Diode Laser lạnh thế hệ mới và Chemical Peel tiêu chuẩn Hoa Kỳ.
            </p>

            <div className="corp-social-pills">
              <a 
                href={COMPANY_INFO.social.zalo} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="corp-social-pill"
                title="Zalo Chăm Sóc Khách Hàng"
              >
                <span className="social-pill-icon">💬</span> Zalo OA
              </a>
              <a 
                href={COMPANY_INFO.social.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="corp-social-pill"
                title="Fanpage Facebook"
              >
                <span className="social-pill-icon">📘</span> Facebook
              </a>
              <a 
                href={COMPANY_INFO.social.tiktok} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="corp-social-pill"
                title="Kênh TikTok Chính Thức"
              >
                <span className="social-pill-icon">🎵</span> TikTok
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="corp-footer-col">
            <h4 className="corp-footer-heading">Thông Tin & Chính Sách</h4>
            <ul className="corp-footer-links">
              <li><a href="#about">Về FORHER Beauty & Spa</a></li>
              <li><a href="#pricing">Bảng Giá Dịch Vụ Niêm Yết</a></li>
              <li><a href="#process">Quy Trình Chuẩn Y Khoa 6 Bước</a></li>
              <li><a href="#warranty">Chính Sách Bảo Hành Triệt Lông 2 Năm</a></li>
              <li><a href="#reviews">Đánh Giá Khách Hàng Thực Tế</a></li>
              <li><a href="#faq">Câu Hỏi Thường Gặp (FAQs)</a></li>
              <li>
                <button 
                  type="button" 
                  className="corp-footer-text-btn"
                  onClick={onOpenOriginalMenu}
                >
                  📜 Xem Bản In 2 Menu Gốc Tại Cơ Sở
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Service Categories */}
          <div className="corp-footer-col">
            <h4 className="corp-footer-heading">Chuyên Khoa Dịch Vụ</h4>
            <ul className="corp-footer-links">
              <li><a href="#pricing">Triệt Lông Diode Laser (BH 2 Năm)</a></li>
              <li><a href="#pricing">Điều Trị Mụn Y Khoa Tiêu Khuẩn</a></li>
              <li><a href="#pricing">Chăm Sóc & Phục Hồi Da Chuyên Sâu</a></li>
              <li><a href="#pricing">Chemical Peel Thay Da Sinh Học (TCA, Bio, Image)</a></li>
              <li><a href="#pricing">Cấy Tinh Chất Meso Vi Điểm (HA, B5, Mulgwang)</a></li>
              <li><a href="#pricing">Nâng Cơ Mắt RF & Thâm Mắt</a></li>
              <li><a href="#pricing">Phun Mày / Môi & Khử Thâm</a></li>
            </ul>
          </div>

          {/* Column 4: Contact & Operating Hours */}
          <div className="corp-footer-col corp-footer-contact">
            <h4 className="corp-footer-heading">Liên Hệ Doanh Nghiệp</h4>
            
            <div className="corp-contact-row">
              <span className="corp-c-icon">📍</span>
              <div>
                <strong>Cơ sở chính:</strong>
                <p>{COMPANY_INFO.address}</p>
              </div>
            </div>

            <div className="corp-contact-row">
              <span className="corp-c-icon">📞</span>
              <div>
                <strong>Tổng đài / Hotline:</strong>
                <p>
                  <a href={`tel:${COMPANY_INFO.phoneClean}`} className="corp-highlight-phone">
                    {COMPANY_INFO.phone}
                  </a>
                </p>
              </div>
            </div>

            <div className="corp-contact-row">
              <span className="corp-c-icon">⏰</span>
              <div>
                <strong>Giờ mở cửa đón khách:</strong>
                <p>{COMPANY_INFO.workingHours}</p>
              </div>
            </div>

            <div className="corp-contact-row">
              <span className="corp-c-icon">✉️</span>
              <div>
                <strong>Email:</strong>
                <p>{COMPANY_INFO.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Compliance */}
      <div className="corp-footer-bottom">
        <div className="corp-container corp-bottom-inner">
          <p className="corp-copyright">
            © {currentYear} <strong>FORHER BEAUTY & SPA</strong>. Giữ toàn quyền sở hữu thương hiệu. Chuẩn web doanh nghiệp thẩm mỹ y khoa.
          </p>
          <div className="corp-legal-badges">
            <span className="corp-badge-outline">Cam Kết Không Chèo Kéo</span>
            <span className="corp-badge-outline">Vô Trùng Khép Kín</span>
            <span className="corp-badge-outline">Bảo Hành 2 Năm Bằng Văn Bản</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
