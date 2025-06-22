import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type Appointment = {
  appointmentId: string;
  appointmentDate: string;
  appointmentStatus: string;
  note: string;
  userId: string;
  slotId: string;
  serviceId: string;
  locationId: string;
};

const AppointmentSchedule = () => {
  const [schedule, setSchedule] = useState<Appointment[]>([]);
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    setAuth(localStorage.getItem('role') === 'STAFF');
  });
  const fetchSchedule = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        'http://localhost:8080/api/staff/get-appointment-by-staff',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.warning('Không có dữ liệu');
      } else {
        setSchedule(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheck = async (
    appointmentId: string,
    userId: string,
    slotId: string,
    serviceId: string,
    locationId: string
  ) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        `http://localhost:8080/api/appointment/confirm-appointment-at-center?appointmentId=${appointmentId}&userId=${userId}&slotId=${slotId}&serviceId=${serviceId}&locationId=${locationId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        toast.warning('Không có dữ liệu');
      } else {
        toast.success('thành công');
        fetchSchedule();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  if (!auth) {
    return;
  }

  return (
    <div className="container mt-4">
      <h4 className="text-center text-primary mb-4">Lịch Hẹn Của Nhân Viên</h4>

      <div className="table-responsive">
        <table className="table table-hover border shadow-sm">
          <thead className="table-primary text-center">
            <tr>
              <th>Ngày Hẹn</th>
              <th>Trạng Thái</th>
              <th>Ghi Chú</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {schedule.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-secondary">
                  Không có lịch hẹn
                </td>
              </tr>
            ) : (
              schedule.map((item, index) => (
                <tr key={index} className="align-middle text-center">
                  <td>{item.appointmentDate}</td>
                  <td>
                    <span className={'bg-warning text-dark'}>
                      {item.appointmentStatus}
                    </span>
                  </td>
                  <td>{item.note}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleCheck(
                          item.appointmentId,
                          item.userId,
                          item.slotId,
                          item.serviceId,
                          item.locationId
                        )
                      }
                      className="btn btn-outline-primary btn-sm"
                    >
                      Xác Nhận
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentSchedule;
