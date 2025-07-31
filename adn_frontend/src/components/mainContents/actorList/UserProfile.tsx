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
import TransactionTable from './user/PaymentHistory';

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
    | 'profile'
    | 'changePassword'
    | 'appointment'
    | 'follow'
    | 'history'
    | 'payment'
  >('appointment');

  useEffect(() => {
    const reload = () => {
      fetchData(); // reload profile
      fetchMoneyData(); // reload ví tiền
    };

    window.addEventListener('reloadProfile', reload);
    return () => window.removeEventListener('reloadProfile', reload);
  }, []);

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
      description: 'Quản lý lịch hẹn của bạn'
    },
    {
      id: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: User,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      description: 'Cập nhật thông tin cá nhân'
    },
    {
      id: 'changePassword',
      label: 'Đổi mật khẩu',
      icon: Shield,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      description: 'Bảo mật tài khoản'
    },
    {
      id: 'follow',
      label: 'Theo dõi đơn hàng',
      icon: PackageSearch,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      description: 'Trạng thái đơn hàng hiện tại'
    },
    {
      id: 'history',
      label: 'Lịch sử đơn hàng',
      icon: History,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      description: 'Xem lại các đơn hàng trước đây'
    },
    {
      id: 'payment',
      label: 'Lịch sử giao dịch',
      icon: Wallet,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      description: 'Theo dõi giao dịch tài chính'
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

  const renderTabContent = () => {
    const currentTab = tabConfig.find(tab => tab.id === activeTab);
    const tabStyle = currentTab?.color || 'bg-gradient-to-r from-blue-500 to-indigo-600';

    switch (activeTab) {
      case 'appointment':
        return (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div className={`relative px-8 py-6 ${tabStyle}`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Cuộc hẹn</h2>
                  <p className="text-white/80 mt-1">Quản lý lịch hẹn của bạn</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <Booking />
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div className={`relative px-8 py-6 ${tabStyle}`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Hồ sơ người dùng</h2>
                  <p className="text-white/80 mt-1">Cập nhật và quản lý thông tin cá nhân của bạn</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {profileFields.map(({ field, label, icon: Icon, type, gradient }) => (
                  <div key={field} className="group">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-r ${gradient} shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          {label}
                        </span>
                        <div className="h-0.5 bg-gradient-to-r from-gray-300 to-transparent mt-1"></div>
                      </div>
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
                            ? 'border-blue-400 ring-4 ring-blue-100 bg-blue-50 shadow-lg transform scale-[1.02]'
                            : 'border-gray-200 hover:border-gray-300 bg-white/80 hover:shadow-md focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
                        } focus:outline-none`}
                        placeholder={`Nhập ${label.toLowerCase()}`}
                      />
                      {editableField === field && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <div className="p-1.5 bg-blue-500 rounded-full animate-pulse shadow-lg">
                            <Edit3 className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200/50">
                <div className="flex justify-center">
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
          </div>
        );

      case 'changePassword':
        return (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div className={`relative px-8 py-6 ${tabStyle}`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Bảo mật tài khoản</h2>
                  <p className="text-white/80 mt-1">Thay đổi mật khẩu để tăng cường bảo mật</p>
                </div>
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
        );

      case 'follow':
        return (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div className={`relative px-8 py-6 ${tabStyle}`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <PackageSearch className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Theo dõi đơn hàng</h2>
                  <p className="text-white/80 mt-1">Trạng thái đơn hàng hiện tại</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <GetKitDeliveryStatus />
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div className={`relative px-8 py-6 ${tabStyle}`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <History className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Lịch sử đơn hàng</h2>
                  <p className="text-white/80 mt-1">Xem lại các đơn hàng trước đây</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <BookingHistory />
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div className={`relative px-8 py-6 ${tabStyle}`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Lịch sử giao dịch</h2>
                  <p className="text-white/80 mt-1">Theo dõi giao dịch tài chính trước đây</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <TransactionTable />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Elegant Header */}
        <div className="text-center mb-12 mt-20">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
            Quản lý tài khoản
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div className="p-3">
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                {tabConfig.map(({ id, label, icon: Icon, color }) => (
                  <button
                    key={id}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onClick={() => setActiveTab(id as any)}
                    className={`flex flex-col items-center space-y-2 p-4 rounded-xl transition-all duration-300 group ${
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
                    <span className="font-medium text-sm text-center leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced User Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden sticky top-8">
              {profile && money && (
                <div className="relative p-8 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-700 rounded-xl shadow-lg">
                  <div className="absolute inset-0 bg-black/10 rounded-xl" />
                  <div className="relative flex flex-col items-center text-center text-white">
                    {/* Avatar with enhanced styling */}
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center ring-4 ring-white/30 shadow-xl">
                        <img
                          src={profile.avatarUrl}
                          alt="Avatar"
                          className="w-18 h-18 rounded-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-bold text-white text-xl mb-2">
                        {profile.fullName}
                      </h3>
                      <p className="text-blue-100 text-sm bg-white/10 px-3 py-1 rounded-full">
                        {profile.email}
                      </p>
                    </div>

                    {/* Enhanced Balance Display */}
                    <div className="w-full mb-6">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Wallet className="w-5 h-5 text-white/80" />
                          <span className="text-sm text-white/80 font-medium">Số dư ví</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-2xl font-bold tracking-wide transition-all select-none">
                            {showBalance
                              ? `${money.balance.toLocaleString()} VND`
                              : '•••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowBalance(!showBalance)}
                            className="text-white/80 hover:text-white transition-colors p-1"
                          >
                            {showBalance ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Deposit Form */}
                    <form
                      onSubmit={handleDeposit}
                      className="w-full space-y-3"
                    >
                      <div className="relative">
                        <input
                          id="amount"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={amount}
                          name="amount"
                          placeholder="Nhập số tiền cần nạp"
                          onChange={(e) => {
                            const onlyNums = e.target.value.replace(/\D/g, '');
                            setAmount(onlyNums);
                          }}
                          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/20 backdrop-blur-sm"
                          style={{
                            MozAppearance: 'textfield',
                            appearance: 'none',
                            WebkitAppearance: 'none',
                          }}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 text-sm">
                          VND
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full px-4 py-3 rounded-xl bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={!amount}
                      >
                        💳 Nạp tiền vào ví
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
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
            
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProfile;