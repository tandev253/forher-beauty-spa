import React, { useState, useEffect, useMemo } from 'react';
import { BookingStorage } from '../data/bookingStorage';
import { SERVICES_CATALOG } from '../data/servicesData';
import { SUPABASE_URL } from '../config/supabaseClient';

export default function AdminPanel({ isOpen, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState(null);

  // Login Form State
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Navigation Tabs: 'bookings' | 'logs' | 'staff' | 'backup'
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [logs, setLogs] = useState([]);
  const [staffAccounts, setStaffAccounts] = useState([]);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Modals
  const [editingBooking, setEditingBooking] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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

  // SQL Copy state
  const [sqlCopied, setSqlCopied] = useState(false);

  // Form Fields for Booking
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
    status: 'pending'
  });

  const isBoss = session?.role === 'boss' || session?.username === 'admin';

  // Load Data
  const refreshData = async () => {
    setBookings(BookingStorage.getAllBookings());
    setLogs(BookingStorage.getAllLogs());
    setStaffAccounts(BookingStorage.getAllAccounts());
    setSession(BookingStorage.getCurrentSession());

    // Background sync with Supabase
    try {
      await BookingStorage.syncBookingsFromSupabase();
      await BookingStorage.syncAccountsFromSupabase();
      setBookings(BookingStorage.getAllBookings());
      setStaffAccounts(BookingStorage.getAllAccounts());
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

  // Status counters
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    return { total, pending, confirmed, completed, cancelled };
  }, [bookings]);

  // Filtered bookings
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
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
  }, [bookings, statusFilter, dateFilter, searchTerm, todayStr]);

  // Quick Status Change from row
  const handleQuickStatusChange = async (bookingId, newStatus) => {
    await BookingStorage.updateBooking(bookingId, { status: newStatus });
    refreshData();
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
      status: 'pending'
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
      status: booking.status || 'pending'
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
      await BookingStorage.deleteBooking(id); // will register security alert in audit log
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

  // Copy SQL
  const handleCopySql = () => {
    navigator.clipboard.writeText(BookingStorage.getInitSql());
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="admin-overlay-backdrop">
      <div className="admin-panel-modal">
        {/* TOP BAR */}
        <div className="admin-top-bar">
          <div className="admin-branding">
            {isAuthenticated ? (
              isBoss ? (
                <span className="admin-role-pill boss">SẾP (ADMIN)</span>
              ) : (
                <span className="admin-role-pill staff">{session?.fullName || 'NHÂN VIÊN'}</span>
              )
            ) : (
              <span className="admin-badge-role">ADMIN PANEL</span>
            )}
            <h2 className="admin-title">FORHER Beauty & Spa — Quản Trị Đơn Đặt Lịch</h2>
          </div>

          <div className="admin-top-actions">
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
            <button 
              type="button" 
              className="btn-admin-close" 
              onClick={onClose}
              title="Đóng Quản Trị"
            >
              ✕ Đóng
            </button>
          </div>
        </div>

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
                  <small style={{ color: '#059669', display: 'block', marginTop: '6px' }}>
                    Kết nối cơ sở dữ liệu Supabase: <strong>{SUPABASE_URL.split('//')[1]}</strong>
                  </small>
                </div>

                {loginError && <div className="admin-error-box">{loginError}</div>}

                <div className="admin-login-actions">
                  <button type="submit" className="btn-primary-gold w-100" disabled={isLoggingIn}>
                    {isLoggingIn ? 'Đang Kiểm Tra...' : 'Đăng Nhập Quản Trị'}
                  </button>
                  <button type="button" className="btn-outline-gold w-100" onClick={onClose}>
                    Quay Lại Website
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="admin-dashboard-body">
            {/* ROLE PERMISSION NOTICE BAR */}
            <div className={`role-notice-banner ${isBoss ? 'banner-boss' : 'banner-staff'}`}>
              {isBoss ? (
                <div className="role-notice-inner">
                  <div>
                    <strong>Tài khoản Sếp (admin):</strong>
                    <span> Toàn quyền quản trị tối cao — Có quyền <strong>XÓA ĐƠN</strong>, <strong>TẠO TÀI KHOẢN NHÂN VIÊN</strong> và quản lý toàn bộ hệ thống Supabase Cloud.</span>
                  </div>
                </div>
              ) : (
                <div className="role-notice-inner">
                  <div>
                    <strong>Tài khoản Nhân viên ({session?.fullName}):</strong>
                    <span> Tiếp nhận khách, thêm đơn, sửa thông tin & đổi trạng thái. <strong>Thao tác Xóa đơn bị vô hiệu hóa</strong> (Chỉ Sếp admin mới có quyền xóa).</span>
                  </div>
                </div>
              )}
            </div>

            {/* STATS BAR */}
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
                  Lịch Sử Thao Tác (Audit Log) ({logs.length})
                </button>

                <button
                  type="button"
                  className={`admin-tab-btn ${activeTab === 'backup' ? 'active' : ''}`}
                  onClick={() => setActiveTab('backup')}
                >
                  Supabase Cloud & Dữ Liệu
                </button>
              </div>

              <div className="admin-header-actions">
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
                    + Thêm Đơn Thủ Công
                  </button>
                )}
                <button 
                  type="button" 
                  className="btn-admin-action outline"
                  onClick={handleExportCsv}
                >
                  Xuất File Excel (CSV)
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
                {/* Search & Filter Bar */}
                <div className="admin-filter-bar">
                  <div className="filter-search-box">
                    <input
                      type="text"
                      placeholder="Tìm theo tên khách, số điện thoại, mã đơn hoặc dịch vụ..."
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
                      className="filter-select"
                    >
                      <option value="all">Tất Cả Trạng Thái</option>
                      <option value="pending">Chờ xác nhận ({stats.pending})</option>
                      <option value="confirmed">Đã xác nhận ({stats.confirmed})</option>
                      <option value="completed">Đã hoàn thành ({stats.completed})</option>
                      <option value="cancelled">Đã hủy ({stats.cancelled})</option>
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

                {/* Bookings Table */}
                <div className="admin-table-container">
                  {filteredBookings.length === 0 ? (
                    <div className="admin-empty-state">
                      <p>Không tìm thấy đơn đặt lịch nào phù hợp với bộ lọc hiện tại.</p>
                      <button 
                        type="button" 
                        className="btn-outline-gold"
                        onClick={() => { setSearchTerm(''); setStatusFilter('all'); setDateFilter('all'); }}
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
                          <th>NGƯỜI TẠO</th>
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
                              </td>

                              <td className="col-datetime">
                                <div className="datetime-badge-box">
                                  <span className={`date-val ${isToday ? 'today-highlight' : ''}`}>
                                    {b.bookingDate} {isToday && <span className="today-pill">HÔM NAY</span>}
                                  </span>
                                  <span className="time-val">{b.bookingTime}</span>
                                </div>
                              </td>

                              <td className="col-creator">
                                <span className="creator-badge">
                                  {b.createdBy || 'Khách web'}
                                </span>
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
              </div>
            )}

            {/* TAB CONTENT 2: STAFF MANAGEMENT (BOSS ONLY) */}
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

            {/* TAB CONTENT 3: AUDIT LOGS */}
            {activeTab === 'logs' && (
              <div className="admin-tab-content">
                <div className="audit-logs-header">
                  <div>
                    <h3>Nhật Ký Thao Tác (Audit Log)</h3>
                    <p>Hệ thống tự động ghi nhận lại chi tiết ai (Sếp admin, từng Nhân viên cụ thể, Khách web) đã tạo, sửa hoặc xóa đơn.</p>
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

            {/* TAB CONTENT 4: SUPABASE CLOUD & DATA */}
            {activeTab === 'backup' && (
              <div className="admin-tab-content">
                <div className="backup-sections-grid">
                  {/* Supabase Cloud Connection Box */}
                  <div className="backup-card supabase-highlight-card">
                    <h4>Kết Nối Supabase Cloud Database</h4>
                    <p>
                      Dự án Supabase: <strong>{SUPABASE_URL}</strong><br />
                      Để đồng bộ dữ liệu vĩnh viễn trên đám mây, hãy chạy script SQL tạo bảng trong Supabase SQL Editor.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button 
                        type="button" 
                        className="btn-primary-gold"
                        onClick={handleCopySql}
                      >
                        {sqlCopied ? 'Đã Sao Chép Mã SQL' : 'Sao Chép Mã Tạo Bảng SQL'}
                      </button>
                      <a 
                        href="https://supabase.com/dashboard/project/lrjumrqjpepxmlwaiwvq/sql" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-outline-gold"
                      >
                        Mở Supabase SQL Editor ↗
                      </a>
                    </div>
                    {sqlCopied && (
                      <small style={{ color: '#059669', display: 'block', marginTop: '8px' }}>
                        Đã chép mã SQL vào clipboard. Hãy dán vào Supabase và bấm <strong>Run</strong>!
                      </small>
                    )}
                  </div>

                  <div className="backup-card">
                    <h4>Xuất Danh Sách Ra Excel / CSV</h4>
                    <p>Tải toàn bộ danh sách đơn đặt lịch về máy vi tính dạng file CSV mở bằng Microsoft Excel hoặc Google Sheets.</p>
                    <button type="button" className="btn-primary-gold" onClick={handleExportCsv}>
                      Tải File CSV Xuống
                    </button>
                  </div>
                </div>
              </div>
            )}
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
      </div>
    </div>
  );
}
