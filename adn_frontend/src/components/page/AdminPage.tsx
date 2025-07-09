import React, { useEffect, useState } from 'react';
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  Shield,
  List,
  ShoppingBag,
  BaggageClaim,
  Newspaper,
  Phone,
} from 'lucide-react';

import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { LocationCity, Room, RoomService } from '@mui/icons-material';
import { toast } from 'react-toastify';

const AdminSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [fullName, setFullName] = useState<string>('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const storeName = localStorage.getItem('fullName') || '';
    setFullName(storeName);
  }, []);
  
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

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Tổng quan', path: '' },
    { id: 'data', icon: List, label: 'Danh sách', path: 'admin/data' },
    {
      id: 'location',
      icon: LocationCity,
      label: 'Địa chỉ',
      path: 'location',
    },
    {
      id: 'room',
      icon: Room,
      label: 'Phòng lab',
      path: 'room',
    },
    {
      id: 'kit',
      icon: BaggageClaim,
      label: 'kit test',
      path: 'kit',
    },
    {
      id: 'services',
      icon: RoomService,
      label: 'Dịch vụ',
      path: 'services',
    },
    {
      id: 'blog',
      icon: Newspaper,
      label: 'Blog/Tin tức',
      path: 'create-blog',
    },
    {
      id: 'createLocus',
      icon: ShoppingBag,
      label: 'Locus',
      path: 'create-locus',
    },
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
      setFullName('');

      window.location.href = '/login';
    } catch (error) {
      console.error('Logout API error:', error);
    }
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg border-b border-blue-800 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-200"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-white">Admin Panel</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <User className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 
          w-72
          ${
            isMobileOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }
          bg-white shadow-2xl border-r border-gray-200 transition-all duration-300 ease-in-out
          flex flex-col
          h-screen
          overflow-y-auto 
        `}
      >
        {/* Header with User Profile */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-800">Admin Panel</span>
                <div className="text-xs text-gray-500 font-medium">Management System</div>
              </div>
            </div>

            {/* Close Button - Mobile only */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-md">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-800 truncate">{fullName}</div>
              <div className="text-xs text-blue-600 font-medium">Department Admin</div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <div key={item.id}>
                <Button
                  component={NavLink}
                  to={`/${item.path}`}
                  onClick={() => setActiveItem(item.id)}
                  className={`
                    px-0 py-0 normal-case rounded-2xl transition-all duration-200 w-full text-left
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-900 border-r-4 border-blue-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50 hover:text-gray-700'
                    }
                  `}
                >
                  <div className="flex items-center space-x-4 px-4 py-4 w-full justify-start">
                    <div className={`
                      p-2.5 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-md' 
                        : 'bg-gray-100 hover:bg-gray-200'
                      }
                    `}>
                      <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <span className="font-medium text-sm flex-1 truncate">{item.label}</span>
                  </div>
                </Button>
              </div>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => handleLogout()}
            className="flex items-center space-x-4 px-4 py-4 rounded-2xl text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-50 hover:text-red-600 transition-all duration-200 w-full group"
          >
            <div className="p-2.5 rounded-xl bg-gray-100 group-hover:bg-red-100 transition-all duration-200">
              <LogOut className="h-5 w-5" />
            </div>
            <span className="font-medium text-sm">Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content Area Spacer */}
      <div className="hidden lg:block w-72 flex-shrink-0" />
    </>
  );
};

export default AdminSidebar;