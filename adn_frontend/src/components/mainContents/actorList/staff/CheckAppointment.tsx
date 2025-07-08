/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './CollectorSlot.module.css';

export const CheckAppointment = () => {
  const [slots, setSlots] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isHomeCollector, setIsHomeCollector] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'http://localhost:8080/api/slot/get-all-slot-of-staff',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        throw new Error('Not a center collector');
      }
      const data = await res.json();
      setSlots(data);
    } catch (err) {
      console.error('Lỗi lấy slot:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBill = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'http://localhost:8080/api/kit-delivery-status/get-kit-status-staff',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        throw new Error('Not a home collector');
      }
      const data = await res.json();
      setBills(data);
    } catch (err) {
      console.error('Lỗi lấy slot:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);
  useEffect(() => {
    fetchBill();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <CircularProgress />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Group appointments by appointmentId
  const groupedAppointments = bills.filter((a) => a.appointmentType === 'HOME');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Danh sách Slot & Lịch hẹn</h1>
      </div>

      {/* Bảng thông tin khách tại nhà */}
      {groupedAppointments.length > 0 ? (
        <div className={styles.slotsContainer}>
          {bills.length > 0 ? (
            <div className={styles.slotsGrid}>
              {bills.map((bill, idx) => (
                <button
                  key={idx}
                  className={styles.slotButton}
                  onClick={() =>
                    navigate(
                      `/s-page/checkAppointmentAtHome/${bill.appointmentId}`
                    )
                  }
                >
                  <div>Đơn hàng {idx + 1}</div>
                  <div>
                    {bill.createOrderDate} ~{' '}
                    {bill.returnDate !== null ? bill.returnDate : 'chưa nhận'}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Chưa có lịch hẹn nào</p>
            </div>
          )}
        </div>
      ) : (
        // Không có lịch tại nhà thì hiện slot
        <div className={styles.slotsContainer}>
          {slots.filter((slot) => slot.slotResponse.slotStatus === 'BOOKED')
            .length > 0 ? (
            <div className={styles.slotsGrid}>
              {slots
                .filter((slot) => slot.slotResponse.slotStatus === 'BOOKED')
                .map((slot) => (
                  <button
                    key={slot.slotResponse.slotId}
                    className={styles.slotButton}
                    onClick={() =>
                      navigate(
                        `/s-page/checkAppointmentAtCenter/${slot.slotResponse.slotId}`
                      )
                    }
                  >
                    <div>Slot {slot.slotResponse.slotId}</div>
                    <div>
                      {slot.slotResponse.startTime} ~{' '}
                      {slot.slotResponse.endTime}
                    </div>
                  </button>
                ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Chưa có lịch hẹn nào</p>
            </div>
          )}
        </div>
      )}

      {/* Bảng mẫu đã thu */}
    </div>
  );
};
