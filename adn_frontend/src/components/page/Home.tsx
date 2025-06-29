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
// import { FaFacebookMessenger } from 'react-icons/fa';
// import { SiZalo } from 'react-icons/si';
import Notification from './Notification';
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
import { toast } from 'react-toastify';

type Consultation = {
  phone: string;
  name: string;
};

export default function Home() {
  // ref đúng type SwiperRef

  const [consultation, setConsultation] = useState<Consultation>({
    phone: '',
    name: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // Để kiểm soát việc mở/đóng modal
  const consultationRef = useRef<HTMLDivElement | null>(null);

  const scrollToConsultation = () => {
    consultationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true); // Mở modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Đóng modal
  };

  const swiperRef = useRef<SwiperRef | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handlePrev = () => {
    swiperRef.current?.swiper.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.swiper.slideNext();
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConsultation((consultation) => ({
      ...consultation,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(
        'http://localhost:8080/api/register-for-consultation/register-consultation',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(consultation),
        }
      );
      if (res.ok) {
        toast.success('thành công');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const imageData = [
    {
      src: QuangAnh,
      desc: 'PGS.TS Nguyễn Đình Quang Anh',
      gradient: 'from-blue-900/80',
      content: (
        <>
          <p className="mb-2">
            PGS.TS Nguyễn Đình Quang Anh hiện là cố vấn khoa học cấp cao tại
            GeneLink, phụ trách kiểm định chất lượng và đào tạo chuyên môn cho
            đội ngũ phân tích.
          </p>
          <p>
            Với hơn <strong>25 năm kinh nghiệm</strong> trong lĩnh vực sinh học
            phân tử và xét nghiệm ADN, ông từng giữ vai trò trưởng khoa tại Viện
            Di truyền Quốc gia và là người đi đầu trong ứng dụng kỹ thuật PCR
            tại Việt Nam từ những năm 2000.
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
            PGS.TS Trần Đình Bảo đang đảm nhiệm vai trò{' '}
            <strong>Giám đốc Chuyên môn</strong> tại GeneLink, chịu trách nhiệm
            giám sát quy trình phân tích mẫu và thiết lập tiêu chuẩn phòng thí
            nghiệm.
          </p>
          <p>
            Ông đã có hơn <strong>20 năm hoạt động</strong> trong lĩnh vực di
            truyền học lâm sàng và từng tham gia hàng trăm ca tư vấn huyết
            thống, bệnh di truyền hiếm gặp tại các bệnh viện tuyến trung ương.
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
            Là một trong những thành viên sáng lập GeneLink, PGS.TS Nguyễn Đan
            Thanh hiện giữ vai trò{' '}
            <strong>Trưởng bộ phận Nghiên cứu & Phát triển</strong> tại công ty.
          </p>
          <p>
            Bà có hơn <strong>18 năm giảng dạy</strong> tại Đại học Y Hà Nội và
            nhiều công trình nghiên cứu quốc tế về phân tích ADN trong lĩnh vực
            ung thư và bệnh di truyền tiền sản.
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
            PGS.TS Võ Trung Thực hiện là{' '}
            <strong>Giám sát hệ thống xét nghiệm liên kết toàn quốc</strong> của
            GeneLink. Ông đảm bảo đồng bộ thiết bị, quy trình và đào tạo nhân
            lực tại các chi nhánh toàn quốc.
          </p>
          <p>
            Với <strong>22 năm kinh nghiệm</strong> trong lĩnh vực phân tích
            sinh học và xét nghiệm pháp y, ông từng tham gia nhiều vụ giám định
            ADN phức tạp và hợp tác quốc tế trong kiểm định chất lượng.
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
    },
    {
      title: 'Xét nghiệm dân sự',
      desc: 'Dịch vụ xét nghiệm dân sự giúp xác định mối quan hệ huyết thống trong gia đình như cha – con, mẹ – con, anh – em. Phù hợp khi bạn cần sự rõ ràng trong mối quan hệ huyết thống vì lý do cá nhân, tâm lý, hay giải quyết các mâu thuẫn nội bộ trong gia đình mà không cần giá trị pháp lý.',
      icon: <Users2 className="w-7 h-7 text-emerald-600" />,
    },
    {
      title: 'Xét nghiệm tại nhà',
      desc: 'Chúng tôi cung cấp dịch vụ lấy mẫu tận nơi trên toàn quốc. Nhân viên y tế được đào tạo chuyên nghiệp sẽ đến tận nhà để lấy mẫu sinh phẩm như niêm mạc miệng, tóc, móng,… Dịch vụ giúp tiết kiệm thời gian, đảm bảo sự riêng tư, và vẫn giữ nguyên độ chính xác của kết quả.',
      icon: <HomeIcon className="w-7 h-7 text-purple-600" />,
    },
    {
      title: 'Xét nghiệm tại cơ sở',
      desc: 'Khách hàng có thể đến trực tiếp các chi nhánh hoặc phòng xét nghiệm liên kết của GeneLink để thực hiện lấy mẫu ADN. Cơ sở vật chất hiện đại, nhân viên hỗ trợ tận tình và quy trình chuẩn giúp đảm bảo mẫu thu được chất lượng tốt nhất cho phân tích, nghiên cứu.',
      icon: <Hospital className="w-7 h-7 text-pink-600" />,
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
      desc: 'Ra mắt gói xét nghiệm toàn diện và chính xác cho gia đình',
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
      {/* 3 icon lơ lửng, giữ nguyên shape */}
      <div className="fixed bottom-6 left-4 z-50 space-y-3">
        {/* Hotline */}
        <a
          onClick={scrollToConsultation}
          className="group flex flex-col items-center transition-all duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-2xl shadow-lg animate-pulse">
            <FaPhoneAlt className="group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </a>

        {/* Messenger
        <NavLink
          to="/messenger"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center transition-all duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl shadow-lg">
            <FaFacebookMessenger className="group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </NavLink>

        {/* Zalo */}
        {/* <a
          href="https://zalo.me/yourzaloid"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center transition-all duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-2xl shadow-lg">
            <SiZalo className="group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="text-xs text-gray-600 mt-1 font-medium">Zalo</span>
        </a>  */}
      </div>

      {/* Hero Section - Enhanced với overlay gradient và typography */}
      <div className="relative w-full h-[700px] overflow-hidden mt-15">
        {/* Video Background */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0 scale-105"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={banner_video} type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>

        {/* Enhanced Overlay với gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-gray-900/10 to-blue-900/50 z-10" />

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse z-15" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl animate-pulse z-15" />

        {/* Enhanced Text Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-black mb-8 drop-shadow-2xl bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent leading-tight">
              Dịch vụ xét nghiệm ADN
              <span className="block text-blue-300 text-4xl md:text-6xl mt-2">
                tại GeneLink
              </span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl drop-shadow-lg leading-relaxed font-light text-gray-100">
              <span className="font-semibold text-blue-300">GeneLink</span> cam
              kết cung cấp dịch vụ xét nghiệm ADN
              <span className="text-green-300 font-medium">
                {' '}
                hiện đại, chính xác và bảo mật
              </span>
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              {/* Nút Đặt lịch ngay để mở modal */}
              <button
                onClick={handleOpenModal} // Khi click vào sẽ mở modal
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-full shadow-lg hover:shadow-blue-500/30 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Đặt lịch ngay
              </button>
              <button className="px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold rounded-full border border-white/30 hover:border-white/50 transition-all duration-300">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Sử dụng Notification Modal */}
      <Notification
        isOpen={isModalOpen} // Mở modal khi isOpen là true
        onClose={handleCloseModal} // Đóng modal khi người dùng nhấn nút
        title="Vui lòng chọn dịch vụ xét nghiệm bạn muốn đăng ký"
        message="Hãy chọn dịch vụ hành chính hoặc dân sự"
      />
      {/* Section giới thiệu GeneLink - Enhanced với modern layout */}
      <section className="w-full bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 font-sans">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 
                  flex flex-col md:flex-row items-start gap-12"
        >
          {/* 3 ô text bên trái */}
          <div className="md:w-2/3 grid grid-cols-1 gap-8">
            {/* Tiêu đề chung */}
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
                Điểm nổi bật về GeneLink
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
            </div>

            {/* Card 1 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
                <span className="font-bold text-blue-700 text-xl">
                  Công ty Cổ phần Dịch vụ Phân tích Di truyền (GeneLink)
                </span>{' '}
                – thành viên
                <span className="font-bold text-green-700 bg-green-100 px-2 py-1 rounded-lg mx-1">
                  Tập đoàn Eurofins
                </span>{' '}
                – doanh nghiệp y tế tiên phong được thành lập
                <span className="font-semibold text-blue-600">26/10/2010</span>.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <p className="text-lg text-gray-700 leading-relaxed">
                <span className="font-bold text-blue-700">GeneLink</span> khẳng
                định vai trò
                <span className="font-bold text-green-700 bg-green-100 px-2 py-1 rounded-lg mx-1">
                  dẫn đầu về phân tích di truyền
                </span>{' '}
                trong ngành xét nghiệm hỗ trợ chẩn đoán lâm sàng.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <p className="text-lg text-gray-700 leading-relaxed">
                Gia nhập{' '}
                <span className="font-bold text-blue-700">
                  Tập đoàn Y tế Số 1 Thế giới Eurofins
                </span>{' '}
                để xây dựng
                <span className="font-bold text-green-700">
                  thương hiệu uy tín đa quốc gia
                </span>
                .
              </p>
            </div>
          </div>

          {/* Ảnh bên phải căn lên trên */}
          <div className="md:w-3/4 flex justify-center mt-5">
            <img
              src={geneLinkImage}
              alt="GeneLink Laboratory"
              className="w-full h-140 object-cover rounded-3xl shadow-lg border-4 border-blue-200 transition-transform duration-200 "
            />
          </div>
        </div>
      </section>

      {/* Section hướng dẫn lấy mẫu ADN - Enhanced với step-by-step design */}
      <section className="w-full bg-gradient-to-br from-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-stretch gap-12">
          {/* Text hướng dẫn bên trái */}
          <div className="md:w-2/3 flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                Lấy mẫu ADN tại nhà
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
            </div>

            <p className="text-xl text-gray-700 font-medium">
              Dịch vụ lấy mẫu tận nơi tiện lợi, đảm bảo riêng tư và an toàn
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  step: '01',
                  title: 'Đặt lịch trực tuyến',
                  desc: 'Chọn khung giờ thuận tiện, nhân viên y tế sẽ liên hệ xác nhận',
                  color: 'from-blue-500 to-blue-600',
                },
                {
                  step: '02',
                  title: 'Chuẩn bị dụng cụ',
                  desc: 'Bộ kit lấy mẫu bao gồm que tăm bông vô trùng, ống đựng mẫu',
                  color: 'from-green-500 to-green-600',
                },
                {
                  step: '03',
                  title: 'Thao tác đơn giản',
                  desc: 'Dùng que tăm bông quét nhẹ lòng má, cho vào ống và dán nhãn',
                  color: 'from-purple-500 to-purple-600',
                },
                {
                  step: '04',
                  title: 'Vận chuyển an toàn',
                  desc: 'Mẫu được đóng gói kín, vận chuyển trong điều kiện bảo quản phù hợp',
                  color: 'from-orange-500 to-orange-600',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group "
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white font-bold shadow-lg`}
                    >
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 border border-green-200">
              <p className="text-gray-800 text-center">
                ⏱️ Thời gian lấy mẫu:{' '}
                <span className="text-green-600 font-bold text-lg">
                  5–10 phút
                </span>
                <br />
                <span className="text-sm text-gray-600 mt-2 block">
                  Nhân viên được đào tạo chuyên nghiệp sẽ hướng dẫn chi tiết
                </span>
              </p>
            </div>
          </div>

          {/* Video YouTube bên phải với khung viền xanh dương nhạt */}
          <div className="md:w-1/2 flex items-center mt-15">
            <div className="relative w-full">
              <div className="relative w-full h-[600px] overflow-hidden rounded-2xl shadow-lg border-4 border-blue-200">
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
        </div>
      </section>

      {/* Section Gói xét nghiệm ADN - Enhanced với modern card và CTA */}
      <section className="w-full bg-gradient-to-br from-blue-600 via-green-600 to-teal-600 py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12"
          ref={consultationRef}
        >
          {/* Nội dung bên trái */}
          <div className="lg:w-2/3 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 space-y-8 border border-white/20">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text">
                Gói xét nghiệm ADN Huyết thống
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: '👨‍👩‍👧‍👦',
                  title: 'ADN huyết thống trực hệ',
                  desc: 'Cha – Con, Mẹ – Con',
                },
                {
                  icon: '📋',
                  title: 'ADN phục vụ làm giấy khai sinh',
                  desc: 'Hỗ trợ thủ tục pháp lý',
                },
                {
                  icon: '⚖️',
                  title: 'ADN hỗ trợ các thủ tục pháp lý',
                  desc: 'Đảm bảo tính chính xác cao',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 group "
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Enhanced Form tư vấn */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                💬 Nhận tư vấn miễn phí
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Nhập số điện thoại của bạn"
                  value={consultation.phone}
                  name="phone"
                  onChange={handleInput}
                  className="flex-grow px-6 py-4 text-gray-700 placeholder-gray-400 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-transparent shadow-lg"
                />
                <input
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={consultation.name}
                  name="name"
                  onChange={handleInput}
                  className="flex-grow px-6 py-4 text-gray-700 placeholder-gray-400 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-transparent shadow-lg"
                />
                <form onSubmit={handleSubmit}>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 whitespace-nowrap"
                  >
                    Tư vấn ngay
                  </button>
                </form>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Chúng tôi sẽ liên hệ với bạn trong vòng 30 phút
              </p>
            </div>
          </div>

          {/* Hình ảnh bên phải với enhanced styling */}
          <div className="lg:w-1/3 flex items-center justify-center">
            <div className="relative group">
              <div className="absolute -inset-6 bg-white/20 rounded-3xl blur-2xl group-hover:bg-white/30 transition duration-300"></div>
              <img
                src={doctor}
                alt="Phòng xét nghiệm ADN"
                className="relative w-full h-160 object-cover rounded-3xl shadow-2xl  transition-transform duration-300 border-4 border-white/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Enhanced với hover effects và icons */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto rounded-3xl my-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text">
            Dịch vụ nổi bật
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mx-auto"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá các dịch vụ xét nghiệm ADN hàng đầu của chúng tôi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          {services.map(({ title, desc, icon }, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-3xl bg-white text-gray-800 shadow-lg hover:shadow-2xl transform  hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-teal-100 mb-6 shadow-lg group-hover:shadow-blue-200 group-hover:scale-110 transition-all duration-300">
                  <div className="text-2xl text-blue-600 group-hover:text-blue-700 transition-colors">
                    {icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-700 transition-colors">
                  {title}
                </h3>

                <p className="text-gray-600 flex-grow leading-relaxed group-hover:text-gray-700 transition-colors">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose GeneLink Section - Enhanced */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-8">
        <section className="py-20">
          {/* Header */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text">
              Vì sao chọn GeneLink
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mx-auto"></div>
          </div>

          {/* Reasons grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {reasons.map(({ icon, text, desc }, i) => (
              <div
                key={i}
                className="group flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl border border-white/50 hover:border-blue-200 transition-all duration-500  hover:-translate-y-2"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {icon}
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-4 group-hover:text-blue-700 transition-colors">
                  {text}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* Team Section Header */}
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text">
              Đội ngũ chuyên gia
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mx-auto"></div>
          </div>

          {/* Interactive images grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {imageData.map((image, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative overflow-hidden rounded-2xl shadow-lg h-[350px] cursor-pointer transition-all duration-500  hover:shadow-2xl group ${
                  selectedImage === index
                    ? 'ring-4 ring-blue-500 ring-opacity-60 scale-105 shadow-2xl'
                    : ''
                }`}
              >
                <img
                  src={image.src}
                  alt={image.desc}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm font-semibold drop-shadow-lg">
                    {image.desc}
                  </p>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm">+</span>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Panel */}
          {selectedImage !== null && (
            <div className="fixed top-0 right-0 w-full md:w-1/2 h-full bg-white/95 backdrop-blur-md z-50 shadow-2xl transition-transform duration-500 transform translate-x-0 overflow-y-auto flex flex-col justify-between border-l border-gray-200">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-teal-50">
                <h2 className="text-xl font-bold text-gray-800">
                  Thông tin chi tiết
                </h2>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-white hover:bg-red-500 rounded-full text-2xl font-bold transition-all duration-300 hover:scale-110"
                  title="Đóng"
                >
                  ×
                </button>
              </div>

              {/* Nội dung chia 2 bên */}
              <div className="p-8 flex-1">
                <div className="flex flex-col lg:flex-row gap-8 h-full">
                  {/* Bên trái: ảnh */}
                  <div className="lg:w-1/2 flex justify-center">
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                      <img
                        src={imageData[selectedImage].src}
                        alt={`Chi tiết - ${imageData[selectedImage].desc}`}
                        className="relative h-[400px] w-full object-cover rounded-2xl shadow-2xl"
                      />
                    </div>
                  </div>

                  {/* Bên phải: giới thiệu */}
                  <div className="lg:w-1/2 flex items-center">
                    <div className="text-gray-800 space-y-6 bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-200">
                      <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text">
                        {imageData[selectedImage].desc}
                      </h3>
                      <div className="text-gray-700 leading-relaxed space-y-4">
                        {imageData[selectedImage].content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nút đóng ở dưới */}
              <div className="p-6 flex justify-end border-t border-gray-200 bg-gradient-to-r from-blue-50 to-teal-50">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transform  transition-all duration-300"
                >
                  ✕ Đóng
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* News Section - Enhanced */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text">
            Tin tức mới nhất
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mx-auto"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Cập nhật những thông tin mới nhất về công nghệ xét nghiệm ADN
          </p>
        </div>

        <div className="relative">
          {/* Enhanced Swiper Buttons */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 -left-12 z-10 w-12 h-12 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-teal-700 hover:to-blue-700 transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
            aria-label="Previous slide"
          >
            <span className="text-xl">‹</span>
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 -right-12 z-10 w-12 h-12 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-teal-700 hover:to-blue-700 transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
            aria-label="Next slide"
          >
            <span className="text-xl">›</span>
          </button>

          <Swiper
            ref={swiperRef}
            modules={[Autoplay, Scrollbar]}
            spaceBetween={32}
            slidesPerView={3}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            scrollbar={{ draggable: true, el: '.swiper-scrollbar' }}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="rounded-3xl pb-12"
          >
            {newsData.map(({ title, desc, date }, i) => (
              <SwiperSlide key={i} className="group">
                <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl cursor-pointer transform hover:-translate-y-2 transition-all duration-500 border border-gray-100 h-full flex flex-col">
                  {/* News icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300">
                    <span className="text-2xl">📰</span>
                  </div>

                  <h3 className="font-bold mb-4 text-xl text-gray-800 group-hover:text-teal-700 transition-colors line-clamp-2">
                    {title}
                  </h3>

                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed group-hover:text-gray-700 transition-colors line-clamp-3">
                    {desc}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-400 group-hover:text-gray-500 transition-colors">
                      {date}
                    </span>
                    <span className="text-teal-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Đọc thêm →
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom scrollbar */}
          <div className="swiper-scrollbar mt-8 bg-gray-200 rounded-full h-2"></div>
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
