import React, { useState } from 'react';
import { Eye, EyeOff, Shield, Lock, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

type OldPassWordProps = {
  role: 'USER' | 'STAFF' | 'MANAGER';
};

const OldPassWord = ({ role }: OldPassWordProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleVerifyOldPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword.trim()) {
      toast.error('❌ Vui lòng nhập mật khẩu cũ');
      return;
    }

    const apiMap = {
      USER: 'http://localhost:8080/api/user/change-password',
      STAFF: 'http://localhost:8080/api/staff/change-password',
      MANAGER: 'http://localhost:8080/api/manager/change-password',
    };

    try {
      // Verify old password by trying to change to same password
      const res = await fetch(apiMap[role], {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          oldPassword: oldPassword,
          newPassword: oldPassword // Same password to verify
        }),
      });

      if (res.status === 400) {
        toast.error('❌ Mật khẩu cũ không chính xác');
        return;
      }

      await Swal.fire({
        icon: 'success',
        title: 'Xác thực thành công',
        showConfirmButton: false,
        timer: 1500,
      });
      setStep(2);
    } catch (error) {
      console.log(error);
      toast.error('❌ Lỗi hệ thống');
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

    const apiMap = {
      USER: 'http://localhost:8080/api/user/change-password',
      STAFF: 'http://localhost:8080/api/staff/change-password',
      MANAGER: 'http://localhost:8080/api/manager/change-password',
    };

    try {
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

      await Swal.fire({
        icon: 'success',
        title: 'Đổi mật khẩu thành công!',
        showConfirmButton: false,
        timer: 2000,
      });

      // Reset form
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setStep(1);
    } catch (error) {
      console.error(error);
      toast.error('❌ Lỗi kết nối với hệ thống');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Step 1: Verify Old Password */}
      {step === 1 && (
        <>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Xác thực mật khẩu</h3>
            <p className="text-gray-600">Vui lòng nhập mật khẩu hiện tại để tiếp tục</p>
          </div>

          <form onSubmit={handleVerifyOldPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 text-gray-800 font-medium bg-white/80 hover:shadow-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              XÁC THỰC MẬT KHẨU
            </button>
          </form>
        </>
      )}

      {/* Step 2: Set New Password */}
      {step === 2 && (
        <>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Đặt mật khẩu mới</h3>
            <p className="text-gray-600">Tạo mật khẩu mới để bảo vệ tài khoản của bạn</p>
          </div>

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
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all duration-300 text-gray-800 font-medium bg-white/80 hover:shadow-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all duration-300 text-gray-800 font-medium bg-white/80 hover:shadow-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
                onClick={() => setStep(1)}
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
        </>
      )}
    </div>
  );
};

export default OldPassWord;
