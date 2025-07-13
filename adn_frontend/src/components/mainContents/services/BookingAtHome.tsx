/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fieldLabels, type Patient, type Price } from '../type/FillFormType';
import CustomSnackBar from '../userinfor/Snackbar';
import { book } from '../userinfor/Validation';

const BookingAtHome = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [address, setAddress] = useState<any>('');
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [price, setPrice] = useState<Price[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const relationshipOption = [
    'Con',
    'Ba',
    'Mẹ',
    'Ông',
    'Bà',
    'Cô',
    'Chú',
    'Cháu',
  ];
  const [patientOne, setPatientOne] = useState<Patient>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    identityNumber: '',
    gender: '',
    relationship: '',
    birthCertificate: '',
  });
  const payment = [
    { label: 'Ví cá nhân', value: 'WALLET' },
    { label: 'VNPay', value: 'VN_PAY' },
  ];

  const [patientTwo, setPatientTwo] = useState<Patient>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    identityNumber: '',
    gender: '',
    relationship: '',
    birthCertificate: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [patientOneErrors, setPatientOneErrors] = useState<{
    [key: string]: string;
  }>({});
  const [patientTwoErrors, setPatientTwoErrors] = useState<{
    [key: string]: string;
  }>({});
  const validateField = async (field: string, value: string, setError: any) => {
    if (!book.fields || !(book.fields as any)[field]) {
      setError((prev: any) => ({ ...prev, [field]: '' }));
      return;
    }
    try {
      await (book.fields as any)[field].validate(value);
      setError((prev: any) => ({ ...prev, [field]: '' }));
    } catch (err: any) {
      setError((prev: any) => ({ ...prev, [field]: err.message }));
    }
  };
  const handleInputPatientOne = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientOne((prev) => {
      const updated = { ...prev, [name]: value };
      validateField(name, value, setPatientOneErrors);
      return updated;
    });
  };

  const handleInputPatientTwo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientTwo((prev) => {
      const updated = { ...prev, [name]: value };
      validateField(name, value, setPatientTwoErrors);
      return updated;
    });
  };

  const fetchPrice = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/price/get-all-price/${serviceId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('Slots response status:', res.status);

      if (res.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        localStorage.clear();
        navigate('/login');
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      setPrice(data);
    } catch (error) {
      console.error('Fetch slots error:', error);
      toast.error('Không thể xem giá');
      setPrice([]);
    }
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const priceId = event.target.value;
    setSelectedPrice(priceId);
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
      if (updated.address) {
        setAddress(updated.address);
      }
    } catch (error) {
      console.error(error);
      toast.error('❌ Lỗi kết nối với hệ thống');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    return m < 0 || (m === 0 && today.getDate() < birthDate.getDate())
      ? age - 1
      : age;
  };
  const handleSubmit = async () => {
    const validatePatients = (): boolean => {
      const patients = [patientOne, patientTwo];
      for (let i = 0; i < patients.length; i++) {
        const p = patients[i];
        const age = calculateAge(p.dateOfBirth);
        if (age < 14 && !p.birthCertificate) {
          toast.warning(
            `Người thứ ${i + 1}: Trẻ dưới 14 tuổi phải có giấy khai sinh`
          );
          return false;
        }
        if (age >= 16 && !p.identityNumber) {
          toast.warning(
            `Người thứ ${i + 1}: Từ 16 tuổi trở lên phải có số CMND/CCCD`
          );
          return false;
        }
      }
      return true;
    };
    if (!serviceId) {
      toast.error('Service ID không hợp lệ');
      return;
    }

    if (!address.trim()) {
      toast.error('Vui lòng nhập địa chỉ');
      return;
    }
    if (!validatePatients()) {
      return; // Dừng submit nếu không hợp lệ
    }
    setIsSubmitting(true);

    try {
      // 1. Cập nhật địa chỉ trước
      const updateRes = await fetch(
        `http://localhost:8080/api/user/update-user`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ address }),
        }
      );

      if (!updateRes.ok) {
        throw new Error('Không thể cập nhật địa chỉ');
      }

      // 2. Gửi request đặt lịch
      const requestBody = {
        address,
        appointmentRequest: {},
        paymentRequest: { paymentMethod },
        patientRequestList: [patientOne, patientTwo],
      };

      const res = await fetch(
        `http://localhost:8080/api/appointment/book-appointment-at-home/${serviceId}?priceId=${selectedPrice}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!res.ok) {
        setSnackbar({
          open: true,
          message: 'Kiểm tra và điền đầy đủ thông tin',
          severity: 'error',
        });
      } else {
        toast.success('Đặt lịch thành công');
        navigate(`/u-profile`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Không thể đặt lịch');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchPrice();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pt-12 pb-4">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white shadow-sm p-6 mb-6 mt-15 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Đặt Lịch Dịch Vụ Tại Nhà
            </h1>
          </div>
        </div>

        {/* Service Configuration Section */}
        <div className="bg-white shadow-sm p-6 mb-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Thông Tin Dịch Vụ
          </h2>

          <div className="space-y-6">
            {/* Address Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ nhà
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Nhập địa chỉ chi tiết"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn Gói Giá
                </label>
                <select
                  value={selectedPrice}
                  onChange={handlePriceChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Chọn gói giá --</option>
                  {price.map((priceItem) => (
                    <option key={priceItem.priceId} value={priceItem.priceId}>
                      {`${priceItem.price} - ${priceItem.time}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức thanh toán
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Chọn phương thức --</option>
                  {payment.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Information Section */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          Thông Tin Bệnh Nhân
        </h2>

        <div className="space-y-6">
          {/* Patient One */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              Người Thứ Nhất
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {fieldLabels.map(({ name, label, type }) => (
                <div key={`one-${name}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <input
                    type={type || 'text'}
                    name={name}
                    value={patientOne[name]}
                    onChange={handleInputPatientOne}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      patientOneErrors[name]
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {patientOneErrors[name] && (
                    <p className="mt-1 text-sm text-red-600">
                      {patientOneErrors[name]}
                    </p>
                  )}
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mối quan hệ
                </label>
                <select
                  value={patientOne.relationship}
                  onChange={(e) =>
                    setPatientOne((prev) => ({
                      ...prev,
                      relationship: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Chọn mối quan hệ --</option>
                  {relationshipOption.map((relation) => (
                    <option key={relation} value={relation}>
                      {relation}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới tính
              </label>
              <div className="flex gap-4">
                {['Nam', 'Nữ'].map((gender) => (
                  <label
                    key={`one-gender-${gender}`}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={patientOne.gender === gender}
                      onChange={handleInputPatientOne}
                      className="mr-2 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{gender}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Patient Two */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              Người Thứ Hai
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {fieldLabels.map(({ name, label, type }) => (
                <div key={`two-${name}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <input
                    type={type || 'text'}
                    name={name}
                    value={patientTwo[name]}
                    onChange={handleInputPatientTwo}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      patientTwoErrors[name]
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {patientTwoErrors[name] && (
                    <p className="mt-1 text-sm text-red-600">
                      {patientTwoErrors[name]}
                    </p>
                  )}
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mối quan hệ
                </label>
                <select
                  value={patientTwo.relationship}
                  onChange={(e) =>
                    setPatientTwo((prev) => ({
                      ...prev,
                      relationship: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Chọn mối quan hệ --</option>
                  {relationshipOption.map((relation) => (
                    <option key={relation} value={relation}>
                      {relation}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới tính
              </label>
              <div className="flex gap-4">
                {['Nam', 'Nữ'].map((gender) => (
                  <label
                    key={`two-gender-${gender}`}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="gender2"
                      value={gender}
                      checked={patientTwo.gender === gender}
                      onChange={(e) =>
                        setPatientTwo((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                      className="mr-2 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{gender}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="bg-white shadow-sm p-6 mt-6 rounded-lg text-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-lg font-semibold text-lg ${
              isSubmitting
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đăng Ký Dịch Vụ'}
          </button>
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

export default BookingAtHome;
