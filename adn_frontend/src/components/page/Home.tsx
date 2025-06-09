<<<<<<< Updated upstream
import "./Home.module.css"

export default function Home() {
=======
import banner from "../../image/banner.jpg";
import doctor from "../../image/doctor.jpg";
import adn from "../../image/adn.jpg";
import item from "../../image/pic1.jpg";
import geneLinkImage from "../../image/Intro_image.png";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react"; // <-- thêm SwiperRef
import { Autoplay, Scrollbar } from "swiper/modules";
import { useRef, useState } from "react";
import "./Home.module.css";


import {
  ClipboardCheck,
  HomeIcon,
  Hospital,
  ShieldCheck,
  Users2,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Box } from "@mui/material";
import { ArrowForwardRounded } from "@mui/icons-material";

export default function Home() {
  // ref đúng type SwiperRef
  const swiperRef = useRef<SwiperRef | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const handlePrev = () => {
    swiperRef.current?.swiper.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.swiper.slideNext();
  };
  const imageData = [
    {
      src: item,
      title: "Quy trình chuyên nghiệp",
      desc: "Tiêu chuẩn ISO 17025",
      gradient: "from-blue-900/80",
    },
    {
      src: adn,
      title: "Công nghệ tiên tiến",
      desc: "Thiết bị hiện đại hàng đầu",
      gradient: "from-green-900/80",
    },
    {
      src: item,
      title: "Đội ngũ chuyên gia",
      desc: "Bác sĩ giàu kinh nghiệm",
      gradient: "from-purple-900/80",
    },
    {
      src: adn,
      title: "Bảo mật tuyệt đối",
      desc: "Bảo vệ thông tin cá nhân",
      gradient: "from-orange-900/80",
    },
  ];
>>>>>>> Stashed changes
  const services = [
    {
      title: "Xét nghiệm huyết thống",
      desc: "Xác định cha - con, mẹ - con,... độ chính xác cao.",
      icon: "🧬",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      title: "Xét nghiệm hành chính",
      desc: "Dùng cho mục đích pháp lý, thủ tục hành chính.",
      icon: "📋",
      gradient: "from-green-500 to-teal-600"
    },
    {
      title: "Xét nghiệm dân sự",
      desc: "Giải thích kết quả và tư vấn hướng xử lý.",
      icon: "💡",
      gradient: "from-orange-500 to-red-600"
    },
  ];

  const reasons = [
    {
      icon: "👨‍⚕️",
      text: "Đội ngũ chuyên gia giàu kinh nghiệm",
      desc: "Bác sĩ và kỹ thuật viên được đào tạo chuyên sâu"
    },
    {
      icon: "🔬",
      text: "Trang thiết bị hiện đại, chính xác",
      desc: "Máy móc công nghệ tiên tiến từ châu Âu"
    },
    {
      icon: "🛡️",
      text: "Tư vấn tận tình, bảo mật thông tin",
      desc: "Cam kết bảo mật tuyệt đối thông tin khách hàng"
    },
  ];

  return (
<<<<<<< Updated upstream
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title with Gradient */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent leading-tight">
            Trung tâm xét nghiệm
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ADN uy tín
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Nơi bạn có thể tin tưởng để tìm hiểu về nguồn gốc và mối quan hệ huyết thống với công nghệ tiên tiến nhất.
          </p>
          
          {/* CTA Button */}
          <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
            <span className="relative z-10">Đặt lịch xét nghiệm ngay</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          {/* Floating DNA Icons */}
          <div className="absolute top-20 left-10 text-4xl animate-bounce" style={{animationDelay: '1s'}}>🧬</div>
          <div className="absolute top-40 right-20 text-3xl animate-bounce" style={{animationDelay: '3s'}}>🔬</div>
          <div className="absolute bottom-40 left-20 text-3xl animate-bounce" style={{animationDelay: '2s'}}>⚗️</div>
        </div>
      </section>

=======
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-x-hidden">
      {/* Banner + Đăng Ký Tư Vấn */}
      <div className="relative mt-24 overflow-visible">
        {/* Banner Image */}
        <img
          src={banner}
          alt="Banner"
          className="w-full h-auto object-contain"
          loading="lazy"
        />

     {/* Form đăng ký đè lên đáy banner */}
<section
  className="
    absolute bottom-0 left-1/2
    transform -translate-x-1/2 translate-y-1/2
    w-[90%] max-w-4xl
    bg-blue-50 rounded-xl p-6
    shadow-lg z-10
    border-2 border-blue-200
  "
>
  <h2 className="text-center text-2xl font-bold text-blue-700 mb-4">
    ĐĂNG KÝ TƯ VẤN
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
    <input
      type="text"
      placeholder="Tên*"
      className="
        bg-white border-2 border-gray-300
        rounded-lg px-4 py-2
        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500
        transition-shadow duration-200 shadow-sm focus:shadow-md
      "
    />
    <input
      type="text"
      placeholder="Số điện thoại*"
      className="
        bg-white border-2 border-gray-300
        rounded-lg px-4 py-2
        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500
        transition-shadow duration-200 shadow-sm focus:shadow-md
      "
    />
    <input
      type="text"
      placeholder="Dịch vụ quan tâm"
      className="
        bg-white border-2 border-gray-300
        rounded-lg px-4 py-2
        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500
        transition-shadow duration-200 shadow-sm focus:shadow-md
      "
    />
    <button
      className="
        bg-orange-500 border-2 border-orange-500
        text-white font-semibold
        rounded-lg px-6 py-2
        hover:bg-orange-600 hover:border-orange-600
        transition-all duration-200
        shadow-md hover:shadow-lg
      "
    >
      TƯ VẤN NGAY
    </button>
  </div>
</section>

      </div>

      {/* About Section - kéo lên để khỏi trắng */}
      <section className="relative -mt-20 pt-20 pb-4 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* …nội dung Về GeneLink… */}
      </section>

{/* {Section giới thiệu geneLink} */}
      <section className="relative mt-32 mb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-24 h-24 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        {/* Card container */}
        <div className="relative z-10 max-w-6xl mx-auto bg-gradient-to-br from-blue-50 to-white 
                      rounded-3xl shadow-xl border border-blue-100/50 
                      transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 
                      backdrop-blur-sm p-6 sm:p-8">

          {/* Subtle top border gradient */}
          <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full"></div>

          <div className="flex flex-col md:flex-row items-start gap-8">

            {/* Text bên trái */}
            <div className="md:w-2/3">
              <div className="relative mb-6">
                <h2 className="text-3xl md:text-4xl font-bold 
                             bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 
                             bg-clip-text text-transparent mb-2
                             transform transition-all duration-300 hover:scale-105">
                  Về GeneLink
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full 
                              transform transition-all duration-500 hover:w-24"></div>
              </div>

              <div className="text-gray-700 space-y-6 leading-relaxed text-justify">
                <p className="transform transition-all duration-300 hover:text-gray-800 
                           p-4 rounded-xl hover:bg-blue-50/50 hover:shadow-sm
                           border-l-2 border-transparent hover:border-blue-300">
                  <span className="font-semibold text-blue-700">Công ty Cổ phần Dịch vụ Phân tích Di truyền (GeneLink)</span> - thành
                  viên <span className="font-semibold text-purple-700">Tập đoàn Eurofins</span> - là một doanh nghiệp y tế tiên phong
                  trong lĩnh vực xét nghiệm được thành lập ngày <span className="font-medium text-blue-600">26/10/2010</span> bởi đội
                  ngũ các nhà khoa học đầu ngành.
                </p>

                <p className="transform transition-all duration-300 hover:text-gray-800 
                           p-4 rounded-xl hover:bg-purple-50/50 hover:shadow-sm
                           border-l-2 border-transparent hover:border-purple-300">
                  Trong hành trình nỗ lực phát triển không ngừng, <span className="font-semibold text-blue-700">GeneLink</span> vẫn
                  luôn giữ vững và khẳng định vai trò <span className="font-semibold text-purple-700">dẫn đầu về phân tích di
                    truyền</span> nói riêng cũng như trong ngành xét nghiệm hỗ trợ chẩn
                  đoán lâm sàng nói chung.
                </p>

                <p className="transform transition-all duration-300 hover:text-gray-800 
                           p-4 rounded-xl hover:bg-blue-50/50 hover:shadow-sm
                           border-l-2 border-transparent hover:border-blue-300">
                  Việc gia nhập <span className="font-semibold text-blue-700">Tập đoàn Y tế Số 1 Thế giới Eurofins</span> là một trong
                  những bước đi chiến lược nhằm trở thành doanh nghiệp có vốn đầu
                  tư nước ngoài và xây dựng <span className="font-semibold text-purple-700">thương hiệu uy tín đa quốc gia</span>.
                </p>
              </div>
            </div>

            {/* Ảnh bên phải */}
            {/* Ảnh bên phải */}
            <div className="md:w-1/2 flex justify-center">  {/* Tăng từ 1/3 lên 1/2 */}
              <div className="w-full max-w-md">                {/* Đặt max-width cho ảnh */}
                <img
                  src={geneLinkImage}
                  alt="GeneLink Laboratory"
                  className="w-full h-auto object-cover rounded-2xl shadow-lg 
                 border border-blue-100/50 bg-white/80 backdrop-blur-sm
                 transform transition-all duration-300 hover:shadow-xl"
                />
              </div>
            </div>


          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent rounded-full"></div>
        </div>
      </section>

      {/* YouTube Video Embed */}
      <section className="flex justify-center mt-4">
        <iframe
          width="1000"
          height="600"
          className="rounded-lg shadow-lg"
          src="https://www.youtube.com/embed/ffpkreH-cfk"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </section>

       <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-gradient-to-r from-green-300/20 to-blue-300/20 rounded-full blur-xl"></div>
      </div>

      {/* Main container with frame */}
      <div className="relative z-10 bg-gradient-to-br from-white via-green-50/30 to-blue-50/30 
                      rounded-3xl shadow-2xl border border-gray-100/50 
                      transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-1 
                      backdrop-blur-sm p-8 sm:p-12 overflow-hidden">
        
        {/* Top decorative border */}
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-green-400 to-blue-400 to-transparent rounded-full"></div>
        
        {/* Side accent lines */}
        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-transparent via-green-400/50 to-transparent rounded-full"></div>
        <div className="absolute right-0 top-1/3 bottom-1/3 w-1 bg-gradient-to-b from-transparent via-blue-400/50 to-transparent rounded-full"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ul className="pl-4 space-y-4">
            <div className="relative mb-8">
              <h2 className="text-2xl font-bold mb-6 text-left
                             transform transition-all duration-300 hover:scale-105">
                <strong className="bg-gradient-to-r from-green-600 via-blue-600 to-green-700 
                                 bg-clip-text text-transparent">
                  Gói xét nghiệm ADN Huyết thống
                </strong>
              </h2>
              <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-blue-400 rounded-full"></div>
            </div>
            <br />
            
            <li className="flex items-start group transform transition-all duration-300 hover:translate-x-2">
              <div className="flex-shrink-0 mr-3 p-1 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
                <ShieldCheck 
                  style={{ color: "green" }} 
                  className="transform transition-all duration-300 group-hover:scale-110" 
                />
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-green-100/50 
                              group-hover:bg-white/80 group-hover:shadow-md transition-all duration-300
                              group-hover:border-green-200">
                <p className="text-base group-hover:text-green-800 transition-colors duration-300">
                  <strong>ADN huyết thống trực hệ (Cha | Mẹ - Con)</strong>
                </p>
              </div>
            </li>
            
            <li className="flex items-start group transform transition-all duration-300 hover:translate-x-2">
              <div className="flex-shrink-0 mr-3 p-1 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
                <ShieldCheck 
                  style={{ color: "green" }} 
                  className="transform transition-all duration-300 group-hover:scale-110" 
                />
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-green-100/50 
                              group-hover:bg-white/80 group-hover:shadow-md transition-all duration-300
                              group-hover:border-green-200">
                <p className="text-base group-hover:text-green-800 transition-colors duration-300">
                  <strong>
                    ADN huyết thống trực hệ (Cha | Mẹ - Con) - Làm giấy khai sinh
                  </strong>
                </p>
              </div>
            </li>
            
            <li className="flex items-start group transform transition-all duration-300 hover:translate-x-2">
              <div className="flex-shrink-0 mr-3 p-1 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
                <ShieldCheck 
                  style={{ color: "green" }} 
                  className="transform transition-all duration-300 group-hover:scale-110" 
                />
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-green-100/50 
                              group-hover:bg-white/80 group-hover:shadow-md transition-all duration-300
                              group-hover:border-green-200">
                <p className="text-base group-hover:text-green-800 transition-colors duration-300">
                  <strong>
                    ADN huyết thống trực hệ (Cha | Mẹ - Con) - để thực hiện các
                    thủ tục pháp lý
                  </strong>
                </p>
              </div>
            </li>
          </ul>
          
          <div
            className="relative rounded-2xl shadow-2xl overflow-hidden group"
            style={{ width: "60%", marginLeft: 150 }}
          >
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 
                            rounded-2xl blur-xl opacity-0 group-hover:opacity-100 
                            transition-all duration-500 scale-110 z-0"></div>
            
            {/* Image container */}
            <div className="relative transform transition-all duration-500 
                            group-hover:scale-105 group-hover:-rotate-1 z-10">
              <img
                src={doctor}
                alt="Phòng xét nghiệm ADN"
                className="h-full object-cover rounded-2xl border-2 border-white/50"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent rounded-2xl"></div>
              
              {/* Floating accent elements */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full 
                              opacity-60 animate-bounce"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full 
                              opacity-60 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Bottom decorative border */}
        <div className="absolute bottom-0 left-1/3 right-1/3 h-1 bg-gradient-to-r from-transparent via-blue-400 to-green-400 to-transparent rounded-full"></div>
        
        {/* Corner accents */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-green-300/50 rounded-tl-lg"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-300/50 rounded-br-lg"></div>
      </div>
    </section>
>>>>>>> Stashed changes
      {/* Services Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
              Dịch vụ nổi bật
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
<<<<<<< Updated upstream
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 border border-white/50"
=======
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-stretch">
            {/* Left side: Reasons list + 4 interactive sections */}
            <div className="lg:col-span-3 flex flex-col">
              {/* Reasons grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 pl-4 sm:pl-6 lg:pl-8">
                {reasons.map(({ icon, text, desc }, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="text-2xl mb-3">{icon}</div>
                    <h3 className="font-semibold text-sm text-gray-800 mb-2 leading-tight">
                      {text}
                    </h3>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* 4 interactive image sections */}
              <div className="pl-4 sm:pl-6 lg:pl-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                {imageData.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-lg shadow-sm h-40 group cursor-pointer transition-all duration-300 ${selectedImage === index
                      ? "ring-4 ring-blue-500 ring-opacity-60 transform scale-105"
                      : "hover:scale-105"
                      }`}
                  >
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${image.gradient} to-transparent`}
                    ></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <h3 className="text-sm font-semibold mb-1">
                        {image.title}
                      </h3>
                      <p className="text-xs opacity-90">{image.desc}</p>
                    </div>
                    {selectedImage === index && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Dynamic Image Display - Matches left side height */}
            <div className="lg:col-span-2 px-4 sm:px-6 lg:px-8 flex">
              <div className="rounded-xl overflow-hidden shadow-lg relative w-full h-full min-h-[500px] lg:min-h-0">
                <img
                  src={imageData[selectedImage].src}
                  alt={imageData[selectedImage].title}
                  className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {imageData[selectedImage].title}
                  </h3>
                  <p className="text-white/90 text-lg">
                    {imageData[selectedImage].desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
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
>>>>>>> Stashed changes
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.desc}
                </p>
                
                {/* Hover Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
              Vì sao chọn chúng tôi?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className="text-center group"
              >
                {/* Icon Container */}
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                    {reason.icon}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                  {reason.text}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {reason.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "99.9%", label: "Độ chính xác" },
              { number: "10,000+", label: "Khách hàng" },
              { number: "5", label: "Năm kinh nghiệm" },
              { number: "24/7", label: "Hỗ trợ" }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-lg opacity-90">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Trung tâm xét nghiệm ADN
            </h3>
            <p className="text-gray-400 mb-6">
              Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM<br />
              Điện thoại: (028) 1234 5678 | Email: info@dnatest.vn
            </p>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500">
              © 2025 Trung tâm xét nghiệm ADN. Bản quyền thuộc về công ty chúng tôi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}