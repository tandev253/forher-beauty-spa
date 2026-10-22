import React, { useState, useEffect } from 'react';
import { COMPANY_INFO, SERVICES_CATALOG } from '../data/servicesData';
import { BookingStorage } from '../data/bookingStorage';

export default function BookingSection({ selectedService, onClearSelectedService }) {
  const [serviceId, setServiceId] = useState('');
  const [serviceMode, setServiceMode] = useState('single'); // 'single' | 'course'
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('14:00');
  const [skinNotes, setSkinNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Sync selected service if passed from catalog
  useEffect(() => {
    if (selectedService && selectedService.id) {
      setServiceId(selectedService.id);
      setServiceMode('single');
      setBookingSuccess(false);
    }
  }, [selectedService]);

  const activeServiceObj = SERVICES_CATALOG.find((s) => s.id === serviceId);

  const handleZaloBooking = (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      alert('Vui lòng nhập số điện thoại để chuyên viên liên hệ xác nhận lịch hẹn.');
      return;
    }

    const serviceName = activeServiceObj ? activeServiceObj.name : 'Tư vấn tổng quát tại Spa';
    const categoryName = activeServiceObj ? activeServiceObj.categoryName : 'Dịch Vụ Spa';
    const modeLabel = activeServiceObj?.isWarranty2Y 
      ? 'Trọn gói BH 2 năm' 
      : (serviceMode === 'course' ? 'Gói liệu trình 5 buổi' : 'Buổi đơn lẻ');
    const priceDisplay = activeServiceObj 
      ? (serviceMode === 'course' ? activeServiceObj.coursePriceDisplay : activeServiceObj.singlePriceDisplay)
      : 'Báo giá tại cơ sở';

    // 1. Persist booking to Admin Storage
    try {
      BookingStorage.createBooking({
        fullName: fullName || 'Khách hàng',
        phoneNumber,
        serviceId: serviceId || 'general',
        serviceName,
        categoryName,
        modeLabel,
        priceDisplay,
        bookingDate,
        bookingTime,
        skinNotes,
        status: 'pending'
      }, 'customer');
    } catch (err) {
      console.error('Lỗi lưu đơn vào hệ thống:', err);
    }

    // 2. Format Zalo message & trigger chat
    const message = `Chào FORHER Beauty & Spa! Em muốn đặt lịch hẹn chăm sóc da / làm đẹp:
- Khách hàng: ${fullName || 'Khách hàng'}
- Số điện thoại: ${phoneNumber}
- Dịch vụ: ${serviceName} (${modeLabel} - ${priceDisplay})
- Ngày hẹn: ${bookingDate} lúc ${bookingTime}
${skinNotes ? `- Tình trạng da / Ghi chú: ${skinNotes}\n` : ''}
Nhờ spa hỗ trợ kiểm tra lịch và giữ phòng ưu tiên giúp em nhé!`;

    const zaloUrl = `https://zalo.me/${COMPANY_INFO.phoneClean}?text=${encodeURIComponent(message)}`;
    window.open(zaloUrl, '_blank');
    setBookingSuccess(true);
  };

  return (
    <section id="booking" className="section-padding bg-warm-white">
      <div className="site-container">
        <div className="section-header-center">
          <span className="section-subtitle">ĐẶT LỊCH HẸN TRỰC TUYẾN 24/7</span>
          <h2 className="section-title">Giữ Chỗ & Đặt Lịch Chăm Sóc Da Tại FORHER</h2>
          <div className="section-divider-gold"></div>
          <p className="section-lead-text">
            Đặt hẹn online để được <strong>ưu tiên tiếp đón chu đáo</strong>, không phải chờ đợi và nhận tư vấn liệu trình phù hợp nhất.
          </p>
        </div>

        <div className="booking-card-wrapper">
          <div className="booking-form-container">
            {bookingSuccess && (
              <div className="booking-alert-success">
                <div>
                  <strong>Yêu Cầu Đã Được Soạn Qua Zalo Thành Công!</strong>
                  <p>Chuyên viên FORHER sẽ nhắn tin hoặc gọi lại xác nhận khung giờ trong vòng 5-10 phút.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleZaloBooking} className="booking-main-form">
              {/* Service Selection */}
              <div className="form-field-group">
                <label htmlFor="book-service" className="form-field-label">
                  1. Chọn Dịch Vụ Quan Tâm <span className="text-req">*</span>
                </label>
                <div className="select-wrapper">
                  <select
                    id="book-service"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    required
                  >
                    <option value="">-- Nhấp để chọn dịch vụ từ danh mục 35 liệu trình --</option>
                    {SERVICES_CATALOG.map((s) => (
                      <option key={s.id} value={s.id}>
                        [{s.categoryName}] {s.name} - {s.singlePriceDisplay}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mode Selection if course available */}
              {activeServiceObj && activeServiceObj.coursePrice && activeServiceObj.coursePrice !== activeServiceObj.singlePrice && (
                <div className="form-field-group">
                  <label className="form-field-label">Lựa Chọn Hình Thức Liệu Trình:</label>
                  <div className="service-mode-picker">
                    <button
                      type="button"
                      className={`mode-btn ${serviceMode === 'single' ? 'active' : ''}`}
                      onClick={() => setServiceMode('single')}
                    >
                      Buổi Lẻ ({activeServiceObj.singlePriceDisplay})
                    </button>
                    <button
                      type="button"
                      className={`mode-btn ${serviceMode === 'course' ? 'active' : ''}`}
                      onClick={() => setServiceMode('course')}
                    >
                      Gói 5 Buổi Tiết Kiệm ({activeServiceObj.coursePriceDisplay})
                    </button>
                  </div>
                </div>
              )}

              {/* Service Info Box */}
              {activeServiceObj && (
                <div className="booking-selected-service-banner">
                  <div>
                    <span className="banner-tag">Dịch Vụ Đã Chọn:</span>
                    <strong className="banner-service-name">{activeServiceObj.name}</strong>
                    {activeServiceObj.isWarranty2Y && (
                      <span className="banner-warranty-tag">Cam kết bảo hành 2 năm bằng văn bản</span>
                    )}
                  </div>
                  <div className="banner-price">
                    <span>Giá dự kiến:</span>
                    <strong>
                      {serviceMode === 'course' 
                        ? activeServiceObj.coursePriceDisplay 
                        : activeServiceObj.singlePriceDisplay}
                    </strong>
                  </div>
                </div>
              )}

              {/* Customer Information */}
              <div className="form-row-2col">
                <div className="form-field-group">
                  <label htmlFor="book-name" className="form-field-label">
                    2. Họ và Tên Khách Hàng:
                  </label>
                  <input
                    type="text"
                    id="book-name"
                    placeholder="Ví dụ: Nguyễn Phương Mai"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="form-field-group">
                  <label htmlFor="book-phone" className="form-field-label">
                    3. Số Điện Thoại Liên Hệ <span className="text-req">*</span>:
                  </label>
                  <input
                    type="tel"
                    id="book-phone"
                    placeholder="07xx xxx xxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="form-row-2col">
                <div className="form-field-group">
                  <label htmlFor="book-date" className="form-field-label">
                    4. Ngày Mong Muốn:
                  </label>
                  <input
                    type="date"
                    id="book-date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label htmlFor="book-time" className="form-field-label">
                    5. Khung Giờ Mong Muốn:
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="book-time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      required
                    >
                      <option value="09:30">09:30 Sáng (Đầu ngày - Yên tĩnh)</option>
                      <option value="11:00">11:00 Trưa</option>
                      <option value="14:00">14:00 Chiều (Khuyên dùng)</option>
                      <option value="16:30">16:30 Chiều</option>
                      <option value="18:00">18:00 Tối (Sau giờ làm)</option>
                      <option value="19:00">19:00 Tối</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Skin notes */}
              <div className="form-field-group">
                <label htmlFor="book-notes" className="form-field-label">
                  6. Ghi Chú Tình Trạng Da / Yêu Cầu (Nếu có):
                </label>
                <textarea
                  id="book-notes"
                  rows="2"
                  placeholder="Ví dụ: Da nhạy cảm mụn trán, cần kỹ thuật viên nữ lấy mụn nhẹ nhàng..."
                  value={skinNotes}
                  onChange={(e) => setSkinNotes(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="booking-actions-group">
                <button type="submit" className="btn-confirm-booking-zalo">
                  <span>Xác Nhận Đặt Lịch Qua Zalo</span>
                </button>

                <a 
                  href={`tel:${COMPANY_INFO.phoneClean}`} 
                  className="btn-call-direct"
                >
                  <span>Gọi Hotline Đặt Hẹn: {COMPANY_INFO.phone}</span>
                </a>
              </div>

              <div className="booking-footer-commitments">
                <div className="commit-badge">Bảng giá niêm yết minh bạch 100%</div>
                <div className="commit-badge">Dụng cụ tiệt trùng y khoa riêng biệt</div>
                <div className="commit-badge">Ưu tiên phục vụ chu đáo không phải đợi</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
