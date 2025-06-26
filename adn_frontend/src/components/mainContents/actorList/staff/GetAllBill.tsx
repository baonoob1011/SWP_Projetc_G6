/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useState } from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const GetAllBill = () => {
  const [bill, setBill] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');

  const fetchData = async () => {
    if (!phone) {
      toast.warning('Vui lòng nhập số điện thoại');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8080/api/cashier/get-appointment-of-user-by-phone`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ phone }),
        }
      );

      if (!res.ok) throw new Error('Không thể lấy dữ liệu');

      const data = await res.json();
      setBill(data);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (paymentId: number, appointmentId: number) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/cashier/get-payment-at-center?paymentId=${paymentId}&appointmentId=${appointmentId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!res.ok) throw new Error('Thanh toán thất bại');

      toast.success('Thanh toán thành công!');
      fetchData(); // Refresh lại danh sách sau khi thanh toán
    } catch (error) {
      toast.error('Lỗi khi thanh toán');
    }
  };

  return (
    <Box p={3} sx={{ margin: 10 }}>
      <Typography variant="h5" gutterBottom>
        Tra cứu hóa đơn theo số điện thoại
      </Typography>
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          variant="outlined"
        />
        <Button variant="contained" onClick={fetchData}>
          Tìm
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : bill.length === 0 ? (
        <Typography>Không tìm thấy hóa đơn nào.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>SĐT</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Ngày hẹn</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Dịch vụ</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Thanh toán</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bill.map((item, index) => {
                const paymentId =
                  item.paymentAppointmentResponse?.[0]?.paymentId;
                const appointmentId =
                  item.showAppointmentResponse?.appointmentId;
                const paymentStatus =
                  item.paymentAppointmentResponse?.[0]?.getPaymentStatus;

                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {item.userAppointmentResponse.fullName}
                    </TableCell>
                    <TableCell>{item.userAppointmentResponse.phone}</TableCell>
                    <TableCell>{item.userAppointmentResponse.email}</TableCell>
                    <TableCell>
                      {item.showAppointmentResponse.appointmentDate}
                    </TableCell>
                    <TableCell>
                      {item.showAppointmentResponse.appointmentStatus}
                    </TableCell>
                    <TableCell>
                      {item.serviceAppointmentResponses.serviceName}
                    </TableCell>
                    <TableCell>
                      {item.priceAppointmentResponse[0]?.price?.toLocaleString()}{' '}
                      VNĐ
                    </TableCell>
                    <TableCell>
                      {paymentStatus === 'PENDING' && (
                        <Button
                          variant="contained"
                          color="success"
                          size="medium"
                          startIcon={<FaMoneyBillWave />}
                          onClick={() =>
                            handlePayment(paymentId, appointmentId)
                          }
                        />
                      )}
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

export default GetAllBill;
