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
    <div className="container-fluid p-0">
      <div className="schedule-card">
        <div className="schedule-header">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h4 className="schedule-title">
                <i className="fas fa-calendar-alt me-2"></i>
                Danh sách lịch đã đăng ký
              </h4>
            </div>
            <div className="col-md-6">
              <div className="room-filter-container">
                <label htmlFor="roomFilter" className="filter-label">
                  <i className="fas fa-door-open me-1"></i>
                  Phòng:
                </label>
                <select
                  id="roomFilter"
                  className="room-select"
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
            </div>
          </div>
        </div>

        <div className="schedule-body">
          <div className="table-responsive">
            <table className="schedule-table">
              <thead>
                <tr className="table-header">
                  <th className="time-column-header">
                    <i className="fas fa-clock me-2"></i>
                    <strong>Khung giờ</strong>
                  </th>
                  {[0, 1, 2, 3, 4].map((offset) => {
                    const day = addDays(currentWeekStart, offset);
                    return (
                      <th key={offset} className="day-column-header">
                        <div className="day-header-content">
                          <span className="day-name">
                            <i className="fas fa-calendar-day me-1"></i>
                            Thứ {offset + 2}
                          </span>
                          <span className="day-date">
                            {format(day, 'dd/MM/yyyy')}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {Object.entries(scheduleMap).map(([time, slots]) => (
                  <tr key={time} className="schedule-row">
                    <td className="time-cell">
                      <div className="time-badge">
                        <i className="fas fa-clock me-2"></i>
                        <strong>{time}</strong>
                      </div>
                    </td>
                    {slots.map((slot) => (
                      <td key={slot?.slotId || Math.random()} className={`slot-cell ${slot ? 'has-slot' : 'empty-slot'}`}>
                        {slot ? (
                          <div className="staff-container">
                            {[0, 1].map((i) => {
                              const selectedId =
                                staffList.find((s) => s.fullName === slot.fullNames[i])
                                  ?.staffId || '';

                              return (
                                <div key={i} className="staff-assignment">
                                  <label className="staff-label">
                                    <i className="fas fa-user me-1"></i>
                                    Nhân viên {i + 1}
                                  </label>
                                  <select
                                    className={`staff-select ${selectedId ? 'selected' : 'empty'}`}
                                    value={selectedId}
                                    onChange={(e) =>
                                      updateStaffToSlot(
                                        parseInt(e.target.value),
                                        slot.slotId,
                                        i
                                      )
                                    }
                                  >
                                    <option value="" className="text-muted">
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
                          </div>
                        ) : (
                          <div className="empty-slot-content">
                            <i className="fas fa-minus-circle"></i>
                            <div>Không có slot</div>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .schedule-card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(30, 136, 229, 0.1);
          overflow: hidden;
          border: 1px solid rgba(30, 136, 229, 0.08);
        }

        .schedule-header {
          background: linear-gradient(135deg, #1e88e5 0%, #1976d2 100%);
          padding: 24px;
          color: white;
        }

        .schedule-title {
          margin: 0;
          font-weight: 600;
          font-size: 1.3rem;
        }

        .room-filter-container {
          display: flex;
          align-items: center;
          justify-content: end;
          gap: 12px;
        }

        .filter-label {
          margin: 0;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .room-select {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          color: white;
          padding: 8px 16px;
          font-size: 0.9rem;
          min-width: 150px;
          backdrop-filter: blur(10px);
        }

        .room-select:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
        }

        .room-select option {
          background: #1976d2;
          color: white;
        }

        .schedule-body {
          padding: 0;
        }

        .schedule-table {
          width: 100%;
          border-collapse: collapse;
          margin: 0;
        }

        .table-header {
          background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
          color: white;
        }

        .time-column-header {
          text-align: center;
          padding: 20px 16px;
          min-width: 130px;
          vertical-align: middle;
          font-size: 0.95rem;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .day-column-header {
          text-align: center;
          padding: 16px 12px;
          min-width: 200px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .day-header-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .day-name {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .day-date {
          background: rgba(255, 255, 255, 0.15);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .schedule-row {
          border-bottom: 1px solid #e3f2fd;
          transition: background-color 0.2s ease;
        }

        .schedule-row:hover {
          background: rgba(30, 136, 229, 0.02);
        }

        .time-cell {
          background: linear-gradient(135deg, #f8f9fa 0%, #eceff1 100%);
          text-align: center;
          padding: 20px 16px;
          border-right: 1px solid #e3f2fd;
        }

        .time-badge {
          background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
          border: 2px solid #1e88e5;
          border-radius: 10px;
          padding: 10px 14px;
          color: #1565c0;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 100px;
        }

        .slot-cell {
          padding: 16px;
          border-right: 1px solid #e3f2fd;
          vertical-align: top;
        }

        .has-slot {
          background: linear-gradient(135deg, #fafafa 0%, #f0f8ff 100%);
        }

        .empty-slot {
          background: #ffffff;
        }

        .staff-container {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 1px solid #e3f2fd;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(30, 136, 229, 0.05);
        }

        .staff-assignment {
          margin-bottom: 12px;
        }

        .staff-assignment:last-child {
          margin-bottom: 0;
        }

        .staff-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #424242;
          margin-bottom: 6px;
        }

        .staff-select {
          width: 100%;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #cfd8dc;
          font-size: 0.85rem;
          transition: all 0.2s ease;
          background: #ffffff;
        }

        .staff-select.selected {
          background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
          border-color: #1e88e5;
          color: #1565c0;
          font-weight: 500;
        }

        .staff-select.empty {
          background: #fafafa;
          color: #757575;
        }

        .staff-select:focus {
          outline: none;
          border-color: #1e88e5;
          box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.1);
        }

        .empty-slot-content {
          text-align: center;
          color: #9e9e9e;
          padding: 24px 16px;
          font-size: 0.8rem;
        }

        .empty-slot-content i {
          font-size: 1.2rem;
          margin-bottom: 8px;
          display: block;
          opacity: 0.6;
        }

        @media (max-width: 768px) {
          .schedule-header .row {
            flex-direction: column;
            gap: 16px;
          }
          
          .room-filter-container {
            justify-content: center;
          }

          .schedule-title {
            font-size: 1.1rem;
            text-align: center;
          }

          .time-column-header,
          .day-column-header {
            padding: 12px 8px;
            min-width: auto;
          }

          .day-header-content {
            gap: 4px;
          }

          .day-name {
            font-size: 0.85rem;
          }

          .day-date {
            font-size: 0.75rem;
            padding: 2px 6px;
          }

          .staff-container {
            padding: 12px;
          }

          .staff-label {
            font-size: 0.75rem;
          }

          .staff-select {
            font-size: 0.8rem;
            padding: 6px 8px;
          }
        }

        @media (max-width: 576px) {
          .schedule-card {
            border-radius: 8px;
          }

          .schedule-header {
            padding: 16px;
          }

          .time-badge {
            padding: 6px 10px;
            font-size: 0.8rem;
            min-width: 80px;
          }

          .slot-cell {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default StaffScheduleTable;