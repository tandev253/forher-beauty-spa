import React, { useState } from 'react';
import { SERVICES_CATALOG, CATEGORIES, formatCurrency } from '../data/servicesData';

export default function CorporateServices({ onAddToCart, onOpenOriginalMenu }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const filteredServices = SERVICES_CATALOG.filter((service) => {
    const matchCategory = activeCategory === 'all' || service.category === activeCategory;
    const term = searchTerm.toLowerCase().trim();
    const matchSearch =
      !term ||
      service.name.toLowerCase().includes(term) ||
      service.desc.toLowerCase().includes(term) ||
      service.code.toLowerCase().includes(term) ||
      service.categoryName.toLowerCase().includes(term);

    return matchCategory && matchSearch;
  });

  return (
    <section id="pricing" className="corp-section">
      <div className="corp-container">
        <div className="corp-section-header">
          <span className="corp-section-tag">HỆ THỐNG DỊCH VỤ NIÊM YẾT</span>
          <h2 className="corp-section-title">Danh Mục Dịch Vụ & Bảng Giá Chính Thức</h2>
          <p className="corp-section-desc">
            Toàn bộ 35 dịch vụ thẩm mỹ chuyên sâu được niêm yết minh bạch. Quý khách có thể lựa chọn buổi lẻ trải nghiệm hoặc đăng ký gói liệu trình 5 buổi với mức chiết khấu tiết kiệm tối đa.
          </p>
        </div>

        {/* Corporate Controls Bar */}
        <div className="corp-services-controls">
          {/* Search & Actions */}
          <div className="corp-controls-row">
            <div className="corp-search-wrapper">
              <span className="corp-search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Tìm kiếm dịch vụ (ví dụ: Nách, Mụn, Meso, TCA, Môi...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Tìm kiếm dịch vụ"
              />
              {searchTerm && (
                <button type="button" className="corp-clear-search" onClick={() => setSearchTerm('')}>
                  ✕
                </button>
              )}
            </div>

            <div className="corp-controls-actions">
              {/* Button to open authentic menu sheets */}
              <button 
                type="button" 
                className="corp-btn-original-menu"
                onClick={onOpenOriginalMenu}
                title="Mở xem bản in 2 trang menu gốc của Spa"
              >
                <span>📜 Xem 2 Bản Menu Gốc</span>
              </button>

              {/* View Switcher */}
              <div className="corp-view-toggle">
                <button 
                  type="button" 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Dạng thẻ lưới"
                >
                  <span>🔲 Thẻ Dịch Vụ</span>
                </button>
                <button 
                  type="button" 
                  className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                  title="Dạng bảng chi tiết"
                >
                  <span>📋 Bảng Niêm Yết</span>
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="corp-category-scroll">
            <div className="corp-category-pills">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`corp-cat-pill ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="corp-cat-count">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty Search Feedback */}
        {filteredServices.length === 0 && (
          <div className="corp-empty-state">
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔍</div>
            <h4>Không tìm thấy dịch vụ nào phù hợp</h4>
            <p>Vui lòng thử lại với từ khóa khác hoặc bấm nút "Tất Cả Dịch Vụ".</p>
          </div>
        )}

        {/* VIEW 1: Corporate Grid Cards */}
        {viewMode === 'grid' && (
          <div className="corp-cards-grid">
            {filteredServices.map((service) => (
              <div key={service.id} className="corp-service-card">
                <div className="card-top-row">
                  <span className="corp-code-badge">{service.code}</span>
                  <span className="corp-category-tag">{service.categoryName}</span>
                  {service.highlight && (
                    <span className="corp-hot-badge">★ PHỔ BIẾN</span>
                  )}
                </div>

                <h3 className="corp-card-title">{service.name}</h3>
                <p className="corp-card-desc">{service.desc}</p>

                <div className="corp-card-meta">
                  <span>⏱️ Thời gian: <strong>{service.duration}</strong></span>
                  {service.isWarranty2Y && (
                    <span className="meta-warranty">🛡️ Bảo Hành 2 Năm</span>
                  )}
                </div>

                {/* Price block */}
                <div className="corp-card-price-box">
                  <div className="price-item-line">
                    <span className="price-title">Giá buổi lẻ:</span>
                    <span className="price-num-single">{service.singlePriceDisplay}</span>
                  </div>

                  <div className="price-item-line">
                    <span className="price-title">
                      {service.isWarranty2Y ? 'Trọn gói liệu trình:' : 'Liệu trình 5 buổi:'}
                    </span>
                    <span className="price-num-course">
                      {service.coursePriceDisplay}
                      {service.savings && (
                        <span className="price-saving-tag">Tiết kiệm {service.savings}</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="corp-card-actions">
                  <button 
                    type="button" 
                    className="corp-btn-card-single"
                    onClick={() => onAddToCart(service, 'single')}
                  >
                    + Đặt Buổi Lẻ
                  </button>

                  <button 
                    type="button" 
                    className="corp-btn-card-course"
                    onClick={() => onAddToCart(service, service.isWarranty2Y ? 'single' : 'course')}
                  >
                    {service.isWarranty2Y ? 'Đăng Ký Gói BH 2N' : '+ Gói Liệu Trình 5B'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 2: Enterprise Table */}
        {viewMode === 'table' && (
          <div className="corp-table-wrapper">
            <table className="corp-enterprise-table">
              <thead>
                <tr>
                  <th style={{ width: '90px' }}>Mã DV</th>
                  <th>Tên Liệu Trình & Mô Tả</th>
                  <th style={{ width: '130px' }}>Chuyên Khoa</th>
                  <th style={{ width: '110px' }}>Thời Gian</th>
                  <th style={{ width: '140px', textAlign: 'right' }}>Giá Buổi Lẻ</th>
                  <th style={{ width: '210px', textAlign: 'right' }}>Liệu Trình (5B / BH)</th>
                  <th style={{ width: '150px', textAlign: 'center' }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <span className="table-code-pill">{service.code}</span>
                    </td>
                    <td>
                      <div className="table-service-name">
                        <strong>{service.name}</strong>
                        {service.highlight && <span className="corp-hot-inline">HOT</span>}
                      </div>
                      <div className="table-service-desc">{service.desc}</div>
                    </td>
                    <td>
                      <span className="table-cat-badge">{service.categoryName}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: '#55443B' }}>{service.duration}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--text-dark)' }}>
                        {service.singlePriceDisplay}
                      </strong>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ color: 'var(--accent-rose)', fontWeight: 800, fontSize: '1.05rem' }}>
                        {service.coursePriceDisplay}
                      </div>
                      {service.savings && (
                        <div style={{ fontSize: '0.75rem', color: '#C62828', fontWeight: 600 }}>
                          Tiết kiệm {service.savings}
                        </div>
                      )}
                      {service.isWarranty2Y && (
                        <div style={{ fontSize: '0.75rem', color: '#2E7D32', fontWeight: 600 }}>
                          🛡️ Bảo hành 2 năm bằng văn bản
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button 
                          type="button" 
                          className="table-btn-action"
                          onClick={() => onAddToCart(service, 'single')}
                          title="Thêm buổi lẻ"
                        >
                          + Lẻ
                        </button>
                        <button 
                          type="button" 
                          className="table-btn-action table-btn-highlight"
                          onClick={() => onAddToCart(service, service.isWarranty2Y ? 'single' : 'course')}
                          title={service.isWarranty2Y ? 'Đăng ký trọn gói' : 'Thêm gói 5 buổi'}
                        >
                          {service.isWarranty2Y ? 'Gói BH' : '+ 5B'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
