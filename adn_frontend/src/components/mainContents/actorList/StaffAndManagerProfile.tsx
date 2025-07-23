import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import {
  User,
  Edit3,
  Save,
  Mail,
  Phone,
  UserCircle,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';

type OldProfile = {
  fullName: string;
  email: string;
  phone: string;
};

type Profile = {
  role: 'MANAGER' | 'STAFF' | 'CASHIER' | 'CONSULTANT';
};

const NewProfile = ({ role }: Profile) => {
  const [profile, setProfile] = useState<OldProfile | null>(null);
  const [updateProfile, setUpdateProfile] = useState<OldProfile>({
    fullName: '',
    email: '',
    phone: '',
  });
  const [editableField, setEditableField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'changePassword'>(
    'profile'
  );

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
    const apiMap = {
      CONSULTANT: 'http://localhost:8080/api/staff/update-profile',
      CASHIER: 'http://localhost:8080/api/staff/update-profile',
      STAFF: 'http://localhost:8080/api/staff/update-profile',
      MANAGER: 'http://localhost:8080/api/manager/update-profile',
    };
    try {
      const res = await fetch(apiMap[role], {
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
    if (!oldPassword) {
      toast.error('❌ Vui lòng nhập mật khẩu cũ');
      return;
    }

    try {
      const apiMap = {
        CONSULTANT: 'http://localhost:8080/api/staff/verify-password',
        CASHIER: 'http://localhost:8080/api/staff/verify-password',
        STAFF: 'http://localhost:8080/api/staff/verify-password',
        MANAGER: 'http://localhost:8080/api/manager/verify-password',
      };

      const res = await fetch(apiMap[role], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ password: oldPassword }),
      });

      if (!res.ok) {
        toast.error('❌ Mật khẩu cũ không chính xác');
        return;
      }

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
      const apiMap = {
        CONSULTANT: 'http://localhost:8080/api/staff/change-password',
        CASHIER: 'http://localhost:8080/api/staff/change-password',
        STAFF: 'http://localhost:8080/api/staff/change-password',
        MANAGER: 'http://localhost:8080/api/manager/change-password',
      };

      const res = await fetch(apiMap[role], {
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
        const errorText = await res.text();
        toast.error('❌ Đổi mật khẩu thất bại: ' + errorText);
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
    {
      id: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: User,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    },
    {
      id: 'changePassword',
      label: 'Đổi mật khẩu',
      icon: Shield,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    },
  ] as const;

  const profileFields = [
    {
      field: 'fullName',
      label: 'Họ và tên',
      icon: UserCircle,
      type: 'text',
      gradient: 'from-blue-400 to-indigo-500',
    },
    {
      field: 'email',
      label: 'Email',
      icon: Mail,
      type: 'email',
      gradient: 'from-green-400 to-emerald-500',
    },
    {
      field: 'phone',
      label: 'Số điện thoại',
      icon: Phone,
      type: 'tel',
      gradient: 'from-purple-400 to-pink-500',
    },
  ] as const;

  const roleTitle = role === 'MANAGER' ? 'Quản lý' : 'Nhân viên';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Elegant Header */}
        <div className="text-center mb-12 mt-20">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            Quản lý tài khoản
          </h1>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
            Cá nhân hóa trải nghiệm của bạn với các tùy chọn quản lý tài khoản
            toàn diện
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
                    <h3 className="font-bold text-white text-lg mb-1">
                      {profile?.fullName}
                    </h3>
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
                    <div
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        activeTab === id
                          ? 'bg-white/20'
                          : 'bg-gray-100 group-hover:bg-blue-100'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          activeTab === id
                            ? 'text-white'
                            : 'text-gray-600 group-hover:text-blue-600'
                        }`}
                      />
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
                    <h2 className="text-2xl font-bold text-white">
                      Hồ sơ {roleTitle}
                    </h2>
                    <p className="text-blue-100 mt-2">
                      Cập nhật và quản lý thông tin cá nhân của bạn
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  <form onSubmit={handleSave}>
                    {/* Compact single column layout for professional look */}
                    <div className="max-w-2xl mx-auto space-y-6">
                      {profileFields.map(
                        ({ field, label, icon: Icon, type, gradient }) => (
                          <div key={field} className="group">
                            <div className="flex items-center space-x-3 mb-3">
                              <div
                                className={`p-2 rounded-lg bg-gradient-to-r ${gradient} shadow-md`}
                              >
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                {label}
                              </span>
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
                        )
                      )}
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-200 text-center">
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
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '0',
                  borderRadius: '16px',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                }}
              >
                {/* Blue Header Section */}
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    borderRadius: '16px 16px 0 0',
                    padding: '40px',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: '#3639CD',
                      backdropFilter: 'blur(10px)',
                    }}
                  ></div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2
                      style={{ margin: 0, fontWeight: '600', fontSize: '30px' }}
                    >
                      Bảo mật tài khoản
                    </h2>
                    <p
                      style={{
                        margin: '10px 0 0 0',
                        opacity: 0.9,
                        fontSize: '15px',
                      }}
                    >
                      Thay đổi mật khẩu để tăng cường bảo mật
                    </p>
                  </div>
                </div>

                {/* Content Section */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '0 0 16px 16px',
                    padding: '50px 40px',
                    textAlign: 'center',
                    boxShadow: '0 10px 25px #3639CD',
                  }}
                >
                  {/* Step 1: Verify Old Password */}
                  {passwordStep === 1 && (
                    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                      {/* Shield Icon */}
                      <div
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          backgroundColor: '#3639CD',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 40px',
                          border: '4px solid #3639CD',
                        }}
                      >
                        <Shield
                          style={{
                            width: '45px',
                            height: '45px',
                            color: 'white',
                          }}
                        />
                      </div>

                      {/* Title and Subtitle */}
                      <h3
                        style={{
                          fontSize: '28px',
                          fontWeight: '600',
                          color: '#374151',
                          margin: '0 0 10px 0',
                        }}
                      >
                        Xác thực mật khẩu
                      </h3>
                      <p
                        style={{
                          fontSize: '16px',
                          color: '#6b7280',
                          margin: '0 0 40px 0',
                        }}
                      >
                        Vui lòng nhập mật khẩu hiện tại để tiếp tục
                      </p>

                      <form onSubmit={handleVerifyOldPassword}>
                        <div
                          style={{ textAlign: 'left', marginBottom: '30px' }}
                        >
                          <label
                            style={{
                              display: 'block',
                              fontSize: '16px',
                              fontWeight: '500',
                              color: '#374151',
                              marginBottom: '10px',
                            }}
                          >
                            Mật khẩu hiện tại
                          </label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type={showOldPassword ? 'text' : 'password'}
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              placeholder="Nhập mật khẩu hiện tại"
                              style={{
                                width: '100%',
                                padding: '18px 50px 18px 18px',
                                border: '2px solid #e1e5e9',
                                borderRadius: '12px',
                                backgroundColor: 'white',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                boxSizing: 'border-box',
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = '#4f46e5';
                                e.target.style.boxShadow =
                                  '0 0 0 4px rgba(79, 70, 229, 0.15)';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#e5e7eb';
                                e.target.style.boxShadow = 'none';
                              }}
                              required
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowOldPassword(!showOldPassword)
                              }
                              style={{
                                position: 'absolute',
                                right: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: '#6b7280',
                                cursor: 'pointer',
                                padding: '5px',
                              }}
                            >
                              {showOldPassword ? (
                                <EyeOff
                                  style={{ width: '20px', height: '20px' }}
                                />
                              ) : (
                                <Eye
                                  style={{ width: '20px', height: '20px' }}
                                />
                              )}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          style={{
                            width: '100%',
                            background:
                              'linear-gradient(135deg, #4f46e5 0%, #3639CD 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '18px 0',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                          }}
                          onMouseOver={(e) => {
                            (e.target as HTMLButtonElement).style.transform =
                              'translateY(-3px)';
                            (e.target as HTMLButtonElement).style.boxShadow =
                              '0 12px 35px rgba(79, 70, 229, 0.5)';
                          }}
                          onMouseOut={(e) => {
                            (e.target as HTMLButtonElement).style.transform =
                              'translateY(0)';
                            (e.target as HTMLButtonElement).style.boxShadow =
                              '0 8px 25px rgba(79, 70, 229, 0.4)';
                          }}
                        >
                          XÁC THỰC MẬT KHẨU
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Step 2: Enter New Password */}
                  {passwordStep === 2 && (
                    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                      {/* Shield Icon */}
                      <div
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          backgroundColor: '#4f46e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 40px',
                          boxShadow: '0 15px 35px rgba(79, 70, 229, 0.4)',
                          border: '4px solid rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        <Shield
                          style={{
                            width: '45px',
                            height: '45px',
                            color: 'white',
                          }}
                        />
                      </div>

                      {/* Title and Subtitle */}
                      <h3
                        style={{
                          fontSize: '28px',
                          fontWeight: '600',
                          color: '#374151',
                          margin: '0 0 10px 0',
                        }}
                      >
                        Tạo mật khẩu mới
                      </h3>
                      <p
                        style={{
                          fontSize: '16px',
                          color: '#6b7280',
                          margin: '0 0 40px 0',
                        }}
                      >
                        Nhập mật khẩu mới để hoàn tất quá trình thay đổi
                      </p>

                      <form onSubmit={handleChangePassword}>
                        <div
                          style={{ textAlign: 'left', marginBottom: '20px' }}
                        >
                          <label
                            style={{
                              display: 'block',
                              fontSize: '16px',
                              fontWeight: '500',
                              color: '#374151',
                              marginBottom: '10px',
                            }}
                          >
                            Mật khẩu mới
                          </label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Nhập mật khẩu mới"
                              style={{
                                width: '100%',
                                padding: '18px 50px 18px 18px',
                                border: '2px solid #e1e5e9',
                                borderRadius: '12px',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                boxSizing: 'border-box',
                                backgroundColor: 'white',
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = '#4f46e5';
                                e.target.style.boxShadow =
                                  '0 0 0 4px rgba(79, 70, 229, 0.15)';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#e1e5e9';
                                e.target.style.boxShadow = 'none';
                              }}
                              required
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              style={{
                                position: 'absolute',
                                right: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: '#6b7280',
                                cursor: 'pointer',
                                padding: '5px',
                              }}
                            >
                              {showNewPassword ? (
                                <EyeOff
                                  style={{ width: '20px', height: '20px' }}
                                />
                              ) : (
                                <Eye
                                  style={{ width: '20px', height: '20px' }}
                                />
                              )}
                            </button>
                          </div>
                        </div>

                        <div
                          style={{ textAlign: 'left', marginBottom: '30px' }}
                        >
                          <label
                            style={{
                              display: 'block',
                              fontSize: '16px',
                              fontWeight: '500',
                              color: '#374151',
                              marginBottom: '10px',
                            }}
                          >
                            Xác nhận mật khẩu mới
                          </label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              placeholder="Nhập lại mật khẩu"
                              style={{
                                width: '100%',
                                padding: '18px 50px 18px 18px',
                                border: '2px solid #e1e5e9',
                                borderRadius: '12px',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                boxSizing: 'border-box',
                                backgroundColor: 'white',
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = '#4f46e5';
                                e.target.style.boxShadow =
                                  '0 0 0 4px rgba(79, 70, 229, 0.15)';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#e1e5e9';
                                e.target.style.boxShadow = 'none';
                              }}
                              required
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              style={{
                                position: 'absolute',
                                right: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: '#6b7280',
                                cursor: 'pointer',
                                padding: '5px',
                              }}
                            >
                              {showConfirmPassword ? (
                                <EyeOff
                                  style={{ width: '20px', height: '20px' }}
                                />
                              ) : (
                                <Eye
                                  style={{ width: '20px', height: '20px' }}
                                />
                              )}
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                          <button
                            type="button"
                            onClick={() => setPasswordStep(1)}
                            style={{
                              flex: '1',
                              background:
                                'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                              color: 'white',
                              border: 'none',
                              padding: '18px 0',
                              borderRadius: '12px',
                              fontSize: '16px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                            }}
                          >
                            QUAY LẠI
                          </button>
                          <button
                            type="submit"
                            style={{
                              flex: '1',
                              background:
                                'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                              color: 'white',
                              border: 'none',
                              padding: '18px 0',
                              borderRadius: '12px',
                              fontSize: '16px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)',
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                            }}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProfile;
