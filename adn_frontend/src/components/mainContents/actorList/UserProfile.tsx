import React, { useEffect, useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
<<<<<<< Updated upstream
import { NavLink } from 'react-router-dom';
import { showSuccessAlert } from './utils/notifications';
import {
  Activity,
  CheckCircle,
  Dna,
  Edit3,
  FileText,
  Key,
  Mail,
  Microscope,
  Phone,
  Save,
  Shield,
  TestTube,
  User,
} from 'lucide-react';
=======
import { toast } from 'react-toastify';
import { User, Lock, History, Edit3, Save, Mail, Phone, MapPin, UserCircle, Shield, Calendar, Settings } from 'lucide-react';
import OldPassWord from '../feature/OldPassword';
import BookingHistory from '../feature/BookingHistory';
>>>>>>> Stashed changes

type OldProfile = {
  fullName: string;
  email: string;
  phone: string;
};

const NewProfile = () => {
  const [profile, setProfile] = useState<OldProfile | null>(null);
  const [updateProfile, setUpdateProfile] = useState<OldProfile>({
    fullName: '',
    email: '',
    phone: '',
  });
  const [editableField, setEditableField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: OldProfile = jwtDecode(token);
        setProfile(decoded);
        setUpdateProfile(decoded);
      } catch (error) {
        console.error('Lỗi giải mã token:', error);
        setError('Không thể đọc thông tin người dùng');
      }
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateProfile((updateProfile) => ({
      ...updateProfile,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/user/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updateProfile),
      });

      if (!res.ok) {
        setError('Cập nhật thất bại!');
        return;
      } else {
        const updated = await res.json();
        setTimeout(() => {
          showSuccessAlert('Thành công', 'Cập nhật thông tin thành công!');
        }, 1500);
        setProfile(updated);
        setUpdateProfile(updated);
      }
    } catch (error) {
      console.log(error);
      setError('Lỗi kết nối với hệ thống');
    }
  };

<<<<<<< Updated upstream
  if (!profile) return <Typography>Không có thông tin người dùng.</Typography>;

  return (
    <Box component="form" onSubmit={handleSave}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 py-8 px-4">
        {/* Success Notification */}
        {error && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 mx-4 max-w-sm w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Cập nhật thành công!
                </h3>
                <p className="text-gray-600 text-sm">
                  Thông tin hồ sơ đã được cập nhật
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-md mx-auto mt-30">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 mt-5">
              Hồ sơ người dùng
            </h1>
            <p className="text-gray-600">
              Quản lý thông tin cá nhân cho dịch vụ xét nghiệm ADN
            </p>
          </div>

          {/* Profile Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            {/* Form Fields */}
            {['fullName', 'email', 'phone'].map((field) => {
              const fieldConfig = {
                fullName: { icon: User, label: 'Họ và tên', type: 'text' },
                email: { icon: Mail, label: 'Email', type: 'email' },
                phone: { icon: Phone, label: 'Số điện thoại', type: 'text' }
              };

              const config = fieldConfig[field as keyof typeof fieldConfig];
              const IconComponent = config.icon;

              return (
                <div key={field} className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <IconComponent className="w-4 h-4 text-cyan-600" />
                    {config.label}
                  </label>
                  <div className="relative">
                    <input
                      name={field}
                      type={config.type}
                      value={(updateProfile as any)[field]}
                      onChange={handleInput}
                      readOnly={editableField !== field}
                      onClick={() => setEditableField(field)}
                      onBlur={() => setEditableField(null)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${editableField === field
                        ? 'border-cyan-500 bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-200'
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                        }`}
                      placeholder={`Nhập ${config.label.toLowerCase()}`}
                    />
                    {editableField !== field && (
                      <Edit3 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    )}
                    {editableField === field && (
                      <Activity className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-600" />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                className="
    w-full
    bg-cyan-600
    border border-cyan-700      /* viền cùng tông, đậm hơn */
    text-blue
    py-3 px-4
    rounded-lg
    font-medium
    hover:bg-cyan-700
    transition-colors
    flex items-center justify-center gap-2
    mb-3
  "
              >
                <Save className="w-5 h-5" />
                Cập nhật thông tin
              </Button>


              <Button
                component={NavLink}
                to="/change-pass"
                className="w-full bg-white text-cyan-700 py-3 px-4 rounded-lg font-medium border border-cyan-200 hover:bg-cyan-50 transition-colors flex items-center justify-center gap-2"
              >
                <Key className="w-5 h-5" />
                Đổi mật khẩu
              </Button>
            </div>

            {/* Security Notice */}
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-cyan-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-cyan-800 mb-1">
                    Thông tin bảo mật cao
                  </div>
                  <div className="text-cyan-700">
                    Dữ liệu được bảo vệ theo tiêu chuẩn y tế quốc tế
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Hint */}
          <div className="text-center mt-6">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200">
              <Edit3 className="w-4 h-4 text-cyan-600" />
              Nhấp vào trường để chỉnh sửa
            </div>
          </div>
        </div>
=======
  const tabConfig = [
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: User, color: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
    { id: 'changePassword', label: 'Đổi mật khẩu', icon: Shield, color: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
    { id: 'history', label: 'Lịch sử', icon: Calendar, color: 'bg-gradient-to-r from-blue-500 to-indigo-600' }
  ];

  const profileFields = [
    { field: 'fullName', label: 'Họ và tên', icon: UserCircle, type: 'text', gradient: 'from-blue-400 to-indigo-500' },
    { field: 'email', label: 'Email', icon: Mail, type: 'email', gradient: 'from-green-400 to-emerald-500' },
    { field: 'phone', label: 'Số điện thoại', icon: Phone, type: 'tel', gradient: 'from-purple-400 to-pink-500' },
    { field: 'address', label: 'Địa chỉ', icon: MapPin, type: 'text', gradient: 'from-orange-400 to-red-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Elegant Header */}
        <div className="text-center mb-12 mt-20">
         
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            Quản lý tài khoản
          </h1>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
            Cá nhân hóa trải nghiệm của bạn với các tùy chọn quản lý tài khoản toàn diện
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
              {profile && (
                <div className="relative p-6 bg-gradient-to-r from-blue-600 to-indigo-700">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 ring-4 ring-white/30">
                      <UserCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-white text-lg mb-1">{profile?.fullName}</h3>
                    <p className="text-blue-100 text-sm">{profile?.email}</p>
                  </div>
                </div>
              )}
              
              <nav className="p-3">
                {tabConfig.map(({ id, label, icon: Icon, color }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-4 text-left rounded-xl transition-all duration-300 mb-2 group ${
                      activeTab === id
                        ? `${color} text-white shadow-lg transform scale-105`
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-md'
                    }`}
                  >
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      activeTab === id ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-blue-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${activeTab === id ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`} />
                    </div>
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-6 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-red-800 font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Profile Tab */}
            {activeTab === 'profile' && profile && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                <div className="relative px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-700">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative">
                    <h2 className="text-2xl font-bold text-white">Hồ sơ người dùng</h2>
                    <p className="text-blue-100 mt-2">Cập nhật và quản lý thông tin cá nhân của bạn</p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {profileFields.map(({ field, label, icon: Icon, type, gradient }) => (
                      <div key={field} className="group">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient} shadow-md`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{label}</span>
                        </div>
                        <div className="relative">
                          <input
                            type={type}
                            name={field}
                            value={(updateProfile as any)[field]}
                            onChange={handleInput}
                            readOnly={editableField !== field}
                            onClick={() => setEditableField(field)}
                            onBlur={() => setEditableField(null)}
                            className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 text-gray-800 font-medium ${
                              editableField === field
                                ? 'border-blue-400 ring-4 ring-blue-100 bg-blue-50 shadow-lg transform scale-105'
                                : 'border-gray-200 hover:border-gray-300 bg-white/80 hover:shadow-md focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
                            } focus:outline-none`}
                            placeholder={`Nhập ${label.toLowerCase()}`}
                          />
                          {editableField === field && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                              <div className="p-1 bg-blue-500 rounded-full animate-pulse">
                                <Edit3 className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <button
                      onClick={(e) => handleSave(e as any)}
                      className="group inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                      <Save className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Cập nhật thông tin</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Change Password Tab */}
            {activeTab === 'changePassword' && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                <div className="relative px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-600">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative">
                    <h2 className="text-2xl font-bold text-white">Bảo mật tài khoản</h2>
                    <p className="text-green-100 mt-2">Thay đổi mật khẩu để tăng cường bảo mật</p>
                  </div>
                </div>
                <div className="p-8">
                  <OldPassWord
                    role={
                      (localStorage.getItem('role') as
                        | 'USER'
                        | 'STAFF'
                        | 'MANAGER') || 'USER'
                    }
                  />
                </div>
              </div>
            )}

            {/* Enhanced History Tab */}
            {activeTab === 'history' && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                <div className="relative px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-600">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative">
                    <h2 className="text-2xl font-bold text-white">Lịch sử hoạt động</h2>
                    <p className="text-purple-100 mt-2">Theo dõi các giao dịch và hoạt động trước đây</p>
                  </div>
                </div>
                <div className="p-8">
                  <BookingHistory />
                </div>
              </div>
            )}
          </div>
        </div>
>>>>>>> Stashed changes
      </div>
    </Box>
  );
};

export default NewProfile;