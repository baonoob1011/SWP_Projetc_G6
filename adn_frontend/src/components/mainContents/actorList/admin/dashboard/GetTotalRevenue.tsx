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
import { BarChart3, DollarSign, TrendingUp, Calendar } from 'lucide-react';
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
interface YearRevenueStats {
  year: number;
  totalRevenue: number;
  monthlyRevenues: {
    month: number;
    revenue: number;
  }[];
}

const RevenueDashboard = () => {
  const [revenue, setRevenue] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yearRevenue, setYearRevenue] = useState<YearRevenueStats | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());

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
  const fetchYearRevenue = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:8080/api/dashboard/yearly-revenue?year=${year}`,
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
      setYearRevenue(data);
    } catch (err: any) {
      setError(err.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchYearRevenue();
  }, [year]);

  useEffect(() => {
    fetchRevenue();
  }, [startDate, endDate]); // cập nhật khi thay đổi ngày
  const monthlyChartData =
    yearRevenue?.monthlyRevenues.map((item) => ({
      name: `Tháng ${item.month}`,
      value: item.revenue,
    })) || [];

  // Improved currency formatting functions
  const formatCurrency = (value: number) => {
    if (value === 0) return '0đ';
    
    // Format with thousands separators and add 'đ' suffix
    const formatted = new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
    
    return `${formatted}đ`;
  };

  const formatCurrencyTooltip = (value: number) => {
    if (value === 0) return '0đ';
    
    const formatted = new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
    
    return `${formatted}đ`;
  };

  // Format for Y-axis with K/M abbreviations
  const formatYAxisTick = (value: number) => {
    if (value === 0) return '0';
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  const chartData =
    revenue?.dailyRevenues?.map((item) => ({
      name: item.date.slice(5), // hiển thị mm-dd
      value: item.revenue,
    })) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 ml-10 p-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-8 mb-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            <p className="text-white ml-4 text-lg font-medium">
              Đang tải dữ liệu doanh thu...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 ml-10 p-6">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-8 mb-6">
          <div className="flex flex-col items-center justify-center h-32 text-white">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="font-medium text-lg mb-2">Có lỗi xảy ra</p>
            <p className="text-red-100 mb-4">{error}</p>
            <button
              onClick={fetchRevenue}
              className="px-6 py-2 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate some derived stats for display
  const averageRevenue = revenue?.dailyRevenues?.length
    ? revenue.totalRevenue / revenue.dailyRevenues.length
    : 0;

  const highestDayRevenue =
    revenue?.dailyRevenues?.reduce(
      (max, day) => (day.revenue > max ? day.revenue : max),
      0
    ) || 0;

  // Calculate monthly stats
  const totalYearRevenue = yearRevenue?.totalRevenue || 0;
  const averageMonthlyRevenue = yearRevenue?.monthlyRevenues?.length 
    ? totalYearRevenue / yearRevenue.monthlyRevenues.length 
    : 0;
  const highestMonthRevenue = yearRevenue?.monthlyRevenues?.reduce(
    (max, month) => (month.revenue > max ? month.revenue : max),
    0
  ) || 0;

  // Main revenue stats with circular progress indicators
  const mainStats = [
    {
      label: 'Tổng doanh thu',
      value: revenue?.totalRevenue || 0,
      icon: FaMoneyBill,
      circleColor: 'border-green-400',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-500',
      percentageColor: 'text-green-500',
      period: 'this period',
    },
    {
      label: 'Trung bình/ngày',
      value: Math.round(averageRevenue),
      icon: TrendingUp,
      circleColor: 'border-red-400',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
      percentageColor: 'text-red-500',
      period: 'this period',
    },
    {
      label: 'Cao nhất/ngày',
      value: highestDayRevenue,
      icon: DollarSign,
      circleColor: 'border-yellow-400',
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-500',
      percentageColor: 'text-yellow-500',
      period: 'this period',
    },
  ];

  // Monthly stats for header
  const monthlyStats = [
    {
      label: 'Tổng doanh thu năm',
      value: totalYearRevenue,
      icon: FaMoneyBill,
      circleColor: 'border-purple-400',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
    {
      label: 'Trung bình/tháng',
      value: Math.round(averageMonthlyRevenue),
      icon: TrendingUp,
      circleColor: 'border-green-400',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      label: 'Cao nhất/tháng',
      value: highestMonthRevenue,
      icon: DollarSign,
      circleColor: 'border-orange-400',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 ml-10 mt-10">
      {/* Monthly Revenue Header Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 mb-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-64 h-full opacity-20">
          <div className="flex items-center justify-end h-full pr-8">
            <div className="flex space-x-4">
              <div className="w-20 h-20 bg-white rounded-full opacity-30"></div>
              <div className="w-16 h-16 bg-white rounded-full opacity-20"></div>
              <div className="w-12 h-12 bg-white rounded-full opacity-40"></div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-white text-3xl font-bold mb-2 flex items-center">
                <Calendar className="mr-3" size={36} />
                Thống Kê Doanh Thu Theo Tháng
              </h1>
              <p className="text-green-100 text-lg">
                Tổng quan doanh thu năm {year} - Phân tích theo từng tháng
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex flex-col text-sm font-medium text-white">
                Chọn năm:
                <select
                  className="mt-1 border border-gray-300 rounded-xl px-4 py-2 text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-green-300"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                >
                  {Array.from({ length: 5 }).map((_, i) => {
                    const y = new Date().getFullYear() - i;
                    return (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>
          </div>

          {/* Monthly Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {monthlyStats.map((stat, idx) => (
              <div key={idx} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full border-2 ${stat.circleColor} bg-white/30 flex items-center justify-center mr-4`}
                  >
                    <stat.icon className={`w-6 h-6 text-white`} />
                  </div>
                  <div>
                    <div className="text-white text-2xl font-bold">
                      {formatCurrency(stat.value)}
                    </div>
                    <div className="text-green-100 text-sm">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart - Doanh thu theo tháng */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex items-center mb-6">
          <BarChart3 className="text-green-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">
            Biểu đồ doanh thu theo tháng ({year})
          </h3>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatYAxisTick} />
            <Tooltip
              formatter={(value) => [
                formatCurrencyTooltip(Number(value)),
                'Doanh Thu',
              ]}
            />
            <Bar
              dataKey="value"
              fill="#10b981"
              radius={[8, 8, 0, 0]}
              maxBarSize={80}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Header Section for Daily Revenue */}
      <div className="bg-[#116AEF] rounded-3xl p-8 mb-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-64 h-full opacity-20">
          <div className="flex items-center justify-end h-full pr-8">
            <div className="flex space-x-4">
              <div className="w-20 h-20 bg-white rounded-full opacity-30"></div>
              <div className="w-16 h-16 bg-white rounded-full opacity-20"></div>
              <div className="w-12 h-12 bg-white rounded-full opacity-40"></div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-white text-3xl font-bold mb-2">
            {revenue?.description || 'Thống kê doanh thu'}
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Tổng quan doanh thu theo thời gian.
          </p>

          {/* Date Filter Section */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <label className="flex flex-col text-sm font-medium text-white">
              Từ ngày:
              <input
                type="date"
                className="mt-1 border border-gray-300 rounded px-3 py-2 text-gray-700"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>

            <label className="flex flex-col text-sm font-medium text-white">
              Đến ngày:
              <input
                type="date"
                className="mt-1 border border-gray-300 rounded px-3 py-2 text-gray-700"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>

            <button
              onClick={fetchRevenue}
              className="bg-white text-blue-600 px-6 py-2 rounded-xl hover:bg-blue-50 transition-colors font-medium mt-6"
            >
              Lọc
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {mainStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-16 h-16 rounded-full border-4 ${stat.circleColor} flex items-center justify-center`}
              >
                <div
                  className={`w-12 h-12 ${stat.iconBg} rounded-full flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {formatCurrency(stat.value)}
                </div>
                <div className="text-gray-600 text-sm mb-3">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
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
            <YAxis tickFormatter={formatYAxisTick} />
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
    </div>
  );
};

export default RevenueDashboard;