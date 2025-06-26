import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { BookingHistoryItem } from '../type/BookingType';
import { FaEye, FaMoneyBillWave, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './Booking.module.css';

// ==== COMPONENT ====
const Booking = () => {
  const [bookingList, setBookingList] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [selectedBooking, setSelectedBooking] =
  //   useState<BookingHistoryItem | null>(null);
  // const [showModal, setShowModal] = useState(false);
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
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return `${styles.statusBadge} ${styles.statusConfirmed}`;
      case 'COMPLETED':
        return `${styles.statusBadge} ${styles.statusCompleted}`;
      default:
        return `${styles.statusBadge} ${styles.statusPending}`;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'COMPLETED':
        return 'Đã có kết quả';
      default:
        return 'Chưa xác nhận';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    return type === 'CENTER'
      ? `${styles.typeBadge} ${styles.typeCenter}`
      : `${styles.typeBadge} ${styles.typeHome}`;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}>
          <FaCalendarAlt className={styles.emptyIcon} />
          <div>Đang tải danh sách cuộc hẹn...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  if (!loading && !error && bookingList.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <FaCalendarAlt className={styles.emptyIcon} />
          <div className={styles.emptyTitle}>Chưa có cuộc hẹn nào</div>
          <div className={styles.emptyDescription}>
            Bạn chưa có cuộc hẹn nào được đặt. Hãy đặt lịch hẹn để sử dụng dịch
            vụ của chúng tôi.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Số</th>
              <th className={styles.tableHeaderCell}>Ngày</th>
              <th className={styles.tableHeaderCell}>Trạng thái</th>
              <th className={styles.tableHeaderCell}>Dịch vụ</th>
              <th className={styles.tableHeaderCell}>Hình thức</th>
              <th className={styles.tableHeaderCell}>Thao tác</th>
              <th className={styles.tableHeaderCell}>Kết quả</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {bookingList
              .filter((item) => item.show.appointmentStatus !== 'CANCELLED')
              .map((item, idx) => (
                <tr key={idx} className={styles.tableRow}>
                  <td className={`${styles.tableCell} ${styles.indexCell}`}>
                    {idx + 1}
                  </td>
                  <td className={`${styles.tableCell} ${styles.dateCell}`}>
                    {item.show.appointmentDate}
                  </td>
                  <td className={styles.tableCell}>
                    <span
                      className={getStatusBadgeClass(
                        item.show.appointmentStatus
                      )}
                    >
                      {getStatusText(item.show.appointmentStatus)}
                    </span>
                  </td>
                  <td className={`${styles.tableCell} ${styles.serviceCell}`}>
                    {item.services.map((s) => s.serviceName).join(', ')}
                  </td>
                  <td className={`${styles.tableCell} ${styles.typeCell}`}>
                    <span
                      className={getTypeBadgeClass(item.show.appointmentType)}
                    >
                      {translateAppointmentType(item.show.appointmentType)}
                    </span>
                  </td>
                  <td className={`${styles.tableCell} ${styles.actionCell}`}>
                    <div className={styles.actionButtons}>
                      {/* Hủy */}
                      {(!item.payments[0].getPaymentStatus ||
                        item.payments[0].getPaymentStatus === 'PENDING') &&
                        item.show.appointmentStatus !== 'COMPLETED' && (
                          <button
                            type="button"
                            className={`${styles.actionButton} ${styles.cancelButton}`}
                            onClick={() =>
                              handleCanceled(item.show.appointmentId.toString())
                            }
                            title="Hủy cuộc hẹn"
                          >
                            <FaTimes />
                          </button>
                        )}

                      {/* Thanh toán */}
                      {item.payments.length > 0 &&
                        (!item.payments[0].getPaymentStatus ||
                          item.payments[0].getPaymentStatus === 'PENDING') &&
                        item.payments[0].paymentId &&
                        item.services.length > 0 &&
                        item.services[0].serviceId &&
                        (item.show.appointmentStatus === 'CONFIRMED' ||
                          item.show.appointmentType === 'HOME') && (
                          <button
                            className={`${styles.actionButton} ${styles.paymentButton}`}
                            onClick={() =>
                              handlePayment(
                                item.payments[0].paymentId,
                                item.services[0].serviceId
                              )
                            }
                            title="Thanh toán"
                          >
                            <FaMoneyBillWave />
                          </button>
                        )}
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    {item.show.appointmentStatus === 'COMPLETED' && (
                      <>
                        {/* "Xem kết quả" Button */}
                        <button
                          className={`${styles.actionButton} ${styles.viewButton}`}
                          onClick={
                            () => navigate(`/result/${item.show.appointmentId}`) // Navigate to results page
                          }
                          title="Xem kết quả"
                        >
                          <FaEye />
                        </button>

                        {/* "Đánh giá" Button */}
                        <button
                          className={`${styles.actionButton} ${styles.viewButton}`}
                          onClick={
                            () =>
                              navigate(
                                `/feedback/${item.services[0].serviceId}`
                              ) // Navigate to the feedback page
                          }
                          title="Đánh giá"
                        >
                          Đánh giá
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết */}
      {/* {showModal && selectedBooking && (
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
      )} */}
    </div>
  );
};

export default Booking;
