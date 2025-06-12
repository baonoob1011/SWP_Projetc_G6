import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomSnackBar from '../userinfor/Snackbar';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import {
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
} from '@mui/material';

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
  fullName: string;
};

type Room = {
  roomId: string;
  roomName: string;
  openTime: string;
  closeTime: string;
  roomStatus: string;
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
  const [isSlot, setIsSlot] = useState<SlotInfo[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [auth, setAuth] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Kiểm tra quyền truy cập
  useEffect(() => {
    const role = localStorage.getItem('role');
    setAuth(role === 'ADMIN' || role === 'MANAGER');
  }, []);

  // Gán lại staffId khi thay đổi param
  useEffect(() => {
    setIsSchedule((prev) => ({
      ...prev,
      staffId: staffId || '',
    }));
  }, [staffId]);

  // Lấy danh sách phòng
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
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json(); // <-- Đây mới là dữ liệu JSON
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const simplifiedSlotInfo: SlotInfo[] = data.map((item: any) => ({
        slotId: item.slotResponse.slotId,
        slotDate: item.slotResponse.slotDate,
        startTime: item.slotResponse.startTime,
        endTime: item.slotResponse.endTime,
        fullName: item.staffSlotResponse.fullName,
        roomName: item.roomSlotResponse.roomName,
      }));

      setIsSlot(simplifiedSlotInfo);
    } catch (error) {
      console.error('Fetch rooms error:', error);
      toast.error('Không thể lấy danh sách lịch làm');
    }
  };

  useEffect(() => {
    if (auth) {
      fetchRoom();
    }
  }, [auth]);
  useEffect(() => {
    if (auth) {
      fetchSlot();
    }
  }, [auth]);

  // Xử lý thay đổi input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý chọn phòng
  const handleRoomChange = (event: SelectChangeEvent<string>) => {
    setSelectedRoom(event.target.value);
  };

  // Submit form
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

    const formattedSchedule = {
      roomId: selectedRoom,
      slotDate: isSchedule.slotDate,
      startTime: isSchedule.startTime + ':00',
      endTime: isSchedule.endTime + ':00',
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/slot/create-slot/${isSchedule.staffId}?roomId=${selectedRoom}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formattedSchedule),
        }
      );

      if (!res.ok) {
        let errorMessage = 'Không thể đăng ký'; // mặc định

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMessage = errorData.message || JSON.stringify(errorData);
        } else {
          errorMessage = await res.text();
        }

        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Xếp lịch thành công',
          showConfirmButton: false,
          timer: 1500,
        });

        setIsSchedule((prev) => ({
          ...prev,
          slotDate: '',
          startTime: '',
          endTime: '',
        }));
        setSelectedRoom('');
      }
      fetchRoom();
      fetchSlot();
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: 'Lỗi hệ thống',
        severity: 'error',
      });
    }
  };

  // Nếu không có quyền truy cập
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

      {/* Bảng danh sách lịch làm */}
      <div
        className="p-4 border rounded bg-light"
        style={{ maxWidth: 800, margin: '20px auto' }}
      >
        <h2 className="mb-3">Danh sách lịch đã đăng ký</h2>
        <table className="table table-bordered table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>Số phòng</th>
              <th>Tên nhân viên</th>
              <th>Ngày làm</th>
              <th>Thời gian mở</th>
              <th>Thời gian đóng</th>
            </tr>
          </thead>
          <tbody>
            {isSlot.map((slot) => (
              <tr key={slot.slotId}>
                <td>{slot.roomName}</td>
                <td>{slot.fullName}</td>
                <td>{slot.slotDate}</td>
                <td>{slot.startTime}</td>
                <td>{slot.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bảng thông tin phòng */}
      <div
        className="p-4 border rounded bg-light"
        style={{ maxWidth: 800, margin: '20px auto' }}
      >
        <h2 className="mb-3">Danh sách phòng</h2>
        <table className="table table-bordered table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>Số phòng</th>
              <th>Thời gian mở</th>
              <th>Thời gian đóng</th>
            </tr>
          </thead>
          <tbody>
            {isRoom.map((room) => (
              <tr key={room.roomId}>
                <td>{room.roomName}</td>
                <td>{room.openTime}</td>
                <td>{room.closeTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Snackbar thông báo */}
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
