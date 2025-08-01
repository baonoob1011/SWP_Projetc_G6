/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './AppointmentSchedule.module.css';
import type { Kit } from '../../type/BookingType';

const AppointmentSchedule = () => {
  const [homeSchedule, setHomeSchedule] = useState<any[]>([]);
  const [loadingHome, setLoadingHome] = useState(false);
  const [loadingRowId, setLoadingRowId] = useState<string | null>(null);
  const [isKit, setIsKit] = useState<Kit[]>([]);
  const translateCivilStatus = (status: string): string => {
    switch (status) {
      case 'CIVIL':
        return 'Dân sự';
      default:
        return status; // fallback nếu không khớp
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return 'Chờ xác nhận';
    }
  };
  const fetchData = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/kit/get-all-kit-staff',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!res.ok) {
        toast.error('không thể lấy danh sách Kit');
      } else {
        const data = await res.json();
        setIsKit(data);
      }
    } catch (error) {
      console.log(error);
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
        setHomeSchedule(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingHome(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
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
  const paidAppointments = homeSchedule
    .filter(
      (item) =>
        item.showAppointmentResponse.note === 'Đơn đăng ký đang đợi xác nhận'
    )
    .sort(
      (a, b) =>
        b.showAppointmentResponse.appointmentId -
        a.showAppointmentResponse.appointmentId
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
                      <div className={styles.headerInfo}>
                        <h3>
                          Đơn hàng {item.showAppointmentResponse.appointmentId}
                        </h3>
                        <p>{item.showAppointmentResponse.appointmentDate}</p>
                      </div>
                    </div>

                    <span className={styles.statusBadge}>
                      {getStatusText(
                        item.showAppointmentResponse.appointmentStatus
                      )}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className={styles.infoGrid}>
                    {/* Ngày hẹn */}
                    <div className={styles.infoItem}>
                      <p className={styles.infoLabel}>Ngày đặt</p>
                      <p className={styles.infoValue}>
                        {item.showAppointmentResponse.appointmentDate}
                      </p>
                      <div className={styles.infoItem}>
                        <p className={styles.infoLabel}>Mã Kit</p>
                        <p className={styles.infoValue}>
                          {item.kitAppointmentResponse?.kitCode || '—'}
                        </p>
                      </div>
                    </div>

                    {/* Trạng thái */}
                    <div className={styles.infoItem}>
                      <p className={styles.infoLabel}>Trạng Thái</p>
                      <p className={styles.infoValue}>
                        {getStatusText(item.showAppointmentResponse.appointmentStatus)}
                      </p>
                      <div className={styles.infoItem}>
                        <p className={styles.infoLabel}>Tên Kit</p>
                        <p className={styles.infoValue}>
                          {item.kitAppointmentResponse?.kitName || '—'}
                        </p>
                      </div>
                    </div>

                    {/* Ghi chú */}
                    <div className={styles.infoItem}>
                      <p className={styles.infoLabel}>Ghi Chú</p>
                      <p className={styles.infoValue}>
                        {item.showAppointmentResponse.note}
                      </p>
                      <div className={styles.infoItem}>
                        <p className={styles.infoLabel}>Số Người</p>
                        <p className={styles.infoValue}>2</p>
                      </div>
                    </div>

                    {/* Tên dịch vụ */}
                    <div className={styles.infoItem}>
                      <p className={styles.infoLabel}>Tên Dịch Vụ</p>
                      <p className={styles.infoValue}>
                        {item.serviceAppointmentResponses?.[0]?.serviceName ||
                          '—'}
                      </p>
                      <div className={styles.infoItem}>
                        <p className={styles.infoLabel}>Nội Dung Kit</p>
                        <p className={styles.infoValue}>
                          {item.kitAppointmentResponse?.contents || '—'}
                        </p>
                      </div>
                    </div>

                    {/* Loại dịch vụ */}
                    <div className={styles.infoItem}>
                      <p className={styles.infoLabel}>Loại Dịch Vụ</p>
                      <p className={styles.infoValue}>
                        {translateCivilStatus(
                          item.serviceAppointmentResponses?.[0]?.serviceType ||
                            '—'
                        )}
                      </p>
                      <div
                        className={`${styles.infoItem} ${styles.addressItem}`}
                      >
                        <p className={styles.infoLabel}>Địa Chỉ</p>
                        <p className={styles.infoValue}>
                          {item.userAppointmentResponses?.address || '—'}
                        </p>
                      </div>
                    </div>

                    {/* Mã kit */}

                    {/* Tên kit */}

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
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                <div className="flex items-center gap-1">
                  Mã Kit
                  <svg
                    className="w-3 h-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </svg>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                <div className="flex items-center gap-1">
                  Tên Kit
                  <svg
                    className="w-3 h-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </svg>
                </div>
              </th>
              {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                        <div className="flex items-center gap-1">
                          Số Người Sử Dụng
                          <svg
                            className="w-3 h-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                            />
                          </svg>
                        </div>
                      </th> */}
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                <div className="flex items-center gap-1">
                  Số Lượng Kit
                  <svg
                    className="w-3 h-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </svg>
                </div>
              </th>
              {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                        <div className="flex items-center gap-1">
                          Giá
                          <svg
                            className="w-3 h-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                            />
                          </svg>
                        </div>
                      </th> */}
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                <div className="flex items-center gap-1">
                  Nội Dung
                  <svg
                    className="w-3 h-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </svg>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isKit && isKit.length > 0 ? (
              isKit.map((kit, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-blue-600 font-medium border-r border-gray-200">
                    {kit.kitCode}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200">
                    {kit.kitName}
                  </td>
                  {/* <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                            {kit.targetPersonCount} người
                          </td> */}
                  <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                    <div className="flex items-center gap-2">
                      <span>{kit.quantity} kit</span>
                    </div>
                  </td>

                  {/* <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                            {kit.price}đ
                          </td> */}
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {kit.contents}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Không tìm thấy kit nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentSchedule;
