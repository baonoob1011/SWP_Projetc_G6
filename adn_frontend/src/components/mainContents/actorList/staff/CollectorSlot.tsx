import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const CollectorSlots = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate(); // 👈 Hook chuyển trang

  useEffect(() => {
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

    fetchSlots();
  }, [token]);

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
    </div>
  );
};
