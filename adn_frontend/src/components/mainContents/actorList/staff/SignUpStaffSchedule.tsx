/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomSnackBar from '../../userinfor/Snackbar';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { startOfWeek, addWeeks, endOfWeek } from 'date-fns';
import {
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import StaffScheduleTable from './CreateStaffSchedule';
type Schedule = {
  staffId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
};

type SlotInfo = {
  slotId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  roomName: string;
  fullNames: string[]; // sửa cho khớp
};

type Room = {
  roomId: string;
  roomName: string;
  openTime: string;
  closeTime: string;
  roomStatus: string;
};

type Staff = {
  idCard: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  staffId: number;
  fullName: string;
  email: string;
  enabled: boolean;
  role: string;
  phone: string;
  createAt: string;
};

const SignUpStaffSchedule = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();

  const [isSchedule, setIsSchedule] = useState<Schedule>({
    staffId: staffId || '',
    slotDate: '',
    startTime: '',
    endTime: '',
  });

  const [isRoom, setIsRoom] = useState<Room[]>([]);
  const [isStaff, setIsStaff] = useState<Staff[]>([]);
  const [isCollector, setIsCollector] = useState<Staff[]>([]);
  const [isSlot, setIsSlot] = useState<SlotInfo[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedStaff1, setSelectedStaff1] = useState<string>('');
  const [selectedStaff2, setSelectedStaff2] = useState<string>('');
  const [auth, setAuth] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    setAuth(
      localStorage.getItem('role') === 'ADMIN' ||
        localStorage.getItem('role') === 'MANAGER'
    );
  }, []);

  useEffect(() => {
    setIsSchedule((prev) => ({
      ...prev,
      staffId: staffId || '',
    }));
  }, [staffId]);

  const fetchRoom = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/room/get-all-room', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        localStorage.clear();
        navigate('/login');
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setIsRoom(data);
    } catch (error) {
      console.error('Fetch rooms error:', error);
      toast.error('Không thể lấy danh sách phòng');
    }
  };
  const fetchStaff = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/staff/get-all-staff', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        localStorage.clear();
        navigate('/login');
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setIsStaff(data);
    } catch (error) {
      console.error('Fetch rooms error:', error);
      toast.error('Không thể lấy danh sách nhân viên');
    }
  };

  const fetchCollector = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/staff/get-all-staff-collector',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        localStorage.clear();
        navigate('/login');
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setIsCollector(data);
    } catch (error) {
      console.error('Fetch rooms error:', error);
      toast.error('Không thể lấy danh sách nhân viên');
    }
  };

  const fetchSlot = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/slot/get-all-slot', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        localStorage.clear();
        navigate('/login');
        return;
      }
      if (!res.ok) {
        toast.error('lỗi');
      }

      const data: any[] = await res.json();

      const slotInfo: SlotInfo[] = data.map((item) => ({
        slotId: String(item.slotResponse?.slotId ?? ''),
        slotDate: item.slotResponse?.slotDate ?? '',
        startTime: item.slotResponse?.startTime ?? '',
        endTime: item.slotResponse?.endTime ?? '',
        roomName: item.roomSlotResponse?.roomName ?? '',
        fullNames: item.staffSlotResponses?.map((s: any) => s.fullName) ?? [],
      }));

      setIsSlot(slotInfo);
    } catch (error) {
      console.error('Fetch slots error:', error);
      toast.error('Không thể lấy danh sách lịch làm');
    }
  };

  useEffect(() => {
    if (auth) {
      fetchRoom();
      fetchSlot();
      fetchStaff();
      fetchCollector();
    }
  }, [auth]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoomChange = (event: SelectChangeEvent<string>) => {
    setSelectedRoom(event.target.value);
  };
  const handleStaff1Change = (event: SelectChangeEvent<string>) => {
    setSelectedStaff1(event.target.value);
  };
  const handleStaff2Change = (event: SelectChangeEvent<string>) => {
    setSelectedStaff2(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedRoom) {
      setSnackbar({
        open: true,
        message: 'Vui lòng chọn phòng',
        severity: 'error',
      });
      return;
    }

    const requestBody = {
      slotRequest: {
        slotDate: isSchedule.slotDate,
        startTime: isSchedule.startTime + ':00',
        endTime: isSchedule.endTime + ':00',
      },
      staffSlotRequest: [
        { staffId: selectedStaff1 },
        { staffId: selectedStaff2 },
      ],
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/slot/create-slot?roomId=${selectedRoom}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        const errorMessage = contentType?.includes('application/json')
          ? (await res.json()).message
          : await res.text();

        setSnackbar({
          open: true,
          message: errorMessage || 'Không thể đăng ký',
          severity: 'error',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Xếp lịch thành công',
          showConfirmButton: false,
          timer: 1500,
        });

        // Reset form
        setIsSchedule({
          staffId: '',
          slotDate: '',
          startTime: '',
          endTime: '',
        });
        setSelectedRoom('');
        setSelectedStaff1('');
        setSelectedStaff2('');
      }
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: 'Lỗi hệ thống',
        severity: 'error',
      });
    }
  };

  if (!auth) {
    return (
      <p className="text-center mt-5 text-danger">
        Bạn không có quyền truy cập
      </p>
    );
  }

  return (
    <>
      {/* Form đăng ký lịch */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded bg-light"
        style={{ maxWidth: 400, margin: '20px auto' }}
      >
        <div className="mb-3">
          <FormControl fullWidth>
            <Select
              labelId="roomId"
              value={selectedRoom}
              onChange={handleRoomChange}
              input={<OutlinedInput />}
              displayEmpty
            >
              <MenuItem value="">
                <em>----Chọn phòng----</em>
              </MenuItem>
              {isRoom.map((room) => (
                <MenuItem key={room.roomId} value={room.roomId}>
                  {room.roomName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="mb-3">
          <FormControl fullWidth>
            <Select
              labelId="roomId"
              value={selectedStaff1}
              onChange={handleStaff1Change}
              input={<OutlinedInput />}
              displayEmpty
            >
              <MenuItem value="">
                <em>----Chọn nhân viên----</em>
              </MenuItem>
              {isStaff.map((staff) => (
                <MenuItem key={staff.staffId} value={staff.staffId}>
                  {staff.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="mb-3">
          <FormControl fullWidth>
            <Select
              labelId="roomId"
              value={selectedStaff2}
              onChange={handleStaff2Change}
              input={<OutlinedInput />}
              displayEmpty
            >
              <MenuItem value="">
                <em>----Chọn nhân viên thu mẫu----</em>
              </MenuItem>
              {isCollector.map((staff) => (
                <MenuItem key={staff.staffId} value={staff.staffId}>
                  {staff.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="mb-3">
          <label htmlFor="slotDate" className="form-label fw-bold">
            Ngày tạo lịch
          </label>
          <input
            type="date"
            className="form-control"
            id="slotDate"
            name="slotDate"
            value={isSchedule.slotDate}
            onChange={handleInput}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="startTime" className="form-label fw-bold">
            Giờ bắt đầu
          </label>
          <input
            type="time"
            className="form-control"
            id="startTime"
            name="startTime"
            value={isSchedule.startTime}
            onChange={handleInput}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="endTime" className="form-label fw-bold">
            Giờ kết thúc
          </label>
          <input
            type="time"
            className="form-control"
            id="endTime"
            name="endTime"
            value={isSchedule.endTime}
            onChange={handleInput}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 fw-bold">
          Đăng ký
        </button>
      </form>

      {/* Chuyển tuần */}
      <div
        className="d-flex justify-content-between align-items-center mb-3"
        style={{ maxWidth: 800, margin: '0 auto' }}
      >
        <button
          className="btn btn-outline-primary"
          onClick={() => setCurrentWeekStart((prev) => addWeeks(prev, -1))}
        >
          Tuần trước
        </button>
        <strong>
          Tuần từ {currentWeekStart.toLocaleDateString()} đến{' '}
          {endOfWeek(currentWeekStart, {
            weekStartsOn: 1,
          }).toLocaleDateString()}
        </strong>
        <button
          className="btn btn-outline-primary"
          onClick={() => setCurrentWeekStart((prev) => addWeeks(prev, 1))}
        >
          Tuần sau
        </button>
      </div>

      {/* Component hiển thị bảng lịch */}
      <StaffScheduleTable slots={isSlot} currentWeekStart={currentWeekStart} />

      {/* Snackbar */}
      <CustomSnackBar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default SignUpStaffSchedule;
