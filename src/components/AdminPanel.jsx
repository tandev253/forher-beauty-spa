import React, { useState, useEffect, useMemo } from 'react';
import { BookingStorage } from '../data/bookingStorage';
import { SERVICES_CATALOG } from '../data/servicesData';

export default function AdminPanel({ isOpen, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState('staff'); // 'boss' | 'staff'

  // Login Form State
  const [selectedLoginRole, setSelectedLoginRole] = useState('boss'); // default select boss or staff
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Main state
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'logs' | 'backup'
  const [bookings, setBookings] = useState([]);
  const [logs, setLogs] = useState([]);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | 'upcoming'

  // Modal State for Add / Edit
  const [editingBooking, setEditingBooking] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdMessage, setPwdMessage] = useState('');

  // Form Fields
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

  // Load data
  const refreshData = () => {
    setBookings(BookingStorage.getAllBookings());
    setLogs(BookingStorage.getAllLogs());
    setCurrentRole(BookingStorage.getCurrentRole() || 'staff');
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

  const handleLogin = (e) => {
    e.preventDefault();
    const result = BookingStorage.login(selectedLoginRole, passwordInput);
    if (result.success) {
      setIsAuthenticated(true);
      setCurrentRole(result.role);
      setLoginError('');
      setPasswordInput('');
      refreshData();
    } else {
      setLoginError(result.message);
    }
  };

  const handleLogout = () => {
    BookingStorage.logout();
    setIsAuthenticated(false);
  };

  const isBoss = currentRole === 'boss';

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
      // Status match
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;

      // Date match
      if (dateFilter === 'today' && b.bookingDate !== todayStr) return false;
      if (dateFilter === 'upcoming' && b.bookingDate < todayStr) return false;

      // Search match
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
  const handleQuickStatusChange = (bookingId, newStatus) => {
    BookingStorage.updateBooking(bookingId, { status: newStatus });
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

  // Handle service change in form
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

  // Save Form (Create or Update)
  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phoneNumber.trim()) {
      alert('Vui lòng nhập họ tên và số điện thoại khách hàng.');
      return;
    }

    if (editingBooking) {
      BookingStorage.updateBooking(editingBooking.id, formData);
    } else {
      BookingStorage.createBooking(formData, 'admin');
    }

    setIsFormModalOpen(false);
    refreshData();
  };

  // Trigger Delete (Check role permission)
  const handleAttemptDelete = (id) => {
    if (!isBoss) {
      alert('⛔ BỊ CHẶN QUYỀN HẠN:\nChỉ Sếp / Quản lý tối cao mới được phép xóa đơn đặt lịch!\nNhân viên chỉ có quyền xem, tiếp nhận và sửa trạng thái đơn.');
      // Also log security violation in audit log
      BookingStorage.deleteBooking(id);
      refreshData();
      return;
    }
    setDeletingId(id);
  };

  // Confirm Delete (Only accessible to Boss)
  const handleConfirmDelete = () => {
    if (deletingId) {
      const res = BookingStorage.deleteBooking(deletingId);
      if (!res.success) {
        alert(res.message);
      }
      setDeletingId(null);
      refreshData();
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
  const handleChangePassword = (e) => {
    e.preventDefault();
    const result = BookingStorage.changePassword(currentRole, oldPassword, newPassword);
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

  if (!isOpen) return null;

  return (
    <div className="admin-overlay-backdrop">
      <div className="admin-panel-modal">
        {/* TOP BAR */}
        <div className="admin-top-bar">
          <div className="admin-branding">
            {isAuthenticated ? (
              isBoss ? (
                <span className="admin-role-pill boss">👑 SẾP (QUẢN LÝ TỐI CAO)</span>
              ) : (
                <span className="admin-role-pill staff">💼 NHÂN VIÊN LỄ TÂN</span>
              )
            ) : (
              <span className="admin-badge-role">ADMIN PANEL</span>
            )}
            <h2 className="admin-title">FORHER Beauty & Spa — Quản Trị Đơn Khách Hàng</h2>
          </div>
          <div className="admin-top-actions">
            {isAuthenticated && (
              <>
                <button 
                  type="button" 
                  className="btn-admin-nav" 
                  onClick={() => setIsPasswordModalOpen(true)}
                  title={`Đổi mật khẩu ${isBoss ? 'Sếp' : 'Nhân viên'}`}
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

        {/* LOGIN SCREEN WITH ROLE SELECTION */}
        {!isAuthenticated ? (
          <div className="admin-login-wrapper">
            <div className="admin-login-card">
              <span className="admin-login-logo">Forher Beauty</span>
              <h3>Đăng Nhập Phân Quyền Quản Trị</h3>
              <p className="admin-login-desc">
                Vui lòng chọn vai trò làm việc để hệ thống áp dụng đúng thẩm quyền (Chỉ Sếp mới có quyền xóa đơn).
              </p>

              {/* Role Picker Tabs */}
              <div className="login-role-tabs">
                <button
                  type="button"
                  className={`login-role-btn ${selectedLoginRole === 'boss' ? 'active boss' : ''}`}
                  onClick={() => { setSelectedLoginRole('boss'); setLoginError(''); }}
                >
                  <span className="role-icon">👑</span>
                  <div className="role-text-wrap">
                    <strong>Sếp / Quản Lý</strong>
                    <small>Toàn quyền (Được Xóa đơn)</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={`login-role-btn ${selectedLoginRole === 'staff' ? 'active staff' : ''}`}
                  onClick={() => { setSelectedLoginRole('staff'); setLoginError(''); }}
                >
                  <span className="role-icon">💼</span>
                  <div className="role-text-wrap">
                    <strong>Nhân Viên Lễ Tân</strong>
                    <small>Thêm, sửa, nhận đơn (Không được xóa)</small>
                  </div>
                </button>
              </div>

              <form onSubmit={handleLogin} className="admin-login-form">
                <div className="admin-form-group">
                  <label htmlFor="admin-pwd">
                    Mật Khẩu của {selectedLoginRole === 'boss' ? 'Sếp' : 'Nhân Viên'}:
                  </label>
                  <input
                    id="admin-pwd"
                    type="password"
                    placeholder={`Nhập mật khẩu ${selectedLoginRole === 'boss' ? 'Sếp' : 'Nhân viên'}...`}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    autoFocus
                    required
                  />
                  <div className="role-pwd-hint-box">
                    {selectedLoginRole === 'boss' ? (
                      <p>🔑 Mật khẩu mặc định của <strong>Sếp</strong>: <code>forherboss</code></p>
                    ) : (
                      <p>🔑 Mật khẩu mặc định của <strong>Nhân viên</strong>: <code>forhernv</code></p>
                    )}
                  </div>
                </div>

                {loginError && <div className="admin-error-box">{loginError}</div>}

                <div className="admin-login-actions">
                  <button type="submit" className="btn-primary-gold w-100">
                    Đăng Nhập với quyền {selectedLoginRole === 'boss' ? 'Sếp' : 'Nhân Viên'}
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
                  <span className="notice-icon">👑</span>
                  <div>
                    <strong>Tài khoản Sếp (Toàn quyền quản trị tối cao):</strong>
                    <span> Bạn có quyền Thêm, Chỉnh sửa, Duyệt trạng thái, <strong>XÓA ĐƠN</strong> và làm trống lịch sử audit log.</span>
                  </div>
                </div>
              ) : (
                <div className="role-notice-inner">
                  <span className="notice-icon">💼</span>
                  <div>
                    <strong>Tài khoản Nhân viên / Lễ tân:</strong>
                    <span> Bạn có quyền tiếp nhận đơn, Thêm mới, Chỉnh sửa thông tin & Cập nhật trạng thái. <strong>Thao tác Xóa đơn bị vô hiệu hóa</strong> (Chỉ Sếp mới có quyền xóa).</span>
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
                  Sao Lưu & Dữ Liệu
                </button>
              </div>

              <div className="admin-header-actions">
                <button 
                  type="button" 
                  className="btn-admin-action gold"
                  onClick={handleOpenCreateModal}
                >
                  + Thêm Đơn Thủ Công
                </button>
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
                  title="Tải lại dữ liệu mới nhất"
                >
                  Làm Mới
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
                                  
                                  {/* DELETE BUTTON: ONLY BOSS HAS PERMISSION */}
                                  {isBoss ? (
                                    <button
                                      type="button"
                                      className="btn-tbl-action delete"
                                      onClick={() => handleAttemptDelete(b.id)}
                                      title="👑 Sếp có quyền xóa đơn này"
                                    >
                                      Xóa
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className="btn-tbl-action delete-disabled"
                                      onClick={() => handleAttemptDelete(b.id)}
                                      title="🔒 Bị khóa: Chỉ Sếp mới có quyền xóa đơn!"
                                    >
                                      🔒 Xóa
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

            {/* TAB CONTENT 2: AUDIT LOGS */}
            {activeTab === 'logs' && (
              <div className="admin-tab-content">
                <div className="audit-logs-header">
                  <div>
                    <h3>Nhật Ký Thao Tác (Audit Log) Phân Theo Người Thực Hiện</h3>
                    <p>Hệ thống tự động ghi nhận lại chi tiết ai (Sếp, Nhân viên, Khách) đã tạo, sửa hoặc xóa đơn.</p>
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
                      👑 Sếp Làm Trống Lịch Sử
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

            {/* TAB CONTENT 3: BACKUP & DATA */}
            {activeTab === 'backup' && (
              <div className="admin-tab-content">
                <div className="backup-sections-grid">
                  <div className="backup-card">
                    <h4>Xuất Danh Sách Ra Excel / CSV</h4>
                    <p>Tải toàn bộ danh sách đơn đặt lịch về máy vi tính dạng file CSV mở bằng Microsoft Excel hoặc Google Sheets.</p>
                    <button type="button" className="btn-primary-gold" onClick={handleExportCsv}>
                      Tải File CSV Xuống
                    </button>
                  </div>

                  <div className="backup-card">
                    <h4>Sao Lưu Hệ Thống (JSON Backup)</h4>
                    <p>Tải file sao lưu toàn bộ đơn đặt lịch và lịch sử thao tác để lưu trữ dự phòng an toàn.</p>
                    <button 
                      type="button" 
                      className="btn-outline-gold"
                      onClick={() => {
                        const jsonStr = BookingStorage.exportFullBackupJson();
                        const blob = new Blob([jsonStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `backup_forher_spa_${todayStr}.json`;
                        a.click();
                      }}
                    >
                      Tải File Sao Lưu JSON
                    </button>
                  </div>

                  {isBoss && (
                    <div className="backup-card">
                      <h4>👑 Quyền Sếp: Khôi Phục Dữ Liệu Mẫu</h4>
                      <p>Thiết lập lại dữ liệu danh sách đơn đặt lịch mẫu ban đầu nếu cần kiểm tra quy trình.</p>
                      <button 
                        type="button" 
                        className="btn-outline-gold"
                        onClick={() => {
                          if (window.confirm('Hành động này sẽ nạp lại danh sách đơn mẫu. Bạn có muốn tiếp tục?')) {
                            BookingStorage.resetDemoData();
                            refreshData();
                            alert('Đã khôi phục dữ liệu mẫu thành công!');
                          }
                        }}
                      >
                        Nạp Dữ Liệu Mẫu
                      </button>
                    </div>
                  )}
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

        {/* MODAL: DELETE CONFIRMATION (ONLY BOSS CAN TRIGGER) */}
        {deletingId && isBoss && (
          <div className="admin-submodal-backdrop">
            <div className="admin-submodal-card delete-confirm">
              <span className="delete-alert-icon">⚠️</span>
              <h3>Xác Nhận Xóa Đơn Đặt Lịch (Quyền Sếp)</h3>
              <p>
                Bạn đang sử dụng quyền <strong>👑 Sếp / Quản Lý</strong> để xóa đơn <strong>#{deletingId}</strong>.
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
                <h3>Đổi Mật Khẩu Đăng Nhập ({isBoss ? '👑 Sếp' : '💼 Nhân Viên'})</h3>
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
