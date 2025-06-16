import {
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Paper,
  Typography,
  Divider,
  Card,
  CardContent,
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
      toast.error('Không thể xem giá');
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
        navigate(`/checkBooking`);
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
      <Box 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          backgroundColor: '#f0f9ff',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="h6" color="primary">
          Đang kiểm tra quyền truy cập...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: '#f0f9ff', 
      minHeight: '100vh',
      py: 4
    }}>
      <Box sx={{ 
        maxWidth: '1400px', 
        mx: 'auto', 
        px: 3 ,
        mt: 10,
      }}>
        {/* Header */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            mb: 4, 
            backgroundColor: '#ffffff',
            borderRadius: 3,
            border: '1px solid #e0f2fe'
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              color: '#0277bd',
              fontWeight: 600,
              mb: 2,
              textAlign: 'center'
            }}
          >
            Đặt lịch dịch vụ y tế
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
<<<<<<< Updated upstream
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
=======
            Mã dịch vụ: <strong>{serviceId}</strong>
          </Typography>
        </Paper>
>>>>>>> Stashed changes

        {/* Booking Configuration */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            mb: 4,
            backgroundColor: '#ffffff',
            borderRadius: 3,
            border: '1px solid #e0f2fe'
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#0277bd',
              fontWeight: 600,
              mb: 3,
              pb: 1,
              borderBottom: '2px solid #b3e5fc'
            }}
          >
            Thông tin đặt lịch
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Location Selection */}
            <FormControl fullWidth>
              <InputLabel 
                id="location-select-label"
                sx={{ color: '#0277bd', fontWeight: 500 }}
              >
                Chọn Địa Điểm
              </InputLabel>
              <Select
                labelId="location-select-label"
                value={selectedLocation}
                onChange={handleLocationChange}
                input={<OutlinedInput label="Chọn Địa Điểm" />}
                sx={{ 
                  fontSize: '16px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#81d4fa',
                    borderWidth: '2px'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0277bd'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0277bd'
                  }
                }}
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

            {/* Slot Selection */}
            <FormControl fullWidth>
              <InputLabel 
                id="slot-select-label"
                sx={{ color: '#0277bd', fontWeight: 500 }}
              >
                Chọn Slot
              </InputLabel>
              <Select
                labelId="slot-select-label"
                value={selectedSlot}
                onChange={handleSlotChange}
                input={<OutlinedInput label="Chọn Slot" />}
                sx={{ 
                  fontSize: '16px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#81d4fa',
                    borderWidth: '2px'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0277bd'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0277bd'
                  }
                }}
                disabled={selectedLocation === ''}
              >
                <MenuItem value="">
                  <em>
                    {isLoadingSlots ? '-- Đang tải slot --' : '-- Chọn slot --'}
                  </em>
                </MenuItem>
                {slots.map((slot) => (
                  <MenuItem key={slot.slotId} value={slot.slotId}>
                    {`${slot.slotDate} - ${slot.startTime} đến ${slot.endTime}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Price Selection */}
            <FormControl fullWidth>
              <InputLabel 
                id="price-select-label"
                sx={{ color: '#0277bd', fontWeight: 500 }}
              >
                Chọn Giá
              </InputLabel>
              <Select
                labelId="price-select-label"
                value={selectedPrice}
                onChange={handlePriceChange}
                input={<OutlinedInput label="Chọn Giá Dịch Vụ" />}
                sx={{ 
                  fontSize: '16px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#81d4fa',
                    borderWidth: '2px'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0277bd'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0277bd'
                  }
                }}
                disabled={selectedSlot === ''}
              >
                {price.map((price) => (
                  <MenuItem key={price.priceId} value={price.priceId}>
                    {`${price.price} : ${price.time}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Payment Method */}
            <FormControl fullWidth>
              <InputLabel 
                id="payment-select-label"
                sx={{ color: '#0277bd', fontWeight: 500 }}
              >
                Chọn phương thức thanh toán
              </InputLabel>
              <Select
                value={paymentMethod}
                labelId="payment-select-label"
                input={<OutlinedInput label="Chọn phương thức thanh toán" />}
                sx={{ 
                  fontSize: '16px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#81d4fa',
                    borderWidth: '2px'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0277bd'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0277bd'
                  }
                }}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <MenuItem value="VN_PAY">VN_Pay</MenuItem>
                <MenuItem value="CASH">Tiền mặt</MenuItem>
                <MenuItem value="BANK_TRANSFER">Chuyển khoản</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Patient Information */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
          {/* Patient One */}
          <Card 
            elevation={3}
            sx={{ 
              flex: 1,
              backgroundColor: '#ffffff',
              border: '2px solid #b3e5fc',
              borderRadius: 3
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#0277bd',
                  fontWeight: 600,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                👤 Thông tin người thứ nhất
              </Typography>
              
              {fieldLabels.map(({ name, label, type }) => (
                <Box key={`one-${name}`} sx={{ mb: 2.5 }}>
                  <Typography 
                    component="label" 
                    sx={{ 
                      display: 'block',
                      mb: 1,
                      color: '#37474f', 
                      fontWeight: 500,
                      fontSize: '14px'
                    }}
                  >
                    {label}
                  </Typography>
                  <Box
                    component="input"
                    type={type || 'text'}
                    name={name}
                    value={patientOne[name]}
                    onChange={handleInputPatientOne}
                    sx={{
                      width: '100%',
                      p: 1.5,
                      border: '2px solid #b3e5fc',
                      borderRadius: 2,
                      fontSize: '16px',
                      '&:focus': {
                        outline: 'none',
                        borderColor: '#0277bd',
                        boxShadow: '0 0 0 2px rgba(2, 119, 189, 0.1)'
                      },
                      '&:hover': {
                        borderColor: '#4fc3f7'
                      }
                    }}
                  />
                </Box>
              ))}

              {/* Gender Selection */}
              <Box sx={{ mb: 2 }}>
                <Typography 
                  component="label" 
                  sx={{ 
                    display: 'block',
                    mb: 1.5,
                    color: '#37474f', 
                    fontWeight: 500,
                    fontSize: '14px'
                  }}
                >
                  Giới tính
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {['Nam', 'Nữ'].map((gender) => (
                    <Box 
                      key={`one-gender-${gender}`}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Box
                        component="input"
                        type="radio"
                        name="gender"
                        id={`one-gender-${gender}`}
                        value={gender}
                        checked={patientOne.gender === gender}
                        onChange={handleInputPatientOne}
                        sx={{ 
                          mr: 1,
                          accentColor: '#0277bd'
                        }}
                      />
                      <Typography 
                        component="label" 
                        htmlFor={`one-gender-${gender}`}
                        sx={{ 
                          fontWeight: 500,
                          cursor: 'pointer',
                          color: '#37474f'
                        }}
                      >
                        {gender}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Patient Two */}
          <Card 
            elevation={3}
            sx={{ 
              flex: 1,
              backgroundColor: '#ffffff',
              border: '2px solid #a5d6a7',
              borderRadius: 3
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#2e7d32',
                  fontWeight: 600,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                👥 Thông tin người thứ hai
              </Typography>
              
              {fieldLabels.map(({ name, label, type }) => (
                <Box key={`two-${name}`} sx={{ mb: 2.5 }}>
                  <Typography 
                    component="label" 
                    sx={{ 
                      display: 'block',
                      mb: 1,
                      color: '#37474f', 
                      fontWeight: 500,
                      fontSize: '14px'
                    }}
                  >
                    {label}
                  </Typography>
                  <Box
                    component="input"
                    type={type || 'text'}
                    name={name}
                    value={patientTwo[name]}
                    onChange={handleInputPatientTwo}
                    sx={{
                      width: '100%',
                      p: 1.5,
                      border: '2px solid #a5d6a7',
                      borderRadius: 2,
                      fontSize: '16px',
                      '&:focus': {
                        outline: 'none',
                        borderColor: '#2e7d32',
                        boxShadow: '0 0 0 2px rgba(46, 125, 50, 0.1)'
                      },
                      '&:hover': {
                        borderColor: '#66bb6a'
                      }
                    }}
                  />
                </Box>
              ))}

              {/* Gender Selection */}
              <Box sx={{ mb: 2 }}>
                <Typography 
                  component="label" 
                  sx={{ 
                    display: 'block',
                    mb: 1.5,
                    color: '#37474f', 
                    fontWeight: 500,
                    fontSize: '14px'
                  }}
                >
                  Giới tính
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {['Nam', 'Nữ'].map((gender) => (
                    <Box 
                      key={`two-gender-${gender}`}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Box
                        component="input"
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
                        sx={{ 
                          mr: 1,
                          accentColor: '#2e7d32'
                        }}
                      />
                      <Typography 
                        component="label" 
                        htmlFor={`two-gender-${gender}`}
                        sx={{ 
                          fontWeight: 500,
                          cursor: 'pointer',
                          color: '#37474f'
                        }}
                      >
                        {gender}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Action Buttons */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4,
            backgroundColor: '#ffffff',
            borderRadius: 3,
            border: '1px solid #e0f2fe'
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!selectedSlot || isSubmitting}
              sx={{ 
                fontSize: '16px',
                px: 4,
                py: 1.5,
                backgroundColor: '#0277bd',
                '&:hover': {
                  backgroundColor: '#01579b'
                },
                '&:disabled': {
                  backgroundColor: '#b0bec5'
                },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {isSubmitting ? 'Đang đăng ký...' : 'Đăng Ký Slot'}
            </Button>

            {selectedSlot && (
              <Button
                variant="outlined"
                onClick={() => setSelectedSlot('')}
                sx={{ 
                  fontSize: '16px',
                  px: 4,
                  py: 1.5,
                  borderColor: '#0277bd',
                  color: '#0277bd',
                  '&:hover': {
                    borderColor: '#01579b',
                    backgroundColor: '#e3f2fd'
                  },
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Bỏ Chọn Slot
              </Button>
            )}

            <Button
              variant="outlined"
              onClick={() => {
                setSelectedLocation('');
                setSelectedSlot('');
                setSlots([]);
              }}
              sx={{ 
                fontSize: '16px',
                px: 4,
                py: 1.5,
                borderColor: '#757575',
                color: '#757575',
                '&:hover': {
                  borderColor: '#424242',
                  backgroundColor: '#f5f5f5'
                },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Reset
            </Button>
          </Box>
        </Paper>

        {/* No slots message */}
        {selectedLocation && !isLoadingSlots && slots.length === 0 && (
          <Box sx={{ 
            mt: 3, 
            p: 3, 
            textAlign: 'center', 
            backgroundColor: '#fff3e0',
            borderRadius: 2,
            border: '1px solid #ffcc02'
          }}>
            <Typography variant="body1" color="#e65100">
              Không có slot nào khả dụng cho địa điểm này
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default GetSlot;