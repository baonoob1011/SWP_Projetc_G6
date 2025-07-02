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
          color: '#10B981',
        },
      ]
    : [];

  // Dữ liệu mẫu để hiển thị breakdown
  const breakdownData = revenue
    ? [
        {
          name: 'Doanh Thu Hiện Tại',
          value: revenue.totalRevenue,
          fill: '#10B981',
        },
        {
          name: 'Mục Tiêu',
          value: Math.max(
            revenue.totalRevenue * 1.2,
            revenue.totalRevenue + 100000000
          ),
          fill: '#E5E7EB',
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải dữ liệu doanh thu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-red-500">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="font-medium text-red-600 text-xl mb-2">
              Có lỗi xảy ra
            </p>
            <p className="text-red-500 mb-6">{error}</p>
            <button
              onClick={fetchRevenue}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

<<<<<<< Updated upstream
=======
  // Header cards with colored backgrounds
  const headerCards = [
    {
      label: 'Tổng Doanh Thu',
      value: `${formatCurrency(revenue?.totalRevenue || 0)} (VND)`,
      icon: DollarSign,
      bgColor: 'bg-cyan-400',
    },
    {
      label: 'Triệu VND',
      value: `${revenue?.totalRevenue ? Math.floor(revenue.totalRevenue / 1000000) : 0}`,
      icon: TrendingUp,
      bgColor: 'bg-green-400',
    },
    {
      label: 'Trạng Thái',
      value: revenue?.totalRevenue && revenue.totalRevenue > 0 ? 'Status' : '📊',
      icon: Target,
      bgColor: 'bg-orange-400',
    },
  ];

>>>>>>> Stashed changes
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-8 text-white text-center">
        <h2 className="text-3xl font-semibold mb-4">
          💰 {revenue?.description || 'Tổng Doanh Thu'}
        </h2>
        <div className="text-6xl font-bold mb-4">
          {formatCurrency(revenue?.totalRevenue || 0)}
        </div>
<<<<<<< Updated upstream
        <div className="text-2xl font-medium mb-2">
          {revenue?.currency || 'VND'}
=======
        
        <div className="relative z-10">
          <h1 className="text-white text-3xl font-bold mb-2">
           {revenue?.description || 'Tổng Doanh Thu'}
          </h1>
          <p className="text-blue-100 text-lg mb-8">Tổng quan doanh thu và thống kê chi tiết</p>
          
          <div className="flex space-x-6">
            {headerCards.map((card, idx) => (
              <div key={idx} className={`${card.bgColor} rounded-2xl p-4 min-w-[140px]`}>
                <div className="text-white mb-1">
                  <card.icon size={32} />
                </div>
                <div className="text-white text-2xl font-bold mb-1">
                  {card.value}
                </div>
                <div className="text-white text-sm opacity-90">{card.label}</div>
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
            {formatCurrency(revenue?.totalRevenue || 0)}
          </div>
          <div className="text-gray-600 text-sm mb-3">Tổng Doanh Thu</div>
          <div className="flex items-center justify-between">
            <div className="text-blue-500 text-sm font-medium">
              {revenue?.currency || 'VND'} 
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
            {revenue?.totalRevenue ? Math.floor(revenue.totalRevenue / 1000000) : 0}
          </div>
          <div className="text-gray-600 text-sm mb-3">Triệu VND</div>
          <div className="flex items-center justify-between">
            <div className="text-blue-500 text-sm font-medium">Đơn vị tính</div>
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
            {revenue?.totalRevenue && revenue.totalRevenue > 0 ? 'Status' : '📊'}
          </div>
          <div className="text-gray-600 text-sm mb-3">Trạng Thái</div>
          <div className="flex items-center justify-between">
            <div className="text-blue-500 text-sm font-medium">
              {revenue?.totalRevenue && revenue.totalRevenue > 0
                ? 'Có doanh thu'
                : 'Chưa có dữ liệu'}
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
          <div className="text-lg font-bold text-gray-900 mb-6">Cập nhật dữ liệu</div>
          <button
            onClick={fetchRevenue}
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
          >
            {loading ? 'Đang tải...' : '🔄 Cập nhật dữ liệu'}
          </button>
>>>>>>> Stashed changes
        </div>
        <p className="text-green-100 text-lg">Tổng doanh thu tích lũy</p>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            📊 Biểu Đồ Cột Doanh Thu
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              <Tooltip
                formatter={(value) => [
                  formatCurrencyTooltip(Number(value)),
                  'Doanh Thu',
                ]}
              />
              <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🎯 Tiến Độ Mục Tiêu
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={breakdownData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  percent !== undefined
                    ? `${name}: ${(percent * 100).toFixed(1)}%`
                    : name
                }
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
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {formatCurrency(revenue?.totalRevenue || 0)}
          </div>
          <div className="text-gray-600">Tổng Doanh Thu</div>
          <div className="text-sm text-gray-500 mt-1">
            {revenue?.currency || 'VND'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {revenue?.totalRevenue
              ? Math.floor(revenue.totalRevenue / 1000000)
              : 0}
            M
          </div>
          <div className="text-gray-600">Triệu VND</div>
          <div className="text-sm text-gray-500 mt-1">Đơn vị tính</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {revenue?.totalRevenue && revenue.totalRevenue > 0 ? '📈' : '📊'}
          </div>
          <div className="text-gray-600">Trạng Thái</div>
          <div className="text-sm text-gray-500 mt-1">
            {revenue?.totalRevenue && revenue.totalRevenue > 0
              ? 'Có doanh thu'
              : 'Chưa có dữ liệu'}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={fetchRevenue}
          disabled={loading}
          className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg shadow-lg"
        >
          {loading ? 'Đang tải...' : '🔄 Cập nhật dữ liệu'}
        </button>
      </div>
    </div>
  );
};

export default RevenueDashboard;
