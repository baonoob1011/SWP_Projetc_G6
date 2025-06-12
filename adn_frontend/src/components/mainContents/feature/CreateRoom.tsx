import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import CustomSnackBar from '../userinfor/Snackbar';

type Room = {
  roomName: string;
  openTime: string;
  closeTime: string;
};

const CreateRoom = () => {
  const [room, setRoom] = useState<Room>({
    roomName: '',
    openTime: '',
    closeTime: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const [auth, setAuth] = useState(false);

  useEffect(() => {
    setAuth(
      localStorage.getItem('role') === 'ADMIN' ||
        localStorage.getItem('role') === 'MANAGER'
    );
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoom((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8080/api/room/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(room),
      });

      if (!res.ok) {
        setSnackbar({
          open: true,
          message: 'Điền đầy đủ thông tin',
          severity: 'error',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Tạo phòng thành công',
          showConfirmButton: false,
          timer: 1300,
        });

        setRoom({ roomName: '', openTime: '', closeTime: '' });
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
    return;
  }
  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Tạo phòng Mới</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Số phòng</label>
          <input
            type="text"
            name="roomName"
            className="form-control"
            value={room.roomName}
            onChange={handleInput}
            placeholder="Nhập phòng"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mở</label>
          <input
            type="time"
            name="openTime"
            className="form-control"
            value={room.openTime}
            onChange={handleInput}
            placeholder="Nhập thời gian mở"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Đóng</label>
          <input
            type="time"
            name="closeTime"
            className="form-control"
            value={room.closeTime}
            onChange={handleInput}
            placeholder="Nhập thời gian đóng"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Tạo phòng
        </button>

        <CustomSnackBar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </form>
    </div>
  );
};

export default CreateRoom;
