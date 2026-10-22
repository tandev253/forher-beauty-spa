/**
 * FORHER BEAUTY & SPA - HYBRID STORAGE SERVICE (SUPABASE CLOUD + LOCAL FALLBACK)
 * Features:
 * - Direct Supabase integration with https://lrjumrqjpepxmlwaiwvq.supabase.co
 * - Boss account: 'admin' (can change own password & create staff accounts)
 * - Staff accounts: created and managed by Boss
 * - Role-Based Access Control: ONLY Boss can delete bookings
 * - Audit logging with full activity trail
 */

import { supabase, SUPABASE_INIT_SQL } from '../config/supabaseClient';

const STORAGE_KEYS = {
  BOOKINGS: 'forher_bookings_v2',
  LOGS: 'forher_audit_logs_v2',
  ACCOUNTS: 'forher_staff_accounts_v2',
  SESSION: 'forher_auth_session_v2',
  CLOUD_STATUS: 'forher_cloud_status_v2',
  BANK_CONFIG: 'forher_bank_config_v2',
  ATTENDANCE: 'forher_staff_attendance_v2'
};

// Default Spa Bank Configuration for VietQR
export const DEFAULT_BANK_CONFIG = {
  bankId: 'MB', // VietQR bank code
  bankName: 'MB Bank (Ngân Hàng Quân Đội)',
  accountNumber: '0703994683',
  accountName: 'FORHER BEAUTY SPA',
  template: 'compact2'
};

export const POPULAR_BANKS = [
  { id: 'MB', name: 'MB Bank (Ngân hàng Quân Đội)' },
  { id: 'VCB', name: 'Vietcombank (Ngoại thương Việt Nam)' },
  { id: 'TCB', name: 'Techcombank (Kỹ thương Việt Nam)' },
  { id: 'ACB', name: 'ACB (Á Châu)' },
  { id: 'VPB', name: 'VPBank (Việt Nam Thịnh Vượng)' },
  { id: 'BIDV', name: 'BIDV (Đầu tư và Phát triển VN)' },
  { id: 'CTG', name: 'VietinBank (Công thương Việt Nam)' },
  { id: 'TPB', name: 'TPBank (Tiên Phong)' },
  { id: 'STB', name: 'Sacombank (Sài Gòn Thương Tín)' },
  { id: 'HDB', name: 'HDBank (Phát triển TP.HCM)' },
  { id: 'VIB', name: 'VIB (Quốc Tế)' },
  { id: 'MSB', name: 'MSB (Hàng Hải)' },
  { id: 'OCB', name: 'OCB (Phương Đông)' },
  { id: 'SHB', name: 'SHB (Sài Gòn - Hà Nội)' }
];

export function parsePriceToNumber(price) {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  const num = parseInt(price.toString().replace(/[^\d]/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

export function formatVnd(amount) {
  const n = parsePriceToNumber(amount);
  return n.toLocaleString('vi-VN') + 'đ';
}

export function generateVietQrUrl(bankId, accountNumber, amount, orderId, accountName = '', template = 'compact2') {
  const memo = encodeURIComponent(`FORHER ${orderId}`);
  const accNameParam = accountName ? `&accountName=${encodeURIComponent(accountName)}` : '';
  const amtParam = Number(amount) > 0 ? `amount=${amount}&` : '';
  return `https://img.vietqr.io/image/${bankId}-${accountNumber}-${template}.png?${amtParam}addInfo=${memo}${accNameParam}`;
}

// Initial default Boss account and Sample Staff
const DEFAULT_ACCOUNTS = [
  {
    id: 'ACC-BOSS-01',
    username: 'admin',
    password: 'forheradmin',
    fullName: 'Sếp / Quản Lý Tối Cao',
    role: 'boss',
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ACC-STAFF-01',
    username: 'nhanvien1',
    password: 'forhernv',
    fullName: 'Lê Thị Thu Thảo',
    role: 'staff',
    active: true,
    createdAt: new Date().toISOString()
  }
];

const todayDateStr = new Date().toISOString().split('T')[0];
const yesterdayDateStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgoDateStr = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];

const DEFAULT_ATTENDANCE = [
  {
    id: 'ATT-SAMPLE-01',
    username: 'nhanvien1',
    staffName: 'Lê Thị Thu Thảo',
    date: todayDateStr,
    checkInTime: '08:30',
    checkOutTime: null,
    status: 'working',
    workingHours: null,
    shiftName: 'Ca Hành Chính (08:30 - 17:30)',
    notes: 'Đi làm đúng giờ',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ATT-SAMPLE-02',
    username: 'nhanvien1',
    staffName: 'Lê Thị Thu Thảo',
    date: yesterdayDateStr,
    checkInTime: '08:25',
    checkOutTime: '17:35',
    status: 'completed',
    workingHours: 9.2,
    shiftName: 'Ca Hành Chính (08:30 - 17:30)',
    notes: 'Phục vụ 4 khách hàng chu đáo',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'ATT-SAMPLE-03',
    username: 'nhanvien1',
    staffName: 'Lê Thị Thu Thảo',
    date: twoDaysAgoDateStr,
    checkInTime: '08:30',
    checkOutTime: '17:30',
    status: 'completed',
    workingHours: 9.0,
    shiftName: 'Ca Hành Chính (08:30 - 17:30)',
    notes: 'Hoàn thành ca làm tốt',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

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
    isPaid: false,
    paidAmount: 0,
    assignedStaff: 'nhanvien1',
    assignedStaffName: 'Lê Thị Thu Thảo',
    bookingDate: todayDateStr,
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
    isPaid: false,
    paidAmount: 0,
    assignedStaff: 'nhanvien1',
    assignedStaffName: 'Lê Thị Thu Thảo',
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
    isPaid: true,
    paidAmount: 250000,
    paymentMethod: 'cash',
    paidAt: new Date().toISOString(),
    cashier: 'Lê Thị Thu Thảo',
    assignedStaff: 'nhanvien1',
    assignedStaffName: 'Lê Thị Thu Thảo',
    bookingDate: todayDateStr,
    bookingTime: '11:00',
    skinNotes: 'Chăm sóc thư giãn buổi trưa',
    adminNotes: 'Khách rất hài lòng, đã thanh toán đủ tiền mặt',
    status: 'completed',
    createdBy: 'Nhân viên lễ tân',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'FH-839204',
    fullName: 'Phạm Quỳnh Anh',
    phoneNumber: '0912345678',
    serviceId: 'tl-bikini',
    serviceName: 'Triệt Lông Bikini Tạo Hình',
    categoryName: 'Triệt Lông (BH 2 Năm)',
    modeLabel: 'Trọn Gói BH 2 Năm',
    priceDisplay: '1.200.000đ',
    isPaid: true,
    paidAmount: 1200000,
    paymentMethod: 'transfer',
    paidAt: new Date(Date.now() - 86400000).toISOString(),
    cashier: 'Sếp / Quản Lý Tối Cao',
    assignedStaff: 'admin',
    assignedStaffName: 'Sếp / Quản Lý Tối Cao',
    bookingDate: yesterdayDateStr,
    bookingTime: '14:30',
    skinNotes: 'Bảo hành 2 năm, cấp sổ bảo hành',
    adminNotes: 'Đã quét mã VietQR thành công',
    status: 'completed',
    createdBy: 'Nhân viên lễ tân',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'FH-839205',
    fullName: 'Hoàng Thùy Dương',
    phoneNumber: '0977889900',
    serviceId: 'sk-c-glow',
    serviceName: 'Điện Di Vitamin C Sáng Da',
    categoryName: 'Skincare & Phục Hồi',
    modeLabel: 'Buổi Đơn Lẻ',
    priceDisplay: '350.000đ',
    isPaid: true,
    paidAmount: 350000,
    paymentMethod: 'transfer',
    paidAt: new Date().toISOString(),
    cashier: 'Lê Thị Thu Thảo',
    assignedStaff: 'nhanvien1',
    assignedStaffName: 'Lê Thị Thu Thảo',
    bookingDate: todayDateStr,
    bookingTime: '16:00',
    skinNotes: 'Da sạm nhẹ sau chuyến đi biển, cần cấp ẩm phục hồi',
    adminNotes: 'Đã hoàn thành dịch vụ và thu tiền chuyển khoản VietQR',
    status: 'completed',
    createdBy: 'Lê Thị Thu Thảo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_LOGS = [
  {
    id: 'LOG-1',
    action: 'INIT',
    actionTitle: 'Khởi tạo hệ thống',
    actor: 'Hệ thống',
    actorRole: 'system',
    details: 'Hệ thống Phân Quyền Quản Trị FORHER Beauty (Sếp admin & Nhân viên) tích hợp Supabase đi vào hoạt động',
    timestamp: new Date().toISOString()
  }
];

export const BookingStorage = {
  getInitSql() {
    return SUPABASE_INIT_SQL;
  },

  // --- ACCOUNTS MANAGEMENT ---
  getAllAccounts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (!data) {
        this.saveAccounts(DEFAULT_ACCOUNTS);
        return DEFAULT_ACCOUNTS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  },

  saveAccounts(accounts) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {
      console.error('Error saving accounts:', e);
    }
  },

  async syncAccountsFromSupabase() {
    try {
      const { data, error } = await supabase
        .from('staff_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map(item => ({
          id: item.id,
          username: item.username,
          password: item.password,
          fullName: item.full_name,
          role: item.role,
          active: item.active !== false,
          createdAt: item.created_at
        }));
        this.saveAccounts(mapped);
        return { success: true, count: mapped.length };
      }
    } catch (err) {
      // Offline fallback
    }
    return { success: false };
  },

  async createStaffAccount(accountData) {
    if (!this.isBoss()) {
      return { success: false, message: 'Chỉ Sếp (admin) mới có quyền tạo tài khoản cho nhân viên!' };
    }

    const username = (accountData.username || '').trim().toLowerCase();
    const password = (accountData.password || '').trim();
    const fullName = (accountData.fullName || '').trim();
    const role = accountData.role === 'boss' ? 'boss' : 'staff';

    if (!username || username.length < 3) {
      return { success: false, message: 'Tên đăng nhập phải có ít nhất 3 ký tự (không dấu, viết liền).' };
    }
    if (!password || password.length < 6) {
      return { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự.' };
    }
    if (!fullName) {
      return { success: false, message: 'Vui lòng nhập họ và tên nhân viên.' };
    }

    const accounts = this.getAllAccounts();
    if (accounts.some(a => a.username.toLowerCase() === username)) {
      return { success: false, message: `Tên đăng nhập "${username}" đã tồn tại trên hệ thống!` };
    }

    const newAccount = {
      id: `ACC-${Date.now()}`,
      username,
      password,
      fullName,
      role,
      active: true,
      createdAt: new Date().toISOString()
    };

    // 1. Save local
    const updated = [newAccount, ...accounts];
    this.saveAccounts(updated);

    // 2. Try push to Supabase
    try {
      await supabase.from('staff_accounts').insert([{
        username: newAccount.username,
        password: newAccount.password,
        full_name: newAccount.fullName,
        role: newAccount.role,
        active: true
      }]);
    } catch (e) {
      console.warn('Supabase accounts insert pending/table not ready:', e);
    }

    this.addLog(
      'AUTH',
      'Sếp tạo tài khoản nhân viên',
      `Sếp đã tạo tài khoản "${username}" cho nhân viên ${fullName} (${role === 'boss' ? 'Quản lý' : 'Nhân viên lễ tân'})`,
      null,
      'Sếp (admin)',
      'boss'
    );

    return { success: true, account: newAccount };
  },

  async updateAccount(username, updateFields) {
    const accounts = this.getAllAccounts();
    const index = accounts.findIndex(a => a.username.toLowerCase() === username.toLowerCase());
    if (index === -1) return { success: false, message: 'Không tìm thấy tài khoản.' };

    const old = accounts[index];
    const updated = { ...old, ...updateFields };
    accounts[index] = updated;
    this.saveAccounts(accounts);

    // Sync cloud
    try {
      const dbUpdate = {};
      if (updateFields.password) dbUpdate.password = updateFields.password;
      if (updateFields.fullName) dbUpdate.full_name = updateFields.fullName;
      if (updateFields.active !== undefined) dbUpdate.active = updateFields.active;
      await supabase.from('staff_accounts').update(dbUpdate).eq('username', username);
    } catch (e) {
      console.warn('Supabase account update warning:', e);
    }

    return { success: true, account: updated };
  },

  async deleteStaffAccount(username) {
    if (!this.isBoss()) {
      return { success: false, message: 'Chỉ Sếp (admin) mới có quyền xóa tài khoản!' };
    }
    if (username.toLowerCase() === 'admin') {
      return { success: false, message: 'Không thể xóa tài khoản Sếp admin tối cao!' };
    }

    const accounts = this.getAllAccounts();
    const target = accounts.find(a => a.username.toLowerCase() === username.toLowerCase());
    if (!target) return { success: false, message: 'Không tìm thấy tài khoản.' };

    const filtered = accounts.filter(a => a.username.toLowerCase() !== username.toLowerCase());
    this.saveAccounts(filtered);

    try {
      await supabase.from('staff_accounts').delete().eq('username', username);
    } catch (e) {
      console.warn('Supabase account delete error:', e);
    }

    this.addLog(
      'AUTH',
      'Sếp xóa tài khoản nhân viên',
      `Sếp đã xóa tài khoản nhân viên "${username}" (${target.fullName}) khỏi hệ thống`,
      null,
      'Sếp (admin)',
      'boss'
    );

    return { success: true };
  },

  // --- AUTHENTICATION & SESSION ---
  getCurrentSession() {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (session) {
        return JSON.parse(session);
      }
    } catch {}
    return null;
  },

  isAuthenticated() {
    return this.getCurrentSession() !== null;
  },

  isBoss() {
    const session = this.getCurrentSession();
    return session?.role === 'boss' || session?.username === 'admin';
  },

  isStaff() {
    const session = this.getCurrentSession();
    return session?.role === 'staff';
  },

  async login(usernameInput, passwordInput) {
    const u = (usernameInput || '').trim().toLowerCase();
    const p = (passwordInput || '').trim();

    if (!u || !p) {
      return { success: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' };
    }

    // 1. Try to check Supabase staff_accounts first
    try {
      const { data, error } = await supabase
        .from('staff_accounts')
        .select('*')
        .eq('username', u)
        .eq('password', p)
        .eq('active', true)
        .maybeSingle();

      if (!error && data) {
        const session = {
          username: data.username,
          fullName: data.full_name,
          role: data.role, // 'boss' or 'staff'
          loginAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
        this.addLog('AUTH', 'Đăng nhập thành công', `Người dùng "${data.username}" (${data.full_name}) đã đăng nhập vào panel`, null, data.full_name, data.role);
        return { success: true, session };
      }
    } catch (err) {
      // Continue to local check
    }

    // 2. Check local accounts
    const accounts = this.getAllAccounts();
    const matched = accounts.find(a => a.username.toLowerCase() === u && a.password === p && a.active !== false);

    if (matched) {
      const session = {
        username: matched.username,
        fullName: matched.fullName,
        role: matched.role,
        loginAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      this.addLog('AUTH', 'Đăng nhập thành công', `Người dùng "${matched.username}" (${matched.fullName}) đã đăng nhập`, null, matched.fullName, matched.role);
      return { success: true, session };
    }

    // Special backward compatibility for admin default
    if (u === 'admin' && (p === 'forheradmin' || p === 'forherboss' || p === 'forherbeauty')) {
      const session = {
        username: 'admin',
        fullName: 'Sếp / Quản Lý Tối Cao',
        role: 'boss',
        loginAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      return { success: true, session };
    }

    return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác!' };
  },

  logout() {
    const session = this.getCurrentSession();
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    if (session) {
      this.addLog('AUTH', 'Đăng xuất', `${session.fullName} (${session.username}) đã đăng xuất`, null, session.fullName, session.role);
    }
  },

  async changeOwnPassword(oldPassword, newPassword) {
    const session = this.getCurrentSession();
    if (!session) return { success: false, message: 'Chưa đăng nhập!' };

    const accounts = this.getAllAccounts();
    const account = accounts.find(a => a.username.toLowerCase() === session.username.toLowerCase());

    const isOldCorrect = (account && account.password === oldPassword) || (session.username === 'admin' && (oldPassword === 'forheradmin' || oldPassword === 'forherboss'));

    if (!isOldCorrect) {
      return { success: false, message: 'Mật khẩu hiện tại không chính xác!' };
    }
    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' };
    }

    await this.updateAccount(session.username, { password: newPassword.trim() });
    this.addLog('AUTH', 'Đổi mật khẩu', `${session.fullName} (${session.username}) đã đổi mật khẩu thành công`, null, session.fullName, session.role);
    return { success: true };
  },

  // --- BOOKINGS CRUD (SUPABASE + LOCAL CACHE) ---
  getAllBookings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (!data) {
        this.saveBookings(SAMPLE_BOOKINGS);
        return SAMPLE_BOOKINGS;
      }
      return JSON.parse(data);
    } catch (e) {
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

  async syncBookingsFromSupabase() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped = data.map(item => ({
          id: item.id,
          fullName: item.full_name,
          phoneNumber: item.phone_number,
          serviceId: item.service_id,
          serviceName: item.service_name,
          categoryName: item.category_name,
          modeLabel: item.mode_label,
          priceDisplay: item.price_display,
          bookingDate: item.booking_date,
          bookingTime: item.booking_time,
          skinNotes: item.skin_notes || '',
          adminNotes: item.admin_notes || '',
          status: item.status || 'pending',
          assignedStaff: item.assigned_staff || '',
          assignedStaffName: item.assigned_staff_name || '',
          createdBy: item.created_by || 'Khách hàng',
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));
        this.saveBookings(mapped);
        return { success: true, count: mapped.length };
      }
    } catch (err) {
      // Offline fallback
    }
    return { success: false };
  },

  async createBooking(bookingData, source = 'customer') {
    const bookings = this.getAllBookings();
    const id = `FH-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowIso = new Date().toISOString();

    const session = this.getCurrentSession();
    let actor = 'Khách hàng (Web)';
    let actorRole = 'customer';

    if (source === 'admin' && session) {
      actor = session.role === 'boss' ? `Sếp (${session.username})` : session.fullName;
      actorRole = session.role;
    }

    const defaultStaff = source === 'admin' && session ? session.username : '';
    const defaultStaffName = source === 'admin' && session ? session.fullName : '';

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
      assignedStaff: bookingData.assignedStaff || defaultStaff,
      assignedStaffName: bookingData.assignedStaffName || defaultStaffName,
      createdBy: actor,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    // 1. Save local
    const updatedList = [newBooking, ...bookings];
    this.saveBookings(updatedList);

    // 2. Try push to Supabase Cloud
    try {
      await supabase.from('bookings').insert([{
        id: newBooking.id,
        full_name: newBooking.fullName,
        phone_number: newBooking.phoneNumber,
        service_id: newBooking.serviceId,
        service_name: newBooking.serviceName,
        category_name: newBooking.categoryName,
        mode_label: newBooking.modeLabel,
        price_display: newBooking.priceDisplay,
        booking_date: newBooking.bookingDate,
        booking_time: newBooking.bookingTime,
        skin_notes: newBooking.skinNotes,
        admin_notes: newBooking.adminNotes,
        status: newBooking.status,
        created_by: newBooking.createdBy,
        created_at: newBooking.createdAt,
        updated_at: newBooking.updatedAt
      }]);
    } catch (e) {
      console.warn('Supabase booking insert warning:', e);
    }

    // 3. Log audit
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

  async updateBooking(id, updateFields) {
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

    const session = this.getCurrentSession();
    const actor = session ? (session.role === 'boss' ? `Sếp (${session.username})` : session.fullName) : 'Nhân viên';
    const actorRole = session ? session.role : 'staff';

    // Try sync to Supabase
    try {
      const dbFields = {};
      if (updateFields.fullName) dbFields.full_name = updateFields.fullName;
      if (updateFields.phoneNumber) dbFields.phone_number = updateFields.phoneNumber;
      if (updateFields.serviceName) dbFields.service_name = updateFields.serviceName;
      if (updateFields.categoryName) dbFields.category_name = updateFields.categoryName;
      if (updateFields.modeLabel) dbFields.mode_label = updateFields.modeLabel;
      if (updateFields.priceDisplay) dbFields.price_display = updateFields.priceDisplay;
      if (updateFields.bookingDate) dbFields.booking_date = updateFields.bookingDate;
      if (updateFields.bookingTime) dbFields.booking_time = updateFields.bookingTime;
      if (updateFields.skinNotes !== undefined) dbFields.skin_notes = updateFields.skinNotes;
      if (updateFields.adminNotes !== undefined) dbFields.admin_notes = updateFields.adminNotes;
      if (updateFields.status) dbFields.status = updateFields.status;
      if (updateFields.assignedStaff !== undefined) dbFields.assigned_staff = updateFields.assignedStaff;
      if (updateFields.assignedStaffName !== undefined) dbFields.assigned_staff_name = updateFields.assignedStaffName;
      dbFields.updated_at = updatedBooking.updatedAt;

      await supabase.from('bookings').update(dbFields).eq('id', id);
    } catch (e) {
      console.warn('Supabase update warning:', e);
    }

    // Build changes for audit log
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

    const details = changes.length > 0 
      ? `Đơn #${id} (${updatedBooking.fullName}): ${changes.join(', ')}`
      : `Đơn #${id} (${updatedBooking.fullName}): Cập nhật thông tin chi tiết`;

    this.addLog('UPDATE', `${actor} cập nhật đơn`, details, id, actor, actorRole);

    return updatedBooking;
  },

  // ONLY BOSS IS PERMITTED TO DELETE
  async deleteBooking(id) {
    if (!this.isBoss()) {
      const session = this.getCurrentSession();
      const staffName = session ? session.fullName : 'Nhân viên';
      this.addLog(
        'SECURITY_ALERT',
        'CẢNH BÁO: Nhân viên cố gắng xóa đơn',
        `Nhân viên ${staffName} đã bấm xóa đơn #${id} nhưng hệ thống đã chặn theo phân cấp quyền hạn`,
        id,
        staffName,
        'staff'
      );
      return { success: false, message: 'CHỈ SẾP (ADMIN) MỚI CÓ QUYỀN XÓA ĐƠN ĐẶT LỊCH!' };
    }

    const bookings = this.getAllBookings();
    const target = bookings.find(b => b.id === id);
    if (!target) return { success: false, message: 'Không tìm thấy đơn hàng cần xóa.' };

    const filtered = bookings.filter(b => b.id !== id);
    this.saveBookings(filtered);

    // Try delete on Supabase
    try {
      await supabase.from('bookings').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }

    const session = this.getCurrentSession();
    const bossName = session ? `Sếp (${session.username})` : 'Sếp';

    this.addLog(
      'DELETE',
      'Sếp đã xóa đơn đặt lịch',
      `${bossName} đã xóa vĩnh viễn đơn #${id} của khách ${target.fullName} (${target.phoneNumber}) - Dịch vụ: ${target.serviceName}`,
      id,
      bossName,
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
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs.slice(0, 300)));
    } catch (e) {
      console.error('Error saving logs:', e);
    }
  },

  async addLog(action, actionTitle, details, orderId = null, actor = 'Hệ thống', actorRole = 'system') {
    const logs = this.getAllLogs();
    const newLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      actionTitle,
      actor,
      actorRole,
      details,
      orderId,
      timestamp: new Date().toISOString()
    };
    this.saveLogs([newLog, ...logs]);

    // Try push to Supabase audit_logs
    try {
      await supabase.from('audit_logs').insert([{
        id: newLog.id,
        action: newLog.action,
        action_title: newLog.actionTitle,
        actor: newLog.actor,
        actor_role: newLog.actorRole,
        details: newLog.details,
        order_id: newLog.orderId,
        timestamp: newLog.timestamp
      }]);
    } catch (e) {
      // Ignore background log error if table pending
    }
  },

  clearAuditLogs() {
    if (!this.isBoss()) {
      alert('Chỉ Sếp mới có quyền làm trống lịch sử audit log!');
      return false;
    }
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    this.saveLogs([{
      id: `LOG-${Date.now()}`,
      action: 'SYSTEM',
      actionTitle: 'Sếp làm trống lịch sử',
      actor: 'Sếp (admin)',
      actorRole: 'boss',
      details: 'Sếp đã làm trống toàn bộ nhật ký thao tác audit log',
      timestamp: new Date().toISOString()
    }]);
    return true;
  },

  // --- BANK & PAYMENT CONFIG (BOSS ONLY CAN EDIT) ---
  getBankConfig() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BANK_CONFIG);
      if (!data) {
        this.saveBankConfig(DEFAULT_BANK_CONFIG);
        return DEFAULT_BANK_CONFIG;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_BANK_CONFIG;
    }
  },

  saveBankConfig(config) {
    try {
      localStorage.setItem(STORAGE_KEYS.BANK_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Error saving bank config:', e);
    }
  },

  async updateBankConfig(newConfig) {
    if (!this.isBoss()) {
      return { 
        success: false, 
        message: 'BỊ CHẶN: Chỉ Quản lý (tài khoản Sếp admin) mới có quyền chỉnh sửa số tài khoản ngân hàng của cơ sở!' 
      };
    }

    const current = this.getBankConfig();
    const updated = {
      ...current,
      ...newConfig,
      accountNumber: (newConfig.accountNumber || '').trim(),
      accountName: (newConfig.accountName || '').trim().toUpperCase()
    };

    if (!updated.accountNumber) {
      return { success: false, message: 'Vui lòng nhập số tài khoản ngân hàng.' };
    }
    if (!updated.accountName) {
      return { success: false, message: 'Vui lòng nhập tên chủ tài khoản.' };
    }

    this.saveBankConfig(updated);

    const session = this.getCurrentSession();
    this.addLog(
      'SETTINGS',
      'Cập nhật tài khoản ngân hàng nhận tiền',
      `Sếp đã cập nhật STK: ${updated.accountNumber} (${updated.bankName}) - Chủ TK: ${updated.accountName}`,
      null,
      session ? session.fullName : 'Sếp',
      'boss'
    );

    return { success: true, config: updated };
  },

  // --- CHECKOUT & PAYMENTS ---
  async checkoutBooking(id, paymentData) {
    const bookings = this.getAllBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) return { success: false, message: 'Không tìm thấy đơn hàng cần thanh toán.' };

    const old = bookings[index];
    const session = this.getCurrentSession();
    const cashierName = session?.fullName || 'Thu ngân';
    const nowIso = new Date().toISOString();

    const originalAmount = parsePriceToNumber(old.priceDisplay);
    const paidAmount = paymentData.paidAmount !== undefined 
      ? Number(paymentData.paidAmount) 
      : originalAmount;

    const paymentMethod = paymentData.paymentMethod || 'transfer'; // 'transfer' | 'cash'
    const discountAmount = Number(paymentData.discountAmount || 0);
    const surchargeAmount = Number(paymentData.surchargeAmount || 0);
    const assignedStaff = paymentData.assignedStaff || old.assignedStaff || (session ? session.username : '');
    const assignedStaffName = paymentData.assignedStaffName || old.assignedStaffName || (session ? session.fullName : '');

    const updated = {
      ...old,
      isPaid: true,
      paidAmount,
      paymentMethod,
      discountAmount,
      surchargeAmount,
      paymentNote,
      cashier: cashierName,
      assignedStaff,
      assignedStaffName,
      paidAt: nowIso,
      status: 'completed',
      updatedAt: nowIso
    };

    bookings[index] = updated;
    this.saveBookings(bookings);

    // Sync to Supabase
    try {
      await supabase.from('bookings').update({
        status: 'completed',
        updated_at: nowIso
      }).eq('id', id);
    } catch (e) {
      console.warn('Supabase checkout sync warning:', e);
    }

    const methodLabel = paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản (VietQR)';
    this.addLog(
      'PAYMENT',
      `Thanh toán đơn #${id}`,
      `Thu ngân ${cashierName} đã xác nhận thanh toán đơn #${id} (${updated.fullName}) - Số tiền: ${formatVnd(paidAmount)} qua ${methodLabel}`,
      id,
      cashierName,
      session ? session.role : 'staff'
    );

    return { success: true, booking: updated };
  },

  // --- REVENUE CALCULATION (TODAY & MONTHLY) ---
  getRevenueStats() {
    const bookings = this.getAllBookings();
    const todayStr = new Date().toISOString().split('T')[0];
    const currentMonthPrefix = todayStr.substring(0, 7); // e.g. "2026-10"

    const paidList = bookings.filter(b => b.isPaid || b.status === 'completed');

    let todayRevenue = 0;
    let todayPaidCount = 0;
    let todayCash = 0;
    let todayTransfer = 0;

    let monthRevenue = 0;
    let monthPaidCount = 0;
    let monthCash = 0;
    let monthTransfer = 0;

    let totalRevenue = 0;
    let totalCash = 0;
    let totalTransfer = 0;

    paidList.forEach(b => {
      const amount = Number(b.paidAmount) || parsePriceToNumber(b.priceDisplay);
      const isCash = b.paymentMethod === 'cash';
      const isTransfer = b.paymentMethod === 'transfer' || !b.paymentMethod;

      totalRevenue += amount;
      if (isCash) totalCash += amount;
      else totalTransfer += amount;

      const bDate = b.paidAt ? b.paidAt.split('T')[0] : b.bookingDate;

      if (bDate === todayStr) {
        todayRevenue += amount;
        todayPaidCount++;
        if (isCash) todayCash += amount;
        else todayTransfer += amount;
      }

      if (bDate && bDate.startsWith(currentMonthPrefix)) {
        monthRevenue += amount;
        monthPaidCount++;
        if (isCash) monthCash += amount;
        else monthTransfer += amount;
      }
    });

    return {
      todayStr,
      currentMonthPrefix,
      todayRevenue,
      todayPaidCount,
      todayCash,
      todayTransfer,
      monthRevenue,
      monthPaidCount,
      monthCash,
      monthTransfer,
      totalRevenue,
      totalPaidCount: paidList.length,
      totalCash,
      totalTransfer,
      paidList
    };
  },

  // --- STAFF ATTENDANCE (CHẤM CÔNG NHÂN VIÊN) ---
  getAllAttendance() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      if (!data) {
        this.saveAttendance(DEFAULT_ATTENDANCE);
        return DEFAULT_ATTENDANCE;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_ATTENDANCE;
    }
  },

  saveAttendance(records) {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
    } catch (e) {
      console.error('Error saving attendance:', e);
    }
  },

  getTodayAttendance(username = null) {
    const list = this.getAllAttendance();
    const todayStr = new Date().toISOString().split('T')[0];
    if (username) {
      return list.find(a => a.username === username && a.date === todayStr) || null;
    }
    return list.filter(a => a.date === todayStr);
  },

  async checkInStaff(username, shiftName = 'Ca Hành Chính', notes = '') {
    const session = this.getCurrentSession();
    const accounts = this.getAllAccounts();
    const staff = accounts.find(a => a.username === username) || session;
    const staffName = staff?.fullName || username;
    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const list = this.getAllAttendance();
    const existingIndex = list.findIndex(a => a.username === username && a.date === todayStr);

    if (existingIndex !== -1 && list[existingIndex].status === 'working') {
      return { 
        success: false, 
        message: `Bạn đã chấm công vào ca hôm nay lúc ${list[existingIndex].checkInTime} rồi!` 
      };
    }

    const newRecord = {
      id: `ATT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      username,
      staffName,
      date: todayStr,
      checkInTime: timeStr,
      checkOutTime: null,
      status: 'working',
      workingHours: null,
      shiftName,
      notes: notes || 'Vào ca đúng giờ',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    let updatedList;
    if (existingIndex !== -1) {
      updatedList = [...list];
      updatedList[existingIndex] = { ...list[existingIndex], ...newRecord };
    } else {
      updatedList = [newRecord, ...list];
    }

    this.saveAttendance(updatedList);

    this.addLog(
      'ATTENDANCE',
      'Chấm công vào ca',
      `Nhân viên ${staffName} (${username}) đã chấm công VÀO CA lúc ${timeStr} ngày ${todayStr}`,
      null,
      staffName,
      staff?.role || 'staff'
    );

    return { success: true, record: newRecord };
  },

  async checkOutStaff(username, notes = '') {
    const session = this.getCurrentSession();
    const accounts = this.getAllAccounts();
    const staff = accounts.find(a => a.username === username) || session;
    const staffName = staff?.fullName || username;
    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const list = this.getAllAttendance();
    const index = list.findIndex(a => a.username === username && a.date === todayStr);

    if (index === -1) {
      return { 
        success: false, 
        message: 'Bạn chưa chấm công vào ca hôm nay nên không thể bấm tan ca!' 
      };
    }

    const target = list[index];
    let hours = 0;
    try {
      const [inH, inM] = target.checkInTime.split(':').map(Number);
      const [outH, outM] = timeStr.split(':').map(Number);
      const diffMinutes = (outH * 60 + outM) - (inH * 60 + inM);
      hours = Math.max(0, +(diffMinutes / 60).toFixed(1));
    } catch {
      hours = 8;
    }

    const updatedRecord = {
      ...target,
      checkOutTime: timeStr,
      status: 'completed',
      workingHours: hours,
      notes: notes ? `${target.notes || ''} | Tan ca: ${notes}` : target.notes,
      updatedAt: now.toISOString()
    };

    list[index] = updatedRecord;
    this.saveAttendance(list);

    this.addLog(
      'ATTENDANCE',
      'Chấm công tan ca',
      `Nhân viên ${staffName} (${username}) đã chấm công TAN CA lúc ${timeStr} (Tổng cộng: ${hours} giờ)`,
      null,
      staffName,
      staff?.role || 'staff'
    );

    return { success: true, record: updatedRecord };
  },

  async adminMarkAttendance(recordData) {
    if (!this.isBoss()) {
      return { success: false, message: 'Chỉ Quản lý (Sếp) mới có quyền chỉnh sửa chấm công!' };
    }
    const list = this.getAllAttendance();
    const id = recordData.id || `ATT-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const record = {
      id,
      username: recordData.username,
      staffName: recordData.staffName,
      date: recordData.date || nowIso.split('T')[0],
      checkInTime: recordData.checkInTime || '08:30',
      checkOutTime: recordData.checkOutTime || '17:30',
      status: recordData.status || 'completed',
      workingHours: Number(recordData.workingHours || 8),
      shiftName: recordData.shiftName || 'Ca Hành Chính',
      notes: recordData.notes || 'Sếp điều chỉnh chấm công',
      updatedAt: nowIso
    };

    const index = list.findIndex(a => a.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...record };
    } else {
      list.unshift(record);
    }

    this.saveAttendance(list);
    return { success: true, record };
  },

  // --- STAFF PERFORMANCE & REVENUE ATTRIBUTION ---
  getStaffPerformance(targetUsername = null, targetMonth = null) {
    const bookings = this.getAllBookings();
    const accounts = this.getAllAccounts();
    const attendance = this.getAllAttendance();

    const todayStr = new Date().toISOString().split('T')[0];
    const monthPrefix = targetMonth || todayStr.substring(0, 7);

    // Filter paid or completed bookings
    const paidList = bookings.filter(b => b.isPaid || b.status === 'completed');

    const evaluateStaff = (acc) => {
      const u = acc.username;
      const fn = acc.fullName;

      const staffBookings = paidList.filter(b => {
        if (b.assignedStaff) {
          return b.assignedStaff.toLowerCase() === u.toLowerCase();
        }
        return (b.cashier && b.cashier === fn) || (b.createdBy && b.createdBy.includes(fn));
      });

      let todayRev = 0;
      let todayCount = 0;
      let monthRev = 0;
      let monthCount = 0;
      let totalRev = 0;

      const todayOrders = [];
      const monthOrders = [];

      staffBookings.forEach(b => {
        const amt = Number(b.paidAmount) || parsePriceToNumber(b.priceDisplay);
        const bDate = b.paidAt ? b.paidAt.split('T')[0] : b.bookingDate;

        totalRev += amt;

        if (bDate === todayStr) {
          todayRev += amt;
          todayCount++;
          todayOrders.push(b);
        }

        if (bDate && bDate.startsWith(monthPrefix)) {
          monthRev += amt;
          monthCount++;
          monthOrders.push(b);
        }
      });

      const staffAttendance = attendance.filter(a => a.username === u && a.date.startsWith(monthPrefix));
      const todayAtt = attendance.find(a => a.username === u && a.date === todayStr) || null;
      const totalHours = staffAttendance.reduce((sum, a) => sum + (Number(a.workingHours) || 0), 0);

      return {
        username: u,
        fullName: fn,
        role: acc.role,
        todayRevenue: todayRev,
        todayOrdersCount: todayCount,
        todayOrders,
        monthRevenue: monthRev,
        monthOrdersCount: monthCount,
        monthOrders,
        totalRevenue: totalRev,
        totalOrdersCount: staffBookings.length,
        allOrders: staffBookings,
        attendanceHistory: staffAttendance,
        todayAttendance: todayAtt,
        monthWorkingDays: staffAttendance.filter(a => a.status === 'completed' || a.status === 'working').length,
        monthTotalHours: +totalHours.toFixed(1)
      };
    };

    if (targetUsername) {
      const acc = accounts.find(a => a.username.toLowerCase() === targetUsername.toLowerCase()) || {
        username: targetUsername,
        fullName: targetUsername,
        role: 'staff'
      };
      return evaluateStaff(acc);
    }

    const staffList = accounts.map(evaluateStaff);
    return {
      monthPrefix,
      todayStr,
      staffList
    };
  },

  // --- CSV EXPORT ---
  exportToCsv() {
    const bookings = this.getAllBookings();
    if (bookings.length === 0) return null;

    const headers = [
      'Mã Đơn',
      'Khách Hàng',
      'Số Điện Thoại',
      'Dịch Vụ',
      'Gói Liệu Trình',
      'Giá Niêm Yết',
      'Thanh Toán',
      'Số Tiền Thu',
      'Hình Thức',
      'Thu Ngân',
      'Ngày Hẹn',
      'Giờ Hẹn',
      'Trạng Thái',
      'Người Tạo',
      'Ghi Chú Khách',
      'Ghi Chú Nội Bộ',
      'Thời Gian Đặt',
      'Thời Gian Thanh Toán'
    ];

    const statusMap = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };

    const rows = bookings.map(b => {
      const isPaidText = b.isPaid ? 'Đã thanh toán' : (b.status === 'completed' ? 'Hoàn thành' : 'Chưa thanh toán');
      const paidAmt = b.paidAmount ? formatVnd(b.paidAmount) : (b.isPaid ? b.priceDisplay : '0đ');
      const method = b.paymentMethod === 'cash' ? 'Tiền mặt' : (b.paymentMethod === 'transfer' ? 'Chuyển khoản VietQR' : '—');
      return [
        `"${b.id}"`,
        `"${b.fullName}"`,
        `"${b.phoneNumber}"`,
        `"${b.serviceName}"`,
        `"${b.modeLabel}"`,
        `"${b.priceDisplay}"`,
        `"${isPaidText}"`,
        `"${paidAmt}"`,
        `"${method}"`,
        `"${b.cashier || '—'}"`,
        `"${b.bookingDate}"`,
        `"${b.bookingTime}"`,
        `"${statusMap[b.status] || b.status}"`,
        `"${b.createdBy || 'Web'}"`,
        `"${(b.skinNotes || '').replace(/"/g, '""')}"`,
        `"${(b.adminNotes || '').replace(/"/g, '""')}"`,
        `"${new Date(b.createdAt).toLocaleString('vi-VN')}"`,
        `"${b.paidAt ? new Date(b.paidAt).toLocaleString('vi-VN') : '—'}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    return csvContent;
  }
};
