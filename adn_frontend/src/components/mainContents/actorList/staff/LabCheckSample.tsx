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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Danh sách Lịch hẹn (Tại nhà & Trung tâm)</h1>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th>Họ tên</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Quan hệ</th>
            <th>Ngày hẹn</th>
            <th>Loại dịch vụ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointmentItem: any) => {
            const appointment = appointmentItem.showAppointmentResponse;
            const appointmentId = appointment?.appointmentId;
            const patients = appointmentItem.patientAppointmentResponse;

            if (!appointment || appointment.appointmentStatus !== 'CONFIRMED')
              return null;

            // Nếu không có bệnh nhân, render một dòng duy nhất
            if (!Array.isArray(patients) || patients.length === 0) {
              return (
                <tr key={`no-patient-${appointmentId}`}>
                  <td
                    colSpan={4}
                    style={{ fontStyle: 'italic', color: '#888' }}
                  >
                    Chưa có bệnh nhân
                  </td>
                  <td>{appointment?.appointmentDate}</td>
                  <td>{appointment?.appointmentType}</td>
                  <td>
                    <NavLink
                      to={`/s-page/get-appointment/${appointmentId}`}
                      className={styles.viewBtn}
                    >
                      Xem
                    </NavLink>
                  </td>
                </tr>
              );
            }

            // Nếu có bệnh nhân
            return patients.map((patient: any, index: number) => {
              const key = `${appointmentId}_${patient.patientId}`;
              const isFirst = index === 0;

              return (
                <tr key={key}>
                  <td>{patient.fullName}</td>
                  <td>{patient.dateOfBirth}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.relationship}</td>
                  <td>{appointment?.appointmentDate}</td>
                  <td>{appointment?.appointmentType}</td>
                  <td>
                    {isFirst && (
                      <NavLink
                        to={`/s-page/get-appointment/${appointmentId}`}
                        className={styles.viewBtn}
                      >
                        Xem
                      </NavLink>
                    )}
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
};
