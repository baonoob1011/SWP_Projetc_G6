import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { showErrorSnackbar, showSuccessAlert } from './utils/notifications';

type Schedule = {
  staffId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
};

const StaffSchedule = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const [isSchedule, setIsSchedule] = useState<Schedule>({
    staffId: staffId || '',
    slotDate: '',
    startTime: '',
    endTime: '',
  });
  const [auth, setAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedSchedule = {
      slotDate: isSchedule.slotDate,
      startTime: isSchedule.startTime + ':00',
      endTime: isSchedule.endTime + ':00',
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/slot/create-slot/${isSchedule.staffId}`,
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
        setError('Không thể đăng ký');
        return;
      }

      showSuccessAlert('Thành công', 'Xếp lịch thành công');
      setIsSchedule((prev) => ({
        ...prev,
        slotDate: '',
        startTime: '',
        endTime: '',
      }));
    } catch (error) {
      console.log(error);
      setError('Lỗi hệ thống');
    }
  };

  if (!isSchedule.staffId) {
    return <div>Không tìm thấy nhân viên để tạo slot</div>;
  }

  if (!auth) {
    return;
  }

  return (
    <>
      {error && showErrorSnackbar(error)}
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded bg-light"
        style={{ maxWidth: 400, margin: '20px auto' }}
      >
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
    </>
  );
};

export default StaffSchedule;
