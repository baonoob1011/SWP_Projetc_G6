/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './CollectorSlot.module.css';

export const LabCheckSample = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [sampleType, setSampleType] = useState<{ [key: string]: string }>({});
  const [selectedStatus, setSelectedStatus] = useState<{
    [key: string]: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/staff/get-appointment-by-staff`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const home = data.allAppointmentAtHomeResponse ?? [];
        const center = data.allAppointmentAtCenterResponse ?? [];
        setAppointments([...home, ...center]);
      } else {
        toast.error('Không thể lấy dữ liệu lịch hẹn');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/kit-delivery-status/update-kit-status?appointmentId=${appointmentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            deliveryStatus: selectedStatus[appointmentId],
          }),
        }
      );
      if (res.ok) {
        toast.success('Cập nhật trạng thái thành công');
      }
    } catch (error) {
      toast.error('Lỗi cập nhật trạng thái');
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <CircularProgress />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Empty state nếu không có lịch hẹn
  if (!appointments || appointments.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Danh sách Lịch hẹn Lab</h1>
        </div>
        <div className={styles.emptyState}>
          <h3>Không có lịch hẹn nào</h3>
          <p>Hiện tại bạn chưa có lịch hẹn nào để kiểm tra.</p>
        </div>
      </div>
    );
  }

  // Filter only confirmed appointments
  const confirmedAppointments = appointments.filter(
    (appointmentItem) =>
      appointmentItem.showAppointmentResponse?.appointmentStatus === 'CONFIRMED'
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Danh sách Lịch hẹn Lab</h1>
      </div>

      {confirmedAppointments.length > 0 ? (
        <div>
          {confirmedAppointments.map((appointmentItem, appointmentIndex) => {
            const appointment = appointmentItem.showAppointmentResponse;
            const appointmentId = appointment?.appointmentId;
            const patients = appointmentItem.patientAppointmentResponse || [];
            const appointmentDate = appointment?.appointmentDate;
            const appointmentType = appointment?.appointmentType;

            return (
              <div key={appointmentId} className={styles.orderGroup}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <div className={styles.orderBadge}>
                      Lịch hẹn #{appointmentIndex + 1}
                    </div>
                    <div>Ngày hẹn: {appointmentDate}</div>
                    <div className={styles.patientCount}>
                      {patients.length} bệnh nhân
                    </div>
                    <div className={styles.orderBadge}>
                      {appointmentType === 'HOME' ? 'Tại nhà' : 'Trung tâm'}
                    </div>
                  </div>
                </div>

                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                      <tr>
                        <th className={styles.tableHeaderCell}>Họ tên</th>
                        <th className={styles.tableHeaderCell}>Ngày sinh</th>
                        <th className={styles.tableHeaderCell}>Giới tính</th>
                        <th className={styles.tableHeaderCell}>Quan hệ</th>
                        <th className={styles.tableHeaderCell}>Tên dịch vụ</th>
                        <th className={styles.tableHeaderCell}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.length > 0 ? (
                        patients.map((patient: any, index: number) => {
                          const key = `${appointmentId}_${patient.patientId}`;
                          const isFirstPatient = index === 0;

                          return (
                            <tr
                              key={key}
                              className={`${styles.tableRow} ${
                                isFirstPatient ? styles.firstPatientRow : ''
                              }`}
                            >
                              <td className={styles.tableCell}>
                                {patient.fullName}
                              </td>
                              <td className={styles.tableCell}>
                                {patient.dateOfBirth}
                              </td>
                              <td className={styles.tableCell}>
                                {patient.gender}
                              </td>
                              <td className={styles.tableCell}>
                                {patient.relationship}
                              </td>
                              <td className={styles.tableCell}>
                                {appointmentItem.serviceAppointmentResponses
                                  ?.length > 0
                                  ? appointmentItem.serviceAppointmentResponses
                                      .map((s: any) => s.description)
                                      .join(', ')
                                  : '—'}
                              </td>
                              {isFirstPatient && (
                                <td
                                  className={`${styles.tableCell} ${styles.statusColumn}`}
                                  rowSpan={patients.length}
                                >
                                  <NavLink
                                    to={`/s-page/get-appointment/${appointmentId}`}
                                    className={styles.viewBtn}
                                  >
                                    Xem chi tiết
                                  </NavLink>
                                </td>
                              )}
                            </tr>
                          );
                        })
                      ) : (
                        <tr className={styles.tableRow}>
                          <td
                            colSpan={5}
                            className={styles.tableCell}
                            style={{
                              fontStyle: 'italic',
                              color: '#6c757d',
                              textAlign: 'center',
                            }}
                          >
                            Chưa có bệnh nhân
                          </td>
                          <td
                            className={`${styles.tableCell} ${styles.statusColumn}`}
                          >
                            <NavLink
                              to={`/s-page/get-appointment/${appointmentId}`}
                              className={styles.viewBtn}
                            >
                              Xem chi tiết
                            </NavLink>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3>Không có lịch hẹn được xác nhận</h3>
          <p>Hiện tại không có lịch hẹn nào ở trạng thái đã xác nhận.</p>
        </div>
      )}
    </div>
  );
};
