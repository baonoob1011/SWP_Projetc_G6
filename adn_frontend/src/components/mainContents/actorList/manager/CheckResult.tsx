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
  CircularProgress,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import {} from '@mui/material'; // Thêm import nếu chưa có
import Swal from 'sweetalert2';
const CheckResult = () => {
  const [data, setData] = useState<any[]>([]);
  const [refund, setRefund] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // Thêm state tabIndex:
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'WAITING_MANAGER_APPROVAL':
        return 'Chờ duyệt kết quả';
      case 'WAITING_MANAGER_APPROVAL_REFUND':
        return 'Chờ duyệt hoàn tiền';
      default:
        return status;
    }
  };
  const fetchData = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/appointment/get-all-appointment-by-manager',
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
    } finally {
      setLoading(false);
    }
  };
  const fetchRefund = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/appointment/get-all-appointment-by-manager-to-refund',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.ok) {
        const jsonData = await res.json();
        setRefund(jsonData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (appointmentId: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/payment/refund?appointmentId=${appointmentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({}),
        }
      );
      if (!res.ok) {
        toast.warning('Ko thể thực hiện');
      } else {
        toast.success('Hoàn tiền thành công');
        fetchRefund();
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
    fetchRefund();
  }, []);

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Quản lý lịch hẹn & hoàn tiền
      </Typography>

      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="Đơn đã hoàn thành" />
        <Tab label="Đơn cần hoàn tiền" />
      </Tabs>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {tabIndex === 0 && (
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
          )}

          {tabIndex === 1 && (
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
                      <strong>Hoàn tiền</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {refund.map((item: any, idx) => (
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
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            Swal.fire({
                              title: 'Xác nhận hoàn tiền?',
                              text: 'Bạn có chắc chắn muốn hoàn tiền cho cuộc hẹn này?',
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor: '#3085d6',
                              cancelButtonColor: '#d33',
                              confirmButtonText: 'Có, hoàn tiền!',
                              cancelButtonText: 'Hủy',
                            }).then((result) => {
                              if (result.isConfirmed) {
                                handleRefund(item.appointmentId);
                              }
                            });
                          }}
                        >
                          Hoàn tiền
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Paper>
  );
};

export default CheckResult;
