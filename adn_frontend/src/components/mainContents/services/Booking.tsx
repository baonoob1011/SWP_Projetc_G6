import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { BookingHistoryItem } from '../type/BookingType';
import {
  FaEye,
  FaMoneyBillWave,
  FaTimes,
  FaCalendarAlt,
  FaStethoscope,
  FaMapMarkerAlt,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// ==== COMPONENT ====
const Booking = () => {
  const [bookingList, setBookingList] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const navigate = useNavigate();
  const translateAppointmentType = (type: string) => {
    if (type === 'CENTER') return 'Lấy mẫu tại cơ sở';
    if (type === 'HOME') return 'Lấy mẫu tại nhà';
    return 'Không xác định';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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

  const fetchData = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/api/appointment/get-appointment', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Lỗi khi gọi API');
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        const centerList = data.allAppointmentAtCenterResponse || [];
        const homeList = data.allAppointmentAtHomeResponse || [];

        const fullList: BookingHistoryItem[] = [...centerList, ...homeList]
          .map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (res: any) => ({
              show: res.showAppointmentResponse,
              patients: res.patientAppointmentResponse || [],
              staff: res.staffAppointmentResponse || [],
              user: res.userAppointmentResponse || [],
              slot: res.slotAppointmentResponse || [],
              services: res.serviceAppointmentResponses || [],
              location: res.locationAppointmentResponses || [],
              room: res.roomAppointmentResponse || null,
              payments:
                res.paymentAppointmentResponse ||
                res.paymentAppointmentResponses || // <- dành cho atHome
                [],
              kit: res.kitAppointmentResponse || null, // <- nếu có ở lịch hẹn tại nhà
            })
          )
          .sort((a, b) => b.show.appointmentId - a.show.appointmentId);

        if (fullList.length === 0) {
          setError('Không có dữ liệu cuộc hẹn.');
        } else {
          setBookingList(fullList);
          // Reset to page 1 if current page is out of bounds
          const totalPages = Math.ceil(fullList.length / itemsPerPage);
          if (currentPage > totalPages) {
            setCurrentPage(1);
          }
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCanceled = async (appointmentId: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/appointment/cancel-appointment/${appointmentId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.ok) {
        toast.success('Đã hủy cuộc hẹn thành công');
        fetchData();
      } else {
        toast.error('Hủy cuộc hẹn thất bại');
      }
    } catch (error) {
      console.log('❌ Lỗi hệ thống khi gửi request:', error);
      toast.error('Lỗi hệ thống');
    }
  };

  const handlePayment = async (paymentId: number, serviceId: number) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/payment/create?paymentId=${paymentId}&serviceId=${serviceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const redirectUrl = await res.text();
      if (res.ok) {
        window.location.href = redirectUrl;
      } else {
        toast.error('bị lỗi');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(bookingList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = bookingList.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-600">
            Quản lý và theo dõi các cuộc hẹn khám bệnh của bạn
          </p>
          {bookingList.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Hiển thị {startIndex + 1}-{Math.min(endIndex, bookingList.length)}{' '}
              trong tổng số {bookingList.length} cuộc hẹn
            </p>
          )}
        </div>

        {/* Booking Cards */}
        <div className="space-y-6">
          {currentItems.map((item, idx) => (
            <div
              key={startIndex + idx}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">
                          #{startIndex + idx + 1}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Cuộc hẹn #{item.show.appointmentId}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Mã đặt khám: {item.show.appointmentId}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      item.show.appointmentStatus
                    )}`}
                  >
                    {getStatusText(item.show.appointmentStatus)}
                  </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Ngày khám</p>
                      <p className="font-medium text-gray-900">
                        {item.show.appointmentDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaStethoscope className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Dịch vụ</p>
                      <p className="font-medium text-gray-900 line-clamp-1">
                        {item.services.map((s) => s.serviceName).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Hình thức</p>
                      <p className="font-medium text-gray-900">
                        {translateAppointmentType(item.show.appointmentType)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                {item.payments.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Thanh toán</p>
                        <p className="font-medium text-gray-900">
                          {item.payments[0].amount?.toLocaleString('vi-VN')} VNĐ
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Trạng thái</p>
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            item.payments[0].getPaymentStatus === 'PAID'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {item.payments[0].getPaymentStatus === 'PAID'
                            ? 'Đã thanh toán'
                            : 'Chưa thanh toán'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {/* Cancel Button */}
                  {item.show.appointmentStatus !== 'COMPLETED' &&
                    item.payments[0].getPaymentStatus !== 'PAID' && (
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 bg-white rounded-lg hover:bg-red-50 transition-colors duration-200 text-sm font-medium"
                        onClick={() =>
                          handleCanceled(item.show.appointmentId.toString())
                        }
                      >
                        <FaTimes className="mr-2" />
                        Hủy cuộc hẹn
                      </button>
                    )}

                  {/* Payment Button */}
                  {item.payments.length > 0 &&
                    (!item.payments[0].getPaymentStatus ||
                      (item.payments[0].getPaymentStatus === 'PENDING' &&
                        item.payments[0].paymentMethod !== 'CASH')) &&
                    item.payments[0].paymentId &&
                    item.services.length > 0 &&
                    item.services[0].serviceId &&
                    (item.show.appointmentStatus === 'CONFIRMED' ||
                      item.show.appointmentType === 'HOME') && (
                      <button
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                        onClick={() =>
                          handlePayment(
                            item.payments[0].paymentId,
                            item.services[0].serviceId
                          )
                        }
                      >
                        <FaMoneyBillWave className="mr-2" />
                        Thanh toán
                      </button>
                    )}

                  {/* View Results Button */}
                  {item.show.appointmentStatus === 'COMPLETED' && (
                    <button
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      onClick={() =>
                        navigate(`/result/${item.show.appointmentId}`)
                      }
                    >
                      <FaEye className="mr-2" />
                      Xem kết quả
                    </button>
                  )}

                  {/* Review Button */}
                  {item.show.appointmentStatus === 'COMPLETED' && (
                    <button
                      className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 text-sm font-medium"
                      onClick={() =>
                        navigate(`/feedback/${item.services[0].serviceId}`)
                      }
                    >
                      <FaStar className="mr-2" />
                      Đánh giá
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {bookingList.length > itemsPerPage && (
          <div className="mt-8 flex items-center justify-center space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-200 ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FaChevronLeft className="mr-2" />
              Trang trước
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors duration-200 ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-200 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Trang sau
              <FaChevronRight className="ml-2" />
            </button>
          </div>
        )}

        {/* Empty State */}
        {bookingList.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có cuộc hẹn nào
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa có cuộc hẹn khám bệnh nào. Hãy đặt lịch khám để bắt đầu
              chăm sóc sức khỏe.
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              Đặt lịch khám ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
