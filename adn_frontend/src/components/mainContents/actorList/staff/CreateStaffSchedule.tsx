import { getDay, parseISO, isSameWeek, format, addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type SlotInfo = {
  slotId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  roomName: string;
  fullName: string;
  staffId?: number;
};

type Props = {
  slots: SlotInfo[];
  currentWeekStart: Date;
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

const StaffScheduleTable = ({ slots, currentWeekStart }: Props) => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [localSlots, setLocalSlots] = useState<SlotInfo[]>([]);

  const getWeekDay = (dateStr: string) => getDay(parseISO(dateStr));

  // ✅ Load slots từ props và gán tên từ localStorage nếu có
  useEffect(() => {
    const savedMap = JSON.parse(
      localStorage.getItem('assignedStaffMap') || '{}'
    );
    const mappedSlots = slots.map((slot) => {
      const nameFromStorage = savedMap[slot.slotId];
      return {
        ...slot,
        fullName: nameFromStorage || slot.fullName,
      };
    });
    setLocalSlots(mappedSlots);
  }, [slots]);

  // ✅ Gọi API lấy danh sách nhân viên
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:8080/api/admin/get-all-staff', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        toast.error('Lỗi khi lấy danh sách nhân viên');
        return;
      }
      const data = await res.json();
      setStaffList(data);
    } catch (error) {
      console.error(error);
      toast.error('Không thể lấy dữ liệu nhân viên');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ API cập nhật và lưu vào localStorage
  const updateStaffToSlot = async (staffId: number, slotId: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        `http://localhost:8080/api/slot/update-staff-to-slot?staffId=${staffId}&slotId=${slotId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error('Cập nhật thất bại');

      toast.success('Cập nhật thành công!');

      const selectedStaff = staffList.find((s) => s.staffId === staffId);
      if (selectedStaff) {
        // ✅ Cập nhật localSlots
        setLocalSlots((prev) =>
          prev.map((slot) =>
            slot.slotId === slotId
              ? { ...slot, fullName: selectedStaff.fullName }
              : slot
          )
        );

        // ✅ Lưu vào localStorage
        const savedMap = JSON.parse(
          localStorage.getItem('assignedStaffMap') || '{}'
        );
        savedMap[slotId] = selectedStaff.fullName;
        localStorage.setItem('assignedStaffMap', JSON.stringify(savedMap));
      }
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi cập nhật nhân viên cho lịch');
    }
  };

  // ✅ Tạo bảng từ slot trong tuần
  const buildScheduleTable = () => {
    const filteredSlots = localSlots.filter((slot) =>
      isSameWeek(parseISO(slot.slotDate), currentWeekStart, { weekStartsOn: 1 })
    );

    const scheduleMap: Record<string, (SlotInfo | null)[]> = {};
    const dayOfWeek = [1, 2, 3, 4, 5]; // Thứ 2 -> 6

    const timeSlots = Array.from(
      new Set(
        filteredSlots.map((slot) => `${slot.startTime} - ${slot.endTime}`)
      )
    ).sort();

    timeSlots.forEach((time) => {
      scheduleMap[time] = dayOfWeek.map((day) => {
        return (
          filteredSlots.find(
            (slot) =>
              `${slot.startTime} - ${slot.endTime}` === time &&
              getWeekDay(slot.slotDate) === day
          ) || null
        );
      });
    });

    return scheduleMap;
  };

  const scheduleMap = buildScheduleTable();

  return (
    <div
      className="p-4 border rounded bg-light"
      style={{ maxWidth: '100%', overflowX: 'auto' }}
    >
      <h2 className="mb-3">Danh sách lịch đã đăng ký</h2>
      <table className="table table-bordered table-hover table-striped">
        <thead className="table-dark">
          <tr>
            <th>Khung giờ</th>
            {[0, 1, 2, 3, 4].map((offset) => {
              const day = addDays(currentWeekStart, offset);
              return (
                <th key={offset}>
                  Thứ {offset + 2}
                  <br />
                  <small>{format(day, 'dd/MM/yyyy')}</small>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {Object.entries(scheduleMap).map(([time, slots]) => (
            <tr key={time}>
              <td>
                <strong>{time}</strong>
              </td>
              {slots.map((slot) => (
                <td key={slot?.slotId || Math.random()}>
                  {slot ? (
                    <select
                      className="form-select"
                      value={
                        staffList.find((s) => s.fullName === slot.fullName)
                          ?.staffId || ''
                      }
                      onChange={(e) => {
                        const selectedStaffId = parseInt(e.target.value);
                        updateStaffToSlot(selectedStaffId, slot.slotId);
                      }}
                    >
                      <option value="">-- Chọn nhân viên --</option>
                      {staffList.map((staff) => (
                        <option key={staff.staffId} value={staff.staffId}>
                          {staff.fullName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    ''
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffScheduleTable;
