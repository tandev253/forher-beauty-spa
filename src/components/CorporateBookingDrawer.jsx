import React, { useState } from 'react';
import { COMPANY_INFO, formatCurrency } from '../data/servicesData';

export default function CorporateBookingDrawer({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onUpdateMode,
  onClearCart
}) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('14:00');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => {
    const price = item.mode === 'course' ? item.coursePrice : item.singlePrice;
    return sum + (typeof price === 'number' ? price : 0);
  }, 0);

  const hasWarranty = cart.some(item => item.isWarranty2Y || item.mode === 'course');

  // Generate Zalo booking URL with full message
  const handleZaloBooking = (e) => {
    e.preventDefault();
    if (!customerPhone) {
      alert('Vui lòng nhập số điện thoại để chuyên viên liên hệ xác nhận lịch hẹn.');
      return;
    }

    const servicesListText = cart.map((item, idx) => {
      const modeText = item.isWarranty2Y 
        ? 'Trọn gói BH 2 Năm' 
        : (item.mode === 'course' ? 'Gói 5 buổi' : 'Buổi lẻ');
      const priceText = item.mode === 'course' ? item.coursePriceDisplay : item.singlePriceDisplay;
      return `${idx + 1}. ${item.name} (${modeText} - ${priceText})`;
    }).join('\n');

    const message = `Chào FORHER Beauty & Spa! Em muốn đặt lịch hẹn dịch vụ chuẩn web doanh nghiệp:
- Họ tên: ${customerName || 'Khách hàng'}
- Số điện thoại: ${customerPhone}
- Ngày hẹn: ${bookingDate} lúc ${bookingTime}
${note ? `- Tình trạng da / Ghi chú: ${note}\n` : ''}
Danh sách dịch vụ đã chọn:
${servicesListText}
Tổng chi phí ước tính: ${formatCurrency(totalPrice)}
Nhờ spa hỗ trợ kiểm tra lịch và giữ phòng ưu tiên giúp em nhé!`;

    const encoded = encodeURIComponent(message);
    // Open Zalo chat
    window.open(`https://zalo.me/${COMPANY_INFO.phoneClean}?text=${encoded}`, '_blank');
  };

  return (
    <div className="corp-drawer-overlay" onClick={onClose}>
      <div className="corp-drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="corp-drawer-header">
          <div className="corp-drawer-header-left">
            <span className="corp-drawer-icon">📋</span>
            <div>
              <h3 className="corp-drawer-title">Phiếu Đặt Hẹn & Dự Toán Dịch Vụ</h3>
              <p className="corp-drawer-sub">
                {cart.length > 0 
                  ? `Quý khách đang chọn ${cart.length} dịch vụ` 
                  : 'Chưa có dịch vụ nào trong danh sách'}
              </p>
            </div>
          </div>
          <button type="button" className="corp-drawer-close" onClick={onClose} aria-label="Đóng bảng đặt lịch">
            ✕
          </button>
        </div>

        {/* Drawer Body */}
        <div className="corp-drawer-body">
          {cart.length === 0 ? (
            <div className="corp-drawer-empty">
              <span className="empty-icon">🌸</span>
              <h4>Danh sách đặt hẹn đang trống</h4>
              <p>Quý khách vui lòng chọn dịch vụ từ bảng giá để ước tính chi phí và giữ phòng ưu tiên.</p>
              <button 
                type="button" 
                className="corp-btn-gold" 
                onClick={onClose}
                style={{ marginTop: '16px' }}
              >
                Khám Phá Bảng Giá 35 Dịch Vụ
              </button>
            </div>
          ) : (
            <>
              {/* Service Items List */}
              <div className="corp-drawer-items-list">
                <div className="corp-items-header">
                  <span>Dịch Vụ Chọn Lọc</span>
                  <button type="button" className="corp-btn-text-danger" onClick={onClearCart}>
                    Xóa tất cả
                  </button>
                </div>

                {cart.map((item, index) => {
                  const isCourse = item.mode === 'course';
                  const activePriceDisplay = isCourse ? item.coursePriceDisplay : item.singlePriceDisplay;

                  return (
                    <div key={`${item.id}-${index}`} className="corp-drawer-item-card">
                      <div className="corp-item-top">
                        <div>
                          <span className="corp-item-category">{item.categoryName || item.sectionTitle || 'Dịch vụ'}</span>
                          <h4 className="corp-item-name">{item.name}</h4>
                          {item.isWarranty2Y && (
                            <span className="corp-item-badge-warranty">🛡️ Bảo hành 2 năm</span>
                          )}
                        </div>
                        <button 
                          type="button" 
                          className="corp-item-remove"
                          onClick={() => onRemoveItem(index)}
                          title="Xóa dịch vụ này"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Mode selection toggle if course available */}
                      {item.coursePrice && item.coursePrice !== item.singlePrice && (
                        <div className="corp-mode-toggle">
                          <button
                            type="button"
                            className={`corp-mode-btn ${!isCourse ? 'active' : ''}`}
                            onClick={() => onUpdateMode(index, 'single')}
                          >
                            Buổi lẻ ({item.singlePriceDisplay})
                          </button>
                          <button
                            type="button"
                            className={`corp-mode-btn ${isCourse ? 'active' : ''}`}
                            onClick={() => onUpdateMode(index, 'course')}
                          >
                            Gói 5 buổi ({item.coursePriceDisplay})
                          </button>
                        </div>
                      )}

                      <div className="corp-item-bottom">
                        <span className="corp-item-mode-label">
                          {item.isWarranty2Y ? 'Trọn gói cam kết BH 2 năm' : (isCourse ? 'Liệu trình 5 buổi' : 'Buổi đơn lẻ')}
                        </span>
                        <strong className="corp-item-price">{activePriceDisplay}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Warranty / Commitment callout if eligible */}
              {hasWarranty && (
                <div className="corp-drawer-warranty-callout">
                  <span className="warranty-callout-icon">🛡️</span>
                  <div>
                    <strong>Quyền Lợi Bảo Hành 2 Năm Đi Kèm</strong>
                    <p>Dịch vụ triệt lông được cấp mã thẻ bảo hành điện tử chính thức, miễn phí dặm trong 24 tháng.</p>
                  </div>
                </div>
              )}

              {/* Cost Summary Box */}
              <div className="corp-cost-summary">
                <div className="summary-row">
                  <span>Số lượng dịch vụ:</span>
                  <strong>{cart.length} liệu trình</strong>
                </div>
                <div className="summary-row">
                  <span>Phí tư vấn & soi da:</span>
                  <span className="text-free">Miễn Phí 100%</span>
                </div>
                <div className="summary-row">
                  <span>Tiệt trùng dụng cụ Y khoa:</span>
                  <span className="text-free">Đã Bao Gồm</span>
                </div>
                <div className="summary-row-total">
                  <span>Tổng Chi Phí Ước Tính:</span>
                  <strong className="total-gold-price">{formatCurrency(totalPrice)}</strong>
                </div>
                <small className="summary-note">* Cam kết giá niêm yết chuẩn, không phát sinh bất kỳ khoản phụ thu nào tại spa.</small>
              </div>

              {/* Booking Form Info */}
              <form onSubmit={handleZaloBooking} className="corp-drawer-form">
                <h4 className="corp-form-heading">Thông Tin Người Đặt Hẹn</h4>

                <div className="corp-form-row">
                  <div className="corp-form-group">
                    <label>Họ và Tên:</label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: Nguyễn Thị Mai" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div className="corp-form-group">
                    <label>Số Điện Thoại <span className="req">*</span>:</label>
                    <input 
                      type="tel" 
                      placeholder="07xx xxx xxx" 
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="corp-form-row">
                  <div className="corp-form-group">
                    <label>Ngày Mong Muốn:</label>
                    <input 
                      type="date" 
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                    />
                  </div>

                  <div className="corp-form-group">
                    <label>Khung Giờ:</label>
                    <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)}>
                      <option value="09:30">09:30 Sáng (Đầu ngày)</option>
                      <option value="11:00">11:00 Trưa</option>
                      <option value="14:00">14:00 Chiều (Phổ biến)</option>
                      <option value="16:30">16:30 Chiều</option>
                      <option value="18:00">18:00 Tối (Sau giờ làm)</option>
                      <option value="19:00">19:00 Tối</option>
                    </select>
                  </div>
                </div>

                <div className="corp-form-group">
                  <label>Ghi chú tình trạng da / Yêu cầu đặc biệt:</label>
                  <textarea 
                    rows="2" 
                    placeholder="Ví dụ: Da nhạy cảm, mụn viêm vùng trán, cần kỹ thuật viên nữ nhẹ tay..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                {/* CTAs */}
                <div className="corp-drawer-actions">
                  <button type="submit" className="corp-btn-submit-zalo">
                    <span className="btn-icon">💬</span> Xác Nhận Đặt Lịch Qua Zalo
                  </button>

                  <a href={`tel:${COMPANY_INFO.phoneClean}`} className="corp-btn-call-hotline">
                    <span className="btn-icon">📞</span> Gọi Hotline: {COMPANY_INFO.phone}
                  </a>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
