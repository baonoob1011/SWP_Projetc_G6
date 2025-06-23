/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  Typography,
  CircularProgress,
  Button,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Check } from '@mui/icons-material';
import { useNavigate, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

export const CollectorSlots = () => {
  const [slots, setSlots] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [sampleType, setSampleType] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'http://localhost:8080/api/slot/get-all-slot-of-staff',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setSlots(data);
    } catch (err) {
      console.error('Lỗi lấy slot:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchAppointmentAtHome = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/appointment/get-appointment-at-home-to-get-sample`,
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
    } catch (error) {
      toast.error('Không thể lấy dữ liệu lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentAtHome();
  }, []);

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

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        Danh sách Slot
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          {slots
            .filter((slot) => slot.slotResponse.slotStatus === 'BOOKED')
            .map((slot) => (
              <Button
                key={slot.slotResponse.slotId}
                variant="outlined"
                onClick={() =>
                  navigate(
                    `/s-page/checkAppointment/${slot.slotResponse.slotId}`
                  )
                }
                style={{ margin: '5px' }}
              >
                Slot {slot.slotResponse.slotId} - {slot.slotResponse.startTime}{' '}
                ~ {slot.slotResponse.endTime}
              </Button>
            ))}
        </div>
      )}

      {/* Bảng thông tin khách tại nhà */}
      <Table>
        {appointments.map((appointmentItem) => {
          const appointmentId =
            appointmentItem.showAppointmentResponse?.appointmentId;
          const serviceId =
            appointmentItem.serviceAppointmentResponses?.[0]?.serviceId;
          const isHome =
            appointmentItem.showAppointmentResponse?.appointmentType === 'HOME';
          const isConfirmed =
            appointmentItem.showAppointmentResponse?.appointmentStatus ===
            'CONFIRMED';

          if (!isHome || !isConfirmed) return null;

          return appointmentItem.patientAppointmentResponse.map(
            (patient: any, index: number) => {
              const key = `${appointmentId}_${patient.patientId}`;
              const isFirstPatient = index === 0;

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
                    {appointmentItem.showAppointmentResponse?.note || '-'}
                  </TableCell>
                  <TableCell>
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
                      >
                        <Check fontSize="small" />
                      </Button>

                      {/* Nút chỉ hiển thị ở dòng đầu tiên */}
                      {isFirstPatient && (
                        <Button
                          component={NavLink}
                          to={`/s-page/get-appointment/${appointmentId}`}
                          variant="outlined"
                          color="secondary"
                          size="small"
                        >
                          Xem thông tin
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            }
          );
        })}
      </Table>
    </div>
  );
};
