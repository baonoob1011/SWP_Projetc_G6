/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import {} from '@mui/material'; // Thêm import nếu chưa có

const CheckResultByStaff = () => {
  const [data, setData] = useState<any[]>([]);
  // Thêm state tabIndex:
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
        'http://localhost:8080/api/appointment/get-all-appointment-by-staff-to-send-hard-copy',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.ok) {
        const jsonData = await res.json();
        setData(jsonData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Đơn yêu cầu in bản cứng
      </Typography>
      <>
        {
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>STT</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Ngày hẹn</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Trạng thái</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Ghi chú</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Thao tác</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item: any, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      {new Date(item.appointmentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getStatusText(item.appointmentStatus)}
                    </TableCell>
                    <TableCell>{item.note}</TableCell>
                    <TableCell>
                      <NavLink to={`/checkResultById/${item.appointmentId}`}>
                        Xem chi tiết
                      </NavLink>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        }
      </>
    </Paper>
  );
};

export default CheckResultByStaff;
