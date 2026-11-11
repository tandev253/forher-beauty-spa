import React, { useState, useEffect, useMemo } from 'react';
import { ArticlesStorage, ARTICLE_CATEGORIES } from '../data/articlesStorage';
import { SERVICES_CATALOG, COMPANY_INFO } from '../data/servicesData';

/**
 * Smart content renderer:
 * Supports rich HTML tags (h2, h3, p, ul/li, blockquote, img) AND plain text with line breaks.
 */
export function formatArticleHtml(rawContent) {
  if (!rawContent) return '';
  const trimmed = rawContent.trim();
  const hasHtmlTags = /<(h2|h3|h4|p|ul|ol|li|blockquote|img|div|strong|em|br)\b/i.test(trimmed);
  if (hasHtmlTags) {
    return trimmed;
  }
  // Convert plain text paragraphs into clean HTML paragraphs
  return trimmed
    .split(/\n{2,}/)
    .map(block => {
      const lines = block.trim().split('\n');
      // If lines start with "- " or "• ", render as a bullet list
      if (lines.every(l => /^[-•*]\s+/.test(l.trim()))) {
        const items = lines
          .map(l => `<li>${l.trim().replace(/^[-•*]\s+/, '')}</li>`)
          .join('');
        return `<ul>${items}</ul>`;
      }
      return `<p>${lines.join('<br />')}</p>`;
    })
    .join('\n');
}

export function formatPublishDate(isoStr) {
  if (!isoStr) return 'Mới cập nhật';
  try {
    return new Date(isoStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return 'Mới cập nhật';
  }
}

/**
 * HOMEPAGE PREVIEW SECTION: Cẩm Nang & Bài Viết Làm Đẹp Mới Nhất
 */
export function BlogPreviewSection({ onNavigateToArticles, onOpenArticle, onBookClick }) {
  const [articles, setArticles] = useState(() => ArticlesStorage.getPublishedArticles());

  useEffect(() => {
    setArticles(ArticlesStorage.getPublishedArticles());
    ArticlesStorage.syncArticlesFromSupabase().then((res) => {
      if (res?.success) {
        setArticles(ArticlesStorage.getPublishedArticles());
      }
    });
  }, []);

  const topArticles = useMemo(() => articles.slice(0, 3), [articles]);

  if (topArticles.length === 0) return null;

  return (
    <section id="articles-preview" className="section-padding bg-soft-beige">
      <div className="site-container">
        <div className="section-header-center">
          <span className="section-subtitle">CẨM NANG LÀM ĐẸP & TIN TỨC FORHER SPA</span>
          <h2 className="section-title">Kiến Thức Chăm Sóc Da & Xu Hướng Thẩm Mỹ</h2>
          <div className="section-divider-gold"></div>
          <p className="section-lead-text">
            Cập nhật kiến thức chăm sóc da chuẩn y khoa, kinh nghiệm triệt lông Diode Laser bảo hành 2 năm, dưỡng sinh thảo mộc và xu hướng mẫu nail mới nhất từ chuyên viên FORHER.
          </p>
        </div>

        <div className="forher-blog-grid">
          {topArticles.map((post) => (
            <article
              key={post.id}
              className="forher-blog-card"
              onClick={() => onOpenArticle(post.slug)}
            >
              <div className="blog-card-img-wrap">
                <img
                  src={post.coverImage || '/forher_facial_treatment_real.jpg'}
                  alt={post.title}
                  className="blog-card-img"
                  loading="lazy"
                />
                <span className="blog-card-cat-badge">{post.categoryName}</span>
                {post.isFeatured && (
                  <span className="blog-card-featured-pill">Nổi Bật</span>
                )}
              </div>

              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span>{formatPublishDate(post.publishedAt)}</span>
                  <span className="meta-dot">•</span>
                  <span>{post.readTime || '4 phút đọc'}</span>
                </div>

                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>

                <div className="blog-card-footer">
                  <span className="blog-card-author">{post.author}</span>
                  <button
                    type="button"
                    className="blog-card-read-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenArticle(post.slug);
                    }}
                  >
                    Đọc chi tiết →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="blog-preview-cta-row">
          <button
            type="button"
            className="btn-primary-gold"
            onClick={onNavigateToArticles}
          >
            Xem Tất Cả Bài Viết ({articles.length} bài) →
          </button>
          <button
            type="button"
            className="btn-outline-gold"
            onClick={onBookClick}
          >
            Đặt Lịch Tư Vấn Da Miễn Phí
          </button>
        </div>
      </div>
    </section>
  );
}

/**
 * DEDICATED FULL PAGE: TRANG BÀI VIẾT & CHI TIẾT BÀI VIẾT (/bai-viet & /bai-viet/:slug)
 */
export default function ArticlesPage({
  activeSlug = null,
  onSelectArticle,
  onBackToList,
  onBackHome,
  onBookService,
  onOpenAdmin
}) {
  const [articles, setArticles] = useState(() => ArticlesStorage.getPublishedArticles());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const loadArticles = async () => {
    setArticles(ArticlesStorage.getPublishedArticles());
    const syncRes = await ArticlesStorage.syncArticlesFromSupabase();
    if (syncRes?.success) {
      setArticles(ArticlesStorage.getPublishedArticles());
    }
  };

  useEffect(() => {
    loadArticles();
  }, [activeSlug]);

  // Current opened article if activeSlug is provided
  const currentArticle = useMemo(() => {
    if (!activeSlug) return null;
    return ArticlesStorage.getArticleBySlugOrId(activeSlug);
  }, [activeSlug, articles]);

  useEffect(() => {
    if (currentArticle?.id) {
      ArticlesStorage.incrementViews(currentArticle.id);
    }
  }, [currentArticle?.id]);

  // Filtered articles for the listing page
  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = (item.title || '').toLowerCase().includes(q);
        const inExcerpt = (item.excerpt || '').toLowerCase().includes(q);
        const inTags = (item.tags || '').toLowerCase().includes(q);
        const inCat = (item.categoryName || '').toLowerCase().includes(q);
        if (!inTitle && !inExcerpt && !inTags && !inCat) return false;
      }
      return true;
    });
  }, [articles, selectedCategory, searchQuery]);

  // Featured spotlight article (first featured or newest) when viewing all without search
  const spotlightArticle = useMemo(() => {
    if (selectedCategory !== 'all' || searchQuery.trim()) return null;
    return filteredArticles.find(a => a.isFeatured) || filteredArticles[0] || null;
  }, [filteredArticles, selectedCategory, searchQuery]);

  // Related service for current article
  const relatedService = useMemo(() => {
    if (!currentArticle?.relatedServiceId) return null;
    return SERVICES_CATALOG.find(s => s.id === currentArticle.relatedServiceId) || null;
  }, [currentArticle]);

  // Related articles for reader view
  const relatedArticles = useMemo(() => {
    if (!currentArticle) return [];
    const sameCat = articles.filter(
      a => a.id !== currentArticle.id && a.category === currentArticle.category
    );
    const others = articles.filter(
      a => a.id !== currentArticle.id && a.category !== currentArticle.category
    );
    return [...sameCat, ...others].slice(0, 3);
  }, [articles, currentArticle]);

  const handleCopyShareLink = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  // ============================================================================
  // VIEW 1: CHI TIẾT BÀI VIẾT (SINGLE ARTICLE READER)
  // ============================================================================
  if (activeSlug && currentArticle) {
    const tagList = (currentArticle.tags || '')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    return (
      <div className="articles-page-wrapper article-reader-mode">
        {/* Top Breadcrumb Bar */}
        <div className="article-breadcrumb-bar">
          <div className="site-container breadcrumb-inner">
            <div className="breadcrumb-links">
              <button type="button" className="bc-link" onClick={onBackHome}>
                Trang Chủ
              </button>
              <span className="bc-sep">/</span>
              <button type="button" className="bc-link" onClick={onBackToList}>
                Bài Viết & Cẩm Nang
              </button>
              <span className="bc-sep">/</span>
              <span className="bc-current">{currentArticle.categoryName}</span>
            </div>

            <button type="button" className="btn-back-articles" onClick={onBackToList}>
              ← Quay Lại Trang Bài Viết
            </button>
          </div>
        </div>

        {/* Main Article Container */}
        <div className="site-container article-detail-layout">
          <article className="article-detail-main">
            {/* Header Meta */}
            <div className="article-detail-header">
              <div className="article-detail-badges">
                <span className="article-cat-pill">{currentArticle.categoryName}</span>
                {currentArticle.isFeatured && (
                  <span className="article-featured-tag">Bài Viết Tiêu Điểm</span>
                )}
              </div>

              <h1 className="article-detail-title">{currentArticle.title}</h1>

              <p className="article-detail-lead">{currentArticle.excerpt}</p>

              <div className="article-author-bar">
                <div className="author-info-left">
                  <div className="author-avatar-circle">FH</div>
                  <div>
                    <strong className="author-name">{currentArticle.author}</strong>
                    <div className="author-sub-meta">
                      <span>Đăng ngày: {formatPublishDate(currentArticle.publishedAt)}</span>
                      <span>•</span>
                      <span>{currentArticle.readTime || '4 phút đọc'}</span>
                      <span>•</span>
                      <span>{(Number(currentArticle.views) || 1) + 1} lượt xem</span>
                    </div>
                  </div>
                </div>

                <div className="author-share-right">
                  <button
                    type="button"
                    className="btn-share-link"
                    onClick={handleCopyShareLink}
                    title="Sao chép đường dẫn bài viết"
                  >
                    {copySuccess ? 'Đã sao chép link!' : 'Chia sẻ bài viết'}
                  </button>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            {currentArticle.coverImage && (
              <div className="article-cover-showcase">
                <img
                  src={currentArticle.coverImage}
                  alt={currentArticle.title}
                  className="article-cover-full-img"
                />
              </div>
            )}

            {/* Rich Article Content */}
            <div
              className="article-rich-content"
              dangerouslySetInnerHTML={{
                __html: formatArticleHtml(currentArticle.content)
              }}
            />

            {/* Embedded Service Recommendation CTA */}
            <div className="article-service-cta-box">
              <div className="cta-box-badge">GỢI Ý LIỆU TRÌNH TẠI FORHER BEAUTY & SPA</div>
              {relatedService ? (
                <div className="cta-service-flex">
                  <div className="cta-service-info">
                    <h4>{relatedService.name}</h4>
                    <p>{relatedService.description}</p>
                    <div className="cta-service-price-row">
                      <span className="price-lbl">Giá niêm yết:</span>
                      <strong className="price-val">{relatedService.singlePriceDisplay}</strong>
                      {relatedService.packagePriceDisplay && (
                        <span className="pkg-val">
                          ({relatedService.packageLabel}: {relatedService.packagePriceDisplay})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="cta-service-actions">
                    <button
                      type="button"
                      className="btn-primary-gold"
                      onClick={() => onBookService(relatedService)}
                    >
                      Đặt Lịch Dịch Vụ Này Ngay
                    </button>
                    <a
                      href={COMPANY_INFO.social.zalo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline-gold"
                    >
                      Tư Vấn Qua Zalo
                    </a>
                  </div>
                </div>
              ) : (
                <div className="cta-service-flex">
                  <div className="cta-service-info">
                    <h4>Trải Nghiệm Chăm Sóc Sắc Đẹp Chuẩn Y Khoa Tại FORHER Spa</h4>
                    <p>
                      Địa chỉ: {COMPANY_INFO.address} • Giờ mở cửa: {COMPANY_INFO.workingHours}. Cam kết bảng giá niêm yết minh bạch, dụng cụ vô trùng riêng biệt 1:1.
                    </p>
                  </div>
                  <div className="cta-service-actions">
                    <button
                      type="button"
                      className="btn-primary-gold"
                      onClick={() => onBookService(null)}
                    >
                      Đặt Lịch Hẹn Trực Tuyến
                    </button>
                    <a href={`tel:${COMPANY_INFO.phoneClean}`} className="btn-outline-gold">
                      Hotline: {COMPANY_INFO.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* SEO Tags & Bottom Navigation */}
            {tagList.length > 0 && (
              <div className="article-tags-Wrap">
                <span className="tags-label">Từ khóa bài viết:</span>
                <div className="tags-pills-list">
                  {tagList.map((tag, idx) => (
                    <span key={idx} className="article-tag-chip">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Right Sidebar: Quick Booking & Info */}
          <aside className="article-detail-sidebar">
            <div className="sidebar-sticky-card">
              <span className="sidebar-cursive-brand">{COMPANY_INFO.brandTitle}</span>
              <h4 className="sidebar-card-title">Đặt Lịch Soi Da & Tư Vấn 1:1</h4>
              <p className="sidebar-card-desc">
                Ghé thăm tòa nhà 3 tầng làm đẹp tại <strong>515 Bà Hạt, P. Diên Hồng, Quận 10</strong>:
              </p>
              <ul className="sidebar-floors-list">
                <li><strong>Tầng Trệt:</strong> Three House Nails nghệ thuật</li>
                <li><strong>Lầu 1:</strong> Gội đầu dưỡng sinh thảo mộc</li>
                <li><strong>Lầu 2:</strong> Chăm sóc da, Trị mụn & Triệt lông Diode Laser (BH 2 năm)</li>
              </ul>

              <button
                type="button"
                className="btn-primary-gold w-100"
                onClick={() => onBookService(relatedService)}
              >
                Đặt Lịch Hẹn Ngay
              </button>

              <a
                href={`tel:${COMPANY_INFO.phoneClean}`}
                className="btn-outline-gold w-100"
                style={{ marginTop: '10px', textAlign: 'center', display: 'block' }}
              >
                Gọi Hotline: {COMPANY_INFO.phone}
              </a>

              <div className="sidebar-categories-box">
                <h5>Chuyên Mục Cẩm Nang</h5>
                <div className="sidebar-cat-list">
                  {ARTICLE_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      className="sidebar-cat-btn"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        onBackToList();
                      }}
                    >
                      <span>{cat.name}</span>
                      <span>→</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="related-articles-section">
            <div className="site-container">
              <div className="related-header-row">
                <h3>Bài Viết Cùng Chủ Đề Bạn Có Thể Quan Tâm</h3>
                <button type="button" className="btn-outline-gold" onClick={onBackToList}>
                  Xem tất cả bài viết →
                </button>
              </div>

              <div className="forher-blog-grid">
                {relatedArticles.map(rel => (
                  <article
                    key={rel.id}
                    className="forher-blog-card"
                    onClick={() => onSelectArticle(rel.slug)}
                  >
                    <div className="blog-card-img-wrap">
                      <img
                        src={rel.coverImage || '/forher_facial_treatment_real.jpg'}
                        alt={rel.title}
                        className="blog-card-img"
                        loading="lazy"
                      />
                      <span className="blog-card-cat-badge">{rel.categoryName}</span>
                    </div>
                    <div className="blog-card-body">
                      <div className="blog-card-meta">
                        <span>{formatPublishDate(rel.publishedAt)}</span>
                        <span className="meta-dot">•</span>
                        <span>{rel.readTime || '4 phút đọc'}</span>
                      </div>
                      <h4 className="blog-card-title">{rel.title}</h4>
                      <p className="blog-card-excerpt">{rel.excerpt}</p>
                      <div className="blog-card-footer">
                        <span className="blog-card-author">{rel.author}</span>
                        <span className="blog-card-read-btn">Đọc tiếp →</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: DANH SÁCH TẤT CẢ BÀI VIẾT (/bai-viet)
  // ============================================================================
  return (
    <div className="articles-page-wrapper">
      {/* Page Hero Banner */}
      <section className="articles-hero-banner">
        <div className="site-container">
          <div className="articles-hero-breadcrumb">
            <button type="button" onClick={onBackHome} className="hero-bc-btn">
              Trang Chủ
            </button>
            <span>/</span>
            <span className="hero-bc-active">Bài Viết & Cẩm Nang Làm Đẹp</span>
          </div>

          <span className="section-subtitle">CHUYÊN TRANG KIẾN THỨC & TIN TỨC • FORHER BEAUTY & SPA</span>
          <h1 className="articles-hero-title">Cẩm Nang Chăm Sóc Sắc Đẹp & Thư Giãn</h1>
          <div className="section-divider-gold"></div>
          <p className="articles-hero-desc">
            Chia sẻ bí quyết chăm sóc da mụn chuẩn y khoa, công nghệ triệt lông Diode Laser bảo hành 2 năm, liệu pháp gội đầu dưỡng sinh thảo dược và xu hướng mẫu nail thời thượng tại 515 Bà Hạt, Quận 10.
          </p>

          {/* Search & Quick Admin Post Button */}
          <div className="articles-search-bar-wrap">
            <div className="articles-search-input-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm bài viết (ví dụ: triệt lông, nặn mụn, peel da, gội đầu, nail)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn-clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="articles-category-pills">
            {ARTICLE_CATEGORIES.map((cat) => {
              const count =
                cat.id === 'all'
                  ? articles.length
                  : articles.filter(a => a.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`article-cat-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span>{cat.name}</span>
                  <span className="cat-count-badge">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Listing Content */}
      <section className="section-padding bg-warm-white" style={{ paddingTop: '50px' }}>
        <div className="site-container">
          {/* Featured Spotlight Article */}
          {spotlightArticle && (
            <div
              className="articles-spotlight-card"
              onClick={() => onSelectArticle(spotlightArticle.slug)}
            >
              <div className="spotlight-img-col">
                <img
                  src={spotlightArticle.coverImage || '/forher_facial_treatment_real.jpg'}
                  alt={spotlightArticle.title}
                />
                <span className="spotlight-badge">BÀI VIẾT TIÊU ĐIỂM</span>
              </div>
              <div className="spotlight-info-col">
                <div className="spotlight-meta">
                  <span className="spotlight-cat">{spotlightArticle.categoryName}</span>
                  <span>•</span>
                  <span>{formatPublishDate(spotlightArticle.publishedAt)}</span>
                  <span>•</span>
                  <span>{spotlightArticle.readTime || '5 phút đọc'}</span>
                </div>
                <h2 className="spotlight-title">{spotlightArticle.title}</h2>
                <p className="spotlight-excerpt">{spotlightArticle.excerpt}</p>
                <div className="spotlight-footer">
                  <span className="spotlight-author">{spotlightArticle.author}</span>
                  <button
                    type="button"
                    className="btn-primary-gold"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectArticle(spotlightArticle.slug);
                    }}
                  >
                    Đọc Bài Viết Này →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          {filteredArticles.length === 0 ? (
            <div className="articles-empty-box">
              <h3>Không tìm thấy bài viết phù hợp</h3>
              <p>Hãy thử từ khóa khác hoặc chọn xem tất cả chuyên mục làm đẹp của FORHER Spa.</p>
              <button
                type="button"
                className="btn-outline-gold"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                Xem Tất Cả Bài Viết
              </button>
            </div>
          ) : (
            <div className="forher-blog-grid">
              {filteredArticles.map((post) => (
                <article
                  key={post.id}
                  className="forher-blog-card"
                  onClick={() => onSelectArticle(post.slug)}
                >
                  <div className="blog-card-img-wrap">
                    <img
                      src={post.coverImage || '/forher_facial_treatment_real.jpg'}
                      alt={post.title}
                      className="blog-card-img"
                      loading="lazy"
                    />
                    <span className="blog-card-cat-badge">{post.categoryName}</span>
                    {post.isFeatured && (
                      <span className="blog-card-featured-pill">Nổi Bật</span>
                    )}
                  </div>

                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <span>{formatPublishDate(post.publishedAt)}</span>
                      <span className="meta-dot">•</span>
                      <span>{post.readTime || '4 phút đọc'}</span>
                      <span className="meta-dot">•</span>
                      <span>{post.views || 1} lượt xem</span>
                    </div>

                    <h3 className="blog-card-title">{post.title}</h3>
                    <p className="blog-card-excerpt">{post.excerpt}</p>

                    <div className="blog-card-footer">
                      <span className="blog-card-author">{post.author}</span>
                      <button
                        type="button"
                        className="blog-card-read-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectArticle(post.slug);
                        }}
                      >
                        Đọc chi tiết →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Bottom Invite Banner */}
          <div className="about-invite-box" style={{ marginTop: '60px' }}>
            <div className="invite-text-col">
              <h4 className="invite-title">Bạn Muốn Được Chuyên Viên Tư Vấn Phác Đồ Riêng Cho Làn Da?</h4>
              <p className="invite-desc">
                Đặt lịch hẹn trực tuyến hoặc nhắn Zalo cho FORHER Beauty & Spa (515 Bà Hạt, P. Diên Hồng, Quận 10) để được kiểm tra da miễn phí và chuẩn bị phòng riêng chu đáo.
              </p>
            </div>
            <div className="invite-action-col">
              <button
                type="button"
                className="btn-primary-gold"
                onClick={() => onBookService(null)}
              >
                Đặt Lịch Hẹn Ngay
              </button>
              {onOpenAdmin && (
                <button
                  type="button"
                  className="btn-outline-gold"
                  onClick={onOpenAdmin}
                  title="Đăng bài viết mới trong trang Quản Trị"
                >
                  Đăng Bài (Admin)
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

