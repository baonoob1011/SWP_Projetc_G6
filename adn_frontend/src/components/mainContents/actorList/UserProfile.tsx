import React, { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Save,
  Key,
  Edit3,
  Dna,
  TestTube,
  Microscope,
  Activity,
  Shield,
  FileText,
  CheckCircle,
} from 'lucide-react';

type UserProfile = {
  fullName: string;
  email: string;
  phone: string;
};

const UserProfile: React.FC = () => {
  const navigate = (path: string) => {
    // This would be useNavigate() from react-router-dom in the real app
    console.log(`Navigate to: ${path}`);
  };
  const [user, setUser] = useState<UserProfile | null>(null);
  const [updateUser, setUpdateUser] = useState<UserProfile>({
    fullName: '',
    email: '',
    phone: '',
  });
  const [editableField, setEditableField] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const decodeJWT = (token: string): UserProfile | null => {
        try {
          const payload = token.split('.')[1];
          const decoded = JSON.parse(atob(payload));
          return {
            fullName: decoded.fullName || '',
            email: decoded.email || '',
            phone: decoded.phone || '',
          };
        } catch (error) {
          console.error('Error decoding token:', error);
          return null;
        }
      };

      const decoded = decodeJWT(token);
      if (decoded) {
        setUser(decoded);
        setUpdateUser(decoded);
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Invalid token', err);
      navigate('/login');
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setUser(updateUser);
    setEditableField(null);

    // Show notification
    setShowNotification(true);
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleFieldCancel = () => {
    setEditableField(null);
    if (user) setUpdateUser(user);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Dna className="w-6 h-6 text-emerald-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-700 font-medium">
            Đang tải thông tin người dùng...
          </p>
          <div className="flex justify-center mt-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-100 relative overflow-hidden">
      {/* Success Notification Overlay */}
      {showNotification && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl p-8 mx-4 max-w-sm w-full transform animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white animate-pulse" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center animate-bounce">
                  <TestTube className="w-4 h-4 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Cập nhật thành công!
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Thông tin hồ sơ của bạn đã được cập nhật và lưu trữ bảo mật
                trong hệ thống xét nghiệm ADN.
              </p>

              <div className="flex justify-center">
                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-800">
                    Dữ liệu được bảo mật
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-600 h-1 rounded-full animate-pulse"
                    style={{ width: '100%', animation: 'progress 3s linear' }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Thông báo sẽ tự động đóng
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DNA-themed background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* DNA helix patterns */}
        <div className="absolute top-20 left-10 w-32 h-32 opacity-10">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full animate-spin"
            style={{ animationDuration: '20s' }}
          >
            <path
              d="M20,20 Q50,40 80,20 Q50,60 20,80 Q50,60 80,80"
              stroke="#059669"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="20" cy="20" r="3" fill="#059669" />
            <circle cx="80" cy="20" r="3" fill="#0891b2" />
            <circle cx="20" cy="80" r="3" fill="#0891b2" />
            <circle cx="80" cy="80" r="3" fill="#059669" />
          </svg>
        </div>
        <div className="absolute bottom-20 right-10 w-24 h-24 opacity-10">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full animate-spin"
            style={{ animationDuration: '15s', animationDirection: 'reverse' }}
          >
            <path
              d="M30,10 Q50,30 70,10 Q50,50 30,70 Q50,50 70,70"
              stroke="#0891b2"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="30" cy="10" r="2" fill="#059669" />
            <circle cx="70" cy="10" r="2" fill="#0891b2" />
            <circle cx="30" cy="70" r="2" fill="#0891b2" />
            <circle cx="70" cy="70" r="2" fill="#059669" />
          </svg>
        </div>

        {/* Scientific background patterns */}
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-gradient-to-br from-emerald-200/20 to-teal-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-gradient-to-tr from-blue-200/20 to-cyan-300/20 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className="relative z-10 pt-20 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          {/* DNA Lab Header */}
          <div className="text-center mb-12 mt-12">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse "></div>
                <Dna className="w-12 h-12 text-white relative z-10 animate-pulse" />
                <TestTube className="absolute top-2 right-2 w-4 h-4 text-cyan-200 animate-bounce" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full border-2 border-white">
                <Microscope className="w-3 h-3 text-white m-0.5" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Hồ sơ người dùng
            </h1>
            <p className="text-gray-600 text-lg">
              Quản lý thông tin cá nhân cho dịch vụ xét nghiệm ADN
            </p>
            <div className="flex justify-center mt-4 space-x-2">
              <div className="w-3 h-1 bg-emerald-500 rounded-full"></div>
              <div className="w-8 h-1 bg-teal-500 rounded-full"></div>
              <div className="w-3 h-1 bg-blue-500 rounded-full"></div>
            </div>
          </div>

          {/* Scientific Profile Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 relative">
            {/* DNA sequence header */}
            <div className="h-4 bg-gradient-to-r from-emerald-500 via-teal-500 via-blue-500 to-cyan-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>

            {/* Lab-themed content */}
            <div className="p-8 space-y-8 relative">
              {/* Scientific background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 right-4 w-20 h-20">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="25" cy="25" r="8" fill="#059669" />
                    <circle cx="75" cy="25" r="8" fill="#0891b2" />
                    <circle cx="25" cy="75" r="8" fill="#0891b2" />
                    <circle cx="75" cy="75" r="8" fill="#059669" />
                    <path
                      d="M25,25 L75,75 M75,25 L25,75"
                      stroke="#059669"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              </div>

              {/* Patient Information Fields */}
              {['fullName', 'email', 'phone'].map((field, index) => {
                const labels: Record<
                  string,
                  {
                    icon: React.ReactNode;
                    label: string;
                    type?: string;
                    gradient: string;
                    bgColor: string;
                  }
                > = {
                  fullName: {
                    icon: <User className="w-5 h-5 text-emerald-600" />,
                    label: 'Họ và tên',
                    gradient: 'from-emerald-500 to-teal-500',
                    bgColor: 'bg-emerald-50',
                  },
                  email: {
                    icon: <Mail className="w-5 h-5 text-blue-600" />,
                    label: 'Email liên hệ',
                    type: 'email',
                    gradient: 'from-blue-500 to-cyan-500',
                    bgColor: 'bg-blue-50',
                  },
                  phone: {
                    icon: <Phone className="w-5 h-5 text-teal-600" />,
                    label: 'Số điện thoại',
                    gradient: 'from-teal-500 to-emerald-500',
                    bgColor: 'bg-teal-50',
                  },
                };

                return (
                  <div
                    key={field}
                    className="relative group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${labels[field].bgColor} border border-gray-200/50`}
                      >
                        {labels[field].icon}
                      </div>
                      <div>
                        <div className="text-gray-800">
                          {labels[field].label}
                        </div>
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        name={field}
                        type={labels[field].type || 'text'}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        value={(updateUser as any)[field]}
                        onChange={handleInput}
                        readOnly={editableField !== field}
                        onClick={() => setEditableField(field)}
                        onBlur={() => setEditableField(null)}
                        className={`w-full px-5 py-4 rounded-2xl border-2 transition-all duration-500 font-medium bg-white/80 ${
                          editableField === field
                            ? `border-emerald-400 ${labels[field].bgColor} focus:outline-none focus:ring-4 focus:ring-emerald-200 shadow-lg transform scale-105`
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:bg-white'
                        }`}
                        placeholder={`Nhập ${labels[
                          field
                        ].label.toLowerCase()}`}
                      />
                      {editableField !== field && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-all duration-300 group-hover:scale-110" />
                          <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      )}
                      {editableField === field && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Lab Action Buttons */}
              <div className="flex flex-col gap-4 pt-6">
                <button
                  type="submit"
                  onClick={handleSave}
                  className="group relative w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 text-white py-4 px-8 rounded-3xl font-bold hover:from-emerald-600 hover:via-teal-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                  <Save className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">Cập nhật thông tin</span>
                  <FileText className="w-5 h-5 relative z-10 opacity-70" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/change-pass')}
                  className="group relative w-full bg-white/90 backdrop-blur-sm text-emerald-700 py-4 px-8 rounded-3xl font-bold border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transform hover:scale-105"
                >
                  <Key className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Đổi mật khẩu bảo mật</span>
                  <Shield className="w-5 h-5 opacity-70" />
                </button>
              </div>

              {/* Lab Info Notice */}
              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-3">
                  <TestTube className="w-5 h-5 text-emerald-600" />
                  <div className="text-sm text-emerald-800">
                    <div className="font-semibold">Thông tin bảo mật cao</div>
                    <div className="text-emerald-600">
                      Dữ liệu cá nhân được bảo vệ theo tiêu chuẩn y tế quốc tế
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lab Instructions */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full border border-emerald-100 shadow-lg">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span className="text-sm font-medium text-gray-700">
                  Nhấp vào trường thông tin để chỉnh sửa
                </span>
              </div>
              <Microscope className="w-4 h-4 text-teal-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
