/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { Check } from '@mui/icons-material';
import styles from './CheckAppointment.module.css';

const CheckAppointment = () => {
  const { slotId } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sampleType, setSampleType] = useState<Record<string, string>>({});
  const fetchAppointment = async () => {
    if (!slotId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/appointment/get-appointment-by-slot/${slotId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Fetch failed');
      }

      const data = await response.json();
      setAppointments(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Không thể lấy dữ liệu lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Kiểm tra lịch hẹn - Slot {slotId}</h1>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <span className={styles.loadingText}>Đang tải dữ liệu...</span>
        </div>
      ) : appointments.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell}>Họ tên</th>
                <th className={styles.tableHeaderCell}>Ngày sinh</th>
                <th className={styles.tableHeaderCell}>Giới tính</th>
                <th className={styles.tableHeaderCell}>Quan hệ</th>
                <th className={styles.tableHeaderCell}>Ngày hẹn</th>
                <th className={styles.tableHeaderCell}>Ghi chú</th>
                <th className={styles.tableHeaderCell}>Vật xét nghiệm</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointmentItem) =>
                appointmentItem.patientAppointmentResponse.map(
                  (patient: any) => {
                    const appointmentId =
                      appointmentItem.showAppointmentResponse?.appointmentId;
                    const serviceId =
                      appointmentItem.serviceAppointmentResponses?.[0]
                        ?.serviceId;
                    const key = `${appointmentId}_${patient.patientId}`;
                    const isPaid =
                      appointmentItem.showAppointmentResponse?.note ===
                      'Đã thanh toán';

                    return (
                      <tr key={key} className={styles.tableRow}>
                        <td className={styles.tableCell}>{patient.fullName}</td>
                        <td className={styles.tableCell}>
                          {patient.dateOfBirth}
                        </td>
                        <td className={styles.tableCell}>{patient.gender}</td>
                        <td className={styles.tableCell}>
                          {patient.relationship}
                        </td>
                        <td className={styles.tableCell}>
                          {
                            appointmentItem.showAppointmentResponse
                              ?.appointmentDate
                          }
                        </td>
                        <td
                          className={`${styles.tableCell} ${styles.noteCell}`}
                        >
                          <span
                            className={
                              isPaid ? styles.paidStatus : styles.unpaidStatus
                            }
                          >
                            {appointmentItem.showAppointmentResponse?.note}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          {isPaid ? (
                            <div className={styles.actionsContainer}>
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
                            </div>
                          ) : (
                            <span className={styles.unpaidStatus}>
                              Chưa thanh toán
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3>Không có lịch hẹn nào</h3>
          <p>Slot này hiện tại chưa có lịch hẹn nào được đặt.</p>
        </div>
      )}
    </div>
  );
};

export default CheckAppointment;
