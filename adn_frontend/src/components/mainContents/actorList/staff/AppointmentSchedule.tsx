/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { Kit } from '../../type/BookingType';

const AppointmentSchedule = () => {
  const [homeSchedule, setHomeSchedule] = useState<any[]>([]);
  const [loadingHome, setLoadingHome] = useState(false);
  const [loadingRowId, setLoadingRowId] = useState<string | null>(null);
  const [isKit, setIsKit] = useState<Kit[]>([]);
  const [showKitTable, setShowKitTable] = useState(false);

  const translateCivilStatus = (status: string): string => {
    switch (status) {
      case 'CIVIL':
        return 'Dân sự';
      default:
        return status;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return 'Chờ xác nhận';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/kit/get-all-kit-staff',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!res.ok) {
        toast.error('không thể lấy danh sách Kit');
      } else {
        const data = await res.json();
        setIsKit(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchScheduleAtHome = async () => {
    const token = localStorage.getItem('token');
    setLoadingHome(true);
    try {
      const res = await fetch(
        'http://localhost:8080/api/appointment/get-appointment-at-home-by-staff',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setHomeSchedule(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingHome(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckAtHome = async (
    appointmentId: string,
    userId: string,
    serviceIds: string[]
  ) => {
    const token = localStorage.getItem('token');
    setLoadingRowId(appointmentId);
    try {
      const res = await fetch(
        `http://localhost:8080/api/appointment/confirm-appointment-at-home?appointmentId=${appointmentId}&userId=${userId}&serviceId=${serviceIds}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        toast.success('Xác nhận lịch tại nhà thành công');
        fetchScheduleAtHome();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingRowId(null);
    }
  };

  useEffect(() => {
    fetchScheduleAtHome();
  }, []);

  // Filter paid appointments
  const paidAppointments = homeSchedule
    .filter(
      (item) =>
        item.showAppointmentResponse.note === 'Đơn đăng ký đang đợi xác nhận'
    )
    .sort(
      (a, b) =>
        b.showAppointmentResponse.appointmentId -
        a.showAppointmentResponse.appointmentId
    );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-full">
        {/* Header */}
        <div className="bg-[#405EF3] rounded-lg p-6 mb-6 relative">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-white text-lg font-semibold">Danh Sách Lịch Hẹn</h2>
          </div>
          <p className="text-white/80 text-sm">
            Quản lý và xác nhận các lịch hẹn tại nhà
          </p>
        </div>

        {loadingHome ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500 text-lg">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : paidAppointments.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a2 2 0 012-2h6l2 2v4M8 7l4 4m0 0l4-4m-4 4v8" />
              </svg>
              <p className="text-gray-500 text-lg">Danh sách lịch hẹn trống</p>
              <p className="text-gray-400 text-sm mt-1">Hiện tại không có lịch hẹn nào cần xác nhận</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      STT
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      Mã lịch hẹn
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      Ngày hẹn
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      Trạng thái
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      Ghi chú
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paidAppointments.map((item: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-blue-600 font-medium border-r border-gray-200">
                      #{String(index + 1).padStart(4, '0')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200">
                      {item.showAppointmentResponse?.appointmentId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200">
                      {item.showAppointmentResponse?.appointmentDate}
                    </td>
                    <td className="px-4 py-3 text-sm border-r border-gray-200">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(item.showAppointmentResponse?.appointmentStatus)}`}>
                        {getStatusText(item.showAppointmentResponse?.appointmentStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                      <div className="max-w-xs truncate" title={item.showAppointmentResponse?.note || 'Không có'}>
                        {item.showAppointmentResponse?.note || 'Không có'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          handleCheckAtHome(
                            item.showAppointmentResponse.appointmentId,
                            item.userAppointmentResponses.userId,
                            item.serviceAppointmentResponses.map((s: any) => s.serviceId)
                          )
                        }
                        className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 hover:border-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loadingRowId === item.showAppointmentResponse.appointmentId}
                      >
                        {loadingRowId === item.showAppointmentResponse.appointmentId ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-1 border-white mr-1"></div>
                            Đang xác nhận...
                          </>
                        ) : (
                          'Xác Nhận'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Expandable Details for Each Row */}
            <div className="border-t border-gray-200">
              {paidAppointments.map((item: any, index: number) => (
                <div key={`details-${index}`} className="p-6 border-b border-gray-100 bg-gray-50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information Section */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h6 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Thông tin cơ bản
                      </h6>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="text-xs text-gray-600">Người Đặt</div>
                          <div className="font-medium text-sm text-gray-800">{item.userAppointmentResponses?.fullName || '—'}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="text-xs text-gray-600">SĐT</div>
                          <div className="font-medium text-sm text-gray-800">{item.userAppointmentResponses?.phone || '—'}</div>
                        </div>
                        <div className="col-span-2 p-2 bg-gray-50 rounded">
                          <div className="text-xs text-gray-600">Địa Chỉ</div>
                          <div className="font-medium text-sm text-gray-800">{item.userAppointmentResponses?.address || '—'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Services Section */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h6 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Dịch vụ
                      </h6>
                      <div className="space-y-2">
                        {item.serviceAppointmentResponses?.map((svc: any) => (
                          <div key={svc.serviceId} className="p-2 bg-gray-50 rounded border">
                            <div className="font-medium text-sm text-gray-800">{svc.serviceName || '—'}</div>
                            <div className="text-xs text-gray-600">Loại: {translateCivilStatus(svc.serviceType || '—')}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Kit Information Section */}
                    {item.kitAppointmentResponse && (
                      <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-gray-200">
                        <h6 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          Thông tin Kit
                        </h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="text-xs text-gray-600">Mã Kit</div>
                            <div className="font-medium text-sm text-gray-800">{item.kitAppointmentResponse.kitCode || '—'}</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="text-xs text-gray-600">Tên Kit</div>
                            <div className="font-medium text-sm text-gray-800">{item.kitAppointmentResponse.kitName || '—'}</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="text-xs text-gray-600">Số Người</div>
                            <div className="font-medium text-sm text-gray-800">2</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="text-xs text-gray-600">Số lượng</div>
                            <div className="font-medium text-sm text-gray-800">{item.kitAppointmentResponse.quantity || '—'}</div>
                          </div>
                          <div className="md:col-span-2 lg:col-span-4 p-2 bg-gray-50 rounded">
                            <div className="text-xs text-gray-600">Nội Dung Kit</div>
                            <div className="font-medium text-sm text-gray-800">{item.kitAppointmentResponse.contents || '—'}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kit Table Toggle Button */}
        <div className="mt-6">
          <button
            onClick={() => setShowKitTable(!showKitTable)}
            className={`px-6 py-2 text-white rounded-lg font-medium transition-colors ${
              showKitTable ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {showKitTable ? 'Ẩn Bảng Kit' : 'Hiển Thị Bảng Kit'}
          </button>
        </div>

        {/* Kit Table */}
        {showKitTable && (
          <div className="mt-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Danh Sách Kit</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      Mã Kit
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      Tên Kit
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      Số Lượng Kit
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-1">
                      Nội Dung
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isKit && isKit.length > 0 ? (
                  isKit.map((kit, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-blue-600 font-medium border-r border-gray-200">
                        {kit.kitCode}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200">
                        {kit.kitName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                        <div className="flex items-center gap-2">
                          <span>{kit.quantity} kit</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {kit.contents}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      Không tìm thấy kit nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentSchedule;