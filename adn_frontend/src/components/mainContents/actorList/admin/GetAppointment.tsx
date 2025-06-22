/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const GetAppointmentByAdmin = () => {
  const [appointment, setAppointment] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/appointment/get-appointment-at-home-by-admin',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!res.ok) {
        toast.error('Không thể lấy danh sách');
      } else {
        const data = await res.json();
        setAppointment(data);
      }
    } catch (error) {
      console.log(error);
      toast.warning('không thẻ kết nối hệ thống');
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">Danh sách lịch hẹn tại nhà</h3>

      {appointment.length === 0 ? (
        <p className="text-muted">Không có dữ liệu cuộc hẹn nào.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>Ngày hẹn</th>
                <th>Trạng thái</th>
                <th>Loại lịch</th>
                <th>Nhân viên ID</th>
                <th>Dịch vụ ID</th>
                <th>Người dùng ID</th>
              </tr>
            </thead>
            <tbody>
              {appointment.map((item, index) => (
                <tr key={index}>
                  <td>{new Date(item.appointmentDate).toLocaleDateString()}</td>
                  <td>{item.appointmentStatus}</td>
                  <td>{item.appointmentType}</td>
                  <td>{item.staffId}</td>
                  <td>{item.serviceId}</td>
                  <td>{item.userId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GetAppointmentByAdmin;
