import React, { useEffect, useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
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
      </div>
    </Box>
  );
};

export default NewProfile;