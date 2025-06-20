import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Paper,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const CheckAppointment = () => {
  const { slotId } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày hẹn</TableCell>
              <TableCell>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointmentItem, index) =>
              appointmentItem.patientAppointmentFullInfoResponses?.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (patient: any, idx: number) => (
                  <TableRow key={`${index}-${idx}`}>
                    <TableCell>{patient.fullName}</TableCell>
                    <TableCell>{patient.dateOfBirth}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.relationship}</TableCell>
                    <TableCell>{patient.patientStatus}</TableCell>
                    <TableCell>
                      {appointmentItem.showAppointmentResponse?.appointmentDate}
                    </TableCell>
                    <TableCell>
                      {appointmentItem.showAppointmentResponse?.note}
                    </TableCell>
                  </TableRow>
                )
              )
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
