import React, { useState } from 'react';
import { SERVICES_CATALOG, CATEGORIES } from '../data/servicesData';

export default function ServicesPricing({ onSelectServiceToBook }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = SERVICES_CATALOG.filter((s) => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory;
    const term = searchTerm.toLowerCase().trim();
    const matchSearch =
      !term ||
      s.name.toLowerCase().includes(term) ||
      s.code.toLowerCase().includes(term) ||
      s.categoryName.toLowerCase().includes(term);
    return matchCat && matchSearch;
  });

  return (
    <section id="services" className="section-padding bg-soft-beige">
      <div className="site-container">
        <div className="section-header-center">
          <span className="section-subtitle">BẢNG GIÁ NIÊM YẾT CHÍNH THỨC</span>
          <h2 className="section-title">Danh Mục Dịch Vụ & Chi Phí Liệu Trình</h2>
          <div className="section-divider-gold"></div>
          <p className="section-lead-text">
            Bảng giá các dịch vụ chăm sóc da, triệt lông, gội đầu dưỡng sinh & nail tại FORHER Beauty & Spa được niêm yết minh bạch. 
            Quý khách có thể bấm <strong>"Đặt Lịch Dịch Vụ Này"</strong> ở bất kỳ dịch vụ nào để điền thông tin hẹn giờ tiếp đón chu đáo.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="pricing-toolbar">
          <div className="search-bar-clean">
            <svg className="search-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Tìm nhanh dịch vụ (ví dụ: Nách, Mụn, Gội đầu, Nail, Peel, Môi...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Tìm kiếm dịch vụ"
            />
            {searchTerm && (
              <button 
                type="button" 
                className="btn-clear-search" 
                onClick={() => setSearchTerm('')}
                title="Xóa tìm kiếm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills without emojis */}
        <div className="category-tabs-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cat-pill-button ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Services List Grid */}
        <div className="services-compact-grid">
          {filteredServices.length === 0 ? (
            <div className="no-services-found">
              <p>Không tìm thấy dịch vụ phù hợp với từ khóa "<strong>{searchTerm}</strong>".</p>
              <button 
                type="button" 
                className="btn-reset-filter"
                onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
              >
                Xem tất cả dịch vụ
              </button>
            </div>
          ) : (
            filteredServices.map((service) => {
              const hasCourse = service.coursePrice && service.coursePrice !== service.singlePrice;
              return (
                <div key={service.id} className="service-compact-card">
                  <div className="service-card-header">
                    <span className="service-badge-cat">{service.categoryName}</span>
                    {service.isWarranty2Y && (
                      <span className="service-badge-warranty">Bảo Hành 2 Năm</span>
                    )}
                  </div>

                  <h3 className="service-card-name">{service.name}</h3>
                  <p className="service-card-desc">{service.desc}</p>

                  <div className="service-card-pricing-row">
                    <div className="price-item">
                      <span className="price-label">
                        {service.isWarranty2Y ? 'Trọn gói BH 2 năm:' : 'Buổi lẻ:'}
                      </span>
                      <strong className="price-val-main">{service.singlePriceDisplay}</strong>
                    </div>

                    {hasCourse && (
                      <div className="price-item text-right">
                        <span className="price-label">Gói liệu trình (5B):</span>
                        <strong className="price-val-course">{service.coursePriceDisplay}</strong>
                      </div>
                    )}
                  </div>

                  <button 
                    type="button" 
                    className="btn-select-to-book"
                    onClick={() => onSelectServiceToBook(service)}
                  >
                    Đặt Lịch Dịch Vụ Này
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
