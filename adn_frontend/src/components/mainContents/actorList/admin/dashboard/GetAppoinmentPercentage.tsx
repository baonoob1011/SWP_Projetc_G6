/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

const COLORS = ['#00C75B', '#FE2416']; // Blue for completed, Green for cancelled

const GetAppointmentPercentage = () => {
  const [data, setData] = useState<AppointmentPercentageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating API call with mock data for demo

        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

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

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="text-red-500 text-center">Lỗi: {error}</div>
      </div>
    );
  }

  // Prepare data for PieChart
  const pieData = [
    {
      name: 'Hoàn thành',
      value: data?.completedPercentage || 0,
      count: data?.totalCompleted || 0,
    },
    {
      name: 'Đã huỷ',
      value: data?.cancelledPercentage || 0,
      count: data?.totalCancelled || 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ml-10 bg-gray-50 min-h-screen mt-10">
      {/* Stats Cards */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Tổng lịch hẹn</h3>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">📅</span>
            </div>
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {data?.totalAppointments?.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500">Tổng số lịch hẹn</div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Hoàn thành</h3>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {data?.totalCompleted?.toLocaleString()}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-green-600 font-medium">
            {Number(data?.completedPercentage).toFixed(1)}%
          </span>
          <span className="text-green-500">↗</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Đã huỷ</h3>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✕</span>
            </div>
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {data?.totalCancelled?.toLocaleString()}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-red-600 font-medium">
            {Number(data?.cancelledPercentage).toFixed(1)}%
          </span>
          <span className="text-red-500">↘</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="lg:col-span-3 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Thống kê trạng thái lịch hẹn
          </h3>
          <div className="text-sm text-gray-500">
            Phân bố theo tỷ lệ phần trăm
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  startAngle={90}
                  endAngle={450}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: string, props: any) => [
                    `${value.toFixed(1)}% (${props.payload.count} lịch hẹn)`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend and Details */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              {pieData.map((entry, index) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    ></div>
                    <span className="font-medium text-gray-700">
                      {entry.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {entry.count.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {entry.value.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm text-blue-800">
                <div className="font-semibold mb-1">Tỷ lệ hoàn thành</div>
                <div>
                  {data?.totalCompleted} trên {data?.totalAppointments} lịch hẹn
                  đã được hoàn thành thành công (
                  {Number(data?.completedPercentage).toFixed(1)}%)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetAppointmentPercentage;
