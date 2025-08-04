/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { FaEye, FaSearch, FaCalendarAlt, FaUser, FaFlask } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CheckHistoryAppointment = () => {
  const [phone, setPhone] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!phone) return;

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8080/api/appointment/get-appointment-by-phone?phone=${phone}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const combinedAppointments = [
          ...(data.allAppointmentAtCenterResponse || []),
          ...(data.allAppointmentAtHomeResponse || []),
        ];
        setHistory(combinedAppointments);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Lỗi khi fetch dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const completedAppointments = history.filter(
    (item) => item.showAppointmentResponse?.appointmentStatus === 'COMPLETED'
  );

  const getGenderText = (gender: string) => {
    return gender === 'MALE' ? 'Nam' : gender === 'FEMALE' ? 'Nữ' : gender;
  };

  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case 'AT_CENTER':
        return 'bg-blue-100 text-blue-800';
      case 'AT_HOME':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-full">
      {/* Search Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaSearch className="text-blue-600" />
          Tra cứu lịch sử đặt lịch bằng số điện thoại
        </h4>
        
        <div className="flex gap-3 items-end">
          <div className="flex-1 max-w-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="text"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={fetchData}
            disabled={loading || !phone}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
          >
            <FaSearch className="w-4 h-4" />
            {loading ? 'Đang tải...' : 'Tra cứu'}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {completedAppointments.length > 0 ? (
          completedAppointments.map((item: any, index: number) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FaCalendarAlt className="text-blue-600 w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold text-gray-800">
                        Lịch hẹn #{item.showAppointmentResponse?.appointmentId}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {new Date(item.showAppointmentResponse?.appointmentDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                      {item.showAppointmentResponse?.appointmentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h6 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-500 w-4 h-4" />
                      Thông tin cơ bản
                    </h6>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Ngày hẹn:</span>
                        <span className="text-sm font-medium text-gray-800">
                          {new Date(item.showAppointmentResponse?.appointmentDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Trạng thái:</span>
                        <span className="text-sm font-medium text-gray-800">
                          {item.showAppointmentResponse?.appointmentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Ghi chú:</span>
                        <span className="text-sm font-medium text-gray-800">
                          {item.showAppointmentResponse?.note || 'Không có'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <h6 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaFlask className="text-gray-500 w-4 h-4" />
                      Dịch vụ ({item.serviceAppointmentResponses?.length || 0})
                    </h6>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-32 overflow-y-auto">
                      <div className="space-y-2">
                        {item.serviceAppointmentResponses?.map((svc: any, svcIndex: number) => (
                          <div key={svc.serviceId || svcIndex} className="flex items-start gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-800">{svc.serviceName}</span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getServiceTypeColor(svc.serviceType)}`}>
                                  {svc.serviceType === 'AT_CENTER' ? 'Tại trung tâm' : 'Tại nhà'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">{svc.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patients Table */}
                {item.patientAppointmentResponse && item.patientAppointmentResponse.length > 0 && (
                  <div className="mb-6">
                    <h6 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FaUser className="text-gray-500 w-4 h-4" />
                      Bệnh nhân ({item.patientAppointmentResponse.length})
                    </h6>
                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                              Họ tên
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                              Ngày sinh
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                              Giới tính
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Mối quan hệ
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {item.patientAppointmentResponse.map((p: any, pIndex: number) => (
                            <tr key={p.patientId || pIndex} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-800 border-r border-gray-200">
                                {p.fullName}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                                {p.dateOfBirth}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                                {getGenderText(p.gender)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {p.relationship}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Kit Information */}
                {item.kitAppointmentResponse && (
                  <div className="mb-6">
                    <h6 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FaFlask className="text-gray-500 w-4 h-4" />
                      Thông tin Kit
                    </h6>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Mã Kit:</span>
                            <span className="text-sm font-medium text-gray-800">
                              {item.kitAppointmentResponse.kitCode}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Tên Kit:</span>
                            <span className="text-sm font-medium text-gray-800">
                              {item.kitAppointmentResponse.kitName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Số lượng:</span>
                            <span className="text-sm font-medium text-gray-800">
                              {item.kitAppointmentResponse.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Số người xét nghiệm:</span>
                            <span className="text-sm font-medium text-gray-800">
                              {item.kitAppointmentResponse.targetPersonCount}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Nội dung:</span>
                            <p className="text-sm font-medium text-gray-800 mt-1">
                              {item.kitAppointmentResponse.contents}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {item.kitAppointmentResponse && (
                  <div className="flex justify-end">
                    <button
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                      onClick={() => navigate(`/result/${item.showAppointmentResponse?.appointmentId}`)}
                    >
                      <FaEye className="mr-2 w-4 h-4" />
                      Xem kết quả
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có dữ liệu</h3>
              <p className="text-gray-500">
                {phone ? 'Không tìm thấy lịch hẹn nào với số điện thoại này.' : 'Vui lòng nhập số điện thoại để tra cứu.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckHistoryAppointment;