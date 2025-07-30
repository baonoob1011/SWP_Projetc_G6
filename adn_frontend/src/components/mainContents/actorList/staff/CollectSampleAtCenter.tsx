/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { NavLink, useParams } from 'react-router-dom';
import { ArrowBack, Check } from '@mui/icons-material';
import styles from './CheckAppointment.module.css';
import Swal from 'sweetalert2';

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
  const sampleStatusOptions = [
    { value: 'COLLECTED', label: 'Đã thu thập mẫu' },
    { value: 'IN_TRANSIT', label: 'Đang vận chuyển' },
    { value: 'RECEIVED', label: 'Đã nhận tại phòng xét nghiệm' },
  ];
  const Translation = (status: string) => {
    switch (status) {
      case 'REGISTERED':
        return 'Đã đăng ký';
      case 'IN_TRANSIT':
        return 'Đang vận chuyển';
      case 'RECEIVED':
        return 'Đã nhận tại phòng xét nghiệm';
      case 'SAMPLE_COLLECTED':
        return 'Đã thu mẫu';
      case 'IN_ANALYSIS':
        return 'Đang phân tích mẫu';
      case 'COMPLETED':
        return 'Đã có kết quả';
      case 'CANCELLED':
        return 'Đã hủy xét nghiệm';
      case 'NO_SHOW':
        return 'Không đến';
      default:
        return 'Không rõ trạng thái';
    }
  };
  const [confirmDelete, setConfirmDelete] = useState<{
    appointmentId: string;
    sampleId: string;
  } | null>(null);
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
      console.log(error);
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

  const handleUpdate = async (sampleId: string, sampleStatus: string) => {
    // Tìm sample tương ứng để lấy patientId
    const matchedSample = sample.find(
      (s: any) => s.sampleResponse.sampleId === sampleId
    );
    const patientId = matchedSample?.patientSampleResponse?.patientId;

    if (!patientId) {
      toast.error('Không tìm thấy patientId từ sample');
      return;
    }

    // Tìm appointmentId từ appointmentItem chứa patientId
    const matchedAppointment = appointments.find((appointmentItem) =>
      appointmentItem.patientAppointmentResponse.some(
        (p: any) => p.patientId === patientId
      )
    );

    const appointmentId =
      matchedAppointment?.showAppointmentResponse?.appointmentId;

    if (!appointmentId) {
      toast.error('Không tìm thấy appointmentId từ API lịch hẹn');
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/sample/update-status-sample?sampleId=${sampleId}&appointmentId=${appointmentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            sampleStatus: sampleStatus,
          }),
        }
      );

      if (!res.ok) {
        toast.error('Không thể cập nhật trạng thái cũ');
      } else {
        toast.success('Cập nhật trạng thái thành công');
        // cập nhật local state
        setSample((prev) =>
          prev.map((s) =>
            s.sampleResponse.sampleId === sampleId
              ? {
                  ...s,
                  sampleResponse: {
                    ...s.sampleResponse,
                    sampleStatus: sampleStatus,
                  },
                }
              : s
          )
        );
      }
    } catch (error) {
      console.log(error);
      toast.error('Lỗi khi cập nhật trạng thái mẫu');
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
        fetchSampleData(appointmentId);
      }
    } catch (error) {
      console.log(error);
      toast.error('Lỗi khi gửi mẫu');
    }
  };
  const handleDelete = async (appointmentId: string, sampleId: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/sample/delete-sample?sampleId=${sampleId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error('Không thể xóa mẫu');
      } else {
        fetchSampleData(appointmentId);
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
        fetchAppointment();
      }
    } catch (error) {
      console.error('Error checking in patient:', error);
    }
  };

  const sampleStatus = appointments.map(
    (a) => a.patientAppointmentResponse.patientStatus === 'REGISTERED'
  );

  useEffect(() => {
    fetchAppointment();
  }, []);
  return (
    <div className={styles.container}>
      <NavLink to="/s-page/s-slot">
        <ArrowBack></ArrowBack>
      </NavLink>
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
                <th className={styles.tableHeaderCell}>Tên dịch vụ</th>
                <th className={styles.tableHeaderCell}>Tên Kit</th>
                <th className={styles.tableHeaderCell}>Quan hệ</th>
                <th className={styles.tableHeaderCell}>Ghi chú</th>

                {appointments[0]?.patientAppointmentResponse?.some(
                  (patient: any) =>
                    patient?.patientStatus !== 'COMPLETED' &&
                    patient?.patientStatus !== 'NO_SHOW'
                ) && <th className={styles.tableHeaderCell}>Vật xét nghiệm</th>}

                {appointments[0]?.patientAppointmentResponse?.some(
                  (patient: any) =>
                    patient?.patientStatus !== 'COMPLETED' &&
                    patient?.patientStatus !== 'NO_SHOW'
                ) &&
                  sampleStatus && (
                    <th className={styles.tableHeaderCell}>Vắng mặt</th>
                  )}
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
                      'Chưa thanh toán';

                    return (
                      <tr key={key} className={styles.tableRow}>
                        <td className={styles.tableCell}>{patient.fullName}</td>
                        <td className={styles.tableCell}>
                          {
                            appointmentItem.serviceAppointmentResponses?.[0]
                              .serviceName
                          }
                        </td>
                        <td className={styles.tableCell}>
                          {appointmentItem.kitAppointmentResponse.kitName}
                        </td>

                        <td className={styles.tableCell}>
                          {patient.relationship}
                        </td>

                        <td className={styles.tableCell}>
                          {Translation(patient.patientStatus)}
                        </td>

                        {patient.patientStatus !== 'COMPLETED' &&
                          patient.patientStatus !== 'NO_SHOW' && (
                            <td className={styles.tableCell}>
                              {!isPaid ? (
                                <div className={styles.actionsContainer}>
                                  <select
                                    className={styles.sampleSelect}
                                    value={sampleType[key as any] || ''}
                                    onChange={(e) =>
                                      handleSeletedSample(e, key)
                                    }
                                  >
                                    <option value="">
                                      Chọn vật xét nghiệm
                                    </option>
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
                          )}
                        {patient.patientStatus !== 'COMPLETED' &&
                          patient.patientStatus !== 'NO_SHOW' &&
                          sampleStatus && (
                            <td>
                              <button
                                className={styles.submitBtn}
                                onClick={async () => {
                                  const result = await Swal.fire({
                                    title: 'Xác nhận vắng mặt?',
                                    text: 'Bạn có chắc chắn muốn đánh dấu bệnh nhân này là vắng mặt?',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Xác nhận',
                                    cancelButtonText: 'Hủy',
                                  });

                                  if (result.isConfirmed) {
                                    handleAbsent(
                                      patient.patientId,
                                      appointmentId
                                    );
                                  }
                                }}
                              >
                                Vắng mặt
                              </button>
                            </td>
                          )}
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
        <div className={styles.collectedSamplesContainer}>
          <h2 className={styles.subTitle}>Danh sách mẫu đã nhập</h2>
          <div
            className={`${styles.tableContainer} ${styles.collectedSamplesTable}`}
          >
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell}>Họ tên</th>
                  <th className={styles.tableHeaderCell}>Mã Kit</th>
                  <th className={styles.tableHeaderCell}>Loại mẫu</th>
                  <th className={styles.tableHeaderCell}>Mã mẫu</th>
                  <th className={styles.tableHeaderCell}>Ngày thu</th>
                  <th className={styles.tableHeaderCell}>Người thu</th>
                  <th className={styles.tableHeaderCell}>Trạng thái mẫu</th>
                  <th className={styles.tableHeaderCell}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sample.map((item: any, index: number) => (
                  <tr key={index} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      {item.patientSampleResponse.fullName}
                    </td>
                    <td className={styles.tableCell}>
                      {item.kitAppointmentResponse.kitCode}
                    </td>
                    <td className={styles.tableCell}>
                      {item.sampleResponse.sampleType}
                    </td>

                    <td className={styles.tableCell}>
                      {item.sampleResponse.sampleCode}
                    </td>
                    <td className={styles.tableCell}>
                      {item.sampleResponse.collectionDate}
                    </td>
                    <td className={styles.tableCell}>
                      {item.staffSampleResponse.fullName}
                    </td>
                    <td className={styles.tableCell}>
                      <select
                        value={item.sampleResponse.sampleStatus}
                        onChange={async (e) => {
                          const selectedValue = e.target.value;

                          // Nếu chưa chọn giá trị mới thì không làm gì
                          if (!selectedValue) return;

                          const result = await Swal.fire({
                            title: 'Xác nhận thay đổi?',
                            text: `Bạn có chắc chắn muốn đổi sang trạng thái mẫu này"?`,
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonText: 'Xác nhận',
                            cancelButtonText: 'Hủy',
                          });

                          if (result.isConfirmed) {
                            handleUpdate(
                              item.sampleResponse.sampleId,
                              selectedValue
                            );
                          }
                        }}
                        className={styles.sampleSelect}
                      >
                        <option value="">Chọn trạng thái</option>
                        {sampleStatusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={styles.tableCell}>
                      <button
                        type="submit"
                        className={styles.submitBtn}
                        onClick={() => {
                          const matchedAppointment = appointments.find((a) =>
                            a.patientAppointmentResponse.some(
                              (p: any) =>
                                p.patientId ===
                                item.patientSampleResponse.patientId
                            )
                          );
                          const appointmentId =
                            matchedAppointment?.showAppointmentResponse
                              ?.appointmentId;
                          if (appointmentId) {
                            setConfirmDelete({
                              appointmentId,
                              sampleId: item.sampleResponse.sampleId,
                            });
                          } else {
                            toast.error(
                              'Không tìm thấy appointmentId cho mẫu này'
                            );
                          }
                        }}
                      >
                        Hủy mẫu
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
      {confirmDelete && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmModal}>
            <p>Bạn có chắc chắn muốn xóa mẫu này?</p>
            <div className={styles.confirmActions}>
              <button
                className={styles.confirmBtn}
                onClick={() => {
                  handleDelete(
                    confirmDelete.appointmentId,
                    confirmDelete.sampleId
                  ); // ✅ gọi API
                  setConfirmDelete(null);
                }}
              >
                Đồng ý
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setConfirmDelete(null)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectSampleAtCenter;
