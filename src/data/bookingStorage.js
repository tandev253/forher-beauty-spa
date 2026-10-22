/**
 * FORHER BEAUTY & SPA - BOOKING & AUDIT LOG STORAGE SERVICE
 * Multi-role RBAC: Sếp (Boss - toàn quyền gồm XÓA) & Nhân Viên (Staff - chỉ thêm/sửa, KHÔNG ĐƯỢC XÓA)
 */

const STORAGE_KEYS = {
  BOOKINGS: 'forher_bookings_v1',
  LOGS: 'forher_audit_logs_v1',
  AUTH_ROLE: 'forher_admin_role_v1', // 'boss' | 'staff'
  BOSS_PWD: 'forher_boss_pwd_v1',
  STAFF_PWD: 'forher_staff_pwd_v1'
};

const DEFAULT_PASSWORDS = {
  boss: 'forherboss',
  staff: 'forhernv'
};

// Sample realistic initial bookings
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
    status: 'confirmed',
    createdBy: 'Khách hàng',
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
    createdBy: 'Khách hàng',
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
    createdBy: 'Nhân viên lễ tân',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const INITIAL_LOGS = [
  {
    id: 'LOG-1',
    action: 'INIT',
    actionTitle: 'Khởi tạo hệ thống',
    actor: 'Hệ thống',
    actorRole: 'system',
    details: 'Hệ thống phân cấp quyền Quản Trị FORHER Beauty (Sếp & Nhân Viên) đi vào vận hành',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'LOG-2',
    action: 'CREATE',
    actionTitle: 'Tạo đơn mới',
    actor: 'Khách hàng',
    actorRole: 'customer',
    details: 'Đơn #FH-839201 của khách Nguyễn Thị Thu Hà (0908123456) - Triệt Lông Nách',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    orderId: 'FH-839201'
  },
  {
    id: 'LOG-3',
    action: 'STATUS_CHANGE',
    actionTitle: 'Duyệt đơn',
    actor: 'Nhân viên lễ tân',
    actorRole: 'staff',
    details: 'Đã xác nhận lịch hẹn đơn #FH-839201 lúc 15:30 ngày hôm nay',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    orderId: 'FH-839201'
  }
];

export const BookingStorage = {
  // --- AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC) ---
  getCurrentRole() {
    try {
      const role = localStorage.getItem(STORAGE_KEYS.AUTH_ROLE);
      return (role === 'boss' || role === 'staff') ? role : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return this.getCurrentRole() !== null;
  },

  isBoss() {
    return this.getCurrentRole() === 'boss';
  },

  isStaff() {
    return this.getCurrentRole() === 'staff';
  },

  getRoleLabel(role = null) {
    const target = role || this.getCurrentRole();
    if (target === 'boss') return 'Sếp / Quản lý tối cao';
    if (target === 'staff') return 'Nhân viên lễ tân';
    return 'Khách';
  },

  getPassword(role = 'boss') {
    try {
      const key = role === 'boss' ? STORAGE_KEYS.BOSS_PWD : STORAGE_KEYS.STAFF_PWD;
      return localStorage.getItem(key) || DEFAULT_PASSWORDS[role];
    } catch {
      return DEFAULT_PASSWORDS[role];
    }
  },

  login(selectedRole, password) {
    const validRole = (selectedRole === 'boss' || selectedRole === 'staff') ? selectedRole : 'staff';
    const correctPassword = this.getPassword(validRole);

    // Support backward compatibility with previously stored single password
    const legacyPwd = localStorage.getItem('forher_admin_pwd_v1');
    const isValid = (password === correctPassword) || (validRole === 'boss' && legacyPwd && password === legacyPwd);

    if (isValid) {
      localStorage.setItem(STORAGE_KEYS.AUTH_ROLE, validRole);
      const roleTitle = validRole === 'boss' ? '👑 Sếp / Quản Lý Tối Cao' : '💼 Nhân Viên Lễ Tân';
      this.addLog(
        'AUTH', 
        'Đăng nhập thành công', 
        `${roleTitle} đã đăng nhập vào hệ thống quản trị`,
        null,
        roleTitle,
        validRole
      );
      return { success: true, role: validRole };
    }

    return { 
      success: false, 
      message: `Mật khẩu đăng nhập của ${validRole === 'boss' ? 'Sếp' : 'Nhân viên'} không chính xác!` 
    };
  },

  logout() {
    const currentRole = this.getCurrentRole();
    const roleTitle = currentRole === 'boss' ? 'Sếp' : 'Nhân viên';
    localStorage.removeItem(STORAGE_KEYS.AUTH_ROLE);
    this.addLog('AUTH', 'Đăng xuất', `${roleTitle} đã đăng xuất khỏi hệ thống`, null, roleTitle, currentRole);
  },

  changePassword(role, oldPwd, newPwd) {
    if (oldPwd !== this.getPassword(role)) {
      return { success: false, message: 'Mật khẩu cũ không chính xác' };
    }
    if (!newPwd || newPwd.trim().length < 6) {
      return { success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' };
    }
    const key = role === 'boss' ? STORAGE_KEYS.BOSS_PWD : STORAGE_KEYS.STAFF_PWD;
    localStorage.setItem(key, newPwd.trim());
    const actor = role === 'boss' ? '👑 Sếp' : '💼 Nhân viên';
    this.addLog('AUTH', 'Đổi mật khẩu', `${actor} đã thay đổi mật khẩu đăng nhập thành công`, null, actor, role);
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

    const currentRole = this.getCurrentRole();
    let actor = 'Khách hàng (Web)';
    let actorRole = 'customer';

    if (source === 'admin') {
      if (currentRole === 'boss') {
        actor = '👑 Sếp';
        actorRole = 'boss';
      } else {
        actor = '💼 Nhân viên';
        actorRole = 'staff';
      }
    }

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
      adminNotes: bookingData.adminNotes || (source === 'customer' ? 'Khách đặt qua Website' : 'Tạo đơn tại quầy'),
      status: bookingData.status || 'pending',
      createdBy: actor,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    const updatedList = [newBooking, ...bookings];
    this.saveBookings(updatedList);

    const logDetails = `Khách: ${newBooking.fullName} (${newBooking.phoneNumber}) | Dịch vụ: ${newBooking.serviceName} (${newBooking.modeLabel}) | Lịch hẹn: ${newBooking.bookingDate} lúc ${newBooking.bookingTime}`;
    this.addLog(
      'CREATE', 
      source === 'customer' ? 'Khách đặt qua Website' : `${actor} tạo đơn mới`, 
      logDetails, 
      newBooking.id,
      actor,
      actorRole
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

    const currentRole = this.getCurrentRole();
    const actor = currentRole === 'boss' ? '👑 Sếp' : '💼 Nhân viên';

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
      changes.push(`Cập nhật ghi chú`);
    }

    const details = changes.length > 0 
      ? `Đơn #${id} (${updatedBooking.fullName}): ${changes.join(', ')}`
      : `Đơn #${id} (${updatedBooking.fullName}): Cập nhật thông tin chi tiết`;

    this.addLog('UPDATE', `${actor} cập nhật đơn`, details, id, actor, currentRole || 'staff');

    return updatedBooking;
  },

  // STRICT RULE: ONLY BOSS IS PERMITTED TO DELETE
  deleteBooking(id) {
    const currentRole = this.getCurrentRole();

    // 1. Check permission: Staff is strictly forbidden from deleting
    if (currentRole !== 'boss') {
      const errorMsg = 'CHỈ SẾP MỚI CÓ QUYỀN XÓA ĐƠN ĐẶT LỊCH! Nhân viên không được phép thực hiện thao tác này.';
      this.addLog(
        'SECURITY_ALERT',
        'CẢNH BÁO: Nhân viên cố gắng xóa đơn',
        `Nhân viên đã bấm xóa đơn #${id} nhưng hệ thống đã chặn lại theo phân quyền`,
        id,
        '💼 Nhân viên',
        'staff'
      );
      return { success: false, message: errorMsg };
    }

    // 2. Perform deletion for Boss
    const bookings = this.getAllBookings();
    const target = bookings.find(b => b.id === id);
    if (!target) return { success: false, message: 'Không tìm thấy đơn hàng cần xóa.' };

    const filtered = bookings.filter(b => b.id !== id);
    this.saveBookings(filtered);

    this.addLog(
      'DELETE',
      '👑 Sếp đã xóa đơn đặt lịch',
      `Sếp đã xóa vĩnh viễn đơn #${id} của khách ${target.fullName} (${target.phoneNumber}) - Dịch vụ: ${target.serviceName}`,
      id,
      '👑 Sếp',
      'boss'
    );
    return { success: true };
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

  addLog(action, actionTitle, details, orderId = null, actor = 'Hệ thống', actorRole = 'system') {
    const logs = this.getAllLogs();
    const newLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action, // 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'AUTH' | 'SECURITY_ALERT'
      actionTitle,
      actor,
      actorRole, // 'boss' | 'staff' | 'customer' | 'system'
      details,
      orderId,
      timestamp: new Date().toISOString()
    };
    this.saveLogs([newLog, ...logs]);
  },

  clearAuditLogs() {
    if (!this.isBoss()) {
      alert('Chỉ Sếp mới có quyền làm trống nhật ký thao tác!');
      return false;
    }
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    this.saveLogs([{
      id: `LOG-${Date.now()}`,
      action: 'SYSTEM',
      actionTitle: '👑 Sếp làm trống lịch sử',
      actor: '👑 Sếp',
      actorRole: 'boss',
      details: 'Sếp đã làm trống toàn bộ nhật ký thao tác audit log',
      timestamp: new Date().toISOString()
    }]);
    return true;
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
      'Người Tạo',
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
      `"${b.createdBy || 'Web'}"`,
      `"${(b.skinNotes || '').replace(/"/g, '""')}"`,
      `"${(b.adminNotes || '').replace(/"/g, '""')}"`,
      `"${new Date(b.createdAt).toLocaleString('vi-VN')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    return csvContent;
  },

  exportFullBackupJson() {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      exportedBy: this.isBoss() ? 'Sếp' : 'Nhân viên',
      brand: 'FORHER Beauty & Spa',
      bookings: this.getAllBookings(),
      logs: this.getAllLogs()
    };
    return JSON.stringify(data, null, 2);
  },

  resetDemoData() {
    if (!this.isBoss()) {
      alert('Chỉ Sếp mới có quyền nạp lại dữ liệu mẫu!');
      return false;
    }
    this.saveBookings(SAMPLE_BOOKINGS);
    this.saveLogs(INITIAL_LOGS);
    return true;
  }
};
