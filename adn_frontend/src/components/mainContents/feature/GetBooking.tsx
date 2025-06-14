/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
  paymentId: string;
  amount: string;
  paymentMethod: string;
  getPaymentStatus: string;
  transitionDate: string;
};

const GetAppointment = () => {
  const navigate = useNavigate();
  const [patientOne, setPatientOne] = useState<Patient[]>([]);
  const [patientTwo, setPatientTwo] = useState<Patient[]>([]);
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
          const res = data[0];

          const patients: Patient[] = res.patientAppointmentResponse || [];
          setPatientOne(patients.length > 0 ? [patients[0]] : []);
          setPatientTwo(patients.length > 1 ? [patients[1]] : []);

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

  const handlePayment = async (paymentId: string, serviceId: string) => {
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
        toast.success('Thành công');
        window.location.href = redirectUrl;
      } else {
        toast.error('bị lỗi');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const paymentId = paymentResponse[0]?.paymentId || '';
  const serviceId = serviceResponse[0]?.serviceId.toString() || '';

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handlePayment(paymentId, serviceId);
      }}
    >
      <div className="container py-5">
        <h3 className="mb-4 text-center text-primary">
          Thông tin chi tiết cuộc hẹn
        </h3>
        <div className="table-responsive">
          <table className="table table-bordered">
            <tbody>
              {/* Cuộc hẹn */}
              {showResponse && (
                <>
                  <tr className="table-primary">
                    <th colSpan={2}>Thông tin cuộc hẹn</th>
                  </tr>
                  <tr>
                    <td>ID</td>
                    <td>{showResponse.appointmentId}</td>
                  </tr>
                  <tr>
                    <td>Ngày hẹn</td>
                    <td>{showResponse.appointmentDate}</td>
                  </tr>
                  <tr>
                    <td>Trạng thái</td>
                    <td>{showResponse.appointmentStatus}</td>
                  </tr>
                  <tr>
                    <td>Ghi chú</td>
                    <td>{showResponse.note || 'Không có'}</td>
                  </tr>
                </>
              )}

              {/* Người dùng */}
              {user.map((u, i) => (
                <>
                  <tr key={`user-title-${i}`} className="table-primary">
                    <th colSpan={2}>Người dùng đặt lịch</th>
                  </tr>
                  <tr>
                    <td>Họ tên</td>
                    <td>{u.fullName}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{u.email}</td>
                  </tr>
                  <tr>
                    <td>SĐT</td>
                    <td>{u.phone}</td>
                  </tr>
                  <tr>
                    <td>Địa chỉ</td>
                    <td>{u.address || 'Không có'}</td>
                  </tr>
                </>
              ))}

              {/* Nhân viên */}
              {staff.map((s, i) => (
                <>
                  <tr key={`staff-title-${i}`} className="table-primary">
                    <th colSpan={2}>Nhân viên thực hiện</th>
                  </tr>
                  <tr>
                    <td>Họ tên</td>
                    <td>{s.fullName}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{s.email}</td>
                  </tr>
                  <tr>
                    <td>SĐT</td>
                    <td>{s.phone}</td>
                  </tr>
                </>
              ))}

              {/* Bệnh nhân 1 */}
              {patientOne.map((p) => (
                <>
                  <tr key={`p1-${p.patientId}`} className="table-primary">
                    <th colSpan={2}>Người bệnh thứ nhất</th>
                  </tr>
                  <tr>
                    <td>Họ tên</td>
                    <td>{p.fullName}</td>
                  </tr>
                  <tr>
                    <td>Ngày sinh</td>
                    <td>{p.dateOfBirth}</td>
                  </tr>
                  <tr>
                    <td>Giới tính</td>
                    <td>{p.gender}</td>
                  </tr>
                  <tr>
                    <td>Mối quan hệ</td>
                    <td>{p.relationship}</td>
                  </tr>
                </>
              ))}

              {/* Bệnh nhân 2 */}
              {patientTwo.map((p) => (
                <>
                  <tr key={`p2-${p.patientId}`} className="table-primary">
                    <th colSpan={2}>Người bệnh thứ hai</th>
                  </tr>
                  <tr>
                    <td>Họ tên</td>
                    <td>{p.fullName}</td>
                  </tr>
                  <tr>
                    <td>Ngày sinh</td>
                    <td>{p.dateOfBirth}</td>
                  </tr>
                  <tr>
                    <td>Giới tính</td>
                    <td>{p.gender}</td>
                  </tr>
                  <tr>
                    <td>Mối quan hệ</td>
                    <td>{p.relationship}</td>
                  </tr>
                </>
              ))}

              {/* Slot */}
              {slotResponse.map((slot, i) => (
                <>
                  <tr key={`slot-${i}`} className="table-primary">
                    <th colSpan={2}>Khung giờ</th>
                  </tr>
                  <tr>
                    <td>Ngày</td>
                    <td>{slot.slotDate}</td>
                  </tr>
                  <tr>
                    <td>Bắt đầu</td>
                    <td>{slot.startTime}</td>
                  </tr>
                  <tr>
                    <td>Kết thúc</td>
                    <td>{slot.endTime}</td>
                  </tr>
                </>
              ))}

              {/* Dịch vụ */}
              {serviceResponse.map((s, i) => (
                <>
                  <tr key={`sv-${i}`} className="table-primary">
                    <th colSpan={2}>Dịch vụ</th>
                  </tr>
                  <tr>
                    <td>Tên dịch vụ</td>
                    <td>{s.serviceName}</td>
                  </tr>
                  <tr>
                    <td>Ngày đăng ký</td>
                    <td>{s.registerDate}</td>
                  </tr>
                  <tr>
                    <td>Mô tả</td>
                    <td>{s.description}</td>
                  </tr>
                  <tr>
                    <td>Loại dịch vụ</td>
                    <td>{s.serviceType}</td>
                  </tr>
                </>
              ))}

              {/* Địa điểm */}
              {locationResponse.map((loc, i) => (
                <>
                  <tr key={`loc-${i}`} className="table-primary">
                    <th colSpan={2}>Địa điểm</th>
                  </tr>
                  <tr>
                    <td>Địa chỉ</td>
                    <td>
                      {loc.addressLine}, {loc.district}, {loc.city}
                    </td>
                  </tr>
                </>
              ))}

              {/* Phòng */}
              {roomResponse && (
                <>
                  <tr className="table-primary">
                    <th colSpan={2}>Phòng xét nghiệm</th>
                  </tr>
                  <tr>
                    <td>Tên phòng</td>
                    <td>{roomResponse.roomName}</td>
                  </tr>
                </>
              )}

              {/* Thanh toán */}
              {paymentResponse.map((pay, i) => (
                <>
                  <tr key={`pay-${i}`} className="table-primary">
                    <th colSpan={2}>Thanh toán</th>
                  </tr>
                  <tr>
                    <td>Phương thức</td>
                    <td>{pay.paymentMethod}</td>
                  </tr>
                  <tr>
                    <td>Số tiền</td>
                    <td>{pay.amount.toLocaleString()} VND</td>
                  </tr>
                  <tr>
                    <td>Trạng thái</td>
                    <td>{pay.getPaymentStatus}</td>
                  </tr>
                  <tr>
                    <td>Ngày giao dịch</td>
                    <td>{pay.transitionDate}</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nút hành động */}
        <div className="d-flex justify-content-end gap-3 mt-4">
          <button type="submit" className="btn btn-primary">
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
        </div>
      </div>
    </form>
  );
};

export default GetAppointment;
