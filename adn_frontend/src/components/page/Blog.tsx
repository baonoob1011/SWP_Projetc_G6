import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Menu,
  Linkedin,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { Facebook, Instagram, Twitter } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import Blog1 from '../../image/Blog1.png';
import Blog2 from '../../image/Blog2.png';
import Blog3 from '../../image/Blog3.png';
import Blog4 from '../../image/Blog4.png';
import Blog6 from '../../image/Blog6.png';
const DNATestingBlog = () => {
  const articles = [
    {
      id: 1,
      title:
        'Xét Nghiệm ADN Huyết Thống: Quy Trình và Ý Nghĩa Pháp Lý Tại Việt Nam',
      date: '21/05/2025',
      image: Blog1,
      category: 'Huyết Thống',
      excerpt:
        'Tìm hiểu quy trình xét nghiệm ADN xác định quan hệ huyết thống, thủ tục pháp lý và chi phí thực hiện tại các bệnh viện uy tín...',
      readTime: '5 phút đọc',
    },
    {
      id: 2,
      title:
        'Thủ Tục Xét Nghiệm ADN Phục Vụ Thủ Tục Dân Sự: Khai Sinh, Nhận Con Nuôi',
      date: '14/05/2025',
      image: Blog2,
      category: 'Dân Sự',
      excerpt:
        'Hướng dẫn chi tiết các thủ tục xét nghiệm ADN phục vụ khai sinh, nhận con nuôi, tranh chấp quyền nuôi con theo quy định pháp luật...',
      readTime: '7 phút đọc',
    },
    {
      id: 3,
      title: 'Những Điều Cần Biết Khi Nhận Kết Quả Xét Nghiệm ADN Hành Chính',
      date: '01/05/2025',
      image:
        'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=500&h=300&fit=crop',
      category: 'Hành Chính',
      excerpt:
        'Cẩm nang đọc hiểu kết quả xét nghiệm ADN cho các thủ tục hành chính, giá trị pháp lý và cách sử dụng trong hồ sơ...',
      readTime: '6 phút đọc',
    },
    {
      id: 4,
      title: 'Tranh Chấp Thừa Kế: Vai Trò Của Xét Nghiệm ADN Trong Tòa Án',
      date: '28/04/2025',
      image: Blog3,
      category: 'Pháp Lý',
      excerpt:
        'Phân tích các vụ việc tranh chấp thừa kế được giải quyết nhờ xét nghiệm ADN, quy trình tại tòa án và chi phí thực hiện...',
      readTime: '8 phút đọc',
    },
    {
      id: 5,
      title: 'Danh Sách Cơ Sở Xét Nghiệm ADN Được Bộ Y Tế Công Nhận 2025',
      date: '20/04/2025',
      image: Blog4,
      category: 'Cơ Sở Y Tế',
      excerpt:
        'Cập nhật danh sách các bệnh viện, phòng khám được phép thực hiện xét nghiệm ADN có giá trị pháp lý tại Việt Nam...',
      readTime: '10 phút đọc',
    },
    {
      id: 6,
      title:
        'Xét Nghiệm ADN Cha Con: Quy Trình, Chi Phí và Thời Gian Có Kết Quả',
      date: '15/04/2025',
      image: Blog6,
      category: 'Huyết Thống',
      excerpt:
        'Hướng dẫn toàn diện về xét nghiệm ADN xác định quan hệ cha con, từ chuẩn bị mẫu đến nhận kết quả có giá trị pháp lý...',
      readTime: '12 phút đọc',
    },
  ];

  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-blue-600">DNA Legal</h1>
              <nav className="hidden md:flex space-x-8">
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Trang Chủ
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Tin Tức
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Hướng Dẫn
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Liên Hệ
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Search className="h-5 w-5 text-gray-500 cursor-pointer hover:text-blue-600" />
              <Menu className="h-5 w-5 text-gray-500 cursor-pointer hover:text-blue-600 md:hidden" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Tin Tức</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Cập nhật thông tin về xét nghiệm ADN huyết thống, thủ tục dân sự,
              hành chính và các quy định pháp lý mới nhất
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Article */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Bài Viết Nổi Bật
          </h3>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {featuredArticle.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {featuredArticle.date}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {featuredArticle.readTime}
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  {featuredArticle.title}
                </h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                <button className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Đọc Tiếp
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Tin Tức Mới Nhất
            </h3>
            <div className="flex items-center space-x-4">
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                🔴 Đang cập nhật
              </span>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Xem tất cả →
              </button>
            </div>
          </div>

          {/* Breaking News Banner */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-xl mb-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <span className="bg-white text-red-500 px-3 py-1 rounded-full text-sm font-bold">
                NÓNG
              </span>
              <span className="text-sm opacity-90">08/06/2025 - 14:30</span>
            </div>
            <h4 className="text-xl font-bold mb-2">
              Bộ Y Tế Công Bố Danh Sách 15 Cơ Sở Xét Nghiệm ADN Mới Được Cấp
              Phép
            </h4>
            <p className="text-red-100 mb-4">
              Từ tháng 7/2025, 15 bệnh viện và phòng khám tư nhân được bổ sung
              vào danh sách thực hiện xét nghiệm ADN có giá trị pháp lý...
            </p>
            <button className="bg-white text-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors">
              Đọc chi tiết
            </button>
          </div>

          {/* Quick News Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="relative bg-white p-6 rounded-xl border-l-4 border-blue-500 shadow-sm">
              <button className="absolute top-4 right-4 text-blue-400 hover:text-gray-600 text-sm">
                Xem thêm →
              </button>
              <div className="flex items-center space-x-2 mb-3">
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                  MỆnh lệnh tòa án
                </span>
                <span className="text-gray-500 text-sm">2 giờ trước</span>
              </div>
              <h5 className="font-bold text-gray-900 mb-2">
                TAND TP.HCM Yêu Cầu Xét Nghiệm ADN Trong Vụ Tranh Chấp Thừa Kế
                500 Tỷ
              </h5>
              <p className="text-gray-600 text-sm">
                Tòa án quyết định yêu cầu 7 người con trong gia đình thực hiện
                xét nghiệm ADN để xác định...
              </p>
            </div>

            <div className="relative bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-sm">
              <button className="absolute top-4 right-4 text-blue-400 hover:text-gray-600 text-sm">
                Xem thêm →
              </button>
              <div className="flex items-center space-x-2 mb-3">
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-medium">
                  CHÍNH SÁCH MỚI
                </span>
                <span className="text-gray-500 text-sm">5 giờ trước</span>
              </div>
              <h5 className="font-bold text-gray-900 mb-2">
                Giảm 30% Chi Phí Xét Nghiệm ADN Cho Hộ Nghèo, Cận Nghèo
              </h5>
              <p className="text-gray-600 text-sm">
                Bảo hiểm xã hội Việt Nam thông báo chính sách hỗ trợ chi phí xét
                nghiệm ADN...
              </p>
            </div>

            <div className="relative bg-white p-6 rounded-xl border-l-4 border-yellow-500 shadow-sm">
              <button className="absolute top-4 right-4 text-blue-400 hover:text-gray-600 text-sm">
                Xem thêm →
              </button>
              <div className="flex items-center space-x-2 mb-3">
                <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs font-medium">
                  CẢNH BÁO
                </span>
                <span className="text-gray-500 text-sm">1 ngày trước</span>
              </div>
              <h5 className="font-bold text-gray-900 mb-2">
                Phát Hiện Cơ Sở Làm Giả Kết Quả Xét Nghiệm ADN Tại Hà Nội
              </h5>
              <p className="text-gray-600 text-sm">
                Cơ quan chức năng đã đóng cửa một phòng khám tư nhân vì làm giả
                kết quả xét nghiệm...
              </p>
            </div>

            <div className="relative bg-white p-6 rounded-xl border-l-4 border-purple-500 shadow-sm">
              <button className="absolute top-4 right-4 text-blue-400 hover:text-blue-600 text-sm">
                Xem thêm →
              </button>
              <div className="flex items-center space-x-2 mb-3">
                <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs font-medium">
                  CÔNG NGHỆ
                </span>
                <span className="text-gray-500 text-sm">2 ngày trước</span>
              </div>
              <h5 className="font-bold text-gray-900 mb-2">
                Ra Mắt Hệ Thống Xét Nghiệm ADN Tự Động Đầu Tiên Tại Việt Nam
              </h5>
              <p className="text-gray-600 text-sm">
                Bệnh viện Chợ Rẫy đưa vào hoạt động hệ thống xét nghiệm ADN tự
                động, rút ngắn thời gian...
              </p>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Bài Viết Chuyên Sâu
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {article.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {article.readTime}
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                  <button className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors text-sm">
                    Đọc Thêm
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Xem Thêm Bài Viết
          </button>
        </div>
      </main>

      {/* FOOTER - PHẦN MỚI THÊM */}
      <footer
        className="bg-gradient-to-br text-white"
        style={{ backgroundColor: '#529ADE' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Thông tin công ty */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4 text-white">GeneLink</h3>
              <p className="mb-4 leading-relaxed text-white">
                Công ty Cổ phần Dịch vụ Phân tích Di truyền - thành viên Tập
                đoàn Eurofins. Tiên phong trong lĩnh vực xét nghiệm ADN với công
                nghệ hiện đại và đội ngũ chuyên gia giàu kinh nghiệm.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="hover:opacity-75 transition-opacity text-white"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="hover:opacity-75 transition-opacity text-white"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="hover:opacity-75 transition-opacity text-white"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="hover:opacity-75 transition-opacity text-white"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Liên kết nhanh */}
            <div className="text-left">
              <h4
                className="text-lg font-semibold mb-4 text-white"
                style={{ marginLeft: 31 }}
              >
                Dịch vụ
              </h4>
              <ul className="space-y-2">
                <li>
                  <NavLink
                    to="/services/administrative"
                    className="hover:opacity-75 transition-opacity no-underline text-white block"
                  >
                    Xét nghiệm hành chính
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/services/civil"
                    className="hover:opacity-75 transition-opacity no-underline text-white block"
                  >
                    Xét nghiệm dân sự
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/services/at-home"
                    className="hover:opacity-75 transition-opacity no-underline text-white block"
                  >
                    Xét nghiệm tại nhà
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/services/at-center"
                    className="hover:opacity-75 transition-opacity no-underline text-white block"
                  >
                    Xét nghiệm tại cơ sở
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Thông tin liên hệ */}
            <div className="text-left">
              <h4 className="text-lg font-semibold mb-4 text-white">Liên hệ</h4>
              <div className="space-y-3">
                <div className="flex items-start justify-start">
                  <MapPin className="w-5 h-5 mt-1 mr-3 flex-shrink-0 text-white" />
                  <p className="text-white">
                    123 Đường ABC, Quận XYZ
                    <br />
                    TP. Hồ Chí Minh, Việt Nam
                  </p>
                </div>
                <div className="flex items-center justify-start">
                  <Phone className="w-5 h-5 mr-3 text-white" />
                  <a
                    href="tel:+84123456789"
                    className="hover:opacity-75 transition-opacity no-underline text-white"
                  >
                    +84 123 456 789
                  </a>
                </div>
                <div className="flex items-center justify-start">
                  <Mail className="w-5 h-5 mr-3 text-white" />
                  <a
                    href="mailto:info@genelink.vn"
                    className="hover:opacity-75 transition-opacity no-underline text-white"
                  >
                    info@genelink.vn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Đường phân cách */}
          <div className="border-t border-white/30 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-white">
                © 2025 GeneLink. Tất cả quyền được bảo lưu.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="hover:opacity-75 text-sm transition-opacity no-underline text-white"
                >
                  Chính sách bảo mật
                </a>
                <a
                  href="#"
                  className="hover:opacity-75 text-sm transition-opacity no-underline text-white"
                >
                  Điều khoản sử dụng
                </a>
                <a
                  href="#"
                  className="hover:opacity-75 text-sm transition-opacity no-underline text-white"
                >
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DNATestingBlog;
