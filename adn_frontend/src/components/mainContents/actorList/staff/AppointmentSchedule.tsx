/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AppointmentSchedule = () => {
  const [homeSchedule, setHomeSchedule] = useState<any[]>([]);
  const [loadingHome, setLoadingHome] = useState(false);
  const [loadingRowId, setLoadingRowId] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Danh Sách Lịch Hẹn
          </h1>
        </div>

        {loadingHome ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {homeSchedule
              .filter(
                (item) => item.showAppointmentResponse.note === 'Đã thanh toán'
              )
              .map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    {/* Header with appointment info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">
                              #{index + 1}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Lịch hẹn #
                            {item.showAppointmentResponse.appointmentId}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.showAppointmentResponse.appointmentDate}
                          </p>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        {item.showAppointmentResponse.appointmentStatus}
                      </span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {/* Ngày hẹn */}
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm text-gray-500">Ngày Hẹn</p>
                          <p className="font-medium text-gray-900">
                            {item.showAppointmentResponse.appointmentDate}
                          </p>
                        </div>
                      </div>

                      {/* Trạng thái */}
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm text-gray-500">Trạng Thái</p>
                          <p className="font-medium text-gray-900">
                            {item.showAppointmentResponse.appointmentStatus}
                          </p>
                        </div>
                      </div>

                      {/* Ghi chú */}
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm text-gray-500">Ghi Chú</p>
                          <p className="font-medium text-gray-900">
                            {item.showAppointmentResponse.note}
                          </p>
                        </div>
                      </div>

                      {/* Tên dịch vụ */}
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm text-gray-500">Tên Dịch Vụ</p>
                          <p className="font-medium text-gray-900">
                            {item.serviceAppointmentResponses?.[0]
                              ?.serviceName || '—'}
                          </p>
                        </div>
                      </div>

                      {/* Loại dịch vụ */}
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm text-gray-500">Loại Dịch Vụ</p>
                          <p className="font-medium text-gray-900">
                            {item.serviceAppointmentResponses?.[0]
                              ?.serviceType || '—'}
                          </p>
                        </div>
                      </div>

                      {/* Mã kit */}
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm text-gray-500">Mã Kit</p>
                          <p className="font-medium text-gray-900">
                            {item.kitAppointmentResponse?.kitCode || '—'}
                          </p>
                        </div>
                      </div>

                      {/* Tên kit */}
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm text-gray-500">Tên Kit</p>
                          <p className="font-medium text-gray-900">
                            {item.kitAppointmentResponse?.kitName || '—'}
                          </p>
                        </div>
                      </div>

                      {/* Số người */}
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm text-gray-500">Số Người</p>
                          <p className="font-medium text-gray-900">
                            {item.kitAppointmentResponse?.targetPersonCount ||
                              '—'}
                          </p>
                        </div>
                      </div>

                      {/* Nội dung kit */}
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm text-gray-500">Nội Dung Kit</p>
                          <p className="font-medium text-gray-900">
                            {item.kitAppointmentResponse?.contents || '—'}
                          </p>
                        </div>
                      </div>

                      {/* Địa chỉ - full width */}
                      <div className="flex items-start space-x-3 col-span-1 md:col-span-2 lg:col-span-3">
                        <div>
                          <p className="text-sm text-gray-500">Địa Chỉ</p>
                          <p className="font-medium text-gray-900">
                            {item.userAppointmentResponses?.address || '—'}
                          </p>
                        </div>
                      </div>

                      {/* Người đặt */}
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm text-gray-500">Người Đặt</p>
                          <p className="font-medium text-gray-900">
                            {item.userAppointmentResponses?.fullName || '—'}
                          </p>
                        </div>
                      </div>

                      {/* SĐT */}
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm text-gray-500">SĐT</p>
                          <p className="font-medium text-gray-900">
                            {item.userAppointmentResponses?.phone || '—'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() =>
                          handleCheckAtHome(
                            item.showAppointmentResponse.appointmentId,
                            item.userAppointmentResponses.userId,
                            item.serviceAppointmentResponses.map(
                              (s: any) => s.serviceId
                            )
                          )
                        }
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          loadingRowId ===
                          item.showAppointmentResponse.appointmentId
                        }
                      >
                        {loadingRowId ===
                        item.showAppointmentResponse.appointmentId
                          ? 'Đang xác nhận...'
                          : 'Xác Nhận'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentSchedule;
