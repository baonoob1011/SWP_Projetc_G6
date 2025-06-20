import { getDay, parseISO, isSameWeek, format, addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type SlotInfo = {
  slotId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  roomName: string;
  fullNames: string[]; // Tên 2 nhân viên
};

type Props = {
  slots: SlotInfo[];
  currentWeekStart: Date;
};

type Staff = {
  staffId: number;
  fullName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const StaffScheduleTable = ({ slots, currentWeekStart }: Props) => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [localSlots, setLocalSlots] = useState<SlotInfo[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');

  useEffect(() => {
    const savedMap: Record<string, string[]> = JSON.parse(
      localStorage.getItem('assignedStaffMap') || '{}'
    );

    const mappedSlots = slots.map((slot) => {
      const savedNames = savedMap[slot.slotId];
      return {
        ...slot,
        fullNames: savedNames || slot.fullNames || [],
      };
    });

    setLocalSlots(mappedSlots);
    if (mappedSlots.length > 0 && !selectedRoom) {
      setSelectedRoom(mappedSlots[0].roomName);
    }
  }, [slots]);

  useEffect(() => {
    const fetchStaff = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(
          'http://localhost:8080/api/admin/get-all-staff',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setStaffList(data);
      } catch {
        toast.error('Không thể tải danh sách nhân viên');
      }
    };
    fetchStaff();
  }, []);

  const updateStaffToSlot = async (
    newStaffId: number,
    slotId: string,
    index: number
  ) => {
    const token = localStorage.getItem('token');
    const currentSlot = localSlots.find((s) => s.slotId === slotId);
    if (!currentSlot) return;

    const otherIndex = index === 0 ? 1 : 0;
    const otherName = currentSlot.fullNames[otherIndex];
    const otherStaffId = staffList.find(
      (s) => s.fullName === otherName
    )?.staffId;

    const staffId1 = index === 0 ? newStaffId : otherStaffId ?? newStaffId;
    const staffId2 = index === 1 ? newStaffId : otherStaffId ?? newStaffId;

    try {
      const res = await fetch(
        `http://localhost:8080/api/slot/update-staff-to-slot?staffId1=${staffId1}&staffId2=${staffId2}&slotId=${slotId}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error();
      toast.success('Cập nhật nhân viên thành công');

      const newName = staffList.find((s) => s.staffId === newStaffId)?.fullName;
      if (!newName) return;

      setLocalSlots((prev) =>
        prev.map((slot) =>
          slot.slotId === slotId
            ? {
                ...slot,
                fullNames: slot.fullNames.map((name, i) =>
                  i === index ? newName : name
                ),
              }
            : slot
        )
      );

      const savedMap: Record<string, string[]> = JSON.parse(
        localStorage.getItem('assignedStaffMap') || '{}'
      );

      const updatedNames = currentSlot.fullNames.map((name, i) =>
        i === index ? newName : name
      );
      savedMap[slotId] = updatedNames;
      localStorage.setItem('assignedStaffMap', JSON.stringify(savedMap));
    } catch {
      toast.error('Lỗi khi cập nhật nhân viên');
    }
  };

  const getWeekDay = (dateStr: string) => getDay(parseISO(dateStr));
  const roomOptions = Array.from(new Set(localSlots.map((s) => s.roomName)));

  const buildScheduleTable = () => {
    const filteredSlots = localSlots.filter(
      (slot) =>
        isSameWeek(parseISO(slot.slotDate), currentWeekStart, {
          weekStartsOn: 1,
        }) && slot.roomName === selectedRoom
    );

    const timeSlots = Array.from(
      new Set(filteredSlots.map((s) => `${s.startTime} - ${s.endTime}`))
    ).sort();

    const dayOfWeek = [1, 2, 3, 4, 5];
    const scheduleMap: Record<string, (SlotInfo | null)[]> = {};

    timeSlots.forEach((time) => {
      scheduleMap[time] = dayOfWeek.map(
        (day) =>
          filteredSlots.find(
            (slot) =>
              `${slot.startTime} - ${slot.endTime}` === time &&
              getWeekDay(slot.slotDate) === day
          ) || null
      );
    });

    return scheduleMap;
  };

  const scheduleMap = buildScheduleTable();

  return (
    <div className="p-4 border rounded bg-light" style={{ overflowX: 'auto' }}>
      <h2 className="mb-3">Danh sách lịch đã đăng ký</h2>

      <div className="mb-3">
        <label htmlFor="roomFilter" className="form-label fw-bold">
          Chọn phòng:
        </label>
        <select
          id="roomFilter"
          className="form-select w-auto d-inline-block ms-2"
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
        >
          {roomOptions.map((room) => (
            <option key={room} value={room}>
              {room}
            </option>
          ))}
        </select>
      </div>

      <table className="table table-bordered table-striped">
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
                  {slot &&
                    [0, 1].map((i) => {
                      const selectedId =
                        staffList.find((s) => s.fullName === slot.fullNames[i])
                          ?.staffId || '';

                      return (
                        <div key={i} className="mb-1">
                          <select
                            className="form-select"
                            value={selectedId}
                            onChange={(e) =>
                              updateStaffToSlot(
                                parseInt(e.target.value),
                                slot.slotId,
                                i
                              )
                            }
                          >
                            <option value="">
                              -- Chọn nhân viên {i + 1} --
                            </option>
                            {staffList
                              .filter(
                                (s) =>
                                  !slot.fullNames.includes(s.fullName) ||
                                  s.staffId === selectedId
                              )
                              .map((staff) => (
                                <option
                                  key={staff.staffId}
                                  value={staff.staffId}
                                >
                                  {staff.fullName}
                                </option>
                              ))}
                          </select>
                        </div>
                      );
                    })}
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
