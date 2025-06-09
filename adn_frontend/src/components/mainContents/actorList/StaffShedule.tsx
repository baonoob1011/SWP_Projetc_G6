import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type SlotInfo = {
  slotId: number;
  slotDate: string;
  startTime: string;
  endTime: string;
  location: string | null;
};

const StaffSlot = () => {
  const [auth, setAuth] = useState(true);
  const [slot, setSlot] = useState<SlotInfo[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/staff/get-staff-slot',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!res.ok) throw new Error('Fetch error');
      const data = await res.json();
      setSlot(data);
    } catch (error) {
      console.error(error);
      toast.error('Không thể lấy dữ liệu');
    }
  };

  useEffect(() => {
    setAuth(localStorage.getItem('role') === 'STAFF');
  }, []);

  useEffect(() => {
    if (auth) fetchData();
  }, [auth]);

  if (!auth) {
    return null;
  }

  return (
    <TableContainer sx={{ marginTop: 20 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: '20px', border: '1px solid #ccc' }}>
              #
            </TableCell>
            <TableCell sx={{ fontSize: '20px', border: '1px solid #ccc' }}>
              Slot ID
            </TableCell>
            <TableCell sx={{ fontSize: '20px', border: '1px solid #ccc' }}>
              Room
            </TableCell>
            <TableCell sx={{ fontSize: '20px', border: '1px solid #ccc' }}>
              Start Time
            </TableCell>
            <TableCell sx={{ fontSize: '20px', border: '1px solid #ccc' }}>
              End Time
            </TableCell>
            <TableCell sx={{ fontSize: '20px', border: '1px solid #ccc' }}>
              Slot Date
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {slot.map((s, index) => (
            <TableRow key={s.slotId}>
              <TableCell sx={{ fontSize: '20px', border: '1px solid #ccc' }}>
                {index + 1}
              </TableCell>
              <TableCell sx={{ fontSize: '20px', border: '1px solid #ccc' }}>
                {s.slotId}
              </TableCell>
              <TableCell sx={{ fontSize: '20px', border: '1px solid #ccc' }}>
                {s.location ?? '–'}
              </TableCell>
              <TableCell sx={{ fontSize: '20px', border: '1px solid #ccc' }}>
                {s.startTime}
              </TableCell>
              <TableCell sx={{ fontSize: '20px', border: '1px solid #ccc' }}>
                {s.endTime}
              </TableCell>
              <TableCell sx={{ fontSize: '20px', border: '1px solid #ccc' }}>
                {s.slotDate}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StaffSlot;
