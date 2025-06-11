import React from 'react';
import {
  Calendar,
  Clock,
  ArrowRight,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  Instagram,
} from 'lucide-react';
import Blog1 from '../../image/Blog1.png';
import Blog2 from '../../image/Blog2.png';
import Blog3 from '../../image/Blog3.png';
import Blog4 from '../../image/Blog4.png';
import Blog5 from '../../image/Blog5.png';
import Blog6 from '../../image/Blog6.png';
import { NavLink } from 'react-router-dom';
import { Facebook, Twitter } from '@mui/icons-material';
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
      image: Blog5,
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
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)',
      }}
    >
      {/* Hero Section */}
      <section
        className="text-white pt-20 pb-16 relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #87ceeb 0%, #6eb5e0 50%, #5aa1d3 100%)',
          boxShadow: '0 10px 30px rgba(135, 206, 235, 0.3)',
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20"></div>
          <div className="absolute top-40 right-20 w-20 h-20 rounded-full bg-white/15"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 rounded-full bg-white/10"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h2 className="text-5xl font-bold uppercase mb-6 mt-5 tracking-wide">
              TIN TỨC
            </h2>
            <div className="w-24 h-1 bg-white mx-auto mb-6 rounded-full"></div>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed opacity-95">
              Cập nhật thông tin về xét nghiệm ADN huyết thống, thủ tục dân sự,
              hành chính và các quy định pháp lý mới nhất
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Article */}
        <section className="mb-20">
          <div className="flex items-center mb-10">
            <h3 className="text-3xl font-bold text-gray-800">
              Bài Viết Nổi Bật
            </h3>
            <div className="ml-4 flex-1 h-px bg-gradient-to-r from-sky-300 to-transparent"></div>
          </div>

          <div
            className="bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
            style={{
              boxShadow: '0 20px 60px rgba(135, 206, 235, 0.15)',
              border: '1px solid rgba(135, 206, 235, 0.2)',
            }}
          >
            <div className="md:flex">
              <div className="md:w-1/2 relative overflow-hidden">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-64 md:h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="md:w-1/2 p-10">
                <div className="flex items-center space-x-4 mb-6">
                  <span
                    className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #87ceeb, #5aa1d3)',
                    }}
                  >
                    {featuredArticle.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {featuredArticle.date}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    {featuredArticle.readTime}
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
                  {featuredArticle.title}
                </h4>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  {featuredArticle.excerpt}
                </p>
                <button
                  className="inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 text-white"
                  style={{
                    background: 'linear-gradient(135deg, #87ceeb, #5aa1d3)',
                  }}
                >
                  Đọc Tiếp
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center">
              <h3 className="text-3xl font-bold text-gray-800">
                Tin Tức Mới Nhất
              </h3>
              <div className="ml-4 flex-1 h-px bg-gradient-to-r from-sky-300 to-transparent"></div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium animate-pulse border border-red-100">
                🔴 Đang cập nhật
              </span>
              <button className="text-sky-600 hover:text-sky-700 font-semibold text-sm transition-colors">
                Xem tất cả →
              </button>
            </div>
          </div>

          {/* Breaking News Banner */}
          <div
            className="text-white p-8 rounded-2xl mb-10 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
              boxShadow: '0 15px 50px rgba(74, 144, 226, 0.3)',
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-white text-red-500 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  NÓNG
                </span>
                <span className="text-sm opacity-90">08/06/2025 - 14:30</span>
              </div>
              <h4 className="text-2xl font-bold mb-3">
                Bộ Y Tế Công Bố Danh Sách 15 Cơ Sở Xét Nghiệm ADN Mới Được Cấp
                Phép
              </h4>
              <p className="opacity-90 mb-6 text-lg">
                Từ tháng 7/2025, 15 bệnh viện và phòng khám tư nhân được bổ sung
                vào danh sách thực hiện xét nghiệm ADN có giá trị pháp lý...
              </p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 hover:shadow-lg">
                Đọc chi tiết
              </button>
            </div>
          </div>

          {/* Quick News Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div
              className="relative bg-white p-8 rounded-2xl transition-all duration-300 hover:scale-105"
              style={{
                borderLeft: '5px solid #87ceeb',
                boxShadow: '0 10px 30px rgba(135, 206, 235, 0.1)',
                border: '1px solid rgba(135, 206, 235, 0.15)',
              }}
            >
              <button className="absolute top-6 right-6 text-sky-500 hover:text-sky-600 text-sm font-medium transition-colors">
                Xem thêm →
              </button>
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-xs font-semibold border border-blue-100">
                  MỆNH LỆNH TÒA ÁN
                </span>
                <span className="text-gray-500 text-sm">2 giờ trước</span>
              </div>
              <h5 className="font-bold text-gray-900 mb-3 text-lg">
                TAND TP.HCM Yêu Cầu Xét Nghiệm ADN Trong Vụ Tranh Chấp Thừa Kế
                500 Tỷ
              </h5>
              <p className="text-gray-600">
                Tòa án quyết định yêu cầu 7 người con trong gia đình thực hiện
                xét nghiệm ADN để xác định...
              </p>
            </div>

            <div
              className="relative bg-white p-8 rounded-2xl transition-all duration-300 hover:scale-105"
              style={{
                borderLeft: '5px solid #4ade80',
                boxShadow: '0 10px 30px rgba(74, 222, 128, 0.1)',
                border: '1px solid rgba(74, 222, 128, 0.15)',
              }}
            >
              <button className="absolute top-6 right-6 text-sky-500 hover:text-sky-600 text-sm font-medium transition-colors">
                Xem thêm →
              </button>
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-green-50 text-green-600 px-3 py-2 rounded-lg text-xs font-semibold border border-green-100">
                  CHÍNH SÁCH MỚI
                </span>
                <span className="text-gray-500 text-sm">5 giờ trước</span>
              </div>
              <h5 className="font-bold text-gray-900 mb-3 text-lg">
                Giảm 30% Chi Phí Xét Nghiệm ADN Cho Hộ Nghèo, Cận Nghèo
              </h5>
              <p className="text-gray-600">
                Bảo hiểm xã hội Việt Nam thông báo chính sách hỗ trợ chi phí xét
                nghiệm ADN...
              </p>
            </div>

            <div
              className="relative bg-white p-8 rounded-2xl transition-all duration-300 hover:scale-105"
              style={{
                borderLeft: '5px solid #fbbf24',
                boxShadow: '0 10px 30px rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.15)',
              }}
            >
              <button className="absolute top-6 right-6 text-sky-500 hover:text-sky-600 text-sm font-medium transition-colors">
                Xem thêm →
              </button>
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-yellow-50 text-yellow-600 px-3 py-2 rounded-lg text-xs font-semibold border border-yellow-100">
                  CẢNH BÁO
                </span>
                <span className="text-gray-500 text-sm">1 ngày trước</span>
              </div>
              <h5 className="font-bold text-gray-900 mb-3 text-lg">
                Phát Hiện Cơ Sở Làm Giả Kết Quả Xét Nghiệm ADN Tại Hà Nội
              </h5>
              <p className="text-gray-600">
                Cơ quan chức năng đã đóng cửa một phòng khám tư nhân vì làm giả
                kết quả xét nghiệm...
              </p>
            </div>

            <div
              className="relative bg-white p-8 rounded-2xl transition-all duration-300 hover:scale-105"
              style={{
                borderLeft: '5px solid #a855f7',
                boxShadow: '0 10px 30px rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.15)',
              }}
            >
              <button className="absolute top-6 right-6 text-sky-500 hover:text-sky-600 text-sm font-medium transition-colors">
                Xem thêm →
              </button>
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-purple-50 text-purple-600 px-3 py-2 rounded-lg text-xs font-semibold border border-purple-100">
                  CÔNG NGHỆ
                </span>
                <span className="text-gray-500 text-sm">2 ngày trước</span>
              </div>
              <h5 className="font-bold text-gray-900 mb-3 text-lg">
                Ra Mắt Hệ Thống Xét Nghiệm ADN Tự Động Đầu Tiên Tại Việt Nam
              </h5>
              <p className="text-gray-600">
                Bệnh viện Chợ Rẫy đưa vào hoạt động hệ thống xét nghiệm ADN tự
                động, rút ngắn thời gian...
              </p>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section>
          <div className="flex items-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800">
              Bài Viết Chuyên Sâu
            </h3>
            <div className="ml-4 flex-1 h-px bg-gradient-to-r from-sky-300 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {regularArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:rotate-1 group"
                style={{
                  boxShadow: '0 15px 45px rgba(135, 206, 235, 0.1)',
                  border: '1px solid rgba(135, 206, 235, 0.15)',
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <span
                      className="text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #87ceeb, #5aa1d3)',
                      }}
                    >
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {article.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {article.readTime}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4 leading-tight line-clamp-2 group-hover:text-sky-700 transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                  <button
                    className="inline-flex items-center px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg text-white"
                    style={{
                      background: 'linear-gradient(135deg, #87ceeb, #5aa1d3)',
                    }}
                  >
                    Đọc Thêm
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Load More Button */}
        <div className="text-center mt-16">
          <button
            className="px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 text-white"
            style={{
              background: 'linear-gradient(135deg, #87ceeb 0%, #5aa1d3 100%)',
            }}
          >
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
