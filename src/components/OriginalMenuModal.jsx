import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/servicesData';

export default function OriginalMenuModal({ isOpen, onClose }) {
  const [activeSheet, setActiveSheet] = useState('both'); // 'both' | 'sheet1' | 'sheet2'

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="corp-modal-backdrop" onClick={onClose} />

      {/* Modal Container */}
      <div className="corp-modal-container">
        <div className="corp-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-heading)' }}>
                Bản Gốc 2 Bảng Giá Niêm Yết Tại Cơ Sở FORHER Beauty
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#7D6B60' }}>
                Bản sao chuẩn xác theo bảng giá đặt tại 515 Bà Hạt, P. Diên Hồng, Quận 10
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="sheet-switcher">
              <button 
                type="button" 
                className={`sheet-tab-btn ${activeSheet === 'both' ? 'active' : ''}`}
                onClick={() => setActiveSheet('both')}
              >
                Cả 2 Trang
              </button>
              <button 
                type="button" 
                className={`sheet-tab-btn ${activeSheet === 'sheet1' ? 'active' : ''}`}
                onClick={() => setActiveSheet('sheet1')}
              >
                Trang 1: Triệt Lông & MS
              </button>
              <button 
                type="button" 
                className={`sheet-tab-btn ${activeSheet === 'sheet2' ? 'active' : ''}`}
                onClick={() => setActiveSheet('sheet2')}
              >
                Trang 2: Nặn Mụn & Peel
              </button>
            </div>

            <button 
              type="button" 
              className="corp-btn-outline" 
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              onClick={() => window.print()}
            >
              In / Tải PDF
            </button>

            <button 
              type="button" 
              className="corp-modal-close"
              onClick={onClose}
              aria-label="Đóng"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body with the 2 authentic sheets */}
        <div className="corp-modal-body">
          <div className={`menu-sheets-grid ${activeSheet === 'both' ? 'grid-two-sheets' : 'grid-single-sheet'}`}>
            {/* Sheet 1 */}
            {(activeSheet === 'both' || activeSheet === 'sheet1') && (
              <div className="menu-sheet-card">
                <div className="sheet-header-logo">
                  <span className="sheet-logo-cursive">Forher Beauty</span>
                </div>

                <div className="menu-section">
                  <div className="section-title-wrap">
                    <h3 className="section-title-plain">LIỆU TRÌNH BẢO HÀNH TRIỆT LÔNG 2 NĂM</h3>
                  </div>
                  <div className="menu-items-table">
                    {[
                      { n: 'NÁCH', p: '500.000' },
                      { n: 'MÉP', p: '450.000' },
                      { n: 'MẶT', p: '1.700.000' },
                      { n: '½ TAY', p: '1.400.000' },
                      { n: 'NGUYÊN TAY', p: '2.200.000' },
                      { n: '½ CHÂN', p: '1.900.000' },
                      { n: 'NGUYÊN CHÂN', p: '3.500.000' },
                      { n: 'LƯNG', p: '2.500.000' },
                      { n: 'BIKINI', p: '2.200.000' },
                      { n: 'TOÀN THÂN', p: '12.700.000' }
                    ].map((row, i) => (
                      <div key={i} className="menu-item-row">
                        <div className="item-name-cell">
                          <span className="item-bullet">•</span>
                          <span>{row.n}</span>
                        </div>
                        <div className="item-prices-cell">
                          <span className="price-single">{row.p}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="menu-section">
                  <div className="section-title-wrap">
                    <h3 className="section-title-plain">SHADING</h3>
                  </div>
                  <div className="menu-items-table">
                    {[
                      { n: 'PHUN MÀY HIỆU ỨNG BÚT CHÌ SHADINH', p: '2.000.000' },
                      { n: 'PHUN MÔI BABY', p: '2.500.000' },
                      { n: 'KHỬ THÂM', p: '1.000.000-2.500.000' }
                    ].map((row, i) => (
                      <div key={i} className="menu-item-row">
                        <div className="item-name-cell">
                          <span className="item-bullet">•</span>
                          <span>{row.n}</span>
                        </div>
                        <div className="item-prices-cell">
                          <span className="price-single">{row.p}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="menu-section">
                  <div className="section-title-wrap">
                    <h3 className="section-title-plain">MS</h3>
                  </div>
                  <div className="section-cols-header">
                    <span className="col-header-price">GIÁ</span>
                    <span className="col-header-course">LIỆU TRÌNH (5B)</span>
                  </div>
                  <div className="menu-items-table">
                    {[
                      { n: 'HYALURONIC', p: '2.550.000', c: '8.800.000' },
                      { n: 'E-PQF+HA 3%', p: '2.990.000', c: '9.000.000' },
                      { n: 'ACTIVATED C-E GLU', p: '3.190.000', c: '10.000.000' },
                      { n: 'MELASMA FX', p: '3.290.000', c: '11.000.000' },
                      { n: 'MELASMA FX+HA', p: '4.550.000', c: '12.500.000' }
                    ].map((row, i) => (
                      <div key={i} className="menu-item-row">
                        <div className="item-name-cell">
                          <span className="item-bullet">•</span>
                          <span>{row.n}</span>
                        </div>
                        <div className="item-prices-cell">
                          <span className="price-single">{row.p}</span>
                          <span className="price-course">{row.c}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="menu-section">
                  <div className="section-title-wrap">
                    <h3 className="section-title-plain">EYE</h3>
                  </div>
                  <div className="menu-items-table">
                    {[
                      { n: 'ACTIVE EYES', p: '1.800.000', c: '7.700.000' },
                      { n: 'YOUNG EYES', p: '2.000.000', c: '8.000.000' }
                    ].map((row, i) => (
                      <div key={i} className="menu-item-row">
                        <div className="item-name-cell">
                          <span className="item-bullet">•</span>
                          <span>{row.n}</span>
                        </div>
                        <div className="item-prices-cell">
                          <span className="price-single">{row.p}</span>
                          <span className="price-course">{row.c}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <footer className="sheet-footer">
                  <div className="sheet-footer-phone">{COMPANY_INFO.phone}</div>
                  <div className="sheet-footer-address">{COMPANY_INFO.address.toUpperCase()}</div>
                  <div className="sheet-footer-social">FB & TIKTOK: @FORHERBEAUTY SPA // IG: @FORHER_BEAUTY515</div>
                </footer>
              </div>
            )}

            {/* Sheet 2 */}
            {(activeSheet === 'both' || activeSheet === 'sheet2') && (
              <div className="menu-sheet-card">
                <div className="sheet-header-logo">
                  <span className="sheet-logo-cursive">Forher Beauty</span>
                </div>

                <div className="menu-section">
                  <div className="section-title-wrap">
                    <span className="section-title-pill">NẶN MỤN</span>
                  </div>
                  <div className="section-cols-header">
                    <span className="col-header-price">GIÁ</span>
                    <span className="col-header-course">LIỆU TRÌNH (5B)</span>
                  </div>
                  <div className="menu-items-table">
                    {[
                      { n: 'CHĂM SÓC DA MẶT NẶN MỤN CƠ BẢN', p: '320.000', c: '1.199.000' },
                      { n: 'CHĂM SÓC DA LƯNG NẶN MỤN', p: '420.000', c: '1.699.000' },
                      { n: 'CHĂM SÓC NẶN MỤN + TIÊU KHUẨN', p: '600.000', c: '2.199.000' },
                      { n: 'CHĂM SÓC NẶN MỤN + TIÊU KHUẨN (CHUYÊN SÂU)', p: '800.000', c: '3.199.000' },
                      { n: 'PREMIUM SKIN TREATMENT', p: '500.000', c: '1.899.000' }
                    ].map((row, i) => (
                      <div key={i} className="menu-item-row">
                        <div className="item-name-cell">
                          <span className="item-bullet">•</span>
                          <span>{row.n}</span>
                        </div>
                        <div className="item-prices-cell">
                          <span className="price-single">{row.p}</span>
                          <span className="price-course">{row.c}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="menu-section">
                  <div className="section-title-wrap">
                    <span className="section-title-pill">SKINCARE</span>
                  </div>
                  <div className="menu-items-table">
                    {[
                      { n: 'MASSAGE NÂNG CƠ + MẶT NẠ THƯ GIÃN', p: '350.000', c: '1.250.000' },
                      { n: 'MASSAGE NÂNG CƠ + VITAMIN C', p: '490.000', c: '1.899.000' },
                      { n: 'CẤY TẾ BÀO THỰC VẬT', p: '520.000', c: '2.000.000' },
                      { n: 'ĐIỆN DI HA', p: '370.000', c: '1.299.000' },
                      { n: 'DETOX BIO TRẺ HÓA DA (+ NẶN MỤN)', p: '740.000', c: '2.799.000' },
                      { n: 'Ủ WHITE FACE (+ Ủ WHITE CỔ)', p: '790.000', c: '3.000.000' }
                    ].map((row, i) => (
                      <div key={i} className="menu-item-row">
                        <div className="item-name-cell">
                          <span className="item-bullet">•</span>
                          <span>{row.n}</span>
                        </div>
                        <div className="item-prices-cell">
                          <span className="price-single">{row.p}</span>
                          <span className="price-course">{row.c}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="menu-section">
                  <div className="section-title-wrap">
                    <span className="section-title-pill">CHEMICAL PEEL ( KÈM NẶN MỤN )</span>
                  </div>
                  <div className="menu-items-table">
                    {[
                      { n: 'PEEL TẢO (MỨC 1)', p: '2.000.000', c: '7.900.000' },
                      { n: 'PEEL TẢO (MỨC 2)', p: '2.500.000', c: '9.000.000' },
                      { n: 'PEEL TẢO (MỨC 3)', p: '3.000.000', c: '10.000.000' },
                      { n: 'PEEL B-LIFT', p: '800.000', c: '3.199.000' },
                      { n: 'PEEL IMAGE + RE', p: '980.000', c: '3.699.000' },
                      { n: 'PEEL SKIN REPAIR', p: '1.000.000', c: '3.800.000' },
                      { n: 'PEEL SKIN RECOVERY', p: '990.000', c: '3.799.000' },
                      { n: 'PEEL LA2', p: '1.200.000', c: '4.199.000' },
                      { n: 'PEEL PEPTIDES', p: '760.000', c: '2.200.000' },
                      { n: 'PEEL TCA - CHẤM TCA', p: '2.500.000', c: '9.000.000' },
                      { n: 'PEEL TCA - RE', p: '1.500.000', c: '5.499.000' },
                      { n: 'PEEL TRẺ HÓA VÙNG NÁCH', p: '750.000', c: '2.750.000' },
                      { n: 'PEEL MULTI - LAYER + Ủ WHITE', p: '1.500.000', c: '5.499.000' }
                    ].map((row, i) => (
                      <div key={i} className="menu-item-row">
                        <div className="item-name-cell">
                          <span className="item-bullet">•</span>
                          <span>{row.n}</span>
                        </div>
                        <div className="item-prices-cell">
                          <span className="price-single">{row.p}</span>
                          <span className="price-course">{row.c}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <footer className="sheet-footer">
                  <div className="sheet-footer-phone">{COMPANY_INFO.phone}</div>
                  <div className="sheet-footer-address">{COMPANY_INFO.address.toUpperCase()}</div>
                  <div className="sheet-footer-social">FB & TIKTOK: @FORHERBEAUTY SPA // IG: @FORHER_BEAUTY515</div>
                </footer>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
