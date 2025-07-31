/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { ArrowBack, Check } from '@mui/icons-material';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './CollectorSlot.module.css';
import Swal from 'sweetalert2';

export const CollectSampleAtHome = () => {
  const [sample, setSample] = useState<any[]>([]);
  const { appointmentId } = useParams();
  const [appointments, setAppointments] = useState<any[]>([]);
  const sampleTypes = [
    'Niêm mạc miệng',
    'Máu',
    'Móng tay / móng chân',
    'Răng',
    'Tóc',
  ];
  const sampleStatusOptions = [
    { value: 'COLLECTED', label: 'Đã thu thập mẫu' },
    // { value: 'IN_TRANSIT', label: 'Đang vận chuyển' },
    { value: 'RECEIVED', label: 'Đã nhận tại phòng xét nghiệm' },
  ];
  const [kitStatus, setKitStatus] = useState<any[]>([]);
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
    { value: 'FAILED', label: 'Giao hàng thất bại' },
    { value: 'DONE', label: 'Kit đã được nhận về' },
  ];

  const [confirmDelete, setConfirmDelete] = useState<{
    appointmentId: string;
    sampleId: string;
  } | null>(null);
  const fetchAppointmentAtHome = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/appointment/get-appointment-at-home-to-get-sample?appointmentId=${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);

        const appointmentIds = data
          .filter(
            (a: any) =>
              a.showAppointmentResponse?.appointmentType === 'HOME' &&
              a.showAppointmentResponse?.appointmentStatus === 'CONFIRMED'
          )
          .map((a: any) => a.showAppointmentResponse?.appointmentId);

        if (appointmentIds.length > 0) {
          await fetchSampleData(appointmentIds);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSampleData = async (appointmentIds: (number | string)[]) => {
    try {
      setLoading(true);
      const allSamples: any[] = [];

      for (const id of appointmentIds) {
        const response = await fetch(
          `http://localhost:8080/api/sample/get-all-sample?appointmentId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!response.ok) throw new Error('Fetch failed');

        const data = await response.json();
        allSamples.push(...data);
      }

      setSample(allSamples);
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
  const fetchKitStatus = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/kit-delivery-status/get-kit-status-staff',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await res.json();
      setKitStatus(data);
    } catch (error) {
      console.error('Lỗi:', error);
      toast.error('Lỗi hệ thống khi lấy trạng thái kit');
    }
  };
  useEffect(() => {
    fetchKitStatus();
  }, []);
  const handleUpdate = async (
    sampleId: string,
    sampleStatus: string,
    appointmentId: number
  ) => {
    if (!sampleId) {
      toast.error('Không tìm thấy sampleId để cập nhật trạng thái');
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
        toast.error(`Không thể cập nhật trạng thái cũ`);
      } else {
        toast.success('Cập nhật trạng thái thành công');
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

  const findSampleByPatientAndAppointment = (
    patientId: number,
    appointmentId: number
  ): any | undefined => {
    return sample.find(
      (s) =>
        s.patientSampleResponse.patientId === patientId &&
        s.appointmentSampleResponse.appointmentId === appointmentId
    );
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
        fetchSampleData([appointmentId]);
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
        window.location.href = `/s-page/checkAppointmentAtHome/${appointmentId}`;
      } else {
        toast.error('Không thể cập nhật trạng thái cũ');
      }
    } catch (error) {
      console.log(error);
      toast.error('Lỗi khi cập nhật trạng thái');
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
        fetchSampleData([appointmentId]);
        toast.success('Thu mẫu thành công');
      }
    } catch (error) {
      console.log(error);
      toast.error('Lỗi khi gửi mẫu');
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
      <NavLink to="/s-page/selectorSlot">
        <ArrowBack></ArrowBack>
      </NavLink>
      <div className={styles.header}>
        <h1 className={styles.title}>Danh sách Slot & Lịch hẹn</h1>
      </div>
      {/* Bảng thông tin khách tại nhà */}
      <div>
        {groupedAppointments.map((appointmentItem, appointmentIndex) => {
          const appointmentId =
            appointmentItem.showAppointmentResponse?.appointmentId;
          const serviceId =
            appointmentItem.serviceAppointmentResponses?.[0]?.serviceId;
          const patients = appointmentItem.patientAppointmentResponse;
          const appointmentDate =
            appointmentItem.showAppointmentResponse?.appointmentDate;

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
                      {appointments[0]?.patientAppointmentResponse[0]
                        ?.patientStatus !== 'COMPLETED' &&
                        kitStatus.some(
                          (k) =>
                            k.appointmentId === appointmentId &&
                            k.deliveryStatus === 'DONE'
                        ) && (
                          <th className={styles.tableHeaderCell}>Thu mẫu</th>
                        )}
                      {appointments[0]?.patientAppointmentResponse[0]
                        ?.patientStatus !== 'COMPLETED' &&
                        kitStatus.some(
                          (k) =>
                            k.appointmentId === appointmentId &&
                            k.deliveryStatus !== 'DONE'
                        ) && (
                          <th className={styles.tableHeaderCell}>
                            Trạng thái Kit
                          </th>
                        )}
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient: any, index: number) => {
                      const sampleData = findSampleByPatientAndAppointment(
                        patient.patientId,
                        appointmentId
                      );

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
                          <td className={styles.tableCell}>{patient.gender}</td>
                          <td className={styles.tableCell}>
                            {patient.relationship}
                          </td>
                          {kitStatus.some(
                            (k) =>
                              k.appointmentId === appointmentId &&
                              k.deliveryStatus === 'DONE'
                          ) &&
                            patient.patientStatus !== 'COMPLETED' && (
                              <td className={styles.tableCell}>
                                <div className={styles.inputGroup}>
                                  <select
                                    className={styles.sampleSelect}
                                    value={sampleType[key as any] || ''}
                                    onChange={(e) =>
                                      handleSeletedSample(e, key)
                                    }
                                  >
                                    <option value="">Thu mẫu</option>
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
                            )}

                          {isFirstPatient &&
                            patient.patientStatus !== 'COMPLETED' &&
                            kitStatus.some(
                              (k) =>
                                k.appointmentId === appointmentId &&
                                k.deliveryStatus !== 'DONE'
                            ) && (
                              <td
                                className={`${styles.tableCell} ${styles.statusColumn}`}
                                rowSpan={patients.length}
                              >
                                <select
                                  className={styles.statusSelect}
                                  value={
                                    selectedStatus[appointmentId] ??
                                    kitStatus.find(
                                      (k) => k.appointmentId === appointmentId
                                    )?.deliveryStatus ??
                                    'PENDING'
                                  }
                                  onChange={async (e) => {
                                    const newStatus = e.target.value;
                                    const currentStatus =
                                      selectedStatus[appointmentId] ||
                                      'PENDING';

                                    const result = await Swal.fire({
                                      title: 'Xác nhận thay đổi trạng thái?',
                                      text: `Bạn có chắc chắn muốn đổi trạng thái này?`,
                                      icon: 'question',
                                      showCancelButton: true,
                                      confirmButtonText: 'Xác nhận',
                                      cancelButtonText: 'Hủy',
                                    });

                                    if (result.isConfirmed) {
                                      setSelectedStatus({
                                        [appointmentId]: newStatus,
                                      });
                                      handleUpdateStatus(
                                        appointmentId,
                                        newStatus,
                                        currentStatus
                                      );
                                    }
                                  }}
                                >
                                  {statusOptions.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
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
        {sample.length > 0 ? (
          <div>
            <h2 className={styles.subTitle}>Danh sách mẫu đã nhập</h2>
            <div className={styles.collectedSamplesContainer}>
              <table className={styles.collectedSamplesTable}>
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Loại mẫu</th>
                    <th>Mã mẫu</th>
                    <th>Ngày thu</th>
                    <th>Người thu</th>
                    <th>Trạng thái mẫu</th>
                    {sample.some(
                      (s) => s.sampleResponse.sampleStatus === 'COLLECTED'
                    ) && <th>Thao tác</th>}
                  </tr>
                </thead>
                <tbody>
                  {sample.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>{item.patientSampleResponse.fullName}</td>
                      <td>{item.sampleResponse.sampleType}</td>
                      <td>{item.sampleResponse.sampleCode}</td>
                      <td>{item.sampleResponse.collectionDate}</td>
                      <td>{item.staffSampleResponse.fullName}</td>

                      {/* THÊM dropdown trạng thái mẫu ở đây */}
                      <td>
                        <select
                          value={item.sampleResponse.sampleStatus || ''}
                          onChange={async (e) => {
                            const selectedValue = e.target.value;

                            if (!selectedValue) return;

                            const result = await Swal.fire({
                              title: 'Xác nhận thay đổi?',
                              text: 'Bạn có chắc chắn muốn thay đổi trạng thái mẫu này?',
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonText: 'Xác nhận',
                              cancelButtonText: 'Hủy',
                            });

                            if (result.isConfirmed) {
                              handleUpdate(
                                item.sampleResponse.sampleId,
                                selectedValue,
                                item.appointmentSampleResponse.appointmentId
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
                      {item.sampleResponse.sampleStatus === 'COLLECTED' && (
                        <td>
                          <button
                            type="submit"
                            className={styles.cancelSampleBtn}
                            onClick={() => {
                              const matchedAppointment = appointments.find(
                                (a) =>
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
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
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
