import {
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  type SelectChangeEvent,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fieldLabels, type Patient, type Price } from '../type/FillFormType';
import { Label } from '@mui/icons-material';

const BookingAtHome = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [address, setAddress] = useState('');
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [price, setPrice] = useState<Price[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleInputPatientOne = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientOne((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputPatientTwo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientTwo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Kiểm tra token và auth
  useEffect(() => {
    setAuth(localStorage.getItem('role') === 'USER');
  });

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

  const handlePriceChange = (event: SelectChangeEvent<string>) => {
    const priceId = event.target.value;
    setSelectedPrice(priceId);
  };

  const handleSubmit = async () => {
    if (!serviceId) {
      toast.error('Service ID không hợp lệ');
      return;
    }

    if (!address.trim()) {
      toast.error('Vui lòng nhập địa chỉ');
      return;
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
        const errorText = await res.text();
        toast.error(errorText);
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

  if (!auth) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <p>Đang kiểm tra quyền truy cập...</p>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, mt: 10 }}>
      <h2>Đặt lịch dịch vụ</h2>
      <Label>Nhập địa chỉ nhà</Label>
      <TextField
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Nhập địa chỉ"
      />
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="slot-select-label">Chọn Giá</InputLabel>
          <Select
            labelId="slot-select-label"
            value={selectedPrice}
            onChange={handlePriceChange}
            input={<OutlinedInput label="Chọn Giá Dịch Vụ" />}
            sx={{ fontSize: '16px' }}
          >
            {price.map((price) => (
              <MenuItem key={price.priceId} value={price.priceId}>
                {`${price.price} : ${price.time}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="slot-select-label">
            Chọn phương thức thanh toán
          </InputLabel>
          <Select
            value={paymentMethod}
            labelId="slot-select-label"
            input={<OutlinedInput label="Chọn phương thức thanh toán" />}
            sx={{ fontSize: '16px' }}
            onChange={(e) => setPaymentMethod(e.target.value)} // <- đúng vị trí
          >
            <MenuItem value="VN_PAY">VN_PAY</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <div className="container mt-30">
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Người thứ nhất */}
            <div
              className="col-md-6"
              style={{
                backgroundColor: '#f0f8ff',
                border: '2px solid #0d6efd',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                marginBottom: '24px',
              }}
            >
              <h4
                style={{
                  color: '#0d6efd',
                  fontWeight: 'bold',
                  marginBottom: '24px',
                }}
              >
                🧍 Thông tin người thứ nhất
              </h4>
              {fieldLabels.map(({ name, label, type }) => (
                <div className="mb-3" key={`one-${name}`}>
                  <label
                    className="form-label"
                    style={{ color: '#495057', fontWeight: 600 }}
                  >
                    {label}
                  </label>
                  <input
                    type={type || 'text'}
                    name={name}
                    className="form-control"
                    style={{
                      border: '2px solid #0d6efd',
                      borderRadius: '8px',
                    }}
                    value={patientOne[name]}
                    onChange={handleInputPatientOne}
                  />
                </div>
              ))}

              {/* Gender radio */}
              <div className="mb-3">
                <label
                  className="form-label d-block"
                  style={{ fontWeight: 600, color: '#495057' }}
                >
                  Giới tính
                </label>
                {['Nam', 'Nữ'].map((gender) => (
                  <div
                    className="form-check form-check-inline"
                    key={`one-gender-${gender}`}
                    style={{ marginRight: '15px' }}
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id={`one-gender-${gender}`}
                      value={gender}
                      checked={patientOne.gender === gender}
                      onChange={handleInputPatientOne}
                      style={{ accentColor: '#0d6efd' }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`one-gender-${gender}`}
                      style={{ fontWeight: 500 }}
                    >
                      {gender}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Người thứ hai */}
            <div
              className="col-md-6"
              style={{
                backgroundColor: '#e8fff3',
                border: '2px solid #198754',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                marginBottom: '24px',
              }}
            >
              <h4
                style={{
                  color: '#198754',
                  fontWeight: 'bold',
                  marginBottom: '24px',
                }}
              >
                🧍‍♂️ Thông tin người thứ hai
              </h4>
              {fieldLabels.map(({ name, label, type }) => (
                <div className="mb-3" key={`two-${name}`}>
                  <label
                    className="form-label"
                    style={{ color: '#495057', fontWeight: 600 }}
                  >
                    {label}
                  </label>
                  <input
                    type={type || 'text'}
                    name={name}
                    className="form-control"
                    style={{
                      border: '2px solid #198754',
                      borderRadius: '8px',
                    }}
                    value={patientTwo[name]}
                    onChange={handleInputPatientTwo}
                  />
                </div>
              ))}

              {/* Gender radio */}
              <div className="mb-3">
                <label
                  className="form-label d-block"
                  style={{ fontWeight: 600, color: '#495057' }}
                >
                  Giới tính
                </label>
                {['Nam', 'Nữ'].map((gender) => (
                  <div
                    className="form-check form-check-inline"
                    key={`two-gender-${gender}`}
                    style={{ marginRight: '15px' }}
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender2"
                      id={`two-gender-${gender}`}
                      value={gender}
                      checked={patientTwo.gender === gender}
                      onChange={(e) =>
                        setPatientTwo((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                      style={{ accentColor: '#198754' }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`two-gender-${gender}`}
                      style={{ fontWeight: 500 }}
                    >
                      {gender}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
      {/* Action Buttons */}
      {
        <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ fontSize: '16px' }}
          >
            {isSubmitting ? 'Đang đăng ký...' : 'Đăng Ký Slot'}
          </Button>
        </Box>
      }
    </Box>
  );
};

export default BookingAtHome;
