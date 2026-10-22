import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookingStorage, 
  DEFAULT_BANK_CONFIG, 
  POPULAR_BANKS, 
  parsePriceToNumber, 
  formatVnd, 
  generateVietQrUrl 
} from '../data/bookingStorage';
import { SERVICES_CATALOG, COMPANY_INFO } from '../data/servicesData';
import { SUPABASE_URL } from '../config/supabaseClient';

export const SHIFT_OPTIONS = [
  'Ca Hành Chính (08:30 - 17:30)',
  'Ca Sáng (08:30 - 13:00)',
  'Ca Chiều (13:00 - 17:30)',
  'Ca Tối (17:30 - 21:00)',
  'Ca Toàn Thời Gian (08:30 - 20:30)'
];

export default function AdminPanel({ 
  isOpen = true, 
  onClose, 
  isStandalone = false, 
  onBackToWebsite 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState(null);

  const handleExit = () => {
    if (onBackToWebsite) {
      onBackToWebsite();
    } else if (onClose) {
      onClose();
    } else {
      window.location.href = '/';
    }
  };

  // PWA & Mobile App Install State (https://forherbeauty.vn/admin)
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showInstallGuideModal, setShowInstallGuideModal] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);
  const [showMobileInstallBanner, setShowMobileInstallBanner] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileRevenuePeriod, setMobileRevenuePeriod] = useState('today'); // 'today' | 'month'

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      const isIos = /iphone|ipad|ipod/.test(ua);
      setIsIosDevice(isIos);

      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      if (isStandaloneMode) {
        setIsAppInstalled(true);
        setShowMobileInstallBanner(false);
      }

      const handleBeforeInstall = (e) => {
        e.preventDefault();
        setDeferredInstallPrompt(e);
      };

      const handleInstalled = () => {
        setIsAppInstalled(true);
        setDeferredInstallPrompt(null);
        setShowMobileInstallBanner(false);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstall);
      window.addEventListener('appinstalled', handleInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        window.removeEventListener('appinstalled', handleInstalled);
      };
    }
  }, []);

  const handleInstallAppClick = async () => {
    if (deferredInstallPrompt) {
      try {
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsAppInstalled(true);
          setShowMobileInstallBanner(false);
        }
        setDeferredInstallPrompt(null);
      } catch (err) {
        setShowInstallGuideModal(true);
      }
    } else {
      setShowInstallGuideModal(true);
    }
  };

  // Login Form State
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Navigation Tabs: 'bookings' | 'revenue' | 'attendance' | 'my_performance' | 'bank' | 'logs' | 'staff' | 'backup'
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [logs, setLogs] = useState([]);
  const [staffAccounts, setStaffAccounts] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);

  // Attendance & Shifts State
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(SHIFT_OPTIONS[0]);
  const [checkInNotes, setCheckInNotes] = useState('');
  const [isAdminAttendanceModalOpen, setIsAdminAttendanceModalOpen] = useState(false);
  const [adminAttendanceForm, setAdminAttendanceForm] = useState({
    id: null,
    username: '',
    staffName: '',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '08:30',
    checkOutTime: '17:30',
    shiftName: SHIFT_OPTIONS[0],
    status: 'completed',
    workingHours: 8,
    notes: ''
  });
  const [bossInspectingStaff, setBossInspectingStaff] = useState(null);
  const [staffOrderPeriod, setStaffOrderPeriod] = useState('month'); // 'today' | 'month' | 'all'
  const [attendanceFilterStaff, setAttendanceFilterStaff] = useState('all');

  // Search & Filters for Bookings
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Accordion Expand State for Mobile Cards ("chỉ hiển thị tên khách hàng và dịch vụ, khi bấm vào mới hiện hết")
  const [expandedCardIds, setExpandedCardIds] = useState({});
  const toggleCardExpand = (bookingId) => {
    setExpandedCardIds(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  // Bank & VietQR Configuration
  const [bankConfig, setBankConfig] = useState(DEFAULT_BANK_CONFIG);
  const [bankConfigMsg, setBankConfigMsg] = useState('');
  const [isSavingBank, setIsSavingBank] = useState(false);

  // Revenue Period Filter ('today' | 'month' | 'all')
  const [revenuePeriod, setRevenuePeriod] = useState('month');

  // Modals State
  const [editingBooking, setEditingBooking] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // View Detail Modal
  const [viewingBooking, setViewingBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Checkout & Payment Modal
  const [checkoutBooking, setCheckoutBooking] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('transfer'); // 'transfer' | 'cash'
  const [customPaidAmount, setCustomPaidAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [surchargeAmount, setSurchargeAmount] = useState(0);
  const [cashGiven, setCashGiven] = useState(0);
  const [paymentNote, setPaymentNote] = useState('');
  const [copyQrSuccess, setCopyQrSuccess] = useState('');
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [isQrZoomOpen, setIsQrZoomOpen] = useState(false);

  // Printable POS Receipt Modal
  const [receiptBooking, setReceiptBooking] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Staff Account Modal
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffFormData, setStaffFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'staff'
  });
  const [staffFormError, setStaffFormError] = useState('');

  // Password Change Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdMessage, setPwdMessage] = useState('');

  // Form Fields for Create / Edit Booking
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    serviceId: '',
    serviceName: '',
    categoryName: '',
    modeLabel: 'Buổi Đơn Lẻ',
    priceDisplay: '',
    bookingDate: new Date().toISOString().split('T')[0],
    bookingTime: '14:00',
    skinNotes: '',
    adminNotes: '',
    status: 'pending',
    assignedStaff: '',
    assignedStaffName: ''
  });

  const isBoss = session?.role === 'boss' || session?.username === 'admin';

  // Load Data
  const refreshData = async () => {
    setBookings(BookingStorage.getAllBookings());
    setLogs(BookingStorage.getAllLogs());
    setStaffAccounts(BookingStorage.getAllAccounts());
    setSession(BookingStorage.getCurrentSession());
    setBankConfig(BookingStorage.getBankConfig());
    setAttendanceList(BookingStorage.getAllAttendance());

    // Background sync with Supabase
    try {
      await BookingStorage.syncBookingsFromSupabase();
      await BookingStorage.syncAccountsFromSupabase();
      setBookings(BookingStorage.getAllBookings());
      setStaffAccounts(BookingStorage.getAllAccounts());
      setAttendanceList(BookingStorage.getAllAttendance());
    } catch (e) {
      // offline
    }
  };

  useEffect(() => {
    if (isOpen) {
      const auth = BookingStorage.isAuthenticated();
      setIsAuthenticated(auth);
      if (auth) {
        refreshData();
      }
    }
  }, [isOpen]);

  // Strict Role Redirection: Staff NEVER sees whole spa revenue
  useEffect(() => {
    if (isAuthenticated && !isBoss) {
      if (activeTab === 'revenue' || activeTab === 'staff' || activeTab === 'attendance') {
        setActiveTab('my_performance');
      }
    }
  }, [isAuthenticated, isBoss, activeTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const result = await BookingStorage.login(usernameInput, passwordInput);
      if (result.success) {
        setIsAuthenticated(true);
        setSession(result.session);
        setPasswordInput('');
        setLoginError('');
        refreshData();
      } else {
        setLoginError(result.message);
      }
    } catch (err) {
      setLoginError('Lỗi đăng nhập: ' + err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    BookingStorage.logout();
    setIsAuthenticated(false);
    setSession(null);
  };

  // Staff Check-in Action
  const handleStaffCheckIn = async (shift = selectedShift, notes = checkInNotes) => {
    if (!session?.username) return;
    const res = await BookingStorage.checkInStaff(session.username, shift, notes);
    if (res.success) {
      setIsCheckInModalOpen(false);
      setCheckInNotes('');
      refreshData();
      alert(`Chấm công VÀO CA thành công lúc ${res.record.checkInTime} (${res.record.shiftName})! Chúc bạn làm việc tốt lành.`);
    } else {
      alert(res.message);
    }
  };

  // Staff Check-out Action
  const handleStaffCheckOut = async () => {
    if (!session?.username) return;
    if (!window.confirm('Bạn có chắc chắn muốn kết thúc ca làm việc và TAN CA?')) return;
    const res = await BookingStorage.checkOutStaff(session.username, '');
    if (res.success) {
      refreshData();
      alert(`Chấm công TAN CA thành công lúc ${res.record.checkOutTime}! Tổng thời gian làm việc: ${res.record.workingHours} giờ.`);
    } else {
      alert(res.message);
    }
  };

  // Boss Adjust Attendance
  const handleAdminOpenAttendanceModal = (record = null) => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (record) {
      setAdminAttendanceForm({
        id: record.id,
        username: record.username,
        staffName: record.staffName,
        date: record.date,
        checkInTime: record.checkInTime || '08:30',
        checkOutTime: record.checkOutTime || '17:30',
        shiftName: record.shiftName || SHIFT_OPTIONS[0],
        status: record.status || 'completed',
        workingHours: record.workingHours || 8,
        notes: record.notes || ''
      });
    } else {
      const firstStaff = staffAccounts.find(s => s.role !== 'boss') || staffAccounts[0];
      setAdminAttendanceForm({
        id: null,
        username: firstStaff ? firstStaff.username : '',
        staffName: firstStaff ? firstStaff.fullName : '',
        date: todayStr,
        checkInTime: '08:30',
        checkOutTime: '17:30',
        shiftName: SHIFT_OPTIONS[0],
        status: 'completed',
        workingHours: 8,
        notes: 'Sếp điều chỉnh chấm công'
      });
    }
    setIsAdminAttendanceModalOpen(true);
  };

  const handleAdminSaveAttendance = async (e) => {
    e.preventDefault();
    if (!isBoss) {
      alert('Chỉ Quản lý (Sếp) mới có quyền chỉnh sửa chấm công!');
      return;
    }
    const res = await BookingStorage.adminMarkAttendance(adminAttendanceForm);
    if (res.success) {
      setIsAdminAttendanceModalOpen(false);
      refreshData();
      alert('Đã cập nhật bản ghi chấm công thành công!');
    } else {
      alert(res.message);
    }
  };

  // Status counters
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    return { total, pending, confirmed, completed, cancelled };
  }, [bookings]);

  // Real-time Revenue Calculations (Whole Spa - Admin Only)
  const revenueStats = useMemo(() => {
    return BookingStorage.getRevenueStats();
  }, [bookings]);

  // Personal Staff Performance (Only accessible to this staff & admin)
  const myPerformance = useMemo(() => {
    if (!session?.username) return null;
    return BookingStorage.getStaffPerformance(session.username);
  }, [bookings, attendanceList, session]);

  // All Staff Performance & Revenue Breakdown (Admin Only)
  const allStaffPerformance = useMemo(() => {
    if (!isBoss) return null;
    return BookingStorage.getStaffPerformance(null);
  }, [bookings, attendanceList, staffAccounts, isBoss]);

  // Today's attendance of current user
  const todayMyAttendance = useMemo(() => {
    if (!session?.username) return null;
    return BookingStorage.getTodayAttendance(session.username);
  }, [attendanceList, session]);

  // Filtered revenue list for Revenue Tab
  const filteredRevenueList = useMemo(() => {
    const list = revenueStats.paidList || [];
    if (revenuePeriod === 'today') {
      return list.filter(b => {
        const d = b.paidAt ? b.paidAt.split('T')[0] : b.bookingDate;
        return d === revenueStats.todayStr;
      });
    }
    if (revenuePeriod === 'month') {
      return list.filter(b => {
        const d = b.paidAt ? b.paidAt.split('T')[0] : b.bookingDate;
        return d && d.startsWith(revenueStats.currentMonthPrefix);
      });
    }
    return list;
  }, [revenueStats, revenuePeriod]);

  // Filtered bookings for Bookings List
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (paymentFilter === 'paid' && !b.isPaid && b.status !== 'completed') return false;
      if (paymentFilter === 'unpaid' && (b.isPaid || b.status === 'completed')) return false;
      if (dateFilter === 'today' && b.bookingDate !== todayStr) return false;
      if (dateFilter === 'upcoming' && b.bookingDate < todayStr) return false;

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = (b.fullName || '').toLowerCase().includes(term);
        const matchPhone = (b.phoneNumber || '').includes(term);
        const matchService = (b.serviceName || '').toLowerCase().includes(term);
        const matchId = (b.id || '').toLowerCase().includes(term);
        if (!matchName && !matchPhone && !matchService && !matchId) return false;
      }
      return true;
    });
  }, [bookings, statusFilter, paymentFilter, dateFilter, searchTerm, todayStr]);

  // Quick Status Change from row
  const handleQuickStatusChange = async (bookingId, newStatus) => {
    await BookingStorage.updateBooking(bookingId, { status: newStatus });
    refreshData();
  };

  // Open Detail Modal
  const handleOpenDetail = (booking) => {
    setViewingBooking(booking);
    setIsDetailModalOpen(true);
  };

  // Open Checkout Modal
  const handleOpenCheckout = (booking) => {
    setCheckoutBooking(booking);
    const basePrice = parsePriceToNumber(booking.priceDisplay);
    setCustomPaidAmount(basePrice);
    setDiscountAmount(0);
    setSurchargeAmount(0);
    setCashGiven(basePrice);
    setPaymentMethod('transfer');
    setPaymentNote('');
    setCopyQrSuccess('');
    setShowAdjustments(false);
    setIsQrZoomOpen(false);
    setIsCheckoutModalOpen(true);
  };

  // Final calculated checkout amount
  const finalCheckoutAmount = useMemo(() => {
    const base = Number(customPaidAmount) || 0;
    const disc = Number(discountAmount) || 0;
    const sur = Number(surchargeAmount) || 0;
    return Math.max(0, base - disc + sur);
  }, [customPaidAmount, discountAmount, surchargeAmount]);

  const cashChange = useMemo(() => {
    const given = Number(cashGiven) || 0;
    return Math.max(0, given - finalCheckoutAmount);
  }, [cashGiven, finalCheckoutAmount]);

  // Confirm Payment
  const handleConfirmPayment = async (printImmediately = false) => {
    if (!checkoutBooking) return;
    const cashierName = session?.fullName || (isBoss ? 'Sếp / Quản lý' : 'Nhân viên lễ tân');
    const res = await BookingStorage.checkoutBooking(checkoutBooking.id, {
      paidAmount: finalCheckoutAmount,
      paymentMethod,
      discountAmount: Number(discountAmount) || 0,
      surchargeAmount: Number(surchargeAmount) || 0,
      paymentNote,
      cashier: cashierName
    });

    if (res.success) {
      setIsCheckoutModalOpen(false);
      refreshData();
      if (printImmediately) {
        setReceiptBooking(res.booking);
        setIsReceiptModalOpen(true);
      } else {
        alert(`Đã xác nhận thanh toán đơn #${checkoutBooking.id} thành công (${formatVnd(finalCheckoutAmount)})!`);
      }
    } else {
      alert(res.message || 'Lỗi xử lý thanh toán');
    }
  };

  // Open Receipt Modal
  const handleOpenReceipt = (booking) => {
    setReceiptBooking(booking);
    setIsReceiptModalOpen(true);
  };

  // Save Bank Config (Boss only)
  const handleSaveBankConfig = async (e) => {
    e.preventDefault();
    if (!isBoss) {
      alert('BỊ CHẶN: Chỉ Quản lý (tài khoản Sếp admin) mới có quyền chỉnh sửa tài khoản ngân hàng của cơ sở!');
      return;
    }
    setIsSavingBank(true);
    setBankConfigMsg('');
    const res = await BookingStorage.updateBankConfig(bankConfig);
    setIsSavingBank(false);
    if (res.success) {
      setBankConfig(res.config);
      setBankConfigMsg('Cập nhật tài khoản ngân hàng nhận tiền thành công!');
      setTimeout(() => setBankConfigMsg(''), 3000);
      refreshData();
    } else {
      setBankConfigMsg(res.message);
    }
  };

  // Copy helper
  const handleCopyText = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopyQrSuccess(`Đã chép ${label}!`);
    setTimeout(() => setCopyQrSuccess(''), 2500);
  };

  // Open Form Modal for Create
  const handleOpenCreateModal = () => {
    setEditingBooking(null);
    setFormData({
      fullName: '',
      phoneNumber: '',
      serviceId: SERVICES_CATALOG[0]?.id || '',
      serviceName: SERVICES_CATALOG[0]?.name || 'Triệt Lông Nách',
      categoryName: SERVICES_CATALOG[0]?.categoryName || 'Triệt Lông',
      modeLabel: 'Buổi Đơn Lẻ',
      priceDisplay: SERVICES_CATALOG[0]?.singlePriceDisplay || '500.000đ',
      bookingDate: new Date().toISOString().split('T')[0],
      bookingTime: '14:00',
      skinNotes: '',
      adminNotes: '',
      status: 'pending',
      assignedStaff: isBoss ? '' : (session?.username || ''),
      assignedStaffName: isBoss ? '' : (session?.fullName || '')
    });
    setIsFormModalOpen(true);
  };

  // Open Form Modal for Edit
  const handleOpenEditModal = (booking) => {
    setEditingBooking(booking);
    setFormData({
      fullName: booking.fullName || '',
      phoneNumber: booking.phoneNumber || '',
      serviceId: booking.serviceId || '',
      serviceName: booking.serviceName || '',
      categoryName: booking.categoryName || '',
      modeLabel: booking.modeLabel || 'Buổi Đơn Lẻ',
      priceDisplay: booking.priceDisplay || '',
      bookingDate: booking.bookingDate || '',
      bookingTime: booking.bookingTime || '',
      skinNotes: booking.skinNotes || '',
      adminNotes: booking.adminNotes || '',
      status: booking.status || 'pending',
      assignedStaff: booking.assignedStaff || '',
      assignedStaffName: booking.assignedStaffName || ''
    });
    setIsFormModalOpen(true);
  };

  const handleServiceSelect = (svcId) => {
    const svc = SERVICES_CATALOG.find(s => s.id === svcId);
    if (svc) {
      setFormData(prev => ({
        ...prev,
        serviceId: svc.id,
        serviceName: svc.name,
        categoryName: svc.categoryName,
        priceDisplay: svc.singlePriceDisplay,
        modeLabel: svc.isWarranty2Y ? 'Trọn Gói BH 2 Năm' : 'Buổi Đơn Lẻ'
      }));
    }
  };

  // Save Booking
  const handleSaveForm = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phoneNumber.trim()) {
      alert('Vui lòng nhập họ tên và số điện thoại khách hàng.');
      return;
    }

    if (editingBooking) {
      await BookingStorage.updateBooking(editingBooking.id, formData);
    } else {
      await BookingStorage.createBooking(formData, 'admin');
    }

    setIsFormModalOpen(false);
    refreshData();
  };

  // Trigger Delete (Check role permission)
  const handleAttemptDelete = async (id) => {
    if (!isBoss) {
      alert('BỊ CHẶN QUYỀN HẠN:\nChỉ Sếp (tài khoản admin) mới có quyền xóa đơn đặt lịch!\nNhân viên chỉ có quyền xem, tiếp nhận và chỉnh sửa thông tin.');
      await BookingStorage.deleteBooking(id);
      refreshData();
      return;
    }
    setDeletingId(id);
  };

  // Confirm Delete (Only Boss)
  const handleConfirmDelete = async () => {
    if (deletingId) {
      const res = await BookingStorage.deleteBooking(deletingId);
      if (!res.success) {
        alert(res.message);
      }
      setDeletingId(null);
      refreshData();
    }
  };

  // Create Staff Account by Boss
  const handleCreateStaffAccount = async (e) => {
    e.preventDefault();
    setStaffFormError('');
    const result = await BookingStorage.createStaffAccount(staffFormData);
    if (result.success) {
      alert(`Đã tạo thành công tài khoản nhân viên: ${staffFormData.username}!`);
      setIsStaffModalOpen(false);
      setStaffFormData({ username: '', password: '', fullName: '', role: 'staff' });
      refreshData();
    } else {
      setStaffFormError(result.message);
    }
  };

  // Delete Staff Account
  const handleDeleteStaff = async (username) => {
    if (window.confirm(`Bạn có chắc muốn xóa tài khoản nhân viên "${username}"?`)) {
      const res = await BookingStorage.deleteStaffAccount(username);
      if (res.success) {
        refreshData();
      } else {
        alert(res.message);
      }
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const csvData = BookingStorage.exportToCsv();
    if (!csvData) {
      alert('Chưa có đơn đặt lịch nào để xuất file.');
      return;
    }
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `danh_sach_don_forher_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const result = await BookingStorage.changeOwnPassword(oldPassword, newPassword);
    if (result.success) {
      setPwdMessage('Đổi mật khẩu thành công!');
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setOldPassword('');
        setNewPassword('');
        setPwdMessage('');
      }, 1200);
    } else {
      setPwdMessage(result.message);
    }
  };

  if (!isStandalone && !isOpen) return null;

  return (
    <div className={isStandalone ? "admin-standalone-page" : "admin-overlay-backdrop"}>
      <div className={`admin-panel-modal ${isStandalone ? 'admin-standalone-modal' : ''}`}>
        {/* TOP BAR */}
        <div className="admin-top-bar">
          <div className="admin-branding">
            <div className="admin-brand-icon">FH</div>
            <div className="admin-brand-info">
              <div className="admin-brand-line">
                <span className="brand-name-text">FORHER Spa</span>
                {isAuthenticated ? (
                  isBoss ? (
                    <span className="admin-role-pill boss">SẾP</span>
                  ) : (
                    <span className="admin-role-pill staff">{session?.fullName || 'NV'}</span>
                  )
                ) : (
                  <span className="admin-badge-role">ADMIN</span>
                )}
              </div>
              <h2 className="admin-title">Quản Trị Đặt Lịch & POS</h2>
            </div>
          </div>

          {/* DESKTOP TOP ACTIONS (Visible on desktop screen) */}
          <div className="admin-top-actions desktop-top-actions">
            {!isAppInstalled && (
              <button 
                type="button" 
                className="btn-admin-install" 
                onClick={handleInstallAppClick}
                title="Tải & Cài Đặt App Quản Trị FORHER vào màn hình chính"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Tải Ứng Dụng</span>
              </button>
            )}
            {isAuthenticated && (
              <>
                <button 
                  type="button" 
                  className="btn-admin-nav" 
                  onClick={() => setIsPasswordModalOpen(true)}
                  title="Đổi mật khẩu cá nhân"
                >
                  Đổi Mật Khẩu
                </button>
                <button 
                  type="button" 
                  className="btn-admin-nav" 
                  onClick={handleLogout}
                  title="Đăng Xuất"
                >
                  Đăng Xuất
                </button>
              </>
            )}
            {!isStandalone && (
              <button 
                type="button" 
                className="btn-admin-close" 
                onClick={handleExit}
                title="Đóng Quản Trị"
              >
                ✕ Đóng
              </button>
            )}
          </div>

          {/* MOBILE TOP ACTIONS (Compact Install Pill + Hamburger Menu) */}
          <div className="mobile-top-actions">
            {!isAppInstalled && (
              <button 
                type="button" 
                className="btn-mobile-install-pill"
                onClick={handleInstallAppClick}
                title="Cài App vào màn hình chính"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Tải App</span>
              </button>
            )}
            <button 
              type="button" 
              className={`btn-mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              title="Menu Quản Trị"
            >
              <span className="bar-line"></span>
              <span className="bar-line"></span>
              <span className="bar-line"></span>
            </button>
          </div>
        </div>

        {/* MOBILE SLIDE-OUT MENU DRAWER */}
        {isMobileMenuOpen && (
          <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="mobile-drawer-card" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-drawer-header">
                <div>
                  <h4 className="drawer-title">{session?.fullName || 'Tài khoản Quản trị'}</h4>
                  <p className="drawer-subtitle">{isBoss ? 'Quản lý tối cao (Sếp admin)' : 'Nhân viên lễ tân'}</p>
                </div>
                <button type="button" className="btn-close-drawer" onClick={() => setIsMobileMenuOpen(false)}>
                  ✕
                </button>
              </div>

              <div className="mobile-drawer-links">
                {isAuthenticated && (
                  <>
                    <div className="mobile-drawer-section-title">DANH MỤC QUẢN TRỊ</div>
                    <button 
                      type="button" 
                      className={`drawer-link-item ${activeTab === 'bookings' ? 'active-tab-drawer' : ''}`}
                      onClick={() => { setActiveTab('bookings'); setIsMobileMenuOpen(false); }}
                    >
                      Quản Lý Đơn Đặt ({bookings.length})
                    </button>
                    {isBoss ? (
                      <>
                        <button 
                          type="button" 
                          className={`drawer-link-item ${activeTab === 'revenue' ? 'active-tab-drawer' : ''}`}
                          onClick={() => { setActiveTab('revenue'); setIsMobileMenuOpen(false); }}
                        >
                          Báo Cáo Doanh Thu (Toàn Spa)
                        </button>
                        <button 
                          type="button" 
                          className={`drawer-link-item ${activeTab === 'attendance' ? 'active-tab-drawer' : ''}`}
                          onClick={() => { setActiveTab('attendance'); setIsMobileMenuOpen(false); }}
                        >
                          Chấm Công & Hiệu Suất NV
                        </button>
                      </>
                    ) : (
                      <button 
                        type="button" 
                        className={`drawer-link-item ${activeTab === 'my_performance' ? 'active-tab-drawer' : ''}`}
                        onClick={() => { setActiveTab('my_performance'); setIsMobileMenuOpen(false); }}
                      >
                        Chấm Công & Doanh Thu Của Tôi
                      </button>
                    )}
                    <button 
                      type="button" 
                      className={`drawer-link-item ${activeTab === 'bank' ? 'active-tab-drawer' : ''}`}
                      onClick={() => { setActiveTab('bank'); setIsMobileMenuOpen(false); }}
                    >
                      Cài Đặt Ngân Hàng & QR {isBoss ? '' : '(Xem)'}
                    </button>
                    {isBoss && (
                      <button 
                        type="button" 
                        className={`drawer-link-item ${activeTab === 'staff' ? 'active-tab-drawer' : ''}`}
                        onClick={() => { setActiveTab('staff'); setIsMobileMenuOpen(false); }}
                      >
                        Quản Lý Nhân Viên ({staffAccounts.length})
                      </button>
                    )}
                    <button 
                      type="button" 
                      className={`drawer-link-item ${activeTab === 'logs' ? 'active-tab-drawer' : ''}`}
                      onClick={() => { setActiveTab('logs'); setIsMobileMenuOpen(false); }}
                    >
                      Lịch Sử Thao Tác ({logs.length})
                    </button>
                    <button 
                      type="button" 
                      className={`drawer-link-item ${activeTab === 'backup' ? 'active-tab-drawer' : ''}`}
                      onClick={() => { setActiveTab('backup'); setIsMobileMenuOpen(false); }}
                    >
                      Xuất File Dữ Liệu
                    </button>

                    <div className="drawer-divider"></div>
                    <div className="mobile-drawer-section-title">TIỆN ÍCH HỆ THỐNG</div>
                    <button 
                      type="button" 
                      className="drawer-link-item"
                      onClick={() => { setIsMobileMenuOpen(false); setIsPasswordModalOpen(true); }}
                    >
                      Đổi Mật Khẩu Cá Nhân
                    </button>
                    <button 
                      type="button" 
                      className="drawer-link-item"
                      onClick={() => { setIsMobileMenuOpen(false); handleExportCsv(); }}
                    >
                      Xuất File Excel (CSV)
                    </button>
                    <button 
                      type="button" 
                      className="drawer-link-item"
                      onClick={() => { setIsMobileMenuOpen(false); refreshData(); }}
                    >
                      Đồng Bộ Dữ Liệu Cloud
                    </button>
                  </>
                )}

                {!isAppInstalled && (
                  <button 
                    type="button" 
                    className="drawer-link-item highlight"
                    onClick={() => { setIsMobileMenuOpen(false); handleInstallAppClick(); }}
                  >
                    Cài Đặt App Vào Màn Hình Chính
                  </button>
                )}

                {!isStandalone && (
                  <>
                    <div className="drawer-divider"></div>
                    <button 
                      type="button" 
                      className="drawer-link-item home"
                      onClick={() => { setIsMobileMenuOpen(false); handleExit(); }}
                    >
                      ← Về Trang Chủ Website FORHER
                    </button>
                  </>
                )}

                {isAuthenticated && (
                  <button 
                    type="button" 
                    className="drawer-link-item logout"
                    onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                  >
                    Đăng Xuất
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MOBILE APP INSTALL BANNER */}
        {!isAppInstalled && showMobileInstallBanner && (
          <div className="admin-mobile-install-banner">
            <div className="banner-app-icon-wrap">
              <img src="/apple-touch-icon.png" alt="FORHER App" />
            </div>
            <div className="banner-app-text">
              <strong>Cài Đặt App FORHER Quản Trị</strong>
              <p>Mở nhanh từ màn hình chính điện thoại, không cần gõ web</p>
            </div>
            <div className="banner-app-btns">
              <button 
                type="button" 
                className="btn-install-banner" 
                onClick={handleInstallAppClick}
              >
                Tải App
              </button>
              <button 
                type="button" 
                className="btn-dismiss-banner" 
                onClick={() => setShowMobileInstallBanner(false)}
                title="Đóng thông báo"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* LOGIN SCREEN WITH USERNAME & PASSWORD */}
        {!isAuthenticated ? (
          <div className="admin-login-wrapper">
            <div className="admin-login-card">
              <span className="admin-login-logo">Forher Beauty</span>
              <h3>Đăng Nhập Quản Trị</h3>
              <p className="admin-login-desc">
                Đăng nhập tài khoản Sếp <strong>(admin)</strong> hoặc tài khoản Nhân viên do Sếp tạo.
              </p>

              <form onSubmit={handleLogin} className="admin-login-form">
                <div className="admin-form-group">
                  <label htmlFor="admin-username">Tên Đăng Nhập:</label>
                  <input
                    id="admin-username"
                    type="text"
                    placeholder="Nhập tên đăng nhập (ví dụ: admin)..."
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    autoFocus
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="admin-pwd">Mật Khẩu:</label>
                  <input
                    id="admin-pwd"
                    type="password"
                    placeholder="Nhập mật khẩu..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                  />
                </div>

                <div className="role-pwd-hint-box">
                  <p><strong>Tài khoản Quản lý (Sếp):</strong> <code>admin</code> (Mật khẩu mặc định: <code>forheradmin</code>)</p>
                  <p style={{ marginTop: '4px' }}><strong>Tài khoản Nhân viên:</strong> do Quản lý tạo (Mẫu: <code>nhanvien1</code> / <code>forhernv</code>)</p>
                </div>

                {loginError && <div className="admin-error-box">{loginError}</div>}

                <div className="admin-login-actions">
                  <button type="submit" className="btn-primary-gold w-100" disabled={isLoggingIn}>
                    {isLoggingIn ? 'Đang Kiểm Tra...' : 'Đăng Nhập Quản Trị'}
                  </button>
                  {!isStandalone && (
                    <button type="button" className="btn-outline-gold w-100" onClick={handleExit}>
                      Quay Lại Website
                    </button>
                  )}
                  {!isAppInstalled && (
                    <button 
                      type="button" 
                      className="btn-login-install-app w-100" 
                      onClick={handleInstallAppClick}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', flexShrink: 0 }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Tải & Cài Đặt Ứng Dụng Quản Trị
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="admin-dashboard-body">
            {/* MOBILE COMPACT EXECUTIVE SUMMARY (Tách biệt Sếp xem cả spa, Nhân viên chỉ thấy của mình) */}
            <div className="mobile-exec-summary">
              {isBoss ? (
                <div className="mobile-exec-card boss-card">
                  <div className="mobile-exec-top">
                    <div className="mobile-exec-label">
                      <span>DOANH THU SPA {mobileRevenuePeriod === 'today' ? 'HÔM NAY' : `THÁNG ${revenueStats.currentMonthPrefix.split('-')[1]}`}</span>
                    </div>
                    <div className="mobile-period-pills">
                      <button 
                        type="button" 
                        className={`period-pill ${mobileRevenuePeriod === 'today' ? 'active' : ''}`}
                        onClick={() => setMobileRevenuePeriod('today')}
                      >
                        Hôm Nay
                      </button>
                      <button 
                        type="button" 
                        className={`period-pill ${mobileRevenuePeriod === 'month' ? 'active' : ''}`}
                        onClick={() => setMobileRevenuePeriod('month')}
                      >
                        Tháng {revenueStats.currentMonthPrefix.split('-')[1]}
                      </button>
                    </div>
                  </div>

                  <div className="mobile-exec-big-num">
                    {formatVnd(mobileRevenuePeriod === 'today' ? revenueStats.todayRevenue : revenueStats.monthRevenue)}
                  </div>

                  <div className="mobile-exec-details">
                    <span>{mobileRevenuePeriod === 'today' ? revenueStats.todayPaidCount : revenueStats.monthPaidCount} đơn đã thu</span>
                    <span className="dot">•</span>
                    <span>CK: {formatVnd(mobileRevenuePeriod === 'today' ? revenueStats.todayTransfer : revenueStats.monthTransfer)}</span>
                    <span className="dot">•</span>
                    <span>TM: {formatVnd(mobileRevenuePeriod === 'today' ? revenueStats.todayCash : revenueStats.monthCash)}</span>
                  </div>
                </div>
              ) : (
                <div className="mobile-exec-card staff-card">
                  <div className="mobile-exec-top">
                    <div className="mobile-exec-label">
                      <span className="personal-badge-tag">CỦA BẠN</span>
                      <span>DOANH THU & CA LÀM</span>
                    </div>
                    <div className="mobile-period-pills">
                      <button 
                        type="button" 
                        className={`period-pill ${mobileRevenuePeriod === 'today' ? 'active' : ''}`}
                        onClick={() => setMobileRevenuePeriod('today')}
                      >
                        Hôm Nay
                      </button>
                      <button 
                        type="button" 
                        className={`period-pill ${mobileRevenuePeriod === 'month' ? 'active' : ''}`}
                        onClick={() => setMobileRevenuePeriod('month')}
                      >
                        Tháng {new Date().getMonth() + 1}
                      </button>
                    </div>
                  </div>

                  <div className="mobile-exec-big-num">
                    {formatVnd(mobileRevenuePeriod === 'today' ? myPerformance?.todayRevenue || 0 : myPerformance?.monthRevenue || 0)}
                  </div>

                  <div className="mobile-exec-details">
                    <span><strong>{mobileRevenuePeriod === 'today' ? myPerformance?.todayOrdersCount || 0 : myPerformance?.monthOrdersCount || 0}</strong> đơn bạn làm</span>
                    <span className="dot">•</span>
                    <span>Công tháng: <strong>{myPerformance?.monthWorkingDays || 0}</strong> ngày ({myPerformance?.monthTotalHours || 0}h)</span>
                  </div>

                  {/* Quick Attendance action bar for Staff on Mobile */}
                  <div className="mobile-attendance-quick-action">
                    {!todayMyAttendance ? (
                      <button 
                        type="button" 
                        className="btn-mobile-quick-checkin"
                        onClick={() => setIsCheckInModalOpen(true)}
                      >
                        <span className="dot-pulse green"></span>
                        <span>Bấm Điểm Danh Vào Ca</span>
                      </button>
                    ) : todayMyAttendance.status === 'working' ? (
                      <div className="mobile-working-row">
                        <span className="working-pill">🟢 Đang trong ca ({todayMyAttendance.checkInTime})</span>
                        <button 
                          type="button" 
                          className="btn-mobile-quick-checkout"
                          onClick={handleStaffCheckOut}
                        >
                          Tan Ca
                        </button>
                      </div>
                    ) : (
                      <div className="mobile-done-row">
                        <span className="done-pill">✓ Đã tan ca ({todayMyAttendance.checkInTime} - {todayMyAttendance.checkOutTime} | {todayMyAttendance.workingHours}h)</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MOBILE QUICK STATUS FILTER CHIPS */}
              <div className="mobile-status-chips-scroll">
                <button 
                  type="button" 
                  className={`mobile-chip ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('all')}
                >
                  Tất Cả ({stats.total})
                </button>
                <button 
                  type="button" 
                  className={`mobile-chip pending ${statusFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('pending')}
                >
                  Chờ Duyệt ({stats.pending})
                </button>
                <button 
                  type="button" 
                  className={`mobile-chip confirmed ${statusFilter === 'confirmed' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('confirmed')}
                >
                  Đã Xác Nhận ({stats.confirmed})
                </button>
                <button 
                  type="button" 
                  className={`mobile-chip completed ${statusFilter === 'completed' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('completed')}
                >
                  Đã Xong ({stats.completed})
                </button>
                <button 
                  type="button" 
                  className={`mobile-chip cancelled ${statusFilter === 'cancelled' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('cancelled')}
                >
                  Đã Hủy ({stats.cancelled})
                </button>
              </div>
            </div>

            {/* REVENUE STATS STRIP (DOANH THU TOÀN SPA CHO SẾP - DOANH THU CÁ NHÂN CHO NHÂN VIÊN) */}
            {isBoss ? (
              <div className="admin-revenue-strip boss-strip">
                <div className="revenue-stat-card today">
                  <span className="rev-card-title">Doanh Thu Toàn Spa Hôm Nay</span>
                  <span className="rev-card-amount">{formatVnd(revenueStats.todayRevenue)}</span>
                  <div className="rev-card-meta">
                    <span>{revenueStats.todayPaidCount} đơn đã thu tiền</span>
                    <span>TM: {formatVnd(revenueStats.todayCash)} | CK: {formatVnd(revenueStats.todayTransfer)}</span>
                  </div>
                </div>

                <div className="revenue-stat-card month">
                  <span className="rev-card-title">Doanh Thu Spa Tháng {revenueStats.currentMonthPrefix.split('-')[1]}</span>
                  <span className="rev-card-amount">{formatVnd(revenueStats.monthRevenue)}</span>
                  <div className="rev-card-meta">
                    <span>{revenueStats.monthPaidCount} đơn đã thu tiền</span>
                    <span>TM: {formatVnd(revenueStats.monthCash)} | CK: {formatVnd(revenueStats.monthTransfer)}</span>
                  </div>
                </div>

                <div className="revenue-stat-card cash">
                  <span className="rev-card-title">Tiền Mặt Tháng {revenueStats.currentMonthPrefix.split('-')[1]}</span>
                  <span className="rev-card-amount">{formatVnd(revenueStats.monthCash)}</span>
                  <div className="rev-card-meta">
                    <span>Thu tại quầy lễ tân</span>
                  </div>
                </div>

                <div className="revenue-stat-card transfer">
                  <span className="rev-card-title">VietQR Tháng {revenueStats.currentMonthPrefix.split('-')[1]}</span>
                  <span className="rev-card-amount">{formatVnd(revenueStats.monthTransfer)}</span>
                  <div className="rev-card-meta">
                    <span>TK: {bankConfig.accountNumber} ({bankConfig.bankId})</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="admin-revenue-strip staff-strip">
                <div className="revenue-stat-card today personal">
                  <span className="rev-card-title">Doanh Thu Của Bạn Hôm Nay</span>
                  <span className="rev-card-amount">{formatVnd(myPerformance?.todayRevenue || 0)}</span>
                  <div className="rev-card-meta">
                    <span><strong>{myPerformance?.todayOrdersCount || 0}</strong> đơn bạn phục vụ hôm nay</span>
                  </div>
                </div>

                <div className="revenue-stat-card month personal">
                  <span className="rev-card-title">Doanh Thu Của Bạn Tháng {new Date().getMonth() + 1}</span>
                  <span className="rev-card-amount">{formatVnd(myPerformance?.monthRevenue || 0)}</span>
                  <div className="rev-card-meta">
                    <span><strong>{myPerformance?.monthOrdersCount || 0}</strong> đơn bạn phục vụ trong tháng</span>
                  </div>
                </div>

                <div className="revenue-stat-card total personal">
                  <span className="rev-card-title">Ngày Công & Giờ Làm Tháng Này</span>
                  <span className="rev-card-amount">{myPerformance?.monthWorkingDays || 0} ngày</span>
                  <div className="rev-card-meta">
                    <span>Tổng <strong>{myPerformance?.monthTotalHours || 0}</strong> giờ làm việc</span>
                  </div>
                </div>

                <div className="revenue-stat-card attendance-card">
                  <span className="rev-card-title">Chấm Công Hôm Nay</span>
                  {!todayMyAttendance ? (
                    <div style={{ marginTop: '8px' }}>
                      <button 
                        type="button" 
                        className="btn-attendance-action checkin w-100"
                        onClick={() => setIsCheckInModalOpen(true)}
                      >
                        🟢 Chấm Công Vào Ca
                      </button>
                    </div>
                  ) : todayMyAttendance.status === 'working' ? (
                    <div style={{ marginTop: '6px' }}>
                      <div style={{ fontSize: '0.82rem', color: '#047857', fontWeight: 600, marginBottom: '6px' }}>
                        🟢 Vào ca: {todayMyAttendance.checkInTime} ({todayMyAttendance.shiftName})
                      </div>
                      <button 
                        type="button" 
                        className="btn-attendance-action checkout w-100"
                        onClick={handleStaffCheckOut}
                      >
                        🏁 Tan Ca Làm Việc
                      </button>
                    </div>
                  ) : (
                    <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#065F46', fontWeight: 600 }}>
                      ✓ Đã tan ca ({todayMyAttendance.checkInTime} - {todayMyAttendance.checkOutTime})
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                        Tổng: {todayMyAttendance.workingHours}h làm việc
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STATUS STATS STRIP */}
            <div className="admin-stats-strip">
              <div className="stat-pill total">
                <span className="stat-num">{stats.total}</span>
                <span className="stat-txt">Tổng Số Đơn</span>
              </div>
              <div className="stat-pill pending">
                <span className="stat-num">{stats.pending}</span>
                <span className="stat-txt">Chờ Xác Nhận</span>
              </div>
              <div className="stat-pill confirmed">
                <span className="stat-num">{stats.confirmed}</span>
                <span className="stat-txt">Đã Xác Nhận</span>
              </div>
              <div className="stat-pill completed">
                <span className="stat-num">{stats.completed}</span>
                <span className="stat-txt">Đã Hoàn Thành</span>
              </div>
              <div className="stat-pill cancelled">
                <span className="stat-num">{stats.cancelled}</span>
                <span className="stat-txt">Đã Hủy</span>
              </div>
            </div>

            {/* NAVIGATION TABS & QUICK ACTION */}
            <div className="admin-nav-toolbar">
              <div className="admin-tabs-list">
                <button
                  type="button"
                  className={`admin-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bookings')}
                >
                  Quản Lý Đơn Đặt ({bookings.length})
                </button>

                {isBoss ? (
                  <>
                    <button
                      type="button"
                      className={`admin-tab-btn ${activeTab === 'revenue' ? 'active' : ''}`}
                      onClick={() => setActiveTab('revenue')}
                    >
                      Báo Cáo Doanh Thu (Toàn Spa)
                    </button>

                    <button
                      type="button"
                      className={`admin-tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
                      onClick={() => setActiveTab('attendance')}
                    >
                      Chấm Công & Hiệu Suất NV
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className={`admin-tab-btn ${activeTab === 'my_performance' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my_performance')}
                  >
                    Chấm Công & Doanh Thu Của Tôi
                  </button>
                )}

                <button
                  type="button"
                  className={`admin-tab-btn ${activeTab === 'bank' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bank')}
                >
                  Cài Đặt Ngân Hàng & QR {isBoss ? '' : '(Xem)'}
                </button>

                {isBoss && (
                  <button
                    type="button"
                    className={`admin-tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
                    onClick={() => setActiveTab('staff')}
                  >
                    Quản Lý Nhân Viên ({staffAccounts.length})
                  </button>
                )}

                <button
                  type="button"
                  className={`admin-tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('logs')}
                >
                  Lịch Sử Thao Tác ({logs.length})
                </button>

                <button
                  type="button"
                  className={`admin-tab-btn ${activeTab === 'backup' ? 'active' : ''}`}
                  onClick={() => setActiveTab('backup')}
                >
                  Xuất File Dữ Liệu
                </button>
              </div>

              <div className="admin-header-actions desktop-header-actions">
                {activeTab === 'staff' && isBoss ? (
                  <button 
                    type="button" 
                    className="btn-admin-action gold"
                    onClick={() => { setStaffFormError(''); setIsStaffModalOpen(true); }}
                  >
                    + Tạo Tài Khoản Nhân Viên
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="btn-admin-action gold"
                    onClick={handleOpenCreateModal}
                  >
                    + Thêm Đơn Mới
                  </button>
                )}
                <button 
                  type="button" 
                  className="btn-admin-action outline"
                  onClick={handleExportCsv}
                >
                  Xuất File Excel
                </button>
                <button 
                  type="button" 
                  className="btn-admin-action refresh"
                  onClick={refreshData}
                  title="Đồng bộ dữ liệu Supabase Cloud"
                >
                  Đồng Bộ Dữ Liệu
                </button>
              </div>
            </div>

            {/* TAB CONTENT 1: BOOKINGS LIST */}
            {activeTab === 'bookings' && (
              <div className="admin-tab-content">
                {/* Mobile Prominent Add Booking Button */}
                <div className="mobile-add-btn-wrap">
                  <button 
                    type="button" 
                    className="btn-mobile-add-booking"
                    onClick={handleOpenCreateModal}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>Thêm Đơn Đặt Lịch Mới</span>
                  </button>
                </div>

                {/* Search & Filter Bar */}
                <div className="admin-filter-bar">
                  <div className="filter-search-box">
                    <input
                      type="text"
                      placeholder="Tìm theo tên khách, số điện thoại, mã đơn..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button 
                        type="button" 
                        className="btn-clear-filter"
                        onClick={() => setSearchTerm('')}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="filter-selects-group">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="filter-select desktop-only-filter"
                    >
                      <option value="all">Tất Cả Trạng Thái</option>
                      <option value="pending">Chờ xác nhận ({stats.pending})</option>
                      <option value="confirmed">Đã xác nhận ({stats.confirmed})</option>
                      <option value="completed">Đã hoàn thành ({stats.completed})</option>
                      <option value="cancelled">Đã hủy ({stats.cancelled})</option>
                    </select>

                    <select
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">Tất Cả Thanh Toán</option>
                      <option value="paid">Đã thanh toán ({revenueStats.paidList.length})</option>
                      <option value="unpaid">Chưa thanh toán ({bookings.length - revenueStats.paidList.length})</option>
                    </select>

                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">Tất Cả Ngày Hẹn</option>
                      <option value="today">Hôm nay ({todayStr})</option>
                      <option value="upcoming">Sắp tới</option>
                    </select>
                  </div>
                </div>

                {/* Bookings Table (Chỉ hiển thị trên máy tính desktop) */}
                <div className="admin-table-container desktop-table-view">
                  {filteredBookings.length === 0 ? (
                    <div className="admin-empty-state">
                      <p>Không tìm thấy đơn đặt lịch nào phù hợp với bộ lọc hiện tại.</p>
                      <button 
                        type="button" 
                        className="btn-outline-gold"
                        onClick={() => { setSearchTerm(''); setStatusFilter('all'); setPaymentFilter('all'); setDateFilter('all'); }}
                      >
                        Xóa Bộ Lọc
                      </button>
                    </div>
                  ) : (
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>MÃ ĐƠN</th>
                          <th>KHÁCH HÀNG</th>
                          <th>DỊCH VỤ ĐẶT</th>
                          <th>NGÀY & GIỜ HẸN</th>
                          <th>THANH TOÁN</th>
                          <th>GHI CHÚ</th>
                          <th>TRẠNG THÁI</th>
                          <th>THAO TÁC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((b) => {
                          const isToday = b.bookingDate === todayStr;
                          return (
                            <tr key={b.id} className={`booking-row status-${b.status}`}>
                              <td className="col-id">
                                <span className="order-id-badge">#{b.id}</span>
                                <small className="order-created-time">
                                  {new Date(b.createdAt).toLocaleDateString('vi-VN')}
                                </small>
                              </td>

                              <td className="col-customer">
                                <strong className="customer-name">{b.fullName}</strong>
                                <div className="customer-phone-group">
                                  <a href={`tel:${b.phoneNumber}`} className="phone-link">
                                    {b.phoneNumber}
                                  </a>
                                  <a 
                                    href={`https://zalo.me/${b.phoneNumber}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="btn-mini-zalo"
                                    title="Mở Zalo nhắn tin cho khách"
                                  >
                                    Chat Zalo
                                  </a>
                                </div>
                              </td>

                              <td className="col-service">
                                <span className="service-name-text">{b.serviceName}</span>
                                <div className="service-details-meta">
                                  <span className="mode-pill">{b.modeLabel}</span>
                                  <span className="price-tag">{b.priceDisplay}</span>
                                </div>
                                {b.assignedStaffName && (
                                  <div className="table-assigned-staff" title={`Kỹ thuật viên: ${b.assignedStaffName}`}>
                                    <span className="staff-icon">👤</span>
                                    <span>NV: <strong>{b.assignedStaffName}</strong></span>
                                  </div>
                                )}
                              </td>

                              <td className="col-datetime">
                                <div className="datetime-badge-box">
                                  <span className={`date-val ${isToday ? 'today-highlight' : ''}`}>
                                    {b.bookingDate} {isToday && <span className="today-pill">HÔM NAY</span>}
                                  </span>
                                  <span className="time-val">{b.bookingTime}</span>
                                </div>
                              </td>

                              <td className="col-payment">
                                {b.isPaid || b.status === 'completed' ? (
                                  <span className="payment-pill paid" title={`Đã thanh toán: ${formatVnd(b.paidAmount || b.priceDisplay)}`}>
                                    <strong>ĐÃ THU: {formatVnd(b.paidAmount || b.priceDisplay)}</strong>
                                    <small>{b.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản QR'}</small>
                                  </span>
                                ) : (
                                  <span className="payment-pill unpaid" title="Chưa ghi nhận thanh toán">
                                    <strong>CHƯA THU</strong>
                                    <small>{b.priceDisplay}</small>
                                  </span>
                                )}
                              </td>

                              <td className="col-notes">
                                {b.skinNotes ? (
                                  <p className="skin-note-text" title={b.skinNotes}>
                                    <strong>Da:</strong> {b.skinNotes}
                                  </p>
                                ) : (
                                  <span className="no-note">—</span>
                                )}
                                {b.adminNotes && (
                                  <p className="admin-note-text" title={b.adminNotes}>
                                    <strong>Nội bộ:</strong> {b.adminNotes}
                                  </p>
                                )}
                              </td>

                              <td className="col-status">
                                <select
                                  value={b.status}
                                  onChange={(e) => handleQuickStatusChange(b.id, e.target.value)}
                                  className={`status-select-badge ${b.status}`}
                                >
                                  <option value="pending">Chờ xác nhận</option>
                                  <option value="confirmed">Đã xác nhận</option>
                                  <option value="completed">Đã hoàn thành</option>
                                  <option value="cancelled">Đã hủy</option>
                                </select>
                              </td>

                              <td className="col-actions">
                                <div className="action-buttons-wrap">
                                  <button
                                    type="button"
                                    className="btn-tbl-action view"
                                    onClick={() => handleOpenDetail(b)}
                                    title="Xem chi tiết đơn này"
                                  >
                                    Xem
                                  </button>

                                  {!b.isPaid && b.status !== 'completed' ? (
                                    <button
                                      type="button"
                                      className="btn-tbl-action pay"
                                      onClick={() => handleOpenCheckout(b)}
                                      title="Tính tiền, in mã QR VietQR hoặc nhận tiền mặt"
                                    >
                                      Thu Tiền
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className="btn-tbl-action bill"
                                      onClick={() => handleOpenReceipt(b)}
                                      title="In phiếu thu / hóa đơn cho khách"
                                    >
                                      In Bill
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    className="btn-tbl-action edit"
                                    onClick={() => handleOpenEditModal(b)}
                                    title="Chỉnh sửa đơn"
                                  >
                                    Sửa
                                  </button>
                                  
                                  {/* ONLY BOSS CAN DELETE */}
                                  {isBoss ? (
                                    <button
                                      type="button"
                                      className="btn-tbl-action delete"
                                      onClick={() => handleAttemptDelete(b.id)}
                                      title="Quyền Sếp: Xóa đơn này"
                                    >
                                      Xóa
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className="btn-tbl-action delete-disabled"
                                      onClick={() => handleAttemptDelete(b.id)}
                                      title="Bị khóa: Chỉ Sếp admin mới có quyền xóa đơn!"
                                    >
                                      Khóa Xóa
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* MOBILE LUXURY ORDER CARDS LIST (Chỉ hiển thị trên điện thoại, cực kỳ gọn gàng & dễ thao tác) */}
                <div className="mobile-booking-cards-list">
                  {filteredBookings.length === 0 ? (
                    <div className="admin-empty-state">
                      <p>Không có đơn đặt lịch nào phù hợp.</p>
                      <button 
                        type="button" 
                        className="btn-outline-gold"
                        onClick={() => { setSearchTerm(''); setStatusFilter('all'); setPaymentFilter('all'); setDateFilter('all'); }}
                      >
                        Xóa Bộ Lọc
                      </button>
                    </div>
                  ) : (
                    filteredBookings.map((b) => {
                      const isToday = b.bookingDate === todayStr;
                      const isExpanded = !!expandedCardIds[b.id];
                      return (
                        <div 
                          key={b.id} 
                          className={`mobile-booking-card ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
                        >
                          {/* DÒNG TÓM TẮT: CHỈ HIỂN THỊ TÊN KHÁCH HÀNG & DỊCH VỤ */}
                          <div 
                            className="mobile-card-summary"
                            onClick={() => toggleCardExpand(b.id)}
                            title="Bấm để xem chi tiết toàn bộ đơn hàng"
                          >
                            <div className="mobile-summary-main">
                              <div className="mobile-summary-customer-row">
                                <strong className="mobile-summary-name">{b.fullName}</strong>
                                {isToday && <span className="today-badge-mini">HÔM NAY</span>}
                              </div>
                              <div className="mobile-summary-service-row">
                                <span className="mobile-summary-service">{b.serviceName}</span>
                                {b.bookingTime && <span className="mobile-summary-time">• {b.bookingTime}</span>}
                                {b.assignedStaffName && <span className="mobile-summary-staff-pill">• NV: {b.assignedStaffName}</span>}
                              </div>
                            </div>

                            <div className="mobile-summary-status-wrap">
                              <span className={`status-pill-compact ${b.status}`}>
                                {b.status === 'pending' ? 'Chờ duyệt' :
                                 b.status === 'confirmed' ? 'Đã duyệt' :
                                 b.status === 'completed' ? 'Đã xong' : 'Đã hủy'}
                              </span>
                              <div className={`chevron-indicator ${isExpanded ? 'rotated' : ''}`}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* KHI BẤM VÀO MỚI HIỆN HẾT ĐƠN CỦA KHÁCH */}
                          {isExpanded && (
                            <div className="mobile-card-expanded-body">
                              {/* Header: Mã đơn + Trạng thái */}
                              <div className="mobile-expanded-meta-row">
                                <div className="mobile-card-id-block">
                                  <span className="order-num-pill">#{b.id}</span>
                                  <span className="order-date-text">{new Date(b.createdAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                  <select
                                    value={b.status}
                                    onChange={(e) => handleQuickStatusChange(b.id, e.target.value)}
                                    className={`status-select-badge mini ${b.status}`}
                                  >
                                    <option value="pending">Chờ xác nhận</option>
                                    <option value="confirmed">Đã xác nhận</option>
                                    <option value="completed">Đã hoàn thành</option>
                                    <option value="cancelled">Đã hủy</option>
                                  </select>
                                </div>
                              </div>

                              {/* Lịch hẹn */}
                              <div className="mobile-card-appointment-time">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                <span>Lịch hẹn: <strong>{b.bookingTime}</strong> • {b.bookingDate} {isToday ? '(Hôm nay)' : ''}</span>
                              </div>

                              {/* Khách hàng & Số điện thoại + Nút Gọi/Zalo */}
                              <div className="mobile-card-customer">
                                <div className="customer-left">
                                  <span className="customer-phone-label">Điện thoại:</span>
                                  <a href={`tel:${b.phoneNumber}`} className="customer-phone-link">{b.phoneNumber}</a>
                                </div>
                                <div className="customer-contact-actions" onClick={(e) => e.stopPropagation()}>
                                  <a href={`tel:${b.phoneNumber}`} className="btn-quick-contact phone" title="Gọi điện">
                                    Gọi
                                  </a>
                                  <a href={`https://zalo.me/${b.phoneNumber}`} target="_blank" rel="noopener noreferrer" className="btn-quick-contact zalo" title="Chat Zalo">
                                    Zalo
                                  </a>
                                </div>
                              </div>

                              {/* Dịch vụ & Giá & Trạng thái thanh toán */}
                              <div className="mobile-card-service">
                                <div className="service-info-col">
                                  <span className="service-name-bold">{b.serviceName}</span>
                                  <span className="service-mode-tag">{b.modeLabel}</span>
                                </div>
                                <div className="service-price-col">
                                  <span className="service-price-val">{b.priceDisplay}</span>
                                  {b.isPaid || b.status === 'completed' ? (
                                    <span className="payment-pill paid mini">
                                      ĐÃ THU ({b.paymentMethod === 'cash' ? 'Tiền mặt' : 'QR'})
                                    </span>
                                  ) : (
                                    <span className="payment-pill unpaid mini">CHƯA THU</span>
                                  )}
                                </div>
                              </div>

                              {/* Ghi chú da */}
                              {b.skinNotes && (
                                <div className="mobile-card-note">
                                  <strong>Ghi chú da:</strong> {b.skinNotes}
                                </div>
                              )}

                              {/* Ghi chú nội bộ */}
                              {b.adminNotes && (
                                <div className="mobile-card-note internal">
                                  <strong>Nội bộ:</strong> {b.adminNotes}
                                </div>
                              )}

                              {/* Các nút thao tác */}
                              <div className="mobile-card-footer" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  className="btn-card-op view"
                                  onClick={() => handleOpenDetail(b)}
                                >
                                  Chi Tiết
                                </button>

                                {!b.isPaid && b.status !== 'completed' ? (
                                  <button
                                    type="button"
                                    className="btn-card-op pay"
                                    onClick={() => handleOpenCheckout(b)}
                                  >
                                    Thu Tiền / QR
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn-card-op bill"
                                    onClick={() => handleOpenReceipt(b)}
                                  >
                                    In Bill
                                  </button>
                                )}

                                <button
                                  type="button"
                                  className="btn-card-op edit"
                                  onClick={() => handleOpenEditModal(b)}
                                >
                                  Sửa
                                </button>

                                {isBoss ? (
                                  <button
                                    type="button"
                                    className="btn-card-op delete"
                                    onClick={() => handleAttemptDelete(b.id)}
                                    title="Xóa đơn (chỉ Sếp)"
                                  >
                                    Xóa
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn-card-op delete-disabled"
                                    onClick={() => handleAttemptDelete(b.id)}
                                    title="Khóa xóa"
                                  >
                                    Khóa
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: REVENUE REPORTS (BÁO CÁO DOANH THU TOÀN SPA - CHỈ SẾP ADMIN THẤY) */}
            {activeTab === 'revenue' && isBoss && (
              <div className="admin-tab-content">
                <div className="revenue-tab-header">
                  <div>
                    <h3>Báo Cáo Doanh Thu FORHER Beauty & Spa</h3>
                    <p>Thống kê doanh thu theo ngày, tháng và chi tiết các đơn đã thanh toán tại cơ sở.</p>
                  </div>
                  <div className="revenue-period-selector">
                    <button
                      type="button"
                      className={`rev-period-btn ${revenuePeriod === 'today' ? 'active' : ''}`}
                      onClick={() => setRevenuePeriod('today')}
                    >
                      Hôm Nay ({revenueStats.todayStr})
                    </button>
                    <button
                      type="button"
                      className={`rev-period-btn ${revenuePeriod === 'month' ? 'active' : ''}`}
                      onClick={() => setRevenuePeriod('month')}
                    >
                      Tháng {revenueStats.currentMonthPrefix.split('-')[1]}
                    </button>
                    <button
                      type="button"
                      className={`rev-period-btn ${revenuePeriod === 'all' ? 'active' : ''}`}
                      onClick={() => setRevenuePeriod('all')}
                    >
                      Toàn Thời Gian
                    </button>
                  </div>
                </div>

                <div className="admin-revenue-strip">
                  <div className="revenue-stat-card today">
                    <span className="rev-card-title">
                      {revenuePeriod === 'today' ? 'Tổng Doanh Thu Hôm Nay' : (revenuePeriod === 'month' ? 'Tổng Doanh Thu Tháng Này' : 'Tổng Doanh Thu Toàn Bộ')}
                    </span>
                    <span className="rev-card-amount">
                      {revenuePeriod === 'today' ? formatVnd(revenueStats.todayRevenue) : (revenuePeriod === 'month' ? formatVnd(revenueStats.monthRevenue) : formatVnd(revenueStats.totalRevenue))}
                    </span>
                    <div className="rev-card-meta">
                      <span>{filteredRevenueList.length} đơn đã thanh toán thành công</span>
                    </div>
                  </div>

                  <div className="revenue-stat-card cash">
                    <span className="rev-card-title">Doanh Thu Tiền Mặt</span>
                    <span className="rev-card-amount">
                      {formatVnd(filteredRevenueList.filter(b => b.paymentMethod === 'cash').reduce((s, b) => s + (b.paidAmount || parsePriceToNumber(b.priceDisplay)), 0))}
                    </span>
                    <div className="rev-card-meta">
                      <span>Thu trực tiếp tại quầy</span>
                    </div>
                  </div>

                  <div className="revenue-stat-card transfer">
                    <span className="rev-card-title">Doanh Thu Chuyển Khoản (VietQR)</span>
                    <span className="rev-card-amount">
                      {formatVnd(filteredRevenueList.filter(b => b.paymentMethod === 'transfer' || !b.paymentMethod).reduce((s, b) => s + (b.paidAmount || parsePriceToNumber(b.priceDisplay)), 0))}
                    </span>
                    <div className="rev-card-meta">
                      <span>Ngân hàng: {bankConfig.bankName}</span>
                    </div>
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>MÃ ĐƠN</th>
                        <th>THỜI GIAN THANH TOÁN</th>
                        <th>KHÁCH HÀNG</th>
                        <th>DỊCH VỤ</th>
                        <th>PHƯƠNG THỨC</th>
                        <th>SỐ TIỀN THỰC THU</th>
                        <th>THU NGÂN</th>
                        <th>THAO TÁC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRevenueList.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '30px' }}>
                            Chưa có đơn nào hoàn thành thanh toán trong khoảng thời gian này.
                          </td>
                        </tr>
                      ) : (
                        filteredRevenueList.map((b) => {
                          const paidDate = b.paidAt ? new Date(b.paidAt).toLocaleString('vi-VN') : (b.bookingDate + ' ' + b.bookingTime);
                          const amt = b.paidAmount || parsePriceToNumber(b.priceDisplay);
                          return (
                            <tr key={b.id}>
                              <td><strong className="order-id-badge">#{b.id}</strong></td>
                              <td>{paidDate}</td>
                              <td>
                                <strong>{b.fullName}</strong>
                                <small style={{ display: 'block', color: 'var(--text-muted)' }}>{b.phoneNumber}</small>
                              </td>
                              <td>
                                <span>{b.serviceName}</span>
                                <small style={{ display: 'block', color: 'var(--text-muted)' }}>{b.modeLabel}</small>
                              </td>
                              <td>
                                <span className={`payment-pill ${b.paymentMethod === 'cash' ? 'cash' : 'paid'}`}>
                                  {b.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản VietQR'}
                                </span>
                              </td>
                              <td>
                                <strong style={{ color: '#059669', fontSize: '0.95rem' }}>{formatVnd(amt)}</strong>
                              </td>
                              <td>{b.cashier || 'Lễ tân'}</td>
                              <td>
                                <div className="action-buttons-wrap">
                                  <button
                                    type="button"
                                    className="btn-tbl-action view"
                                    onClick={() => handleOpenDetail(b)}
                                  >
                                    Xem
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-tbl-action bill"
                                    onClick={() => handleOpenReceipt(b)}
                                  >
                                    In Bill
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: CHẤM CÔNG & DOANH THU CỦA TÔI (STAFF PERSONAL VIEW) */}
            {activeTab === 'my_performance' && (
              <div className="admin-tab-content">
                <div className="performance-tab-header">
                  <div className="perf-header-info">
                    <div className="perf-header-badge-row">
                      <span className="staff-role-chip">KỸ THUẬT VIÊN / LỄ TÂN</span>
                      <span className="staff-acc-chip">@{session?.username}</span>
                    </div>
                    <h3>Bảng Chấm Công & Doanh Thu Cá Nhân: {session?.fullName}</h3>
                    <p>Theo dõi ngày công, giờ làm việc thực tế, số lượng đơn khách hàng và doanh thu bạn đem lại cho spa.</p>
                  </div>

                  <div className="perf-header-actions">
                    {!todayMyAttendance ? (
                      <button 
                        type="button" 
                        className="btn-attendance-hero checkin"
                        onClick={() => setIsCheckInModalOpen(true)}
                      >
                        <span className="btn-icon">🟢</span>
                        <span>Chấm Công Vào Ca</span>
                      </button>
                    ) : todayMyAttendance.status === 'working' ? (
                      <div className="hero-working-box">
                        <span className="hero-working-pill">🟢 Đang trong ca từ {todayMyAttendance.checkInTime}</span>
                        <button 
                          type="button" 
                          className="btn-attendance-hero checkout"
                          onClick={handleStaffCheckOut}
                        >
                          <span className="btn-icon">🏁</span>
                          <span>Chấm Công Tan Ca</span>
                        </button>
                      </div>
                    ) : (
                      <div className="hero-completed-box">
                        <span className="hero-done-pill">✓ Đã tan ca ({todayMyAttendance.checkInTime} - {todayMyAttendance.checkOutTime} | {todayMyAttendance.workingHours}h)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* BỘ 4 THẺ CHỈ SỐ DOANH THU & NGÀY CÔNG CÁ NHÂN */}
                <div className="admin-revenue-strip staff-strip">
                  <div className="revenue-stat-card today personal">
                    <span className="rev-card-title">Doanh Thu Của Bạn Hôm Nay</span>
                    <span className="rev-card-amount">{formatVnd(myPerformance?.todayRevenue || 0)}</span>
                    <div className="rev-card-meta">
                      <span><strong>{myPerformance?.todayOrdersCount || 0}</strong> đơn bạn phục vụ hôm nay</span>
                    </div>
                  </div>

                  <div className="revenue-stat-card month personal">
                    <span className="rev-card-title">Doanh Thu Của Bạn Tháng {new Date().getMonth() + 1}</span>
                    <span className="rev-card-amount">{formatVnd(myPerformance?.monthRevenue || 0)}</span>
                    <div className="rev-card-meta">
                      <span><strong>{myPerformance?.monthOrdersCount || 0}</strong> đơn bạn phục vụ trong tháng</span>
                    </div>
                  </div>

                  <div className="revenue-stat-card total personal">
                    <span className="rev-card-title">Tổng Doanh Thu Tích Lũy</span>
                    <span className="rev-card-amount">{formatVnd(myPerformance?.totalRevenue || 0)}</span>
                    <div className="rev-card-meta">
                      <span>Tổng <strong>{myPerformance?.totalOrdersCount || 0}</strong> đơn đã phục vụ</span>
                    </div>
                  </div>

                  <div className="revenue-stat-card hours personal">
                    <span className="rev-card-title">Ngày Công & Giờ Làm Tháng Này</span>
                    <span className="rev-card-amount">{myPerformance?.monthWorkingDays || 0} ngày</span>
                    <div className="rev-card-meta">
                      <span>Tổng <strong>{myPerformance?.monthTotalHours || 0}</strong> giờ làm việc</span>
                    </div>
                  </div>
                </div>

                {/* BẢNG 1: DANH SÁCH ĐƠN HÀNG CÁ NHÂN PHỤC VỤ */}
                <div className="staff-section-card">
                  <div className="staff-section-header">
                    <div>
                      <h4>Đơn Hàng Bạn Đã Phục Vụ ({myPerformance?.allOrders?.length || 0})</h4>
                      <p className="text-muted" style={{ fontSize: '0.82rem' }}>
                        Doanh thu và đơn hàng này được tính vào chỉ số KPI năng suất làm việc của bạn.
                      </p>
                    </div>
                    <div className="revenue-period-selector">
                      <button
                        type="button"
                        className={`rev-period-btn ${staffOrderPeriod === 'today' ? 'active' : ''}`}
                        onClick={() => setStaffOrderPeriod('today')}
                      >
                        Hôm Nay ({myPerformance?.todayOrdersCount || 0})
                      </button>
                      <button
                        type="button"
                        className={`rev-period-btn ${staffOrderPeriod === 'month' ? 'active' : ''}`}
                        onClick={() => setStaffOrderPeriod('month')}
                      >
                        Tháng Này ({myPerformance?.monthOrdersCount || 0})
                      </button>
                      <button
                        type="button"
                        className={`rev-period-btn ${staffOrderPeriod === 'all' ? 'active' : ''}`}
                        onClick={() => setStaffOrderPeriod('all')}
                      >
                        Tất Cả ({myPerformance?.totalOrdersCount || 0})
                      </button>
                    </div>
                  </div>

                  {(() => {
                    const displayedOrders = staffOrderPeriod === 'today' 
                      ? (myPerformance?.todayOrders || [])
                      : (staffOrderPeriod === 'month' ? (myPerformance?.monthOrders || []) : (myPerformance?.allOrders || []));

                    if (displayedOrders.length === 0) {
                      return (
                        <div className="admin-empty-state" style={{ padding: '30px 15px' }}>
                          <p>Chưa có đơn hàng nào trong khoảng thời gian này.</p>
                        </div>
                      );
                    }

                    return (
                      <div className="admin-table-container">
                        <table className="admin-data-table">
                          <thead>
                            <tr>
                              <th>MÃ ĐƠN</th>
                              <th>KHÁCH HÀNG</th>
                              <th>DỊCH VỤ / LIỆU TRÌNH</th>
                              <th>NGÀY HẸN</th>
                              <th>DOANH THU ĐƠN</th>
                              <th>HÌNH THỨC</th>
                              <th>THAO TÁC</th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayedOrders.map(b => (
                              <tr key={b.id}>
                                <td><strong className="order-id-badge">#{b.id}</strong></td>
                                <td>
                                  <strong>{b.fullName}</strong>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.phoneNumber}</div>
                                </td>
                                <td>
                                  <span>{b.serviceName}</span>
                                  <small style={{ display: 'block', color: 'var(--text-muted)' }}>{b.modeLabel}</small>
                                </td>
                                <td>{b.bookingDate} {b.bookingTime}</td>
                                <td><strong style={{ color: '#047857' }}>{formatVnd(b.paidAmount || b.priceDisplay)}</strong></td>
                                <td><span className="payment-pill paid">{b.paymentMethod === 'cash' ? 'Tiền mặt' : 'VietQR'}</span></td>
                                <td>
                                  <div className="action-buttons-wrap">
                                    <button type="button" className="btn-tbl-action view" onClick={() => handleOpenDetail(b)}>
                                      Chi Tiết
                                    </button>
                                    <button type="button" className="btn-tbl-action bill" onClick={() => handleOpenReceipt(b)}>
                                      In Bill
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>

                {/* BẢNG 2: LỊCH SỬ CHẤM CÔNG CÁ NHÂN */}
                <div className="staff-section-card" style={{ marginTop: '24px' }}>
                  <div className="staff-section-header">
                    <div>
                      <h4>Nhật Ký Chấm Công Tháng Này ({myPerformance?.attendanceHistory?.length || 0} ca)</h4>
                      <p className="text-muted" style={{ fontSize: '0.82rem' }}>
                        Tổng hợp các ca làm việc, thời gian vào ca, tan ca và số giờ thực tế được ghi nhận.
                      </p>
                    </div>
                  </div>

                  {(!myPerformance?.attendanceHistory || myPerformance.attendanceHistory.length === 0) ? (
                    <div className="admin-empty-state" style={{ padding: '30px 15px' }}>
                      <p>Chưa có dữ liệu chấm công nào trong tháng.</p>
                    </div>
                  ) : (
                    <div className="admin-table-container">
                      <table className="admin-data-table">
                        <thead>
                          <tr>
                            <th>NGÀY</th>
                            <th>CA LÀM VIỆC</th>
                            <th>GIỜ VÀO</th>
                            <th>GIỜ TAN CA</th>
                            <th>SỐ GIỜ LÀM</th>
                            <th>TRẠNG THÁI</th>
                            <th>GHI CHÚ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myPerformance.attendanceHistory.map(att => (
                            <tr key={att.id}>
                              <td><strong>{att.date}</strong></td>
                              <td>{att.shiftName}</td>
                              <td><span className="time-badge in">{att.checkInTime}</span></td>
                              <td>
                                {att.checkOutTime ? (
                                  <span className="time-badge out">{att.checkOutTime}</span>
                                ) : (
                                  <span className="time-badge active">Đang làm việc</span>
                                )}
                              </td>
                              <td><strong>{att.workingHours ? `${att.workingHours} giờ` : '—'}</strong></td>
                              <td>
                                {att.status === 'completed' ? (
                                  <span className="admin-role-pill staff" style={{ background: '#ECFDF5', color: '#065F46' }}>Hoàn thành</span>
                                ) : att.status === 'working' ? (
                                  <span className="admin-role-pill boss" style={{ background: '#FEF3C7', color: '#92400E' }}>Đang trong ca</span>
                                ) : (
                                  <span className="admin-role-pill" style={{ background: '#F3F4F6', color: '#4B5563' }}>Nghỉ phép</span>
                                )}
                              </td>
                              <td><small className="text-muted">{att.notes || '—'}</small></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: QUẢN LÝ CHẤM CÔNG & HIỆU SUẤT TẤT CẢ NHÂN VIÊN (BOSS ONLY) */}
            {activeTab === 'attendance' && isBoss && (
              <div className="admin-tab-content">
                <div className="revenue-tab-header">
                  <div>
                    <h3>Quản Lý Chấm Công & Hiệu Suất Từng Nhân Viên</h3>
                    <p>Bảng xếp hạng doanh thu, số lượng đơn phục vụ và nhật ký thời gian chấm công của tất cả nhân viên trong spa.</p>
                  </div>
                  <div className="revenue-header-actions">
                    <button
                      type="button"
                      className="btn-primary-gold"
                      onClick={() => handleAdminOpenAttendanceModal(null)}
                    >
                      + Chấm Công Bổ Sung / Điều Chỉnh
                    </button>
                  </div>
                </div>

                {/* THẺ TỔNG QUAN TÌNH TRẠNG CA HÔM NAY */}
                {(() => {
                  const allStaff = allStaffPerformance?.staffList || [];
                  const workingNow = allStaff.filter(s => s.todayAttendance?.status === 'working').length;
                  const completedToday = allStaff.filter(s => s.todayAttendance?.status === 'completed').length;
                  const notInShift = allStaff.filter(s => !s.todayAttendance).length;
                  const todaySpaStaffRev = allStaff.reduce((sum, s) => sum + s.todayRevenue, 0);

                  return (
                    <div className="admin-revenue-strip staff-overview-strip">
                      <div className="revenue-stat-card working">
                        <span className="rev-card-title">Đang Trong Ca Hôm Nay</span>
                        <span className="rev-card-amount">{workingNow} nhân viên</span>
                        <div className="rev-card-meta">
                          <span>Đang phục vụ khách tại quầy & phòng</span>
                        </div>
                      </div>

                      <div className="revenue-stat-card completed">
                        <span className="rev-card-title">Đã Tan Ca Hôm Nay</span>
                        <span className="rev-card-amount">{completedToday} nhân viên</span>
                        <div className="rev-card-meta">
                          <span>Đã hoàn thành ca làm việc</span>
                        </div>
                      </div>

                      <div className="revenue-stat-card off">
                        <span className="rev-card-title">Chưa Vào Ca Hôm Nay</span>
                        <span className="rev-card-amount">{notInShift} nhân viên</span>
                        <div className="rev-card-meta">
                          <span>Chưa điểm danh vào ca</span>
                        </div>
                      </div>

                      <div className="revenue-stat-card today">
                        <span className="rev-card-title">Doanh Thu NV Hôm Nay</span>
                        <span className="rev-card-amount">{formatVnd(todaySpaStaffRev)}</span>
                        <div className="rev-card-meta">
                          <span>Tổng thu từ đơn do NV phục vụ</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* BẢNG 1: BẢNG XẾP HẠNG DOANH THU & CHẤM CÔNG TỪNG NHÂN VIÊN */}
                <div className="staff-section-card">
                  <div className="staff-section-header">
                    <div>
                      <h4>Bảng Xếp Hạng & Hiệu Suất Nhân Viên Tháng {new Date().getMonth() + 1}</h4>
                      <p className="text-muted" style={{ fontSize: '0.82rem' }}>
                        Doanh thu và số đơn riêng của từng nhân viên được phân chia minh bạch và chỉ Sếp mới xem được toàn bộ.
                      </p>
                    </div>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>NHÂN VIÊN</th>
                          <th>TRẠNG THÁI HÔM NAY</th>
                          <th>ĐƠN HÔM NAY</th>
                          <th>DOANH THU HÔM NAY</th>
                          <th>ĐƠN THÁNG NÀY</th>
                          <th>DOANH THU THÁNG NÀY</th>
                          <th>CÔNG THÁNG</th>
                          <th>TỔNG GIỜ</th>
                          <th>THAO TÁC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(allStaffPerformance?.staffList || []).map((st) => {
                          const isSelected = bossInspectingStaff === st.username;
                          const att = st.todayAttendance;
                          return (
                            <tr key={st.username} className={isSelected ? 'selected-staff-row' : ''}>
                              <td>
                                <strong>{st.fullName}</strong>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                  @{st.username} • {st.role === 'boss' ? 'Sếp' : 'Nhân viên'}
                                </div>
                              </td>
                              <td>
                                {att?.status === 'working' ? (
                                  <span className="status-working-pill">🟢 Đang làm ({att.checkInTime})</span>
                                ) : att?.status === 'completed' ? (
                                  <span className="status-done-pill">✓ Đã tan ca ({att.workingHours}h)</span>
                                ) : (
                                  <span className="status-off-pill">⚪ Chưa vào ca</span>
                                )}
                              </td>
                              <td><strong>{st.todayOrdersCount}</strong></td>
                              <td><strong style={{ color: '#047857' }}>{formatVnd(st.todayRevenue)}</strong></td>
                              <td><strong>{st.monthOrdersCount}</strong></td>
                              <td><strong style={{ color: 'var(--primary-gold-dark)' }}>{formatVnd(st.monthRevenue)}</strong></td>
                              <td>{st.monthWorkingDays} ngày</td>
                              <td>{st.monthTotalHours}h</td>
                              <td>
                                <button
                                  type="button"
                                  className={`btn-tbl-action ${isSelected ? 'bill' : 'view'}`}
                                  onClick={() => setBossInspectingStaff(isSelected ? null : st.username)}
                                >
                                  {isSelected ? 'Đóng Đơn' : 'Xem Đơn NV'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* NẾU SẾP ĐANG CHỌN XEM ĐƠN CỦA 1 NHÂN VIÊN CỤ THỂ */}
                {bossInspectingStaff && (
                  <div className="staff-section-card inspecting-orders-card" style={{ marginTop: '20px' }}>
                    {(() => {
                      const inspectedStaff = (allStaffPerformance?.staffList || []).find(s => s.username === bossInspectingStaff);
                      const orders = inspectedStaff?.allOrders || [];
                      return (
                        <>
                          <div className="staff-section-header">
                            <div>
                              <h4>Chi Tiết Đơn Hàng Do Nhân Viên: {inspectedStaff?.fullName} (@{bossInspectingStaff}) Phục Vụ</h4>
                              <p className="text-muted" style={{ fontSize: '0.82rem' }}>
                                Tổng cộng: {orders.length} đơn • Doanh thu tích lũy: {formatVnd(inspectedStaff?.totalRevenue || 0)}
                              </p>
                            </div>
                            <button type="button" className="btn-outline-gold" onClick={() => setBossInspectingStaff(null)}>
                              ✕ Đóng Chi Tiết
                            </button>
                          </div>

                          {orders.length === 0 ? (
                            <div className="admin-empty-state" style={{ padding: '24px' }}>
                              <p>Nhân viên này chưa phụ trách đơn hàng nào.</p>
                            </div>
                          ) : (
                            <div className="admin-table-container">
                              <table className="admin-data-table">
                                <thead>
                                  <tr>
                                    <th>MÃ ĐƠN</th>
                                    <th>KHÁCH HÀNG</th>
                                    <th>DỊCH VỤ</th>
                                    <th>NGÀY HẸN</th>
                                    <th>DOANH THU</th>
                                    <th>HÌNH THỨC</th>
                                    <th>THAO TÁC</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {orders.map(b => (
                                    <tr key={b.id}>
                                      <td><strong>#{b.id}</strong></td>
                                      <td>{b.fullName} ({b.phoneNumber})</td>
                                      <td>{b.serviceName}</td>
                                      <td>{b.bookingDate} {b.bookingTime}</td>
                                      <td><strong style={{ color: '#047857' }}>{formatVnd(b.paidAmount || b.priceDisplay)}</strong></td>
                                      <td>{b.paymentMethod === 'cash' ? 'Tiền mặt' : 'VietQR'}</td>
                                      <td>
                                        <button type="button" className="btn-tbl-action view" onClick={() => handleOpenDetail(b)}>
                                          Xem
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* BẢNG 2: NHẬT KÝ CHẤM CÔNG TOÀN BỘ CƠ SỞ */}
                <div className="staff-section-card" style={{ marginTop: '24px' }}>
                  <div className="staff-section-header">
                    <div>
                      <h4>Nhật Ký Chấm Công Toàn Cơ Sở ({attendanceList.length} lượt)</h4>
                      <p className="text-muted" style={{ fontSize: '0.82rem' }}>
                        Chi tiết giờ vào ca, tan ca và số giờ làm việc thực tế của từng nhân viên.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select 
                        value={attendanceFilterStaff} 
                        onChange={(e) => setAttendanceFilterStaff(e.target.value)}
                        className="staff-filter-select"
                      >
                        <option value="all">Tất cả nhân viên</option>
                        {staffAccounts.map(a => (
                          <option key={a.username} value={a.username}>{a.fullName} (@{a.username})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>NHÂN VIÊN</th>
                          <th>NGÀY</th>
                          <th>CA LÀM VIỆC</th>
                          <th>GIỜ VÀO</th>
                          <th>GIỜ RA</th>
                          <th>SỐ GIỜ</th>
                          <th>TRẠNG THÁI</th>
                          <th>GHI CHÚ</th>
                          <th>THAO TÁC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceList
                          .filter(a => attendanceFilterStaff === 'all' || a.username === attendanceFilterStaff)
                          .map((att) => (
                            <tr key={att.id}>
                              <td>
                                <strong>{att.staffName}</strong>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>@{att.username}</div>
                              </td>
                              <td><strong>{att.date}</strong></td>
                              <td>{att.shiftName}</td>
                              <td><span className="time-badge in">{att.checkInTime}</span></td>
                              <td>
                                {att.checkOutTime ? (
                                  <span className="time-badge out">{att.checkOutTime}</span>
                                ) : (
                                  <span className="time-badge active">Đang làm việc</span>
                                )}
                              </td>
                              <td><strong>{att.workingHours ? `${att.workingHours}h` : '—'}</strong></td>
                              <td>
                                {att.status === 'completed' ? (
                                  <span className="status-done-pill">Hoàn thành</span>
                                ) : att.status === 'working' ? (
                                  <span className="status-working-pill">Đang trong ca</span>
                                ) : (
                                  <span className="status-off-pill">Nghỉ phép</span>
                                )}
                              </td>
                              <td><small className="text-muted">{att.notes || '—'}</small></td>
                              <td>
                                <button
                                  type="button"
                                  className="btn-tbl-action edit"
                                  onClick={() => handleAdminOpenAttendanceModal(att)}
                                  title="Sếp chỉnh sửa bản ghi chấm công này"
                                >
                                  Sửa
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: BANK & QR CONFIGURATION (BOSS EDITABLE ONLY) */}
            {activeTab === 'bank' && (
              <div className="admin-tab-content">
                <div className="bank-config-wrap">
                  <div className="bank-form-card">
                    <h3>Cấu Hình Tài Khoản Ngân Hàng & VietQR</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      Thông tin này dùng để tự động tạo mã QR chuyển khoản cho khách hàng khi thu tiền tại quầy.
                    </p>

                    {!isBoss && (
                      <div className="role-notice-banner banner-staff" style={{ marginBottom: '16px' }}>
                        <strong>Chỉ Quản lý (Sếp admin) mới có quyền chỉnh sửa số tài khoản ngân hàng!</strong>
                        <p style={{ marginTop: '2px' }}>Nhân viên chỉ có quyền xem thông tin để thu ngân và in hóa đơn.</p>
                      </div>
                    )}

                    <form onSubmit={handleSaveBankConfig}>
                      <div className="form-group" style={{ marginBottom: '14px' }}>
                        <label>Ngân Hàng Thụ Hưởng (VietQR):</label>
                        <select
                          value={bankConfig.bankId}
                          onChange={(e) => {
                            const b = POPULAR_BANKS.find(x => x.id === e.target.value);
                            setBankConfig(prev => ({
                              ...prev,
                              bankId: e.target.value,
                              bankName: b ? b.name : e.target.value
                            }));
                          }}
                          disabled={!isBoss}
                        >
                          {POPULAR_BANKS.map((b) => (
                            <option key={b.id} value={b.id}>
                              [{b.id}] {b.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group" style={{ marginBottom: '14px' }}>
                        <label>Số Tài Khoản Ngân Hàng <span className="req">*</span></label>
                        <input
                          type="text"
                          value={bankConfig.accountNumber}
                          onChange={(e) => setBankConfig({ ...bankConfig, accountNumber: e.target.value })}
                          placeholder="Ví dụ: 0703994683..."
                          disabled={!isBoss}
                          required
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '14px' }}>
                        <label>Tên Chủ Tài Khoản (In hoa không dấu) <span className="req">*</span></label>
                        <input
                          type="text"
                          value={bankConfig.accountName}
                          onChange={(e) => setBankConfig({ ...bankConfig, accountName: e.target.value.toUpperCase() })}
                          placeholder="Ví dụ: FORHER BEAUTY SPA..."
                          disabled={!isBoss}
                          required
                        />
                      </div>

                      {bankConfigMsg && (
                        <div style={{ padding: '8px 12px', borderRadius: '6px', background: '#ECFDF5', color: '#065F46', marginBottom: '14px', fontSize: '0.85rem' }}>
                          {bankConfigMsg}
                        </div>
                      )}

                      {isBoss && (
                        <button type="submit" className="btn-primary-gold" disabled={isSavingBank}>
                          {isSavingBank ? 'Đang Lưu...' : 'Lưu Thay Đổi Cài Đặt Ngân Hàng'}
                        </button>
                      )}
                    </form>
                  </div>

                  <div className="bank-preview-card">
                    <h4>Mã VietQR Mẫu</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Mã QR chuẩn Napas 24/7 tự động liên kết tài khoản ngân hàng của bạn.
                    </p>

                    <div className="bank-preview-qr">
                      <img 
                        src={generateVietQrUrl(bankConfig.bankId, bankConfig.accountNumber, 500000, 'TEST', bankConfig.accountName)} 
                        alt="Mã VietQR Mẫu"
                      />
                    </div>

                    <div style={{ fontSize: '0.8rem', textAlign: 'left', width: '100%', lineHeight: '1.5' }}>
                      <p><strong>Ngân hàng:</strong> {bankConfig.bankName}</p>
                      <p><strong>Số TK:</strong> {bankConfig.accountNumber}</p>
                      <p><strong>Chủ TK:</strong> {bankConfig.accountName}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: STAFF MANAGEMENT (BOSS ONLY) */}
            {activeTab === 'staff' && isBoss && (
              <div className="admin-tab-content">
                <div className="staff-tab-header">
                  <div>
                    <h3>Danh Sách Tài Khoản Nhân Viên & Phân Quyền</h3>
                    <p>Sếp có toàn quyền tự tạo tài khoản riêng, đổi mật khẩu và quản lý nhân viên của cơ sở.</p>
                  </div>
                  <button 
                    type="button" 
                    className="btn-primary-gold"
                    onClick={() => { setStaffFormError(''); setIsStaffModalOpen(true); }}
                  >
                    + Tạo Tài Khoản Nhân Viên
                  </button>
                </div>

                <div className="admin-table-container">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>TÊN ĐĂNG NHẬP</th>
                        <th>HỌ VÀ TÊN</th>
                        <th>VAI TRÒ</th>
                        <th>MẬT KHẨU</th>
                        <th>NGÀY TẠO</th>
                        <th>THAO TÁC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffAccounts.map((acc) => {
                        const isMainAdmin = acc.username === 'admin';
                        return (
                          <tr key={acc.username}>
                            <td>
                              <strong className="staff-username-txt">@{acc.username}</strong>
                            </td>
                            <td>
                              <span>{acc.fullName}</span>
                            </td>
                            <td>
                              {acc.role === 'boss' ? (
                                <span className="admin-role-pill boss">SẾP (QUẢN LÝ)</span>
                              ) : (
                                <span className="admin-role-pill staff">NHÂN VIÊN</span>
                              )}
                            </td>
                            <td>
                              <span className="staff-pwd-preview">•••••••</span>
                            </td>
                            <td>
                              <small>{new Date(acc.createdAt).toLocaleDateString('vi-VN')}</small>
                            </td>
                            <td>
                              {isMainAdmin ? (
                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Tài khoản chủ cơ sở</span>
                              ) : (
                                <div className="action-buttons-wrap">
                                  <button
                                    type="button"
                                    className="btn-tbl-action edit"
                                    onClick={async () => {
                                      const newP = prompt(`Nhập mật khẩu mới cho nhân viên @${acc.username}:`);
                                      if (newP && newP.length >= 6) {
                                        await BookingStorage.updateAccount(acc.username, { password: newP.trim() });
                                        alert('Đổi mật khẩu nhân viên thành công!');
                                        refreshData();
                                      } else if (newP) {
                                        alert('Mật khẩu phải từ 6 ký tự trở lên!');
                                      }
                                    }}
                                  >
                                    Đổi Mật Khẩu
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-tbl-action delete"
                                    onClick={() => handleDeleteStaff(acc.username)}
                                  >
                                    Xóa
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT 5: AUDIT LOGS */}
            {activeTab === 'logs' && (
              <div className="admin-tab-content">
                <div className="audit-logs-header">
                  <div>
                    <h3>Nhật Ký Thao Tác (Audit Log)</h3>
                    <p>Hệ thống tự động ghi nhận lại chi tiết ai (Sếp admin, từng Nhân viên cụ thể, Khách web) đã tạo, thanh toán, sửa hoặc xóa đơn.</p>
                  </div>
                  {isBoss && (
                    <button 
                      type="button" 
                      className="btn-outline-gold"
                      onClick={() => {
                        if (window.confirm('Bạn có chắc chắn muốn làm trống lịch sử audit log?')) {
                          BookingStorage.clearAuditLogs();
                          refreshData();
                        }
                      }}
                    >
                      Làm Trống Lịch Sử (Quyền Sếp)
                    </button>
                  )}
                </div>

                <div className="audit-timeline">
                  {logs.length === 0 ? (
                    <div className="admin-empty-state">
                      <p>Chưa có bản ghi nhật ký nào.</p>
                    </div>
                  ) : (
                    logs.map((log) => {
                      const logDate = new Date(log.timestamp).toLocaleString('vi-VN');
                      return (
                        <div key={log.id} className={`log-item-card action-${log.action}`}>
                          <div className="log-badge-col">
                            <span className={`log-badge ${log.action}`}>
                              {log.action}
                            </span>
                            <span className="log-time">{logDate}</span>
                          </div>
                          <div className="log-details-col">
                            <div className="log-header-line">
                              <h4 className="log-title">{log.actionTitle}</h4>
                              <span className={`actor-tag role-${log.actorRole || 'system'}`}>
                                {log.actor || 'Hệ thống'}
                              </span>
                            </div>
                            <p className="log-desc">{log.details}</p>
                            {log.orderId && (
                              <span className="log-order-ref">Mã đơn: #{log.orderId}</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT 6: EXPORT & DATA */}
            {activeTab === 'backup' && (
              <div className="admin-tab-content">
                <div className="backup-sections-grid">
                  <div className="backup-card">
                    <h4>Xuất Danh Sách Ra Excel / CSV</h4>
                    <p>Tải toàn bộ danh sách đơn đặt lịch và doanh thu về máy vi tính dạng file CSV mở bằng Excel.</p>
                    <button type="button" className="btn-primary-gold" onClick={handleExportCsv}>
                      Tải File CSV Xuống
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==============================================================================
            MODAL 1: XEM CHI TIẾT ĐƠN (VIEW DETAIL MODAL)
            ============================================================================== */}
        {isDetailModalOpen && viewingBooking && (
          <div className="admin-submodal-backdrop">
            <div className="admin-submodal-card admin-detail-card">
              <div className="admin-submodal-header">
                <h3>Chi Tiết Đơn Đặt Lịch #{viewingBooking.id}</h3>
                <button type="button" className="btn-close-submodal" onClick={() => setIsDetailModalOpen(false)}>
                  ✕
                </button>
              </div>

              <div className="detail-body-scroll">
                {/* Status bar */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className={`status-select-badge ${viewingBooking.status}`}>
                    Trạng thái: {viewingBooking.status === 'confirmed' ? 'Đã xác nhận' : (viewingBooking.status === 'completed' ? 'Đã hoàn thành' : (viewingBooking.status === 'cancelled' ? 'Đã hủy' : 'Chờ xác nhận'))}
                  </span>
                  <span className={`payment-pill ${viewingBooking.isPaid || viewingBooking.status === 'completed' ? 'paid' : 'unpaid'}`}>
                    {viewingBooking.isPaid || viewingBooking.status === 'completed' 
                      ? `Đã thanh toán: ${formatVnd(viewingBooking.paidAmount || viewingBooking.priceDisplay)} (${viewingBooking.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản QR'})`
                      : 'Chưa thanh toán'}
                  </span>
                </div>

                {/* Section 1: Customer */}
                <div className="detail-section-block">
                  <div className="detail-section-header">Thông Tin Khách Hàng</div>
                  <div className="detail-grid-two">
                    <div className="detail-item">
                      <span className="lbl">Họ và tên:</span>
                      <span className="val">{viewingBooking.fullName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="lbl">Số điện thoại:</span>
                      <span className="val">
                        <a href={`tel:${viewingBooking.phoneNumber}`} style={{ color: 'var(--primary-gold-dark)', textDecoration: 'underline' }}>
                          {viewingBooking.phoneNumber}
                        </a>
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="lbl">Ngày hẹn:</span>
                      <span className="val">{viewingBooking.bookingDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="lbl">Giờ hẹn:</span>
                      <span className="val">{viewingBooking.bookingTime}</span>
                    </div>
                    <div className="detail-item">
                      <span className="lbl">Người tạo đơn:</span>
                      <span className="val">{viewingBooking.createdBy || 'Khách web'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="lbl">Thời gian tạo:</span>
                      <span className="val">{new Date(viewingBooking.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Service */}
                <div className="detail-section-block">
                  <div className="detail-section-header">Dịch Vụ & Liệu Trình</div>
                  <div className="detail-grid-two">
                    <div className="detail-item">
                      <span className="lbl">Dịch vụ:</span>
                      <span className="val highlight">{viewingBooking.serviceName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="lbl">Danh mục:</span>
                      <span className="val">{viewingBooking.categoryName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="lbl">Gói liệu trình:</span>
                      <span className="val">{viewingBooking.modeLabel}</span>
                    </div>
                    <div className="detail-item">
                      <span className="lbl">Giá niêm yết:</span>
                      <span className="val highlight">{viewingBooking.priceDisplay}</span>
                    </div>
                    <div className="detail-item">
                      <span className="lbl">Nhân viên thực hiện:</span>
                      <span className="val highlight">{viewingBooking.assignedStaffName || viewingBooking.cashier || 'Chưa phân công'}</span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Notes */}
                <div className="detail-section-block">
                  <div className="detail-section-header">Ghi Chú Khách & Nội Bộ</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="detail-item">
                      <span className="lbl">Tình trạng da của khách:</span>
                      <p style={{ margin: 0, fontSize: '0.85rem' }}>{viewingBooking.skinNotes || 'Không có ghi chú'}</p>
                    </div>
                    <div className="detail-item">
                      <span className="lbl">Ghi chú nội bộ spa:</span>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#1E40AF' }}>{viewingBooking.adminNotes || 'Không có ghi chú'}</p>
                    </div>
                  </div>
                </div>

                {/* Section 4: Payment info */}
                <div className="detail-section-block">
                  <div className="detail-section-header">Thông Tin Thanh Toán</div>
                  <div className="detail-grid-two">
                    <div className="detail-item">
                      <span className="lbl">Số tiền thực thu:</span>
                      <span className="val highlight">
                        {viewingBooking.isPaid || viewingBooking.status === 'completed'
                          ? formatVnd(viewingBooking.paidAmount || viewingBooking.priceDisplay)
                          : '0đ (Chưa thu)'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="lbl">Hình thức:</span>
                      <span className="val">
                        {viewingBooking.paymentMethod === 'cash' ? 'Tiền mặt' : (viewingBooking.paymentMethod === 'transfer' ? 'Chuyển khoản VietQR' : '—')}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="lbl">Thu ngân phụ trách:</span>
                      <span className="val">{viewingBooking.cashier || '—'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="lbl">Thời gian thanh toán:</span>
                      <span className="val">{viewingBooking.paidAt ? new Date(viewingBooking.paidAt).toLocaleString('vi-VN') : '—'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-actions-footer">
                {!viewingBooking.isPaid && viewingBooking.status !== 'completed' ? (
                  <button 
                    type="button" 
                    className="btn-primary-gold"
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleOpenCheckout(viewingBooking);
                    }}
                  >
                    Tính Tiền & Thanh Toán (QR / Tiền Mặt)
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="btn-tbl-action bill"
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleOpenReceipt(viewingBooking);
                    }}
                  >
                    In Phiếu Thu / Hóa Đơn
                  </button>
                )}

                <button 
                  type="button" 
                  className="btn-tbl-action edit"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenEditModal(viewingBooking);
                  }}
                >
                  Sửa Đơn
                </button>

                <button 
                  type="button" 
                  className="btn-outline-gold"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================================
            MODAL 2: TÍNH TIỀN & THANH TOÁN (VIETQR / TIỀN MẶT)
            ============================================================================== */}
        {isCheckoutModalOpen && checkoutBooking && (
          <div className="admin-submodal-backdrop" onClick={() => setIsCheckoutModalOpen(false)}>
            <div className="admin-submodal-card admin-checkout-card" onClick={(e) => e.stopPropagation()}>
              <div className="checkout-modal-header">
                <div className="checkout-header-title-box">
                  <span className="checkout-modal-title">Thanh Toán Đơn Hàng</span>
                  <span className="checkout-order-pill">#{checkoutBooking.id}</span>
                </div>
                <button type="button" className="btn-close-submodal" onClick={() => setIsCheckoutModalOpen(false)}>
                  ✕
                </button>
              </div>

              <div className="checkout-body-scroll">
                {/* Clean Customer & Service Banner */}
                <div className="checkout-customer-banner">
                  <div className="customer-info-left">
                    <strong className="customer-name">{checkoutBooking.fullName}</strong>
                    <span className="customer-service">{checkoutBooking.serviceName} • {checkoutBooking.modeLabel}</span>
                  </div>
                  <div className="customer-amount-right">
                    <span className="amount-label">CẦN THANH TOÁN</span>
                    <strong className="amount-number">{formatVnd(finalCheckoutAmount)}</strong>
                  </div>
                </div>

                {/* Optional Discounts & Adjustments Toggle */}
                <div className="checkout-adjust-toggle-wrap">
                  <button
                    type="button"
                    className="btn-toggle-adjustments"
                    onClick={() => setShowAdjustments(!showAdjustments)}
                  >
                    {showAdjustments ? '▲ Thu gọn điều chỉnh giá' : '⚙ Điều chỉnh giá / Voucher / Phụ thu'}
                  </button>

                  {showAdjustments && (
                    <div className="checkout-calc-grid">
                      <div className="checkout-calc-item">
                        <label>Đơn Giá Gốc (VNĐ):</label>
                        <input
                          type="number"
                          value={customPaidAmount}
                          onChange={(e) => setCustomPaidAmount(Number(e.target.value))}
                        />
                      </div>
                      <div className="checkout-calc-item">
                        <label>Giảm Giá / Voucher (VNĐ):</label>
                        <input
                          type="number"
                          value={discountAmount}
                          onChange={(e) => setDiscountAmount(Number(e.target.value))}
                        />
                      </div>
                      <div className="checkout-calc-item">
                        <label>Phụ Thu Thêm (VNĐ):</label>
                        <input
                          type="number"
                          value={surchargeAmount}
                          onChange={(e) => setSurchargeAmount(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Method Selector */}
                <div className="checkout-method-section">
                  <div className="payment-method-tabs">
                    <button
                      type="button"
                      className={`pm-tab-btn ${paymentMethod === 'transfer' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('transfer')}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                      <span>Chuyển Khoản Mã QR</span>
                    </button>
                    <button
                      type="button"
                      className={`pm-tab-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('cash')}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                        <circle cx="12" cy="12" r="2"></circle>
                        <path d="M6 12h.01M18 12h.01"></path>
                      </svg>
                      <span>Tiền Mặt Tại Quầy</span>
                    </button>
                  </div>
                </div>

                {/* Tab: VietQR - MÃ QR SIÊU TO & RÕ RÀNG */}
                {paymentMethod === 'transfer' && (
                  <div className="vietqr-card">
                    <div className="vietqr-instruction">
                      Khách quét mã bên dưới để thanh toán tự động:
                    </div>

                    <div
                      className="vietqr-img-frame clickable-qr-zoom"
                      onClick={() => setIsQrZoomOpen(true)}
                      title="Nhấn vào mã QR để phóng to toàn màn hình"
                    >
                      <img
                        src={generateVietQrUrl(
                          bankConfig.bankId,
                          bankConfig.accountNumber,
                          finalCheckoutAmount,
                          checkoutBooking.id,
                          bankConfig.accountName
                        )}
                        alt="Mã VietQR Thanh Toán"
                      />
                    </div>

                    <button
                      type="button"
                      className="btn-trigger-qr-zoom"
                      onClick={() => setIsQrZoomOpen(true)}
                      title="Phóng to mã QR toàn màn hình"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                      <span>Bấm vào ảnh để phóng to mã QR</span>
                    </button>

                    <div className="vietqr-meta-box">
                      <div className="vietqr-info-row">
                        <span className="lbl">Số tài khoản:</span>
                        <span className="val highlight">
                          {bankConfig.accountNumber}
                          <button
                            type="button"
                            className="btn-mini-copy"
                            onClick={() => handleCopyText(bankConfig.accountNumber, 'Số tài khoản')}
                          >
                            Sao chép
                          </button>
                        </span>
                      </div>
                      <div className="vietqr-info-row">
                        <span className="lbl">Ngân hàng:</span>
                        <span className="val">{bankConfig.bankName}</span>
                      </div>
                      <div className="vietqr-info-row">
                        <span className="lbl">Chủ tài khoản:</span>
                        <span className="val uppercase">{bankConfig.accountName}</span>
                      </div>
                      <div className="vietqr-info-row">
                        <span className="lbl">Số tiền:</span>
                        <span className="val amount">
                          {formatVnd(finalCheckoutAmount)}
                        </span>
                      </div>
                      <div className="vietqr-info-row">
                        <span className="lbl">Nội dung CK:</span>
                        <span className="val memo">
                          FORHER {checkoutBooking.id}
                          <button
                            type="button"
                            className="btn-mini-copy"
                            onClick={() => handleCopyText(`FORHER ${checkoutBooking.id}`, 'Nội dung')}
                          >
                            Sao chép
                          </button>
                        </span>
                      </div>
                      {copyQrSuccess && (
                        <div className="copy-toast-success">
                          ✓ Đã sao chép {copyQrSuccess} vào bộ nhớ tạm!
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab: Cash */}
                {paymentMethod === 'cash' && (
                  <div className="cash-box">
                    <div className="form-group">
                      <label>Tiền Khách Đưa (VNĐ):</label>
                      <input
                        type="number"
                        value={cashGiven}
                        onChange={(e) => setCashGiven(Number(e.target.value))}
                        className="cash-input"
                      />
                    </div>
                    <div className="cash-change-display">
                      <span>Tiền Thừa Trả Lại Khách:</span>
                      <strong>{formatVnd(cashChange)}</strong>
                    </div>
                  </div>
                )}

                {/* Payment note */}
                <div className="checkout-note-group">
                  <input
                    type="text"
                    placeholder="Ghi chú thu ngân (tùy chọn)..."
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    className="checkout-note-input"
                  />
                </div>
              </div>

              {/* Gọn gàng 2 nút thao tác chính, không che nội dung */}
              <div className="checkout-modal-footer">
                <button
                  type="button"
                  className="btn-checkout-confirm"
                  onClick={() => handleConfirmPayment(false)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Xác Nhận Đã Thu</span>
                </button>
                <button
                  type="button"
                  className="btn-checkout-print"
                  onClick={() => handleConfirmPayment(true)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                  <span>Thu & In Bill</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================================
            MODAL 2.1: PHÓNG TO MÃ VIETQR TOÀN MÀN HÌNH (LIGHTBOX ZOOM)
            ============================================================================== */}
        {isQrZoomOpen && checkoutBooking && (
          <div className="qr-zoom-backdrop" onClick={() => setIsQrZoomOpen(false)}>
            <div className="qr-zoom-card" onClick={(e) => e.stopPropagation()}>
              <div className="qr-zoom-header">
                <div className="qr-zoom-title-box">
                  <span className="qr-zoom-pill">VIETQR</span>
                  <span className="qr-zoom-order-id">#{checkoutBooking.id}</span>
                  <strong className="qr-zoom-amount">{formatVnd(finalCheckoutAmount)}</strong>
                </div>
                <button
                  type="button"
                  className="btn-close-qr-zoom"
                  onClick={() => setIsQrZoomOpen(false)}
                  title="Đóng phóng to"
                >
                  ✕ Đóng
                </button>
              </div>

              <div className="qr-zoom-img-container" onClick={() => setIsQrZoomOpen(false)} title="Chạm ảnh để thu nhỏ">
                <img
                  src={generateVietQrUrl(
                    bankConfig.bankId,
                    bankConfig.accountNumber,
                    finalCheckoutAmount,
                    checkoutBooking.id,
                    bankConfig.accountName
                  )}
                  alt="Mã VietQR Phóng To"
                  className="qr-zoom-img"
                />
                <div className="qr-zoom-dismiss-hint">
                  🔍 Chạm vào ảnh hoặc nút Đóng để thu nhỏ lại
                </div>
              </div>

              <div className="qr-zoom-footer-meta">
                <div className="zoom-meta-item">
                  <div className="zoom-meta-left">
                    <span className="lbl">Số tài khoản:</span>
                    <span className="val highlight">{bankConfig.accountNumber}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-mini-copy"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyText(bankConfig.accountNumber, 'Số tài khoản');
                    }}
                  >
                    Sao chép
                  </button>
                </div>
                <div className="zoom-meta-item">
                  <div className="zoom-meta-left">
                    <span className="lbl">Nội dung CK:</span>
                    <span className="val memo">FORHER {checkoutBooking.id}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-mini-copy"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyText(`FORHER ${checkoutBooking.id}`, 'Nội dung');
                    }}
                  >
                    Sao chép
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================================
            MODAL 3: IN PHIẾU THU / HÓA ĐƠN POS RECEIPT
            ============================================================================== */}
        {isReceiptModalOpen && receiptBooking && (
          <div className="admin-submodal-backdrop">
            <div className="admin-submodal-card receipt-submodal-card">
              <div className="admin-submodal-header">
                <h3>Phiếu Thu / Hóa Đơn Dịch Vụ</h3>
                <button type="button" className="btn-close-submodal" onClick={() => setIsReceiptModalOpen(false)}>
                  ✕
                </button>
              </div>

              {/* Printable POS Receipt */}
              <div className="forher-pos-receipt">
                <div className="receipt-header">
                  <h3>{COMPANY_INFO.brandTitle.toUpperCase()}</h3>
                  <p>{COMPANY_INFO.address}</p>
                  <p>Hotline / Zalo: {COMPANY_INFO.phone}</p>
                  <h4 style={{ margin: '8px 0 2px 0', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                    HÓA ĐƠN THANH TOÁN DỊCH VỤ
                  </h4>
                </div>

                <div className="receipt-meta-grid">
                  <div className="receipt-meta-row">
                    <span>Mã hóa đơn:</span>
                    <strong>#{receiptBooking.id}</strong>
                  </div>
                  <div className="receipt-meta-row">
                    <span>Thời gian in:</span>
                    <span>{new Date().toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="receipt-meta-row">
                    <span>Khách hàng:</span>
                    <strong>{receiptBooking.fullName}</strong>
                  </div>
                  <div className="receipt-meta-row">
                    <span>Số điện thoại:</span>
                    <span>{receiptBooking.phoneNumber}</span>
                  </div>
                  <div className="receipt-meta-row">
                    <span>Thu ngân:</span>
                    <span>{receiptBooking.cashier || session?.fullName || 'Lễ tân FORHER'}</span>
                  </div>
                  {receiptBooking.assignedStaffName && (
                    <div className="receipt-meta-row">
                      <span>Kỹ thuật viên:</span>
                      <strong>{receiptBooking.assignedStaffName}</strong>
                    </div>
                  )}
                </div>

                <div className="receipt-item-box">
                  <div className="receipt-item-row">
                    <span>{receiptBooking.serviceName}</span>
                    <span>{formatVnd(receiptBooking.paidAmount || receiptBooking.priceDisplay)}</span>
                  </div>
                  <div className="receipt-item-desc">
                    Gói: {receiptBooking.modeLabel}
                  </div>
                </div>

                <div className="receipt-totals-box">
                  <div className="receipt-total-row">
                    <span>Đơn giá niêm yết:</span>
                    <span>{receiptBooking.priceDisplay}</span>
                  </div>
                  {Number(receiptBooking.discountAmount) > 0 && (
                    <div className="receipt-total-row">
                      <span>Giảm giá:</span>
                      <span>-{formatVnd(receiptBooking.discountAmount)}</span>
                    </div>
                  )}
                  {Number(receiptBooking.surchargeAmount) > 0 && (
                    <div className="receipt-total-row">
                      <span>Phụ thu:</span>
                      <span>+{formatVnd(receiptBooking.surchargeAmount)}</span>
                    </div>
                  )}
                  <div className="receipt-total-row final">
                    <span>TỔNG THANH TOÁN:</span>
                    <span>{formatVnd(receiptBooking.paidAmount || receiptBooking.priceDisplay)}</span>
                  </div>
                  <div className="receipt-total-row">
                    <span>Hình thức:</span>
                    <strong>{receiptBooking.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản (VietQR)'}</strong>
                  </div>
                </div>

                <div className="receipt-footer">
                  <p>Cam kết bảo hành 2 năm bằng văn bản cho dịch vụ triệt lông.</p>
                  <p>Cảm ơn Quý khách & Hẹn gặp lại tại FORHER Beauty & Spa!</p>
                </div>
              </div>

              <div className="receipt-actions">
                <button
                  type="button"
                  className="btn-primary-gold"
                  onClick={() => window.print()}
                >
                  In Hóa Đơn (Print)
                </button>
                <button
                  type="button"
                  className="btn-outline-gold"
                  onClick={() => setIsReceiptModalOpen(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CREATE / EDIT BOOKING */}
        {isFormModalOpen && (
          <div className="admin-submodal-backdrop">
            <div className="admin-submodal-card">
              <div className="admin-submodal-header">
                <h3>{editingBooking ? `Chỉnh Sửa Đơn #${editingBooking.id}` : 'Thêm Đơn Đặt Lịch Mới'}</h3>
                <button 
                  type="button" 
                  className="btn-close-submodal"
                  onClick={() => setIsFormModalOpen(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="admin-submodal-form">
                <div className="form-row-two">
                  <div className="form-group">
                    <label>Họ Tên Khách Hàng <span className="req">*</span></label>
                    <input
                      type="text"
                      placeholder="Nguyễn Thị A..."
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Số Điện Thoại <span className="req">*</span></label>
                    <input
                      type="tel"
                      placeholder="090..."
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Dịch Vụ Làm Đẹp / Spa:</label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => handleServiceSelect(e.target.value)}
                  >
                    {SERVICES_CATALOG.map((s) => (
                      <option key={s.id} value={s.id}>
                        [{s.categoryName}] {s.name} - {s.singlePriceDisplay}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Nhân Viên Phục Vụ / Kỹ Thuật Viên:</label>
                  <select
                    value={formData.assignedStaff || ''}
                    onChange={(e) => {
                      const u = e.target.value;
                      const staff = staffAccounts.find(s => s.username === u);
                      setFormData(prev => ({
                        ...prev,
                        assignedStaff: u,
                        assignedStaffName: staff ? staff.fullName : (u === 'admin' ? 'Quản lý (admin)' : '')
                      }));
                    }}
                  >
                    <option value="">-- Chưa chỉ định nhân viên phục vụ --</option>
                    {staffAccounts.map(acc => (
                      <option key={acc.username} value={acc.username}>
                        {acc.fullName} (@{acc.username}) {acc.role === 'boss' ? '(Sếp/Quản lý)' : '(Nhân viên)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label>Hình Thức / Gói Liệu Trình:</label>
                    <select
                      value={formData.modeLabel}
                      onChange={(e) => setFormData({ ...formData, modeLabel: e.target.value })}
                    >
                      <option value="Buổi Đơn Lẻ">Buổi Đơn Lẻ</option>
                      <option value="Gói 5 Buổi Tiết Kiệm">Gói 5 Buổi Tiết Kiệm</option>
                      <option value="Trọn Gói BH 2 Năm">Trọn Gói BH 2 Năm</option>
                      <option value="Tư Vấn Miễn Phí">Tư Vấn Miễn Phí</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Giá Tiền Hiển Thị:</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: 500.000đ"
                      value={formData.priceDisplay}
                      onChange={(e) => setFormData({ ...formData, priceDisplay: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-three">
                  <div className="form-group">
                    <label>Ngày Hẹn:</label>
                    <input
                      type="date"
                      value={formData.bookingDate}
                      onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Giờ Hẹn:</label>
                    <input
                      type="time"
                      value={formData.bookingTime}
                      onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Trạng Thái:</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="completed">Đã hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Ghi Chú Tình Trạng Da Của Khách:</label>
                  <textarea
                    rows={2}
                    placeholder="Mụn viêm, da nhạy cảm, lần đầu làm spa..."
                    value={formData.skinNotes}
                    onChange={(e) => setFormData({ ...formData, skinNotes: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Ghi Chú Nội Bộ (Chỉ Lễ Tân & Quản Lý Thấy):</label>
                  <input
                    type="text"
                    placeholder="Đã gọi điện, chuẩn bị phòng lầu 2, đã cọc 200k..."
                    value={formData.adminNotes}
                    onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                  />
                </div>

                <div className="submodal-actions">
                  <button type="submit" className="btn-primary-gold">
                    {editingBooking ? 'Lưu Thay Đổi' : 'Tạo Đơn Hẹn Mới'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-outline-gold"
                    onClick={() => setIsFormModalOpen(false)}
                  >
                    Hủy Bỏ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: SẾP TẠO TÀI KHOẢN NHÂN VIÊN */}
        {isStaffModalOpen && isBoss && (
          <div className="admin-submodal-backdrop">
            <div className="admin-submodal-card">
              <div className="admin-submodal-header">
                <h3>Tạo Tài Khoản Nhân Viên Mới</h3>
                <button type="button" className="btn-close-submodal" onClick={() => setIsStaffModalOpen(false)}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateStaffAccount} className="admin-submodal-form">
                <div className="form-group">
                  <label>Tên Đăng Nhập (Username) <span className="req">*</span></label>
                  <input
                    type="text"
                    placeholder="viết liền không dấu, ví dụ: lananh, thuthao..."
                    value={staffFormData.username}
                    onChange={(e) => setStaffFormData({ ...staffFormData, username: e.target.value })}
                    required
                  />
                  <small className="text-muted">Nhân viên sẽ dùng tên này để đăng nhập vào panel.</small>
                </div>

                <div className="form-group">
                  <label>Họ Và Tên Nhân Viên <span className="req">*</span></label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Lê Thị Lan Anh..."
                    value={staffFormData.fullName}
                    onChange={(e) => setStaffFormData({ ...staffFormData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mật Khẩu Khởi Tạo <span className="req">*</span></label>
                  <input
                    type="password"
                    placeholder="Ít nhất 6 ký tự..."
                    value={staffFormData.password}
                    onChange={(e) => setStaffFormData({ ...staffFormData, password: e.target.value })}
                    required
                  />
                </div>

                {staffFormError && <div className="admin-error-box">{staffFormError}</div>}

                <div className="submodal-actions">
                  <button type="submit" className="btn-primary-gold">
                    Tạo Tài Khoản
                  </button>
                  <button type="button" className="btn-outline-gold" onClick={() => setIsStaffModalOpen(false)}>
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: DELETE CONFIRMATION (ONLY BOSS) */}
        {deletingId && isBoss && (
          <div className="admin-submodal-backdrop">
            <div className="admin-submodal-card delete-confirm">
              <h3>Xác Nhận Xóa Đơn Đặt Lịch (Quyền Sếp)</h3>
              <p>
                Bạn đang sử dụng quyền <strong>Sếp (admin)</strong> để xóa đơn <strong>#{deletingId}</strong>.
                Hành vi này sẽ được lưu lại vĩnh viễn trong nhật ký thao tác (Audit Log).
              </p>
              <div className="submodal-actions">
                <button type="button" className="btn-danger-confirm" onClick={handleConfirmDelete}>
                  Đồng Ý Xóa Vĩnh Viễn
                </button>
                <button type="button" className="btn-outline-gold" onClick={() => setDeletingId(null)}>
                  Hủy Bỏ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CHANGE PASSWORD */}
        {isPasswordModalOpen && (
          <div className="admin-submodal-backdrop">
            <div className="admin-submodal-card">
              <div className="admin-submodal-header">
                <h3>Đổi Mật Khẩu (@{session?.username})</h3>
                <button type="button" className="btn-close-submodal" onClick={() => setIsPasswordModalOpen(false)}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="admin-submodal-form">
                <div className="form-group">
                  <label>Mật Khẩu Hiện Tại:</label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu cũ..."
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mật Khẩu Mới (ít nhất 6 ký tự):</label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu mới..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                {pwdMessage && <div className="admin-pwd-msg">{pwdMessage}</div>}

                <div className="submodal-actions">
                  <button type="submit" className="btn-primary-gold">
                    Cập Nhật Mật Khẩu
                  </button>
                  <button type="button" className="btn-outline-gold" onClick={() => setIsPasswordModalOpen(false)}>
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==============================================================================
            MODAL: HƯỚNG DẪN CÀI ĐẶT ỨNG DỤNG (PWA INSTALL GUIDE MODAL)
            ============================================================================== */}
        {showInstallGuideModal && (
          <div className="admin-submodal-backdrop">
            <div className="admin-submodal-card pwa-install-modal">
              <div className="admin-submodal-header">
                <h3>Cài Đặt App Quản Trị FORHER</h3>
                <button type="button" className="btn-close-submodal" onClick={() => setShowInstallGuideModal(false)}>
                  ✕
                </button>
              </div>

              <div className="pwa-install-body">
                <div className="pwa-app-badge">
                  <img src="/apple-touch-icon.png" alt="FORHER Logo" className="pwa-modal-logo" />
                  <div>
                    <h4>FORHER Beauty & Spa — Quản Trị</h4>
                    <p>Ứng dụng quản trị đơn đặt lịch, POS tính tiền VietQR & doanh thu</p>
                  </div>
                </div>

                {isIosDevice ? (
                  <div className="pwa-steps-list">
                    <p className="pwa-instruction-title">Hướng dẫn cài đặt trên iPhone / iPad (Safari):</p>
                    <div className="pwa-step-item">
                      <span className="pwa-step-num">1</span>
                      <p>Chạm vào biểu tượng <strong>Chia Sẻ</strong> (Share icon ở thanh công cụ dưới cùng của trình duyệt Safari).</p>
                    </div>
                    <div className="pwa-step-item">
                      <span className="pwa-step-num">2</span>
                      <p>Cuộn xuống danh sách tùy chọn và chạm vào <strong>"Thêm vào Màn hình chính"</strong> (Add to Home Screen).</p>
                    </div>
                    <div className="pwa-step-item">
                      <span className="pwa-step-num">3</span>
                      <p>Chạm nút <strong>"Thêm"</strong> (Add) ở góc trên bên phải màn hình.</p>
                    </div>
                    <div className="pwa-tip-box">
                      Biểu tượng App FORHER Quản Trị sẽ xuất hiện trên màn hình điện thoại, mở toàn màn hình độc lập không bị dính thanh địa chỉ web!
                    </div>
                  </div>
                ) : (
                  <div className="pwa-steps-list">
                    <p className="pwa-instruction-title">Hướng dẫn cài đặt trên Android / Chrome / Máy tính:</p>
                    <div className="pwa-step-item">
                      <span className="pwa-step-num">1</span>
                      <p>Chạm vào biểu tượng <strong>Menu 3 chấm (⋮)</strong> ở góc trên bên phải trình duyệt Chrome.</p>
                    </div>
                    <div className="pwa-step-item">
                      <span className="pwa-step-num">2</span>
                      <p>Chọn dòng <strong>"Cài đặt ứng dụng"</strong> hoặc <strong>"Thêm vào Màn hình chính"</strong> (Install App / Add to Home screen).</p>
                    </div>
                    <div className="pwa-step-item">
                      <span className="pwa-step-num">3</span>
                      <p>Xác nhận <strong>"Cài đặt"</strong> (Install). Biểu tượng ứng dụng sẽ được ghim ra màn hình chính.</p>
                    </div>
                    <div className="pwa-tip-box">
                      Ứng dụng quản trị sẽ hoạt động độc lập, nhanh mượt và mở ngay lập tức mỗi khi bạn cần quản lý đơn hàng!
                    </div>
                  </div>
                )}

                <div className="submodal-actions" style={{ marginTop: '20px' }}>
                  <button 
                    type="button" 
                    className="btn-primary-gold w-100"
                    onClick={() => setShowInstallGuideModal(false)}
                  >
                    Đã Hiểu & Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================================
            MODAL: CHẤM CÔNG VÀO CA (STAFF CHECK-IN MODAL)
            ============================================================================== */}
        {isCheckInModalOpen && (
          <div className="admin-submodal-backdrop">
            <div className="admin-submodal-card">
              <div className="admin-submodal-header">
                <h3>Chấm Công Điểm Danh Vào Ca</h3>
                <button type="button" className="btn-close-submodal" onClick={() => setIsCheckInModalOpen(false)}>
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleStaffCheckIn(); }} className="admin-submodal-form">
                <div className="form-group">
                  <label>Nhân Viên:</label>
                  <input type="text" value={`${session?.fullName || ''} (@${session?.username || ''})`} disabled />
                </div>

                <div className="form-group">
                  <label>Chọn Ca Làm Việc:</label>
                  <select value={selectedShift} onChange={(e) => setSelectedShift(e.target.value)}>
                    {SHIFT_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Thời Gian Vào Ca:</label>
                  <input 
                    type="text" 
                    value={`${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} (Hệ thống tự động ghi nhận giờ thực tế)`} 
                    disabled 
                  />
                </div>

                <div className="form-group">
                  <label>Ghi Chú Ca Làm (Tùy chọn):</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Đi làm đúng giờ, hỗ trợ phòng chăm sóc lầu 1..."
                    value={checkInNotes}
                    onChange={(e) => setCheckInNotes(e.target.value)}
                  />
                </div>

                <div className="submodal-actions">
                  <button type="submit" className="btn-primary-gold">
                    Xác Nhận Vào Ca
                  </button>
                  <button type="button" className="btn-outline-gold" onClick={() => setIsCheckInModalOpen(false)}>
                    Hủy Bỏ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==============================================================================
            MODAL: SẾP ĐIỀU CHỈNH / CHẤM CÔNG BỔ SUNG (BOSS ATTENDANCE MODAL)
            ============================================================================== */}
        {isAdminAttendanceModalOpen && isBoss && (
          <div className="admin-submodal-backdrop">
            <div className="admin-submodal-card">
              <div className="admin-submodal-header">
                <h3>{adminAttendanceForm.id ? 'Điều Chỉnh Bản Ghi Chấm Công' : 'Thêm Chấm Công Bổ Sung (Quyền Sếp)'}</h3>
                <button type="button" className="btn-close-submodal" onClick={() => setIsAdminAttendanceModalOpen(false)}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleAdminSaveAttendance} className="admin-submodal-form">
                <div className="form-group">
                  <label>Nhân Viên Được Chấm Công <span className="req">*</span></label>
                  <select
                    value={adminAttendanceForm.username}
                    onChange={(e) => {
                      const u = e.target.value;
                      const staff = staffAccounts.find(s => s.username === u);
                      setAdminAttendanceForm(prev => ({
                        ...prev,
                        username: u,
                        staffName: staff ? staff.fullName : u
                      }));
                    }}
                    required
                  >
                    {staffAccounts.map(acc => (
                      <option key={acc.username} value={acc.username}>
                        {acc.fullName} (@{acc.username}) {acc.role === 'boss' ? '(Sếp/Quản lý)' : '(Nhân viên)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label>Ngày Làm Việc:</label>
                    <input
                      type="date"
                      value={adminAttendanceForm.date}
                      onChange={(e) => setAdminAttendanceForm({ ...adminAttendanceForm, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Ca Làm Việc:</label>
                    <select
                      value={adminAttendanceForm.shiftName}
                      onChange={(e) => setAdminAttendanceForm({ ...adminAttendanceForm, shiftName: e.target.value })}
                    >
                      {SHIFT_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row-three">
                  <div className="form-group">
                    <label>Giờ Vào Ca:</label>
                    <input
                      type="time"
                      value={adminAttendanceForm.checkInTime}
                      onChange={(e) => setAdminAttendanceForm({ ...adminAttendanceForm, checkInTime: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Giờ Tan Ca:</label>
                    <input
                      type="time"
                      value={adminAttendanceForm.checkOutTime || ''}
                      onChange={(e) => setAdminAttendanceForm({ ...adminAttendanceForm, checkOutTime: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Số Giờ Tính Công:</label>
                    <input
                      type="number"
                      step="0.1"
                      value={adminAttendanceForm.workingHours || 0}
                      onChange={(e) => setAdminAttendanceForm({ ...adminAttendanceForm, workingHours: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Trạng Thái Chấm Công:</label>
                  <select
                    value={adminAttendanceForm.status}
                    onChange={(e) => setAdminAttendanceForm({ ...adminAttendanceForm, status: e.target.value })}
                  >
                    <option value="completed">Đã hoàn thành ca làm việc</option>
                    <option value="working">Đang trong ca làm việc</option>
                    <option value="leave">Nghỉ phép / Có phép</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Ghi Chú Lý Do Điều Chỉnh:</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Nhân viên quên bấm tan ca, Sếp duyệt tăng ca..."
                    value={adminAttendanceForm.notes}
                    onChange={(e) => setAdminAttendanceForm({ ...adminAttendanceForm, notes: e.target.value })}
                  />
                </div>

                <div className="submodal-actions">
                  <button type="submit" className="btn-primary-gold">
                    Lưu Bản Ghi Chấm Công
                  </button>
                  <button type="button" className="btn-outline-gold" onClick={() => setIsAdminAttendanceModalOpen(false)}>
                    Hủy Bỏ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
