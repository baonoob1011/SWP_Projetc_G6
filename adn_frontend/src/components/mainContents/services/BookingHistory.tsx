/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './BookingHistory.module.css';

const ITEMS_PER_PAGE = 3;

const BookingHistory = () => {
  const [centerHistory, setCenterHistory] = useState<any[]>([]);
  const [homeHistory, setHomeHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  // Pagination state
  const [centerPage, setCenterPage] = useState(1);
  const [homePage, setHomePage] = useState(1);
  const translate = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'RATED':
        return 'Đã đánh giá';
      default:
        return 'Không xác định';
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/appointment/get-history',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!res.ok) throw new Error('Không thể lấy lịch sử đặt lịch');
      const data = await res.json();
      setCenterHistory(data.allAppointmentAtCenterResponse || []);
      setHomeHistory(data.allAppointmentAtHomeResponse || []);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi lấy lịch sử');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleTabChange = (_: any, newValue: number) => {
    setTabIndex(newValue);
  };

  // Pagination logic
  const centerTotalPages = Math.ceil(centerHistory.length / ITEMS_PER_PAGE);
  const homeTotalPages = Math.ceil(homeHistory.length / ITEMS_PER_PAGE);
  const centerStart = (centerPage - 1) * ITEMS_PER_PAGE;
  const centerEnd = centerStart + ITEMS_PER_PAGE;
  const homeStart = (homePage - 1) * ITEMS_PER_PAGE;
  const homeEnd = homeStart + ITEMS_PER_PAGE;
  const centerCurrent = centerHistory.slice(centerStart, centerEnd);
  const homeCurrent = homeHistory.slice(homeStart, homeEnd);

  // Empty state
  const renderEmpty = (msg: string) => (
    <div className={styles.emptyState}>
      <h3>{msg}</h3>
    </div>
  );

  // Pagination controls
  const renderPagination = (
    page: number,
    totalPages: number,
    setPage: (p: number) => void
  ) =>
    totalPages > 1 && (
      <div className={styles.paginationContainer}>
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          className={styles.paginationButton}
        >
          Trang trước
        </button>
        <div className={styles.paginationNumbers}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`${styles.paginationButton} ${
                page === p ? styles.paginationButtonActive : ''
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <button
          onClick={() => setPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className={styles.paginationButton}
        >
          Trang sau
        </button>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.tabsContainer}>
        <div className={styles.tabsList}>
          <button
            className={`${styles.tab} ${tabIndex === 0 ? styles.tabActive : ''}`}
            onClick={() => handleTabChange(null, 0)}
          >
            Tại trung tâm
          </button>
          <button
            className={`${styles.tab} ${tabIndex === 1 ? styles.tabActive : ''}`}
            onClick={() => handleTabChange(null, 1)}
          >
            Tại nhà
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <span className={styles.loadingText}>Đang tải dữ liệu...</span>
        </div>
      ) : tabIndex === 0 ? (
        centerHistory.length === 0 ? (
          renderEmpty('Không có lịch sử đặt lịch tại trung tâm')
        ) : (
          <>
            <div className={`${styles.tableContainer} ${styles.centerTable}`}>
              <table className={styles.table}>
                <thead className={styles.tableHeader}>
                  <tr>
                    <th className={styles.tableHeaderCell}>Ngày</th>
                    <th className={styles.tableHeaderCell}>Dịch vụ</th>
                    <th className={styles.tableHeaderCell}>Phòng</th>
                    <th className={styles.tableHeaderCell}>Địa điểm</th>
                    <th className={styles.tableHeaderCell}>Số tiền</th>
                    <th className={styles.tableHeaderCell}>Phương thức</th>
                    <th className={styles.tableHeaderCell}>Trạng thái</th>
                    <th className={styles.tableHeaderCell}>Thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  {centerCurrent.map((item, index) => {
                    const a = item.showAppointmentResponse;
                    const service = item.serviceAppointmentResponses?.[0];
                    const loc = item.locationAppointmentResponses?.[0];
                    const room = item.roomAppointmentResponse;
                    const payment = item.paymentAppointmentResponse?.[0];
                    
                    // Helper function to get status badge class
                    const getStatusBadgeClass = (status: string) => {
                      switch (status) {
                        case 'CONFIRMED':
                        case 'COMPLETED':
                          return `${styles.statusBadge} ${styles.statusBadgeSuccess}`;
                        case 'PENDING':
                          return `${styles.statusBadge} ${styles.statusBadgeWarning}`;
                        case 'CANCELLED':
                          return `${styles.statusBadge} ${styles.statusBadgeDanger}`;
                        case 'RATED':
                          return `${styles.statusBadge} ${styles.statusBadgeInfo}`;
                        default:
                          return `${styles.statusBadge} ${styles.statusBadgeSecondary}`;
                      }
                    };

                    return (
                      <tr key={index} className={styles.tableRow}>
                        <td className={styles.tableCell}>{a?.appointmentDate}</td>
                        <td className={styles.tableCell}>{service?.serviceName}</td>
                        <td className={styles.tableCell}>{room?.roomName}</td>
                        <td className={styles.tableCell}>
                          {loc
                            ? `${loc.addressLine}, ${loc.district}, ${loc.city}`
                            : '-'}
                        </td>
                        <td className={styles.tableCell}>
                          {payment.amount?.toLocaleString('vi-VN')} VND
                        </td>
                        <td className={styles.tableCell}>{payment.paymentMethod}</td>
                        <td className={styles.tableCell}>
                          <span className={getStatusBadgeClass(a?.appointmentStatus)}>
                            {translate(a?.appointmentStatus)}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={payment?.getPaymentStatus === 'PAID' 
                            ? styles.paymentStatusPaid 
                            : styles.paymentStatusUnpaid
                          }>
                            {payment?.getPaymentStatus === 'PAID'
                              ? 'Đã thanh toán'
                              : 'Chưa thanh toán'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {renderPagination(centerPage, centerTotalPages, setCenterPage)}
          </>
        )
      ) : homeHistory.length === 0 ? (
        renderEmpty('Không có lịch sử đặt lịch tại nhà')
      ) : (
        <>
          <div className={`${styles.tableContainer} ${styles.homeTable}`}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell}>Ngày</th>
                  <th className={styles.tableHeaderCell}>Dịch vụ</th>
                  <th className={styles.tableHeaderCell}>Tên kit</th>
                  <th className={styles.tableHeaderCell}>Số tiền</th>
                  <th className={styles.tableHeaderCell}>Phương thức</th>
                  <th className={styles.tableHeaderCell}>Trạng thái</th>
                  <th className={styles.tableHeaderCell}>Thanh toán</th>
                </tr>
              </thead>
              <tbody>
                {homeCurrent.map((item, index) => {
                  const a = item.showAppointmentResponse;
                  const kit = item.kitAppointmentResponse;
                  const payment = item.paymentAppointmentResponses?.[0];
                  
                  // Helper function to get status badge class
                  const getStatusBadgeClass = (status: string) => {
                    switch (status) {
                      case 'CONFIRMED':
                      case 'COMPLETED':
                        return `${styles.statusBadge} ${styles.statusBadgeSuccess}`;
                      case 'PENDING':
                        return `${styles.statusBadge} ${styles.statusBadgeWarning}`;
                      case 'CANCELLED':
                        return `${styles.statusBadge} ${styles.statusBadgeDanger}`;
                      case 'RATED':
                        return `${styles.statusBadge} ${styles.statusBadgeInfo}`;
                      default:
                        return `${styles.statusBadge} ${styles.statusBadgeSecondary}`;
                    }
                  };

                  return (
                    <tr key={index} className={styles.tableRow}>
                      <td className={styles.tableCell}>{a?.appointmentDate}</td>
                      <td className={styles.tableCell}>{a?.note || '-'}</td>
                      <td className={styles.tableCell}>{kit.kitName}</td>
                      <td className={styles.tableCell}>
                        {payment.amount?.toLocaleString('vi-VN')} VND
                      </td>
                      <td className={styles.tableCell}>{payment.paymentMethod}</td>
                      <td className={styles.tableCell}>
                        <span className={getStatusBadgeClass(a?.appointmentStatus)}>
                          {translate(a?.appointmentStatus)}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        <span className={payment?.getPaymentStatus === 'PAID' 
                          ? styles.paymentStatusPaid 
                          : styles.paymentStatusUnpaid
                        }>
                          {payment?.getPaymentStatus === 'PAID'
                            ? 'Đã thanh toán'
                            : 'Chưa thanh toán'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {renderPagination(homePage, homeTotalPages, setHomePage)}
        </>
      )}
    </div>
  );
};

export default BookingHistory;
