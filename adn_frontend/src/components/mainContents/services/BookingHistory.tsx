/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaHospital, FaHome, FaServicestack, FaCalendarAlt, FaMoneyBillWave, FaChevronLeft, FaChevronRight, FaClock, FaMapMarkerAlt, FaUser, FaDoorOpen, FaStickyNote } from 'react-icons/fa';

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
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'RATED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{msg}</h3>
      <p className="text-gray-600">
        Bạn chưa có lịch sử đặt lịch nào. Hãy đặt lịch khám để bắt đầu chăm sóc sức khỏe.
      </p>
    </div>
  );

  // Pagination controls
  const renderPagination = (
    page: number,
    totalPages: number,
    setPage: (p: number) => void
  ) =>
    totalPages > 1 && (
      <div className="mt-8 flex items-center justify-center space-x-4">
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-200 ${
            page === 1
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <FaChevronLeft className="mr-2 w-3 h-3" />
          Trang trước
        </button>

        <div className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors duration-200 ${
                page === p
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-200 ${
            page === totalPages
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Trang sau
          <FaChevronRight className="ml-2 w-3 h-3" />
        </button>
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
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              {/* Header Row */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaHospital className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-blue-600 font-bold text-lg">
                      Lịch sử #{centerStart + index + 1}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Khám tại trung tâm
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(a?.appointmentStatus)}`}
                >
                  {translate(a?.appointmentStatus)}
                </span>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Ngày khám */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaCalendarAlt className="text-gray-600 w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 font-medium">Ngày khám</p>
                    <p className="font-semibold text-gray-900 truncate">
                      {a?.appointmentDate || '-'}
                    </p>
                  </div>
                </div>

                {/* Dịch vụ */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaServicestack className="text-gray-600 w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 font-medium">Dịch vụ</p>
                    <p className="font-semibold text-gray-900 truncate">
                      {service?.serviceName || '-'}
                    </p>
                  </div>
                </div>

                {/* Phòng */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaDoorOpen className="text-gray-600 w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 font-medium">Phòng khám</p>
                    <p className="font-semibold text-gray-900 truncate">
                      {room?.roomName || '-'}
                    </p>
                  </div>
                </div>

                {/* Địa điểm */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaMapMarkerAlt className="text-gray-600 w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 font-medium">Địa điểm</p>
                    <p className="font-semibold text-gray-900 text-sm leading-relaxed">
                      {loc
                        ? `${loc.addressLine}, ${loc.district}, ${loc.city}`
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              {payment && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <h4 className="font-semibold text-gray-900">Thông tin thanh toán</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Số tiền</p>
                      <p className="font-semibold text-gray-900">
                        {payment.amount ? `${payment.amount.toLocaleString('vi-VN')} VND` : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Phương thức</p>
                      <p className="font-semibold text-gray-900">
                        {payment.paymentMethod || '-'}
                      </p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-sm text-gray-500 font-medium">Trạng thái</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        payment.getPaymentStatus === 'PAID'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
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
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              {/* Header Row */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaHome className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-blue-600 font-bold text-lg">
                      Lịch sử #{homeStart + index + 1}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Khám tại nhà
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(a?.appointmentStatus)}`}
                >
                  {translate(a?.appointmentStatus)}
                </span>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Ngày khám */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaCalendarAlt className="text-gray-600 w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 font-medium">Ngày khám</p>
                    <p className="font-semibold text-gray-900 truncate">
                      {a?.appointmentDate || '-'}
                    </p>
                  </div>
                </div>

                {/* Tên kit */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaServicestack className="text-gray-600 w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 font-medium">Tên kit</p>
                    <p className="font-semibold text-gray-900 truncate">
                      {kit?.kitName || '-'}
                    </p>
                  </div>
                </div>

                {/* Ghi chú */}
                <div className="flex items-start space-x-3 md:col-span-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaStickyNote className="text-gray-600 w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 font-medium">Ghi chú</p>
                    <p className="font-semibold text-gray-900 text-sm leading-relaxed">
                      {a?.note || 'Không có ghi chú'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              {payment && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <FaMoneyBillWave className="text-green-600 w-4 h-4" />
                    <h4 className="font-semibold text-gray-900">Thông tin thanh toán</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Số tiền</p>
                      <p className="font-semibold text-gray-900">
                        {payment.amount ? `${payment.amount.toLocaleString('vi-VN')} VND` : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Phương thức</p>
                      <p className="font-semibold text-gray-900">
                        {payment.paymentMethod || '-'}
                      </p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-sm text-gray-500 font-medium">Trạng thái</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        payment.getPaymentStatus === 'PAID'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-1">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-3 mb-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => handleTabChange(null, 0)}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tabIndex === 0
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FaHospital className="mr-2 w-4 h-4" />
              Tại trung tâm
            </button>
            <button
              onClick={() => handleTabChange(null, 1)}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tabIndex === 1
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FaHome className="mr-2 w-4 h-4" />
              Tại nhà
            </button>
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