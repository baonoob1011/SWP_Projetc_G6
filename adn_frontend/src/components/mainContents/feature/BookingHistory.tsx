import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// ==== TYPES ====
type Patient = {
  patientId: number;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  relationship: string;
};

type Staff = {
  staffId: number;
  fullName: string;
  email: string;
  phone: string;
};

type User = {
  userId: number;
  address: string | null;
  fullName: string;
  phone: string;
  email: string;
};

type ShowResponse = {
  appointmentId: number;
  appointmentDate: string;
  appointmentStatus: string;
  note: string | null;
};

type SlotResponse = {
  slotId: number;
  slotDate: string;
  startTime: string;
  endTime: string;
};

type ServiceResponse = {
  serviceId: number;
  serviceName: string;
  registerDate: string;
  description: string;
  serviceType: string;
};

type LocationResponse = {
  locationId: number;
  addressLine: string;
  district: string;
  city: string;
};

type RoomResponse = {
  roomName: string;
};

type PaymentResponse = {
  paymentId: number;
  amount: string;
  paymentMethod: string;
  getPaymentStatus: string;
  transitionDate: string;
};

type BookingHistoryItem = {
  show: ShowResponse;
  patients: Patient[];
  staff: Staff[];
  user: User[];
  slot: SlotResponse[];
  services: ServiceResponse[];
  location: LocationResponse[];
  room: RoomResponse | null;
  payments: PaymentResponse[];
};

// ==== COMPONENT ====
const BookingHistory = () => {
  const [bookingList, setBookingList] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingHistoryItem | null>(null);
  const [showModal, setShowModal] = useState(false);

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
        if (Array.isArray(data) && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const fullList: BookingHistoryItem[] = data.map((res: any) => ({
            show: res.showAppointmentResponse,
            patients: res.patientAppointmentResponse || [],
            staff: res.staffAppointmentResponse || [],
            user: res.userAppointmentResponse || [],
            slot: res.slotAppointmentResponse || [],
            services: res.serviceAppointmentResponses || [],
            location: res.locationAppointmentResponses || [],
            room: res.roomAppointmentResponse || null,
            payments: res.paymentAppointmentResponse || [],
          }));
          setBookingList(fullList);
        } else {
          setError('Không có dữ liệu cuộc hẹn.');
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
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {bookingList.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{item.show.appointmentDate}</td>
                  <td>{item.show.appointmentStatus}</td>
                  <td>{item.services.map((s) => s.serviceName).join(', ')}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setSelectedBooking(item);
                        setShowModal(true);
                      }}
                    >
                      Xem thêm
                    </button>
                    {item.show.appointmentId && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() =>
                          handleCanceled(item.show.appointmentId.toString())
                        }
                      >
                        Hủy cuộc hẹn
                      </button>
                    )}
                    {item.payments.length > 0 &&
                      (!item.payments[0].getPaymentStatus ||
                        item.payments[0].getPaymentStatus === 'UNPAID') &&
                      item.payments[0].paymentId &&
                      item.services.length > 0 &&
                      item.services[0].serviceId && (
                        <button
                          className="btn btn-success btn-sm ms-2"
                          onClick={() =>
                            handlePayment(
                              item.payments[0].paymentId,
                              item.services[0].serviceId
                            )
                          }
                        >
                          Thanh toán
                        </button>
                      )}
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
                  Chi tiết cuộc hẹn #{selectedBooking.show.appointmentId}
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
                  {selectedBooking.show.appointmentStatus}
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
                <p>
                  <strong>Phòng:</strong>{' '}
                  {selectedBooking.room?.roomName || 'Không xác định'}
                </p>
                <p>
                  <strong>Slot:</strong> {selectedBooking.slot[0]?.slotDate} |{' '}
                  {selectedBooking.slot[0]?.startTime} -{' '}
                  {selectedBooking.slot[0]?.endTime}
                </p>

                <hr />
                <p>
                  <strong>Thanh toán:</strong>
                  {selectedBooking.payments.length > 0
                    ? `${selectedBooking.payments[0].amount} (${selectedBooking.payments[0].getPaymentStatus})`
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

export default BookingHistory;
