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
  const services = [
    {
      title: "Xét nghiệm hành chính",
      desc: "Xét nghiệm ADN phục vụ các thủ tục hành chính và pháp lý như đăng ký khai sinh, nhập quốc tịch, xác định huyết thống cho các thủ tục nhận con nuôi hoặc giải quyết các tranh chấp pháp lý trong gia đình. Kết quả có giá trị pháp lý và được công nhận bởi các cơ quan chức năng.",
      icon: <ClipboardCheck className="w-7 h-7 text-blue-600" />,
      link: "/services/administrative",
    },
    {
      title: "Xét nghiệm dân sự",
      desc: "Dịch vụ xét nghiệm dân sự giúp xác định mối quan hệ huyết thống trong gia đình như cha – con, mẹ – con, anh – em. Phù hợp khi bạn cần sự rõ ràng trong mối quan hệ huyết thống vì lý do cá nhân, tâm lý, hay giải quyết các mâu thuẫn nội bộ trong gia đình mà không cần giá trị pháp lý.",
      icon: <Users2 className="w-7 h-7 text-emerald-600" />,
      link: "/services/civil",
    },
    {
      title: "Xét nghiệm tại nhà",
      desc: "Chúng tôi cung cấp dịch vụ lấy mẫu tận nơi trên toàn quốc. Nhân viên y tế được đào tạo chuyên nghiệp sẽ đến tận nhà để lấy mẫu sinh phẩm như niêm mạc miệng, tóc, móng,… Dịch vụ giúp tiết kiệm thời gian, đảm bảo sự riêng tư, và vẫn giữ nguyên độ chính xác của kết quả.",
      icon: <HomeIcon className="w-7 h-7 text-purple-600" />,
      link: "/services/at-home",
    },
    {
      title: "Xét nghiệm tại cơ sở",
      desc: "Khách hàng có thể đến trực tiếp các chi nhánh hoặc phòng xét nghiệm liên kết của GeneLink để thực hiện lấy mẫu ADN. Cơ sở vật chất hiện đại, nhân viên hỗ trợ tận tình và quy trình chuẩn giúp đảm bảo mẫu thu được chất lượng tốt nhất cho phân tích.",
      icon: <Hospital className="w-7 h-7 text-pink-600" />,
      link: "/services/at-center",
    },
  ];

  const reasons = [
    {
      icon: "👨‍⚕️",
      text: "Đội ngũ chuyên gia giàu kinh nghiệm",
      desc: "Bác sĩ và kỹ thuật viên được đào tạo chuyên sâu, có nhiều năm kinh nghiệm trong lĩnh vực xét nghiệm di truyền, đảm bảo kết quả chính xác và tư vấn tận tình cho khách hàng.",
    },
    {
      icon: "🔬",
      text: "Trang thiết bị hiện đại, chính xác",
      desc: "Máy móc công nghệ tiên tiến nhập khẩu từ châu Âu, áp dụng các kỹ thuật phân tích ADN mới nhất giúp tăng độ chính xác và rút ngắn thời gian trả kết quả.",
    },
    {
      icon: "🛡️",
      text: "Tư vấn tận tình, bảo mật thông tin",
      desc: "Cam kết bảo mật tuyệt đối mọi thông tin khách hàng, cung cấp dịch vụ tư vấn chuyên nghiệp, tận tâm nhằm đảm bảo quyền riêng tư và sự an tâm cho khách hàng.",
    },
    // 3 lý do mới thêm
    {
      icon: "🌐",
      text: "Mạng lưới phòng xét nghiệm rộng khắp",
      desc: "Hệ thống phòng xét nghiệm liên kết phủ sóng toàn quốc, tạo thuận tiện cho khách hàng ở mọi địa phương dễ dàng tiếp cận dịch vụ chất lượng cao.",
    },
    {
      icon: "⏱️",
      text: "Thời gian trả kết quả nhanh chóng",
      desc: "Quy trình xử lý mẫu nhanh gọn, tối ưu giúp khách hàng nhận kết quả xét nghiệm trong thời gian ngắn nhất, đáp ứng nhu cầu cấp thiết và kịp thời.",
    },
    {
      icon: "💼",
      text: "Hợp tác với các tổ chức y tế uy tín",
      desc: "GeneLink hợp tác với nhiều bệnh viện, trung tâm y tế và phòng thí nghiệm quốc tế nhằm nâng cao chất lượng dịch vụ và cập nhật công nghệ tiên tiến.",
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
      bg-blue-100 rounded-xl p-6
      shadow-xl z-10
    "
        >
          <h2 className="text-center text-2xl font-bold text-blue-700 mb-4">
            ĐĂNG KÝ TƯ VẤN
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Tên*"
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Số điện thoại*"
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"     
              placeholder="Dịch vụ quan tâm"
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="bg-orange-500 border border-orange-500 text-white font-semibold rounded-lg px-6 py-2 hover:bg-orange-600 transition">
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
      {/* Services Section */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-700">
          Dịch vụ nổi bật
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map(({ title, desc, icon, link }, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white text-gray-800 shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 border border-gray-100 flex flex-col"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 mb-4 shadow-inner">
                {icon}
              </div>
              <h3 className="text-lg font-semibold mb-1">{title}</h3>
              <p className="text-sm text-gray-600 flex-grow">{desc}</p>{" "}
              {/* flex-grow để đẩy nút xuống dưới */}
              <Box
                component={NavLink}
                to={link}
                className="mt-6 mx-auto inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                Xem chi tiết
                <ArrowForwardRounded className="ml-2" fontSize="small" />
              </Box>
            </div>
          ))}
        </div>
      </section>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center text-blue-700">
              Vì sao chọn GeneLink
            </h2>
          </div>
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
              >
                <h3 className="font-semibold mb-2 text-lg text-teal-700">
                  {title}
                </h3>
                <p className="text-gray-700 mb-4">{desc}</p>
                <span className="text-sm text-gray-400">{date}</span>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* FOOTER - PHẦN MỚI THÊM */}
      <footer
        className="bg-gradient-to-br text-white"
        style={{ backgroundColor: "#529ADE" }}
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
}
