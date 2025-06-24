import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { BookingHistoryItem } from '../type/BookingType';
import { FaEye, FaMoneyBillWave, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// ==== COMPONENT ====
const Booking = () => {
  const [bookingList, setBookingList] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingHistoryItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const translateAppointmentType = (type: string) => {
    if (type === 'CENTER') return 'Lấy mẫu tại cơ sở';
    if (type === 'HOME') return 'Lấy mẫu tại nhà';
    return 'Không xác định';
  };
  const navigate = useNavigate();

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

        const fullList: BookingHistoryItem[] = [...centerList, ...homeList].map(
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
        );

        if (fullList.length === 0) {
          setError('Không có dữ liệu cuộc hẹn.');
        } else {
          setBookingList(fullList);
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
  return (
    <div className="container mb-4">
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Số</th>
                <th>Ngày</th>
                <th>Trạng thái</th>
                <th>Dịch vụ</th>
                <th>Hình thức</th>
                <th>Thao tác</th>
                <th>Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {bookingList.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{item.show.appointmentDate}</td>
                  <td>
                    {item.show.appointmentStatus === 'CONFIRMED'
                      ? 'Đã xác nhận'
                      : 'Chưa xác nhận'}
                  </td>
                  <td>{item.services.map((s) => s.serviceName).join(', ')}</td>
                  <td>{translateAppointmentType(item.show.appointmentType)}</td>
                  <td>
                    <div
                      style={{
                        display: 'inline-flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                      }}
                    >
                      {/* Xem thêm */}
                      <button
                        className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                        onClick={() => {
                          setSelectedBooking(item);
                          setShowModal(true);
                        }}
                      >
                        <FaEye />
                      </button>

                      {/* Hủy */}
                      {item.show.appointmentStatus !== 'COMPLETED' && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                          onClick={() =>
                            handleCanceled(item.show.appointmentId.toString())
                          }
                        >
                          <FaTimes />
                        </button>
                      )}

                      {/* Thanh toán */}
                      {item.payments.length > 0 &&
                        (!item.payments[0].getPaymentStatus ||
                          item.payments[0].getPaymentStatus === 'UNPAID') &&
                        item.payments[0].paymentId &&
                        item.services.length > 0 &&
                        item.services[0].serviceId &&
                        (item.show.appointmentStatus === 'CONFIRMED' ||
                          item.show.appointmentType === 'HOME') && (
                          <button
                            className="btn btn-success btn-sm d-flex align-items-center gap-1"
                            onClick={() =>
                              handlePayment(
                                item.payments[0].paymentId,
                                item.services[0].serviceId
                              )
                            }
                          >
                            <FaMoneyBillWave />
                          </button>
                        )}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() =>
                        navigate(`/result/${item.show.appointmentId}`)
                      }
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal chi tiết */}
      {showModal && selectedBooking && (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ marginTop: 120 }}>
              <div className="modal-header">
                <h5 className="modal-title">
                  Chi tiết cuộc hẹn {selectedBooking.show.appointmentId}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Ngày hẹn:</strong>{' '}
                  {selectedBooking.show.appointmentDate}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{' '}
                  {selectedBooking.show.appointmentStatus === 'CONFIRMED'
                    ? 'Đã xác nhận'
                    : 'Chưa xác nhận'}
                </p>
                <p>
                  <strong>Ghi chú:</strong>{' '}
                  {selectedBooking.show.note || 'Không có'}
                </p>
                <p>
                  <strong>Dịch vụ:</strong>{' '}
                  {selectedBooking.services
                    .map((s) => s.serviceName)
                    .join(', ')}
                </p>

                {/* Hiển thị thông tin địa điểm, slot, room nếu là tại trung tâm */}
                {selectedBooking.show.appointmentType === 'CENTER' && (
                  <>
                    <p>
                      <strong>Phòng:</strong>{' '}
                      {selectedBooking.room?.roomName || 'Không xác định'}
                    </p>
                    <p>
                      <strong>Slot:</strong> {selectedBooking.slot[0]?.slotDate}{' '}
                      | {selectedBooking.slot[0]?.startTime} -{' '}
                      {selectedBooking.slot[0]?.endTime}
                    </p>
                    <p>
                      <strong>Địa điểm:</strong>{' '}
                      {selectedBooking.location
                        .map(
                          (l) => `${l.addressLine}, ${l.district}, ${l.city}`
                        )
                        .join('; ') || 'Không xác định'}
                    </p>
                  </>
                )}

                {/* Hiển thị thông tin kit nếu là tại nhà */}
                {selectedBooking.show.appointmentType === 'HOME' &&
                  selectedBooking.kit && (
                    <>
                      <p>
                        <strong>Mã Kit:</strong> {selectedBooking.kit.kitCode}
                      </p>
                      <p>
                        <strong>Tên Kit:</strong> {selectedBooking.kit.kitName}
                      </p>
                      <p>
                        <strong>Trạng thái:</strong>{' '}
                        {selectedBooking.kit.kitStatus}
                      </p>
                      <p>
                        <strong>Ngày giao:</strong>{' '}
                        {selectedBooking.kit.deliveryDate}
                      </p>
                      <p>
                        <strong>Ngày hoàn:</strong>{' '}
                        {selectedBooking.kit.returnDate || 'Chưa hoàn'}
                      </p>
                    </>
                  )}

                <hr />
                <p>
                  <strong>Thanh toán:</strong>{' '}
                  {selectedBooking.payments.length > 0
                    ? selectedBooking.payments[0].getPaymentStatus === 'PAID'
                      ? `${selectedBooking.payments[0].amount} (Đã thanh toán)`
                      : `${selectedBooking.payments[0].amount} (Chưa thanh toán)`
                    : 'Chưa thanh toán'}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
