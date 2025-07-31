/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FaHospital,
  FaHome,
  FaServicestack,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaDoorOpen,
  FaStickyNote,
  FaCreditCard,
} from 'react-icons/fa';

const ITEMS_PER_PAGE = 3;

const BookingHistory = () => {
  const [centerHistory, setCenterHistory] = useState<any[]>([]);
  const [homeHistory, setHomeHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  // Pagination state
  const [centerPage, setCenterPage] = useState(1);
  const [homePage, setHomePage] = useState(1);

  const translate = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'RATED':
        return 'Đã đánh giá';
      case 'WALLET':
        return 'Ví cá nhân';
      case 'CASH':
        return 'Tiền mặt';
      case 'VN_PAY':
        return 'VNPAY';
      case 'REFUND':
        return 'Bệnh nhân vắng mặt';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'COMPLETED':
        return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200';
      case 'CANCELLED':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200';
      case 'RATED':
        return 'bg-gradient-to-r from-purple-100 to-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200';
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/appointment/get-history',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!res.ok) throw new Error('Không thể lấy lịch sử đặt lịch');
      const data = await res.json();
      setCenterHistory(data.allAppointmentAtCenterResponse || []);
      setHomeHistory(data.allAppointmentAtHomeResponse || []);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi lấy lịch sử');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleTabChange = (_: any, newValue: number) => {
    setTabIndex(newValue);
  };

  // Pagination logic
  const centerTotalPages = Math.ceil(centerHistory.length / ITEMS_PER_PAGE);
  const homeTotalPages = Math.ceil(homeHistory.length / ITEMS_PER_PAGE);
  const centerStart = (centerPage - 1) * ITEMS_PER_PAGE;
  const centerEnd = centerStart + ITEMS_PER_PAGE;
  const homeStart = (homePage - 1) * ITEMS_PER_PAGE;
  const homeEnd = homeStart + ITEMS_PER_PAGE;
  const centerCurrent = centerHistory.slice(centerStart, centerEnd);
  const homeCurrent = homeHistory.slice(homeStart, homeEnd);

  // Empty state
  const renderEmpty = (msg: string) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-12 text-center">
      <div className="mb-6">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <FaCalendarAlt className="w-10 h-10 text-gray-800" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{msg}</h3>
        <p className="text-gray-600 text-lg max-w-md mx-auto">
          Bạn chưa có lịch sử đặt lịch nào. Hãy đặt lịch khám để bắt đầu chăm
          sóc sức khỏe.
        </p>
      </div>
    </div>
  );

  // Pagination controls
  const renderPagination = (
    page: number,
    totalPages: number,
    setPage: (p: number) => void
  ) =>
    totalPages > 1 && (
      <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1}
            className={`group inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-300 ${
              page === 1
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:text-blue-700 shadow-sm hover:shadow-md'
            }`}
          >
            <FaChevronLeft
              className={`w-4 h-4 ${
                page !== 1 ? 'group-hover:-translate-x-1' : ''
              } transition-transform duration-300`}
            />
            <span>Trang trước</span>
          </button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-300 ${
                  page === p
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-600 transform scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:text-blue-700 shadow-sm hover:shadow-md'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className={`group inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-300 ${
              page === totalPages
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:text-blue-700 shadow-sm hover:shadow-md'
            }`}
          >
            <span>Trang sau</span>
            <FaChevronRight
              className={`w-4 h-4 ${
                page !== totalPages ? 'group-hover:translate-x-1' : ''
              } transition-transform duration-300`}
            />
          </button>
        </div>
      </div>
    );

  // Center cards component
  const renderCenterCards = () => (
    <div className="space-y-6">
      {centerCurrent.map((item, index) => {
        const a = item.showAppointmentResponse;
        const service = item.serviceAppointmentResponses?.[0];
        const loc = item.locationAppointmentResponses?.[0];
        const room = item.roomAppointmentResponse;
        const payment = item.paymentAppointmentResponse?.[0];

        return (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Card Header */}
            <div className="relative px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <FaHospital className="w-5 h-5 text-gray-800" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Lịch sử #{centerStart + index + 1}
                    </h3>
                    <p className="text-sm text-gray-600">Khám tại trung tâm</p>
                  </div>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold border shadow-sm ${getStatusColor(
                    a?.appointmentStatus
                  )}`}
                >
                  {translate(a?.appointmentStatus)}
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Enhanced Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Ngày khám */}
                <div className="group">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FaCalendarAlt className="w-4 h-4 text-gray-800" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Ngày khám
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 ml-11">
                    {a?.appointmentDate || '-'}
                  </p>
                </div>

                {/* Dịch vụ */}
                <div className="group">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FaServicestack className="w-4 h-4 text-gray-800" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Dịch vụ
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 line-clamp-2 ml-11">
                    {service?.serviceName || '-'}
                  </p>
                </div>

                {/* Phòng */}
                <div className="group">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FaDoorOpen className="w-4 h-4 text-gray-800" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Phòng khám
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 ml-11">
                    {room?.roomName || '-'}
                  </p>
                </div>

                {/* Địa điểm */}
                <div className="group md:col-span-2 lg:col-span-3">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FaMapMarkerAlt className="w-4 h-4 text-gray-800" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Địa điểm
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 ml-11">
                    {loc
                      ? `${loc.addressLine}, ${loc.district}, ${loc.city}`
                      : '-'}
                  </p>
                </div>
              </div>

              {/* Enhanced Payment Info */}
              {payment && (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FaCreditCard className="w-5 h-5 text-gray-800" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Thông tin thanh toán
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Số tiền</p>
                      <p className="text-xl font-bold text-gray-900">
                        {payment.amount
                          ? `${payment.amount.toLocaleString('vi-VN')} VND`
                          : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phương thức</p>
                      <p className="font-medium text-gray-900">
                        {translate(payment.paymentMethod || '-')}
                      </p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
                      <span
                        className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                          payment.getPaymentStatus === 'PAID'
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
                            : payment.getPaymentStatus === 'REFUNDED'
                            ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800'
                            : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800'
                        }`}
                      >
                        {payment.getPaymentStatus === 'PAID'
                          ? 'Đã thanh toán'
                          : payment.getPaymentStatus === 'REFUNDED'
                          ? 'Đã hoàn tiền'
                          : 'Chưa thanh toán'}
                      </span>
                    </div>
                  </div>

                  {a?.note && (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <FaStickyNote className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-600 font-medium">
                          Ghi chú
                        </p>
                      </div>
                      <p className="text-gray-900 font-medium ml-6">{a.note}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Home cards component
  const renderHomeCards = () => (
    <div className="space-y-6">
      {homeCurrent.map((item, index) => {
        const a = item.showAppointmentResponse;
        const kit = item.kitAppointmentResponse;
        const payment = item.paymentAppointmentResponses?.[0];

        return (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Card Header */}
            <div className="relative px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <FaHome className="w-5 h-5 text-gray-800" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Lịch sử #{homeStart + index + 1}
                    </h3>
                    <p className="text-sm text-gray-600">Khám tại nhà</p>
                  </div>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold border shadow-sm ${getStatusColor(
                    a?.appointmentStatus
                  )}`}
                >
                  {translate(a?.appointmentStatus)}
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Enhanced Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Ngày khám */}
                <div className="group">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FaCalendarAlt className="w-4 h-4 text-gray-800" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Ngày khám
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 ml-11">
                    {a?.appointmentDate || '-'}
                  </p>
                </div>

                {/* Tên kit */}
                <div className="group">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FaServicestack className="w-4 h-4 text-gray-800" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Tên kit
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 line-clamp-2 ml-11">
                    {kit?.kitName || '-'}
                  </p>
                </div>

                {/* Ghi chú */}
                <div className="group md:col-span-2">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FaStickyNote className="w-4 h-4 text-gray-800" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Ghi chú
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 ml-11">
                    {a?.note || 'Không có ghi chú'}
                  </p>
                </div>
              </div>

              {/* Enhanced Payment Info */}
              {payment && (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FaCreditCard className="w-5 h-5 text-gray-800" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Thông tin thanh toán
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Số tiền</p>
                      <p className="text-xl font-bold text-gray-900">
                        {payment.amount
                          ? `${payment.amount.toLocaleString('vi-VN')} VND`
                          : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phương thức</p>
                      <p className="font-medium text-gray-900">
                        {translate(payment.paymentMethod || '-')}
                      </p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
                      <span
                        className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                          payment.getPaymentStatus === 'PAID'
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
                            : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800'
                        }`}
                      >
                        {payment.getPaymentStatus === 'PAID'
                          ? 'Đã thanh toán'
                          : 'Chưa thanh toán'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin mx-auto"
              style={{ animationDelay: '0.5s' }}
            ></div>
          </div>
          <p className="text-gray-600 text-lg font-medium">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-1">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Enhanced Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden mb-6">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleTabChange(null, 0)}
                className={`group flex items-center justify-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                  tabIndex === 0
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white transform scale-105'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-md'
                }`}
              >
                <div
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    tabIndex === 0 ? 'bg-white/20' : 'bg-white'
                  }`}
                >
                  <FaHospital
                    className={`w-4 h-4 ${
                      tabIndex === 0 ? 'text-white' : 'text-gray-800'
                    }`}
                  />
                </div>
                <span className="font-medium text-sm">Tại trung tâm</span>
              </button>

              <button
                onClick={() => handleTabChange(null, 1)}
                className={`group flex items-center justify-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                  tabIndex === 1
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white transform scale-105'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-md'
                }`}
              >
                <div
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    tabIndex === 1 ? 'bg-white/20' : 'bg-white'
                  }`}
                >
                  <FaHome
                    className={`w-4 h-4 ${
                      tabIndex === 1 ? 'text-white' : 'text-gray-800'
                    }`}
                  />
                </div>
                <span className="font-medium text-sm">Tại nhà</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {tabIndex === 0 ? (
          centerHistory.length === 0 ? (
            renderEmpty('Không có lịch sử đặt lịch tại trung tâm')
          ) : (
            <>
              {renderCenterCards()}
              {renderPagination(centerPage, centerTotalPages, setCenterPage)}
            </>
          )
        ) : homeHistory.length === 0 ? (
          renderEmpty('Không có lịch sử đặt lịch tại nhà')
        ) : (
          <>
            {renderHomeCards()}
            {renderPagination(homePage, homeTotalPages, setHomePage)}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
