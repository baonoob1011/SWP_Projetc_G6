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

const BookingHistory = () => {
  const [centerHistory, setCenterHistory] = useState<any[]>([]);
  const [homeHistory, setHomeHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

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

  const renderPaymentStatus = (status: string | null) => {
    if (!status) return <Chip label="Chưa thanh toán" color="default" />;
    return (
      <Chip
        label={status}
        color={
          status === 'PAID'
            ? 'success'
            : status === 'PENDING'
            ? 'warning'
            : 'default'
        }
      />
    );
  };

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
        <TableContainer component={Paper} className="shadow-md rounded-xl">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ngày</TableCell>
                <TableCell>Giờ</TableCell>
                <TableCell>Dịch vụ</TableCell>
                <TableCell>Phòng</TableCell>
                <TableCell>Địa điểm</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thanh toán</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {centerHistory.map((item, index) => {
                const a = item.showAppointmentResponse;
                const s = item.slotAppointmentResponse?.[0];
                const service = item.serviceAppointmentResponses?.[0];
                const loc = item.locationAppointmentResponses?.[0];
                const room = item.roomAppointmentResponse;
                const payment = item.paymentAppointmentResponse?.[0];
                return (
                  <TableRow key={index}>
                    <TableCell>{a?.appointmentDate}</TableCell>
                    <TableCell>
                      {s?.startTime?.slice(0, 5)} - {s?.endTime?.slice(0, 5)}
                    </TableCell>
                    <TableCell>{service?.serviceName}</TableCell>
                    <TableCell>{room?.roomName}</TableCell>
                    <TableCell>
                      {loc
                        ? `${loc.addressLine}, ${loc.district}, ${loc.city}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={a?.appointmentStatus}
                        color={
                          a?.appointmentStatus === 'CONFIRMED'
                            ? 'success'
                            : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {renderPaymentStatus(payment?.getPaymentStatus)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper} className="shadow-md rounded-xl">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ngày</TableCell>
                <TableCell>Dịch vụ</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Mã kit</TableCell>
                <TableCell>Số người</TableCell>
                <TableCell>Nội dung</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thanh toán</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {homeHistory.map((item, index) => {
                const a = item.showAppointmentResponse;
                const service = item.serviceAppointmentResponses?.[0];
                const kit = item.kitAppointmentResponse;
                const payment = item.paymentAppointmentResponses?.[0];
                return (
                  <TableRow key={index}>
                    <TableCell>{a?.appointmentDate}</TableCell>
                    <TableCell>{service?.serviceName}</TableCell>
                    <TableCell>{a?.note || '-'}</TableCell>
                    <TableCell>{kit?.kitCode}</TableCell>
                    <TableCell>{kit?.targetPersonCount}</TableCell>
                    <TableCell>{kit?.contents}</TableCell>
                    <TableCell>
                      <Chip
                        label={a?.appointmentStatus}
                        color={
                          a?.appointmentStatus === 'COMPLETED'
                            ? 'success'
                            : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {renderPaymentStatus(payment?.getPaymentStatus)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default BookingHistory;
