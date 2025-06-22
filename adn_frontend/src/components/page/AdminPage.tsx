import React, { useEffect, useState } from 'react';
import {
  Menu,
  X,
  User,
  LogOut,
  Bell,
  Home,
  Shield,
  List,
  ShoppingBag,
  BaggageClaim,
  Newspaper,  // Icon cho Blog và Tin tức
  FileText,   // Icon cho Tin tức
} from 'lucide-react';

import { NavLink } from 'react-router-dom';
import { Button } from '@mui/material';
import { LocationCity, Room, RoomService } from '@mui/icons-material';

const AdminSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [notifications] = useState(0);
  const [fullName, setFullName] = useState<string>('');

  useEffect(() => {
    const storeName = localStorage.getItem('fullName') || '';
    setFullName(storeName);
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Home', path: '' },
    { id: 'data', icon: List, label: 'Danh sách', path: 'admin/data' },
    {
      id: 'location',
      icon: LocationCity,
      label: 'Tạo địa chỉ mới',
      path: 'location',
    },
    {
      id: 'room',
      icon: Room,
      label: 'Tạo phòng',
      path: 'room',
    },
    {
      id: 'kit',
      icon: BaggageClaim,
      label: 'Tạo kit',
      path: 'kit',
    },
    {
      id: 'services',
      icon: RoomService,
      label: 'Tạo Dịch vụ',
      path: 'services',
    }, 
    {
      id: 'blog',
      icon: Newspaper,
      label: 'Tạo Blog/Tin tức',
      path: 'create-blog',
    },
    {
      id: 'servicesInfo',
      icon: ShoppingBag,
      label: 'Tất cả dịch vụ',
      path: 'a-getAllService',
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
            <span className="font-semibold text-gray-900">Admin Panel</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
          <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
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
        w-67
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out
        flex flex-col
        h-screen
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
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
          {/* <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 w-full">
            <div className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>
            <span className="font-medium">Thông báo</span>
          </button> */}

          {/* Settings
          <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 w-full">
            <Settings className="h-5 w-5" />
            <span className="font-medium">Cài đặt</span>
          </button> */}

          {/* User Profile */}
          <div className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-gray-50">
            <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
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

export default AdminSidebar;
