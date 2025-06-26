/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './AppointmentSchedule.module.css';

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
  const [centerSchedule, setCenterSchedule] = useState<any[]>([]);
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

  // Kiểm tra có dữ liệu không
  const hasData =
    centerSchedule.length > 0 ||
    homeSchedule.some((item) => item.note === 'Đã thanh toán');
  const isLoading = loadingCenter || loadingHome;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Danh Sách Lịch Hẹn</h1>

      {/* Hiển thị thông báo trống khi không có dữ liệu và không đang loading */}
      {!hasData && !isLoading && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📋</div>
          <div className={styles.emptyStateText}>Danh sách lịch hẹn trống</div>
        </div>
      )}

      {/* Lịch Trung Tâm */}
      {loadingCenter || centerSchedule.length > 0 ? (
        <>
          <div className={styles.tableWrapper}>
            <table className={`table ${styles.table}`}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th>Ngày Hẹn</th>
                  <th>Trạng Thái</th>
                  <th>Dịch vụ</th>
                  <th>Thời gian</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {loadingCenter ? (
                  <tr>
                    <td colSpan={4} className={styles.loadingText}>
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : (
                  centerSchedule
                    .filter(
                      (item) =>
                        item.showAppointmentResponse.appointmentStatus ===
                        'PENDING'
                    )
                    .map((item, index: number) => (
                      <tr key={index}>
                        <td>{item.showAppointmentResponse.appointmentDate}</td>
                        <td>
                          <span
                            className={`${styles.statusBadge} ${styles.statusPending}`}
                          >
                            {item.showAppointmentResponse.appointmentStatus}
                          </span>
                        </td>
                        <td>
                          {item.serviceAppointmentResponses
                            .map((s: any) => s.serviceName)
                            .join(', ')}
                        </td>
                        <td>
                          {item.slotAppointmentResponse
                            .map((s: any) => s.startTime)
                            .join(', ')}
                          {' - '}
                          {item.slotAppointmentResponse
                            .map((s: any) => s.endTime)
                            .join(', ')}
                        </td>

                        <td>
                          <button
                            onClick={() =>
                              handleCheck(
                                item.showAppointmentResponse.appointmentId.toString(),
                                item.userAppointmentResponses.userId.toString(),
                                item.slotAppointmentResponse[0].slotId.toString(),
                                item.serviceAppointmentResponses[0].serviceId.toString(),
                                item.locationAppointmentResponses[0].locationId.toString()
                              )
                            }
                            className={styles.confirmBtn}
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
          <div className={styles.tableWrapper}>
            <table className={`table ${styles.table}`}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th>Ngày Hẹn</th>
                  <th>Trạng Thái</th>
                  <th>Ghi Chú</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {loadingHome ? (
                  <tr>
                    <td colSpan={4} className={styles.loadingText}>
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : (
                  homeSchedule
                    .filter((item) => item.note === 'Đã thanh toán')
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{item.appointmentDate}</td>
                        <td>
                          <span
                            className={`${styles.statusBadge} ${styles.statusPending}`}
                          >
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
                            className={`${styles.confirmBtn} ${styles.confirmBtnHome}`}
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
