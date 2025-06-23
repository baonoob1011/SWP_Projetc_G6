/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const GetAppointmentByAdmin = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<{ [key: number]: string }>(
    {}
  );

  // Lấy danh sách lịch hẹn
  const fetchAppointments = async () => {
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
        toast.error('Không thể lấy danh sách cuộc hẹn');
      } else {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (error) {
      console.log(error);
      toast.warning('Không thể kết nối hệ thống');
    }
  };

  // Lấy danh sách nhân viên tại nhà
  const fetchStaffList = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        'http://localhost:8080/api/staff/get-all-staff-at-home',
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        toast.error('Không thể lấy danh sách nhân viên');
        return;
      }
      const data = await res.json();
      setStaffList(data);
    } catch (error) {
      console.log(error);
      toast.error('Không thể kết nối hệ thống');
    }
  };

  // Gán nhân viên cho cuộc hẹn
  const handleAssignStaff = async (appointmentId: number, staffId: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/appointment/update-staff-to-appointment-at-home?staffId=${staffId}&appointmentId=${appointmentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!res.ok) {
        toast.error('Cập nhật thất bại');
      } else {
        toast.success('Gán nhân viên thành công');
        fetchAppointments(); // reload lại danh sách
      }
    } catch (error) {
      console.log(error);
      toast.warning('Không thể kết nối hệ thống');
    }
  };

  // Khi trang tải: lấy localStorage + gọi API
  useEffect(() => {
    const stored = localStorage.getItem('selectedStaff');
    if (stored) {
      setSelectedStaff(JSON.parse(stored));
    }
    fetchAppointments();
    fetchStaffList();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">Danh sách lịch hẹn tại nhà</h3>

      {appointments.length === 0 ? (
        <p className="text-muted">Không có dữ liệu cuộc hẹn nào.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>Ngày hẹn</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
                <th>Loại lịch</th>
                <th>Chọn nhân viên</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item: any, index: number) => {
                const appointmentId = item.appointmentResponse.appointmentId;
                const currentStaffId =
                  selectedStaff[appointmentId] ||
                  item.staffAppointmentResponse?.staffId ||
                  '';

                return (
                  <tr key={index}>
                    <td>
                      {new Date(
                        item.appointmentResponse.appointmentDate
                      ).toLocaleDateString()}
                    </td>
                    <td>{item.appointmentResponse.appointmentStatus}</td>
                    <td>{item.appointmentResponse.note || 'Không có'}</td>
                    <td>{item.appointmentResponse.appointmentType}</td>
                    <td>
                      <select
                        className="form-select"
                        value={currentStaffId}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const updated = {
                            ...selectedStaff,
                            [appointmentId]: selectedId,
                          };
                          setSelectedStaff(updated);
                          localStorage.setItem(
                            'selectedStaff',
                            JSON.stringify(updated)
                          );

                          if (selectedId) {
                            handleAssignStaff(appointmentId, selectedId);
                          }
                        }}
                      >
                        <option value="">-- Chọn nhân viên --</option>
                        {staffList.map((staff) => (
                          <option key={staff.staffId} value={staff.staffId}>
                            {staff.fullName}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GetAppointmentByAdmin;
