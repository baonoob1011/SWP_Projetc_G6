import { useEffect, useState } from 'react';

type SlotInfo = {
  slotId: number;
  slotDate: string;
  startTime: string;
  endTime: string;
  location: string;
  room: string;
};

const StaffSlot = () => {
  const [auth, setAuth] = useState(true);
  const [slot, setSlot] = useState<SlotInfo[]>([]);
  const [errorOpen, setErrorOpen] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Không có token');

      const res = await fetch(
        'http://localhost:8080/api/staff/get-staff-slot',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu');
      const data = await res.json();
      setSlot(data);
    } catch (error) {
      console.error(error);
      setErrorOpen(true);
      setTimeout(() => setErrorOpen(false), 4000); // Ẩn sau 4s
    }
  };

  useEffect(() => {
    setAuth(localStorage.getItem('role') === 'STAFF');
  }, []);

  useEffect(() => {
    if (auth) fetchData();
  }, [auth]);

  if (!auth) return null;

  return (
    <div className="container mt-4">
      <h3 className="mb-4 fw-bold">Danh sách ca làm việc</h3>

      {errorOpen && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          Không thể tải dữ liệu ca làm việc
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center align-middle">
          <thead className="table-primary">
            <tr>
              <th>STT</th>
              <th>Phòng</th>
              <th>Thời gian bắt đầu</th>
              <th>Thời gian kết thúc</th>
              <th>Ngày</th>
            </tr>
          </thead>
          <tbody>
            {slot.map((s, index) => (
              <tr key={s.slotId}>
                <td>{index + 1}</td>
                <td>{s.room}</td>
                <td>{s.startTime}</td>
                <td>{s.endTime}</td>
                <td>{s.slotDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffSlot;
