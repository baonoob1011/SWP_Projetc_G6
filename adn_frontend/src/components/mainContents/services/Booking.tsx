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
  FaHome,
  FaHospital,
  FaServicestack,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaDoorOpen,
  FaUserMd,
  FaCreditCard,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import InvoicePopup from '../actorList/user/PopupInvoice';
import Swal from 'sweetalert2';

// ==== COMPONENT ====
const Booking = () => {
  const [bookingList, setBookingList] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvoicePopup, setShowInvoicePopup] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'CENTER' | 'HOME' | 'ALL'>('ALL');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
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
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'COMPLETED':
        return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200';
      case 'CANCELLED':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200';
      default:
        return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200';
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
          .map((res: any) => ({
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
              res.paymentAppointmentResponses ||
              [],
            kit: res.kitAppointmentResponse || null,
          }))
          .sort((a, b) => b.show.appointmentId - a.show.appointmentId);

        if (fullList.length === 0) {
          throw new Error('Không có cuộc hẹn nào');
        } else {
          setBookingList(fullList);
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
        fetchData();
        window.location.href = '/u-profile';
        return true;
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

  // Filter bookings based on active tab
  const filteredBookings = bookingList.filter((item) => {
    if (activeTab === 'ALL') return true;
    return item.show.appointmentType === activeTab;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredBookings.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset to page 1 when changing tabs
  const handleTabChange = (tab: 'CENTER' | 'HOME' | 'ALL') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Tab Navigation */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleTabChange('ALL')}
              className={`group flex items-center justify-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                activeTab === 'ALL'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white transform scale-105'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-md'
              }`}
            >
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                activeTab === 'ALL' ? 'bg-white/20' : 'bg-white'
              }`}>
                <FaServicestack className={`w-4 h-4 ${
                  activeTab === 'ALL' ? 'text-white' : 'text-gray-800'
                }`} />
              </div>
              <span className="font-medium text-sm">Tất cả</span>
            </button>

            <button
              onClick={() => handleTabChange('CENTER')}
              className={`group flex items-center justify-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                activeTab === 'CENTER'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white transform scale-105'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-md'
              }`}
            >
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                activeTab === 'CENTER' ? 'bg-white/20' : 'bg-white'
              }`}>
                <FaHospital className={`w-4 h-4 ${
                  activeTab === 'CENTER' ? 'text-white' : 'text-gray-800'
                }`} />
              </div>
              <span className="font-medium text-sm">Tại trung tâm</span>
            </button>

            <button
              onClick={() => handleTabChange('HOME')}
              className={`group flex items-center justify-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                activeTab === 'HOME'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white transform scale-105'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-md'
              }`}
            >
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                activeTab === 'HOME' ? 'bg-white/20' : 'bg-white'
              }`}>
                <FaHome className={`w-4 h-4 ${
                  activeTab === 'HOME' ? 'text-white' : 'text-gray-800'
                }`} />
              </div>
              <span className="font-medium text-sm">Tại nhà</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Booking Cards */}
      <div className="space-y-6">
        {currentItems.map((item, idx) => (
          <div
            key={startIndex + idx}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Card Header */}
            <div className="relative px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <FaCalendarAlt className="w-5 h-5 text-gray-800" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Cuộc hẹn #{item.show.appointmentId}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Số thứ tự: {startIndex + idx + 1}
                    </p>
                  </div>
                </div>

                <span className={`px-4 py-2 rounded-full text-sm font-semibold border shadow-sm ${getStatusColor(
                  item.show.appointmentStatus
                )}`}>
                  {getStatusText(item.show.appointmentStatus)}
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
                      Ngày lấy mẫu
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 ml-11">
                    {item.show.appointmentDate}
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
                    {item.services.map((s) => s.serviceName).join(', ')}
                  </p>
                </div>

                {/* Hình thức */}
                <div className="group">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {item.show.appointmentType === 'CENTER' ? (
                        <FaHospital className="w-4 h-4 text-gray-800" />
                      ) : (
                        <FaHome className="w-4 h-4 text-gray-800" />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Hình thức
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 ml-11">
                    {translateAppointmentType(item.show.appointmentType)}
                  </p>
                </div>

                {/* Center-specific info */}
                {item.show.appointmentType === 'CENTER' && (
                  <>
                    {/* Phòng */}
                    <div className="group">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <FaDoorOpen className="w-4 h-4 text-gray-800" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Phòng
                        </span>
                      </div>
                      <p className="font-medium text-gray-900 ml-11">
                        {item.room?.roomName ?? '---'}
                      </p>
                    </div>

                    {/* Thời gian */}
                    <div className="group">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <FaClock className="w-4 h-4 text-gray-800" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Thời gian
                        </span>
                      </div>
                      <p className="font-medium text-gray-900 ml-11">
                        {item.slot?.[0]?.startTime
                          ? item.slot[0].startTime.substring(0, 5)
                          : '--'}{' '}
                        đến{' '}
                        {item.slot?.[0]?.endTime
                          ? item.slot[0].endTime.substring(0, 5)
                          : '--'}
                      </p>
                    </div>

                    {/* Địa điểm */}
                    <div className="group">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <FaMapMarkerAlt className="w-4 h-4 text-gray-800" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Địa điểm
                        </span>
                      </div>
                      <p className="font-medium text-gray-900 ml-11">
                        {item.location?.[0]?.addressLine ?? ''},{' '}
                        {item.location?.[0]?.district ?? ''},{' '}
                        {item.location?.[0]?.city ?? ''}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Enhanced Payment Info */}
              {item.payments.length > 0 && (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-6 border border-gray-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FaCreditCard className="w-5 h-5 text-gray-800" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Thông tin thanh toán</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Số tiền</p>
                      <p className="text-xl font-bold text-gray-900">
                        {item.payments[0].amount?.toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-sm text-gray-600 mb-1">Trạng thái thanh toán</p>
                      <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                        item.payments[0].getPaymentStatus === 'PAID'
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
                          : item.payments[0].getPaymentStatus === 'REFUND'
                          ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800'
                          : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800'
                      }`}>
                        {item.payments[0].getPaymentStatus === 'PAID'
                          ? 'Đã thanh toán'
                          : item.payments[0].getPaymentStatus === 'REFUND'
                          ? 'Đã hoàn tiền'
                          : 'Chưa thanh toán'}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Change */}
                  {item.payments.map(
                    (payment) =>
                      (!payment.getPaymentStatus ||
                        payment.getPaymentStatus === 'PENDING') &&
                      item.show.appointmentType === 'CENTER' && (
                        <div key={payment.paymentId} className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phương thức thanh toán
                          </label>
                          <select
                            defaultValue={payment.paymentMethod || 'VNPAY'}
                            onChange={(e) =>
                              handleChangMethod(
                                payment.paymentId,
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white"
                          >
                            {item.show.appointmentType === 'CENTER' ? (
                              <>
                                <option value="CASH">Tiền mặt</option>
                                <option value="WALLET">Ví Genelink</option>
                              </>
                            ) : null}
                          </select>
                        </div>
                      )
                  )}

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      {item.show?.note &&
                      item.show.note.length > 0 &&
                      item.payments.length > 0 &&
                      item.payments[0]?.getPaymentStatus === 'PAID' ? (
                        <>
                          <p className="text-sm text-gray-600 mb-1">Trạng thái đơn đăng ký</p>
                          <p className="font-medium text-gray-900">{item.show.note}</p>
                        </>
                      ) : null}
                    </div>

                    {item.staff && item.staff.length > 0 && (
                      <div className="md:text-right">
                        <div className="flex items-center justify-end space-x-2 mb-1">
                          <FaUserMd className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-600">Nhân viên phụ trách</p>
                        </div>
                        <p className="font-medium text-gray-900">
                          {item.staff.map((s) => s.fullName).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Enhanced Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {/* Cancel Button */}
                {item.show.appointmentStatus !== 'COMPLETED' &&
                  item.payments[0].getPaymentStatus !== 'PAID' && (
                    <button
                      type="button"
                      className="group inline-flex items-center space-x-2 px-6 py-3 border-2 border-red-300 text-red-700 bg-white rounded-xl hover:bg-red-50 hover:border-red-400 transition-all duration-300 text-sm font-semibold shadow-sm hover:shadow-md"
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
                      <FaTimes className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                      <span>Hủy cuộc hẹn</span>
                    </button>
                  )}

                {/* Payment Buttons */}
                {item.payments.length > 0 &&
                  (!item.payments[0].getPaymentStatus ||
                    item.payments[0].getPaymentStatus === 'PENDING') &&
                  item.payments[0].paymentId &&
                  item.services.length > 0 &&
                  item.services[0].serviceId && (
                    <>
                      {item.payments[0].paymentMethod === 'VN_PAY' && (
                        <button
                          className="group inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl transition-all duration-300 text-sm font-semibold hover:shadow-xl transform hover:scale-105"
                          onClick={() =>
                            handlePayment(
                              item.payments[0].paymentId,
                              item.services[0].serviceId
                            )
                          }
                        >
                          <FaMoneyBillWave className="w-4 h-4 group-hover:bounce" />
                          <span>Thanh toán</span>
                        </button>
                      )}
                      {item.payments[0].paymentMethod === 'WALLET' && (
                        <button
                          className="group inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl transition-all duration-300 text-sm font-semibold hover:shadow-xl transform hover:scale-105"
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
                              const success = await handlePaymentByWallet(
                                item.show.appointmentId,
                                item.services[0].serviceId,
                                item.payments[0].paymentId
                              );
                              if (success) {
                                window.dispatchEvent(
                                  new Event('reloadProfile')
                                );
                              }
                            }
                          }}
                        >
                          <FaMoneyBillWave className="w-4 h-4 group-hover:bounce" />
                          <span>Thanh toán</span>
                        </button>
                      )}
                    </>
                  )}

                {/* Invoice Button */}
                {item.payments.length > 0 &&
                  item.payments[0].getPaymentStatus === 'PAID' && (
                    <button
                      className="group inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl transition-all duration-300 text-sm font-semibold hover:shadow-xl transform hover:scale-105"
                      onClick={() =>
                        handleViewInvoice(item.show.appointmentId.toString())
                      }
                    >
                      <FaMoneyBillWave className="w-4 h-4 group-hover:bounce" />
                      <span>Hóa đơn</span>
                    </button>
                  )}

                {/* View Results Button */}
                {item.show.appointmentStatus === 'COMPLETED' && (
                  <button
                    className="group inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white rounded-xl transition-all duration-300 text-sm font-semibold hover:shadow-xl transform hover:scale-105"
                    onClick={() =>
                      navigate(`/result/${item.show.appointmentId}`)
                    }
                  >
                    <FaEye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>Xem kết quả</span>
                  </button>
                )}

                {/* Review Button */}
                {item.show.appointmentStatus === 'COMPLETED' && (
                  <button
                    className="group inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white rounded-xl transition-all duration-300 text-sm font-semibold hover:shadow-xl transform hover:scale-105"
                    onClick={() =>
                      navigate(`/feedback/${item.services[0].serviceId}`)
                    }
                  >
                    <FaStar className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Đánh giá</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Pagination */}
      {filteredBookings.length > itemsPerPage && (
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`group inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-300 ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:text-blue-700 shadow-sm hover:shadow-md'
              }`}
            >
              <FaChevronLeft className={`w-4 h-4 ${currentPage !== 1 ? 'group-hover:-translate-x-1' : ''} transition-transform duration-300`} />
              <span>Trang trước</span>
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-600 transform scale-105'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:text-blue-700 shadow-sm hover:shadow-md'
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
              className={`group inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-300 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:text-blue-700 shadow-sm hover:shadow-md'
              }`}
            >
              <span>Trang sau</span>
              <FaChevronRight className={`w-4 h-4 ${currentPage !== totalPages ? 'group-hover:translate-x-1' : ''} transition-transform duration-300`} />
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Empty State */}
      {filteredBookings.length === 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-12 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              {activeTab === 'CENTER' ? (
                <FaHospital className="w-10 h-10 text-gray-800" />
              ) : activeTab === 'HOME' ? (
                <FaHome className="w-10 h-10 text-gray-800" />
              ) : (
                <FaCalendarAlt className="w-10 h-10 text-gray-800" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {activeTab === 'CENTER'
                ? 'Không có lịch hẹn tại trung tâm'
                : activeTab === 'HOME'
                ? 'Không có lịch hẹn tại nhà'
                : 'Chưa có cuộc hẹn nào'}
            </h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              {activeTab === 'CENTER'
                ? 'Bạn chưa có cuộc hẹn khám tại trung tâm nào.'
                : activeTab === 'HOME'
                ? 'Bạn chưa có cuộc hẹn lấy mẫu tại nhà nào.'
                : 'Bạn chưa có cuộc hẹn khám bệnh nào. Hãy đặt lịch khám để bắt đầu chăm sóc sức khỏe.'}
            </p>
          </div>
        </div>
      )}

      <InvoicePopup
        visible={showInvoicePopup}
        onClose={() => setShowInvoicePopup(false)}
        invoices={invoices}
      />
    </div>
  );
};

export default Booking;