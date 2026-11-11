import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArticlesStorage,
  ARTICLE_CATEGORIES,
  SPA_GALLERY_PRESETS,
  slugifyVietnamese,
  estimateReadingTime,
  compressImageFileToDataUrl
} from '../data/articlesStorage';
import {
  AI_WRITING_TONES,
  QUICK_TOPIC_PRESETS,
  generateAiSeoArticle,
  generateSeoTitleSuggestions,
  generateFaqAppendBlock,
  polishAndOptimizeUserDraft,
  polishSelectedTextSnippet,
  evaluateSeoScore,
  getSavedGeminiKey,
  saveGeminiKey
} from '../data/aiSeoWriter';
import { SERVICES_CATALOG } from '../data/servicesData';
import { formatArticleHtml, formatPublishDate } from './ArticlesPage';

export default function AdminArticlesManager({
  session,
  isBoss,
  externalTriggerCreate = 0,
  onArticlesCountChange
}) {
  const [articles, setArticles] = useState(() => ArticlesStorage.getAllArticles(true));
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'published' | 'draft' | 'featured'
  const [toastMsg, setToastMsg] = useState(null);

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(() => Boolean(externalTriggerCreate > 0));
  const [editingArticle, setEditingArticle] = useState(null);
  const [editorMode, setEditorMode] = useState('write'); // 'write' | 'preview'
  const [coverPickerMode, setCoverPickerMode] = useState('preset'); // 'upload' | 'preset' | 'url'
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingInline, setIsUploadingInline] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // AI SEO Assistant State
  const [showAiPanel, setShowAiPanel] = useState(true);
  const [aiTopicInput, setAiTopicInput] = useState('');
  const [aiTone, setAiTone] = useState(AI_WRITING_TONES[0].id);
  const [aiCustomKeywords, setAiCustomKeywords] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isAiPolishing, setIsAiPolishing] = useState(false);
  const [aiPolishReport, setAiPolishReport] = useState(null);
  const [draftBackupBeforePolish, setDraftBackupBeforePolish] = useState(null);
  const [aiSuggestedTitles, setAiSuggestedTitles] = useState([]);
  const [showGeminiKeyConfig, setShowGeminiKeyConfig] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(() => getSavedGeminiKey());

  // Preview Modal for existing article
  const [previewingArticle, setPreviewingArticle] = useState(null);

  // Delete Confirmation State
  const [deletingArticle, setDeletingArticle] = useState(null);

  const contentTextareaRef = useRef(null);
  const inlineFileInputRef = useRef(null);

  const defaultAuthor = session?.fullName || 'Chuyên viên FORHER Spa';

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'cham-soc-mun',
    excerpt: '',
    content: '',
    coverImage: '/forher_facial_treatment_real.jpg',
    author: defaultAuthor,
    readTime: '4 phút đọc',
    tags: 'FORHER Spa Quận 10, Chăm sóc da, Làm đẹp',
    relatedServiceId: 'nm-chuan-ykhoa',
    status: 'published',
    isFeatured: false
  });

  // Real-time SEO Score Evaluation
  const seoEvaluation = useMemo(() => evaluateSeoScore(formData), [formData]);

  const showToast = (message, type = 'success') => {
    setToastMsg({ message, type });
    setTimeout(() => {
      setToastMsg(null);
    }, 3800);
  };

  const loadArticles = async () => {
    const local = ArticlesStorage.getAllArticles(true);
    setArticles(local);
    if (onArticlesCountChange) onArticlesCountChange(local.length);

    const syncRes = await ArticlesStorage.syncArticlesFromSupabase();
    if (syncRes?.success) {
      const updated = ArticlesStorage.getAllArticles(true);
      setArticles(updated);
      if (onArticlesCountChange) onArticlesCountChange(updated.length);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  // Trigger create modal when parent header button "+ Đăng Bài Viết Mới" is clicked
  useEffect(() => {
    if (externalTriggerCreate > 0) {
      handleOpenCreate(true);
    }
  }, [externalTriggerCreate]);

  // Stats
  const articleStats = useMemo(() => {
    const total = articles.length;
    const published = articles.filter(a => a.status === 'published').length;
    const draft = articles.filter(a => a.status === 'draft').length;
    const featured = articles.filter(a => a.isFeatured).length;
    const totalViews = articles.reduce((sum, a) => sum + (Number(a.views) || 0), 0);
    return { total, published, draft, featured, totalViews };
  }, [articles]);

  // Filtered list
  const filteredArticles = useMemo(() => {
    return articles.filter(item => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (statusFilter === 'published' && item.status !== 'published') return false;
      if (statusFilter === 'draft' && item.status !== 'draft') return false;
      if (statusFilter === 'featured' && !item.isFeatured) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = (item.title || '').toLowerCase().includes(q);
        const matchCat = (item.categoryName || '').toLowerCase().includes(q);
        const matchTags = (item.tags || '').toLowerCase().includes(q);
        const matchAuthor = (item.author || '').toLowerCase().includes(q);
        if (!matchTitle && !matchCat && !matchTags && !matchAuthor) return false;
      }
      return true;
    });
  }, [articles, categoryFilter, statusFilter, searchTerm]);

  // Open Create Modal
  const handleOpenCreate = (openAiByDefault = true) => {
    setEditingArticle(null);
    setEditorMode('write');
    setCoverPickerMode('preset');
    setShowAiPanel(openAiByDefault);
    setAiSuggestedTitles([]);
    setAiPolishReport(null);
    setDraftBackupBeforePolish(null);
    setFormData({
      title: '',
      slug: '',
      category: 'cham-soc-mun',
      excerpt: '',
      content: '',
      coverImage: '/forher_facial_treatment_real.jpg',
      author: session?.fullName || 'Chuyên viên FORHER Spa',
      readTime: '4 phút đọc',
      tags: 'FORHER Spa Quận 10, Chăm sóc da, Làm đẹp chuẩn y khoa',
      relatedServiceId: SERVICES_CATALOG[0]?.id || '',
      status: 'published',
      isFeatured: false
    });
    setIsEditorOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (article) => {
    setEditingArticle(article);
    setEditorMode('write');
    setShowAiPanel(false);
    setAiSuggestedTitles([]);
    setAiPolishReport(null);
    setDraftBackupBeforePolish(null);
    setCoverPickerMode(
      article.coverImage?.startsWith('data:')
        ? 'upload'
        : SPA_GALLERY_PRESETS.some(p => p.url === article.coverImage)
        ? 'preset'
        : 'url'
    );
    setFormData({
      title: article.title || '',
      slug: article.slug || '',
      category: article.category || 'cham-soc-mun',
      excerpt: article.excerpt || '',
      content: article.content || '',
      coverImage: article.coverImage || '/forher_facial_treatment_real.jpg',
      author: article.author || defaultAuthor,
      readTime: article.readTime || '4 phút đọc',
      tags: article.tags || '',
      relatedServiceId: article.relatedServiceId || '',
      status: article.status || 'published',
      isFeatured: Boolean(article.isFeatured)
    });
    setIsEditorOpen(true);
  };

  // AI Action: Proofread, Polish & SEO-Optimize User's Existing Draft
  const handleAiPolishUserDraft = async () => {
    if (!formData.content.trim() && !formData.title.trim()) {
      alert('Vui lòng gõ nội dung nháp hoặc tiêu đề bài viết của bạn trước khi bấm nút Nhờ AI Sửa Chữa Văn Phong Chuẩn SEO!');
      return;
    }

    // Save backup so user can undo with 1 click
    setDraftBackupBeforePolish({ ...formData });
    setIsAiPolishing(true);
    try {
      const polished = await polishAndOptimizeUserDraft({
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        serviceId: formData.relatedServiceId,
        tags: formData.tags
      });

      setFormData(prev => ({
        ...prev,
        title: polished.title,
        slug: !editingArticle ? polished.slug : prev.slug || polished.slug,
        excerpt: polished.excerpt,
        content: polished.content,
        tags: polished.tags,
        readTime: polished.readTime
      }));
      setAiPolishReport(polished.improvements || []);
      showToast('AI đã sửa lỗi câu chữ, trau chuốt văn phong và tối ưu bài viết đạt 100/100 điểm SEO!');
    } catch (err) {
      alert('Không thể sửa văn bằng AI: ' + (err.message || 'Vui lòng thử lại'));
    } finally {
      setIsAiPolishing(false);
    }
  };

  // AI Action: Polish Highlighted / Selected Text Snippet in Content Editor
  const handleAiPolishSelectedSnippet = () => {
    const textarea = contentTextareaRef.current;
    if (textarea && textarea.selectionStart !== textarea.selectionEnd) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const current = formData.content || '';
      const selected = current.substring(start, end);
      setDraftBackupBeforePolish({ ...formData });
      const polishedSnippet = polishSelectedTextSnippet(selected, formData.relatedServiceId);
      const nextContent = current.substring(0, start) + polishedSnippet + current.substring(end);
      setFormData(prev => ({
        ...prev,
        content: nextContent,
        readTime: estimateReadingTime(nextContent)
      }));
      setAiPolishReport([
        'Đã sửa lỗi viết tắt, dấu câu và trau chuốt đoạn văn bạn vừa bôi đen',
        'Đã in đậm từ khóa SEO trọng tâm trong đoạn văn'
      ]);
      showToast('AI đã trau chuốt xong đoạn văn bạn bôi đen!');
      return;
    }
    // If nothing is highlighted, polish the entire draft
    handleAiPolishUserDraft();
  };

  // Undo AI Polish back to user's original draft
  const handleUndoAiPolish = () => {
    if (!draftBackupBeforePolish) return;
    setFormData(draftBackupBeforePolish);
    setDraftBackupBeforePolish(null);
    setAiPolishReport(null);
    showToast('Đã khôi phục lại bản thảo gốc của bạn trước khi AI sửa!');
  };

  // AI Action 1: Generate Full SEO Article
  const handleAiGenerateFullArticle = async () => {
    const selectedSvc = SERVICES_CATALOG.find(s => s.id === formData.relatedServiceId);
    const effectiveTopic =
      aiTopicInput.trim() ||
      formData.title.trim() ||
      (selectedSvc ? `${selectedSvc.name} chuẩn y khoa tại Quận 10` : '');

    if (!effectiveTopic) {
      alert('Vui lòng nhập chủ đề muốn viết hoặc bấm chọn 1 chủ đề gợi ý bên dưới!');
      return;
    }

    setIsAiGenerating(true);
    try {
      const generated = await generateAiSeoArticle({
        topic: effectiveTopic,
        category: formData.category,
        tone: aiTone,
        serviceId: formData.relatedServiceId,
        customKeywords: aiCustomKeywords
      });

      setFormData(prev => ({
        ...prev,
        title: generated.title,
        slug: generated.slug,
        category: generated.category || prev.category,
        excerpt: generated.excerpt,
        content: generated.content,
        coverImage: generated.coverImage || prev.coverImage,
        tags: generated.tags,
        relatedServiceId: generated.relatedServiceId || prev.relatedServiceId,
        readTime: generated.readTime
      }));

      // Also generate 5 alternative titles in case user wants to switch title
      const altTitles = generateSeoTitleSuggestions(
        effectiveTopic,
        formData.category,
        formData.relatedServiceId
      );
      setAiSuggestedTitles(altTitles);

      showToast(`AI đã viết xong trọn bộ bài chuẩn SEO (Điểm SEO: 100/100)!`);
    } catch (err) {
      alert('Có lỗi khi tạo nội dung AI: ' + (err.message || 'Vui lòng thử lại'));
    } finally {
      setIsAiGenerating(false);
    }
  };

  // AI Action 2: Suggest 5 SEO Titles
  const handleAiSuggestTitles = () => {
    const selectedSvc = SERVICES_CATALOG.find(s => s.id === formData.relatedServiceId);
    const effectiveTopic =
      aiTopicInput.trim() ||
      formData.title.trim() ||
      (selectedSvc ? selectedSvc.name : 'Chăm sóc da chuẩn y khoa');

    const titles = generateSeoTitleSuggestions(
      effectiveTopic,
      formData.category,
      formData.relatedServiceId
    );
    setAiSuggestedTitles(titles);
  };

  // AI Action 3: Append FAQ Section to Content
  const handleAiAppendFaq = () => {
    const faqHtml = generateFaqAppendBlock(
      formData.title,
      formData.category,
      formData.relatedServiceId
    );
    setFormData(prev => {
      const nextContent = (prev.content || '') + '\n' + faqHtml;
      return {
        ...prev,
        content: nextContent,
        readTime: estimateReadingTime(nextContent)
      };
    });
    showToast('AI đã thêm mục Câu Hỏi Thường Gặp (FAQ chuẩn SEO) vào cuối bài viết!');
  };

  // Handle Title Change & Auto-Slug
  const handleTitleChange = (val) => {
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: !editingArticle ? slugifyVietnamese(val) : prev.slug
    }));
  };

  // Handle Cover Image File Upload
  const handleCoverFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    try {
      const dataUrl = await compressImageFileToDataUrl(file, 1100, 0.82);
      setFormData(prev => ({ ...prev, coverImage: dataUrl }));
      showToast('Đã tải ảnh đại diện bài viết lên thành công!');
    } catch (err) {
      alert(err.message || 'Lỗi tải ảnh');
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Insert HTML Snippet into Content Textarea
  const insertAtCursor = (beforeText, afterText = '', defaultSample = '') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) {
      setFormData(prev => ({
        ...prev,
        content: prev.content + '\n' + beforeText + defaultSample + afterText
      }));
      return;
    }

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const current = formData.content || '';
    const selected = current.substring(start, end) || defaultSample;
    const replacement = beforeText + selected + afterText;
    const updatedContent = current.substring(0, start) + replacement + current.substring(end);

    setFormData(prev => ({
      ...prev,
      content: updatedContent,
      readTime: estimateReadingTime(updatedContent)
    }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + beforeText.length,
        start + beforeText.length + selected.length
      );
    }, 20);
  };

  // Upload Inline Image into Content
  const handleInlineImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingInline(true);
    try {
      const dataUrl = await compressImageFileToDataUrl(file, 1000, 0.8);
      const imgTag = `\n<img src="${dataUrl}" alt="${formData.title || 'Hình ảnh FORHER Beauty & Spa'}" />\n`;
      insertAtCursor(imgTag, '', '');
      showToast('Đã chèn hình ảnh vào nội dung bài viết!');
    } catch (err) {
      alert(err.message || 'Không thể chèn ảnh');
    } finally {
      setIsUploadingInline(false);
      if (inlineFileInputRef.current) inlineFileInputRef.current.value = '';
    }
  };

  // Save Article (Create or Update)
  const handleSaveArticle = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết (hoặc bấm nút AI Viết Bài Chuẩn SEO)!');
      return;
    }
    if (!formData.content.trim()) {
      alert('Vui lòng nhập nội dung bài viết (hoặc bấm nút AI Viết Bài Chuẩn SEO)!');
      return;
    }

    setIsSaving(true);
    try {
      if (editingArticle) {
        const res = await ArticlesStorage.updateArticle(editingArticle.id, formData);
        if (res.success) {
          showToast(`Đã cập nhật bài viết "${res.article.title}" thành công!`);
          setIsEditorOpen(false);
          loadArticles();
        } else {
          alert(res.message || 'Lỗi cập nhật bài viết');
        }
      } else {
        const res = await ArticlesStorage.createArticle(formData);
        if (res.success) {
          showToast(`Đã đăng bài viết mới "${res.article.title}" thành công!`);
          setIsEditorOpen(false);
          loadArticles();
        } else {
          alert(res.message || 'Lỗi đăng bài viết');
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Publish / Draft Status Quickly
  const handleToggleStatus = async (article) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    const res = await ArticlesStorage.updateArticle(article.id, { status: newStatus });
    if (res.success) {
      showToast(
        newStatus === 'published'
          ? `Đã công khai bài viết "${article.title}" lên Website!`
          : `Đã chuyển bài viết "${article.title}" sang Bản nháp (Ẩn).`
      );
      loadArticles();
    }
  };

  // Toggle Featured Star Quickly
  const handleToggleFeatured = async (article) => {
    const nextFeatured = !article.isFeatured;
    const res = await ArticlesStorage.updateArticle(article.id, { isFeatured: nextFeatured });
    if (res.success) {
      showToast(
        nextFeatured
          ? `Đã ghim "${article.title}" làm bài viết tiêu điểm đầu trang!`
          : `Đã bỏ ghim nổi bật cho bài viết "${article.title}".`
      );
      loadArticles();
    }
  };

  // Confirm Delete Article
  const handleConfirmDelete = async () => {
    if (!deletingArticle) return;
    const res = await ArticlesStorage.deleteArticle(deletingArticle.id);
    if (res.success) {
      showToast(`Đã xóa bài viết "${deletingArticle.title}".`, 'warning');
      setDeletingArticle(null);
      loadArticles();
    } else {
      alert(res.message || 'Không thể xóa bài viết');
    }
  };

  return (
    <div className="admin-tab-content admin-articles-wrapper">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`attendance-toast-alert ${toastMsg.type === 'warning' ? 'warning' : 'success'}`}
          style={{ marginBottom: '16px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{toastMsg.message}</span>
          </div>
          <button type="button" className="toast-close-btn" onClick={() => setToastMsg(null)}>
            ✕
          </button>
        </div>
      )}

      {/* Top Header & Quick Post CTA */}
      <div className="admin-articles-top-header">
        <div>
          <h3 className="admin-section-heading">Quản Lý & Đăng Bài Viết Website (Tích Hợp AI Chuẩn SEO)</h3>
          <p className="admin-section-sub">
            Tự động viết bài chuẩn SEO Google chỉ với 1 chạm bằng Trợ lý AI FORHER, hoặc tự soạn thảo và xuất bản lên trang <strong>/bai-viet</strong>.
          </p>
        </div>

        <div className="admin-articles-top-btns">
          <a
            href="/bai-viet"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Mở Trang Bài Viết</span>
          </a>
          <button
            type="button"
            className="btn-primary-gold"
            onClick={() => handleOpenCreate(true)}
          >
            + AI Viết & Đăng Bài Mới
          </button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="admin-articles-stats-grid">
        <div className="art-stat-box">
          <span className="art-stat-num">{articleStats.total}</span>
          <span className="art-stat-lbl">Tổng Số Bài Viết</span>
        </div>
        <div className="art-stat-box published">
          <span className="art-stat-num">{articleStats.published}</span>
          <span className="art-stat-lbl">Đang Hiển Thị (Công Khai)</span>
        </div>
        <div className="art-stat-box draft">
          <span className="art-stat-num">{articleStats.draft}</span>
          <span className="art-stat-lbl">Bản Nháp / Đang Ẩn</span>
        </div>
        <div className="art-stat-box featured">
          <span className="art-stat-num">{articleStats.featured}</span>
          <span className="art-stat-lbl">Ghim Tiêu Điểm</span>
        </div>
        <div className="art-stat-box views">
          <span className="art-stat-num">{articleStats.totalViews}</span>
          <span className="art-stat-lbl">Tổng Lượt Đọc</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="admin-filter-toolbar" style={{ marginTop: '16px', marginBottom: '18px' }}>
        <div className="admin-search-box" style={{ flex: '1 1 280px' }}>
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, từ khóa, tác giả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="admin-filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Lọc theo chuyên mục"
          >
            {ARTICLE_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Lọc theo trạng thái"
          >
            <option value="all">Tất cả trạng thái ({articleStats.total})</option>
            <option value="published">Đang công khai ({articleStats.published})</option>
            <option value="draft">Bản nháp / Ẩn ({articleStats.draft})</option>
            <option value="featured">Bài ghim nổi bật ({articleStats.featured})</option>
          </select>
        </div>
      </div>

      {/* Articles List Table (Desktop) & Cards (Mobile) */}
      {filteredArticles.length === 0 ? (
        <div className="admin-empty-state">
          <p>Không tìm thấy bài viết nào khớp với bộ lọc hiện tại.</p>
          <button type="button" className="btn-primary-gold" onClick={() => handleOpenCreate(true)}>
            + AI Viết Bài Mới Ngay
          </button>
        </div>
      ) : (
        <div className="admin-articles-list-grid">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className={`admin-article-item-card ${art.status === 'draft' ? 'is-draft' : ''}`}
            >
              <div className="admin-art-thumb-wrap">
                <img
                  src={art.coverImage || '/forher_facial_treatment_real.jpg'}
                  alt={art.title}
                  className="admin-art-thumb"
                />
                <span className={`admin-art-status-pill ${art.status}`}>
                  {art.status === 'published' ? 'Công khai' : 'Bản nháp'}
                </span>
              </div>

              <div className="admin-art-content-col">
                <div className="admin-art-meta-top">
                  <span className="admin-art-cat-tag">{art.categoryName}</span>
                  <span className="admin-art-date">
                    {formatPublishDate(art.publishedAt)} • {art.author} • {art.views || 1} lượt xem
                  </span>
                </div>

                <h4 className="admin-art-title">
                  {art.isFeatured && <span className="featured-star-inline">[Nổi bật] </span>}
                  {art.title}
                </h4>

                <p className="admin-art-excerpt">{art.excerpt}</p>

                <div className="admin-art-slug-line">
                  <span>Đường dẫn: </span>
                  <code>/bai-viet/{art.slug}</code>
                </div>
              </div>

              <div className="admin-art-actions-col">
                <button
                  type="button"
                  className="btn-tbl-action edit"
                  onClick={() => handleOpenEdit(art)}
                >
                  Sửa Bài
                </button>

                <button
                  type="button"
                  className="btn-tbl-action view"
                  onClick={() => setPreviewingArticle(art)}
                >
                  Xem Thử
                </button>

                <button
                  type="button"
                  className={`btn-tbl-action ${art.isFeatured ? 'bill' : ''}`}
                  onClick={() => handleToggleFeatured(art)}
                  title="Ghim hoặc bỏ ghim bài viết nổi bật đầu trang"
                >
                  {art.isFeatured ? 'Đã Ghim' : 'Ghim Đầu'}
                </button>

                <button
                  type="button"
                  className="btn-tbl-action"
                  onClick={() => handleToggleStatus(art)}
                >
                  {art.status === 'published' ? 'Ẩn (Nháp)' : 'Đăng Lên'}
                </button>

                <button
                  type="button"
                  className="btn-tbl-action delete"
                  onClick={() => setDeletingArticle(art)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==============================================================================
          MODAL 1: TRÌNH SOẠN THẢO & TRỢ LÝ AI VIẾT BÀI CHUẨN SEO
          ============================================================================== */}
      {isEditorOpen && (
        <div className="admin-submodal-backdrop" onClick={() => setIsEditorOpen(false)}>
          <div
            className="admin-submodal-card admin-article-editor-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-submodal-header">
              <div>
                <h3>
                  {editingArticle
                    ? `Chỉnh Sửa Bài Viết #${editingArticle.id}`
                    : 'Đăng Bài Viết Mới (Trợ Lý AI Chuẩn SEO)'}
                </h3>
              </div>

              <div className="editor-header-right-tabs">
                <button
                  type="button"
                  className={`editor-mode-btn ${showAiPanel ? 'active' : ''}`}
                  onClick={() => {
                    setEditorMode('write');
                    setShowAiPanel(!showAiPanel);
                  }}
                >
                  {showAiPanel ? 'Thu Gọn AI' : 'Mở Trợ Lý AI'}
                </button>
                <button
                  type="button"
                  className={`editor-mode-btn ${editorMode === 'write' ? 'active' : ''}`}
                  onClick={() => setEditorMode('write')}
                >
                  Soạn Thảo
                </button>
                <button
                  type="button"
                  className={`editor-mode-btn ${editorMode === 'preview' ? 'active' : ''}`}
                  onClick={() => setEditorMode('preview')}
                >
                  Xem Trước
                </button>
                <button
                  type="button"
                  className="btn-close-submodal"
                  onClick={() => setIsEditorOpen(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            {editorMode === 'preview' ? (
              /* LIVE PREVIEW TAB INSIDE MODAL */
              <div className="admin-article-live-preview">
                <div className="preview-banner-note">
                  <span>
                    Điểm Chuẩn SEO hiện tại: <strong>{seoEvaluation.score}/100 điểm</strong> ({seoEvaluation.wordCount} từ)
                  </span>
                  <button
                    type="button"
                    className="btn-outline-gold"
                    onClick={() => setEditorMode('write')}
                  >
                    Quay Lại Chỉnh Sửa
                  </button>
                </div>

                <div className="preview-article-sheet">
                  <span className="article-cat-pill">
                    {ArticlesStorage.getCategoryName(formData.category)}
                  </span>
                  <h1 className="article-detail-title" style={{ marginTop: '10px' }}>
                    {formData.title || '(Chưa nhập tiêu đề bài viết)'}
                  </h1>
                  <p className="article-detail-lead">
                    {formData.excerpt || '(Mô tả tóm tắt sẽ tự động trích xuất từ nội dung bài viết)'}
                  </p>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Tác giả: <strong>{formData.author}</strong> • {formData.readTime}
                  </div>
                  {formData.coverImage && (
                    <div className="article-cover-showcase" style={{ marginBottom: '20px' }}>
                      <img
                        src={formData.coverImage}
                        alt={formData.title}
                        className="article-cover-full-img"
                      />
                    </div>
                  )}
                  <div
                    className="article-rich-content"
                    dangerouslySetInnerHTML={{
                      __html: formatArticleHtml(
                        formData.content || '<p>Chưa có nội dung bài viết...</p>'
                      )
                    }}
                  />
                </div>

                <div className="submodal-actions" style={{ padding: '16px 24px' }}>
                  <button
                    type="button"
                    className="btn-primary-gold"
                    onClick={handleSaveArticle}
                    disabled={isSaving}
                  >
                    {isSaving
                      ? 'Đang Lưu...'
                      : editingArticle
                      ? 'Lưu Cập Nhật Bài Viết'
                      : 'Xuất Bản Bài Viết Ngay'}
                  </button>
                  <button
                    type="button"
                    className="btn-outline-gold"
                    onClick={() => setEditorMode('write')}
                  >
                    Tiếp Tục Soạn Thảo
                  </button>
                </div>
              </div>
            ) : (
              /* WRITE / EDIT FORM TAB WITH AI SEO STUDIO */
              <form onSubmit={handleSaveArticle} className="admin-submodal-form article-editor-form">
                {/* ==============================================================
                    TRỢ LÝ AI VIẾT BÀI CHUẨN SEO (AI SEO COPILOT STUDIO)
                   ============================================================== */}
                {showAiPanel && (
                  <div className="ai-seo-studio-box">
                    <div className="ai-studio-header">
                      <div className="ai-studio-title-wrap">
                        <span className="ai-badge-pulse">AI SEO STUDIO</span>
                        <h4>Trợ Lý AI Tự Động Viết Bài Chuẩn SEO Google Cho FORHER Spa</h4>
                      </div>
                      <button
                        type="button"
                        className="btn-ai-key-toggle"
                        onClick={() => setShowGeminiKeyConfig(!showGeminiKeyConfig)}
                      >
                        {geminiApiKey ? 'Đã kết nối Gemini Key' : 'Cài đặt Gemini Key (Tùy chọn)'}
                      </button>
                    </div>

                    {showGeminiKeyConfig && (
                      <div className="ai-gemini-config-bar">
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                            Google Gemini API Key (Không bắt buộc — Mặc định hệ thống đã có sẵn FORHER AI SEO Engine miễn phí):
                          </label>
                          <input
                            type="password"
                            placeholder="Dán mã AIzaSy... từ Google AI Studio nếu muốn dùng Gemini 2.5 Flash..."
                            value={geminiApiKey}
                            onChange={(e) => {
                              setGeminiApiKey(e.target.value);
                              saveGeminiKey(e.target.value);
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          className="btn-outline-gold"
                          onClick={() => {
                            saveGeminiKey(geminiApiKey);
                            setShowGeminiKeyConfig(false);
                            showToast('Đã lưu cấu hình AI!');
                          }}
                        >
                          Lưu & Đóng
                        </button>
                      </div>
                    )}

                    {/* Quick Topic Presets */}
                    <div className="ai-quick-presets">
                      <span className="preset-lbl">Chọn nhanh chủ đề gợi ý (1 chạm):</span>
                      <div className="preset-chips-row">
                        {QUICK_TOPIC_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="ai-preset-chip"
                            onClick={() => {
                              setAiTopicInput(preset.topic);
                              setFormData(prev => ({
                                ...prev,
                                category: preset.category,
                                relatedServiceId: preset.serviceId
                              }));
                            }}
                          >
                            + {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Topic Input & Tone Selection */}
                    <div className="form-group" style={{ marginTop: '10px', marginBottom: '10px' }}>
                      <label>Nhập Chủ Đề / Ý Tưởng Hoặc Từ Khóa Bạn Muốn AI Viết:</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Kinh nghiệm triệt lông nách không thâm tại Quận 10, Ưu đãi tháng 11 giảm 30%..."
                        value={aiTopicInput}
                        onChange={(e) => setAiTopicInput(e.target.value)}
                        style={{ background: '#FFFFFF', border: '1.5px solid var(--primary-gold)' }}
                      />
                    </div>

                    <div className="form-row-two" style={{ marginBottom: '12px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Phong Cách Viết Của AI:</label>
                        <select value={aiTone} onChange={(e) => setAiTone(e.target.value)}>
                          {AI_WRITING_TONES.map(t => (
                            <option key={t.id} value={t.id}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Gắn Dịch Vụ Bảng Giá FORHER Vào Bài (Tự động chèn giá):</label>
                        <select
                          value={formData.relatedServiceId}
                          onChange={(e) =>
                            setFormData({ ...formData, relatedServiceId: e.target.value })
                          }
                        >
                          <option value="">-- Tư vấn tổng quát mọi dịch vụ --</option>
                          {SERVICES_CATALOG.map(s => (
                            <option key={s.id} value={s.id}>
                              [{s.categoryName}] {s.name} ({s.singlePriceDisplay})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* AI Action Buttons */}
                    <div className="ai-studio-action-row">
                      <button
                        type="button"
                        className="btn-ai-generate-main"
                        onClick={handleAiGenerateFullArticle}
                        disabled={isAiGenerating || isAiPolishing}
                      >
                        {isAiGenerating
                          ? 'AI Đang Phân Tích Từ Khóa & Viết Bài Chuẩn SEO...'
                          : 'AI Tự Động Viết Trọn Bộ Bài Chuẩn SEO (1-Chạm)'}
                      </button>

                      <button
                        type="button"
                        className="btn-ai-polish-action"
                        onClick={handleAiPolishUserDraft}
                        disabled={isAiPolishing || isAiGenerating}
                      >
                        {isAiPolishing
                          ? 'AI Đang Sửa Văn & Chuẩn Hóa SEO...'
                          : 'Nhờ AI Sửa Chữa Văn Đang Viết Chuẩn SEO'}
                      </button>

                      <button
                        type="button"
                        className="btn-ai-sub-action"
                        onClick={handleAiSuggestTitles}
                      >
                        Gợi Ý 5 Tiêu Đề Hút Khách
                      </button>

                      <button
                        type="button"
                        className="btn-ai-sub-action"
                        onClick={handleAiAppendFaq}
                      >
                        + Chèn Mục Hỏi Đáp (FAQ)
                      </button>
                    </div>

                    {/* 5 Suggested Titles Picker */}
                    {aiSuggestedTitles.length > 0 && (
                      <div className="ai-suggested-titles-box">
                        <span className="sug-title-lbl">
                          Bấm chọn 1 trong 5 tiêu đề chuẩn SEO dưới đây để áp dụng:
                        </span>
                        <div className="sug-titles-list">
                          {aiSuggestedTitles.map((sug, i) => (
                            <button
                              key={i}
                              type="button"
                              className={`sug-title-item ${formData.title === sug ? 'active' : ''}`}
                              onClick={() => handleTitleChange(sug)}
                            >
                              <span>{i + 1}. {sug}</span>
                              <span className="use-txt">Chọn</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ==============================================================
                    BẢNG CHẤM ĐIỂM CHUẨN SEO REALTIME (SEO SCORE BAR)
                   ============================================================== */}
                <div className="seo-score-analyzer-card">
                  <div className="seo-score-top">
                    <div className="seo-score-badge-wrap">
                      <span
                        className={`seo-score-circle ${
                          seoEvaluation.score >= 80
                            ? 'excellent'
                            : seoEvaluation.score >= 50
                            ? 'good'
                            : 'low'
                        }`}
                      >
                        {seoEvaluation.score}/100
                      </span>
                      <div>
                        <strong>Điểm Chuẩn SEO Google Bài Viết</strong>
                        <p>
                          Độ dài: <strong>{seoEvaluation.wordCount} từ</strong> • Thời gian đọc:{' '}
                          <strong>{formData.readTime}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="seo-score-top-actions">
                      <button
                        type="button"
                        className="btn-seo-quick-fix"
                        onClick={handleAiPolishUserDraft}
                        disabled={isAiPolishing}
                      >
                        {isAiPolishing
                          ? 'AI Đang Sửa Văn...'
                          : 'Nhờ AI Sửa Chữa Văn & Tối Ưu Chuẩn SEO'}
                      </button>
                      {draftBackupBeforePolish && (
                        <button
                          type="button"
                          className="btn-seo-undo"
                          onClick={handleUndoAiPolish}
                        >
                          Hoàn Tác Bản Gốc
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="seo-checks-grid">
                    {seoEvaluation.checks.map((chk, idx) => (
                      <div key={idx} className={`seo-check-item ${chk.ok ? 'pass' : 'warn'}`}>
                        <span>{chk.ok ? 'Đạt:' : 'Cần thêm:'}</span>
                        <span>{chk.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 1. Title & Slug */}
                <div className="form-group">
                  <label>
                    Tiêu Đề Bài Viết <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Quy trình lấy nhân mụn chuẩn y khoa 12 bước tại FORHER Spa..."
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    style={{ fontSize: '1rem', fontWeight: 600 }}
                  />
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label>Đường Dẫn Tĩnh Chuẩn SEO (Slug):</label>
                    <input
                      type="text"
                      placeholder="quy-trinh-lay-nhan-mun-chuan-y-khoa"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Chuyên Mục Bài Viết <span className="req">*</span></label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {ARTICLE_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Author, Related Service & Status */}
                <div className="form-row-three">
                  <div className="form-group">
                    <label>Bút Danh / Tác Giả:</label>
                    <input
                      type="text"
                      placeholder="Chuyên viên FORHER Spa"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Dịch Vụ Gợi Ý Đặt Lịch Cuối Bài:</label>
                    <select
                      value={formData.relatedServiceId}
                      onChange={(e) =>
                        setFormData({ ...formData, relatedServiceId: e.target.value })
                      }
                    >
                      <option value="">-- Tư vấn tổng quát mọi dịch vụ --</option>
                      {SERVICES_CATALOG.map(s => (
                        <option key={s.id} value={s.id}>
                          [{s.categoryName}] {s.name} ({s.singlePriceDisplay})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Trạng Thái Xuất Bản:</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="published">Công khai ngay trên Website</option>
                      <option value="draft">Lưu bản nháp (Chưa hiển thị)</option>
                    </select>
                  </div>
                </div>

                {/* Featured Checkbox */}
                <div className="article-featured-checkbox-row">
                  <label className="featured-check-label">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData({ ...formData, isFeatured: e.target.checked })
                      }
                    />
                    <span>
                      <strong>Ghim làm Bài Viết Tiêu Điểm Nổi Bật</strong> (Ưu tiên hiển thị lớn ở đầu trang Bài Viết & Trang Chủ)
                    </span>
                  </label>
                </div>

                {/* 3. Cover Image Selector */}
                <div className="article-cover-picker-box">
                  <div className="cover-picker-header">
                    <label style={{ margin: 0 }}>Ảnh Đại Diện Bài Viết (Thumbnail):</label>
                    <div className="cover-picker-tabs">
                      <button
                        type="button"
                        className={`cp-tab ${coverPickerMode === 'preset' ? 'active' : ''}`}
                        onClick={() => setCoverPickerMode('preset')}
                      >
                        Kho Ảnh Spa Có Sẵn
                      </button>
                      <button
                        type="button"
                        className={`cp-tab ${coverPickerMode === 'upload' ? 'active' : ''}`}
                        onClick={() => setCoverPickerMode('upload')}
                      >
                        Tải Ảnh Từ Máy/Điện Thoại
                      </button>
                      <button
                        type="button"
                        className={`cp-tab ${coverPickerMode === 'url' ? 'active' : ''}`}
                        onClick={() => setCoverPickerMode('url')}
                      >
                        Dán Link Ảnh
                      </button>
                    </div>
                  </div>

                  <div className="cover-picker-body">
                    {coverPickerMode === 'preset' && (
                      <div className="preset-gallery-grid">
                        {SPA_GALLERY_PRESETS.map(item => (
                          <button
                            key={item.id}
                            type="button"
                            className={`preset-img-btn ${formData.coverImage === item.url ? 'selected' : ''}`}
                            onClick={() =>
                              setFormData(prev => ({ ...prev, coverImage: item.url }))
                            }
                          >
                            <img src={item.url} alt={item.label} />
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {coverPickerMode === 'upload' && (
                      <div className="upload-cover-dropzone">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverFileUpload}
                          id="cover-upload-input"
                        />
                        <label htmlFor="cover-upload-input" className="btn-upload-trigger">
                          {isUploadingCover
                            ? 'Đang xử lý & tối ưu ảnh...'
                            : '+ Bấm Chọn Ảnh Từ Thiết Bị (Tự động tối ưu dung lượng)'}
                        </label>
                      </div>
                    )}

                    {coverPickerMode === 'url' && (
                      <input
                        type="text"
                        placeholder="Dán đường dẫn ảnh (https://... hoặc /forher_spa_room_real.jpg)"
                        value={formData.coverImage}
                        onChange={(e) =>
                          setFormData({ ...formData, coverImage: e.target.value })
                        }
                      />
                    )}

                    {/* Current Cover Preview */}
                    {formData.coverImage && (
                      <div className="selected-cover-preview-bar">
                        <img src={formData.coverImage} alt="Preview" />
                        <div>
                          <strong>Ảnh đại diện đang chọn</strong>
                          <p>Hiển thị sắc nét trên thẻ bài viết và đầu trang chi tiết.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Excerpt / Short Description */}
                <div className="form-group">
                  <label>Tóm Tắt Ngắn Chuẩn SEO (Meta Description):</label>
                  <textarea
                    rows={2}
                    placeholder="Nhập 1 - 2 câu tóm tắt nội dung chính của bài viết..."
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  />
                </div>

                {/* 5. Rich Content Editor with AI Proofreading & Formatting Toolbar */}
                <div className="form-group">
                  <div className="content-editor-label-row">
                    <label style={{ margin: 0 }}>
                      Nội Dung Chi Tiết Bài Viết <span className="req">*</span>
                    </label>
                    <div className="editor-top-ai-btns">
                      <button
                        type="button"
                        className="btn-ai-polish-inline"
                        onClick={handleAiPolishUserDraft}
                        disabled={isAiPolishing}
                      >
                        {isAiPolishing
                          ? 'AI Đang Sửa Văn & Tối Ưu SEO...'
                          : 'Nhờ AI Sửa Chữa Văn Phong Chuẩn SEO (Giữ Nguyên Ý)'}
                      </button>
                      <button
                        type="button"
                        className="btn-insert-template"
                        onClick={handleAiGenerateFullArticle}
                        disabled={isAiGenerating}
                      >
                        AI Tự Viết Mới Theo Tiêu Đề
                      </button>
                    </div>
                  </div>

                  {/* Dedicated AI Proofread & SEO Polish Box right above textarea */}
                  <div className="ai-polish-writer-box">
                    <div className="ai-polish-writer-info">
                      <strong>Bạn đang tự viết bài? Hãy để AI hỗ trợ sửa văn chuẩn SEO:</strong>
                      <span>
                        Chỉ cần gõ nội dung nháp hoặc các gạch đầu dòng bên dưới, sau đó bấm nút để AI tự động sửa lỗi chính tả, viết lại câu chữ mượt mà, chia thẻ H2/H3 và tối ưu từ khóa chuẩn SEO Google (100/100 điểm).
                      </span>
                    </div>
                    <div className="ai-polish-writer-actions">
                      <button
                        type="button"
                        className="btn-polish-primary"
                        onClick={handleAiPolishUserDraft}
                        disabled={isAiPolishing}
                      >
                        {isAiPolishing
                          ? 'Đang Sửa Văn & Chuẩn Hóa SEO...'
                          : 'Nhờ AI Sửa Văn & Chuẩn Hóa SEO Toàn Bài'}
                      </button>
                      <button
                        type="button"
                        className="btn-polish-secondary"
                        onClick={handleAiPolishSelectedSnippet}
                        disabled={isAiPolishing}
                        title="Bôi đen 1 đoạn văn bên dưới rồi bấm nút này để AI viết lại đoạn đó mượt hơn"
                      >
                        Sửa Đoạn Văn Đang Bôi Đen
                      </button>
                      {draftBackupBeforePolish && (
                        <button
                          type="button"
                          className="btn-polish-undo"
                          onClick={handleUndoAiPolish}
                        >
                          Hoàn Tác Bản Gốc
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Report of what AI fixed */}
                  {aiPolishReport && aiPolishReport.length > 0 && (
                    <div className="ai-polish-report-banner">
                      <div className="report-header">
                        <strong>AI đã hoàn tất sửa chữa văn phong & tối ưu chuẩn SEO cho bài viết của bạn:</strong>
                        <button
                          type="button"
                          className="btn-close-report"
                          onClick={() => setAiPolishReport(null)}
                        >
                          Đóng
                        </button>
                      </div>
                      <ul className="report-list">
                        {aiPolishReport.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Formatting Toolbar */}
                  <div className="rich-editor-toolbar">
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => insertAtCursor('<h2>', '</h2>', 'Tiêu đề mục lớn')}
                      title="Chèn tiêu đề lớn H2"
                    >
                      H2 Tiêu đề
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => insertAtCursor('<h3>', '</h3>', 'Tiêu đề mục nhỏ')}
                      title="Chèn tiêu đề phụ H3"
                    >
                      H3 Mục nhỏ
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => insertAtCursor('<strong>', '</strong>', 'chữ in đậm')}
                      title="Chữ in đậm"
                    >
                      <strong>B Đậm</strong>
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => insertAtCursor('<em>', '</em>', 'chữ in nghiêng')}
                      title="Chữ in nghiêng"
                    >
                      <em>I Nghiêng</em>
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() =>
                        insertAtCursor(
                          '<ul>\n  <li>',
                          '</li>\n  <li>Ý tiếp theo...</li>\n</ul>',
                          'Ý nổi bật thứ nhất'
                        )
                      }
                      title="Chèn danh sách gạch đầu dòng"
                    >
                      Danh sách
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() =>
                        insertAtCursor(
                          '<blockquote>',
                          '</blockquote>',
                          'Cam kết bảo hành 2 năm bằng văn bản tại FORHER Beauty & Spa.'
                        )
                      }
                      title="Chèn hộp trích dẫn nổi bật"
                    >
                      Hộp nhấn mạnh
                    </button>

                    {/* Upload Image Inline */}
                    <input
                      ref={inlineFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleInlineImageUpload}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      className="toolbar-btn highlight"
                      onClick={() => inlineFileInputRef.current?.click()}
                      disabled={isUploadingInline}
                      title="Tải ảnh từ thiết bị và chèn vào giữa bài viết"
                    >
                      {isUploadingInline ? 'Đang chèn ảnh...' : '+ Chèn Ảnh Vào Bài'}
                    </button>
                  </div>

                  <textarea
                    ref={contentTextareaRef}
                    rows={12}
                    className="article-content-textarea"
                    placeholder="Gõ nội dung nháp hoặc các ý chính của bạn vào đây, sau đó bấm nút 'Nhờ AI Sửa Văn & Chuẩn Hóa SEO Toàn Bài' ở ngay phía trên để AI trau chuốt câu chữ mượt mà và định dạng chuẩn SEO..."
                    value={formData.content}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        content: val,
                        readTime: estimateReadingTime(val)
                      });
                    }}
                    required
                  />
                </div>

                {/* 6. SEO Tags & Read Time */}
                <div className="form-row-two">
                  <div className="form-group">
                    <label>Từ Khóa SEO (Cách nhau bởi dấu phẩy):</label>
                    <input
                      type="text"
                      placeholder="Spa Quận 10, Triệt lông Diode Laser, Lấy nhân mụn..."
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Thời Lượng Đọc Ước Tính:</label>
                    <input
                      type="text"
                      placeholder="4 phút đọc"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="submodal-actions">
                  <button type="submit" className="btn-primary-gold" disabled={isSaving}>
                    {isSaving
                      ? 'Đang Lưu Bài Viết...'
                      : editingArticle
                      ? 'Lưu Thay Đổi Bài Viết'
                      : 'Đăng Bài Viết Lên Website'}
                  </button>
                  <button
                    type="button"
                    className="btn-outline-gold"
                    onClick={() => setEditorMode('preview')}
                  >
                    Xem Trước Giao Diện ({seoEvaluation.score}/100 SEO)
                  </button>
                  <button
                    type="button"
                    className="btn-outline-gold"
                    onClick={() => setIsEditorOpen(false)}
                  >
                    Hủy Bỏ
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ==============================================================================
          MODAL 2: XEM NHANH BÀI VIẾT TRONG ADMIN (QUICK PREVIEW MODAL)
          ============================================================================== */}
      {previewingArticle && (
        <div className="admin-submodal-backdrop" onClick={() => setPreviewingArticle(null)}>
          <div
            className="admin-submodal-card admin-article-editor-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-submodal-header">
              <h3>Xem Trước: {previewingArticle.title}</h3>
              <button
                type="button"
                className="btn-close-submodal"
                onClick={() => setPreviewingArticle(null)}
              >
                ✕
              </button>
            </div>

            <div className="admin-article-live-preview">
              <div className="preview-article-sheet">
                <span className="article-cat-pill">{previewingArticle.categoryName}</span>
                <h1 className="article-detail-title" style={{ marginTop: '10px' }}>
                  {previewingArticle.title}
                </h1>
                <p className="article-detail-lead">{previewingArticle.excerpt}</p>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {formatPublishDate(previewingArticle.publishedAt)} • {previewingArticle.author} • {previewingArticle.readTime}
                </div>
                {previewingArticle.coverImage && (
                  <div className="article-cover-showcase" style={{ marginBottom: '20px' }}>
                    <img
                      src={previewingArticle.coverImage}
                      alt={previewingArticle.title}
                      className="article-cover-full-img"
                    />
                  </div>
                )}
                <div
                  className="article-rich-content"
                  dangerouslySetInnerHTML={{
                    __html: formatArticleHtml(previewingArticle.content)
                  }}
                />
              </div>

              <div className="submodal-actions" style={{ padding: '16px 24px' }}>
                <button
                  type="button"
                  className="btn-primary-gold"
                  onClick={() => {
                    const art = previewingArticle;
                    setPreviewingArticle(null);
                    handleOpenEdit(art);
                  }}
                >
                  Chỉnh Sửa Bài Viết Này
                </button>
                <a
                  href={`/bai-viet/${previewingArticle.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-gold"
                >
                  Xem Trên Website Thực Tế
                </a>
                <button
                  type="button"
                  className="btn-outline-gold"
                  onClick={() => setPreviewingArticle(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================================
          MODAL 3: XÁC NHẬN XÓA BÀI VIẾT
          ============================================================================== */}
      {deletingArticle && (
        <div className="admin-submodal-backdrop" onClick={() => setDeletingArticle(null)}>
          <div
            className="admin-submodal-card delete-confirm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Xác Nhận Xóa Bài Viết</h3>
            <p>
              Bạn có chắc chắn muốn xóa bài viết <strong>"{deletingArticle.title}"</strong> khỏi hệ thống?
            </p>
            <div className="submodal-actions">
              <button
                type="button"
                className="btn-danger-confirm"
                onClick={handleConfirmDelete}
              >
                Đồng Ý Xóa Bài Viết
              </button>
              <button
                type="button"
                className="btn-outline-gold"
                onClick={() => setDeletingArticle(null)}
              >
                Hủy Bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
