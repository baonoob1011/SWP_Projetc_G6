import React, { useEffect, useState } from 'react';
import { Plus, User, TestTube, Mail, CheckSquare, FileText, ArrowRight, Shield, Award, Clock, Phone } from 'lucide-react';

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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/services/get-all-civil-service'
        );
        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu dịch vụ');
        }
        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
          <div className="text-lg font-medium text-gray-700">Đang tải danh sách dịch vụ...</div>
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/90 to-cyan-400/90"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-36 -translate-y-36"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-xl transform rotate-12 flex items-center justify-center shadow-lg">
                  <TestTube className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Dịch Vụ GenLink</h1>
                  <p className="text-sky-50 text-lg font-medium">Xét Nghiệm ADN Dân Sự Chuyên Nghiệp</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sky-50">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Chính xác 99.9%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>ISO 17025</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Kết quả trong 5-7 ngày</span>
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
            <p className="text-sky-700 font-medium mb-4">Xét nghiệm ADN là gì?</p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Xét nghiệm ADN (DNA test) là phương pháp phân tích thông tin di truyền trong ADN của mỗi người nhằm xác định 
              mối quan hệ huyết thống, cảnh báo cá nhân, hoặc phát hiện nguy cơ bệnh lý di truyền. ADN (Acid Deoxyribonucleic) 
              là vật chất di truyền có trong mọi tế bào sống, mang thông tin đặc trưng duy nhất của cơ thể.
            </p>
          </div>
        </div>

        {/* Service Types Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-sky-300 to-cyan-300 rounded-xl flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-sky-600">Xét nghiệm ADN tự nguyện</h3>
            </div>
            <p className="text-gray-600 mb-4 font-medium">Nhằm xác định mối quan hệ:</p>
            <div className="grid grid-cols-2 gap-3">
              {['Cha/mẹ-con', 'Ông/bà-cháu', 'Anh/chị-em', 'Họ hàng nội ngoại'].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 p-3 bg-sky-50 rounded-lg">
                  <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                  <span className="text-gray-700 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-xl flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-cyan-600">Xét nghiệm ADN hành chính</h3>
            </div>
            <div className="space-y-3">
              {[
                'Làm giấy khai sinh',
                'Thủ tục nhận người thân', 
                'Xác nhận trách nhiệm cấp dưỡng sau ly hôn',
                'Phân chia tài sản thừa kế',
                'Các thủ tục pháp lý khác'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-3 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors">
                  <ArrowRight className="w-4 h-4 text-cyan-500" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sample Types Section */}
        <div className="bg-gradient-to-r from-sky-400 to-cyan-400 rounded-2xl p-8 mb-16 text-white shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-4">
              <TestTube className="w-6 h-6" />
            </div>
            Các loại mẫu sử dụng để xét nghiệm ADN
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-4 text-sky-50">Mẫu thông thường</h4>
              <p className="text-sky-50 leading-relaxed">
                Máu mau, niêm mạc miệng, tóc có chân, móng tay/móng chân, cuống rốn
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-4 text-sky-50">Mẫu đặc biệt</h4>
              <p className="text-sky-50 leading-relaxed">
                Xương, răng, đầu lọc thuốc lá, bàn chải đánh răng, kẹo cao su, bao cao su, quần lót
              </p>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-gray-100">
          <h3 className="text-2xl font-bold text-center mb-12 text-gray-800">
            Quy trình xét nghiệm ADN tại GenLink
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { icon: User, title: 'Tư vấn lựa chọn', subtitle: 'dịch vụ', color: 'from-sky-300 to-sky-400' },
              { icon: TestTube, title: 'Thu mẫu xét', subtitle: 'nghiệm theo hướng dẫn', color: 'from-cyan-300 to-cyan-400' },
              { icon: Mail, title: 'Chuyển mẫu đến', subtitle: 'cơ sở', color: 'from-blue-300 to-blue-400' },
              { icon: CheckSquare, title: 'Cơ sở phân tích', subtitle: 'mẫu', color: 'from-sky-400 to-cyan-400' },
              { icon: FileText, title: 'GenLink trả kết', subtitle: 'quả', color: 'from-cyan-400 to-blue-400' }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">{step.title}</h4>
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
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-cyan-500/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/5 rounded-full translate-x-32 -translate-y-32"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Danh sách dịch vụ dân sự</h2>
              <p className="text-gray-300 text-lg">Chọn dịch vụ phù hợp với nhu cầu của bạn</p>
              <div className="w-32 h-1 bg-gradient-to-r from-sky-300 to-cyan-300 mx-auto mt-4 rounded-full"></div>
            </div>
            
            {services.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TestTube className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg">Không có dịch vụ nào.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
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
                      <h3 className="text-xl font-bold text-sky-600 mb-4 text-center">
                        {service.serviceRequest.serviceName}
                      </h3>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-600">Loại dịch vụ:</span>
                          <span className="text-sm font-bold text-gray-800 bg-sky-100 px-3 py-1 rounded-full">
                            {translateServiceType(service.serviceRequest.serviceType)}
                          </span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-600 block mb-2">Mô tả:</span>
                          <span className="text-sm text-gray-800 leading-relaxed">
                            {service.serviceRequest.description || 'Không có mô tả'}
                          </span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                          <div className="w-4 h-4 bg-sky-400 rounded-full mr-2"></div>
                          Bảng giá dịch vụ
                        </h4>
                        <div className="space-y-2">
                          {service.priceListRequest.map((item, idx) => (
                            <div key={idx} className="bg-gradient-to-r from-sky-50 to-cyan-50 p-4 rounded-xl border border-sky-100">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium text-gray-700">⏱️ {item.time}</div>
                                  <div className="text-2xl font-bold text-sky-600">
                                    {item.price.toLocaleString()} <span className="text-sm">VNĐ</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-center">
                        <a
                          href={`/order/${service.serviceRequest.serviceId}`}
                          className="inline-flex items-center space-x-3 bg-gradient-to-r from-sky-400 to-cyan-400 text-white px-8 py-4 rounded-xl hover:from-sky-500 hover:to-cyan-500 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <Plus size={20} />
                          <span>Đặt lịch tại cơ sở</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-sky-400 to-cyan-400 rounded-2xl p-8 text-white">
            <Phone className="w-16 h-16 mx-auto mb-4 text-sky-100" />
            <h3 className="text-2xl font-bold mb-2">Cần tư vấn thêm?</h3>
            <p className="text-sky-50 mb-6">Liên hệ hotline để được hỗ trợ 24/7</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:1900xxxx" className="bg-white text-sky-600 px-6 py-3 rounded-lg font-bold hover:bg-sky-50 transition-colors">
                📞 1900 xxxx
              </a>
              <a href="mailto:info@genlink.vn" className="bg-sky-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-sky-400 transition-colors">
                ✉️ info@genlink.vn
              </a>
            </div>
          </div>
        </div>

      </div>

      
    </div>
  );
};

export default CivilServiceList;