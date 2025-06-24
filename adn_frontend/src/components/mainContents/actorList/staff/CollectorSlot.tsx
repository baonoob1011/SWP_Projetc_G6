/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  Typography,
  CircularProgress,
  Button,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Check } from '@mui/icons-material';
import { useNavigate, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './CollectorSlot.module.css';

export const CollectorSlots = () => {
  const [slots, setSlots] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [sampleType, setSampleType] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<{
    [key: string]: string;
  }>({});

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'http://localhost:8080/api/slot/get-all-slot-of-staff',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setSlots(data);
    } catch (err) {
      console.error('Lỗi lấy slot:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchAppointmentAtHome = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/appointment/get-appointment-at-home-to-get-sample`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      toast.error('Không thể lấy dữ liệu lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentAtHome();
  }, []);

  const handleSendSample = async (
    patientId: string,
    serviceId: string,
    appointmentId: string,
    key: string
  ) => {
    const sample = sampleType[key];
    if (!sample) {
      toast.error('Vui lòng nhập vật xét nghiệm');
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/sample/collect-sample-patient?patientId=${patientId}&serviceId=${serviceId}&appointmentId=${appointmentId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            sampleType: sample,
          }),
        }
      );
      if (res.ok) {
        toast.success('Thu mẫu thành công');
      } else {
        toast.error('Thu mẫu thất bại');
      }
    } catch (error) {
      console.log(error);
      toast.error('Lỗi khi gửi mẫu');
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
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            selectedStatus: selectedStatus[appointmentId],
          }),
        }
      );
      if (res.ok) {
        toast.success('Cập nhật trạng thái thành công');
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      <div className={styles.header}>
        <h1 className={styles.title}>Danh sách Slot & Lịch hẹn</h1>
      </div>

      {/* Bảng thông tin khách tại nhà */}
      {/* ✅ Nếu có lịch tại nhà thì hiện bảng, ngược lại hiện slot */}
      {appointments.some(
        (a) =>
          a.showAppointmentResponse?.appointmentType === 'HOME' &&
          a.showAppointmentResponse?.appointmentStatus === 'CONFIRMED'
      ) ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell}>Họ tên</th>
                <th className={styles.tableHeaderCell}>Ngày sinh</th>
                <th className={styles.tableHeaderCell}>Giới tính</th>
                <th className={styles.tableHeaderCell}>Quan hệ</th>
                <th className={styles.tableHeaderCell}>Ngày hẹn</th>
                <th className={styles.tableHeaderCell}>Thu mẫu / Xem</th>
                <th className={styles.tableHeaderCell}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointmentItem) => {
                const appointmentId =
                  appointmentItem.showAppointmentResponse?.appointmentId;
                const serviceId =
                  appointmentItem.serviceAppointmentResponses?.[0]?.serviceId;
                const isHome =
                  appointmentItem.showAppointmentResponse?.appointmentType ===
                  'HOME';
                const isConfirmed =
                  appointmentItem.showAppointmentResponse?.appointmentStatus ===
                  'CONFIRMED';

                if (!isHome || !isConfirmed) return null;

                const patients = appointmentItem.patientAppointmentResponse;

                return patients.map((patient: any, index: number) => {
                  const key = `${appointmentId}_${patient.patientId}`;
                  const isFirstPatient = index === 0;

                  return (
                    <tr key={key} className={styles.tableRow}>
                      <td className={styles.tableCell}>{patient.fullName}</td>
                      <td className={styles.tableCell}>{patient.dateOfBirth}</td>
                      <td className={styles.tableCell}>{patient.gender}</td>
                      <td className={styles.tableCell}>{patient.relationship}</td>
                      <td className={styles.tableCell}>
                        {appointmentItem.showAppointmentResponse?.appointmentDate}
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.inputGroup}>
                          <input
                            type="text"
                            className={styles.sampleInput}
                            placeholder="Nhập vật mẫu"
                            value={sampleType[key] || ''}
                            onChange={(e) =>
                              setSampleType((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }))
                            }
                          />
                          <button
                            className={styles.submitBtn}
                            onClick={() =>
                              handleSendSample(
                                patient.patientId,
                                serviceId,
                                appointmentId,
                                key
                              )
                            }
                          >
                            <Check fontSize="small" />
                          </button>
                          {isFirstPatient && (
                            <NavLink
                              to={`/s-page/get-appointment/${appointmentId}`}
                              className={styles.viewBtn}
                            >
                              Xem
                            </NavLink>
                          )}
                        </div>
                      </td>

                      {isFirstPatient && (
                        <td className={styles.tableCell} rowSpan={patients.length}>
                          <select
                            className={styles.statusSelect}
                            value={selectedStatus[appointmentId] || 'PENDING'}
                            onChange={(e) =>
                              setSelectedStatus((prev) => ({
                                ...prev,
                                [appointmentId]: e.target.value,
                              }))
                            }
                            onBlur={() => handleUpdateStatus(appointmentId)}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="FAILED">FAILED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="DONE">DONE</option>
                          </select>
                        </td>
                      )}
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>
      ) : (
        // Không có lịch tại nhà thì hiện slot
        <div className={styles.slotsContainer}>
          {slots.filter((slot) => slot.slotResponse.slotStatus === 'BOOKED').length > 0 ? (
            <div className={styles.slotsGrid}>
              {slots
                .filter((slot) => slot.slotResponse.slotStatus === 'BOOKED')
                .map((slot) => (
                  <button
                    key={slot.slotResponse.slotId}
                    className={styles.slotButton}
                    onClick={() =>
                      navigate(
                        `/s-page/checkAppointment/${slot.slotResponse.slotId}`
                      )
                    }
                  >
                    <div>Slot {slot.slotResponse.slotId}</div>
                    <div>{slot.slotResponse.startTime} ~ {slot.slotResponse.endTime}</div>
                  </button>
                ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h3>Không có slot nào được đặt</h3>
              <p>Hiện tại chưa có slot nào trong trạng thái "BOOKED"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
