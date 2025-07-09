/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Heart,
  Stethoscope,
  Shield,
  Crown,
  FileText,
  Activity,
} from 'lucide-react';
import doctor from '../dashboard/imageDashboard/doctors.png';

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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-8 mb-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            <p className="text-white ml-4 text-lg font-medium">
              Đang tải dữ liệu...
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
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Top header cards with colored backgrounds
  const headerCards = [
    {
      label: 'Tổng người dùng',
      value: stats?.totalUsers,
      icon: Users,
      bgColor: 'bg-cyan-400',
    },
    {
      label: 'Đang hoạt động',
      value: stats?.activeUsers,
      icon: UserCheck,
      bgColor: 'bg-green-400',
    },
    {
      label: 'Không hoạt động',
      value: stats?.inactiveUsers,
      icon: UserX,
      bgColor: 'bg-orange-400',
    },
  ];

  // Main stats with circular progress indicators
  const mainStats = [
    {
      label: 'Bệnh nhân',
      value: stats?.totalPatients,
      icon: Heart,
      circleColor: 'border-green-400',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-500',
      percentageColor: 'text-green-500',
      period: 'this month',
    },
    {
      label: 'Nhân viên',
      value: stats?.totalStaff,
      icon: Stethoscope,
      circleColor: 'border-blue-400',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      percentageColor: 'text-blue-500',
      period: 'this month',
    },
    {
      label: 'Quản lý',
      value: stats?.totalManagers,
      icon: Shield,
      circleColor: 'border-red-400',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
      percentageColor: 'text-red-500',
      period: 'this month',
    },
    {
      label: 'Đã đăng ký dịch vụ',
      value: stats?.totalUsersRegisteredService,
      icon: FileText,
      circleColor: 'border-yellow-400',
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-500',
      percentageColor: 'text-yellow-500',
      period: 'this month',
    },
  ];

  // Bottom blue cards
  const bottomCards = [
    {
      label: 'Quản trị viên',
      value: stats?.totalAdmins,
      icon: Crown,
    },
    {
      label: 'Tổng người dùng',
      value: stats?.totalUsers,
      icon: Users,
    },
    {
      label: 'Nhân viên',
      value: stats?.totalStaff,
      icon: Stethoscope,
    },
    {
      label: 'Hoạt động',
      value: stats?.activeUsers,
      icon: Activity,
    },
    {
      label: 'Bệnh nhân',
      value: stats?.totalPatients,
      icon: Heart,
    },
    {
      label: 'Quản lý',
      value: stats?.totalManagers,
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 ml-10">
      {/* Header Section */}
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
      {stats?.description || 'Thống kê hệ thống'}
    </h1>
    <p className="text-blue-100 text-lg mb-8">
      Tổng quan hoạt động hôm nay.
    </p>

    {/* Image of the doctor */}
   <div className="absolute right-0 bottom-0 mb-1 mr-2">
  <img src={doctor} alt="Doctor" className="h-40" />
</div>


    <div className="flex space-x-6">
      {headerCards.map((card, idx) => (
        <div
          key={idx}
          className={`${card.bgColor} rounded-2xl p-4 min-w-[140px]`}
        >
          <div className="text-white mb-1">
            <card.icon size={32} />
          </div>
          <div className="text-white text-3xl font-bold mb-1">
            {card.value?.toLocaleString() || 0}
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
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
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
            {stat.value?.toLocaleString() || 0}
          </div>
          <div className="text-gray-600 text-sm mb-3">{stat.label}</div>
        </div>
      </div>
    </div>
  ))}
</div>


      {/* Bottom Blue Cards Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {bottomCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 text-center shadow-sm"
          >
            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <card.icon className="w-7 h-7 text-white" />
            </div>
            <div className="text-gray-600 text-sm mb-2">{card.label}</div>
            <div className="text-blue-500 text-2xl font-bold">
              {card.value?.toLocaleString() || 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
