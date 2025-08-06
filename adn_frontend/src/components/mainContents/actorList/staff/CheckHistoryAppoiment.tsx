/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { FaEye } from 'react-icons/fa';
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

  const translate = (status: string) => {
    switch (status) {
      case 'CIVIL':
        return 'Dân sự';
      case 'ADMINISTRATIVE':
        return 'Hành chính';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-full">
        {/* Search Header */}
        <div className="bg-[#405EF3] rounded-lg p-6 mb-6 relative">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-white text-lg font-semibold">
              Tra cứu lịch sử đặt lịch bằng số điện thoại
            </h2>
          </div>
          <div className="flex gap-3 mt-4">
            <input
              type="text"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
              style={{ maxWidth: '300px' }}
            />
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-6 py-2 bg-white text-[#405EF3] rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang tải...' : 'Tra cứu'}
            </button>
          </div>
        </div>

        {/* Results Table */}
        {completedAppointments.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Expandable Details for Each Row */}
            <div className="border-t border-gray-200">
              {completedAppointments.map((item: any, index: number) => (
                <div
                  key={`details-${index}`}
                  className="p-6 border-b border-gray-100 bg-gray-50"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Services Section */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h6 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Dịch vụ
                      </h6>
                      <div className="space-y-2">
                        {item.serviceAppointmentResponses?.map((svc: any) => (
                          <div
                            key={svc.serviceId}
                            className="p-2 bg-gray-50 rounded border"
                          >
                            <div className="font-medium text-sm text-gray-800">
                              {svc.serviceName}
                            </div>
                            <div className="text-xs text-gray-600">
                              {svc.description} ({translate(svc.serviceType)})
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Patients Section */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h6 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                          />
                        </svg>
                        Bệnh nhân
                      </h6>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-2 py-1 text-left font-medium text-gray-600">
                                Họ tên
                              </th>
                              <th className="px-2 py-1 text-left font-medium text-gray-600">
                                Ngày sinh
                              </th>
                              <th className="px-2 py-1 text-left font-medium text-gray-600">
                                Giới tính
                              </th>
                              <th className="px-2 py-1 text-left font-medium text-gray-600">
                                Mối quan hệ
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {item.patientAppointmentResponse?.map((p: any) => (
                              <tr key={p.patientId}>
                                <td className="px-2 py-1 text-gray-800">
                                  {p.fullName}
                                </td>
                                <td className="px-2 py-1 text-gray-600">
                                  {p.dateOfBirth}
                                </td>
                                <td className="px-2 py-1 text-gray-600">
                                  {p.gender}
                                </td>
                                <td className="px-2 py-1 text-gray-600">
                                  {p.relationship}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Kit Information Section */}
                    {item.kitAppointmentResponse && (
                      <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-gray-200">
                        <h6 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-purple-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                          Thông tin Kit
                        </h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="text-xs text-gray-600">Mã Kit</div>
                            <div className="font-medium text-sm text-gray-800">
                              {item.kitAppointmentResponse.kitCode}
                            </div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="text-xs text-gray-600">Tên Kit</div>
                            <div className="font-medium text-sm text-gray-800">
                              {item.kitAppointmentResponse.kitName}
                            </div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="text-xs text-gray-600">
                              Nội dung
                            </div>
                            <div className="font-medium text-sm text-gray-800">
                              {item.kitAppointmentResponse.contents}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                    onClick={() =>
                      navigate(
                        `/result/${item.showAppointmentResponse?.appointmentId}`
                      )
                    }
                  >
                    <FaEye className="mr-2" />
                    Xem kết quả
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <svg
                className="w-12 h-12 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-500 text-lg">Không có dữ liệu lịch sử</p>
              <p className="text-gray-400 text-sm mt-1">
                Vui lòng nhập số điện thoại để tra cứu
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckHistoryAppointment;
