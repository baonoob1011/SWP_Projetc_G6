import { Button } from '@mui/material';
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
  Scale,
  Building,
  Users,
  Clock,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

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
    image?: string; // base64 image
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

const AdministrativeServiceList = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/services/get-all-administrative-service'
        );
        if (!response.ok) {
          setError('Không thể lấy dữ liệu dịch vụ');
          setLoading(false);
          return;
        }
        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <div className="text-lg font-medium text-gray-700">
            Đang tải danh sách dịch vụ...
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-red-500">
          <div className="text-red-700 font-medium">Lỗi: {error}</div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600">
        {/* Overlay mờ nhẹ để làm sâu màu hơn */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Decorative elements với opacity thấp hơn */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-36 -translate-y-36"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-48 translate-y-48"></div>

        <div className="relative container mx-auto px-4 py-16">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-6 mt-25">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl transform rotate-12 flex items-center justify-center shadow-lg">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Dịch Vụ GeneLink
                  </h1>
                  <p className="text-gray-200 text-lg font-medium">
                    Xét Nghiệm ADN Hành Chính
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-gray-200">
                <div className="flex items-center space-x-1">
                  <Shield className="w-5 h-5" />
                  <span>Có giá trị pháp lý</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-5 h-5" />
                  <span>Được công nhận</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <Scale className="w-12 h-12 text-white" />
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
            <button className="px-8 py-4 text-white bg-gradient-to-r from-emerald-400 to-teal-400 font-medium shadow-md">
              Xét Nghiệm ADN Hành chính
            </button>
            <button className="px-8 py-4 text-gray-600 bg-gray-50 border-r font-medium hover:bg-gray-100 transition-colors">
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-4 flex items-center justify-center">
              <span className="mr-3 text-emerald-500">⚖️</span>
              Xét Nghiệm ADN Hành Chính
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto rounded-full"></div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100 shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-emerald-600 mb-4 flex items-center">
              <span className="mr-3 text-2xl">📋</span>
              Xét Nghiệm ADN Hành Chính Là Gì?
            </h3>
            <p className="text-emerald-700 font-medium mb-4">
              Định nghĩa và mục đích:
            </p>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Xét nghiệm ADN hành chính là loại xét nghiệm có giá trị pháp lý,
              được thực hiện theo quy trình nghiêm ngặt và có thể sử dụng làm
              bằng chứng trong các thủ tục pháp lý, hành chính. Kết quả xét
              nghiệm được các cơ quan nhà nước công nhận và có thể dùng để giải
              quyết các vấn đề về quan hệ huyết thống trong pháp luật.
            </p>

            <div className="bg-white/60 rounded-xl p-6 border-l-4 border-emerald-400">
              <h4 className="text-lg font-bold text-emerald-700 mb-3 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Khác biệt với xét nghiệm dân sự:
              </h4>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  <span>Có giá trị pháp lý, được pháp luật công nhận</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  <span>Quy trình lấy mẫu nghiêm ngặt, có giám sát</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  <span>Cần có đầy đủ giấy tờ tùy thân</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  <span>Có thể dùng làm bằng chứng tại tòa án</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Purpose Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-300 to-teal-300 rounded-xl flex items-center justify-center mr-4">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-emerald-600">
                Mục đích sử dụng
              </h3>
            </div>
            <div className="space-y-3">
              {[
                'Làm giấy khai sinh cho trẻ em',
                'Xác nhận quan hệ cha con trong thừa kế',
                'Giải quyết tranh chấp về quyền nuôi con',
                'Thủ tục nhận con nuôi có yếu tố nước ngoài',
                'Xác định trách nhiệm cấp dưỡng sau ly hôn',
                'Các thủ tục di trú, định cư',
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 p-3 bg-emerald-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-gray-700 text-sm font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow border border-gray-100 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-300 to-emerald-300 rounded-xl flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-teal-600">
                Giấy tờ cần thiết
              </h3>
            </div>
            <div className="space-y-3">
              {[
                'CMND/CCCD/Hộ chiếu (bản gốc)',
                'Giấy khai sinh (nếu có)',
                'Giấy tờ liên quan đến vụ việc',
                'Ảnh 3x4 (2 ảnh mỗi người)',
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 p-3 bg-teal-50 rounded-lg"
                >
                  <ArrowRight className="w-4 h-4 text-teal-500" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-xs">!</span>
                </div>
                <span className="font-bold text-yellow-700">
                  Lưu ý quan trọng:
                </span>
              </div>
              <p className="text-yellow-700 text-sm">
                Tất cả giấy tờ phải là bản gốc hoặc bản sao có công chứng. Người
                tham gia xét nghiệm phải có mặt trực tiếp tại cơ sở.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Requirements Section */}
        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-6 mb-16 text-gray-900 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center mr-4 ring-2 ring-emerald-300 shadow-md">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            Quy định và yêu cầu pháp lý
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5">
              <div className="flex items-center mb-3">
                <Clock className="w-6 h-6 text-emerald-600 mr-2" />
                <h4 className="text-lg font-semibold text-gray-800">
                  Thời gian
                </h4>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Kết quả xét nghiệm có giá trị vĩnh viễn, không có thời hạn sử
                dụng trong các thủ tục pháp lý.
              </p>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5">
              <div className="flex items-center mb-3">
                <Shield className="w-6 h-6 text-emerald-600 mr-2" />
                <h4 className="text-lg font-semibold text-gray-800">Bảo mật</h4>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Thông tin xét nghiệm được bảo mật tuyệt đối theo quy định pháp
                luật, chỉ cung cấp cho người có quyền.
              </p>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5">
              <div className="flex items-center mb-3">
                <Award className="w-6 h-6 text-emerald-600 mr-2" />
                <h4 className="text-lg font-semibold text-gray-800">
                  Công nhận
                </h4>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Được tất cả các cơ quan nhà nước, tòa án trong và ngoài nước
                công nhận giá trị pháp lý.
              </p>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-gray-100">
          <h3 className="text-2xl font-bold text-center mb-12 text-gray-800">
            Quy trình xét nghiệm ADN hành chính tại GenLink
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-15">
            {[
              {
                icon: User,
                title: 'Tư vấn và chuẩn bị',
                subtitle: 'giấy tờ cần thiết',
                color: 'from-emerald-300 to-emerald-400',
              },
              {
                icon: TestTube,
                title: 'Thu mẫu có giám sát',
                subtitle: 'theo quy định pháp lý',
                color: 'from-teal-300 to-teal-400',
              },
              {
                icon: Mail,
                title: 'Vận chuyển mẫu',
                subtitle: 'an toàn đến phòng lab',
                color: 'from-green-300 to-green-400',
              },
              {
                icon: CheckSquare,
                title: 'Phân tích chuyên sâu',
                subtitle: 'với công nghệ hiện đại',
                color: 'from-emerald-400 to-teal-400',
              },
              {
                icon: FileText,
                title: 'Cấp kết quả',
                subtitle: 'có giá trị pháp lý',
                color: 'from-teal-400 to-green-400',
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

        {/* Service List Section */}
        <div className="bg-gradient-to-r from-slate-700 via-gray-700 to-slate-800 rounded-3xl shadow-2xl p-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 rounded-full translate-x-32 -translate-y-32"></div>

          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Danh sách dịch vụ hành chính
              </h2>
              <p className="text-gray-300 text-lg">
                Dịch vụ xét nghiệm ADN có giá trị pháp lý
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-emerald-300 to-teal-300 mx-auto mt-4 rounded-full"></div>
            </div>

            {services.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Scale className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg">Không có dịch vụ nào.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                  >
                    {service.serviceRequest.image && (
                      <div className="relative overflow-hidden">
                        <img
                          src={`data:image/*;base64,${service.serviceRequest.image}`}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                          alt={service.serviceRequest.serviceName}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    )}
                    <div className="p-8">
                      <h3 className="text-xl font-bold text-emerald-600 mb-4 text-center">
                        {service.serviceRequest.serviceName}
                      </h3>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-600">
                            Loại dịch vụ:
                          </span>
                          <span className="text-sm font-bold text-gray-800 bg-emerald-100 px-3 py-1 rounded-full">
                            {translateServiceType(
                              service.serviceRequest.serviceType
                            )}
                          </span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-600 block mb-2">
                            Mô tả:
                          </span>
                          <span className="text-sm text-gray-800 leading-relaxed">
                            {service.serviceRequest.description ||
                              'Không có mô tả'}
                          </span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                          <div className="w-4 h-4 bg-emerald-400 rounded-full mr-2"></div>
                          Bảng giá dịch vụ
                        </h4>
                        <div className="space-y-2">
                          {service.priceListRequest.map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium text-gray-700">
                                    ⏱️ {item.time}
                                  </div>
                                  <div className="text-2xl font-bold text-emerald-600">
                                    {item.price.toLocaleString()}{' '}
                                    <span className="text-sm">VNĐ</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-center">
                        <Button
                          variant="contained"
                          component={NavLink}
                          to={`/order-administrative/${service.serviceRequest.serviceId}`}
                          state={{ price: service.priceListRequest }}
                          sx={{
                            background:
                              'linear-gradient(45deg, #10b981 30%, #14b8a6 90%)',
                            color: 'white',
                            padding: '12px 32px',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
                            '&:hover': {
                              background:
                                'linear-gradient(45deg, #059669 30%, #0d9488 90%)',
                              transform: 'scale(1.05)',
                              boxShadow: '0 12px 24px rgba(16, 185, 129, 0.4)',
                            },
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <Plus size={20} />
                          Đặt lịch
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministrativeServiceList;
