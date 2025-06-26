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
        <div className="text-2xl font-medium mb-2">
          {revenue?.currency || 'VND'}
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
