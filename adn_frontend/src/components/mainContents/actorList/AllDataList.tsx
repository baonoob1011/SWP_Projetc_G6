import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Users, UserCheck, Shield, Crown, Calendar, Home, CreditCard, FlaskConical } from 'lucide-react';
import dataImage from '../../mainContents/actorList/actorList_Image/dataImage.png'
const DataList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const adminNavItems = [
    { path: '/admin/user', label: 'Danh sách người dùng', icon: Users },
    { path: '/admin/manager', label: 'Danh sách quản lý', icon: Shield },
    { path: '/admin/staff', label: 'Danh sách nhân viên', icon: UserCheck },
    { path: '/admin/collector', label: 'Danh sách nhân viên thu mẫu', icon: FlaskConical },
    { path: '/admin/staff-at-home', label: 'Danh sách nhân viên dịch vụ tại nhà', icon: Home },
    { path: '/admin/cashier', label: 'Danh sách nhân viên thu ngân', icon: CreditCard },
    { path: '/admin/technical', label: 'Danh sách nhân viên phòng lab', icon: FlaskConical },
    { path: '/admin/appointment', label: 'Danh sách lịch hẹn', icon: Calendar },
  ];

  const handleDropdownChange = (event: SelectChangeEvent<string>) => {
    const selectedPath = event.target.value;
    if (selectedPath) {
      navigate(selectedPath);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ml-10">
      {/* Header Section */}
      <div className="bg-[#1376EB] rounded-3xl p-8 mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-white text-3xl font-bold mb-2">
            Quản Trị Hệ Thống
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Quản lý toàn bộ dữ liệu và người dùng trong hệ thống
          </p>

          {/* Breadcrumb */}
          <div className="flex items-center mb-6 text-blue-100">
            <span className="text-white font-medium">Admin</span>
            <span className="mx-2">›</span>
            <span>Danh sách dữ liệu</span>
          </div>
        </div>
         {/* Đặt hình ảnh vào trong header */}
          <div className="absolute right-0 bottom-0 mb-3 mr-40">
            <img src={dataImage} alt="data" className="h-40 object-contain" />
          </div>
        
      </div>

      {/* Navigation Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Chọn danh sách quản lý
          </h2>
          <p className="text-gray-600 text-sm">
            Lựa chọn danh sách dữ liệu bạn muốn quản lý
          </p>
        </div>

        <FormControl fullWidth variant="outlined">
          <InputLabel id="admin-nav-select-label">Chọn danh sách quản lý</InputLabel>
          <Select
            labelId="admin-nav-select-label"
            value={location.pathname}
            onChange={handleDropdownChange}
            label="Chọn danh sách quản lý"
            sx={{
              backgroundColor: 'white',
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#116AEF',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#116AEF',
                },
              },
            }}
          >
            {adminNavItems.map((item) => (
              <MenuItem key={item.path} value={item.path}>
                <div className="flex items-center space-x-3 py-1">
                  <item.icon size={24} className="text-gray-700" strokeWidth={2} />
                  <span className="text-base font-medium text-gray-800">{item.label}</span>
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[400px]">
        <Outlet />
      </div>
    </div>
  );
};

export default DataList;

export const DataList2 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const managerNavItems = [
    { path: '/manager/user', label: 'Danh sách người dùng', icon: Users },
    { path: '/manager/staff', label: 'Danh sách nhân viên', icon: UserCheck },
  ];

  const handleDropdownChange = (event: SelectChangeEvent<string>) => {
    const selectedPath = event.target.value;
    if (selectedPath) {
      navigate(selectedPath);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ml-10">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-8 mb-6 relative overflow-hidden">
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
            Quản Lý Dữ Liệu
          </h1>
          <p className="text-green-100 text-lg mb-8">
            Quản lý người dùng và nhân viên trong phạm vi quyền hạn
          </p>

          {/* Breadcrumb */}
          <div className="flex items-center mb-6 text-green-100">
            <span className="text-white font-medium">Manager</span>
            <span className="mx-2">›</span>
            <span>Quản lý dữ liệu</span>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {managerNavItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => navigate(item.path)}
                className={`bg-white bg-opacity-25 backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:bg-opacity-35 hover:scale-105 border border-white border-opacity-20 ${
                  location.pathname === item.path ? 'bg-opacity-35 ring-2 ring-white shadow-lg' : ''
                }`}
              >
                <div className="text-white mb-4 flex justify-center">
                  <item.icon size={36} strokeWidth={2} />
                </div>
                <div className="text-white text-lg font-semibold text-center">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Chọn danh sách quản lý
          </h2>
          <p className="text-gray-600 text-sm">
            Lựa chọn danh sách dữ liệu bạn muốn quản lý
          </p>
        </div>

        <FormControl fullWidth variant="outlined">
          <InputLabel id="manager-nav-select-label">Chọn danh sách quản lý</InputLabel>
          <Select
            labelId="manager-nav-select-label"
            value={location.pathname}
            onChange={handleDropdownChange}
            label="Chọn danh sách quản lý"
            sx={{
              backgroundColor: 'white',
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#10B981',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#10B981',
                },
              },
            }}
          >
            {managerNavItems.map((item) => (
              <MenuItem key={item.path} value={item.path}>
                <div className="flex items-center space-x-3 py-1">
                  <item.icon size={24} className="text-gray-700" strokeWidth={2} />
                  <span className="text-base font-medium text-gray-800">{item.label}</span>
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {managerNavItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(item.path)}
              className={`bg-gray-50 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:bg-green-50 hover:scale-105 border border-gray-200 ${
                location.pathname === item.path ? 'bg-green-50 ring-2 ring-green-300 shadow-md' : ''
              }`}
            >
              <div className="w-18 h-18 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <item.icon className="w-9 h-9 text-white" strokeWidth={2} />
              </div>
              <div className="text-gray-800 text-base font-semibold text-center">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[400px]">
        <Outlet />
      </div>
    </div>
  );
};