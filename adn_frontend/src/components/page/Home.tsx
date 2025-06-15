
import doctor from '../../image/doctor.jpg';
import QuangAnh from '../../image/QuangAnh.png';
import DinhBao from '../../image/DinhBao.png';
import DanThanh from '../../image/DanThanh.png';
import TrungThuc from '../../image/TrungThuc.png';

import geneLinkImage from '../../image/Intro_image.png';
import { Swiper, SwiperSlide, type SwiperRef } from 'swiper/react'; // <-- thêm SwiperRef
import { Autoplay, Scrollbar } from 'swiper/modules';
import { useRef, useState } from 'react';
import './Home.module.css';
import banner_video from '../../image/Banner_video.mp4';
import { FaPhoneAlt } from 'react-icons/fa';
import { FaFacebookMessenger } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

import {
  ClipboardCheck,
  HomeIcon,
  Hospital,
  Users2,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Box } from '@mui/material';
import { ArrowForwardRounded } from '@mui/icons-material';

export default function Home() {
  // ref đúng type SwiperRef

  const swiperRef = useRef<SwiperRef | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  

  const handlePrev = () => {
    swiperRef.current?.swiper.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.swiper.slideNext();
  };
  const imageData = [
  {
    src: QuangAnh,
    desc: 'PGS.TS Nguyễn Đình Quang Anh',
    gradient: 'from-blue-900/80',
    content: (
      <>
        <p className="mb-2">
          PGS.TS Nguyễn Đình Quang Anh hiện là cố vấn khoa học cấp cao tại GeneLink, phụ trách kiểm định chất lượng và đào tạo chuyên môn cho đội ngũ phân tích. 
        </p>
        <p>
          Với hơn <strong>25 năm kinh nghiệm</strong> trong lĩnh vực sinh học phân tử và xét nghiệm ADN, ông từng giữ vai trò trưởng khoa tại Viện Di truyền Quốc gia và là người đi đầu trong ứng dụng kỹ thuật PCR tại Việt Nam từ những năm 2000.
        </p>
      </>
    ),
  },
  {
    src: DinhBao,
    desc: 'PGS.TS Trần Đình Bảo',
    gradient: 'from-green-900/80',
    content: (
      <>
        <p className="mb-2">
          PGS.TS Trần Đình Bảo đang đảm nhiệm vai trò <strong>Giám đốc Chuyên môn</strong> tại GeneLink, chịu trách nhiệm giám sát quy trình phân tích mẫu và thiết lập tiêu chuẩn phòng thí nghiệm.
        </p>
        <p>
          Ông đã có hơn <strong>20 năm hoạt động</strong> trong lĩnh vực di truyền học lâm sàng và từng tham gia hàng trăm ca tư vấn huyết thống, bệnh di truyền hiếm gặp tại các bệnh viện tuyến trung ương.
        </p>
      </>
    ),
  },
  {
    src: DanThanh,
    desc: 'PGS.TS Nguyễn Đan Thanh',
    gradient: 'from-purple-900/80',
    content: (
      <>
        <p className="mb-2">
          Là một trong những thành viên sáng lập GeneLink, PGS.TS Nguyễn Đan Thanh hiện giữ vai trò <strong>Trưởng bộ phận Nghiên cứu & Phát triển</strong> tại công ty.
        </p>
        <p>
          Bà có hơn <strong>18 năm giảng dạy</strong> tại Đại học Y Hà Nội và nhiều công trình nghiên cứu quốc tế về phân tích ADN trong lĩnh vực ung thư và bệnh di truyền tiền sản.
        </p>
      </>
    ),
  },
  {
    src: TrungThuc,
    desc: 'PGS.TS Võ Trung Thực',
    gradient: 'from-orange-900/80',
    content: (
      <>
        <p className="mb-2">
          PGS.TS Võ Trung Thực hiện là <strong>Giám sát hệ thống xét nghiệm liên kết toàn quốc</strong> của GeneLink. Ông đảm bảo đồng bộ thiết bị, quy trình và đào tạo nhân lực tại các chi nhánh toàn quốc.
        </p>
        <p>
          Với <strong>22 năm kinh nghiệm</strong> trong lĩnh vực phân tích sinh học và xét nghiệm pháp y, ông từng tham gia nhiều vụ giám định ADN phức tạp và hợp tác quốc tế trong kiểm định chất lượng.
        </p>
      </>
    ),
  },
];

  
  const services = [
    {
      title: 'Xét nghiệm hành chính',
      desc: 'Xét nghiệm ADN phục vụ các thủ tục hành chính và pháp lý như đăng ký khai sinh, nhập quốc tịch, xác định huyết thống cho các thủ tục nhận con nuôi hoặc giải quyết các tranh chấp pháp lý trong gia đình. Kết quả có giá trị pháp lý và được công nhận bởi các cơ quan chức năng.',
      icon: <ClipboardCheck className="w-7 h-7 text-blue-600" />,
      link: '/service/administrative',
    },
    {
      title: 'Xét nghiệm dân sự',
      desc: 'Dịch vụ xét nghiệm dân sự giúp xác định mối quan hệ huyết thống trong gia đình như cha – con, mẹ – con, anh – em. Phù hợp khi bạn cần sự rõ ràng trong mối quan hệ huyết thống vì lý do cá nhân, tâm lý, hay giải quyết các mâu thuẫn nội bộ trong gia đình mà không cần giá trị pháp lý.',
      icon: <Users2 className="w-7 h-7 text-emerald-600" />,
      link: '/service/civil',
    },
    {
      title: 'Xét nghiệm tại nhà',
      desc: 'Chúng tôi cung cấp dịch vụ lấy mẫu tận nơi trên toàn quốc. Nhân viên y tế được đào tạo chuyên nghiệp sẽ đến tận nhà để lấy mẫu sinh phẩm như niêm mạc miệng, tóc, móng,… Dịch vụ giúp tiết kiệm thời gian, đảm bảo sự riêng tư, và vẫn giữ nguyên độ chính xác của kết quả.',
      icon: <HomeIcon className="w-7 h-7 text-purple-600" />,
      link: '/service/at-home',
    },
    {
      title: 'Xét nghiệm tại cơ sở',
      desc: 'Khách hàng có thể đến trực tiếp các chi nhánh hoặc phòng xét nghiệm liên kết của GeneLink để thực hiện lấy mẫu ADN. Cơ sở vật chất hiện đại, nhân viên hỗ trợ tận tình và quy trình chuẩn giúp đảm bảo mẫu thu được chất lượng tốt nhất cho phân tích.',
      icon: <Hospital className="w-7 h-7 text-pink-600" />,
      link: '/service/at-center',
    },
  ];

  const reasons = [
    {
      icon: '👨‍⚕️',
      text: 'Đội ngũ chuyên gia giàu kinh nghiệm',
      desc: 'Bác sĩ và kỹ thuật viên được đào tạo chuyên sâu, có nhiều năm kinh nghiệm trong lĩnh vực xét nghiệm di truyền, đảm bảo kết quả chính xác và tư vấn tận tình cho khách hàng.',
    },
    {
      icon: '🔬',
      text: 'Trang thiết bị hiện đại, chính xác',
      desc: 'Máy móc công nghệ tiên tiến nhập khẩu từ châu Âu, áp dụng các kỹ thuật phân tích ADN mới nhất giúp tăng độ chính xác và rút ngắn thời gian trả kết quả.',
    },
    {
      icon: '🛡️',
      text: 'Tư vấn tận tình, bảo mật thông tin',
      desc: 'Cam kết bảo mật tuyệt đối mọi thông tin khách hàng, cung cấp dịch vụ tư vấn chuyên nghiệp, tận tâm nhằm đảm bảo quyền riêng tư và sự an tâm cho khách hàng.',
    },
    // 3 lý do mới thêm
    {
      icon: '🌐',
      text: 'Mạng lưới phòng xét nghiệm rộng khắp',
      desc: 'Hệ thống phòng xét nghiệm liên kết phủ sóng toàn quốc, tạo thuận tiện cho khách hàng ở mọi địa phương dễ dàng tiếp cận dịch vụ chất lượng cao.',
    },
    {
      icon: '⏱️',
      text: 'Thời gian trả kết quả nhanh chóng',
      desc: 'Quy trình xử lý mẫu nhanh gọn, tối ưu giúp khách hàng nhận kết quả xét nghiệm trong thời gian ngắn nhất, đáp ứng nhu cầu cấp thiết và kịp thời.',
    },
    {
      icon: '💼',
      text: 'Hợp tác với các tổ chức y tế uy tín',
      desc: 'GeneLink hợp tác với nhiều bệnh viện, trung tâm y tế và phòng thí nghiệm quốc tế nhằm nâng cao chất lượng dịch vụ và cập nhật công nghệ tiên tiến.',
    },
  ];

  const newsData = [
    {
      title: 'Công nghệ AI mới trong xét nghiệm ADN',
      desc: 'Ứng dụng trí tuệ nhân tạo giúp tăng độ chính xác lên 99.9999%',
      date: '05/06/2025',
    },
    {
      title: 'Mở rộng dịch vụ xét nghiệm di truyền',
      desc: 'Ra mắt gói xét nghiệm toàn diện cho gia đình',
      date: '01/06/2025',
    },
    {
      title: 'Hợp tác với phòng xét nghiệm Nhật Bản',
      desc: 'Nâng cao chất lượng dịch vụ theo tiêu chuẩn quốc tế',
      date: '28/05/2025',
    },
    {
      title: 'Giải thưởng xuất sắc năm 2024',
      desc: 'Nhận giải thưởng công nghệ y tế tiên tiến nhất',
      date: '15/05/2025',
    },
    {
      title: 'Khánh thành chi nhánh mới',
      desc: 'Mở rộng mạng lưới phục vụ khách hàng toàn quốc',
      date: '10/05/2025',
    },
  ];
  

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-x-hidden">
     
     
     {/* Thanh hỗ trợ */}
<div className="fixed bottom-6 left-4 z-50 space-y-4 bg-white p-3 rounded-2xl shadow-lg">
  {/* Hotline */}
  <a
    href="tel:19001234"
    className="flex flex-col items-center hover:scale-105 transition-transform"
  >
    <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl shake-auto">
      <FaPhoneAlt />
    </div>
  </a>

  {/* Messenger */}
  <a
    href="https://m.me/yourpage"
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center hover:scale-105 transition-transform"
  >
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center text-white text-2xl shake-hover">
      <FaFacebookMessenger />
    </div>
  </a>

  {/* Zalo */}
  <a
    href="https://zalo.me/yourzaloid"
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center hover:scale-105 transition-transform"
  >
    <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl shake-hover">
      <SiZalo />
    </div>
  </a>
</div>



      <div className="relative w-full h-[600px] overflow-hidden mt-15">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={banner_video} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gray bg-opacity-50 z-10" />

      {/* Text Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
          Dịch vụ xét nghiệm ADN tại GeneLink
        </h1>
        <p className="text-lg md:text-xl max-w-2xl drop-shadow-md leading-relaxed">
          GeneLink cam kết cung cấp dịch vụ xét nghiệm ADN hiện đại, chính xác và bảo mật.
          Chúng tôi lưu trữ mẫu ADN an toàn, giúp bạn dễ dàng nâng cấp hoặc thực hiện thêm xét nghiệm mà không cần lấy mẫu lại.
        </p>
      </div>
    </div>
      {/* About Section - kéo lên để khỏi trắng */}
      <section className="relative -mt-20 pt-20 pb-4 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* …nội dung Về GeneLink… */}
      </section>
{/* Section giới thiệu GeneLink */}
<section className="w-full bg-blue-50 py-16">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8
                  flex flex-col md:flex-row items-stretch gap-8">
    {/* Text bên trái */}
    <div className="md:w-2/3 flex flex-col justify-center space-y-8 leading-loose tracking-wide">
      <h2 className="text-3xl font-bold text-blue-700">
        Về GeneLink
      </h2>
      <p className="text-gray-800">
        <span className="font-semibold text-blue-600">
          Công ty Cổ phần Dịch vụ Phân tích Di truyền (GeneLink)
        </span> – thành viên <span className="font-semibold text-purple-600">
          Tập đoàn Eurofins
        </span> – là một doanh nghiệp y tế tiên phong trong lĩnh vực xét nghiệm được thành lập ngày <span className="font-medium text-blue-500">26/10/2010</span> bởi đội ngũ các nhà khoa học đầu ngành.
      </p>
      <p className="text-gray-800">
        Trong hành trình nỗ lực phát triển không ngừng, <span className="font-semibold text-blue-600">GeneLink</span> vẫn luôn giữ vững và khẳng định vai trò <span className="font-semibold text-purple-600">dẫn đầu về phân tích di truyền</span> nói riêng cũng như trong ngành xét nghiệm hỗ trợ chẩn đoán lâm sàng nói chung.
      </p>
      <p className="text-gray-800">
        Việc gia nhập <span className="font-semibold text-blue-600">Tập đoàn Y tế Số 1 Thế giới Eurofins</span> là một trong những bước đi chiến lược nhằm trở thành doanh nghiệp có vốn đầu tư nước ngoài và xây dựng <span className="font-semibold text-purple-600">thương hiệu uy tín đa quốc gia</span>.
      </p>
    </div>
    {/* Ảnh bên phải */}
    <div className="md:w-1/2 flex">
      <img
        src={geneLinkImage}
        alt="GeneLink Laboratory"
        className="w-full h-full object-cover rounded-2xl"
      />
    </div>
  </div>
</section>



    {/* Section hướng dẫn lấy mẫu ADN tại nhà */}
<section className="w-full bg-white py-16">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-stretch gap-8">
    {/* Text hướng dẫn bên trái */}
    <div className="md:w-2/3 flex flex-col justify-center space-y-6 leading-relaxed tracking-wide">
      <h2 className="text-3xl font-bold text-green-700">Lấy mẫu ADN tại nhà</h2>
      <p className="text-gray-800">
        Chúng tôi cung cấp dịch vụ lấy mẫu tận nơi tiện lợi, đảm bảo riêng tư và an toàn:
      </p>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li className="text-green-600">
          <strong className="text-green-800">Đặt lịch trực tuyến:</strong> Chọn khung giờ thuận tiện, nhân viên y tế sẽ liên hệ xác nhận.
        </li>
        <li className="text-green-600">
          <strong className="text-green-800">Chuẩn bị dụng cụ:</strong> Bộ kit lấy mẫu bao gồm que tăm bông vô trùng, ống đựng mẫu, và hướng dẫn chi tiết.
        </li>
        <li className="text-green-600">
          <strong className="text-green-800">Thao tác đơn giản:</strong> Dùng que tăm bông quét nhẹ lòng má trong 2–3 lần, cho vào ống, dán nhãn và trả lại cho nhân viên.
        </li>
        <li className="text-green-600">
          <strong className="text-green-800">Vận chuyển an toàn:</strong> Mẫu được đóng gói kín, vận chuyển trong điều kiện bảo quản phù hợp để đảm bảo chất lượng.
        </li>
      </ul>
      <p className="text-gray-800">
        Thời gian lấy mẫu nhanh chóng (khoảng <span className="text-green-600 font-semibold">5–10 phút</span>), nhân viên được đào tạo chuyên nghiệp sẽ hướng dẫn chi tiết và hỗ trợ bạn trong suốt quá trình.
      </p>
    </div>

    {/* Video YouTube bên phải */}
    <div className="md:w-1/2 flex">
      <div className="w-full aspect-video overflow-hidden rounded-lg shadow-lg">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/ffpkreH-cfk"
          title="Hướng dẫn lấy mẫu ADN tại nhà"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  </div>
</section>

{/* Section Gói xét nghiệm ADN Huyết thống */}
<section className="w-full bg-gradient-to-br from-green-50 to-blue-50 py-20">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-stretch gap-10">
    {/* Nội dung bên trái */}
    <div className="lg:w-2/3 flex flex-col justify-center bg-white rounded-2xl shadow-lg p-10 space-y-8">
      <h2 className="text-3xl font-bold text-green-700">
        Gói xét nghiệm ADN Huyết thống
      </h2>
      <ul className="list-disc list-inside space-y-4 text-gray-700 leading-loose">
        <li>ADN huyết thống trực hệ (Cha – Con, Mẹ – Con)</li>
        <li>ADN phục vụ làm giấy khai sinh</li>
        <li>ADN hỗ trợ các thủ tục pháp lý</li>
      </ul>
      {/* Form tư vấn */}
      <div>
        <div className="flex bg-white border-2 border-green-200 rounded-full overflow-hidden shadow-sm max-w-md">
          <input
            type="text"
            placeholder="Nhập số điện thoại của bạn"
            className="flex-grow px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <button className="px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-full transition">
            Tư vấn ngay
          </button>
        </div>
      </div>
    </div>

    {/* Hình ảnh bên phải */}
    <div className="lg:w-1/3 flex items-center justify-center">
      <img
        src={doctor}
        alt="Phòng xét nghiệm ADN"
        className="w-full h-auto object-cover rounded-2xl shadow-lg"
      />
    </div>
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
              <p className="text-sm text-gray-600 flex-grow">{desc}</p>{' '}
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
    {/* Header */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-12 text-center text-blue-700">
        Vì sao chọn GeneLink
      </h2>
    </div>

    {/* Reasons grid (full width container) */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {reasons.map(({ icon, text, desc }, i) => (
        <div
          key={i}
          className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm"
        >
          <div className="text-2xl mb-3">{icon}</div>
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            {text}
          </h3>
          <p className="text-gray-600 text-sm">{desc}</p>
        </div>
      ))}
    </div>
      <h2 className="text-3xl font-bold mb-20 text-center text-blue-700">
       Đội ngũ chuyên gia
      </h2>
    {/* Interactive images grid (full width container) */}
<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
  {imageData.map((image, index) => (
    <div
      key={index}
      onClick={() => setSelectedImage(index)}
      className={`relative overflow-hidden rounded-lg shadow-md h-[320px] cursor-pointer transition-transform ${
        selectedImage === index ? 'ring-4 ring-blue-500 ring-opacity-60 scale-105' : ''
      }`}
    >
      <img
        src={image.src}
        alt={image.desc}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white bg-black/40 backdrop-blur-sm">
        <p className="text-sm font-medium">{image.desc}</p>
      </div>
    </div>
  ))}
</div>

{/* Pannel */}
{selectedImage !== null && (
  <div className="fixed top-0 right-0 w-full md:w-1/2 h-full bg-white z-50 shadow-xl transition-transform duration-300 transform translate-x-0 overflow-y-auto flex flex-col justify-between">
    {/* Header */}
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <button
        onClick={() => setSelectedImage(null)}
        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-white hover:bg-red-500 rounded-full text-xl font-bold transition"
        title="Đóng"
      >
        &times;
      </button>
    </div>

    {/* Nội dung chia 2 bên */}
    <div className="p-6 flex flex-col md:flex-row gap-6 h-full">
      <div className="p-6 flex flex-col md:flex-row gap-6 h-full">
  {/* Bên phải: ảnh */}
  <div className="md:w-1/2 flex justify-center">
    <img
      src={imageData[selectedImage].src}
      alt={`Chi tiết - ${imageData[selectedImage].desc}`}
      className="h-[400px] object-cover rounded-xl shadow"
    />
  </div>

  {/* Bên trái: giới thiệu (căn theo chiều cao ảnh) */}
  <div className="md:w-1/2 flex items-center">
    <div className="text-gray-800 space-y-4">
      <h3 className="text-xl font-semibold">
        {imageData[selectedImage].desc}
      </h3>
      <div className="text-sm text-gray-600 leading-relaxed">
        {imageData[selectedImage].content}
      </div>
    </div>
  </div>
</div>

    </div>

    {/* Nút đóng ở dưới */}
    <div className="p-4 flex justify-end border-t border-gray-200">
      <button
        onClick={() => setSelectedImage(null)}
        className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-lg font-bold rounded-xl shadow-lg transition"
      >
        ✕ Đóng 
      </button>
    </div>
  </div>
)}

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
                    to="/service/administrative"
                    className="hover:opacity-75 transition-opacity no-underline text-white block"
                  >
                    Xét nghiệm hành chính
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/service/civil"
                    className="hover:opacity-75 transition-opacity no-underline text-white block"
                  >
                    Xét nghiệm dân sự
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/service/at-home"
                    className="hover:opacity-75 transition-opacity no-underline text-white block"
                  >
                    Xét nghiệm tại nhà
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/service/at-center"
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
