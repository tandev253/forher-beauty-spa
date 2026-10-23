/**
 * FORHER BEAUTY & SPA - CORPORATE ENTERPRISE DATASET
 * Complete data model: 35 services, clinical protocols, warranty policy, corporate info.
 */

export const COMPANY_INFO = {
  name: 'FORHER BEAUTY & SPA',
  brandTitle: 'Forher Beauty',
  brandSubtitle: 'Chăm Sóc Da • Triệt Lông • Dưỡng Sinh • Nail',
  tagline: 'Chăm Sóc Da, Triệt Lông Diode Laser, Gội Đầu Dưỡng Sinh & Nail',
  address: '515 Bà Hạt, Phường Diên Hồng, TP. Hồ Chí Minh',
  addressShort: '515 Bà Hạt, P. Diên Hồng, TP.HCM',
  phone: '0703 994 683',
  phoneClean: '0703994683',
  email: 'contact@forherbeauty.vn',
  workingHours: '09:00 - 20:00 (Hàng ngày, kể cả Thứ Bảy & Chủ Nhật)',
  social: {
    facebook: 'https://www.facebook.com/forherbeautyspa',
    facebookTag: '@forherbeautyspa',
    tiktok: 'https://www.tiktok.com/@forherbeautyclinic',
    tiktokTag: '@forherbeautyclinic',
    instagram: 'https://instagram.com/forher_beauty515',
    instagramTag: '@FORHER_BEAUTY515',
    zalo: 'https://zalo.me/0703994683'
  },
  stats: [
    { value: '02 Năm', label: 'Bảo Hành Triệt Lông Cam Kết' },
    { value: '10,000+', label: 'Khách Hàng Đã Phục Vụ' },
    { value: '100%', label: 'Tiệt Trùng Dụng Cụ Riêng Biệt' },
    { value: '4.9 / 5', label: 'Đánh Giá Hài Lòng Khách Hàng' }
  ]
};

export const CATEGORIES = [
  { id: 'all', name: 'Tất Cả Dịch Vụ', count: 38 },
  { id: 'triet-long', name: 'Triệt Lông (BH 2 Năm)', count: 10 },
  { id: 'nan-mun', name: 'Chăm Sóc & Trị Mụn', count: 5 },
  { id: 'skincare', name: 'Skincare & Phục Hồi', count: 6 },
  { id: 'chemical-peel', name: 'Chemical Peel Thay Da', count: 13 },
  { id: 'eye', name: 'Chăm Sóc Vùng Mắt', count: 2 },
  { id: 'shading', name: 'Shading & Phun Xăm', count: 2 }
];

export const SERVICES_CATALOG = [
  // 1. TRIỆT LÔNG BẢO HÀNH 2 NĂM
  {
    id: 'tl-nach',
    code: 'TL-01',
    category: 'triet-long',
    categoryName: 'Triệt Lông (BH 2 Năm)',
    name: 'Triệt Lông Nách',
    desc: 'Triệt lông Diode Laser công nghệ làm lạnh âm độ, êm ái không đau rát, se khít nang lông và sáng mịn vùng dưới cánh tay.',
    duration: '20-30 phút',
    singlePrice: 500000,
    singlePriceDisplay: '500.000đ',
    coursePrice: 500000,
    coursePriceDisplay: 'Trọn Gói BH 2 Năm',
    isWarranty2Y: true,
    highlight: true
  },
  {
    id: 'tl-mep',
    code: 'TL-02',
    category: 'triet-long',
    categoryName: 'Triệt Lông (BH 2 Năm)',
    name: 'Triệt Lông Mép',
    desc: 'Làm sạch lông mép tơ mảnh, kích thích sáng da viền môi, hỗ trợ lớp nền trang điểm mịn màng không tì vết.',
    duration: '15-20 phút',
    singlePrice: 450000,
    singlePriceDisplay: '450.000đ',
    coursePrice: 450000,
    coursePriceDisplay: 'Trọn Gói BH 2 Năm',
    isWarranty2Y: true
  },
  {
    id: 'tl-mat',
    code: 'TL-03',
    category: 'triet-long',
    categoryName: 'Triệt Lông (BH 2 Năm)',
    name: 'Triệt Lông Mặt',
    desc: 'Triệt lông tơ toàn mặt chuẩn an toàn da liễu, giảm hẳn tình trạng bít tắc lỗ chân lông và mụn cám li ti.',
    duration: '35-45 phút',
    singlePrice: 1700000,
    singlePriceDisplay: '1.700.000đ',
    coursePrice: 1700000,
    coursePriceDisplay: 'Trọn Gói BH 2 Năm',
    isWarranty2Y: true
  },
  {
    id: 'tl-nua-tay',
    code: 'TL-04',
    category: 'triet-long',
    categoryName: 'Triệt Lông (BH 2 Năm)',
    name: 'Triệt Lông ½ Tay',
    desc: 'Áp dụng vùng cẳng tay trên hoặc dưới. Giúp da tay mịn màng, thông thoáng và loại bỏ viêm nang lông.',
    duration: '30 phút',
    singlePrice: 1400000,
    singlePriceDisplay: '1.400.000đ',
    coursePrice: 1400000,
    coursePriceDisplay: 'Trọn Gói BH 2 Năm',
    isWarranty2Y: true
  },
  {
    id: 'tl-nguyen-tay',
    code: 'TL-05',
    category: 'triet-long',
    categoryName: 'Triệt Lông (BH 2 Năm)',
    name: 'Triệt Lông Nguyên Tay',
    desc: 'Triệt trọn gói toàn bộ 2 cánh tay từ bả vai đến cổ tay, mang lại làn da trắng mịn tự tin diện đồ ngắn tay.',
    duration: '45 phút',
    singlePrice: 2200000,
    singlePriceDisplay: '2.200.000đ',
    coursePrice: 2200000,
    coursePriceDisplay: 'Trọn Gói BH 2 Năm',
    isWarranty2Y: true
  },
  {
    id: 'tl-nua-chan',
    code: 'TL-06',
    category: 'triet-long',
    categoryName: 'Triệt Lông (BH 2 Năm)',
    name: 'Triệt Lông ½ Chân',
    desc: 'Triệt vùng bắp chuối / cẳng chân dưới, dứt điểm cảm giác ngứa ngáy và sần sùi sừng nang lông.',
    duration: '35 phút',
    singlePrice: 1900000,
    singlePriceDisplay: '1.900.000đ',
    coursePrice: 1900000,
    coursePriceDisplay: 'Trọn Gói BH 2 Năm',
    isWarranty2Y: true
  },
  {
    id: 'tl-nguyen-chan',
    code: 'TL-07',
    category: 'triet-long',
    categoryName: 'Triệt Lông (BH 2 Năm)',
    name: 'Triệt Lông Nguyên Chân',
    desc: 'Liệu trình triệt toàn bộ đùi và cẳng chân. Đôi chân sáng mịn không tì vết, cấp thẻ bảo hành 2 năm.',
    duration: '50-60 phút',
    singlePrice: 3500000,
    singlePriceDisplay: '3.500.000đ',
    coursePrice: 3500000,
    coursePriceDisplay: 'Trọn Gói BH 2 Năm',
    isWarranty2Y: true,
    highlight: true
  },
  {
    id: 'tl-lung',
    code: 'TL-08',
    category: 'triet-long',
    categoryName: 'Triệt Lông (BH 2 Năm)',
    name: 'Triệt Lông Lưng',
    desc: 'Làm sạch lông lưng rậm rạp, ngăn ngừa ứ đọng mồ hôi và mụn trứng cá lưng tái phát.',
    duration: '40 phút',
    singlePrice: 2500000,
    singlePriceDisplay: '2.500.000đ',
    coursePrice: 2500000,
    coursePriceDisplay: 'Trọn Gói BH 2 Năm',
    isWarranty2Y: true
  },
  {
    id: 'tl-bikini',
    code: 'TL-09',
    category: 'triet-long',
    categoryName: 'Triệt Lông (BH 2 Năm)',
    name: 'Triệt Lông Bikini',
    desc: 'Khu vực rèm ngăn riêng biệt kín đáo, kỹ thuật viên nữ chuyên nghiệp, dụng cụ tiệt trùng tuyệt đối, êm ái không đau rát.',
    duration: '30-40 phút',
    singlePrice: 2200000,
    singlePriceDisplay: '2.200.000đ',
    coursePrice: 2200000,
    coursePriceDisplay: 'Trọn Gói BH 2 Năm',
    isWarranty2Y: true,
    highlight: true
  },
  {
    id: 'tl-toan-than',
    code: 'TL-10',
    category: 'triet-long',
    categoryName: 'Triệt Lông (BH 2 Năm)',
    name: 'Triệt Lông Toàn Thân (Full Body)',
    desc: 'Gói chăm sóc cao cấp nhất bao gồm tất cả các vùng trên cơ thể, thẻ bảo hành 2 năm giá trị trọn đời.',
    duration: '90-120 phút',
    singlePrice: 12700000,
    singlePriceDisplay: '12.700.000đ',
    coursePrice: 12700000,
    coursePriceDisplay: 'Trọn Gói Toàn Thân BH 2N',
    isWarranty2Y: true,
    highlight: true
  },

  // 2. ĐIỀU TRỊ MỤN CHUẨN Y KHOA
  {
    id: 'nm-mat-coban',
    code: 'AC-01',
    category: 'nan-mun',
    categoryName: 'Điều Trị Mụn Y Khoa',
    name: 'Chăm Sóc Da Mặt Nặn Mụn Cơ Bản',
    desc: 'Quy trình 12 bước y khoa: Làm sạch đa tầng, xông hơi giãn nở nang lông, lấy nhân mụn bằng tăm bông/kim y tế vô khuẩn, đắp mặt nạ dịu da.',
    duration: '60 phút',
    singlePrice: 320000,
    singlePriceDisplay: '320.000đ',
    coursePrice: 1199000,
    coursePriceDisplay: '1.199.000đ (5B)',
    savings: '401.000đ'
  },
  {
    id: 'nm-lung',
    code: 'AC-02',
    category: 'nan-mun',
    categoryName: 'Điều Trị Mụn Y Khoa',
    name: 'Chăm Sóc Da Lưng Nặn Mụn',
    desc: 'Tẩy tế bào sừng chết vùng lưng, xông thảo dược hút nhờn, xử lý cồi mụn viêm và chiếu ánh sáng sinh học kháng viêm.',
    duration: '60 phút',
    singlePrice: 420000,
    singlePriceDisplay: '420.000đ',
    coursePrice: 1699000,
    coursePriceDisplay: '1.699.000đ (5B)',
    savings: '401.000đ'
  },
  {
    id: 'nm-tieu-khuan',
    code: 'AC-03',
    category: 'nan-mun',
    categoryName: 'Điều Trị Mụn Y Khoa',
    name: 'Chăm Sóc Nặn Mụn + Tiêu Khuẩn',
    desc: 'Kết hợp lấy mụn chuẩn y khoa với công nghệ tia điện tím tiêu diệt vi khuẩn P.Acnes, kháng viêm giảm đỏ tức thì.',
    duration: '75 phút',
    singlePrice: 600000,
    singlePriceDisplay: '600.000đ',
    coursePrice: 2199000,
    coursePriceDisplay: '2.199.000đ (5B)',
    savings: '801.000đ',
    highlight: true
  },
  {
    id: 'nm-tieu-khuan-chuyen-sau',
    code: 'AC-04',
    category: 'nan-mun',
    categoryName: 'Điều Trị Mụn Y Khoa',
    name: 'Chăm Sóc Nặn Mụn + Tiêu Khuẩn Chuyên Sâu',
    desc: 'Phác đồ nâng cao cho da mụn viêm mủ nặng, kết hợp tinh chất kháng sinh sinh học và chiếu đèn sinh học đa sắc.',
    duration: '90 phút',
    singlePrice: 800000,
    singlePriceDisplay: '800.000đ',
    coursePrice: 3199000,
    coursePriceDisplay: '3.199.000đ (5B)',
    savings: '801.000đ',
    highlight: true
  },
  {
    id: 'nm-premium',
    code: 'AC-05',
    category: 'nan-mun',
    categoryName: 'Điều Trị Mụn Y Khoa',
    name: 'Premium Skin Treatment',
    desc: 'Liệu trình phục hồi màng bảo vệ da chuyên sâu, kiểm soát tuyến dầu, thu nhỏ lỗ chân lông và tăng cường đề kháng biểu bì.',
    duration: '75 phút',
    singlePrice: 500000,
    singlePriceDisplay: '500.000đ',
    coursePrice: 1899000,
    coursePriceDisplay: '1.899.000đ (5B)',
    savings: '601.000đ'
  },

  // 3. SKINCARE & PHỤC HỒI CHUYÊN SÂU
  {
    id: 'sk-nangco-matna',
    code: 'SK-01',
    category: 'skincare',
    categoryName: 'Skincare & Phục Hồi',
    name: 'Massage Nâng Cơ + Mặt Nạ Thư Giãn',
    desc: 'Thủ pháp massage bấm huyệt lưu thông tuần hoàn khí huyết, định hình đường viền hàm và cấp ẩm chuyên sâu với mặt nạ collagen.',
    duration: '60 phút',
    singlePrice: 350000,
    singlePriceDisplay: '350.000đ',
    coursePrice: 1250000,
    coursePriceDisplay: '1.250.000đ (5B)',
    savings: '500.000đ'
  },
  {
    id: 'sk-nangco-vitc',
    code: 'SK-02',
    category: 'skincare',
    categoryName: 'Skincare & Phục Hồi',
    name: 'Massage Nâng Cơ + Vitamin C',
    desc: 'Kết hợp massage nâng cơ và điện di ion đưa Vitamin C tinh khiết vào sâu tầng đáy biểu bì giúp mờ thâm nám, bật tone hồng hào.',
    duration: '70 phút',
    singlePrice: 490000,
    singlePriceDisplay: '490.000đ',
    coursePrice: 1899000,
    coursePriceDisplay: '1.899.000đ (5B)',
    savings: '551.000đ'
  },
  {
    id: 'sk-cay-te-bao-thuc-vat',
    code: 'SK-03',
    category: 'skincare',
    categoryName: 'Skincare & Phục Hồi',
    name: 'Cấy Tế Bào Thực Vật',
    desc: 'Nuôi dưỡng da từ gốc với tế bào mầm thực vật tự nhiên, kích thích tăng sinh tế bào mới cho làn da mỏng yếu và nhạy cảm.',
    duration: '75 phút',
    singlePrice: 520000,
    singlePriceDisplay: '520.000đ',
    coursePrice: 2000000,
    coursePriceDisplay: '2.000.000đ (5B)',
    savings: '600.000đ'
  },
  {
    id: 'sk-diendi-ha',
    code: 'SK-04',
    category: 'skincare',
    categoryName: 'Skincare & Phục Hồi',
    name: 'Điện Di HA Cấp Ẩm Đa Tầng',
    desc: 'Công nghệ điện di lạnh đưa phân tử Hyaluronic Acid đa tầng vào sâu trong tế bào, khóa ẩm lập tức cho làn da căng mọng bóng nước.',
    duration: '60 phút',
    singlePrice: 370000,
    singlePriceDisplay: '370.000đ',
    coursePrice: 1299000,
    coursePriceDisplay: '1.299.000đ (5B)',
    savings: '551.000đ',
    highlight: true
  },
  {
    id: 'sk-detox-bio',
    code: 'SK-05',
    category: 'skincare',
    categoryName: 'Skincare & Phục Hồi',
    name: 'Detox Bio Trẻ Hóa Da (+ Nặn Mụn)',
    desc: 'Đào thải độc tố kim loại nặng, cặn chì mỹ phẩm và ô nhiễm tích tụ dưới da, kết hợp nặn mụn y khoa và thanh lọc toàn diện.',
    duration: '80 phút',
    singlePrice: 740000,
    singlePriceDisplay: '740.000đ',
    coursePrice: 2799000,
    coursePriceDisplay: '2.799.000đ (5B)',
    savings: '901.000đ'
  },
  {
    id: 'sk-u-white-face-co',
    code: 'SK-06',
    category: 'skincare',
    categoryName: 'Skincare & Phục Hồi',
    name: 'Ủ White Face (+ Ủ White Cổ)',
    desc: 'Liệu trình ủ trắng sinh học đồng bộ vùng mặt và cổ, dưỡng trắng mướt đều màu, không bào mòn, không bắt nắng.',
    duration: '75 phút',
    singlePrice: 790000,
    singlePriceDisplay: '790.000đ',
    coursePrice: 3000000,
    coursePriceDisplay: '3.000.000đ (5B)',
    savings: '950.000đ'
  },

  // 4. CHEMICAL PEEL (KÈM NẶN MỤN)
  {
    id: 'peel-tao-1',
    code: 'CP-01',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel Thay Da',
    name: 'Peel Tảo Sống Sinh Học (Cấp độ 1)',
    desc: 'Vi kim tảo biển tự nhiên giúp gom cồi mụn, loại bỏ tế bào sừng già cỗi và mờ thâm nhẹ.',
    duration: '75 phút',
    singlePrice: 2000000,
    singlePriceDisplay: '2.000.000đ',
    coursePrice: 7900000,
    coursePriceDisplay: '7.900.000đ (5B)',
    savings: '2.100.000đ'
  },
  {
    id: 'peel-tao-2',
    code: 'CP-02',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel Thay Da',
    name: 'Peel Tảo Sống Sinh Học (Cấp độ 2)',
    desc: 'Tác động sâu hơn vào lớp thượng bì điều trị thâm sạm trung bình và tái tạo da dày sừng.',
    duration: '75 phút',
    singlePrice: 2500000,
    singlePriceDisplay: '2.500.000đ',
    coursePrice: 9000000,
    coursePriceDisplay: '9.000.000đ (5B)',
    savings: '3.500.000đ'
  },
  {
    id: 'peel-tao-3',
    code: 'CP-03',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel Thay Da',
    name: 'Peel Tảo Sống Sinh Học (Cấp độ 3)',
    desc: 'Phác đồ điều trị chuyên sâu cho nền da dày sừng nặng, thâm mụn lâu năm và sần sùi lỗ chân lông.',
    duration: '80 phút',
    singlePrice: 3000000,
    singlePriceDisplay: '3.000.000đ',
    coursePrice: 10000000,
    coursePriceDisplay: '10.000.000đ (5B)',
    savings: '5.000.000đ'
  },
  {
    id: 'peel-b-lift',
    code: 'CP-04',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel Thay Da',
    name: 'Peel B-Lift',
    desc: 'Kích thích tăng sinh collagen, nâng cơ săn chắc, làm mờ rãnh nhăn nông và tái cấu trúc làn da.',
    duration: '60 phút',
    singlePrice: 800000,
    singlePriceDisplay: '800.000đ',
    coursePrice: 3199000,
    coursePriceDisplay: '3.199.000đ (5B)',
    savings: '801.000đ'
  },
  {
    id: 'peel-image-re',
    code: 'CP-05',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel Thay Da',
    name: 'Peel Image + RE (Dược Mỹ Phẩm Mỹ)',
    desc: 'Ứng dụng dòng peel cao cấp của Image Skincare Hoa Kỳ kết hợp Retinol phục hồi, tái tạo làn da mới mịn màng.',
    duration: '70 phút',
    singlePrice: 980000,
    singlePriceDisplay: '980.000đ',
    coursePrice: 3699000,
    coursePriceDisplay: '3.699.000đ (5B)',
    savings: '1.201.000đ',
    highlight: true
  },
  {
    id: 'peel-skin-repair',
    code: 'CP-06',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel Thay Da',
    name: 'Peel Skin Repair',
    desc: 'Phục hồi da tổn thương sau mụn, củng cố hàng rào lipid sinh học và giảm cảm giác châm chích mẩn đỏ.',
    duration: '60 phút',
    singlePrice: 1000000,
    singlePriceDisplay: '1.000.000đ',
    coursePrice: 3800000,
    coursePriceDisplay: '3.800.000đ (5B)',
    savings: '1.200.000đ'
  },
  {
    id: 'peel-skin-recovery',
    code: 'CP-07',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel Thay Da',
    name: 'Peel Skin Recovery',
    desc: 'Liệu trình giải cứu làn da nhiễm độc tố mỹ phẩm hoặc quá nhạy cảm, phục hồi độ ẩm và độ mềm mượt.',
    duration: '60 phút',
    singlePrice: 990000,
    singlePriceDisplay: '990.000đ',
    coursePrice: 3799000,
    coursePriceDisplay: '3.799.000đ (5B)',
    savings: '1.151.000đ'
  },
  {
    id: 'peel-la2',
    code: 'CP-08',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel Thay Da',
    name: 'Peel LA2',
    desc: 'Phức hợp Lactic Acid & Salicylic Acid thế hệ mới giúp làm sạch lỗ chân lông, kiềm dầu và chống mụn viêm.',
    duration: '65 phút',
    singlePrice: 1200000,
    singlePriceDisplay: '1.200.000đ',
    coursePrice: 4199000,
    coursePriceDisplay: '4.199.000đ (5B)',
    savings: '1.801.000đ'
  },
  {
    id: 'peel-peptides',
    code: 'CP-09',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel Thay Da',
    name: 'Peel Peptides',
    desc: 'Bổ sung chuỗi peptide sinh học chống lão hóa sớm, tăng độ đàn hồi và tạo độ căng bóng tự nhiên.',
    duration: '60 phút',
    singlePrice: 760000,
    singlePriceDisplay: '760.000đ',
    coursePrice: 2200000,
    coursePriceDisplay: '2.200.000đ (5B)',
    savings: '1.600.000đ'
  },
  {
    id: 'peel-tca-cham',
    code: 'CP-10',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel Thay Da',
    name: 'Peel TCA - Chấm TCA Sẹo Rỗ',
    desc: 'Kỹ thuật TCA Cross chuẩn Y khoa tái tạo đáy sẹo rỗ chân nhọn (Icepick scar) và se khít lỗ chân lông sâu.',
    duration: '75 phút',
    singlePrice: 2500000,
    singlePriceDisplay: '2.500.000đ',
    coursePrice: 9000000,
    coursePriceDisplay: '9.000.000đ (5B)',
    savings: '3.500.000đ',
    highlight: true
  },
  {
    id: 'peel-tca-re',
    code: 'CP-11',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel Thay Da',
    name: 'Peel TCA - RE',
    desc: 'Liệu trình tái tạo bề mặt da, xử lý thâm sạm và làm đồng đều sắc tố biểu bì.',
    duration: '65 phút',
    singlePrice: 1500000,
    singlePriceDisplay: '1.500.000đ',
    coursePrice: 5499000,
    coursePriceDisplay: '5.499.000đ (5B)',
    savings: '2.001.000đ'
  },
  {
    id: 'peel-tre-hoa-nach',
    code: 'CP-12',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel Thay Da',
    name: 'Peel Trẻ Hóa Vùng Nách',
    desc: 'Đặc trị thâm nách, viêm sừng nang lông và sần sùi dưới cánh tay, giúp vùng da trắng hồng mịn màng.',
    duration: '45 phút',
    singlePrice: 750000,
    singlePriceDisplay: '750.000đ',
    coursePrice: 2750000,
    coursePriceDisplay: '2.750.000đ (5B)',
    savings: '1.000.000đ',
    highlight: true
  },
  {
    id: 'peel-multilayer-uwhite',
    code: 'CP-13',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel Thay Da',
    name: 'Peel Multi - Layer + Ủ White',
    desc: 'Peel sinh học đa tầng kết hợp liệu pháp ủ sáng trắng khóa dưỡng chất mang lại làn da trắng hồng căng bóng.',
    duration: '80 phút',
    singlePrice: 1500000,
    singlePriceDisplay: '1.500.000đ',
    coursePrice: 5499000,
    coursePriceDisplay: '5.499.000đ (5B)',
    savings: '2.001.000đ'
  },

  // 5. CHĂM SÓC VÙNG MẮT (EYE CARE)
  {
    id: 'eye-active',
    code: 'EY-01',
    category: 'eye',
    categoryName: 'Chăm Sóc Vùng Mắt',
    name: 'Active Eyes - Trị Quầng Thâm & Mệt Mỏi',
    desc: 'Kích hoạt tuần hoàn máu quanh hốc mắt, giảm quầng thâm do thức khuya, tan bọng mắt ứ nước và giải tỏa mỏi mắt.',
    duration: '45 phút',
    singlePrice: 1800000,
    singlePriceDisplay: '1.800.000đ',
    coursePrice: 7700000,
    coursePriceDisplay: '7.700.000đ (5B)',
    savings: '1.300.000đ'
  },
  {
    id: 'eye-young',
    code: 'EY-02',
    category: 'eye',
    categoryName: 'Chăm Sóc Vùng Mắt',
    name: 'Young Eyes - Trẻ Hóa & Xóa Nhăn Đuôi Mắt',
    desc: 'Tinh chất peptide cô đặc chuyên biệt cho vùng da mắt mỏng manh, là phẳng vết chân chim và nâng cơ mí mắt chùng xệ.',
    duration: '50 phút',
    singlePrice: 2000000,
    singlePriceDisplay: '2.000.000đ',
    coursePrice: 8000000,
    coursePriceDisplay: '8.000.000đ (5B)',
    savings: '2.000.000đ',
    highlight: true
  },

  // 7. SHADING & PHUN XĂM THẨM MỸ
  {
    id: 'shading-may-moi',
    code: 'SD-01',
    category: 'shading',
    categoryName: 'Shading & Phun Xăm',
    name: 'Phun Mày / Môi',
    desc: 'Kỹ thuật phun thêu thẩm mỹ hiện đại với mực hữu cơ Châu Âu an toàn lành tính, tạo dáng chân mày thanh tú hài hòa hoặc sắc môi tươi tắn, căng mọng tự nhiên, không sưng đau.',
    duration: '90-120 phút',
    singlePrice: 3500000,
    singlePriceDisplay: '3.500.000đ - 5.000.000đ',
    coursePrice: 3500000,
    coursePriceDisplay: 'Trọn Gói Kèm Dặm',
    highlight: true
  },
  {
    id: 'shading-khu-tham',
    code: 'SD-02',
    category: 'shading',
    categoryName: 'Shading & Phun Xăm',
    name: 'Khử Thâm Môi Chuyên Sâu',
    desc: 'Ứng dụng công nghệ laser vi điểm xử lý sạch viền thâm bẩm sinh, môi loang màu do son chứa chì, đưa sắc môi về nền sáng hồng chuẩn.',
    duration: '60 phút',
    singlePrice: 1500000,
    singlePriceDisplay: '1.500.000đ - 3.000.000đ',
    coursePrice: 1500000,
    coursePriceDisplay: 'Tùy Cấp Độ Thâm',
    customPriceNote: 'Khử thâm cấp độ 1 - 3'
  }
];

export const CLINICAL_STEPS = [
  {
    step: '01',
    title: 'Kiểm Tra Da & Tư Vấn Tận Tâm',
    desc: 'Chuyên viên giàu kinh nghiệm phân tích tình trạng da, xác định nhu cầu và tư vấn gói dịch vụ phù hợp nhất.'
  },
  {
    step: '02',
    title: 'Tiệt Trùng & Làm Sạch Sâu',
    desc: 'Tẩy trang, rửa mặt dịu nhẹ, tẩy tế bào chết sinh học và xông hơi giãn nở nang lông hút sạch bã nhờn trong môi trường sạch sẽ.'
  },
  {
    step: '03',
    title: 'Thực Hiện Liệu Trình Chuyên Sâu',
    desc: 'Kỹ thuật viên tay nghề cao thao tác chuẩn xác: lấy mụn êm ái, bắn Diode laser đầu lạnh, điện di cấp ẩm hoặc Chemical Peel.'
  },
  {
    step: '04',
    title: 'Tiêu Khuẩn & Làm Dịu Biểu Bì',
    desc: 'Chiếu tia điện tím diệt khuẩn tức thì kết hợp ánh sáng sinh học Biolight giảm đỏ và đẩy nhanh quá trình làm dịu da.'
  },
  {
    step: '05',
    title: 'Điện Di Tinh Chất Khóa Ẩm',
    desc: 'Điện di lạnh thẩm thấu sâu tinh chất HA/dưỡng chất và đắp mặt nạ đặc trị giúp làm dịu và phục hồi tối ưu màng ẩm da.'
  },
  {
    step: '06',
    title: 'Cấp Thẻ Bảo Hành & Hướng Dẫn',
    desc: 'Cấp thẻ bảo hành điện tử chính thức (cho liệu trình triệt lông 2 năm) và hướng dẫn cách chăm sóc tại nhà tận tâm 24/7.'
  }
];

export const WARRANTY_POLICY = {
  title: 'Chính Sách Bảo Hành Triệt Lông 2 Năm Bằng Văn Bản',
  subtitle: 'Cam kết rõ ràng - Bảo đảm quyền lợi tối đa cho khách hàng',
  benefits: [
    {
      title: 'Thời Gian Bảo Hành 24 Tháng Trọn Gói',
      desc: 'Áp dụng cho tất cả các vùng triệt lông (Nách, Mép, Tay, Chân, Bikini, Toàn Thân) kể từ ngày kích hoạt dịch vụ.'
    },
    {
      title: 'Cam Kết Không Phát Sinh Chi Phí',
      desc: 'Khách hàng được dặm định kỳ miễn phí trong suốt 2 năm theo phác đồ chỉ định mà không phải trả thêm bất kỳ phụ phí nào.'
    },
    {
      title: 'Cấp Thẻ Bảo Hành Điện Tử & Thẻ Cứng',
      desc: 'Mỗi khách hàng được lưu trữ hồ sơ điện tử riêng biệt trên hệ thống quản lý FORHER Beauty, theo dõi lịch sử liệu trình minh bạch.'
    },
    {
      title: 'Kỹ Thuật Viên Tay Nghề Chu Đáo',
      desc: 'Được phục vụ trong không gian spa ấm cúng, rèm che riêng biệt bởi đội ngũ kỹ thuật viên lành nghề với công nghệ Diode Laser an toàn.'
    }
  ]
};

export const FAQS = [
  {
    q: 'Bảng giá tại FORHER Beauty có phát sinh thêm phụ phí nào không?',
    a: 'Dạ hoàn toàn KHÔNG. Mọi mức giá niêm yết trên website và bảng giá tại cơ sở đều là chi phí trọn gói. Chúng tôi cam kết bằng uy tín không thu thêm phí phụ thu, phí tư vấn hay bất kỳ chi phí ẩn nào.'
  },
  {
    q: 'Gói triệt lông bảo hành 2 năm hoạt động như thế nào?',
    a: 'Khi đăng ký bất kỳ dịch vụ triệt lông nào (từ Nách 500k đến Toàn Thân 12.7tr), quý khách sẽ nhận được thẻ bảo hành 2 năm chính thức. Sau liệu trình ban đầu (khoảng 6-8 buổi), trong suốt 24 tháng tiếp theo nếu có nang lông tơ mảnh mọc lại, quý khách chỉ cần đặt hẹn ghé dặm hoàn toàn miễn phí.'
  },
  {
    q: 'Nặn mụn tại FORHER có gây sưng đỏ hay thâm sẹo không?',
    a: 'Quy trình lấy mụn tại FORHER sử dụng dụng cụ tiệt trùng 1 lần riêng biệt, chỉ lấy các cồi mụn đã gom già, không chèn ép mô lành. Sau khi lấy mụn, da được sát khuẩn tia điện tím và chiếu ánh sáng sinh học làm dịu, giúp vết mụn se khô nhanh sau 12-24h và hạn chế tối đa nguy cơ thâm sẹo.'
  },
  {
    q: 'Gói liệu trình 5 buổi có thời hạn sử dụng bao lâu?',
    a: 'Gói liệu trình 5 buổi (Chăm sóc mụn, Skincare, Chemical Peel, Gội đầu dưỡng sinh) có giá trị sử dụng lên đến 12 tháng kể từ ngày đăng ký. Khách hàng có thể linh hoạt sắp xếp thời gian ghé chăm sóc định kỳ theo lời khuyên của chuyên viên.'
  },
  {
    q: 'Tôi có cần đặt lịch hẹn trước khi đến FORHER Beauty không?',
    a: 'Để đảm bảo chất lượng phục vụ chu đáo và quý khách không phải chờ đợi trong giờ cao điểm, FORHER khuyến khích bạn đặt hẹn trước qua website hoặc Hotline/Zalo 0703 994 683. Khách hàng đặt trước luôn được ưu tiên giữ giường dịch vụ và sắp xếp chuyên viên sẵn sàng.'
  }
];

export const TESTIMONIALS = [
  {
    name: 'Chị Mai Phương',
    role: 'Quận 3, TP.HCM',
    treatment: 'Gói Triệt Lông Toàn Thân & Điện Di Phục Hồi',
    rating: 5,
    comment: 'Tôi đánh giá rất cao sự minh bạch và chuyên nghiệp của FORHER Beauty. Bảng giá rõ ràng, không mồi chài bán thêm gói, thẻ bảo hành 2 năm có giá trị thực tế. Không gian cực kỳ sạch sẽ và rèm che kín đáo.'
  },
  {
    name: 'Bạn Hoàng Yến',
    role: 'Nhân Viên Văn Phòng, Quận 10',
    treatment: 'Liệu Trình Điều Trị Mụn Tiêu Khuẩn 5B',
    rating: 5,
    comment: 'Quy trình tiệt trùng tại FORHER rất kỹ lưỡng, găng tay và que gắp dùng riêng biệt. Sau 3 buổi da mình đã giảm mụn viêm rõ rệt, kết hợp gội đầu dưỡng sinh ở đây thư giãn tuyệt vời!'
  },
  {
    name: 'Chị Thanh Trúc',
    role: 'Chuyên Viên Tài Chính, Quận 10',
    treatment: 'Peel Image Skincare & Phun Môi Baby',
    rating: 5,
    comment: 'Môi sau khi làm xong có sắc hồng cam baby rất tự nhiên, đồng nghiệp ai cũng khen. Dịch vụ chăm sóc sau liệu trình qua Zalo rất tận tình, nhắc lịch dặm chu đáo.'
  }
];

export function formatCurrency(amount) {
  if (typeof amount !== 'number') return amount;
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}
