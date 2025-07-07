/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { Check, Delete } from '@mui/icons-material';
import styles from './CheckAppointment.module.css';

const CollectSampleAtCenter = () => {
  const { slotId } = useParams();

  const [sample, setSample] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sampleType, setSampleTypes] = useState<{ [key: string]: string }>({});
  const sampleTypes = [
    'Niêm mạc miệng',
    'Máu',
    'Móng tay / móng chân',
    'Răng',
    'Tóc',
  ];
  const translateStatus = (status: string): string => {
    switch (status) {
      case 'REGISTERED':
        return 'Đã đăng ký';
      case 'SAMPLE_COLLECTED':
        return 'Đã thu mẫu';
      case 'IN_ANALYSIS':
        return 'Đang phân tích';
      case 'COMPLETED':
        return 'Đã có kết quả';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'NO_SHOW':
        return 'Vắng mặt';
      default:
        return status;
    }
  };

  const fetchAppointment = async () => {
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
      const appointmentId = data?.[0].showAppointmentResponse?.appointmentId;
      if (appointmentId) {
        fetchSampleData(appointmentId); // gọi API sample khi có appointmentId
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Không thể lấy dữ liệu mẫu');
    } finally {
      setLoading(false);
    }
  };

  const fetchSampleData = async (appointmentId: number | string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/sample/get-all-sample?appointmentId=${appointmentId}`,
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
      setSample(data);
    } catch (error) {
      console.error('Error fetching sample data:', error);
      toast.error('Không thể lấy dữ liệu mẫu xét nghiệm');
    } finally {
      setLoading(false);
    }
  };

  const handleSeletedSample = (
    event: React.ChangeEvent<HTMLSelectElement>,
    key: string
  ) => {
    const { value } = event.target;
    setSampleTypes((prev) => ({
      ...prev,
      [key]: value,
    }));
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
      if (!res.ok) {
        let errorMessage = 'Không thể tạo'; // mặc định

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMessage = errorData.message || JSON.stringify(errorData);
        } else {
          errorMessage = await res.text();
        }

        toast.error(errorMessage);
      } else {
        toast.success('Thu mẫu thành công');
      }
    } catch (error) {
      console.log(error);
      toast.error('Lỗi khi gửi mẫu');
    }
  };

  const handleAbsent = async (patientId: string, appointmentId: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/appointment/check-in-patient?patientId=${patientId}&appointmentId=${appointmentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!res.ok) {
        toast.error('bị lỗi');
      } else {
        toast.success('Đã đánh dấu vắng mặt');
      }
    } catch (error) {
      console.error('Error checking in patient:', error);
    }
  };

  const isPaid = appointments.some(
    (a) => a.showAppointmentResponse.note === 'Đã thanh toán'
  );

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
                {isPaid ? (
                  <th className={styles.tableHeaderCell}>Vật xét nghiệm</th>
                ) : null}
                {!isPaid ? (
                  <th className={styles.tableHeaderCell}>Hủy</th>
                ) : null}
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
                            {translateStatus(patient.patientStatus)}
                          </span>
                        </td>
                        {isPaid ? (
                          <td className={styles.tableCell}>
                            {isPaid ? (
                              <div className={styles.actionsContainer}>
                                <select
                                  className={styles.sampleSelect}
                                  value={sampleType[key as any] || ''}
                                  onChange={(e) => handleSeletedSample(e, key)}
                                >
                                  <option value="">Chọn vật xét nghiệm</option>
                                  {sampleTypes.map((type) => (
                                    <option key={type} value={type}>
                                      {type}
                                    </option>
                                  ))}
                                </select>
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
                        ) : null}
                        {!isPaid ? (
                          <td>
                            <button
                              className={styles.submitBtn}
                              onClick={() =>
                                handleAbsent(patient.patientId, appointmentId)
                              }
                            >
                              <Delete fontSize="small" />
                            </button>
                          </td>
                        ) : null}
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

      {sample.length > 0 ? (
        <div className={styles.tableContainer}>
          <h2 className={styles.subTitle}>Danh sách mẫu đã nhập</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Giới tính</th>
                <th>Ngày sinh</th>
                <th>Quan hệ</th>
                <th>Loại mẫu</th>
                <th>Mã mẫu</th>
                <th>Ngày thu</th>
                <th>Người thu</th>
              </tr>
            </thead>
            <tbody>
              {sample.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{item.patientSampleResponse.fullName}</td>
                  <td>{item.patientSampleResponse.gender}</td>
                  <td>{item.patientSampleResponse.dateOfBirth}</td>
                  <td>{item.patientSampleResponse.relationship}</td>
                  <td>{item.sampleResponse.sampleType}</td>
                  <td>{item.sampleResponse.sampleCode}</td>
                  <td>{item.sampleResponse.collectionDate}</td>
                  <td>{item.staffSampleResponse.fullName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default CollectSampleAtCenter;
