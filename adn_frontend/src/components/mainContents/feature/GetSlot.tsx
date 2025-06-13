import {
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  type SelectChangeEvent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type SlotInfo = {
  slotId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  slotStatus: string;
  roomName: string;
};

type Location = {
  locationId: string;
  addressLine: string;
  district: string;
  city: string;
};

type Price = {
  priceId: string;
  price: string;
  time: string;
};

type Patient = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  identityNumber: string;
  gender: string;
  relationship: string;
  birthCertificate: string;
};

const fieldLabels: { name: keyof Patient; label: string; type?: string }[] = [
  { name: 'fullName', label: 'Họ và tên' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Số điện thoại' },
  { name: 'address', label: 'Địa chỉ' },
  { name: 'dateOfBirth', label: 'Ngày sinh', type: 'date' },
  { name: 'identityNumber', label: 'CMND/CCCD' },
  { name: 'relationship', label: 'Mối quan hệ' },
  { name: 'birthCertificate', label: 'Giấy khai sinh (nếu có)' },
];

const GetSlot = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [price, setPrice] = useState<Price[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
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
  // Fetch all locations when component mounts
  const fetchLocations = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/location/get-all-location',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('Location response status:', res.status);

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
      console.log('Locations data:', data);
      setLocations(data);
    } catch (error) {
      console.error('Fetch locations error:', error);
      toast.error('Không thể lấy danh sách địa điểm');
    }
  };

  // Fetch slots for selected location
  const fetchSlots = async () => {
    setIsLoadingSlots(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/slot/get-all-slot-user`,
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any

      setSlots(data);
    } catch (error) {
      console.error('Fetch slots error:', error);
      toast.error('Không thể lấy danh sách slot');
      setSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const fetchPrice = async () => {
    setIsLoadingSlots(true);
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
      toast.error('Không thể lấy danh sách slot');
      setPrice([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleLocationChange = (event: SelectChangeEvent<string>) => {
    const locationId = event.target.value;
    setSelectedLocation(locationId);
    setSelectedSlot(''); // Reset selected slot when location changes

    if (locationId) {
      fetchSlots();
    } else {
      setSlots([]);
    }
  };

  const handleSlotChange = (event: SelectChangeEvent<string>) => {
    const slotId = event.target.value;
    setSelectedSlot(slotId);
  };

  const handlePriceChange = (event: SelectChangeEvent<string>) => {
    const priceId = event.target.value;
    setSelectedPrice(priceId);
  };

  const handleSubmit = async () => {
    if (!selectedLocation) {
      toast.warning('Vui lòng chọn một địa điểm');
      return;
    }

    if (!selectedSlot) {
      toast.warning('Vui lòng chọn một slot');
      return;
    }

    if (!serviceId) {
      toast.error('Service ID không hợp lệ');
      return;
    }

    setIsSubmitting(true);
    try {
      // Tạo request body theo format BE yêu cầu
      const requestBody = {
        appointmentRequest: {},
        paymentRequest: { paymentMethod },
        patientRequestList: [patientOne, patientTwo],
      };
      const res = await fetch(
        `http://localhost:8080/api/appointment/book-appointment/${serviceId}?slotId=${selectedSlot}&locationId=${selectedLocation}&priceId=${selectedPrice}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log('Submit response status:', res.status);

      if (res.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        localStorage.clear();
        navigate('/login');
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Submit error response:', errorText);
      } else {
        navigate('/checkBooking');
        toast.success('Đã đăng ký thành công');
        setSelectedSlot('');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Không thể đăng ký');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);
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
    <Box sx={{ p: 3 }}>
      <h2>Đặt lịch dịch vụ</h2>
      <p>Service ID: {serviceId}</p>

      {/* Location Selection */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="location-select-label">Chọn Địa Điểm</InputLabel>
          <Select
            labelId="location-select-label"
            value={selectedLocation}
            onChange={handleLocationChange}
            input={<OutlinedInput label="Chọn Địa Điểm" />}
            sx={{ fontSize: '16px' }}
          >
            <MenuItem value="">
              <em>-- Chọn địa điểm --</em>
            </MenuItem>
            {locations.map((location) => (
              <MenuItem key={location.locationId} value={location.locationId}>
                {`${location.addressLine}, ${location.district}, ${location.city}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Slot Selection */}

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="slot-select-label">Chọn Slot</InputLabel>
          <Select
            labelId="slot-select-label"
            value={selectedSlot}
            onChange={handleSlotChange}
            input={<OutlinedInput label="Chọn Slot" />}
            sx={{ fontSize: '16px' }}
            disabled={selectedLocation === ''}
          >
            <MenuItem value="">
              <em>
                {isLoadingSlots ? '-- Đang tải slot --' : '-- Chọn slot --'}
              </em>
            </MenuItem>
            {slots.map((slot) => (
              <MenuItem key={slot.slotId} value={slot.slotId}>
                {`${slot.slotDate} - ${slot.startTime} đến ${slot.endTime} `}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="slot-select-label">Chọn Giá</InputLabel>
          <Select
            labelId="slot-select-label"
            value={selectedPrice}
            onChange={handlePriceChange}
            input={<OutlinedInput label="Chọn Giá Dịch Vụ" />}
            sx={{ fontSize: '16px' }}
            disabled={selectedSlot === ''}
          >
            {price.map((price) => (
              <MenuItem key={price.priceId} value={price.priceId}>
                {`${price.price} - ${price.time}`}
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
            <MenuItem value="VN_PAY">VN_Pay</MenuItem>
            <MenuItem value="CASH">Tiền mặt</MenuItem>
            <MenuItem value="BANK_TRANSFER">Chuyển khoản</MenuItem>
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
            disabled={!selectedSlot || isSubmitting}
            sx={{ fontSize: '16px' }}
          >
            {isSubmitting ? 'Đang đăng ký...' : 'Đăng Ký Slot'}
          </Button>

          {selectedSlot && (
            <Button
              variant="outlined"
              onClick={() => setSelectedSlot('')}
              sx={{ fontSize: '16px' }}
            >
              Bỏ Chọn Slot
            </Button>
          )}

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setSelectedLocation('');
              setSelectedSlot('');
              setSlots([]);
            }}
            sx={{ fontSize: '16px' }}
          >
            Reset
          </Button>
        </Box>
      }

      {/* No slots message */}
      {selectedLocation && !isLoadingSlots && slots.length === 0 && (
        <Box sx={{ mt: 2, p: 2, textAlign: 'center', color: 'text.secondary' }}>
          Không có slot nào khả dụng cho địa điểm này
        </Box>
      )}
    </Box>
  );
};

export default GetSlot;
