import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSnackBar from '../userinfor/Snackbar';
import { signUpStaffSchema } from '../userinfor/Validation';
import { ValidationError } from 'yup';
import Swal from 'sweetalert2';

type Manager = {
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

const SignUpManager = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const [manager, setManager] = useState<Manager>({
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
  useEffect(() => {
    setIsAdmin(localStorage.getItem('role') === 'ADMIN');
  }, []);

  const validateField = async (name: string, value: string) => {
    try {
      await signUpStaffSchema.validateAt(name, { ...manager, [name]: value });
      setError((prev) => ({ ...prev, [name]: '' }));
    } catch (err) {
      if (err instanceof ValidationError) {
        setError((prev) => ({ ...prev, [name]: err.message }));
        if (value === '') {
          setSnackbar({
            open: true,
            message: 'Vui lòng điền đầy đủ thông tin',
            severity: 'error',
          });
        } else if (name === 'phone') {
          setSnackbar({
            open: true,
            message: 'Vui lòng nhập số điện thoại hợp lệ',
            severity: 'error',
          });
        }
      }
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'phone' || name === 'idCard') {
      newValue = value.replace(/\D/g, '');
    }

    setManager((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    validateField(name, newValue);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const emptyFields = Object.entries(manager).filter(
      ([key, value]) => !value && key !== 'gender'
    );
    if (emptyFields.length > 0) {
      setSnackbar({
        open: true,
        message: 'Vui lòng điền đầy đủ thông tin',
        severity: 'error',
      });
      return;
    }

    try {
      await signUpStaffSchema.validate(manager, { abortEarly: false });
      setError({});
      setLoading(true);

      const token = localStorage.getItem('token');

      const response = await fetch(
        'http://localhost:8080/api/register/manager-account',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(manager),
        }
      );
      setLoading(false);
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
          let message = 'Đã xảy ra lỗi';
          if (response.status === 401) message = 'Không có quyền thực hiện';
          else if (response.status === 403) message = 'Truy cập bị từ chối';
          else if (response.status === 400) message = 'Dữ liệu không hợp lệ';

          setSnackbar({ open: true, message, severity: 'error' });
        }
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Đăng ký quản lý thành công!',
        showConfirmButton: false,
        timer: 1500,
      });

      setManager({
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
    } catch (err) {
      setLoading(false);
      if (err instanceof ValidationError) {
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
    }
  };

  const handleBack = () => {
    navigate('/admin/manager');
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-white ml-10">
      <div className="max-w-full">
        {/* Statistics Header */}
        <div className="bg-[#4162EB] rounded-lg p-6 mb-6 relative">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-white text-lg font-semibold">
              Quản lý Manager
            </h2>
          </div>
          {/* Breadcrumb */}
          <div className="flex items-center mb-6 text-blue-100">
            <span className="text-white font-medium">Admin</span>
            <span className="mx-2">›</span>
            <span>Danh sách dữ liệu</span>
            <span className="mx-2">›</span>
            <span>Manager</span>
          </div>
        </div>
        {/* Create Form - Collapsible */}
          <div className="bg-white border border-gray-200 rounded-lg mb-6 shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Thông tin quản lý
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
                    value={manager.fullName}
                    onChange={handleInput}
                    placeholder="Nhập họ và tên"
                  />
                  {error.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {error.fullName}
                    </p>
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
                    value={manager.idCard}
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
                    value={manager.email}
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
                    value={manager.username}
                    onChange={handleInput}
                    placeholder="Nhập tên đăng nhập"
                  />
                  {error.username && (
                    <p className="mt-1 text-sm text-red-600">
                      {error.username}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    name="password"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      error.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={manager.password}
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
                      error.confirmPassword
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    value={manager.confirmPassword}
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
                        checked={manager.gender === 'Male'}
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
                        checked={manager.gender === 'Female'}
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
                    value={manager.address}
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
                    value={manager.phone}
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
                    value={manager.dateOfBirth}
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
                    'Đăng ký quản lý'
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

export default SignUpManager;