/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { BookingHistoryItem } from '../type/BookingType';
import {
  FaEye,
  FaMoneyBillWave,
  FaTimes,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import InvoicePopup from '../actorList/user/PopupInvoice';
import Swal from 'sweetalert2';

// ==== COMPONENT ====
const Booking = () => {
  const [bookingList, setBookingList] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [showInvoicePopup, setShowInvoicePopup] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const navigate = useNavigate();
  const translateAppointmentType = (type: string) => {
    if (type === 'CENTER') return 'Lấy mẫu tại cơ sở';
    if (type === 'HOME') return 'Lấy mẫu tại nhà';
    return 'Không xác định';
  };
  const handleViewInvoice = async (appoinmentId: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/invoice/get-invoice-of-user?appointmentId=${appoinmentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!res.ok) throw new Error('Lỗi khi lấy hóa đơn');
      const data = await res.json();
      setInvoices(data);
      setShowInvoicePopup(true);
    } catch (err) {
      console.error(err);
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
          throw new Error('Không có cuộc hẹn nào');
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
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handlePaymentByWallet = async (
    appointmentId: number,
    serviceId: number,
    paymentId: number
  ) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/wallet/payment-by-wallet?appointmentId=${appointmentId}&serviceId=${serviceId}&paymentId=${paymentId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!res.ok) {
        toast.error('Số dư không đủ');
      } else {
        toast.success('Thanh toán thành công!');
        fetchData(); // Refresh lại danh sách sau khi thanh toán
      }
    } catch (error) {
      console.log(error);
    }
  };
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
  const handleChangMethod = async (
    paymentId: number,
    paymentMethod: string
  ) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/payment/change-payment-method?paymentId=${paymentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ paymentMethod }),
        }
      );

      if (res.ok) {
        toast.success('Đổi phương thức thành công');
        fetchData();
      } else {
        toast.error('Cập nhật thát bại');
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
                    <div>
                      <h3 className="text-blue-600 font-bold text-sm">
                        Số thứ tự {startIndex + idx + 1}
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
                  {/* Ngày khám */}
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm text-gray-500">Ngày lấy mẫu</p>
                      <p className="font-medium text-gray-900">
                        {item.show.appointmentDate}
                      </p>
                    </div>
                  </div>

                  {/* Dịch vụ */}
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm text-gray-500">Dịch vụ</p>
                      <p className="font-medium text-gray-900 line-clamp-1">
                        {item.services.map((s) => s.serviceName).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Hình thức */}
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm text-gray-500">Hình thức</p>
                      <p className="font-medium text-gray-900">
                        {translateAppointmentType(item.show.appointmentType)}
                      </p>
                    </div>
                  </div>

                  {/* Phòng / Thời gian / Địa chỉ */}
                  <div className="flex items-start space-x-3 col-span-1 md:col-span-2 lg:col-span-3">
                    <div>
                      <p className="font-medium text-gray-900 whitespace-pre-line">
                        {item.show.appointmentType === 'CENTER'
                          ? `Phòng: ${item.room?.roomName ?? '---'}\nGiờ: ${
                              item.slot?.[0]?.startTime ?? '--'
                            } đến ${
                              item.slot?.[0]?.endTime ?? '--'
                            }\nĐịa chỉ: ${
                              item.location?.[0]?.addressLine ?? ''
                            }, ${item.location?.[0]?.district ?? ''}, ${
                              item.location?.[0]?.city ?? ''
                            }`
                          : null}
                      </p>
                    </div>
                  </div>
                  {item.payments.map(
                    (payment) =>
                      (!payment.getPaymentStatus ||
                        payment.getPaymentStatus === 'PENDING') && (
                        <div key={payment.paymentId} className="mb-4">
                          <p>Đổi phương thức thanh toán</p>
                          <select
                            defaultValue={payment.paymentMethod || 'VNPAY'}
                            onChange={(e) =>
                              handleChangMethod(
                                payment.paymentId,
                                e.target.value
                              )
                            }
                            className="border rounded px-2 py-1"
                          >
                            {item.show.appointmentType === 'CENTER' ? (
                              <>
                                <option value="VN_PAY">VNPAY</option>
                                <option value="CASH">Tiền mặt</option>
                                <option value="WALLET">Ví cá nhân</option>
                              </>
                            ) : (
                              <>
                                <option value="VN_PAY">VNPAY</option>
                                <option value="WALLET">Ví cá nhân</option>
                              </>
                            )}
                          </select>
                        </div>
                      )
                  )}
                </div>

                {/* Payment Info */}
                {item.payments.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
                    {/* Thanh toán và Trạng thái */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Thanh toán</p>
                        <p className="font-medium text-gray-900">
                          {item.payments[0].amount?.toLocaleString('vi-VN')} VNĐ
                        </p>
                      </div>
                      <div className="md:text-right">
                        <p className="text-sm text-gray-500">Trạng thái</p>
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
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

                    {/* Note và Tên nhân viên */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        {item.show?.note && item.show.note.length > 0 && (
                          <>
                            <p className="text-sm text-gray-500">
                              Trạng thái đơn đăng ký
                            </p>
                            <p className="font-medium text-gray-900">
                              {item.show.note}
                            </p>
                          </>
                        )}
                      </div>

                      {item.staff && item.staff.length > 0 && (
                        <div className="md:text-right">
                          <p className="text-sm text-gray-500">Tên nhân viên</p>
                          <p className="font-medium text-gray-900">
                            {item.staff.map((s) => s.fullName).join(', ')}
                          </p>
                        </div>
                      )}
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
                        onClick={async () => {
                          const result = await Swal.fire({
                            title: 'Xác nhận hủy cuộc hẹn',
                            text: 'Bạn có chắc chắn muốn hủy cuộc hẹn này?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Có, hủy cuộc hẹn',
                            cancelButtonText: 'Không',
                          });

                          if (result.isConfirmed) {
                            handleCanceled(item.show.appointmentId.toString());
                          }
                        }}
                      >
                        <FaTimes className="mr-2" />
                        Hủy cuộc hẹn
                      </button>
                    )}

                  {/* Payment Button */}
                  {item.payments.length > 0 &&
                    (!item.payments[0].getPaymentStatus ||
                      item.payments[0].getPaymentStatus === 'PENDING') &&
                    item.payments[0].paymentId &&
                    item.services.length > 0 &&
                    item.services[0].serviceId &&
                    item.payments[0].paymentMethod === 'VN_PAY' && (
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
                  {item.payments.length > 0 &&
                    (!item.payments[0].getPaymentStatus ||
                      item.payments[0].getPaymentStatus === 'PENDING') &&
                    item.payments[0].paymentId &&
                    item.services.length > 0 &&
                    item.services[0].serviceId &&
                    item.payments[0].paymentMethod === 'WALLET' && (
                      <button
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                        onClick={async () => {
                          const result = await Swal.fire({
                            title: 'Xác nhận thanh toán',
                            text: 'Bạn có chắc chắn muốn thanh toán hóa đơn này?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Có, thanh toán!',
                            cancelButtonText: 'Hủy',
                          });

                          if (result.isConfirmed) {
                            handlePaymentByWallet(
                              item.show.appointmentId,
                              item.services[0].serviceId,
                              item.payments[0].paymentId
                            );
                          }
                        }}
                      >
                        <FaMoneyBillWave className="mr-2" />
                        Thanh toán
                      </button>
                    )}

                  {item.payments.length > 0 &&
                    item.payments[0].getPaymentStatus === 'PAID' && (
                      <button
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                        onClick={() =>
                          handleViewInvoice(item.show.appointmentId.toString())
                        }
                      >
                        <FaMoneyBillWave className="mr-2" />
                        Hóa đơn
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
          </div>
        )}
      </div>
      <InvoicePopup
        visible={showInvoicePopup}
        onClose={() => setShowInvoicePopup(false)}
        invoices={invoices}
      />
    </div>
  );
};

export default Booking;
