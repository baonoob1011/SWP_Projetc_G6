import { useEffect, useState } from 'react';
import {
  addWeeks,
  startOfWeek,
  addDays,
  format,
  getDay,
  isSameWeek,
  parseISO,
} from 'date-fns';

type SlotInfo = {
  slotId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  roomName: string;
  fullName: string;
};

const StaffSlot = () => {
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');

      const res = await fetch(
        'http://localhost:8080/api/slot/get-all-slot-of-staff',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();

      const mapped: SlotInfo[] = data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item: any) => item.slotResponse)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => ({
          slotId: item.slotResponse.slotId.toString(),
          slotDate: item.slotResponse.slotDate,
          startTime: item.slotResponse.startTime,
          endTime: item.slotResponse.endTime,
          roomName: item.roomSlotResponse?.roomName || '',
          fullName: item.staffSlotResponse?.fullName || '',
        }));

      setSlots(mapped);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu slot:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getWeekDay = (dateStr: string) => getDay(parseISO(dateStr));

  const buildScheduleMap = () => {
    const filteredSlots = slots.filter((slot) =>
      isSameWeek(parseISO(slot.slotDate), currentWeekStart, { weekStartsOn: 1 })
    );

    const scheduleMap: Record<string, (SlotInfo | null)[]> = {};
    const daysOfWeek = [1, 2, 3, 4, 5];

    const timeSlots = Array.from(
      new Set(
        filteredSlots.map((slot) => `${slot.startTime} - ${slot.endTime}`)
      )
    ).sort();

    timeSlots.forEach((time) => {
      scheduleMap[time] = daysOfWeek.map((day) => {
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

  const scheduleMap = buildScheduleMap();

  return (
    <div className="container mt-4">
      <h4 className="fw-bold mb-3">Xem lịch làm việc theo tuần</h4>

      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, -1))}
        >
          Tuần trước
        </button>
        <button
          className="btn btn-outline-primary"
          onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
        >
          Tuần sau
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center align-middle">
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
            {Object.entries(scheduleMap).map(([time, slotsInTime]) => (
              <tr key={time}>
                <td>
                  <strong>{time}</strong>
                </td>
                {slotsInTime.map((slot, index) => (
                  <td key={index}>
                    {slot ? (
                      <>
                        <div className="text-muted">{slot.roomName}</div>
                      </>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffSlot;
