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

<<<<<<< Updated upstream
const translateSampleMethod = (method: string): string => {
  switch (method) {
    case 'AT_HOME':
      return 'Tại nhà';
    case 'AT_CLINIC':
      return 'Tại phòng khám';
    default:
      return method;
  }
};

=======
>>>>>>> Stashed changes
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <div className="text-lg font-medium text-gray-700">Đang tải danh sách dịch vụ...</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-red-500">
          <div className="text-red-700 font-medium">Lỗi: {error}</div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
    {/* Clean Header */}
<div className="bg-blue-200 shadow-sm border-b mt-25">
  <div className="container mx-auto px-6 py-8">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
          <TestTube className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GENELINK</h1>
          <p className="text-gray-600">Xét Nghiệm ADN Dân Sự</p>
        </div>
      </div>
      <div className="hidden lg:flex items-center space-x-8 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-green-500" />
          <span>Chính xác 99.9%</span>
        </div>
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-blue-500" />
          <span>ISO 17025</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-orange-500" />
          <span>Kết quả trong 5-7 ngày</span>
        </div>
      </div>
    </div>
  </div>
</div>


<<<<<<< Updated upstream
                  <div className="mb-2">
                    <strong>Phương pháp lấy mẫu:</strong>
                    {service.serviceResponses?.[0]?.sampleCollectionMethods
                      .length ? (
                      service.serviceResponses[0].sampleCollectionMethods.map(
                        (method, idx) => (
                          <div key={idx}>
                            <small>{translateSampleMethod(method)}</small>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-muted mb-1">Không có dữ liệu</p>
                    )}
                  </div>

                  <div className="mt-auto text-center">
                    <NavLink
                      to={`/order/${service.serviceRequest.serviceId}`}
                      className="btn btn-outline-danger btn-sm"
                    >
                      <Plus size={14} className="me-1" />
                      Đặt dịch vụ
                    </NavLink>
                  </div>
                </div>
=======
      {/* Simple Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="flex">
            <button className="px-6 py-3 text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors">
              Xét Nghiệm ADN Hành chính
            </button>
            <button className="px-6 py-3 text-blue-600 border-b-2 border-blue-500 font-medium">
              Xét Nghiệm ADN Dân sự
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        
        {/* Clean Introduction */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Xét Nghiệm ADN Dân Sự
            </h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              TỔNG QUAN VỀ XÉT NGHIỆM ADN
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Xét nghiệm ADN là gì?</h4>
                <p className="text-gray-600 leading-relaxed">
                  Xét nghiệm ADN (DNA test) là phương pháp phân tích thông tin di truyền trong ADN của mỗi người nhằm xác định 
                  mối quan hệ huyết thống, cảnh báo cá nhân, hoặc phát hiện nguy cơ bệnh lý di truyền. ADN (Acid Deoxyribonucleic) 
                  là vật chất di truyền có trong mọi tế bào sống, mang thông tin đặc trưng duy nhất của cơ thể.
                </p>
>>>>>>> Stashed changes
              </div>
            </div>
          </div>
        </div>

        {/* Clean Service Types */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-sm border p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Xét nghiệm ADN dân sự</h3>
            </div>
            <p className="text-gray-600 mb-6 font-medium">Nhằm xác định mối quan hệ:</p>
            <div className="grid grid-cols-2 gap-4">
              {['Cha/mẹ-con', 'Ông/bà-cháu', 'Anh/chị-em', 'Họ hàng nội ngoại'].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Xét nghiệm ADN hành chính</h3>
            </div>
            <div className="space-y-3">
              {[
                'Làm giấy khai sinh',
                'Thủ tục nhận người thân', 
                'Xác nhận trách nhiệm cấp dưỡng sau ly hôn',
                'Phân chia tài sản thừa kế',
                'Các thủ tục pháp lý khác'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <ArrowRight className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Clean Sample Types */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-16">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <TestTube className="w-4 h-4 text-purple-600" />
            </div>
            Các loại mẫu sử dụng để xét nghiệm ADN
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Mẫu thông thường</h4>
              <p className="text-gray-600 leading-relaxed">
                Máu mau, niêm mạc miệng, tóc có chân, móng tay/móng chân, cuống rốn
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Mẫu đặc biệt</h4>
              <p className="text-gray-600 leading-relaxed">
                Xương, răng, đầu lọc thuốc lá, bàn chải đánh răng, kẹo cao su, bao cao su, quần lót
              </p>
            </div>
          </div>
        </div>

        {/* Clean Process Steps */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Quy trình xét nghiệm ADN tại GenLink
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-15">
            {[
              { icon: User, title: 'Tư vấn lựa chọn dịch vụ', color: 'bg-blue-100 text-blue-600' },
              { icon: TestTube, title: 'Thu mẫu xét nghiệm theo hướng dẫn', color: 'bg-green-100 text-green-600' },
              { icon: Mail, title: 'Chuyển mẫu đến cơ sở', color: 'bg-purple-100 text-purple-600' },
              { icon: CheckSquare, title: 'Cơ sở phân tích mẫu', color: 'bg-orange-100 text-orange-600' },
              { icon: FileText, title: 'GenLink trả kết quả', color: 'bg-red-100 text-red-600' }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 ${step.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm leading-tight">{step.title}</h4>
                {index < 4 && (
                  <ArrowRight className="w-5 h-5 text-gray-300 mx-auto mt-4 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Clean Service List */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Danh sách dịch vụ dân sự</h2>
            <p className="text-gray-600">Chọn dịch vụ phù hợp với nhu cầu của bạn</p>
            <div className="w-20 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
          </div>
          
          {services.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TestTube className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500">Không có dịch vụ nào.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                  {service.serviceRequest.image && (
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img
                        src={`data:image/*;base64,${service.serviceRequest.image}`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        alt={service.serviceRequest.serviceName}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                      {service.serviceRequest.serviceName}
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Loại dịch vụ:</span>
                        <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                          {translateServiceType(service.serviceRequest.serviceType)}
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 block mb-2">Mô tả:</span>
                        <span className="text-sm text-gray-700 leading-relaxed">
                          {service.serviceRequest.description || 'Không có mô tả'}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        Bảng giá dịch vụ
                      </h4>
                      <div className="space-y-3">
                        {service.priceListRequest.map((item, idx) => (
                          <div key={idx} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-700">⏱️ {item.time}</div>
                                <div className="text-xl font-bold text-blue-600">
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
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm hover:shadow-md"
                      >
                        <Plus size={18} />
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
    </div>
  );
};

export default CivilServiceList;