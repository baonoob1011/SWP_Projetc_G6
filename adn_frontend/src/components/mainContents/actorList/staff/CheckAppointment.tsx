/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { toast } from 'react-toastify';
import { NavLink, useParams } from 'react-router-dom';
import { Check } from '@mui/icons-material';
import { FaYelp } from 'react-icons/fa';

const CheckAppointment = () => {
  const { slotId } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sampleType, setSampleType] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!slotId) return;

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Không thể lấy dữ liệu lịch hẹn');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [slotId]);

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
      if (res.ok) {
        toast.success('Thu mẫu thành công');
      } else {
        toast.error('Thu mẫu thất bại');
      }
    } catch (error) {
      console.log(error);
      toast.error('Lỗi khi gửi mẫu');
    }
  };

  const role = localStorage.getItem('role');
  if (role !== 'STAFF') {
    return (
      <Typography variant="h6" color="error">
        Bạn không có quyền truy cập trang này.
      </Typography>
    );
  }

  return (
    <Paper
      style={{
        padding: '20px',
        maxWidth: '1000px',
        margin: 'auto',
        marginTop: '40px',
      }}
    >
      {loading ? (
        <Typography>Đang tải dữ liệu...</Typography>
      ) : appointments.length > 0 ? (
        <Table style={{ marginTop: '20px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Họ tên</TableCell>
              <TableCell>Ngày sinh</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Quan hệ</TableCell>
              <TableCell>Ngày hẹn</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell>Vật xét nghiệm</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointmentItem) =>
              appointmentItem.patientAppointmentResponse.map((patient: any) => {
                const appointmentId =
                  appointmentItem.showAppointmentResponse?.appointmentId;
                const serviceId =
                  appointmentItem.serviceAppointmentResponses?.[0]?.serviceId;
                const key = `${appointmentId}_${patient.patientId}`;
                const isPaid =
                  appointmentItem.showAppointmentResponse?.note ===
                  'Đã thanh toán';

                return (
                  <TableRow key={key}>
                    <TableCell>{patient.fullName}</TableCell>
                    <TableCell>{patient.dateOfBirth}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.relationship}</TableCell>
                    <TableCell>
                      {appointmentItem.showAppointmentResponse?.appointmentDate}
                    </TableCell>
                    <TableCell>
                      {appointmentItem.showAppointmentResponse?.note}
                    </TableCell>
                    <TableCell>
                      {isPaid ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <TextField
                            size="small"
                            placeholder="Nhập vật mẫu"
                            value={sampleType[key] || ''}
                            onChange={(e) =>
                              setSampleType((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }))
                            }
                            style={{ minWidth: 150 }}
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() =>
                              handleSendSample(
                                patient.patientId,
                                serviceId,
                                appointmentId,
                                key
                              )
                            }
                            style={{
                              minWidth: 36,
                              height: 36,
                              padding: 0,
                              minHeight: 36,
                            }}
                          >
                            <Check fontSize="small" />
                          </Button>
                          <Button
                            component={NavLink}
                            to={`/s-page/get-appointment/${appointmentId}`}
                            variant="contained"
                            color="primary"
                            size="small"
                            style={{
                              minWidth: 36,
                              height: 36,
                              padding: 0,
                              minHeight: 36,
                            }}
                          >
                            <FaYelp fontSize="small" />
                          </Button>
                        </Box>
                      ) : (
                        <Typography color="textSecondary">
                          Chưa thanh toán
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      ) : (
        <Typography style={{ marginTop: '20px' }}>
          Không có lịch hẹn nào.
        </Typography>
      )}
    </Paper>
  );
};

export default CheckAppointment;
