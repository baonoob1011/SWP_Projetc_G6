/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Plus,
  User,
  TestTube,
  Mail,
  CheckSquare,
  FileText,
  ArrowRight,
  Shield,
  Award,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
type PriceItem = {
  time: string;
  price: number;
};

type ServiceResponse = {
  sampleCollectionMethods: string[];
};

type ServiceItem = {
  serviceRequest: {
    serviceId: number;
    serviceName: string;
    description: string;
    serviceType: string;
    image?: string;
  };
  priceListRequest: PriceItem[];
  serviceResponses: ServiceResponse[];
};

const translateServiceType = (type: string): string => {
  switch (type) {
    case 'CIVIL':
      return 'Dân sự';
    case 'LEGAL':
      return 'Pháp lý';
    case 'IMMIGRATION':
      return 'Di trú';
    default:
      return type;
  }
};

const CivilServiceList = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const { hash } = useLocation();

  useEffect(() => {
    if (hash === '#civil-service-list') {
      const el = document.getElementById('civil-service-list');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/services/get-all-civil-service'
        );
        if (!response.ok) {
          toast.error('lỗi kết nối');
        }
        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // if (loading)
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
  //       <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
  //         <div className="text-lg font-medium text-gray-700">
  //           Đang tải danh sách dịch vụ...
  //         </div>
  //       </div>
  //     </div>
  //   );

  // if (error)
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
  //       <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-red-500">
  //         <div className="text-red-700 font-medium">Lỗi: {error}</div>
  //       </div>
  //     </div>
  //   );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600">
        {/* Overlay mờ nhẹ để làm sâu màu hơn */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Decorative elements với opacity thấp hơn */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-36 -translate-y-36"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-48 translate-y-48"></div>

        <div className="relative container mx-auto px-4 py-16">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-6 mt-25">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-700 rounded-xl transform rotate-12 flex items-center justify-center shadow-lg">
                  <TestTube className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Dịch Vụ GeneLink
                  </h1>
                  <p className="text-gray-200 text-lg font-medium">
                    Xét Nghiệm ADN Dân Sự
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-gray-200">
                <div className="flex items-center space-x-1">
                  <Shield className="w-5 h-5" />
                  <span>Chính xác 99.9%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-5 h-5" />
                  <span>ISO 17025</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <TestTube className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex">
            <button className="px-8 py-4 text-gray-600 bg-gray-50 border-r font-medium hover:bg-gray-100 transition-colors">
              Xét Nghiệm ADN Hành chính
            </button>
            <button className="px-8 py-4 text-white bg-gradient-to-r from-sky-400 to-cyan-400 font-medium shadow-md">
              Xét Nghiệm ADN Dân sự
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Introduction Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent mb-4 flex items-center justify-center">
              <span className="mr-3 text-sky-500">✓</span>
              Xét Nghiệm ADN Dân Sự
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-cyan-400 mx-auto rounded-full"></div>
          </div>

          <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-2xl p-8 border border-sky-100 shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-sky-600 mb-4 flex items-center">
              <span className="mr-3 text-2xl">🎯</span>
              Tầm Quan Về Xét Nghiệm ADN
            </h3>
            <p className="text-sky-700 font-medium mb-4">
              Xét nghiệm ADN là gì?
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Xét nghiệm ADN (DNA test) là phương pháp phân tích thông tin di
              truyền trong ADN của mỗi người nhằm xác định mối quan hệ huyết
              thống, cảnh báo cá nhân, hoặc phát hiện nguy cơ bệnh lý di truyền.
              ADN (Acid Deoxyribonucleic) là vật chất di truyền có trong mọi tế
              bào sống, mang thông tin đặc trưng duy nhất của cơ thể.
            </p>
          </div>
        </div>

        {/* Service Types Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-sky-300 to-cyan-300 rounded-xl flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-sky-600">
                Xét nghiệm ADN tự nguyện
              </h3>
            </div>
            <p className="text-gray-600 mb-4 font-medium">
              Nhằm xác định mối quan hệ:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Cha/mẹ-con',
                'Ông/bà-cháu',
                'Anh/chị-em',
                'Họ hàng nội ngoại',
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 p-3 bg-sky-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                  <span className="text-gray-700 text-sm font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 ">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-xl flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-cyan-600">
                Xét nghiệm ADN hành chính
              </h3>
            </div>
            <div className="space-y-3">
              {[
                'Làm giấy khai sinh',
                'Thủ tục nhận người thân',
                'Xác nhận trách nhiệm cấp dưỡng sau ly hôn',
                'Phân chia tài sản thừa kế',
                'Các thủ tục pháp lý khác',
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 p-3 bg-cyan-50 rounded-lg"
                >
                  <ArrowRight className="w-4 h-4 text-cyan-500" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sample Types Section */}
        <div className="bg-gradient-to-r from-sky-200 to-cyan-200 rounded-2xl p-6 mb-16 text-gray-900 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center mr-4 ring-2 ring-cyan-300 shadow-md">
              {/* Tăng size, đổi màu và thêm ring */}
              <TestTube className="w-8 h-8 text-cyan-600" />
            </div>
            Các loại mẫu sử dụng để xét nghiệm ADN
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-5">
              <h4 className="text-xl font-semibold mb-3 text-gray-800">
                Mẫu thông thường
              </h4>
              <p className="leading-relaxed text-gray-700">
                Máu mao, niêm mạc miệng, tóc có chân, móng tay/móng chân, cuống
                rốn
              </p>
            </div>
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-5">
              <h4 className="text-xl font-semibold mb-3 text-gray-800">
                Mẫu đặc biệt
              </h4>
              <p className="leading-relaxed text-gray-700">
                Xương, răng, đầu lọc thuốc lá, bàn chải đánh răng, kẹo cao su,
                bao cao su, quần lót
              </p>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-gray-100">
          <h3 className="text-2xl font-bold text-center mb-12 text-gray-800">
            Quy trình xét nghiệm ADN tại GenLink
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-15">
            {[
              {
                icon: User,
                title: 'Tư vấn lựa chọn',
                subtitle: 'dịch vụ',
                color: 'from-sky-300 to-sky-400',
              },
              {
                icon: TestTube,
                title: 'Thu mẫu xét',
                subtitle: 'nghiệm theo hướng dẫn',
                color: 'from-cyan-300 to-cyan-400',
              },
              {
                icon: Mail,
                title: 'Chuyển mẫu đến',
                subtitle: 'cơ sở',
                color: 'from-blue-300 to-blue-400',
              },
              {
                icon: CheckSquare,
                title: 'Cơ sở phân tích',
                subtitle: 'mẫu',
                color: 'from-sky-400 to-cyan-400',
              },
              {
                icon: FileText,
                title: 'GenLink trả kết',
                subtitle: 'quả',
                color: 'from-cyan-400 to-blue-400',
              },
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">
                  {step.title}
                </h4>
                <p className="text-xs text-gray-600">{step.subtitle}</p>
                {index < 4 && (
                  <ArrowRight className="w-6 h-6 text-gray-300 mx-auto mt-4 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Service List Section - REDESIGNED */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 rounded-3xl shadow-2xl p-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/5 rounded-full translate-x-32 -translate-y-32"></div>

          <div className="relative z-10">
            {/* Thêm id ở đây */}
            <div id="civil-service-list" className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Danh sách dịch vụ dân sự
              </h2>
              <p className="text-gray-200 text-lg">
                Chọn dịch vụ phù hợp với nhu cầu của bạn
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-300 to-cyan-300 mx-auto mt-4 rounded-full"></div>
            </div>

            {services.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TestTube className="w-12 h-12 text-blue-200" />
                </div>
                <p className="text-gray-200 text-lg">Không có dịch vụ nào.</p>
              </div>
            ) : (
              <div>
                {/* Services Display */}
                <div className="space-y-8 mb-12">
                  {services
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((service, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                      >
                        <div className="flex flex-col lg:flex-row">
                          {/* Image Section - Vertical on mobile, side on desktop */}
                          {service.serviceRequest.image && (
                            <div className="lg:w-2/5 lg:flex-shrink-0 relative overflow-hidden">
                              <img
                                src={`data:image/*;base64,${service.serviceRequest.image}`}
                                className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                alt={service.serviceRequest.serviceName}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/10 to-transparent"></div>
                            </div>
                          )}

                          {/* Content Section */}
                          <div className="flex-1 p-8 lg:p-10">
                            <div className="flex flex-col h-full">
                              {/* Header */}
                              <div className="mb-6">
                                <h3 className="text-2xl lg:text-3xl font-bold text-blue-600 mb-4">
                                  {service.serviceRequest.serviceName}
                                </h3>

                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                  <div className="flex items-center bg-blue-100 px-4 py-2 rounded-full">
                                    <span className="text-sm font-medium text-gray-600 mr-2">
                                      Loại dịch vụ:
                                    </span>
                                    <span className="text-sm font-bold text-blue-700">
                                      {translateServiceType(
                                        service.serviceRequest.serviceType
                                      )}
                                    </span>
                                  </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">
                                  <h4 className="text-sm font-bold text-gray-700 mb-2">
                                    Mô tả dịch vụ:
                                  </h4>
                                  <p className="text-gray-600 leading-relaxed">
                                    {service.serviceRequest.description ||
                                      'Không có mô tả'}
                                  </p>
                                </div>
                              </div>

                              {/* Pricing and Action Section */}
                              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mt-auto">
                                {/* Pricing */}
                                <div className="flex-1">
                                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                    <div className="w-5 h-5 bg-blue-400 rounded-full mr-3"></div>
                                    Bảng giá dịch vụ
                                  </h4>
                                  <div className="grid gap-3">
                                    {service.priceListRequest.map(
                                      (item, idx) => (
                                        <div
                                          key={idx}
                                          className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border-l-4 border-blue-400"
                                        >
                                          <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                              <span className="text-sm font-medium text-gray-600">
                                                ⏱️ {item.time}
                                              </span>
                                            </div>
                                            <div className="text-right">
                                              <div className="text-2xl font-bold text-blue-600">
                                                {item.price.toLocaleString()}{' '}
                                                <span className="text-sm text-gray-500">
                                                  VNĐ
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>

                                {/* Action Button */}
                                <div className="flex-shrink-0">
                                  <Button
                                    variant="contained"
                                    component={NavLink}
                                    to={`/order-civil/${service.serviceRequest.serviceId}`}
                                    state={{ price: service.priceListRequest }}
                                    sx={{
                                      background:
                                        'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
                                      color: 'white',
                                      padding: '16px 40px',
                                      borderRadius: '16px',
                                      fontWeight: 'bold',
                                      fontSize: '1.1rem',
                                      boxShadow:
                                        '0 8px 24px rgba(37, 99, 235, 0.3)',
                                      '&:hover': {
                                        background:
                                          'linear-gradient(45deg, #1d4ed8 30%, #2563eb 90%)',
                                        transform: 'scale(1.05)',
                                        boxShadow:
                                          '0 12px 32px rgba(37, 99, 235, 0.4)',
                                      },
                                      transition: 'all 0.3s ease',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '12px',
                                      minWidth: '200px',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <Plus size={24} />
                                    Đặt lịch ngay
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Pagination */}
                {services.length > itemsPerPage && (
                  <div className="flex justify-center items-center space-x-4">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
                    >
                      ← Trang trước
                    </button>

                    <div className="flex space-x-2">
                      {Array.from(
                        { length: Math.ceil(services.length / itemsPerPage) },
                        (_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-12 h-12 rounded-xl font-bold transition-all duration-200 ${
                              currentPage === i + 1
                                ? 'bg-white text-blue-600 shadow-lg'
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                          >
                            {i + 1}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            prev + 1,
                            Math.ceil(services.length / itemsPerPage)
                          )
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(services.length / itemsPerPage)
                      }
                      className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
                    >
                      Trang sau →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CivilServiceList;
