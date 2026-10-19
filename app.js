/**
 * FORHER BEAUTY & SPA - APPLICATION LOGIC
 * Complete service database, interactive booking cart, skin quiz, and search
 */

// Comprehensive Database based on official menu sheets
const SERVICES_DATA = [
  // 1. TRIỆT LÔNG BẢO HÀNH 2 NĂM
  {
    id: 'tl-nach',
    category: 'triet-long',
    categoryName: 'Triệt Lông 2 Năm BH',
    badgeClass: 'badge-triet-long',
    name: 'Triệt Lông Nách',
    notes: 'Bảo hành 2 năm trọn gói. Công nghệ Diode Laser làm lạnh âm độ, êm dịu, sáng da, se khít lỗ chân lông.',
    singlePrice: 500000,
    singlePriceDisplay: '500.000đ',
    coursePrice: 500000,
    coursePriceDisplay: 'Bảo Hành 2 Năm Trọn Gói',
    isWarranty2Y: true,
    highlight: true
  },
  {
    id: 'tl-mep',
    category: 'triet-long',
    categoryName: 'Triệt Lông 2 Năm BH',
    badgeClass: 'badge-triet-long',
    name: 'Triệt Lông Mép',
    notes: 'Bảo hành 2 năm trọn gói. Giúp vùng mép sáng mịn, tự tin hơn khi trang điểm, không đau rát.',
    singlePrice: 450000,
    singlePriceDisplay: '450.000đ',
    coursePrice: 450000,
    coursePriceDisplay: 'Bảo Hành 2 Năm Trọn Gói',
    isWarranty2Y: true
  },
  {
    id: 'tl-mat',
    category: 'triet-long',
    categoryName: 'Triệt Lông 2 Năm BH',
    badgeClass: 'badge-triet-long',
    name: 'Triệt Lông Mặt',
    notes: 'Bảo hành 2 năm. Triệt sạch lông tơ toàn mặt, hỗ trợ giảm bít tắc mụn cám, da sáng tone rõ rệt.',
    singlePrice: 1700000,
    singlePriceDisplay: '1.700.000đ',
    coursePrice: 1700000,
    coursePriceDisplay: 'Bảo Hành 2 Năm Trọn Gói',
    isWarranty2Y: true
  },
  {
    id: 'tl-nua-tay',
    category: 'triet-long',
    categoryName: 'Triệt Lông 2 Năm BH',
    badgeClass: 'badge-triet-long',
    name: 'Triệt Lông ½ Tay',
    notes: 'Bảo hành 2 năm. Áp dụng cẳng tay trên hoặc dưới theo nhu cầu của khách hàng.',
    singlePrice: 1400000,
    singlePriceDisplay: '1.400.000đ',
    coursePrice: 1400000,
    coursePriceDisplay: 'Bảo Hành 2 Năm Trọn Gói',
    isWarranty2Y: true
  },
  {
    id: 'tl-nguyen-tay',
    category: 'triet-long',
    categoryName: 'Triệt Lông 2 Năm BH',
    badgeClass: 'badge-triet-long',
    name: 'Triệt Lông Nguyên Tay',
    notes: 'Bảo hành 2 năm. Triệt toàn bộ 2 cánh tay, da mịn màng, tự tin diện trang phục ngắn tay.',
    singlePrice: 2200000,
    singlePriceDisplay: '2.200.000đ',
    coursePrice: 2200000,
    coursePriceDisplay: 'Bảo Hành 2 Năm Trọn Gói',
    isWarranty2Y: true
  },
  {
    id: 'tl-nua-chan',
    category: 'triet-long',
    categoryName: 'Triệt Lông 2 Năm BH',
    badgeClass: 'badge-triet-long',
    name: 'Triệt Lông ½ Chân',
    notes: 'Bảo hành 2 năm. Triệt vùng bắp chuối / cẳng chân, loại bỏ tình trạng viêm nang lông.',
    singlePrice: 1900000,
    singlePriceDisplay: '1.900.000đ',
    coursePrice: 1900000,
    coursePriceDisplay: 'Bảo Hành 2 Năm Trọn Gói',
    isWarranty2Y: true
  },
  {
    id: 'tl-nguyen-chan',
    category: 'triet-long',
    categoryName: 'Triệt Lông 2 Năm BH',
    badgeClass: 'badge-triet-long',
    name: 'Triệt Lông Nguyên Chân',
    notes: 'Bảo hành 2 năm. Triệt toàn bộ đùi và bắp chân, cho đôi chân ngọc ngà, mịn màng không tì vết.',
    singlePrice: 3500000,
    singlePriceDisplay: '3.500.000đ',
    coursePrice: 3500000,
    coursePriceDisplay: 'Bảo Hành 2 Năm Trọn Gói',
    isWarranty2Y: true,
    highlight: true
  },
  {
    id: 'tl-lung',
    category: 'triet-long',
    categoryName: 'Triệt Lông 2 Năm BH',
    badgeClass: 'badge-triet-long',
    name: 'Triệt Lông Lưng',
    notes: 'Bảo hành 2 năm. Giúp sạch lông vùng lưng, ngăn ngừa mụn lưng và bít tắc bã nhờn.',
    singlePrice: 2500000,
    singlePriceDisplay: '2.500.000đ',
    coursePrice: 2500000,
    coursePriceDisplay: 'Bảo Hành 2 Năm Trọn Gói',
    isWarranty2Y: true
  },
  {
    id: 'tl-bikini',
    category: 'triet-long',
    categoryName: 'Triệt Lông 2 Năm BH',
    badgeClass: 'badge-triet-long',
    name: 'Triệt Lông Bikini',
    notes: 'Bảo hành 2 năm. Phòng riêng tư 1:1, kỹ thuật viên nữ nhẹ nhàng, vô trùng tuyệt đối, an toàn vệ sinh.',
    singlePrice: 2200000,
    singlePriceDisplay: '2.200.000đ',
    coursePrice: 2200000,
    coursePriceDisplay: 'Bảo Hành 2 Năm Trọn Gói',
    isWarranty2Y: true,
    highlight: true
  },
  {
    id: 'tl-toan-than',
    category: 'triet-long',
    categoryName: 'Triệt Lông 2 Năm BH',
    badgeClass: 'badge-triet-long',
    name: 'Triệt Lông Toàn Thân (Full Body)',
    notes: 'Bảo hành 2 năm toàn diện cho tất cả các vùng cơ thể. Gói dịch vụ VIP được yêu thích nhất.',
    singlePrice: 12700000,
    singlePriceDisplay: '12.700.000đ',
    coursePrice: 12700000,
    coursePriceDisplay: 'Bảo Hành 2 Năm Toàn Thân',
    isWarranty2Y: true,
    highlight: true
  },

  // 2. NẶN MỤN CHUẨN Y KHOA
  {
    id: 'nm-mat-coban',
    category: 'nan-mun',
    categoryName: 'Nặn Mụn Chuẩn Y Khoa',
    badgeClass: 'badge-nan-mun',
    name: 'Chăm Sóc Da Mặt Nặn Mụn Cơ Bản',
    notes: '12 bước làm sạch sâu, xông hơi, hút dầu, lấy nhân mụn bằng tăm bông/kim y tế vô khuẩn, đắp mặt nạ dịu da.',
    singlePrice: 320000,
    singlePriceDisplay: '320.000đ',
    coursePrice: 1199000,
    coursePriceDisplay: '1.199.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 401.000đ'
  },
  {
    id: 'nm-lung',
    category: 'nan-mun',
    categoryName: 'Nặn Mụn Chuẩn Y Khoa',
    badgeClass: 'badge-nan-mun',
    name: 'Chăm Sóc Da Lưng Nặn Mụn',
    notes: 'Tẩy tế bào chết vùng lưng, xông hơi thảo dược, lấy sạch cồi mụn lưng viêm & chiếu ánh sáng sinh học kháng khuẩn.',
    singlePrice: 420000,
    singlePriceDisplay: '420.000đ',
    coursePrice: 1699000,
    coursePriceDisplay: '1.699.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 401.000đ'
  },
  {
    id: 'nm-tieu-khuan',
    category: 'nan-mun',
    categoryName: 'Nặn Mụn Chuẩn Y Khoa',
    badgeClass: 'badge-nan-mun',
    name: 'Chăm Sóc Nặn Mụn + Tiêu Khuẩn',
    notes: 'Quy trình lấy mụn chuẩn y khoa kết hợp công nghệ điện tím diệt khuẩn P.Acnes, giảm sưng đỏ tức thì.',
    singlePrice: 600000,
    singlePriceDisplay: '600.000đ',
    coursePrice: 2199000,
    coursePriceDisplay: '2.199.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 801.000đ',
    highlight: true
  },
  {
    id: 'nm-tieu-khuan-chuyen-sau',
    category: 'nan-mun',
    categoryName: 'Nặn Mụn Chuẩn Y Khoa',
    badgeClass: 'badge-nan-mun',
    name: 'Chăm Sóc Nặn Mụn + Tiêu Khuẩn Chuyên Sâu',
    notes: 'Phác đồ điều trị cho da mụn viêm mủ nặng, kết hợp tinh chất kháng sinh thực vật & ánh sáng sinh học phục hồi.',
    singlePrice: 800000,
    singlePriceDisplay: '800.000đ',
    coursePrice: 3199000,
    coursePriceDisplay: '3.199.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 801.000đ',
    highlight: true
  },
  {
    id: 'nm-premium',
    category: 'nan-mun',
    categoryName: 'Nặn Mụn Chuẩn Y Khoa',
    badgeClass: 'badge-nan-mun',
    name: 'Premium Skin Treatment',
    notes: 'Chăm sóc và điều trị chuyên biệt giúp phục hồi màng bảo vệ da, se khít chân lông và tăng sinh đề kháng.',
    singlePrice: 500000,
    singlePriceDisplay: '500.000đ',
    coursePrice: 1899000,
    coursePriceDisplay: '1.899.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 601.000đ'
  },

  // 3. SKINCARE & PHỤC HỒI
  {
    id: 'sk-nangco-matna',
    category: 'skincare',
    categoryName: 'Skincare & Phục Hồi',
    badgeClass: 'badge-skincare',
    name: 'Massage Nâng Cơ + Mặt Nạ Thư Giãn',
    notes: 'Massage thủ pháp Nhật Bản kích thích tuần hoàn lưu thông máu, thon gọn đường nét cơ mặt và đắp mặt nạ cấp ẩm.',
    singlePrice: 350000,
    singlePriceDisplay: '350.000đ',
    coursePrice: 1250000,
    coursePriceDisplay: '1.250.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 500.000đ'
  },
  {
    id: 'sk-nangco-vitc',
    category: 'skincare',
    categoryName: 'Skincare & Phục Hồi',
    badgeClass: 'badge-skincare',
    name: 'Massage Nâng Cơ + Vitamin C',
    notes: 'Kết hợp massage nâng cơ và điện di Vitamin C tươi nguyên chất giúp da trắng hồng rạng rỡ, mờ thâm.',
    singlePrice: 490000,
    singlePriceDisplay: '490.000đ',
    coursePrice: 1899000,
    coursePriceDisplay: '1.899.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 551.000đ'
  },
  {
    id: 'sk-cay-te-bao-thuc-vat',
    category: 'skincare',
    categoryName: 'Skincare & Phục Hồi',
    badgeClass: 'badge-skincare',
    name: 'Cấy Tế Bào Thực Vật',
    notes: 'Dưỡng chất từ tế bào mầm thực vật giúp nuôi dưỡng da từ sâu bên trong, trẻ hóa làn da yếu, nhạy cảm.',
    singlePrice: 520000,
    singlePriceDisplay: '520.000đ',
    coursePrice: 2000000,
    coursePriceDisplay: '2.000.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 600.000đ'
  },
  {
    id: 'sk-diendi-ha',
    category: 'skincare',
    categoryName: 'Skincare & Phục Hồi',
    badgeClass: 'badge-skincare',
    name: 'Điện Di HA Cấp Ẩm Đa Tầng',
    notes: 'Điện di tinh chất Hyaluronic Acid phân tử siêu nhỏ thẩm thấu sâu, khóa ẩm tức thì cho làn da căng mọng bóng khỏe.',
    singlePrice: 370000,
    singlePriceDisplay: '370.000đ',
    coursePrice: 1299000,
    coursePriceDisplay: '1.299.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 551.000đ',
    highlight: true
  },
  {
    id: 'sk-detox-bio',
    category: 'skincare',
    categoryName: 'Skincare & Phục Hồi',
    badgeClass: 'badge-skincare',
    name: 'Detox Bio Trẻ Hóa Da (+ Nặn Mụn)',
    notes: 'Liệu trình đào thải độc tố kim loại, chì dưới da, kết hợp nặn mụn làm sạch sâu và tái tạo sinh học.',
    singlePrice: 740000,
    singlePriceDisplay: '740.000đ',
    coursePrice: 2799000,
    coursePriceDisplay: '2.799.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 901.000đ'
  },
  {
    id: 'sk-u-white-face-co',
    category: 'skincare',
    categoryName: 'Skincare & Phục Hồi',
    badgeClass: 'badge-skincare',
    name: 'Ủ White Face (+ Ủ White Cổ)',
    notes: 'Liệu pháp ủ dưỡng trắng chuyên sâu toàn diện vùng mặt và cổ, nâng tone đồng đều, không bắt nắng.',
    singlePrice: 790000,
    singlePriceDisplay: '790.000đ',
    coursePrice: 3000000,
    coursePriceDisplay: '3.000.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 950.000đ'
  },

  // 4. CHEMICAL PEEL (KÈM NẶN MỤN)
  {
    id: 'peel-tao',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel & Thay Da',
    badgeClass: 'badge-chemical-peel',
    name: 'Peel Tảo Sống Sinh Học',
    notes: 'Vi kim vi tảo biển hữu cơ giúp bong tế bào sừng già cỗi, gom cồi mụn, mờ thâm nám từ nhẹ đến sâu.',
    singlePrice: 2000000,
    singlePriceDisplay: '2.000.000đ - 3.000.000đ',
    coursePrice: 7900000,
    coursePriceDisplay: '7.900.000đ - 10.000.000đ',
    courseSessions: 5,
    savingsText: 'Gói 5 buổi ưu đãi'
  },
  {
    id: 'peel-b-lift',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel & Thay Da',
    badgeClass: 'badge-chemical-peel',
    name: 'Peel B-Lift',
    notes: 'Tái tạo cấu trúc collagen, nâng cơ săn chắc, làm mờ rãnh nhăn li ti và làm sáng đều màu da.',
    singlePrice: 800000,
    singlePriceDisplay: '800.000đ',
    coursePrice: 3199000,
    coursePriceDisplay: '3.199.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 801.000đ'
  },
  {
    id: 'peel-image-re',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel & Thay Da',
    badgeClass: 'badge-chemical-peel',
    name: 'Peel Image + RE (Dược Mỹ Phẩm Mỹ)',
    notes: 'Sử dụng dòng Peel cao cấp từ thương hiệu Image Skincare Hoa Kỳ kết hợp Retinol phục hồi chuyên sâu.',
    singlePrice: 980000,
    singlePriceDisplay: '980.000đ',
    coursePrice: 3699000,
    coursePriceDisplay: '3.699.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 1.201.000đ',
    highlight: true
  },
  {
    id: 'peel-skin-repair',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel & Thay Da',
    badgeClass: 'badge-chemical-peel',
    name: 'Peel Skin Repair',
    notes: 'Đặc trị phục hồi cho làn da tổn thương sau mụn, giảm mẩn đỏ và củng cố biểu bì da khỏe mạnh.',
    singlePrice: 1000000,
    singlePriceDisplay: '1.000.000đ',
    coursePrice: 3800000,
    coursePriceDisplay: '3.800.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 1.200.000đ'
  },
  {
    id: 'peel-skin-recovery',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel & Thay Da',
    badgeClass: 'badge-chemical-peel',
    name: 'Peel Skin Recovery',
    notes: 'Liệu trình phục hồi da yếu, da dùng mỹ phẩm kích ứng, giúp da lấy lại độ mềm mượt tự nhiên.',
    singlePrice: 990000,
    singlePriceDisplay: '990.000đ',
    coursePrice: 3799000,
    coursePriceDisplay: '3.799.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 1.151.000đ'
  },
  {
    id: 'peel-la2',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel & Thay Da',
    badgeClass: 'badge-chemical-peel',
    name: 'Peel LA2',
    notes: 'Phức hợp Acid Lactic & Acid Salicylic thế hệ mới loại bỏ tế bào chết, kiềm dầu, ngăn chặn mụn tái phát.',
    singlePrice: 1200000,
    singlePriceDisplay: '1.200.000đ',
    coursePrice: 4199000,
    coursePriceDisplay: '4.199.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 1.801.000đ'
  },
  {
    id: 'peel-peptides',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel & Thay Da',
    badgeClass: 'badge-chemical-peel',
    name: 'Peel Peptides',
    notes: 'Peel nồng độ an toàn giàu chuỗi Peptide sinh học giúp tăng sinh đàn hồi, chống lão hóa sớm.',
    singlePrice: 760000,
    singlePriceDisplay: '760.000đ',
    coursePrice: 2200000,
    coursePriceDisplay: '2.200.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 1.600.000đ'
  },
  {
    id: 'peel-tca-cham',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel & Thay Da',
    badgeClass: 'badge-chemical-peel',
    name: 'Peel TCA - Chấm TCA Sẹo Rỗ',
    notes: 'Kỹ thuật TCA Cross chuẩn y khoa điều trị sẹo lõm chân đá nhọn (ice pick), sẹo rỗ lâu năm hiệu quả vượt trội.',
    singlePrice: 2500000,
    singlePriceDisplay: '2.500.000đ',
    coursePrice: 9000000,
    coursePriceDisplay: '9.000.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 3.500.000đ',
    highlight: true
  },
  {
    id: 'peel-tca-re',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel & Thay Da',
    badgeClass: 'badge-chemical-peel',
    name: 'Peel TCA - RE',
    notes: 'Liệu trình tái tạo bề mặt da, xử lý thâm sạm và lỗ chân lông to với nồng độ TCA chuẩn an toàn.',
    singlePrice: 1500000,
    singlePriceDisplay: '1.500.000đ',
    coursePrice: 5499000,
    coursePriceDisplay: '5.499.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 2.001.000đ'
  },
  {
    id: 'peel-tre-hoa-nach',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel & Thay Da',
    badgeClass: 'badge-chemical-peel',
    name: 'Peel Trẻ Hóa & Trị Thâm Vùng Nách',
    notes: 'Đánh bay thâm nách, sần sùi sừng nang lông, giúp vùng dưới cánh tay trắng hồng, mịn màng tự tin.',
    singlePrice: 750000,
    singlePriceDisplay: '750.000đ',
    coursePrice: 2750000,
    coursePriceDisplay: '2.750.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 1.000.000đ',
    highlight: true
  },
  {
    id: 'peel-multilayer-uwhite',
    category: 'chemical-peel',
    categoryName: 'Chemical Peel & Thay Da',
    badgeClass: 'badge-chemical-peel',
    name: 'Peel Multi - Layer + Ủ White',
    notes: 'Peel đa tầng sinh học kết hợp liệu pháp ủ sáng khóa dưỡng, mang lại làn da trắng mịn bóng bẩy.',
    singlePrice: 1500000,
    singlePriceDisplay: '1.500.000đ',
    coursePrice: 5499000,
    coursePriceDisplay: '5.499.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 2.001.000đ'
  },

  // 5. MESOTHERAPY (MS) - CẤY TINH CHẤT
  {
    id: 'ms-hyaluronic',
    category: 'meso',
    categoryName: 'Mesotherapy (MS)',
    badgeClass: 'badge-meso',
    name: 'Meso Cấy Tinh Chất Hyaluronic (HA)',
    notes: 'Tiêm vi điểm cấy HA trực tiếp vào trung bì, cấp nước sâu cho da ngậm nước căng bóng tức thì.',
    singlePrice: 2550000,
    singlePriceDisplay: '2.550.000đ',
    coursePrice: 8800000,
    coursePriceDisplay: '8.800.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 3.950.000đ',
    highlight: true
  },
  {
    id: 'ms-epqf-ha3',
    category: 'meso',
    categoryName: 'Mesotherapy (MS)',
    badgeClass: 'badge-meso',
    name: 'Meso E-PQF + HA 3%',
    notes: 'Sự kết hợp giữa yếu tố tăng trưởng biểu bì E-PQF và nồng độ HA 3% đậm đặc giúp phục hồi da lão hóa.',
    singlePrice: 2990000,
    singlePriceDisplay: '2.990.000đ',
    coursePrice: 9000000,
    coursePriceDisplay: '9.000.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 5.950.000đ'
  },
  {
    id: 'ms-activated-ce-glu',
    category: 'meso',
    categoryName: 'Mesotherapy (MS)',
    badgeClass: 'badge-meso',
    name: 'Meso Activated C-E GLU (Trắng Sáng & Chống Oxy Hóa)',
    notes: 'Công thức bộ ba vàng Vitamin C, Vitamin E & Glutathione tinh khiết quét sạch gốc tự do, bật tone trắng sáng.',
    singlePrice: 3190000,
    singlePriceDisplay: '3.190.000đ',
    coursePrice: 10000000,
    coursePriceDisplay: '10.000.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 5.950.000đ',
    highlight: true
  },
  {
    id: 'ms-melasma-fx',
    category: 'meso',
    categoryName: 'Mesotherapy (MS)',
    badgeClass: 'badge-meso',
    name: 'Meso Melasma FX (Đặc Trị Nám & Tàn Nhang)',
    notes: 'Phác đồ ức chế sản sinh hắc sắc tố Melanin, đặc trị nám mảng, tàn nhang, đốm nâu cứng đầu.',
    singlePrice: 3290000,
    singlePriceDisplay: '3.290.000đ',
    coursePrice: 11000000,
    coursePriceDisplay: '11.000.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 5.450.000đ'
  },
  {
    id: 'ms-melasma-fx-ha',
    category: 'meso',
    categoryName: 'Mesotherapy (MS)',
    badgeClass: 'badge-meso',
    name: 'Meso Melasma FX + HA (Đặc Trị Nám Đa Tầng & Căng Bóng)',
    notes: 'Gói Meso VIP đỉnh cao vừa xóa mờ sạm nám vừa phục hồi biểu bì ngậm nước, da sáng trong như sương mai.',
    singlePrice: 4550000,
    singlePriceDisplay: '4.550.000đ',
    coursePrice: 12500000,
    coursePriceDisplay: '12.500.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 10.250.000đ',
    highlight: true
  },

  // 6. EYE - CHĂM SÓC VÙNG MẮT
  {
    id: 'eye-active',
    category: 'eye',
    categoryName: 'Chăm Sóc Mắt (Eye Care)',
    badgeClass: 'badge-eye',
    name: 'Active Eyes - Trị Quầng Thâm & Mệt Mỏi',
    notes: 'Giảm thâm quầng mắt gấu trúc, kích thích vi tuần hoàn và xóa tan bọng mắt ứ đọng nước.',
    singlePrice: 1800000,
    singlePriceDisplay: '1.800.000đ',
    coursePrice: 7700000,
    coursePriceDisplay: '7.700.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 1.300.000đ'
  },
  {
    id: 'eye-young',
    category: 'eye',
    categoryName: 'Chăm Sóc Mắt (Eye Care)',
    badgeClass: 'badge-eye',
    name: 'Young Eyes - Trẻ Hóa & Xóa Nhăn Đuôi Mắt',
    notes: 'Tinh chất peptide trẻ hóa và nâng cơ mí mắt chùng nhão, là phẳng vết chân chim đuôi mắt.',
    singlePrice: 2000000,
    singlePriceDisplay: '2.000.000đ',
    coursePrice: 8000000,
    coursePriceDisplay: '8.000.000đ',
    courseSessions: 5,
    savingsText: 'Tiết kiệm 2.000.000đ',
    highlight: true
  },

  // 7. SHADING - PHUN XĂM THẨM MỸ
  {
    id: 'shading-may',
    category: 'shading',
    categoryName: 'Phun Xăm & Shading',
    badgeClass: 'badge-shading',
    name: 'Phun Mày Hiệu Ứng Bút Chì Shading',
    notes: 'Tạo hạt siêu mịn tự nhiên như phủ phấn bột, đuôi sắc nét đầu mềm mại, không sưng không đau.',
    singlePrice: 2000000,
    singlePriceDisplay: '2.000.000đ',
    coursePrice: 2000000,
    coursePriceDisplay: 'Trọn Gói Kèm Dặm',
    highlight: true
  },
  {
    id: 'shading-moi-baby',
    category: 'shading',
    categoryName: 'Phun Xăm & Shading',
    badgeClass: 'badge-shading',
    name: 'Phun Môi Baby (Baby Lips)',
    notes: 'Mực hữu cơ chuẩn Châu Âu, tone màu trong trẻo tươi tắn (hồng cam, đỏ cherry), môi căng mọng như cánh hoa.',
    singlePrice: 2500000,
    singlePriceDisplay: '2.500.000đ',
    coursePrice: 2500000,
    coursePriceDisplay: 'Trọn Gói Kèm Dặm',
    highlight: true
  },
  {
    id: 'shading-khu-tham',
    category: 'shading',
    categoryName: 'Phun Xăm & Shading',
    badgeClass: 'badge-shading',
    name: 'Khử Thâm Môi Chuyên Sâu',
    notes: 'Bắn tia laser hoặc đi kim vi chạm khử sạch viền thâm bẩm sinh, môi loang màu do son chứa chì.',
    singlePrice: 1000000,
    singlePriceDisplay: '1.000.000đ - 2.500.000đ',
    coursePrice: 1000000,
    coursePriceDisplay: 'Tùy mức độ thâm',
    notesDetail: 'Khử thâm cấp độ 1-3'
  }
];

// App State
let currentCategory = 'all';
let currentSearch = '';
let currentViewMode = 'grid'; // 'grid' | 'table'
let cart = JSON.parse(localStorage.getItem('forher_cart')) || [];
let currentQuizStep = 1;
let quizAnswers = { concern: null, skinType: null };

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  renderServices();
  initCategoryTabs();
  initSearch();
  initViewModeToggle();
  initQuickBookingBar();
  initSkinQuiz();
  initCartDrawer();
  initFaqAccordion();
  initScrollTop();
  updateCartBadge();
  populateQuickSelect();
});

// Navbar sticky & mobile drawer
function initNavbar() {
  const header = document.querySelector('.header-main');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-active');
      });
    });
  }
}

// Populate Quick Booking service dropdown
function populateQuickSelect() {
  const select = document.getElementById('quick-service-select');
  if (!select) return;

  SERVICES_DATA.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.name} (${s.singlePriceDisplay})`;
    select.appendChild(opt);
  });
}

// Category tabs click handler
function initCategoryTabs() {
  const tabs = document.querySelectorAll('.cat-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.dataset.cat;
      renderServices();
    });
  });
}

// Search Handler
function initSearch() {
  const searchInput = document.getElementById('service-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.toLowerCase().trim();
    renderServices();
  });
}

// View Mode Toggle (Grid vs Table)
function initViewModeToggle() {
  const btnGrid = document.getElementById('view-grid-btn');
  const btnTable = document.getElementById('view-table-btn');
  const gridContainer = document.getElementById('services-grid-container');
  const tableContainer = document.getElementById('services-table-wrapper');

  if (btnGrid && btnTable) {
    btnGrid.addEventListener('click', () => {
      btnGrid.classList.add('active');
      btnTable.classList.remove('active');
      currentViewMode = 'grid';
      gridContainer.style.display = 'grid';
      tableContainer.style.display = 'none';
    });

    btnTable.addEventListener('click', () => {
      btnTable.classList.add('active');
      btnGrid.classList.remove('active');
      currentViewMode = 'table';
      gridContainer.style.display = 'none';
      tableContainer.style.display = 'block';
    });
  }
}

// Render Services (Both Grid & Table)
function renderServices() {
  const gridContainer = document.getElementById('services-grid-container');
  const tableBody = document.getElementById('services-table-body');
  const emptyNotice = document.getElementById('services-empty-notice');

  let filtered = SERVICES_DATA.filter(service => {
    const matchCat = (currentCategory === 'all') || (service.category === currentCategory);
    const matchSearch = (!currentSearch) || 
      (service.name.toLowerCase().includes(currentSearch)) ||
      (service.notes.toLowerCase().includes(currentSearch)) ||
      (service.categoryName.toLowerCase().includes(currentSearch));
    return matchCat && matchSearch;
  });

  if (emptyNotice) {
    emptyNotice.style.display = filtered.length === 0 ? 'block' : 'none';
  }

  // Render Grid
  if (gridContainer) {
    gridContainer.innerHTML = '';
    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'service-card';

      // Build savings or warranty tag
      let savingsHtml = '';
      if (item.savingsText) {
        savingsHtml = `<span class="savings-tag">🎉 ${item.savingsText}</span>`;
      } else if (item.isWarranty2Y) {
        savingsHtml = `<span class="savings-tag" style="background:#E8F5E9;color:#2E7D32;">🛡️ Bảo Hành 2 Năm</span>`;
      }

      const hasCourse = item.coursePrice && item.category !== 'shading' && !item.isWarranty2Y;

      card.innerHTML = `
        <div class="service-card-header">
          <span class="service-badge ${item.badgeClass}">${item.categoryName}</span>
          ${item.highlight ? '<span style="font-size:0.75rem;font-weight:700;color:#C59B27">★ HOT</span>' : ''}
        </div>
        <h3 class="service-name">${item.name}</h3>
        <p class="service-notes">${item.notes}</p>
        
        <div class="service-pricing-box">
          <div class="price-row">
            <span class="price-label">Giá buổi lẻ:</span>
            <span class="price-val-single">${item.singlePriceDisplay}</span>
          </div>
          <div class="price-row">
            <span class="price-label">${item.isWarranty2Y ? 'Liệu trình trọn gói:' : 'Liệu trình 5 buổi:'}</span>
            <span class="price-val-course">${item.coursePriceDisplay} ${savingsHtml}</span>
          </div>
        </div>

        <div class="service-card-actions">
          <button class="btn-card-add" onclick="addItemToCart('${item.id}', 'single')">
            + Chọn Buổi Lẻ
          </button>
          <button class="btn-card-course" onclick="addItemToCart('${item.id}', '${item.isWarranty2Y ? 'single' : 'course'}')">
            ${item.isWarranty2Y ? 'Đăng Ký Gói BH 2N' : '+ Chọn Liệu Trình 5B'}
          </button>
        </div>
      `;
      gridContainer.appendChild(card);
    });
  }

  // Render Table
  if (tableBody) {
    tableBody.innerHTML = '';
    filtered.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <span class="table-service-name">${item.name}</span>
          <span class="table-category-tag">${item.categoryName}</span>
        </td>
        <td><strong>${item.singlePriceDisplay}</strong></td>
        <td>
          <span style="color:var(--rose-accent);font-weight:700">${item.coursePriceDisplay}</span>
          ${item.savingsText ? `<div style="font-size:0.75rem;color:#C62828">${item.savingsText}</div>` : ''}
        </td>
        <td>
          <button class="btn-primary" style="padding:6px 14px;font-size:0.8rem;" onclick="addItemToCart('${item.id}', 'single')">
            + Đặt Buổi Lẻ
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
}

// Cart System (Appointment Basket)
function addItemToCart(serviceId, type) {
  const service = SERVICES_DATA.find(s => s.id === serviceId);
  if (!service) return;

  const existingIndex = cart.findIndex(c => c.id === serviceId);
  if (existingIndex > -1) {
    cart[existingIndex].type = type; // update package mode
    showToast(`Đã cập nhật dịch vụ: ${service.name} (${type === 'course' ? 'Gói 5 buổi' : 'Buổi lẻ'})`, '✨');
  } else {
    cart.push({
      id: service.id,
      name: service.name,
      categoryName: service.categoryName,
      type: type, // 'single' or 'course'
      singlePrice: service.singlePrice,
      coursePrice: service.coursePrice,
      singlePriceDisplay: service.singlePriceDisplay,
      coursePriceDisplay: service.coursePriceDisplay,
      isWarranty2Y: service.isWarranty2Y
    });
    showToast(`Đã thêm vào giỏ hẹn: ${service.name}`, '💖');
  }

  saveCart();
  updateCartBadge();
  renderCartDrawer();
  openDrawer();
}

function removeCartItem(index) {
  const removed = cart.splice(index, 1);
  saveCart();
  updateCartBadge();
  renderCartDrawer();
  if (removed[0]) {
    showToast(`Đã xóa ${removed[0].name}`, '🗑️');
  }
}

function updateCartItemMode(index, newMode) {
  if (cart[index]) {
    cart[index].type = newMode;
    saveCart();
    renderCartDrawer();
  }
}

function saveCart() {
  localStorage.setItem('forher_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const badgeNav = document.getElementById('nav-basket-count');
  const badgeDock = document.getElementById('dock-basket-count');
  const count = cart.length;

  if (badgeNav) badgeNav.textContent = count;
  if (badgeDock) badgeDock.textContent = count;
}

// Drawer logic
function initCartDrawer() {
  const openButtons = document.querySelectorAll('.open-cart-btn');
  const closeBtn = document.getElementById('drawer-close-btn');
  const backdrop = document.getElementById('drawer-backdrop');
  const form = document.getElementById('drawer-booking-form');

  openButtons.forEach(btn => btn.addEventListener('click', openDrawer));
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  if (form) {
    form.addEventListener('submit', handleBookingSubmit);
  }

  // Quick booking submit
  const quickForm = document.getElementById('quick-booking-form');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const select = document.getElementById('quick-service-select');
      const date = document.getElementById('quick-date').value;
      const time = document.getElementById('quick-time').value;

      if (select && select.value) {
        addItemToCart(select.value, 'single');
      }

      // Pre-fill drawer form
      const drawerDate = document.getElementById('book-date');
      const drawerTime = document.getElementById('book-time');
      if (drawerDate && date) drawerDate.value = date;
      if (drawerTime && time) drawerTime.value = time;

      openDrawer();
    });
  }
}

function openDrawer() {
  const drawer = document.getElementById('booking-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  renderCartDrawer();
  if (drawer && backdrop) {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeDrawer() {
  const drawer = document.getElementById('booking-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Render items inside the drawer
function renderCartDrawer() {
  const list = document.getElementById('drawer-cart-list');
  const emptyState = document.getElementById('drawer-empty-state');
  const billTotalEl = document.getElementById('drawer-total-price');
  const billSubtotalEl = document.getElementById('drawer-subtotal-price');

  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    if (billTotalEl) billTotalEl.textContent = '0đ';
    if (billSubtotalEl) billSubtotalEl.textContent = '0đ';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  list.innerHTML = '';

  let subtotal = 0;

  cart.forEach((item, index) => {
    const isCourse = item.type === 'course';
    const priceNum = isCourse ? item.coursePrice : item.singlePrice;
    subtotal += priceNum;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-header">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <span style="font-size:0.75rem;color:var(--text-muted);">${item.categoryName}</span>
        </div>
        <button class="cart-item-remove" onclick="removeCartItem(${index})" title="Xóa dịch vụ">✕</button>
      </div>

      ${!item.isWarranty2Y && item.singlePrice !== item.coursePrice ? `
        <div class="cart-item-mode-selector">
          <button type="button" class="cart-mode-btn ${!isCourse ? 'active' : ''}" onclick="updateCartItemMode(${index}, 'single')">
            Buổi lẻ (${item.singlePriceDisplay})
          </button>
          <button type="button" class="cart-mode-btn ${isCourse ? 'active' : ''}" onclick="updateCartItemMode(${index}, 'course')">
            Gói 5B (${item.coursePriceDisplay})
          </button>
        </div>
      ` : `
        <div style="font-size:0.8rem;color:#2E7D32;font-weight:600;">
          ${item.isWarranty2Y ? '🛡️ Bảo hành 2 năm chính hãng' : 'Trọn gói liệu trình'}
        </div>
      `}

      <div class="cart-item-price">
        ${formatCurrency(priceNum)}
      </div>
    `;
    list.appendChild(div);
  });

  if (billSubtotalEl) billSubtotalEl.textContent = formatCurrency(subtotal);
  if (billTotalEl) billTotalEl.textContent = formatCurrency(subtotal);
}

// Booking form submission
function handleBookingSubmit(e) {
  e.preventDefault();

  if (cart.length === 0) {
    showToast('Vui lòng chọn ít nhất 1 dịch vụ để đặt lịch!', '⚠️');
    return;
  }

  const name = document.getElementById('book-name').value.trim();
  const phone = document.getElementById('book-phone').value.trim();
  const date = document.getElementById('book-date').value;
  const time = document.getElementById('book-time').value;
  const note = document.getElementById('book-note').value.trim();

  if (!name || !phone || !date || !time) {
    showToast('Vui lòng điền đầy đủ họ tên, SĐT, ngày và giờ hẹn!', '⚠️');
    return;
  }

  const bookingCode = 'FH' + Math.floor(1000 + Math.random() * 9000);
  
  // Format items text for Zalo
  let itemsText = cart.map(c => `- ${c.name} (${c.type === 'course' ? 'Liệu trình 5 buổi' : 'Buổi lẻ'})`).join('\n');
  let totalPriceText = document.getElementById('drawer-total-price')?.textContent || '';

  const zaloMessage = `Chào FORHER Beauty, mình muốn đặt lịch làm đẹp mã [${bookingCode}]:\n- Khách hàng: ${name} (${phone})\n- Thời gian: ${time} ngày ${date}\n- Dịch vụ:\n${itemsText}\n- Ước tính chi phí: ${totalPriceText}\n- Ghi chú: ${note || 'Không có'}`;

  // Show Sweet Booking Modal
  showBookingSuccessModal(bookingCode, name, phone, date, time, zaloMessage);
}

function showBookingSuccessModal(code, name, phone, date, time, zaloMessage) {
  closeDrawer();

  const modalBackdrop = document.createElement('div');
  modalBackdrop.className = 'drawer-backdrop open';
  modalBackdrop.style.zIndex = '9999';

  const modalBox = document.createElement('div');
  modalBox.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #FFF;
    border-radius: var(--radius-lg);
    padding: 36px 32px;
    max-width: 520px;
    width: 90%;
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    text-align: center;
    border: 2px solid var(--border-gold);
  `;

  modalBox.innerHTML = `
    <div style="font-size:3.5rem;margin-bottom:12px;">🎉</div>
    <span class="announcement-badge" style="font-size:0.8rem;padding:4px 12px;margin-bottom:12px;display:inline-block">ĐẶT LỊCH THÀNH CÔNG</span>
    <h3 style="font-family:var(--font-serif);font-size:1.6rem;margin-bottom:8px;color:var(--text-main)">Mã Hẹn: <span style="color:var(--rose-accent)">#${code}</span></h3>
    <p style="font-size:0.95rem;color:var(--text-muted);margin-bottom:20px;line-height:1.6">
      Cảm ơn quý khách <strong>${name}</strong> (${phone})!<br>
      Lịch hẹn của bạn vào <strong>${time} ngày ${date}</strong> đã được hệ thống FORHER Beauty tiếp nhận.
    </p>

    <div style="background:var(--bg-body);border-radius:var(--radius-sm);padding:14px;text-align:left;font-size:0.88rem;color:var(--text-main);margin-bottom:24px;">
      📍 <strong>Địa chỉ:</strong> 515 Bà Hạt, P. Diên Hồng, Quận 10, TP.HCM<br>
      📞 <strong>Hotline:</strong> 0703 994 683 (Có Zalo)
    </div>

    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <a href="https://zalo.me/0703994683?text=${encodeURIComponent(zaloMessage)}" target="_blank" class="btn-primary" style="background:#0068FF">
        💬 Xác Nhận Qua Zalo Ngay
      </a>
      <button id="modal-close-btn" class="btn-outline">
        Đóng
      </button>
    </div>
  `;

  document.body.appendChild(modalBackdrop);
  document.body.appendChild(modalBox);

  const cleanModal = () => {
    modalBackdrop.remove();
    modalBox.remove();
    cart = [];
    saveCart();
    updateCartBadge();
  };

  modalBackdrop.addEventListener('click', cleanModal);
  modalBox.querySelector('#modal-close-btn').addEventListener('click', cleanModal);
}

// Quick Booking Bar Form
function initQuickBookingBar() {
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('quick-date');
  const drawerDateInput = document.getElementById('book-date');
  if (dateInput) dateInput.value = today;
  if (drawerDateInput) drawerDateInput.value = today;
}

// Skin Diagnosis Quiz
function initSkinQuiz() {
  const optionsConcern = document.querySelectorAll('[data-quiz-concern]');
  const optionsSkinType = document.querySelectorAll('[data-quiz-skin]');
  const step1 = document.getElementById('quiz-step-1');
  const step2 = document.getElementById('quiz-step-2');
  const resultBox = document.getElementById('quiz-result-box');
  const stepNodes = document.querySelectorAll('.step-node');

  optionsConcern.forEach(btn => {
    btn.addEventListener('click', () => {
      optionsConcern.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      quizAnswers.concern = btn.dataset.quizConcern;

      // Go to step 2
      setTimeout(() => {
        step1.style.display = 'none';
        step2.style.display = 'block';
        stepNodes[0].classList.replace('active', 'completed');
        stepNodes[1].classList.add('active');
      }, 250);
    });
  });

  optionsSkinType.forEach(btn => {
    btn.addEventListener('click', () => {
      optionsSkinType.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      quizAnswers.skinType = btn.dataset.quizSkin;

      // Calculate & Show result
      setTimeout(() => {
        stepNodes[1].classList.replace('active', 'completed');
        stepNodes[2].classList.add('active');
        showQuizRecommendation();
      }, 250);
    });
  });

  const btnReset = document.getElementById('quiz-reset-btn');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      step1.style.display = 'block';
      step2.style.display = 'none';
      resultBox.style.display = 'none';
      stepNodes[0].className = 'step-node active';
      stepNodes[1].className = 'step-node';
      stepNodes[2].className = 'step-node';
      optionsConcern.forEach(b => b.classList.remove('selected'));
      optionsSkinType.forEach(b => b.classList.remove('selected'));
      quizAnswers = { concern: null, skinType: null };
    });
  }
}

function showQuizRecommendation() {
  const resultBox = document.getElementById('quiz-result-box');
  const titleEl = document.getElementById('quiz-rec-title');
  const reasonEl = document.getElementById('quiz-rec-reason');
  const priceEl = document.getElementById('quiz-rec-price');
  const addBtn = document.getElementById('quiz-add-rec-btn');

  let recServiceId = 'nm-tieu-khuan';
  let reason = 'Phác đồ tiêu diệt vi khuẩn P.Acnes chuẩn y khoa, giúp gom cồi mụn, giảm đỏ tức thì.';

  const { concern, skinType } = quizAnswers;

  if (concern === 'hair') {
    recServiceId = 'tl-nach';
    reason = 'Công nghệ Diode Laser thế hệ mới bảo hành 2 năm giúp nang lông tiêu biến tự nhiên, không rát, da sáng mịn.';
  } else if (concern === 'pigment') {
    recServiceId = 'ms-melasma-fx';
    reason = 'Cấy Meso tinh chất Melasma FX đặc trị ức chế enzyme Tyrosinase, đào thải sắc tố nám và thâm sạm lâu năm.';
  } else if (concern === 'dry') {
    recServiceId = 'sk-diendi-ha';
    reason = 'Điện di tinh chất Hyaluronic Acid đa phân tử cấp ẩm tức thì, giúp hàng rào biểu bì ngậm nước và mịn màng căng bóng.';
  } else if (concern === 'lips') {
    recServiceId = 'shading-moi-baby';
    reason = 'Khử sạch thâm môi và phủ sắc hồng đào baby trong trẻo tự nhiên bằng mực hữu cơ không sưng đau.';
  } else if (concern === 'scar') {
    recServiceId = 'peel-tca-cham';
    reason = 'Phương pháp chấm TCA y khoa hỗ trợ tái tạo đáy sẹo rỗ sâu, se khít lỗ chân lông và làm phẳng bề mặt da.';
  }

  const service = SERVICES_DATA.find(s => s.id === recServiceId);
  if (service) {
    titleEl.textContent = service.name;
    reasonEl.textContent = reason;
    priceEl.textContent = `Giá: ${service.singlePriceDisplay} | Liệu trình: ${service.coursePriceDisplay}`;
    addBtn.onclick = () => {
      addItemToCart(service.id, service.isWarranty2Y ? 'single' : 'course');
    };
  }

  resultBox.style.display = 'block';
  resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// FAQ Accordion
function initFaqAccordion() {
  const cards = document.querySelectorAll('.faq-card');
  cards.forEach(card => {
    const btn = card.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');
      cards.forEach(c => c.classList.remove('open'));
      if (!isOpen) {
        card.classList.add('open');
      }
    });
  });
}

// Scroll Top Button
function initScrollTop() {
  const btn = document.getElementById('dock-scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.style.display = 'flex';
    } else {
      btn.style.display = 'none';
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Toast notification helper
function showToast(message, icon = '✨') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const item = document.createElement('div');
  item.className = 'toast-item';
  item.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(item);

  setTimeout(() => {
    item.style.opacity = '0';
    item.style.transition = 'opacity 0.3s ease';
    setTimeout(() => item.remove(), 300);
  }, 3200);
}

// Currency Formatter
function formatCurrency(amount) {
  if (typeof amount !== 'number') return amount;
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}
