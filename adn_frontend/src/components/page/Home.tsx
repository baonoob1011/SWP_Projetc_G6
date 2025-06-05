import banner from "../../image/banner.jpg";
import adn from "../../image/adn.jpg";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react"; // <-- thêm SwiperRef
import { Autoplay, Scrollbar } from "swiper/modules";
import { useRef } from "react";

export default function Home() {
  // ref đúng type SwiperRef
  const swiperRef = useRef<SwiperRef | null>(null);

  const handlePrev = () => {
    swiperRef.current?.swiper.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.swiper.slideNext();
  };

  const services = [
    {
      title: "Xét nghiệm huyết thống",
      desc: "Xác định cha - con, mẹ - con,... độ chính xác cao.",
      icon: "🧬",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      title: "Xét nghiệm hành chính",
      desc: "Dùng cho mục đích pháp lý, thủ tục hành chính.",
      icon: "📋",
      gradient: "from-green-500 to-teal-600",
    },
    {
      title: "Xét nghiệm dân sự",
      desc: "Giải thích kết quả và tư vấn hướng xử lý.",
      icon: "💡",
      gradient: "from-orange-500 to-red-600",
    },
  ];

  const reasons = [
    {
      icon: "👨‍⚕️",
      text: "Đội ngũ chuyên gia giàu kinh nghiệm",
      desc: "Bác sĩ và kỹ thuật viên được đào tạo chuyên sâu",
    },
    {
      icon: "🔬",
      text: "Trang thiết bị hiện đại, chính xác",
      desc: "Máy móc công nghệ tiên tiến từ châu Âu",
    },
    {
      icon: "🛡️",
      text: "Tư vấn tận tình, bảo mật thông tin",
      desc: "Cam kết bảo mật tuyệt đối thông tin khách hàng",
    },
  ];

  const newsData = [
    {
      title: "Công nghệ AI mới trong xét nghiệm ADN",
      desc: "Ứng dụng trí tuệ nhân tạo giúp tăng độ chính xác lên 99.9999%",
      date: "05/06/2025",
    },
    {
      title: "Mở rộng dịch vụ xét nghiệm di truyền",
      desc: "Ra mắt gói xét nghiệm toàn diện cho gia đình",
      date: "01/06/2025",
    },
    {
      title: "Hợp tác với phòng xét nghiệm Nhật Bản",
      desc: "Nâng cao chất lượng dịch vụ theo tiêu chuẩn quốc tế",
      date: "28/05/2025",
    },
    {
      title: "Giải thưởng xuất sắc năm 2024",
      desc: "Nhận giải thưởng công nghệ y tế tiên tiến nhất",
      date: "15/05/2025",
    },
    {
      title: "Khánh thành chi nhánh mới",
      desc: "Mở rộng mạng lưới phục vụ khách hàng toàn quốc",
      date: "10/05/2025",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Banner Image */}
      <div className="relative w-full h-96 overflow-hidden">
        <img
          src={banner}
          alt="Banner"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70 flex items-center justify-center px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              GeneLink - TIÊN PHONG VỀ XÉT NGHIỆM GEN
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              Thành viên Tập đoàn Eurofins - Doanh nghiệp y tế tiên phong trong
              lĩnh vực xét nghiệm
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Về GeneLink
            </h2>
            <div className="text-gray-700 space-y-4 leading-relaxed text-justify">
              <p>
                Công ty Cổ phần Dịch vụ Phân tích Di truyền (GeneLink) - thành
                viên Tập đoàn Eurofins - là một doanh nghiệp y tế tiên phong
                trong lĩnh vực xét nghiệm được thành lập ngày 26/10/2010 bởi đội
                ngũ các nhà khoa học đầu ngành.
              </p>
              <p>
                Trong hành trình nỗ lực phát triển không ngừng, GeneLink vẫn
                luôn giữ vững và khẳng định vai trò dẫn đầu về phân tích di
                truyền nói riêng cũng như trong ngành xét nghiệm hỗ trợ chẩn
                đoán lâm sàng nói chung.
              </p>
              <p>
                Việc gia nhập Tập đoàn Y tế Số 1 Thế giới Eurofins là một trong
                những bước đi chiến lược nhằm trở thành doanh nghiệp có vốn đầu
                tư nước ngoài và xây dựng thương hiệu uy tín đa quốc gia.
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl shadow-2xl overflow-hidden">
            <img
              src={adn}
              alt="Phòng xét nghiệm ADN"
              className="w-full h-80 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto relative">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent leading-tight">
            Trung tâm xét nghiệm
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ADN uy tín
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Nơi bạn có thể tin tưởng để tìm hiểu về nguồn gốc và mối quan hệ
            huyết thống với công nghệ tiên tiến nhất.
          </p>

          <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
            <span className="relative z-10">Đặt lịch xét nghiệm ngay</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* Floating DNA Icons */}
          <div
            className="absolute top-20 left-10 text-4xl animate-bounce"
            style={{ animationDelay: "1s" }}
          >
            🧬
          </div>
          <div
            className="absolute top-36 right-16 text-6xl animate-spin-slow"
            style={{ animationDelay: "2s" }}
          >
            🧬
          </div>
          <div
            className="absolute bottom-16 left-20 text-5xl animate-pulse"
            style={{ animationDelay: "3s" }}
          >
            🧬
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gradient-to-r from-purple-50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto rounded-xl shadow-lg my-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-purple-700">
          Dịch vụ nổi bật
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map(({ title, desc, icon, gradient }, i) => (
            <div
              key={i}
              className={`p-6 rounded-xl shadow-lg text-white cursor-pointer transform hover:scale-105 transition-transform duration-300 bg-gradient-to-tr ${gradient}`}
            >
              <div className="text-6xl mb-4">{icon}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center text-blue-700">
          Vì sao chọn GeneLink
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {reasons.map(({ icon, text, desc }, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg shadow hover:shadow-xl transition-shadow duration-300 bg-white"
            >
              <div className="text-5xl">{icon}</div>
              <h3 className="font-semibold text-lg">{text}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* News Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-3xl font-bold mb-12 text-center text-teal-700">
          Tin tức mới nhất
        </h2>

        <div className="relative">
          {/* Swiper Buttons */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 -left-10 z-10 bg-teal-600 text-white rounded-full p-2 shadow hover:bg-teal-700 transition"
            aria-label="Previous slide"
          >
            ◀
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 -right-10 z-10 bg-teal-600 text-white rounded-full p-2 shadow hover:bg-teal-700 transition"
            aria-label="Next slide"
          >
            ▶
          </button>

          <Swiper
            ref={swiperRef} // gán ref đúng kiểu SwiperRef
            modules={[Autoplay, Scrollbar]}
            spaceBetween={24}
            slidesPerView={3}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true} 
            scrollbar={{ draggable: true }}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="rounded-xl"
          >
            {newsData.map(({ title, desc, date }, i) => (
              <SwiperSlide
                key={i}
                className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transition-shadow duration-300"
              >
                <h3 className="font-semibold mb-2 text-lg text-teal-700">{title}</h3>
                <p className="text-gray-700 mb-4">{desc}</p>
                <span className="text-sm text-gray-400">{date}</span>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
}
