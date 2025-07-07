/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { Check } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './CollectorSlot.module.css';

export const CollectSampleAtHome = () => {
  const [slots, setSlots] = useState<any[]>([]);
  const [sample, setSample] = useState<any[]>([]);

  const [appointments, setAppointments] = useState<any[]>([]);
  const sampleTypes = [
    'Niêm mạc miệng',
    'Máu',
    'Móng tay / móng chân',
    'Răng',
    'Tóc',
  ];

  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<{
    [key: string]: string;
  }>({});
  const [sampleType, setSampleTypes] = useState<{ [key: string]: string }>({});

  // Mapping trạng thái thành tiếng Việt
  const statusOptions = [
    { value: 'PENDING', label: 'Chờ giao hàng' },
    { value: 'IN_PROGRESS', label: 'Đang giao hàng' },
    { value: 'DELIVERED', label: 'Đã giao thành công' },
    { value: 'DONE', label: 'Kit đã được nhận về' },
    { value: 'FAILED', label: 'Giao hàng thất bại' },
  ];

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
        const appointmentId = data?.[0].showAppointmentResponse?.appointmentId;
        if (appointmentId) {
          fetchSampleData(appointmentId); // gọi API sample khi có appointmentId
        }
      }
    } catch (error) {
      toast.error('Không thể lấy dữ liệu lịch hẹn');
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

  const handleUpdateStatus = async (
    appointmentId: string,
    newStatus: string,
    currentStatus: string
  ) => {
    if (currentStatus === 'FAILED') {
      toast.error('Đơn hàng đã thất bại');
      return;
    }
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
            deliveryStatus: newStatus,
          }),
        }
      );
      if (res.ok) {
        toast.success('Cập nhật trạng thái thành công');
      } else {
        toast.error('Không thể cập nhật trạng thái cũ');
      }
    } catch (error) {
      console.log(error);
      toast.error('Lỗi khi cập nhật trạng thái');
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

  // Group appointments by appointmentId
  const groupedAppointments = appointments.filter(
    (a) =>
      a.showAppointmentResponse?.appointmentType === 'HOME' &&
      a.showAppointmentResponse?.appointmentStatus === 'CONFIRMED'
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Danh sách Slot & Lịch hẹn</h1>
      </div>

      {/* Bảng thông tin khách tại nhà */}
      {groupedAppointments.length > 0 ? (
        <div>
          {groupedAppointments.map((appointmentItem, appointmentIndex) => {
            const appointmentId = appointmentItem.showAppointmentResponse?.appointmentId;
            const serviceId = appointmentItem.serviceAppointmentResponses?.[0]?.serviceId;
            const patients = appointmentItem.patientAppointmentResponse;
            const appointmentDate = appointmentItem.showAppointmentResponse?.appointmentDate;

            return (
              <div key={appointmentId} className={styles.orderGroup}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <div className={styles.orderBadge}>
                      Đơn hàng #{appointmentIndex + 1}
                    </div>
                    <div>Ngày hẹn: {appointmentDate}</div>
                    <div className={styles.patientCount}>
                      {patients.length} bệnh nhân
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
                        <th className={styles.tableHeaderCell}>Thu mẫu</th>
                        <th className={styles.tableHeaderCell}>Trạng thái Kit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient: any, index: number) => {
                        const key = `${appointmentId}_${patient.patientId}`;
                        const isFirstPatient = index === 0;

                        return (
                          <tr 
                            key={key} 
                            className={`${styles.tableRow} ${isFirstPatient ? styles.firstPatientRow : ''}`}
                          >
                            <td className={styles.tableCell}>{patient.fullName}</td>
                            <td className={styles.tableCell}>{patient.dateOfBirth}</td>
                            <td className={styles.tableCell}>{patient.gender}</td>
                            <td className={styles.tableCell}>{patient.relationship}</td>
                            <td className={styles.tableCell}>
                              <div className={styles.inputGroup}>
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
                            </td>

                            {isFirstPatient && (
                              <td
                                className={`${styles.tableCell} ${styles.statusColumn}`}
                                rowSpan={patients.length}
                              >
                                <select
                                  className={styles.statusSelect}
                                  value={selectedStatus[appointmentId] || 'PENDING'}
                                  onChange={(e) => {
                                    const newStatus = e.target.value;
                                    const currentStatus = selectedStatus[appointmentId] || 'PENDING';
                                    setSelectedStatus({
                                      [appointmentId]: newStatus,
                                    });
                                    handleUpdateStatus(appointmentId, newStatus, currentStatus);
                                  }}
                                >
                                  {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
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
                      navigate(`/s-page/checkAppointment/${slot.slotResponse.slotId}`)
                    }
                  >
                    <div>Slot {slot.slotResponse.slotId}</div>
                    <div>
                      {slot.slotResponse.startTime} ~ {slot.slotResponse.endTime}
                    </div>
                  </button>
                ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Chưa có lịch hẹn nào</p>
            </div>
          )}
        </div>
      )}

      {/* Bảng mẫu đã thu */}
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
