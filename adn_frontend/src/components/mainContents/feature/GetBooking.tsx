/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';

type AppointmentData = {
  patientAppointmentResponse: {
    patientId: number;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    relationship: string;
  }[];
  staffAppointmentResponse: {
    staffId: number;
    fullName: string;
    email: string;
    phone: string;
  }[];
  userAppointmentResponse: {
    userId: number;
    address: string | null;
    fullName: string;
    phone: string;
    email: string;
  }[];
  showAppointmentResponse: {
    appointmentId: number;
    appointmentDate: string;
    appointmentStatus: string;
    note: string | null;
  };
  slotAppointmentResponse: {
    slotId: number;
    slotDate: string;
    startTime: string;
    endTime: string;
  }[];
  serviceAppointmentResponses: {
    serviceId: number;
    serviceName: string;
    registerDate: string;
    description: string;
    serviceType: string;
  }[];
  locationAppointmentResponses: {
    locationId: number;
    addressLine: string;
    district: string;
    city: string;
  }[];
  roomAppointmentResponse: {
    roomName: string;
  };
  priceAppointmentResponse: {
    priceId: number;
    price: number;
    time: string;
  }[];
};

const GetAppointment = () => {
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:8080/api/appointment/get-appointment', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Lỗi khi gọi API');
        return res.json();
      })
      .then((data) => {
        setAppointment(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!appointment) return <div>Không có dữ liệu</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>📅 Thông tin cuộc hẹn</h2>

      <h3>📝 Cuộc hẹn</h3>
      <p>
        <b>ID:</b> {appointment.showAppointmentResponse.appointmentId}
      </p>
      <p>
        <b>Ngày hẹn:</b> {appointment.showAppointmentResponse.appointmentDate}
      </p>
      <p>
        <b>Trạng thái:</b>{' '}
        {appointment.showAppointmentResponse.appointmentStatus}
      </p>
      <p>
        <b>Ghi chú:</b> {appointment.showAppointmentResponse.note || 'Không có'}
      </p>

      <h3>🧍 Người dùng đặt lịch</h3>
      {appointment.userAppointmentResponse.map((u) => (
        <div key={u.userId}>
          <p>
            <b>Họ tên:</b> {u.fullName}
          </p>
          <p>
            <b>Email:</b> {u.email}
          </p>
          <p>
            <b>SĐT:</b> {u.phone}
          </p>
          <p>
            <b>Địa chỉ:</b> {u.address || 'Không có'}
          </p>
        </div>
      ))}

      <h3>👤 Nhân viên thực hiện</h3>
      {appointment.staffAppointmentResponse.map((s) => (
        <div key={s.staffId}>
          <p>
            <b>Họ tên:</b> {s.fullName}
          </p>
          <p>
            <b>Email:</b> {s.email}
          </p>
          <p>
            <b>SĐT:</b> {s.phone}
          </p>
        </div>
      ))}

      <h3>🧒 Danh sách bệnh nhân</h3>
      {appointment.patientAppointmentResponse.map((p) => (
        <div key={p.patientId}>
          <p>
            <b>Họ tên:</b> {p.fullName}
          </p>
          <p>
            <b>Ngày sinh:</b> {p.dateOfBirth}
          </p>
          <p>
            <b>Giới tính:</b> {p.gender}
          </p>
          <p>
            <b>Mối quan hệ:</b> {p.relationship}
          </p>
        </div>
      ))}

      <h3>⏰ Khung giờ</h3>
      {appointment.slotAppointmentResponse.map((slot) => (
        <div key={slot.slotId}>
          <p>
            <b>Ngày:</b> {slot.slotDate}
          </p>
          <p>
            <b>Bắt đầu:</b> {slot.startTime}
          </p>
          <p>
            <b>Kết thúc:</b> {slot.endTime}
          </p>
        </div>
      ))}

      <h3>💼 Dịch vụ</h3>
      {appointment.serviceAppointmentResponses.map((s) => (
        <div key={s.serviceId}>
          <p>
            <b>Tên dịch vụ:</b> {s.serviceName}
          </p>
          <p>
            <b>Ngày đăng ký:</b> {s.registerDate}
          </p>
          <p>
            <b>Mô tả:</b> {s.description}
          </p>
          <p>
            <b>Loại dịch vụ:</b> {s.serviceType}
          </p>
        </div>
      ))}

      <h3>📍 Địa điểm</h3>
      {appointment.locationAppointmentResponses.map((loc, index) => (
        <div key={index}>
          <p>
            <b>Địa chỉ:</b> {loc.addressLine}, {loc.district}, {loc.city}
          </p>
        </div>
      ))}

      <h3>🏢 Phòng xét nghiệm</h3>
      <p>
        <b>Tên phòng:</b> {appointment.roomAppointmentResponse.roomName}
      </p>

      <h3>💰 Giá</h3>
      {appointment.priceAppointmentResponse.map((price) => (
        <div key={price.priceId}>
          <p>
            <b>Giá:</b> {price.price.toLocaleString()} VND
          </p>
          <p>
            <b>Thời gian trả kết quả:</b> {price.time}
          </p>
        </div>
      ))}
    </div>
  );
};

export default GetAppointment;
