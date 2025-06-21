/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
  paymentId: string;
  amount: string;
  paymentMethod: string;
  getPaymentStatus: string;
  transitionDate: string;
};

const GetAppointment = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [user, setUser] = useState<User[]>([]);
  const [showResponse, setShowResponse] = useState<ShowResponse | null>(null);
  const [slotResponse, setSlotResponse] = useState<SlotResponse[]>([]);
  const [serviceResponse, setServiceResponse] = useState<ServiceResponse[]>([]);
  const [locationResponse, setLocationResponse] = useState<LocationResponse[]>(
    []
  );
  const [roomResponse, setRoomResponse] = useState<RoomResponse | null>(null);
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/api/appointment/get-appointment-at-home', {
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
          const res = data[0];
          setStaff(res.staffAppointmentResponse || []);
          setUser(res.userAppointmentResponse || []);
          setShowResponse(res.showAppointmentResponse || null);
          setSlotResponse(res.slotAppointmentResponse || []);
          setServiceResponse(res.serviceAppointmentResponses || []);
          setLocationResponse(res.locationAppointmentResponses || []);
          setRoomResponse(res.roomAppointmentResponse || null);
          setPaymentResponse(res.paymentAppointmentResponse || []);
        } else {
          setError('Không có dữ liệu cuộc hẹn.');
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
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
        navigate('/service/civil');
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
        console.error('❌ Error response:', redirectUrl);
        toast.error('Thanh toán thất bại!');
      }
    } catch (error) {
      console.log('❌ Lỗi hệ thống:', error);
      toast.error('Lỗi hệ thống');
    }
  };

  const paymentId = paymentResponse[0]?.paymentId || '';
  const serviceId = serviceResponse[0]?.serviceId.toString() || '';

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Đang tải dữ liệu...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Lỗi: {error}
      </div>
    );

  return (
    <div className="container my-5">
      <h3 className="text-center text-primary mb-4">
        Thông tin chi tiết cuộc hẹn
      </h3>

      <div className="card border shadow-sm">
        <div className="card-body">
          {/* Người dùng - đặt lên đầu và căn trái */}
          {user.map((u, i) => (
            <div key={`user-${i}`} className="mb-4 text-start">
              <h5 className="mb-3 border-bottom pb-2">Người dùng đặt lịch</h5>

              <div className="row mb-2">
                <div className="col-md-2 fw-bold">Họ tên:</div>
                <div className="col-md-4">{u.fullName}</div>

                <div className="col-md-2 fw-bold">Email:</div>
                <div className="col-md-4">{u.email}</div>
              </div>

              <div className="row mb-2">
                <div className="col-md-2 fw-bold">SĐT:</div>
                <div className="col-md-4">{u.phone}</div>

                <div className="col-md-2 fw-bold">Địa chỉ:</div>
                <div className="col-md-4">{u.address || 'Không có'}</div>
              </div>
            </div>
          ))}

          <div className="row">
            {/* Cột trái */}
            <div className="col-lg-6">
              {showResponse && (
                <div className="mb-4 text-start">
                  <h5 className="mb-3 border-bottom pb-2 d-inline-block">
                    Thông tin cuộc hẹn
                  </h5>
                  <div>
                    <p>
                      <strong>Trạng thái:</strong>{' '}
                      {showResponse.appointmentStatus}
                    </p>
                    <p>
                      <strong>Ghi chú:</strong>{' '}
                      {showResponse.note || 'Không có'}
                    </p>
                  </div>
                </div>
              )}

              {slotResponse.map((slot, i) => (
                <div key={`slot-${i}`} className="mb-4 text-start">
                  <h5 className="mb-3 border-bottom pb-2 d-inline-block">
                    Khung giờ
                  </h5>
                  <div>
                    <p>
                      <strong>Ngày:</strong> {slot.slotDate}
                    </p>
                    <p>
                      <strong>Bắt đầu:</strong> {slot.startTime}
                    </p>
                    <p>
                      <strong>Kết thúc:</strong> {slot.endTime}
                    </p>
                  </div>
                </div>
              ))}

              {serviceResponse.map((s, i) => (
                <div key={`service-${i}`} className="mb-4 text-start">
                  <h5 className="mb-3 border-bottom pb-2 d-inline-block">
                    Dịch vụ
                  </h5>
                  <div>
                    <p>
                      <strong>Tên dịch vụ:</strong> {s.serviceName}
                    </p>
                    <p>
                      <strong>Ngày đăng ký:</strong> {s.registerDate}
                    </p>
                    <p>
                      <strong>Mô tả:</strong> {s.description}
                    </p>
                    <p>
                      <strong>Loại dịch vụ:</strong> {s.serviceType}
                    </p>
                  </div>
                </div>
              ))}

              {locationResponse.map((loc, i) => (
                <div key={`location-${i}`} className="mb-4 text-start">
                  <h5 className="mb-3 border-bottom pb-2 d-inline-block">
                    Địa điểm
                  </h5>
                  <div>
                    <p>
                      <strong>Địa chỉ:</strong> {loc.addressLine},{' '}
                      {loc.district}, {loc.city}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cột phải */}
            <div className="col-lg-6">
              {staff.map((s, i) => (
                <div key={`staff-${i}`} className="mb-4 text-start">
                  <h5 className="mb-3 border-bottom pb-2 d-inline-block">
                    Nhân viên thực hiện
                  </h5>
                  <div>
                    <p>
                      <strong>Họ tên:</strong> {s.fullName}
                    </p>
                    <p>
                      <strong>Email:</strong> {s.email}
                    </p>
                    <p>
                      <strong>SĐT:</strong> {s.phone}
                    </p>
                  </div>
                </div>
              ))}
              {roomResponse && (
                <div className="mb-4 text-start">
                  <h5 className="mb-3 border-bottom pb-2 d-inline-block">
                    Phòng xét nghiệm
                  </h5>
                  <div>
                    <p>
                      <strong>Tên phòng:</strong> {roomResponse.roomName}
                    </p>
                  </div>
                </div>
              )}

              {paymentResponse.map((pay, i) => (
                <div key={`payment-${i}`} className="mb-4 text-start">
                  <h5 className="mb-3 border-bottom pb-2 d-inline-block">
                    Thanh toán
                  </h5>
                  <div>
                    <p>
                      <strong>Phương thức:</strong> {pay.paymentMethod}
                    </p>
                    <p>
                      <strong>Số tiền:</strong> {pay.amount.toLocaleString()}{' '}
                      VND
                    </p>
                    <p>
                      <strong>Trạng thái:</strong>{' '}
                      {pay.getPaymentStatus || 'Không xác định'}
                    </p>
                    <p>
                      <strong>Ngày giao dịch:</strong> {pay.transitionDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nút hành động - giữ căn giữa */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePayment(Number(paymentId), Number(serviceId));
            }}
            className="mt-4 text-center"
          >
            <button type="submit" className="btn btn-primary me-2">
              Thanh toán
            </button>
            {showResponse && (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() =>
                  handleCanceled(showResponse.appointmentId.toString())
                }
              >
                Hủy cuộc hẹn
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default GetAppointment;
