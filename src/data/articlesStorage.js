/**
 * FORHER BEAUTY & SPA - ARTICLES & BLOG CMS STORAGE (SUPABASE CLOUD + LOCAL HYBRID)
 * Quản lý bài viết cẩm nang làm đẹp, tin tức khuyến mãi và kiến thức chăm sóc da chuẩn y khoa.
 */

import { supabase } from '../config/supabaseClient';
import { BookingStorage } from './bookingStorage';

const ARTICLES_STORAGE_KEY = 'forher_articles_v1';

export const ARTICLE_CATEGORIES = [
  { id: 'all', name: 'Tất Cả Chuyên Mục', badge: 'Tất cả' },
  { id: 'triet-long', name: 'Triệt Lông Diode Laser', badge: 'Triệt Lông BH 2 Năm' },
  { id: 'cham-soc-mun', name: 'Chăm Sóc & Trị Mụn Y Khoa', badge: 'Trị Mụn & Skincare' },
  { id: 'peel-meso', name: 'Chemical Peel & Cấy Meso', badge: 'Peel & Căng Bóng' },
  { id: 'goi-dau', name: 'Gội Đầu Dưỡng Sinh Thảo Mộc', badge: 'Gội Đầu Lầu 1' },
  { id: 'three-house-nails', name: 'Three House Nails Nghệ Thuật', badge: 'Nail Tầng Trệt' },
  { id: 'uu-dai-tin-tuc', name: 'Ưu Đãi & Tin Tức FORHER', badge: 'Khuyến Mãi & Sự Kiện' }
];

export const SPA_GALLERY_PRESETS = [
  {
    id: 'storefront',
    label: 'Mặt tiền 515 Bà Hạt (Quận 10)',
    url: '/forher_storefront_real.jpg'
  },
  {
    id: 'facial-real',
    label: 'Lấy nhân mụn & Chăm sóc da',
    url: '/forher_facial_treatment_real.jpg'
  },
  {
    id: 'skincare-real',
    label: 'Điện di & Phục hồi da chuyên sâu',
    url: '/forher_skincare_care_real.jpg'
  },
  {
    id: 'spa-room',
    label: 'Không gian phòng Spa Lầu 2',
    url: '/forher_spa_room_real.jpg'
  },
  {
    id: 'goidau-real',
    label: 'Gội đầu dưỡng sinh thảo mộc Lầu 1',
    url: '/forher_goidau_real.jpg'
  },
  {
    id: 'nail-real',
    label: 'Tiệm Three House Nails Tầng Trệt',
    url: '/forher_nail_real.jpg'
  },
  {
    id: 'diode-laser',
    label: 'Máy Triệt lông Diode Laser lạnh',
    url: '/assets/diode_laser_machine.jpg'
  },
  {
    id: 'chemical-peel',
    label: 'Liệu trình Chemical Peel thay da',
    url: '/assets/chemical_peel.jpg'
  },
  {
    id: 'laser-hair',
    label: 'Triệt lông công nghệ cao',
    url: '/assets/laser_hair.jpg'
  },
  {
    id: 'facial-skincare',
    label: 'Đắp mặt nạ & Thư giãn da mặt',
    url: '/assets/facial_skincare.jpg'
  },
  {
    id: 'brows-lips',
    label: 'Phun xăm thẩm mỹ Mày & Môi',
    url: '/assets/brows_lips.jpg'
  },
  {
    id: 'vip-room',
    label: 'Phòng VIP chăm sóc da riêng tư',
    url: '/assets/spa_vip_room.jpg'
  }
];

export function slugifyVietnamese(str) {
  if (!str) return '';
  return str
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function estimateReadingTime(content) {
  if (!content) return '3 phút đọc';
  const plain = content.replace(/<[^>]*>/g, ' ').trim();
  const words = plain.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(2, Math.ceil(words / 180));
  return `${minutes} phút đọc`;
}

export function compressImageFileToDataUrl(file, maxWidth = 1100, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WEBP).'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Không thể đọc hình ảnh này.'));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error('Lỗi đọc file từ thiết bị.'));
    reader.readAsDataURL(file);
  });
}

export const SAMPLE_ARTICLES = [
  {
    id: 'POST-101',
    slug: 'kinh-nghiem-triet-long-diode-laser-lanh-bao-hanh-2-nam-quan-10',
    title: 'Kinh Nghiệm Triệt Lông Diode Laser Lạnh Bảo Hành 2 Năm Tại Quận 10: Không Đau Rát, Sáng Mịn Tự Nhiên',
    category: 'triet-long',
    categoryName: 'Triệt Lông Diode Laser',
    excerpt: 'Tìm hiểu công nghệ triệt lông Diode Laser đầu lạnh âm độ tại FORHER Beauty & Spa (515 Bà Hạt, Quận 10). Cam kết cấp sổ bảo hành 02 năm bằng văn bản, êm ái và hỗ trợ giảm thâm sáng da.',
    coverImage: '/assets/diode_laser_machine.jpg',
    author: 'Chuyên viên Da liễu FORHER',
    readTime: '5 phút đọc',
    tags: 'Triệt lông Diode Laser, Spa Quận 10, Triệt lông bảo hành 2 năm, Triệt nách, Triệt bikini',
    relatedServiceId: 'tl-nach',
    status: 'published',
    isFeatured: true,
    views: 348,
    createdBy: 'admin',
    publishedAt: '2026-10-20T09:00:00.000Z',
    createdAt: '2026-10-20T09:00:00.000Z',
    updatedAt: '2026-10-20T09:00:00.000Z',
    content: `<h2>Vì sao công nghệ Diode Laser đầu lạnh lại được phái đẹp Quận 10 ưa chuộng?</h2>
<p>Khác với các phương pháp cạo, nhổ hay wax lông truyền thống dễ làm tổn thương lỗ chân lông, gây viêm nang lông và thâm sạm, <strong>công nghệ Diode Laser thế hệ mới</strong> tại <strong>FORHER Beauty & Spa (515 Bà Hạt, P. Diên Hồng, Quận 10)</strong> sử dụng bước sóng 808nm chuẩn xác tác động trực tiếp vào gốc nang lông mà không gây tổn hại vùng da xung quanh.</p>

<blockquote>Tại FORHER Beauty & Spa, 100% gói liệu trình triệt lông Diode Laser đều được cấp sổ Bảo Hành 02 Năm bằng văn bản, hoàn toàn không phát sinh bất kỳ phụ phí nào trong suốt thời gian bảo hành.</blockquote>

<h3>Ưu điểm vượt trội của máy Diode Laser đầu đá Sapphire lạnh</h3>
<ul>
  <li><strong>Làm lạnh sâu êm ái:</strong> Đầu máy tiếp xúc da được làm lạnh liên tục giúp làm dịu tức thì, không gây cảm giác châm chích hay nóng rát ngay cả ở những vùng nhạy cảm như Bikini, Nách hay Viền trán.</li>
  <li><strong>Trẻ hóa & thu nhỏ lỗ chân lông:</strong> Năng lượng ánh sáng kích thích tăng sinh collagen tự nhiên, giúp vùng da sau triệt trở nên sáng mịn, giảm thâm sần và cải thiện tình trạng mùi cơ thể.</li>
  <li><strong>Không gian riêng tư tuyệt đối:</strong> Phòng triệt lông tại Lầu 2 có hệ thống rèm che ngăn cách kín đáo từng giường, bộ khăn và dao cạo vệ sinh dùng riêng cho mỗi khách hàng.</li>
</ul>

<img src="/forher_spa_room_real.jpg" alt="Không gian phòng Spa Lầu 2 rèm che riêng tư tại FORHER 515 Bà Hạt" />

<h2>Lộ trình triệt lông chuẩn y khoa diễn ra như thế nào?</h2>
<p>Một liệu trình tiêu chuẩn thường kéo dài từ 6 đến 10 buổi tùy theo cơ địa và chu kỳ sinh trưởng của nang lông (Anagen). Ngay từ buổi thứ 3 - 4, bạn sẽ nhận thấy sợi lông mọc chậm lại rõ rệt, mảnh tơ và nhạt màu dần.</p>

<h3>Những lưu ý vàng trước và sau khi đi triệt lông</h3>
<ul>
  <li>Không tự ý nhổ hoặc wax lông trước buổi triệt ít nhất 7 - 10 ngày để giữ nguyên gốc nang lông giúp tia laser bắt mục tiêu tốt nhất.</li>
  <li>Trong 24 giờ đầu sau khi triệt, hạn chế tắm nước quá nóng hoặc dùng sữa tắm có hạt tẩy tế bào chết mạnh.</li>
  <li>Thoa kem dưỡng ẩm dịu nhẹ và chống nắng kỹ đối với vùng tay, chân khi ra ngoài nắng.</li>
</ul>

<p>Nếu bạn đang tìm kiếm một địa chỉ <strong>triệt lông uy tín tại Quận 10</strong> với mức giá niêm yết minh bạch (chỉ từ 500.000đ trọn gói bảo hành 2 năm vùng nách), hãy đặt lịch hẹn ngay để chuyên viên FORHER chuẩn bị giường riêng đón tiếp bạn chu đáo nhất!</p>`
  },
  {
    id: 'POST-102',
    slug: 'quy-trinh-lay-nhan-mun-chuan-y-khoa-khong-tham-seo-tai-forher-spa',
    title: 'Quy Trình Lấy Nhân Mụn Chuẩn Y Khoa Tại FORHER Spa: Dụng Cụ Tiệt Trùng 1 Lần, Giảm Sưng Đỏ Tức Thì',
    category: 'cham-soc-mun',
    categoryName: 'Chăm Sóc & Trị Mụn Y Khoa',
    excerpt: 'Khám phá quy trình chăm sóc da mụn chuyên sâu tại Lầu 2 FORHER Beauty & Spa. Sử dụng 100% dụng cụ vô khuẩn dùng 1 lần, kết hợp sát khuẩn điện tím và chiếu ánh sáng sinh học phục hồi da.',
    coverImage: '/forher_facial_treatment_real.jpg',
    author: 'KTV Trưởng FORHER Spa',
    readTime: '4 phút đọc',
    tags: 'Lấy nhân mụn chuẩn y khoa, Nặn mụn Quận 10, Chăm sóc da mụn, Tia điện tím, Ánh sáng sinh học',
    relatedServiceId: 'nm-chuan-ykhoa',
    status: 'published',
    isFeatured: true,
    views: 276,
    createdBy: 'admin',
    publishedAt: '2026-10-22T10:30:00.000Z',
    createdAt: '2026-10-22T10:30:00.000Z',
    updatedAt: '2026-10-22T10:30:00.000Z',
    content: `<h2>Tại sao không nên tự nặn mụn tại nhà?</h2>
<p>Thói quen tự dùng tay cạy nặn mụn khi nhân mụn chưa gom cồi hoặc dụng cụ chưa được vô trùng là nguyên nhân hàng đầu khiến ổ viêm lan rộng xuống trung bì, dẫn đến mụn bọc tái đi tái lại và để lại vết thâm đen, sẹo rỗ khó phục hồi.</p>

<blockquote>Nguyên tắc vàng tại FORHER Beauty & Spa: Chỉ lấy những nhân mụn đã gom cồi già, thao tác êm ái chuẩn chiều nang lông và 100% bộ kim/bông gạc tách biệt dùng 1 lần duy nhất cho mỗi khách hàng.</blockquote>

<h3>Chi tiết các bước Lấy Nhân Mụn Chuẩn Y Khoa tại Lầu 2 FORHER</h3>
<ul>
  <li><strong>Bước 1 - Soi da & Phân tích tình trạng mụn:</strong> Chuyên viên kiểm tra loại mụn (mụn ẩn, mụn đầu đen, mụn viêm) để điều chỉnh lực lấy phù hợp.</li>
  <li><strong>Bước 2 - Làm sạch sâu 3 bước:</strong> Tẩy trang dịu nhẹ, rửa mặt bằng sữa rửa mặt y khoa và tẩy tế bào chết làm thông thoáng cổ nang lông.</li>
  <li><strong>Bước 3 - Xông hơi ấm & Hút dầu thừa:</strong> Giúp lỗ chân lông giãn nở tự nhiên, nhân mụn mềm và dễ dàng thoát ra mà không cần đè ép mạnh.</li>
  <li><strong>Bước 4 - Lấy nhân mụn kỹ thuật êm ái:</strong> Sử dụng bộ dụng cụ vô trùng riêng biệt, xử lý sạch cồi mụn từng vùng.</li>
  <li><strong>Bước 5 - Sát khuẩn tia điện tím & Đắp mặt nạ làm dịu:</strong> Tiêu diệt vi khuẩn P.Acnes ngay lập tức, khóa ẩm và kết hợp chiếu vòm ánh sáng sinh học Bio-Light giúp vết lấy mụn dịu hẳn chỉ sau 20 phút.</li>
</ul>

<img src="/forher_skincare_care_real.jpg" alt="Chăm sóc phục hồi và làm dịu da sau lấy nhân mụn tại FORHER Spa" />

<h2>Sau khi lấy nhân mụn nên chăm sóc da như thế nào?</h2>
<p>Trong 24 giờ đầu sau khi lấy mụn, làn da đang có các vi tổn thương hở nhỏ. Bạn nên rửa mặt bằng nước muối sinh lý hoặc sữa rửa mặt dịu nhẹ, ngưng sử dụng các hoạt chất treatment mạnh (AHA, BHA, Retinol) trong 3 ngày đầu và ưu tiên serum B5, HA phục hồi màng bảo vệ da.</p>`
  },
  {
    id: 'POST-103',
    slug: 'goi-dau-duong-sinh-thao-moc-co-vai-gay-lau-1-forher-spa',
    title: 'Gội Đầu Dưỡng Sinh Thảo Mộc Cổ Vai Gáy Tại Lầu 1 FORHER: Liệu Pháp Xua Tan Căng Thẳng & Ngủ Ngon',
    category: 'goi-dau',
    categoryName: 'Gội Đầu Dưỡng Sinh Thảo Mộc',
    excerpt: 'Dành tặng bản thân 60 - 90 phút thả lỏng hoàn toàn tại không gian Lầu 1 FORHER Beauty & Spa với nước gội bồ kết thảo dược nấu ấm và bài ấn huyệt đả thông kinh lạc vùng đầu, cổ, vai, gáy.',
    coverImage: '/forher_goidau_real.jpg',
    author: 'Chuyên viên Dưỡng sinh FORHER',
    readTime: '4 phút đọc',
    tags: 'Gội đầu dưỡng sinh Quận 10, Massage cổ vai gáy, Gội đầu thảo mộc, Thư giãn cuối tuần',
    relatedServiceId: 'sk-dap-thach',
    status: 'published',
    isFeatured: false,
    views: 195,
    createdBy: 'admin',
    publishedAt: '2026-10-24T14:00:00.000Z',
    createdAt: '2026-10-24T14:00:00.000Z',
    updatedAt: '2026-10-24T14:00:00.000Z',
    content: `<h2>Hành trình thư giãn tại Lầu 1 tòa nhà 3 tầng FORHER 515 Bà Hạt</h2>
<p>Sau những giờ làm việc căng thẳng trước màn hình máy tính, vùng cơ cổ vai gáy thường xuyên bị co cứng dẫn đến đau mỏi đầu, hoa mắt và khó vào giấc ngủ. Không gian <strong>Gội Đầu Dưỡng Sinh tại Lầu 1 FORHER Beauty & Spa</strong> được thiết kế ấm cúng, tách biệt tiếng ồn phố thị với hương tinh dầu sả chanh – vỏ bưởi thoang thoảng.</p>

<blockquote>Sự kết hợp giữa nước thảo mộc nấu ấm tự nhiên (bồ kết, vỏ bưởi, hương nhu, sả tươi) cùng kỹ thuật bấm huyệt vùng đầu giúp kích thích tuần hoàn máu và mang lại giấc ngủ sâu ngay trên giường gội.</blockquote>

<h3>Điểm đặc biệt của dịch vụ Gội Đầu Dưỡng Sinh tại FORHER</h3>
<ul>
  <li><strong>Nước thảo dược nấu mới mỗi ngày:</strong> Nuôi dưỡng nang tóc chắc khỏe, giảm gãy rụng, sạch gàu mà không làm khô xơ mái tóc.</li>
  <li><strong>Ấn huyệt chuyên sâu vùng đầu & cổ vai gáy:</strong> Tác động nhẹ nhàng vào các huyệt đạo Bách Hội, Thái Dương, Phong Trì giúp giải tỏa áp lực thần kinh tức thì.</li>
  <li><strong>Kết hợp chăm sóc da mặt thư giãn:</strong> Rửa mặt massage nâng cơ và đắp mặt nạ cấp ẩm mát lạnh trong lúc ủ tóc.</li>
</ul>

<p>Bạn có thể đặt lịch đi cùng bạn bè hoặc người thân để cùng tận hưởng những phút giây nghỉ ngơi trọn vẹn nhất tại số 515 Bà Hạt, Phường Diên Hồng, Quận 10.</p>`
  },
  {
    id: 'POST-104',
    slug: 'bi-quyet-cham-soc-da-sau-chemical-peel-va-cay-meso-cang-bong',
    title: 'Hướng Dẫn Chăm Sóc Da Khoa Học Sau Khi Thực Hiện Chemical Peel & Cấy Tinh Chất Meso Căng Bóng',
    category: 'peel-meso',
    categoryName: 'Chemical Peel & Cấy Meso',
    excerpt: 'Làm thế nào để làn da sau khi Peel sinh học (TCA, Bio, Image) hoặc cấy tinh chất Meso HA/B5/Mulgwang đạt độ căng bóng ngậm nước tối đa? Xem ngay phác đồ chăm sóc 7 ngày đầu từ chuyên viên FORHER.',
    coverImage: '/assets/chemical_peel.jpg',
    author: 'Chuyên viên Da liễu FORHER',
    readTime: '5 phút đọc',
    tags: 'Chemical Peel, Cấy Meso, Căng bóng da Mulgwang, Phục hồi da B5, Peel da Quận 10',
    relatedServiceId: 'cp-bio-peel',
    status: 'published',
    isFeatured: false,
    views: 214,
    createdBy: 'admin',
    publishedAt: '2026-10-25T16:15:00.000Z',
    createdAt: '2026-10-25T16:15:00.000Z',
    updatedAt: '2026-10-25T16:15:00.000Z',
    content: `<h2>Chemical Peel & Cấy Tinh Chất Meso giúp tái sinh làn da như thế nào?</h2>
<p><strong>Chemical Peel (Thay da sinh học)</strong> và <strong>Mesotherapy vi điểm</strong> là hai phương pháp thẩm mỹ nội khoa hàng đầu giúp giải quyết đồng thời tình trạng da xỉn màu, thâm mụn lâu năm, lỗ chân lông to và thiếu hụt độ ẩm sâu.</p>

<h3>Phác đồ chăm sóc da chuẩn khoa học trong 7 ngày đầu sau liệu trình</h3>
<ul>
  <li><strong>Giai đoạn Ngày 1 – Ngày 2 (Làm dịu & Khóa ẩm):</strong> Chỉ làm sạch da bằng nước đun sôi để nguội hoặc nước muối sinh lý kết hợp sữa rửa mặt dịu nhẹ không bọt. Thoa tinh chất B5/HA từ 3 - 4 lần/ngày.</li>
  <li><strong>Giai đoạn Ngày 3 – Ngày 5 (Tái tạo tế bào mới):</strong> Nếu thực hiện Peel da, lớp sừng già cỗi có thể bong mịn nhẹ. Tuyệt đối không dùng tay bóc vảy mà hãy để da bong tự nhiên thông qua việc cấp ẩm đầy đủ.</li>
  <li><strong>Giai đoạn Ngày 6 – Ngày 7 (Bảo vệ & Tỏa sáng):</strong> Lúc này lớp tế bào da mới căng mướt đã lộ diện. Hãy duy trì kem chống nắng phổ rộng SPF 50+ mỗi sáng và có thể quay lại spa để thực hiện buổi điện di cấp ẩm phục hồi.</li>
</ul>

<blockquote>Mọi khách hàng thực hiện Chemical Peel hoặc Cấy Meso tại FORHER Beauty & Spa đều được chuyên viên theo dõi sát sao tình trạng da 1:1 qua Zalo mỗi ngày sau liệu trình.</blockquote>`
  },
  {
    id: 'POST-105',
    slug: 'xu-huong-mau-nail-dep-tai-three-house-nails-515-ba-hat-quan-10',
    title: 'Xu Hướng Mẫu Nail Đẹp & Sang Chảnh Tại Three House Nails (Tầng Trệt 515 Bà Hạt, Quận 10)',
    category: 'three-house-nails',
    categoryName: 'Three House Nails Nghệ Thuật',
    excerpt: 'Tổng hợp những tone màu sơn thạch trong trẻo, mắt mèo ánh cực quang, French đầu móng thanh lịch và đính charm tinh tế đang được yêu thích nhất tại Three House Nails.',
    coverImage: '/forher_nail_real.jpg',
    author: 'Team Three House Nails',
    readTime: '3 phút đọc',
    tags: 'Three House Nails, Làm nail Quận 10, Nail mắt mèo, Sơn thạch Hàn Quốc, 515 Bà Hạt',
    relatedServiceId: 'sk-c-glow',
    status: 'published',
    isFeatured: false,
    views: 310,
    createdBy: 'admin',
    publishedAt: '2026-10-26T11:00:00.000Z',
    createdAt: '2026-10-26T11:00:00.000Z',
    updatedAt: '2026-10-26T11:00:00.000Z',
    content: `<h2>Three House Nails – Nhiều màu để chọn, nhiều kiểu để yêu</h2>
<p>Ngay tại <strong>Tầng Trệt của tòa nhà FORHER Beauty & Spa (515 Bà Hạt, Quận 10)</strong>, không gian <strong>Three House Nails</strong> chào đón bạn với hàng trăm bảng màu sơn gel chính hãng được cập nhật liên tục theo xu hướng Hàn – Nhật – Đài mới nhất.</p>

<h3>Top 4 phong cách Nail dẫn đầu xu hướng năm nay</h3>
<ul>
  <li><strong>Sơn thạch hồng đào & Nude trong trẻo:</strong> Tôn da tay trắng hồng tự nhiên, phù hợp cho cả môi trường công sở lẫn những buổi hẹn hò nhẹ nhàng.</li>
  <li><strong>Mắt mèo ánh kim cương & Cực quang:</strong> Hiệu ứng bắt sáng lấp lánh dưới mọi góc nhìn, sang trọng và đầy cuốn hút.</li>
  <li><strong>French đầu móng cách điệu & Tráng gương:</strong> Thanh lịch, hiện đại và giúp ngón tay trông thon dài hơn.</li>
  <li><strong>Design vẽ nổi, Ombre & Đính đá/Charm thiết kế riêng:</strong> Cá nhân hóa bộ móng theo đúng cá tính và trang phục sự kiện của bạn.</li>
</ul>

<p>Đặc biệt, bạn có thể kết hợp làm một bộ móng xinh tại Tầng Trệt, sau đó lên Lầu 1 gội đầu dưỡng sinh hoặc Lầu 2 chăm sóc da mặt chỉ trong một lần ghé thăm duy nhất!</p>`
  }
];

export const ArticlesStorage = {
  getCategories() {
    return ARTICLE_CATEGORIES;
  },

  getCategoryName(catId) {
    const found = ARTICLE_CATEGORIES.find(c => c.id === catId);
    return found ? found.name : 'Kiến Thức Làm Đẹp';
  },

  getAllArticles(includeDrafts = true) {
    try {
      const raw = localStorage.getItem(ARTICLES_STORAGE_KEY);
      let list = [];
      if (!raw) {
        this.saveArticles(SAMPLE_ARTICLES);
        list = [...SAMPLE_ARTICLES];
      } else {
        list = JSON.parse(raw);
        if (!Array.isArray(list) || list.length === 0) {
          this.saveArticles(SAMPLE_ARTICLES);
          list = [...SAMPLE_ARTICLES];
        }
      }

      // Sort: featured first, then newest publishedAt / createdAt
      const sorted = [...list].sort((a, b) => {
        if (Boolean(b.isFeatured) !== Boolean(a.isFeatured)) {
          return b.isFeatured ? 1 : -1;
        }
        const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      if (includeDrafts) return sorted;
      return sorted.filter(a => a.status === 'published');
    } catch (e) {
      console.error('Error loading articles:', e);
      return includeDrafts ? SAMPLE_ARTICLES : SAMPLE_ARTICLES.filter(a => a.status === 'published');
    }
  },

  getPublishedArticles() {
    return this.getAllArticles(false);
  },

  getArticleBySlugOrId(slugOrId) {
    if (!slugOrId) return null;
    const clean = decodeURIComponent(slugOrId).trim().toLowerCase();
    const all = this.getAllArticles(true);
    return (
      all.find(
        a =>
          (a.slug && a.slug.toLowerCase() === clean) ||
          (a.id && a.id.toLowerCase() === clean)
      ) || null
    );
  },

  saveArticles(articles) {
    try {
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
    } catch (e) {
      console.error('Error saving articles to localStorage:', e);
    }
  },

  async syncArticlesFromSupabase() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped = data.map(row => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          category: row.category || 'cham-soc-mun',
          categoryName: row.category_name || this.getCategoryName(row.category),
          excerpt: row.excerpt || '',
          content: row.content || '',
          coverImage: row.cover_image || '/forher_facial_treatment_real.jpg',
          author: row.author || 'Chuyên viên FORHER Spa',
          readTime: row.read_time || estimateReadingTime(row.content),
          tags: row.tags || '',
          relatedServiceId: row.related_service_id || '',
          status: row.status || 'published',
          isFeatured: Boolean(row.is_featured),
          views: Number(row.views) || 0,
          createdBy: row.created_by || 'admin',
          publishedAt: row.published_at || row.created_at,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));

        // Merge local articles that might not be in cloud yet with cloud articles
        const localList = this.getAllArticles(true);
        const cloudIds = new Set(mapped.map(m => m.id));
        const localOnlySampleOrNew = localList.filter(l => !cloudIds.has(l.id));
        const combined = [...mapped, ...localOnlySampleOrNew];
        this.saveArticles(combined);
        return { success: true, count: combined.length };
      }
    } catch (e) {
      // Offline or table not initialized yet
    }
    return { success: false };
  },

  async createArticle(articleData) {
    const all = this.getAllArticles(true);
    const nowIso = new Date().toISOString();
    const session = BookingStorage.getCurrentSession();
    const actorName = session ? session.fullName : 'Quản trị viên FORHER';
    const actorRole = session ? session.role : 'boss';

    const title = (articleData.title || '').trim();
    if (!title) {
      return { success: false, message: 'Vui lòng nhập tiêu đề bài viết!' };
    }

    let baseSlug = slugifyVietnamese(articleData.slug || title);
    if (!baseSlug) baseSlug = `bai-viet-${Date.now()}`;
    let finalSlug = baseSlug;
    let counter = 1;
    while (all.some(a => a.slug === finalSlug)) {
      counter++;
      finalSlug = `${baseSlug}-${counter}`;
    }

    const category = articleData.category || 'cham-soc-mun';
    const categoryName = this.getCategoryName(category);
    const content = (articleData.content || '').trim();
    const excerpt =
      (articleData.excerpt || '').trim() ||
      content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 180) + '...';

    const newArticle = {
      id: `POST-${Date.now().toString().slice(-6)}`,
      slug: finalSlug,
      title,
      category,
      categoryName,
      excerpt,
      content,
      coverImage: articleData.coverImage || '/forher_facial_treatment_real.jpg',
      author: (articleData.author || '').trim() || actorName || 'Chuyên viên FORHER Spa',
      readTime: (articleData.readTime || '').trim() || estimateReadingTime(content),
      tags: (articleData.tags || '').trim() || 'FORHER Spa Quận 10, Chăm sóc da, Làm đẹp',
      relatedServiceId: articleData.relatedServiceId || '',
      status: articleData.status === 'draft' ? 'draft' : 'published',
      isFeatured: Boolean(articleData.isFeatured),
      views: Number(articleData.views) || 1,
      createdBy: session?.username || 'admin',
      publishedAt: articleData.publishedAt || nowIso,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    const updatedList = [newArticle, ...all];
    this.saveArticles(updatedList);

    // Sync to Supabase blog_posts
    try {
      await supabase.from('blog_posts').upsert([
        {
          id: newArticle.id,
          slug: newArticle.slug,
          title: newArticle.title,
          category: newArticle.category,
          category_name: newArticle.categoryName,
          excerpt: newArticle.excerpt,
          content: newArticle.content,
          cover_image: newArticle.coverImage,
          author: newArticle.author,
          read_time: newArticle.readTime,
          tags: newArticle.tags,
          related_service_id: newArticle.relatedServiceId,
          status: newArticle.status,
          is_featured: newArticle.isFeatured,
          views: newArticle.views,
          created_by: newArticle.createdBy,
          published_at: newArticle.publishedAt,
          created_at: newArticle.createdAt,
          updated_at: newArticle.updatedAt
        }
      ]);
    } catch (e) {
      console.warn('Supabase blog_posts insert fallback:', e);
    }

    BookingStorage.addLog(
      'ARTICLE',
      'Đăng bài viết mới',
      `${actorName} đã đăng bài viết "${newArticle.title}" (Chuyên mục: ${newArticle.categoryName} | Trạng thái: ${newArticle.status === 'published' ? 'Công khai' : 'Bản nháp'})`,
      newArticle.id,
      actorName,
      actorRole
    );

    return { success: true, article: newArticle };
  },

  async updateArticle(id, updateFields) {
    const all = this.getAllArticles(true);
    const index = all.findIndex(a => a.id === id);
    if (index === -1) {
      return { success: false, message: 'Không tìm thấy bài viết cần chỉnh sửa.' };
    }

    const old = all[index];
    const nowIso = new Date().toISOString();
    const session = BookingStorage.getCurrentSession();
    const actorName = session ? session.fullName : 'Quản trị viên';
    const actorRole = session ? session.role : 'boss';

    const category = updateFields.category || old.category;
    const categoryName = this.getCategoryName(category);

    let finalSlug = old.slug;
    if (updateFields.slug && updateFields.slug.trim() !== old.slug) {
      const candidate = slugifyVietnamese(updateFields.slug);
      if (candidate && !all.some(a => a.id !== id && a.slug === candidate)) {
        finalSlug = candidate;
      }
    }

    const content = updateFields.content !== undefined ? updateFields.content : old.content;
    const updatedArticle = {
      ...old,
      ...updateFields,
      slug: finalSlug,
      category,
      categoryName,
      readTime: updateFields.readTime || estimateReadingTime(content),
      updatedAt: nowIso
    };

    all[index] = updatedArticle;
    this.saveArticles(all);

    try {
      await supabase
        .from('blog_posts')
        .upsert([
          {
            id: updatedArticle.id,
            slug: updatedArticle.slug,
            title: updatedArticle.title,
            category: updatedArticle.category,
            category_name: updatedArticle.categoryName,
            excerpt: updatedArticle.excerpt,
            content: updatedArticle.content,
            cover_image: updatedArticle.coverImage,
            author: updatedArticle.author,
            read_time: updatedArticle.readTime,
            tags: updatedArticle.tags,
            related_service_id: updatedArticle.relatedServiceId,
            status: updatedArticle.status,
            is_featured: updatedArticle.isFeatured,
            views: updatedArticle.views,
            created_by: updatedArticle.createdBy,
            published_at: updatedArticle.publishedAt,
            created_at: updatedArticle.createdAt,
            updated_at: updatedArticle.updatedAt
          }
        ]);
    } catch (e) {
      console.warn('Supabase blog_posts update fallback:', e);
    }

    BookingStorage.addLog(
      'ARTICLE',
      'Cập nhật bài viết',
      `${actorName} đã chỉnh sửa bài viết "${updatedArticle.title}" (#${updatedArticle.id})`,
      updatedArticle.id,
      actorName,
      actorRole
    );

    return { success: true, article: updatedArticle };
  },

  async deleteArticle(id) {
    const all = this.getAllArticles(true);
    const target = all.find(a => a.id === id);
    if (!target) {
      return { success: false, message: 'Không tìm thấy bài viết cần xóa.' };
    }

    const filtered = all.filter(a => a.id !== id);
    this.saveArticles(filtered);

    try {
      await supabase.from('blog_posts').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase blog_posts delete fallback:', e);
    }

    const session = BookingStorage.getCurrentSession();
    const actorName = session ? session.fullName : 'Quản trị viên';
    const actorRole = session ? session.role : 'boss';

    BookingStorage.addLog(
      'ARTICLE',
      'Xóa bài viết',
      `${actorName} đã xóa bài viết "${target.title}" (#${target.id})`,
      target.id,
      actorName,
      actorRole
    );

    return { success: true };
  },

  incrementViews(id) {
    try {
      const all = this.getAllArticles(true);
      const idx = all.findIndex(a => a.id === id);
      if (idx !== -1) {
        all[idx] = {
          ...all[idx],
          views: (Number(all[idx].views) || 0) + 1
        };
        this.saveArticles(all);
      }
    } catch (e) {
      // ignore
    }
  }
};

