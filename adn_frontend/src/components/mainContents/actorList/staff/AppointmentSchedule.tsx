/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './AppointmentSchedule.module.css';

const AppointmentSchedule = () => {
  const [homeSchedule, setHomeSchedule] = useState<any[]>([]);
  const [loadingHome, setLoadingHome] = useState(false);
  const [loadingRowId, setLoadingRowId] = useState<string | null>(null);

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
        setHomeSchedule(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingHome(false);
    }
  };

  const handleCheckAtHome = async (
    appointmentId: string,
    userId: string,
    serviceIds: string[]
  ) => {
    const token = localStorage.getItem('token');
    setLoadingRowId(appointmentId);
    try {
      const res = await fetch(
        `http://localhost:8080/api/appointment/confirm-appointment-at-home?appointmentId=${appointmentId}&userId=${userId}&serviceId=${serviceIds}`,
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
    } finally {
      setLoadingRowId(null);
    }
  };

  useEffect(() => {
    fetchScheduleAtHome();
  }, []);

  // Filter paid appointments
  const paidAppointments = homeSchedule.filter(
    (item) => item.showAppointmentResponse.note === 'Đã thanh toán'
  );

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Danh Sách Lịch Hẹn</h1>
          <p className={styles.subtitle}>
            Quản lý và xác nhận các lịch hẹn tại nhà
          </p>
        </div>

        {loadingHome ? (
          <div className={styles.loadingCard}>
            <p className={styles.loadingText}>Đang tải dữ liệu...</p>
          </div>
        ) : paidAppointments.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📅</div>
            <h3 className={styles.emptyTitle}>Danh sách lịch hẹn trống</h3>
            <p className={styles.emptyDescription}>
              Hiện tại không có lịch hẹn nào cần xác nhận
            </p>
          </div>
        ) : (
          <div className={styles.appointmentsList}>
            {paidAppointments.map((item, index) => (
              <div key={index} className={styles.appointmentCard}>
                <div className={styles.cardContent}>
                  {/* Header with appointment info */}
                  <div className={styles.cardHeader}>
                    <div className={styles.headerLeft}>
                      <div className={styles.appointmentIcon}>
                        <span className={styles.appointmentNumber}>
                          #{index + 1}
                        </span>
                      </div>
                      <div className={styles.headerInfo}>
                        <h3>
                          Lịch hẹn #{item.showAppointmentResponse.appointmentId}
                        </h3>
                        <p>{item.showAppointmentResponse.appointmentDate}</p>
                      </div>
                    </div>

                    <span className={styles.statusBadge}>
                      {item.showAppointmentResponse.appointmentStatus}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className={styles.infoGrid}>
                    {/* Ngày hẹn */}
                    <div className={styles.infoItem}>
                      <p className={styles.infoLabel}>Ngày Hẹn</p>
                      <p className={styles.infoValue}>
                        {item.showAppointmentResponse.appointmentDate}
                      </p>
                    </div>

                    {/* Trạng thái */}
                    <div className={styles.infoItem}>
                      <p className={styles.infoLabel}>Trạng Thái</p>
                      <p className={styles.infoValue}>
                        {item.showAppointmentResponse.appointmentStatus}
                      </p>
                    </div>

                    {/* Ghi chú */}
                    <div className={styles.infoItem}>
                      <p className={styles.infoLabel}>Ghi Chú</p>
                      <p className={styles.infoValue}>
                        {item.showAppointmentResponse.note}
                      </p>
                    </div>

                    {/* Tên dịch vụ */}
                    <div className={styles.infoItem}>
                      <p className={styles.infoLabel}>Tên Dịch Vụ</p>
                      <p className={styles.infoValue}>
                        {item.serviceAppointmentResponses?.[0]?.serviceName ||
                          '—'}
                      </p>
                    </div>

                    {/* Loại dịch vụ */}
                    <div className={styles.infoItem}>
                      <p className={styles.infoLabel}>Loại Dịch Vụ</p>
                      <p className={styles.infoValue}>
                        {item.serviceAppointmentResponses?.[0]?.serviceType ||
                          '—'}
                      </p>
                    </div>

                    {/* Mã kit */}
                    <div className={styles.infoItem}>
                      <p className={styles.infoLabel}>Mã Kit</p>
                      <p className={styles.infoValue}>
                        {item.kitAppointmentResponse?.kitCode || '—'}
                      </p>
                    </div>

                    {/* Tên kit */}
                    <div className={styles.infoItem}>
                      <p className={styles.infoLabel}>Tên Kit</p>
                      <p className={styles.infoValue}>
                        {item.kitAppointmentResponse?.kitName || '—'}
                      </p>
                    </div>

                    {/* Số người */}
                    <div className={styles.infoItem}>
                      <p className={styles.infoLabel}>Số Người</p>
                      <p className={styles.infoValue}>
                        {item.kitAppointmentResponse?.targetPersonCount || '—'}
                      </p>
                    </div>

                    {/* Nội dung kit */}
                    <div className={styles.infoItem}>
                      <p className={styles.infoLabel}>Nội Dung Kit</p>
                      <p className={styles.infoValue}>
                        {item.kitAppointmentResponse?.contents || '—'}
                      </p>
                    </div>

                    {/* Địa chỉ - full width */}
                    <div className={`${styles.infoItem} ${styles.addressItem}`}>
                      <p className={styles.infoLabel}>Địa Chỉ</p>
                      <p className={styles.infoValue}>
                        {item.userAppointmentResponses?.address || '—'}
                      </p>
                    </div>

                    {/* Người đặt */}
                    <div className={styles.infoItem}>
                      <p className={styles.infoLabel}>Người Đặt</p>
                      <p className={styles.infoValue}>
                        {item.userAppointmentResponses?.fullName || '—'}
                      </p>
                    </div>

                    {/* SĐT */}
                    <div className={styles.infoItem}>
                      <p className={styles.infoLabel}>SĐT</p>
                      <p className={styles.infoValue}>
                        {item.userAppointmentResponses?.phone || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className={styles.actions}>
                    <button
                      onClick={() =>
                        handleCheckAtHome(
                          item.showAppointmentResponse.appointmentId,
                          item.userAppointmentResponses.userId,
                          item.serviceAppointmentResponses.map(
                            (s: any) => s.serviceId
                          )
                        )
                      }
                      className={styles.confirmButton}
                      disabled={
                        loadingRowId ===
                        item.showAppointmentResponse.appointmentId
                      }
                    >
                      {loadingRowId ===
                      item.showAppointmentResponse.appointmentId ? (
                        <>
                          <span className={styles.loadingSpinner}></span>
                          Đang xác nhận...
                        </>
                      ) : (
                        'Xác Nhận'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentSchedule;
