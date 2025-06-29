/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface AppointmentPercentageData {
  totalCompleted: number;
  totalCancelled: number;
  totalAppointments: number;
  completedPercentage: number;
  cancelledPercentage: number;
}

const COLORS = ['#4CAF50', '#F44336']; // Xanh: hoàn thành, Đỏ: hủy

const GetAppointmentPercentage = () => {
  const [data, setData] = useState<AppointmentPercentageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'http://localhost:8080/api/dashboard/appointment-status-percentage',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu');
        const result: AppointmentPercentageData = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: 'red' }}>Lỗi: {error}</p>;

  // Chuẩn bị dữ liệu cho PieChart
  const pieData = [
    {
      name: 'Hoàn thành',
      value: data?.completedPercentage || 0,
    },
    {
      name: 'Đã huỷ',
      value: data?.cancelledPercentage || 0,
    },
  ];

  return (
    <div
      style={{
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '10px',
        maxWidth: 600,
        margin: 'auto',
      }}
    >
      <h3>📈 Thống kê lịch hẹn</h3>
      <p>
        <strong>Tổng lịch hẹn:</strong> {data?.totalAppointments}
      </p>
      <p>
        <strong>✅ Hoàn thành:</strong> {data?.totalCompleted} (
        {Number(data?.completedPercentage).toFixed(2)}%)
      </p>
      <p>
        <strong>❌ Đã huỷ:</strong> {data?.totalCancelled} (
        {Number(data?.cancelledPercentage).toFixed(2)}%)
      </p>

      <div style={{ width: '100%', height: 300, marginTop: 20 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => `${value.toFixed(2)}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GetAppointmentPercentage;
