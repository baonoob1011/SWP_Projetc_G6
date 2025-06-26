/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalPatients: number;
  totalStaff: number;
  totalManagers: number;
  totalAdmins: number;
  totalUsersRegisteredService: number;
  description: string;
}

const Stats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Không có token xác thực.');

      const res = await fetch('http://localhost:8080/api/dashboard/stats', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error('Token hết hạn.');
        else if (res.status === 403)
          throw new Error('Không có quyền truy cập.');
        else if (res.status === 404) throw new Error('API không tồn tại.');
        else throw new Error(`Lỗi server: ${res.status}`);
      }

      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="text-red-500">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="font-medium text-red-600">Có lỗi xảy ra</p>
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: 'Tổng người dùng',
      value: stats?.totalUsers,
      icon: '👥',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Đang hoạt động',
      value: stats?.activeUsers,
      icon: '✅',
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Không hoạt động',
      value: stats?.inactiveUsers,
      icon: '🚫',
      color: 'bg-red-100 text-red-600',
    },
    {
      label: 'Bệnh nhân',
      value: stats?.totalPatients,
      icon: '🧑‍⚕️',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Nhân viên',
      value: stats?.totalStaff,
      icon: '👨‍🔬',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Quản lý',
      value: stats?.totalManagers,
      icon: '👨‍💼',
      color: 'bg-pink-100 text-pink-600',
    },
    {
      label: 'Quản trị viên',
      value: stats?.totalAdmins,
      icon: '👑',
      color: 'bg-gray-100 text-gray-600',
    },
    {
      label: 'Đã đăng ký dịch vụ',
      value: stats?.totalUsersRegisteredService,
      icon: '📝',
      color: 'bg-teal-100 text-teal-600',
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        📊 {stats?.description || 'Thống kê hệ thống'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className={`rounded-lg shadow p-4 ${card.color}`}>
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className="text-sm font-medium">{card.label}</div>
            <div className="text-xl font-bold">
              {card.value?.toLocaleString() || 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
