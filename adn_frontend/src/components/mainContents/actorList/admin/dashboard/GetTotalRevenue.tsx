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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  Target,
  RefreshCw,
  BarChart3,
  PieChart as PieChartLucide,
} from 'lucide-react';

interface RevenueStats {
  totalRevenue: number;
  currency: string;
  description: string;
}

const RevenueDashboard = () => {
  const [revenue, setRevenue] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      setError(null);

      // Lấy token từ state thay vì localStorage (vì artifact không hỗ trợ localStorage)
      // Trong thực tế, bạn sẽ dùng localStorage.getItem('token'

      // Gọi API tổng doanh thu
      const revenueRes = await fetch(
        'http://localhost:8080/api/dashboard/total-revenue',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!revenueRes.ok) {
        if (revenueRes.status === 401) throw new Error('Token hết hạn.');
        else if (revenueRes.status === 403)
          throw new Error('Không có quyền truy cập.');
        else if (revenueRes.status === 404)
          throw new Error('API không tồn tại.');
        else throw new Error(`Lỗi server: ${revenueRes.status}`);
      }

      const revenueData = await revenueRes.json();
      setRevenue(revenueData);
    } catch (err: any) {
      setError(err.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  useEffect(() => {
    fetchRevenue();
  }, []);

  const formatCurrency = (value: number) => {
    return value.toLocaleString();
  };

  const formatCurrencyTooltip = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Tạo dữ liệu cho biểu đồ từ tổng doanh thu
  const chartData = revenue
    ? [
        {
          name: 'Tổng Doanh Thu',
          value: revenue.totalRevenue,
          color: '#2563eb',
        },
      ]
    : [];

  // Dữ liệu mẫu để hiển thị breakdown
  const breakdownData = revenue
    ? [
        {
          name: 'Doanh Thu Hiện Tại',
          value: revenue.totalRevenue,
          fill: '#2563eb',
        },
        {
          name: 'Mục Tiêu',
          value: Math.max(
            revenue.totalRevenue * 1.2,
            revenue.totalRevenue + 100000000
          ),
          fill: '#e5e7eb',
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
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
      <div className="min-h-screen bg-gray-50 p-6">
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

  // Header cards with colored backgrounds
  const headerCards = [
    {
      label: 'Tổng Doanh Thu',
      value: `$${formatCurrency(revenue?.totalRevenue || 0)}`,
      icon: DollarSign,
      bgColor: 'bg-cyan-400',
    },
    {
      label: 'Triệu VND',
      value: `$${
        revenue?.totalRevenue ? Math.floor(revenue.totalRevenue / 1000000) : 0
      }M`,
      icon: TrendingUp,
      bgColor: 'bg-green-400',
    },
    {
      label: 'Trạng Thái',
      value:
        revenue?.totalRevenue && revenue.totalRevenue > 0 ? 'Status' : '📊',
      icon: Target,
      bgColor: 'bg-orange-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-8 mb-6 relative overflow-hidden">
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
            {revenue?.description || 'Tổng Doanh Thu'}
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Tổng quan doanh thu và thống kê chi tiết
          </p>

          <div className="flex space-x-6">
            {headerCards.map((card, idx) => (
              <div
                key={idx}
                className={`${card.bgColor} rounded-2xl p-4 min-w-[140px]`}
              >
                <div className="text-white mb-1">
                  <card.icon size={32} />
                </div>
                <div className="text-white text-2xl font-bold mb-1">
                  {card.value}
                </div>
                <div className="text-white text-sm opacity-90">
                  {card.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 rounded-full border-4 border-blue-400 flex items-center justify-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            ${formatCurrency(revenue?.totalRevenue || 0)}
          </div>
          <div className="text-gray-600 text-sm mb-3">Tổng Doanh Thu</div>
          <div className="flex items-center justify-between">
            <div className="text-blue-500 text-sm font-medium">
              {revenue?.currency || 'VND'}
            </div>
            <div className="text-right">
              <div className="text-green-500 text-sm font-bold">↗</div>
            </div>
          </div>
        </div>

        {/* Revenue in Millions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 rounded-full border-4 border-green-400 flex items-center justify-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            $
            {revenue?.totalRevenue
              ? Math.floor(revenue.totalRevenue / 1000000)
              : 0}
            M
          </div>
          <div className="text-gray-600 text-sm mb-3">Triệu VND</div>
          <div className="flex items-center justify-between">
            <div className="text-blue-500 text-sm font-medium">Đơn vị tính</div>
            <div className="text-right">
              <div className="text-green-500 text-sm font-bold">+28%</div>
              <div className="text-gray-400 text-xs">this month</div>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 rounded-full border-4 border-orange-400 flex items-center justify-center">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {revenue?.totalRevenue && revenue.totalRevenue > 0
              ? 'Status'
              : '📊'}
          </div>
          <div className="text-gray-600 text-sm mb-3">Trạng Thái</div>
          <div className="flex items-center justify-between">
            <div className="text-blue-500 text-sm font-medium">
              {revenue?.totalRevenue && revenue.totalRevenue > 0
                ? 'Có doanh thu'
                : 'Chưa có dữ liệu'}
            </div>
            <div className="text-right">
              <div className="text-red-500 text-sm font-bold">↘</div>
            </div>
          </div>
        </div>

        {/* Update Button Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 rounded-full border-4 border-purple-400 flex items-center justify-center">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
          <div className="text-lg font-bold text-gray-900 mb-6">
            Cập nhật dữ liệu
          </div>
          <button
            onClick={fetchRevenue}
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
          >
            {loading ? 'Đang tải...' : '🔄 Cập nhật dữ liệu'}
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Biểu Đồ Cột Doanh Thu
              </h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
              margin={{ top: 30, right: 40, left: 40, bottom: 30 }}
              barCategoryGap="30%"
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="50%" stopColor="#2563eb" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.7} />
                </linearGradient>
                <filter
                  id="shadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="0"
                    dy="4"
                    stdDeviation="8"
                    floodColor="#2563eb"
                    floodOpacity="0.3"
                  />
                </filter>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                strokeOpacity={0.6}
                horizontal={true}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 14, fill: '#475569', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                height={60}
                interval={0}
              />
              <YAxis
                tickFormatter={(value) =>
                  `${(value / 1000000).toFixed(0)}M VND`
                }
                tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={80}
                domain={[0, 'dataMax + 10000000']}
              />
              <Tooltip
                formatter={(value) => [
                  formatCurrencyTooltip(Number(value)),
                  'Doanh Thu',
                ]}
                labelStyle={{
                  color: '#1e293b',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow:
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  padding: '12px 16px',
                }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
              />
              <Bar
                dataKey="value"
                fill="url(#revenueGradient)"
                radius={[8, 8, 0, 0]}
                filter="url(#shadow)"
                maxBarSize={120}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <PieChartLucide className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Tiến Độ Mục Tiêu
              </h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={breakdownData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {breakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  formatCurrencyTooltip(Number(value)),
                  '',
                ]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
              <span className="text-gray-600">Doanh Thu Hiện Tại</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
              <span className="text-gray-600">Mục Tiêu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;
