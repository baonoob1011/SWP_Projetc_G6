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
    // Add default time slot if empty
    if (timeSlots.length === 0) {
      timeSlots.push('06:00:00 - 18:00:00');
    }
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

  const formatWeekRange = () => {
    const startDate = currentWeekStart;
    const endDate = addDays(currentWeekStart, 6);
    return `Tuần từ ${format(startDate, 'dd/MM/yyyy')} đến ${format(endDate, 'dd/MM/yyyy')}`;
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px' }}>
      {/* Top Navigation */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <button
          style={{
            backgroundColor: 'transparent',
            border: '2px solid #3b82f6',
            borderRadius: '8px',
            color: '#3b82f6',
            padding: '10px 20px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
          onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, -1))}
        >
          ← Tuần Trước
        </button>
        
        <h3 style={{ 
          margin: 0, 
          fontWeight: 'bold',
          color: '#374151',
          fontSize: '24px'
        }}>
          {formatWeekRange()}
        </h3>
        
        <button
          style={{
            backgroundColor: 'transparent',
            border: '2px solid #3b82f6',
            borderRadius: '8px',
            color: '#3b82f6',
            padding: '10px 20px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
          onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
        >
          Tuần Sau →
        </button>
      </div>

      {/* Blue Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
        borderRadius: '10px 10px 0 0',
        padding: '20px 30px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h4 style={{ margin: 0, fontWeight: '600', fontSize: '28px' }}>
        Xem lịch làm việc theo tuần
        </h4>
        
        
      </div>

      {/* Schedule Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0 0 10px 10px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#3b82f6' }}>
              <th style={{
                padding: '15px',
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                minWidth: '150px',
                borderRight: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                Khung giờ
              </th>
              {[0, 1, 2, 3, 4].map((offset) => {
                const day = addDays(currentWeekStart, offset);
                return (
                  <th key={offset} style={{
                    padding: '15px',
                    color: 'white',
                    fontWeight: '600',
                    textAlign: 'center',
                    borderRight: offset < 4 ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
                  }}>
                    Thứ {offset + 2}
                    <br />
                    <small style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '500' }}>{format(day, 'dd/MM/yyyy')}</small>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Object.entries(scheduleMap).map(([time, slotsInTime]) => (
              <tr key={time}>
                 <td style={{
                    backgroundColor: '#f8fafc',
                    padding: '20px',
                    fontWeight: '600',
                    textAlign: 'center',
                    color: '#3b82f6',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '12px 20px',
                      backgroundColor: 'white',
                      border: '2px solid #3b82f6',
                      borderRadius: '8px',
                      color: '#3b82f6',
                      fontWeight: '600',
                      fontSize: '16px'
                    }}>
                      {time}
                    </div>
                  </td>
                                  {slotsInTime.map((slot, index) => (
                    <td key={index} style={{
                      padding: '20px',
                      textAlign: 'center',
                      border: '1px solid #e5e7eb',
                      borderRight: index < slotsInTime.length - 1 ? '1px solid #d1d5db' : '1px solid #e5e7eb',
                      verticalAlign: 'middle'
                    }}>
                      {slot ? (
                        <div style={{ 
                          color: '#374151',
                          fontWeight: '500'
                        }}>
                          {slot.roomName}
                        </div>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>-</span>
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
