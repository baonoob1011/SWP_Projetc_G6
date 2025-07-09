/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import {
  User,
  Edit3,
  Save,
  Mail,
  Phone,
  MapPin,
  UserCircle,
  Shield,
  Calendar,
  PackageSearch,
  History,
  EyeOff,
  Eye,
  Wallet,
} from 'lucide-react';
import OldPassWord from '../feature/OldPassword';
import Booking from '../services/Booking';
// import GetAllResult from '../feature/GetAllResult';
import GetKitDeliveryStatus from '../feature/AppointmentStatus';
import BookingHistory from '../services/BookingHistory';

type OldProfile = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl: string;
};

const NewProfile = () => {
  const [profile, setProfile] = useState<OldProfile | null>(null);
  const [updateProfile, setUpdateProfile] = useState<OldProfile>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    avatarUrl: '',
  });
  const [amount, setAmount] = useState<string>();
  const [editableField, setEditableField] = useState<string | null>(null);
  const [money, setMoney] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showBalance, setShowBalance] = useState(false);

  const [activeTab, setActiveTab] = useState<
    'profile' | 'changePassword' | 'appointment' | 'follow' | 'history'
  >('appointment');

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
  const handleDeposit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/api/wallet/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ amount }), // Example amount
      });
      const redirectUrl = await res.text();
      if (res.ok) {
        window.location.href = redirectUrl;
      } else {
        toast.error('bị lỗi');
      }
    } catch (error) {
      console.log(error);
    }
  };

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
  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/user/get-user-info', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        toast.error('❌ Cập nhật thất bại: ' + errorText);
        return;
      }

      const updated = await res.json();
      setProfile(updated);
      setUpdateProfile(updated);
    } catch (error) {
      console.error(error);
      toast.error('❌ Lỗi kết nối với hệ thống');
    }
  };
  const fetchMoneyData = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/wallet/get-amount', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        toast.error('❌ Cập nhật thất bại: ' + errorText);
        return;
      }

      const data = await res.json();
      setMoney(data);
    } catch (error) {
      console.error(error);
      toast.error('❌ Lỗi kết nối với hệ thống');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchMoneyData();
  }, []);

  const tabConfig = [
    {
      id: 'appointment',
      label: 'Cuộc hẹn',
      icon: Calendar,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    },
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
    {
      id: 'follow',
      label: 'Theo dõi đơn hàng',
      icon: PackageSearch,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    },
    {
      id: 'history',
      label: 'Lịch sử đơn hàng',
      icon: History,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    },
  ];

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
    {
      field: 'address',
      label: 'Địa chỉ',
      icon: MapPin,
      type: 'text',
      gradient: 'from-orange-400 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Elegant Header */}
        <div className="text-center mb-12 mt-20">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            Quản lý tài khoản
          </h1>
        </div>

        <div className="grid grid-cols- lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
              {profile && money && (
                <div className="relative p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg">
                  <div className="absolute inset-0 bg-black/10 rounded-xl" />
                  <div className="relative flex flex-col items-center text-center text-white">
                    {/* Icon user */}
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 ring-4 ring-white/30">
                      <img
                        src={profile.avatarUrl}
                        alt="Avatar"
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    </div>

                    <h3 className="font-bold text-white text-lg mb-1">
                      {profile.fullName}
                    </h3>
                    <p className="text-blue-100 text-sm">{profile.email}</p>

                    {/* Số dư */}
                    <div className="mt-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-white/80" />
                        <span className="text-xl font-semibold tracking-wide transition-all select-none">
                          {showBalance
                            ? `${money.balance.toLocaleString()} VND`
                            : '•••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowBalance(!showBalance)}
                          className="text-white/80 hover:text-white"
                        >
                          {showBalance ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Form nạp tiền */}
                    <form
                      onSubmit={handleDeposit}
                      className="flex flex-col items-center gap-2 w-full max-w-xs"
                    >
                      <input
                        id="amount"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={amount}
                        name="amount"
                        placeholder="Nhập số tiền"
                        onChange={(e) => {
                          const onlyNums = e.target.value.replace(/\D/g, ''); // Chỉ giữ số
                          setAmount(onlyNums);
                        }}
                        className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                        style={{
                          MozAppearance: 'textfield',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                        }}
                      />

                      <button
                        type="submit"
                        className="px-4 py-2 w-full rounded-lg bg-white text-blue-700 font-semibold hover:bg-blue-100 transition"
                        disabled={!amount}
                      >
                        Nạp tiền
                      </button>
                    </form>
                  </div>
                </div>
              )}

              <nav className="p-3">
                {tabConfig.map(({ id, label, icon: Icon, color }) => (
                  <button
                    key={id}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onClick={() => setActiveTab(id as any)}
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
            {activeTab === 'appointment' && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                <div className="relative px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-600">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative">
                    <h2 className="text-2xl font-bold text-white">Cuộc hẹn</h2>
                  </div>
                </div>
                <div className="p-8">
                  <Booking />
                </div>
              </div>
            )}
            {/* Enhanced Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                <div className="relative px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-700">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative">
                    <h2 className="text-2xl font-bold text-white">
                      Hồ sơ người dùng
                    </h2>
                    <p className="text-blue-100 mt-2">
                      Cập nhật và quản lý thông tin cá nhân của bạn
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                      )
                    )}
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <button
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                    <h2 className="text-2xl font-bold text-white">
                      Bảo mật tài khoản
                    </h2>
                    <p className="text-green-100 mt-2">
                      Thay đổi mật khẩu để tăng cường bảo mật
                    </p>
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
            {activeTab === 'follow' && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                <div className="relative px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-600">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative">
                    <h2 className="text-2xl font-bold text-white">Đơn hàng</h2>
                  </div>
                </div>
                <div className="p-8">
                  {' '}
                  <GetKitDeliveryStatus />
                </div>
              </div>
            )}
            {activeTab === 'history' && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                <div className="relative px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-600">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative">
                    <h2 className="text-2xl font-bold text-white">Lịch sử</h2>
                    <p className="text-purple-100 mt-2">
                      Theo dõi các giao dịch và hoạt động trước đây
                    </p>
                  </div>
                </div>
                <div className="p-8">
                  <BookingHistory />
                </div>
              </div>
            )}
            {/* Enhanced History Tab */}
          </div>
        </div>
      </div>

      {/* <GetAllResult /> */}
    </div>
  );
};

export default NewProfile;
