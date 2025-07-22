/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ValidationError } from 'yup';
import Swal from 'sweetalert2';
import { signUpStaffSchema } from '../../userinfor/Validation';
import CustomSnackBar from '../../userinfor/Snackbar';

type Staff = {
  fullName: string;
  idCard: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender: 'Male' | 'Female';
  address: string;
  phone: string;
  dateOfBirth: string;
};

type ErrorResponse = {
  message: string;
  errors?: {
    username?: string;
    email?: string;
    phone?: string;
    idCard?: string;
  };
};

const SignUpCollector = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState<Staff>({
    fullName: '',
    idCard: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: 'Male',
    address: '',
    phone: '',
    dateOfBirth: '',
  });
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const validateField = async (name: string, value: any) => {
    try {
      await signUpStaffSchema.validateAt(name, { ...staff, [name]: value });
      setError((prev) => ({ ...prev, [name]: '' }));
    } catch (err) {
      if (err instanceof ValidationError) {
        if (value === '') {
          setSnackbar({
            open: true,
            message: 'Vui lòng điền đầy đủ thông tin',
            severity: 'error',
          });
          return;
        }

        if (name === 'phone') {
          setSnackbar({
            open: true,
            message: 'Vui lòng nhập số điện thoại',
            severity: 'error',
          });
          return;
        }

        setError((prev) => ({ ...prev, [name]: err.message }));
      }
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let newValue: any = value;

    if (name === 'phone' || name === 'idCard') {
      newValue = value.replace(/\D/g, '');
    }

    setStaff((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    validateField(name, newValue);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    const emptyFields = Object.entries(staff).filter(
      ([key, value]) => !value && key !== 'gender'
    );
    if (emptyFields.length > 0) {
      setSnackbar({
        open: true,
        message: 'Vui lòng điền đầy đủ thông tin',
        severity: 'error',
      });
      setLoading(false);
      return;
    }

    try {
      await signUpStaffSchema.validate(staff, { abortEarly: false });
      setError({});

      const token = localStorage.getItem('token');

      if (!token) {
        setSnackbar({
          open: true,
          message: 'Bạn cần đăng nhập để thực hiện chức năng này',
          severity: 'error',
        });
        setLoading(false);
        return;
      }

      const response = await fetch(
        'http://localhost:8080/api/register/staff-collector-account',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(staff),
        }
      );

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();

        if (errorData.errors) {
          const messages = [];
          if (errorData.errors.username)
            messages.push('Tên đăng nhập đã tồn tại');
          if (errorData.errors.email) messages.push('Email đã tồn tại');
          if (errorData.errors.phone) messages.push('Số điện thoại đã tồn tại');
          if (errorData.errors.idCard) messages.push('CCCD không hợp lệ');

          setSnackbar({
            open: true,
            message: messages.join(', '),
            severity: 'error',
          });
        } else {
          let errorMessage = 'Có lỗi xảy ra';
          if (response.status === 401)
            errorMessage = 'Bạn không có quyền thực hiện chức năng này';
          else if (response.status === 403)
            errorMessage = 'Truy cập bị từ chối';
          else if (response.status === 400)
            errorMessage = 'Dữ liệu không hợp lệ';

          setSnackbar({
            open: true,
            message: errorMessage,
            severity: 'error',
          });
        }
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Đăng ký nhân viên thành công!',
          showConfirmButton: false,
          timer: 1500,
        });

        setStaff({
          fullName: '',
          idCard: '',
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
          gender: 'Male',
          address: '',
          phone: '',
          dateOfBirth: '',
        });
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        setSnackbar({
          open: true,
          message: 'Vui lòng kiểm tra lại thông tin đã nhập',
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Không thể kết nối tới máy chủ',
          severity: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    navigate('/admin/collector');
  };

  return (
    <div className="min-h-screen bg-white ml-10">
      <div className="max-w-full">
        {/* Statistics Header */}
        <div className="bg-[#4162EB] rounded-lg p-6 mb-6 relative">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-white text-lg font-semibold">
              Quản lý Nhân viên thu mẫu
            </h2>
          </div>
          {/* Breadcrumb */}
          <div className="flex items-center mb-6 text-blue-100">
            <span className="text-white font-medium">Admin</span>
            <span className="mx-2">›</span>
            <span>Danh sách dữ liệu</span>
            <span className="mx-2">›</span>
            <span>Nhân viên thu mẫu</span>
          </div>
        </div>
        {/* Create Form - Collapsible */}

        <div className="bg-white border border-gray-200 rounded-lg mb-6 shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Thông tin nhân viên thu mẫu
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="fullName"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    error.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={staff.fullName}
                  onChange={handleInput}
                  placeholder="Nhập họ và tên"
                />
                {error.fullName && (
                  <p className="mt-1 text-sm text-red-600">{error.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CCCD
                </label>
                <input
                  type="text"
                  name="idCard"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    error.idCard ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={staff.idCard}
                  onChange={handleInput}
                  placeholder="Nhập CCCD"
                  maxLength={12}
                />
                {error.idCard && (
                  <p className="mt-1 text-sm text-red-600">{error.idCard}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    error.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={staff.email}
                  onChange={handleInput}
                  placeholder="Nhập địa chỉ email"
                />
                {error.email && (
                  <p className="mt-1 text-sm text-red-600">{error.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  name="username"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    error.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={staff.username}
                  onChange={handleInput}
                  placeholder="Nhập tên đăng nhập"
                />
                {error.username && (
                  <p className="mt-1 text-sm text-red-600">{error.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  value={staff.password}
                  onChange={handleInput}
                  placeholder="Nhập mật khẩu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhập lại mật khẩu
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    error.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={staff.confirmPassword}
                  onChange={handleInput}
                  placeholder="Nhập lại mật khẩu"
                />
                {error.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {error.confirmPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={staff.gender === 'Male'}
                      onChange={handleInput}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    Nam
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={staff.gender === 'Female'}
                      onChange={handleInput}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    Nữ
                  </label>
                </div>
                {error.gender && (
                  <p className="mt-1 text-sm text-red-600">{error.gender}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    error.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={staff.address}
                  onChange={handleInput}
                  placeholder="Nhập địa chỉ"
                />
                {error.address && (
                  <p className="mt-1 text-sm text-red-600">{error.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    error.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={staff.phone}
                  onChange={handleInput}
                  placeholder="Nhập số điện thoại"
                  maxLength={10}
                />
                {error.phone && (
                  <p className="mt-1 text-sm text-red-600">{error.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    error.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={staff.dateOfBirth}
                  onChange={handleInput}
                />
                {error.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">
                    {error.dateOfBirth}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleBack}
                type="button"
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Quay về
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  'Đăng Ký Nhân Viên'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <CustomSnackBar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
};

export default SignUpCollector;
