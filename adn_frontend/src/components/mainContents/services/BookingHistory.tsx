/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { toast } from 'react-toastify';

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
    <Box textAlign="center" py={6}>
      <Typography variant="h6" color="textSecondary">
        {msg}
      </Typography>
    </Box>
  );

  // Pagination controls
  const renderPagination = (
    page: number,
    totalPages: number,
    setPage: (p: number) => void
  ) =>
    totalPages > 1 && (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={3}
        gap={2}
      >
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid #ccc',
            background: page === 1 ? '#f3f3f3' : '#fff',
            color: page === 1 ? '#aaa' : '#333',
            cursor: page === 1 ? 'not-allowed' : 'pointer',
            fontWeight: 500,
          }}
        >
          Trang trước
        </button>
        <Box display="flex" gap={1}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #ccc',
                background: page === p ? '#2563eb' : '#fff',
                color: page === p ? '#fff' : '#333',
                fontWeight: page === p ? 700 : 500,
                cursor: 'pointer',
                margin: 0,
              }}
            >
              {p}
            </button>
          ))}
        </Box>
        <button
          onClick={() => setPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid #ccc',
            background: page === totalPages ? '#f3f3f3' : '#fff',
            color: page === totalPages ? '#aaa' : '#333',
            cursor: page === totalPages ? 'not-allowed' : 'pointer',
            fontWeight: 500,
          }}
        >
          Trang sau
        </button>
      </Box>
    );

  return (
    <Box className="max-w-7xl mx-auto px-4 py-6">
      <Typography variant="h5" gutterBottom>
        Lịch Sử Đặt Lịch
      </Typography>

      <Tabs value={tabIndex} onChange={handleTabChange} className="mb-4">
        <Tab label="Tại trung tâm" />
        <Tab label="Tại nhà" />
      </Tabs>

      {loading ? (
        <Typography>Đang tải dữ liệu...</Typography>
      ) : tabIndex === 0 ? (
        centerHistory.length === 0 ? (
          renderEmpty('Không có lịch sử đặt lịch tại trung tâm')
        ) : (
          <>
            <TableContainer component={Paper} className="shadow-md rounded-xl">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ngày</TableCell>
                    <TableCell>Dịch vụ</TableCell>
                    <TableCell>Phòng</TableCell>
                    <TableCell>Địa điểm</TableCell>
                    <TableCell>Số tiền</TableCell>
                    <TableCell>Phương thúc thanh toán</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Thanh toán</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {centerCurrent.map((item, index) => {
                    const a = item.showAppointmentResponse;
                    const service = item.serviceAppointmentResponses?.[0];
                    const loc = item.locationAppointmentResponses?.[0];
                    const room = item.roomAppointmentResponse;
                    const payment = item.paymentAppointmentResponse?.[0];
                    return (
                      <TableRow key={index}>
                        <TableCell>{a?.appointmentDate}</TableCell>
                        <TableCell>{service?.serviceName}</TableCell>
                        <TableCell>{room?.roomName}</TableCell>
                        <TableCell>
                          {loc
                            ? `${loc.addressLine}, ${loc.district}, ${loc.city}`
                            : '-'}
                        </TableCell>

                        <TableCell>
                          {payment.amount?.toLocaleString('vi-VN')} VND
                        </TableCell>
                        <TableCell>{payment.paymentMethod} </TableCell>
                        <TableCell>
                          <Chip
                            label={translate(a?.appointmentStatus)}
                            color={
                              a?.appointmentStatus === 'CONFIRMED'
                                ? 'success'
                                : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {payment?.getPaymentStatus === 'PAID'
                            ? 'Đã thanh toán'
                            : 'Chưa thanh toán'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {renderPagination(centerPage, centerTotalPages, setCenterPage)}
          </>
        )
      ) : homeHistory.length === 0 ? (
        renderEmpty('Không có lịch sử đặt lịch tại nhà')
      ) : (
        <>
          <TableContainer component={Paper} className="shadow-md rounded-xl">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Dịch vụ</TableCell>
                  <TableCell>Tên kit</TableCell>
                  <TableCell>Số tiền</TableCell>
                  <TableCell>Phương thúc thanh toán</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thanh toán</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {homeCurrent.map((item, index) => {
                  const a = item.showAppointmentResponse;
                  const kit = item.kitAppointmentResponse;
                  const payment = item.paymentAppointmentResponses?.[0];
                  return (
                    <TableRow key={index}>
                      <TableCell>{a?.appointmentDate}</TableCell>
                      <TableCell>{a?.note || '-'}</TableCell>
                      <TableCell>{kit.kitName}</TableCell>
                      <TableCell>
                        {payment.amount?.toLocaleString('vi-VN')} VND
                      </TableCell>
                      <TableCell>{payment.paymentMethod} </TableCell>

                      <TableCell>
                        <Chip
                          label={translate(a?.appointmentStatus)}
                          color={
                            a?.appointmentStatus === 'COMPLETED'
                              ? 'success'
                              : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {payment?.getPaymentStatus === 'PAID'
                          ? 'Đã thanh toán'
                          : 'Chưa thanh toán'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {renderPagination(homePage, homeTotalPages, setHomePage)}
        </>
      )}
    </Box>
  );
};

export default BookingHistory;
