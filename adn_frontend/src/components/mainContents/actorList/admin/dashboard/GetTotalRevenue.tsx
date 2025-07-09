/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { FaMoneyBill } from 'react-icons/fa';

interface RevenueStats {
  totalRevenue: number;
  currency: string;
  description: string;
  dailyRevenues: {
    date: string;
    revenue: number;
  }[];
}

const RevenueDashboard = () => {
  const [revenue, setRevenue] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // === Ngày lọc ===
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:8080/api/dashboard/weekly-daily-revenue?startDate=${startDate}&endDate=${endDate}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) throw new Error('Token hết hạn.');
        if (response.status === 403)
          throw new Error('Không có quyền truy cập.');
        if (response.status === 404) throw new Error('API không tồn tại.');
        throw new Error(`Lỗi server: ${response.status}`);
      }

      const data = await response.json();
      setRevenue(data);
    } catch (err: any) {
      setError(err.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, [startDate, endDate]); // cập nhật khi thay đổi ngày

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyTooltip = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const chartData =
    revenue?.dailyRevenues?.map((item) => ({
      name: item.date.slice(5), // hiển thị mm-dd
      value: item.revenue,
    })) || [];

  const headerCards = [
    {
      label: 'Tổng Doanh Thu',
      value: `${formatCurrency(revenue?.totalRevenue || 0)}`,
      icon: FaMoneyBill,
      bgColor: 'bg-cyan-400',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 ml-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4" />
          <p className="text-blue-600 text-lg font-medium">
            Đang tải dữ liệu doanh thu...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 ml-10 flex items-center justify-center">
        <div className="bg-red-100 p-6 rounded-xl shadow text-center">
          <div className="text-red-600 text-3xl mb-2">⚠️</div>
          <p className="text-red-700 font-semibold mb-2">Đã xảy ra lỗi</p>
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchRevenue}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ml-10 p-6">
      {/* Bộ chọn ngày */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <label className="flex flex-col text-sm font-medium text-gray-700">
          Từ ngày:
          <input
            type="date"
            className="mt-1 border border-gray-300 rounded px-3 py-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-gray-700">
          Đến ngày:
          <input
            type="date"
            className="mt-1 border border-gray-300 rounded px-3 py-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>

        <button
          onClick={fetchRevenue}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-6"
        >
          Lọc
        </button>
      </div>
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {headerCards.map((card, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-6 shadow text-white ${card.bgColor}`}
          >
            <div className="mb-2 flex items-center space-x-3">
              <card.icon className="w-6 h-6" />
              <span className="text-sm font-semibold">{card.label}</span>
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-6">
            <BarChart3 className="text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">
              Biểu đồ doanh thu theo ngày
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
              />
              <Tooltip
                formatter={(value) => [
                  formatCurrencyTooltip(Number(value)),
                  'Doanh Thu',
                ]}
              />
              <Bar
                dataKey="value"
                fill="#2563eb"
                radius={[8, 8, 0, 0]}
                maxBarSize={80}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
      </div>
    </div>
  );
};

export default RevenueDashboard;
