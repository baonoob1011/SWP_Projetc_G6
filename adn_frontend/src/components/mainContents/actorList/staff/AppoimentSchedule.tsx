import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type Appointment = {
  appointmentId: string;
  appointmentDate: string;
  appointmentStatus: string;
  note: string;
  userId: string;
  slotId?: string;
  serviceId: string;
  locationId?: string;
  appointmentType: 'HOME' | 'CENTER';
};

const AppointmentSchedule = () => {
  const [centerSchedule, setCenterSchedule] = useState<Appointment[]>([]);
  const [homeSchedule, setHomeSchedule] = useState<Appointment[]>([]);
  const [loadingCenter, setLoadingCenter] = useState(false);
  const [loadingHome, setLoadingHome] = useState(false);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    setAuth(localStorage.getItem('role') === 'STAFF');
  }, []);

  const fetchSchedule = async () => {
    const token = localStorage.getItem('token');
    setLoadingCenter(true);
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
      if (res.ok) {
        setCenterSchedule(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCenter(false);
    }
  };

  const fetchScheduleAtHome = async () => {
    const token = localStorage.getItem('token');
    setLoadingHome(true);
    try {
      const res = await fetch(
        'http://localhost:8080/api/appointment/get-appointment-at-home-by-staff',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        const filteredData = data.filter(
          (item: Appointment) => item.appointmentType === 'HOME'
        );
        setHomeSchedule(filteredData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingHome(false);
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

      if (res.ok) {
        toast.success('Xác nhận lịch tại trung tâm thành công');
        fetchSchedule();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckAtHome = async (
    appointmentId: string,
    userId: string,
    serviceId: string
  ) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        `http://localhost:8080/api/appointment/confirm-appointment-at-home?appointmentId=${appointmentId}&userId=${userId}&serviceId=${serviceId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        toast.success('Xác nhận lịch tại nhà thành công');
        fetchScheduleAtHome();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);
  useEffect(() => {
    fetchScheduleAtHome();
  }, []);

  if (!auth) return null;

  return (
    <div className="container mt-4">
      {/* Lịch Trung Tâm */}
      {loadingCenter || centerSchedule.length > 0 ? (
        <>
          <h4 className="text-center text-primary mb-4">
            Lịch Hẹn Tại Trung Tâm
          </h4>
          <div className="table-responsive mb-5">
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
                {loadingCenter ? (
                  <tr>
                    <td colSpan={4} className="text-center text-secondary">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : (
                  centerSchedule.map((item, index) => (
                    <tr key={index} className="align-middle text-center">
                      <td>{item.appointmentDate}</td>
                      <td>
                        <span className="bg-warning text-dark px-2 py-1 rounded">
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
                              item.slotId!,
                              item.serviceId,
                              item.locationId!
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
        </>
      ) : null}

      {/* Lịch Tại Nhà */}
      {loadingHome ||
      homeSchedule.some((item) => item.note === 'Đã thanh toán') ? (
        <>
          <h4 className="text-center text-success mb-4">Lịch Hẹn Tại Nhà</h4>
          <div className="table-responsive">
            <table className="table table-hover border shadow-sm">
              <thead className="table-success text-center">
                <tr>
                  <th>Ngày Hẹn</th>
                  <th>Trạng Thái</th>
                  <th>Ghi Chú</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {loadingHome ? (
                  <tr>
                    <td colSpan={4} className="text-center text-secondary">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : (
                  homeSchedule
                    .filter((item) => item.note === 'Đã thanh toán')
                    .map((item, index) => (
                      <tr key={index} className="align-middle text-center">
                        <td>{item.appointmentDate}</td>
                        <td>
                          <span className="bg-warning text-dark px-2 py-1 rounded">
                            {item.appointmentStatus}
                          </span>
                        </td>
                        <td>{item.note}</td>
                        <td>
                          <button
                            onClick={() =>
                              handleCheckAtHome(
                                item.appointmentId,
                                item.serviceId,
                                item.userId
                              )
                            }
                            className="btn btn-outline-success btn-sm"
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
        </>
      ) : null}
    </div>
  );
};

export default AppointmentSchedule;
