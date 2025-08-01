import React, { useEffect, useState } from 'react';
import {
  Menu,
  X,
  //   Settings,
  LogOut,
  Bell,
  // Users,
  // BarChart3,
  // FileText,
  Shield,
  List,
  BookImageIcon,
  Printer,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { AppRegistration, ArrowBack, Schedule } from '@mui/icons-material';
import { toast } from 'react-toastify';

const StaffPage = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [notifications] = useState(0);
  const [fullName, setFullName] = useState<string>('');
  const navigate = useNavigate();
  const TimeLeftLogout = (exp: number) => {
    const now = Date.now() / 1000;
    const timeleft = (exp - now) * 1000;
    if (timeleft > 0) {
      setTimeout(() => {
        toast.error('Hết thời gian đăng nhập');
        localStorage.clear();
        setFullName('');
        navigate('/login');
      }, timeleft);
    }
  };
  const avatarUrl = localStorage.getItem('avatarUrl');
  function getTokenExp(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = token.split('.')[1];
    if (!payload) return null;

    try {
      const decoded = JSON.parse(atob(payload));
      return decoded.exp || null;
    } catch (err) {
      console.error('Failed to decode token:', err);
      return null;
    }
  }
  useEffect(() => {
    const storeName = localStorage.getItem('fullName') || '';
    setFullName(storeName);

    const exp = getTokenExp();
    if (exp) {
      TimeLeftLogout(exp);
    }
  }, []);
  useEffect(() => {
    const storeName = localStorage.getItem('fullName') || '';
    setFullName(storeName);
  }, []);

  const role = localStorage.getItem('role');

  const menuItems = [
    { id: 'dashboard', icon: ArrowBack, label: 'Home', path: '' },
    ...(role === 'STAFF'
      ? [
          {
            id: 'data',
            icon: List,
            label: 'Danh sách',
            path: 's-page/s-userData',
          },
          {
            id: 'schedule',
            icon: Schedule,
            label: 'Lịch làm',
            path: 's-page/s-slot',
          },
          {
            id: 'appointment',
            icon: BookImageIcon,
            label: 'Lịch hẹn',
            path: 's-page/checkBooking',
          },
          {
            id: 'checkAppointment',
            icon: AppRegistration,
            label: 'Đơn đăng ký',
            path: 's-page/selectorSlot',
          },
          {
            id: 'checkAppointment',
            icon: Printer,
            label: 'In bản cứng',
            path: 's-page/print',
          },
        ]
      : role === 'LAB_TECHNICIAN'
      ? [
          {
            id: 'checkAppointment',
            icon: AppRegistration,
            label: 'Đơn đăng ký',
            path: 's-page/labCheckSample',
          },
        ]
      : []),
  ];

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        await fetch('http://localhost:8080/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('fullName');
      localStorage.removeItem('role');
      localStorage.removeItem('avatarUrl');
      setFullName('');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout API error:', error);
    }
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Trang nhân viên</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button> */}
          <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
            <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
              <img
                src={avatarUrl ?? undefined}
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 
        w-64
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out
        flex flex-col
        h-screen
        overflow-y-auto 
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Trang nhân viên
            </span>
          </div>

          {/* Close Button - Mobile only */}
          <button
            onClick={() => handleLogout()}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <Button
                component={NavLink}
                to={`/${item.path}`}
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`
                  px-0 py-0 normal-case rounded-lg transition-all duration-200 w-full text-left
                    ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }
                `}
              >
                <div className="flex items-center space-x-3 px-3 py-3 w-full justify-start">
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          {/* Notifications */}
          <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 w-full">
            <div className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>
            <span className="font-medium">Thông báo</span>
          </button>

          {/* Settings
          <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 w-full">
            <Settings className="h-5 w-5" />
            <span className="font-medium">Cài đặt</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-gray-50">
            <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
              <img
                src={avatarUrl ?? undefined}
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover"
              />
            </div>
            <span className="text-sm text-gray-700">{fullName}</span>
          </div>

          {/* Logout */}
          <button
            onClick={() => handleLogout()}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 w-full"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content Area Spacer */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
};

export default StaffPage;
