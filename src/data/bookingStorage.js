/**
 * FORHER BEAUTY & SPA - BOOKING & AUDIT LOG STORAGE SERVICE
 * Manages bookings and full audit history with localStorage persistence.
 */

const STORAGE_KEYS = {
  BOOKINGS: 'forher_bookings_v1',
  LOGS: 'forher_audit_logs_v1',
  AUTH: 'forher_admin_auth_v1',
  PASSWORD: 'forher_admin_pwd_v1'
};

const DEFAULT_ADMIN_PASSWORD = 'forherbeauty';

// Sample realistic initial bookings for demonstration
const SAMPLE_BOOKINGS = [
  {
    id: 'FH-839201',
    fullName: 'Nguyễn Thị Thu Hà',
    phoneNumber: '0908123456',
    serviceId: 'tl-nach',
    serviceName: 'Triệt Lông Nách',
    categoryName: 'Triệt Lông (BH 2 Năm)',
    modeLabel: 'Trọn Gói BH 2 Năm',
    priceDisplay: '500.000đ',
    bookingDate: new Date().toISOString().split('T')[0],
    bookingTime: '15:30',
    skinNotes: 'Lần đầu ghé spa, da nhạy cảm cần chuyên viên tư vấn kỹ',
    adminNotes: 'Đã gọi điện xác nhận, xếp giường phòng số 2 lầu 2',
    status: 'confirmed', // 'pending' | 'confirmed' | 'completed' | 'cancelled'
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'FH-839202',
    fullName: 'Trần Mai Linh',
    phoneNumber: '0937654321',
    serviceId: 'nm-chuan-ykhoa',
    serviceName: 'Lấy Nhân Mụn Chuẩn Y Khoa',
    categoryName: 'Chăm Sóc & Trị Mụn',
    modeLabel: 'Gói 5 Buổi Tiết Kiệm',
    priceDisplay: '1.200.000đ',
    bookingDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    bookingTime: '17:00',
    skinNotes: 'Mụn viêm nhiều vùng cằm và má, ưu tiên tiệt trùng tia điện tím',
    adminNotes: 'Khách hẹn sau giờ làm',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'FH-839203',
    fullName: 'Lê Hoàng Yến',
    phoneNumber: '0988776655',
    serviceId: 'sk-dap-thach',
    serviceName: 'Đắp Thạch Collagen Săn Chắc Da',
    categoryName: 'Skincare & Phục Hồi',
    modeLabel: 'Buổi Đơn Lẻ',
    priceDisplay: '250.000đ',
    bookingDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    bookingTime: '11:00',
    skinNotes: 'Chăm sóc thư giãn buổi trưa',
    adminNotes: 'Khách rất hài lòng, đã thanh toán đủ',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const INITIAL_LOGS = [
  {
    id: 'LOG-1',
    action: 'INIT',
    actionTitle: 'Khởi tạo hệ thống',
    details: 'Hệ thống Quản Trị Đơn Đặt Lịch FORHER Beauty & Spa đi vào vận hành',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'LOG-2',
    action: 'CREATE',
    actionTitle: 'Tạo đơn mới',
    details: 'Đơn #FH-839201 của khách Nguyễn Thị Thu Hà (0908123456) - Triệt Lông Nách',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    orderId: 'FH-839201'
  },
  {
    id: 'LOG-3',
    action: 'STATUS_CHANGE',
    actionTitle: 'Duyệt đơn',
    details: 'Đã xác nhận lịch hẹn đơn #FH-839201 lúc 15:30 ngày hôm nay',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    orderId: 'FH-839201'
  }
];

export const BookingStorage = {
  // --- AUTHENTICATION ---
  isAuthenticated() {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  },

  login(password) {
    const currentPwd = this.getPassword();
    if (password === currentPwd) {
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      this.addLog('AUTH', 'Đăng nhập thành công', 'Quản trị viên đã đăng nhập vào hệ thống panel');
      return { success: true };
    }
    return { success: false, message: 'Mật khẩu quản trị không chính xác' };
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    this.addLog('AUTH', 'Đăng xuất', 'Quản trị viên đã đăng xuất');
  },

  getPassword() {
    try {
      return localStorage.getItem(STORAGE_KEYS.PASSWORD) || DEFAULT_ADMIN_PASSWORD;
    } catch {
      return DEFAULT_ADMIN_PASSWORD;
    }
  },

  changePassword(oldPwd, newPwd) {
    if (oldPwd !== this.getPassword()) {
      return { success: false, message: 'Mật khẩu cũ không chính xác' };
    }
    if (!newPwd || newPwd.trim().length < 6) {
      return { success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' };
    }
    localStorage.setItem(STORAGE_KEYS.PASSWORD, newPwd.trim());
    this.addLog('AUTH', 'Đổi mật khẩu', 'Quản trị viên đã thay đổi mật khẩu đăng nhập');
    return { success: true };
  },

  // --- BOOKINGS CRUD ---
  getAllBookings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (!data) {
        this.saveBookings(SAMPLE_BOOKINGS);
        return SAMPLE_BOOKINGS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading bookings:', e);
      return SAMPLE_BOOKINGS;
    }
  },

  saveBookings(bookings) {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.error('Error saving bookings:', e);
    }
  },

  createBooking(bookingData, source = 'customer') {
    const bookings = this.getAllBookings();
    const id = `FH-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowIso = new Date().toISOString();

    const newBooking = {
      id,
      fullName: bookingData.fullName || 'Khách hàng',
      phoneNumber: bookingData.phoneNumber || '',
      serviceId: bookingData.serviceId || '',
      serviceName: bookingData.serviceName || 'Tư vấn tổng quát',
      categoryName: bookingData.categoryName || 'Dịch Vụ Spa',
      modeLabel: bookingData.modeLabel || 'Buổi Lẻ',
      priceDisplay: bookingData.priceDisplay || 'Báo giá tại cơ sở',
      bookingDate: bookingData.bookingDate || new Date().toISOString().split('T')[0],
      bookingTime: bookingData.bookingTime || '14:00',
      skinNotes: bookingData.skinNotes || '',
      adminNotes: bookingData.adminNotes || (source === 'customer' ? 'Khách đặt trực tuyến' : 'Tạo thủ công tại quầy'),
      status: bookingData.status || 'pending',
      source: source, // 'customer' | 'admin'
      createdAt: nowIso,
      updatedAt: nowIso
    };

    const updatedList = [newBooking, ...bookings];
    this.saveBookings(updatedList);

    const logDetails = `Khách: ${newBooking.fullName} (${newBooking.phoneNumber}) | Dịch vụ: ${newBooking.serviceName} (${newBooking.modeLabel}) | Lịch hẹn: ${newBooking.bookingDate} lúc ${newBooking.bookingTime}`;
    this.addLog(
      'CREATE', 
      source === 'customer' ? 'Khách đặt qua Website' : 'Admin tạo đơn mới', 
      logDetails, 
      newBooking.id
    );

    return newBooking;
  },

  updateBooking(id, updateFields) {
    const bookings = this.getAllBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) return null;

    const oldBooking = bookings[index];
    const updatedBooking = {
      ...oldBooking,
      ...updateFields,
      updatedAt: new Date().toISOString()
    };

    bookings[index] = updatedBooking;
    this.saveBookings(bookings);

    // Build human readable changes for audit log
    const changes = [];
    if (updateFields.status && updateFields.status !== oldBooking.status) {
      const statusLabels = {
        pending: 'Chờ xác nhận',
        confirmed: 'Đã xác nhận',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy'
      };
      changes.push(`Đổi trạng thái: ${statusLabels[oldBooking.status]} → ${statusLabels[updateFields.status]}`);
    }
    if (updateFields.bookingDate && updateFields.bookingDate !== oldBooking.bookingDate) {
      changes.push(`Đổi ngày: ${oldBooking.bookingDate} → ${updateFields.bookingDate}`);
    }
    if (updateFields.bookingTime && updateFields.bookingTime !== oldBooking.bookingTime) {
      changes.push(`Đổi giờ: ${oldBooking.bookingTime} → ${updateFields.bookingTime}`);
    }
    if (updateFields.serviceName && updateFields.serviceName !== oldBooking.serviceName) {
      changes.push(`Đổi dịch vụ: ${oldBooking.serviceName} → ${updateFields.serviceName}`);
    }
    if (updateFields.adminNotes !== undefined && updateFields.adminNotes !== oldBooking.adminNotes) {
      changes.push(`Cập nhật ghi chú nội bộ`);
    }

    const details = changes.length > 0 
      ? `Đơn #${id} (${updatedBooking.fullName}): ${changes.join(', ')}`
      : `Đơn #${id} (${updatedBooking.fullName}): Cập nhật thông tin chi tiết`;

    this.addLog('UPDATE', 'Cập nhật đơn', details, id);

    return updatedBooking;
  },

  deleteBooking(id) {
    const bookings = this.getAllBookings();
    const target = bookings.find(b => b.id === id);
    if (!target) return false;

    const filtered = bookings.filter(b => b.id !== id);
    this.saveBookings(filtered);

    this.addLog(
      'DELETE',
      'Xóa đơn đặt lịch',
      `Đã xóa vĩnh viễn đơn #${id} của khách ${target.fullName} (${target.phoneNumber}) - Dịch vụ: ${target.serviceName}`,
      id
    );
    return true;
  },

  // --- AUDIT LOGS ---
  getAllLogs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (!data) {
        this.saveLogs(INITIAL_LOGS);
        return INITIAL_LOGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_LOGS;
    }
  },

  saveLogs(logs) {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs.slice(0, 300))); // keep max 300 logs
    } catch (e) {
      console.error('Error saving logs:', e);
    }
  },

  addLog(action, actionTitle, details, orderId = null) {
    const logs = this.getAllLogs();
    const newLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action, // 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'AUTH'
      actionTitle,
      details,
      orderId,
      timestamp: new Date().toISOString()
    };
    this.saveLogs([newLog, ...logs]);
  },

  clearAuditLogs() {
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    this.saveLogs([{
      id: `LOG-${Date.now()}`,
      action: 'SYSTEM',
      actionTitle: 'Xóa lịch sử',
      details: 'Đã làm trống toàn bộ nhật ký thao tác',
      timestamp: new Date().toISOString()
    }]);
  },

  // --- BACKUP & EXPORT ---
  exportToCsv() {
    const bookings = this.getAllBookings();
    if (bookings.length === 0) return null;

    const headers = [
      'Mã Đơn',
      'Khách Hàng',
      'Số Điện Thoại',
      'Dịch Vụ',
      'Gói Liệu Trình',
      'Giá Tiền',
      'Ngày Hẹn',
      'Giờ Hẹn',
      'Trạng Thái',
      'Ghi Chú Khách',
      'Ghi Chú Nội Bộ',
      'Thời Gian Đặt'
    ];

    const statusMap = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };

    const rows = bookings.map(b => [
      `"${b.id}"`,
      `"${b.fullName}"`,
      `"${b.phoneNumber}"`,
      `"${b.serviceName}"`,
      `"${b.modeLabel}"`,
      `"${b.priceDisplay}"`,
      `"${b.bookingDate}"`,
      `"${b.bookingTime}"`,
      `"${statusMap[b.status] || b.status}"`,
      `"${(b.skinNotes || '').replace(/"/g, '""')}"`,
      `"${(b.adminNotes || '').replace(/"/g, '""')}"`,
      `"${new Date(b.createdAt).toLocaleString('vi-VN')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    return csvContent;
  },

  exportFullBackupJson() {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      brand: 'FORHER Beauty & Spa',
      bookings: this.getAllBookings(),
      logs: this.getAllLogs()
    };
    return JSON.stringify(data, null, 2);
  },

  importBackupJson(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.bookings && Array.isArray(data.bookings)) {
        this.saveBookings(data.bookings);
      }
      if (data.logs && Array.isArray(data.logs)) {
        this.saveLogs(data.logs);
      }
      this.addLog('SYSTEM', 'Khôi phục sao lưu', `Đã nhập thành công ${data.bookings?.length || 0} đơn đặt lịch từ file sao lưu`);
      return { success: true, count: data.bookings?.length || 0 };
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  resetDemoData() {
    this.saveBookings(SAMPLE_BOOKINGS);
    this.saveLogs(INITIAL_LOGS);
    return true;
  }
};
