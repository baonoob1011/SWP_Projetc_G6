import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { User, Edit3, Save, Mail, Phone, MapPin, UserCircle, Shield, Calendar, Eye, EyeOff, CheckCircle } from 'lucide-react';
import BookingHistory from '../feature/BookingHistory';

type OldProfile = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

type TabType = 'profile' | 'changePassword' | 'history';

const NewProfile = () => {
  const [profile, setProfile] = useState<OldProfile | null>(null);
  const [updateProfile, setUpdateProfile] = useState<OldProfile>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [editableField, setEditableField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  // Password change states
  const [passwordStep, setPasswordStep] = useState<1 | 2>(1);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    setUpdateProfile((prev) => ({
      ...prev,
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
        const errorText = await res.text();
        toast.error('❌ Cập nhật thất bại: ' + errorText);
        return;
      }

      const updated = await res.json();
      toast.success('✅ Cập nhật thông tin thành công!');
      setProfile(updated);
      setUpdateProfile(updated);
    } catch (error) {
      console.error(error);
      toast.error('❌ Lỗi kết nối với hệ thống');
    }
  };

  const handleVerifyOldPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword.trim()) {
      toast.error('❌ Vui lòng nhập mật khẩu cũ');
      return;
    }

    try {
      // Sử dụng API change-password để verify mật khẩu cũ bằng cách gửi cùng mật khẩu cũ và mới
      const res = await fetch('http://localhost:8080/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: oldPassword, // Dùng tạm để verify
        }),
      });

      if (res.status === 400) {
        // Nếu 400 có thể là mật khẩu cũ sai
        toast.error('❌ Mật khẩu cũ không chính xác');
        return;
      }

      // Nếu thành công hoặc lỗi khác (không phải mật khẩu sai) thì chuyển bước
      toast.success('✅ Xác nhận mật khẩu thành công');
      setPasswordStep(2);
    } catch (error) {
      console.error(error);
      toast.error('❌ Lỗi kết nối với hệ thống');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error('❌ Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('❌ Mật khẩu xác nhận không khớp');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('❌ Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });

      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        let errorMessage = 'Không thể đổi mật khẩu';
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMessage = errorData.message || 'Có lỗi xảy ra';
        } else {
          errorMessage = await res.text() || 'Có lỗi xảy ra';
        }
        
        toast.error('❌ ' + errorMessage);
        return;
      }

      toast.success('✅ Đổi mật khẩu thành công!');
      // Reset form
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordStep(1);
      setActiveTab('profile');
    } catch (error) {
      console.error(error);
      toast.error('❌ Lỗi kết nối với hệ thống');
    }
  };

  const resetPasswordForm = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordStep(1);
  };

  useEffect(() => {
    if (activeTab === 'changePassword') {
      resetPasswordForm();
    }
  }, [activeTab]);

  const tabConfig = [
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: User, color: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
    { id: 'changePassword', label: 'Đổi mật khẩu', icon: Shield, color: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
    { id: 'history', label: 'Lịch sử', icon: Calendar, color: 'bg-gradient-to-r from-blue-500 to-indigo-600' }
  ] as const;

  const profileFields = [
    { field: 'fullName', label: 'Họ và tên', icon: UserCircle, type: 'text', gradient: 'from-blue-400 to-indigo-500' },
    { field: 'email', label: 'Email', icon: Mail, type: 'email', gradient: 'from-green-400 to-emerald-500' },
    { field: 'phone', label: 'Số điện thoại', icon: Phone, type: 'tel', gradient: 'from-purple-400 to-pink-500' },
    { field: 'address', label: 'Địa chỉ', icon: MapPin, type: 'text', gradient: 'from-orange-400 to-red-500' }
  ] as const;

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
                    onClick={() => setActiveTab(id)}
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
                  <form onSubmit={handleSave}>
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
                              value={updateProfile[field as keyof OldProfile]}
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
                        type="submit"
                        className="group inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                      >
                        <Save className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span>Cập nhật thông tin</span>
                      </button>
                    </div>
                  </form>
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
                    <p className="text-blue-100 mt-2">Thay đổi mật khẩu để tăng cường bảo mật</p>
                  </div>
                </div>
                <div className="p-8">
                  {/* Step 1: Verify Old Password */}
                  {passwordStep === 1 && (
                    <div className="max-w-md mx-auto">
                      <form onSubmit={handleVerifyOldPassword} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu cũ
                          </label>
                          <div className="relative">
                            <input
                              type={showOldPassword ? 'text' : 'password'}
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              placeholder="Nhập mật khẩu cũ"
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 text-gray-800 font-medium"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowOldPassword(!showOldPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                          XÁC NHẬN
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Step 2: Enter New Password */}
                  {passwordStep === 2 && (
                    <div className="max-w-md mx-auto">
                      <form onSubmit={handleChangePassword} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu mới
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Nhập mật khẩu mới"
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all duration-300 text-gray-800 font-medium"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Xác nhận mật khẩu mới
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Nhập lại mật khẩu"
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all duration-300 text-gray-800 font-medium"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* Password strength indicator */}
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">Yêu cầu mật khẩu:</div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className={`w-4 h-4 ${newPassword.length >= 6 ? 'text-green-500' : 'text-gray-300'}`} />
                            <span className={`text-sm ${newPassword.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
                              Ít nhất 6 ký tự
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className={`w-4 h-4 ${newPassword === confirmPassword && newPassword ? 'text-green-500' : 'text-gray-300'}`} />
                            <span className={`text-sm ${newPassword === confirmPassword && newPassword ? 'text-green-600' : 'text-gray-500'}`}>
                              Mật khẩu khớp nhau
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={() => setPasswordStep(1)}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
                          >
                            QUAY LẠI
                          </button>
                          <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
                          >
                            ĐỔI MẬT KHẨU
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
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
      </div>
    </div>
  );
};

export default NewProfile;