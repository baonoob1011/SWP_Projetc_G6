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
  Paper,
  Typography,
  Container,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  fieldLabels,
  type Location,
  type Patient,
  type Price,
  type SlotInfo,
} from '../type/FillFormType';
import CustomSnackBar from '../userinfor/Snackbar';
import {
  Business,
  Person,
  Payment,
  Schedule,
  LocationOn,
  AttachMoney,
} from '@mui/icons-material';

const BookingAtCenter = () => {
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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
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
        let errorMessage = 'Không thể đăng ký'; // mặc định

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMessage = errorData.message || JSON.stringify(errorData);
        } else {
          errorMessage = await res.text();
        }

        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
      } else {
        navigate(`/`);
        toast.success('Đặt lịch thành công');
        setSelectedSlot('');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Không thể đặt lịch');
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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          backgroundColor: '#f8faff',
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: '#fff',
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" color="primary">
            Đang kiểm tra quyền truy cập...
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: '#f8faff',
        minHeight: '100vh',
        pt: 12,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={1}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: '#fff',
            borderRadius: 3,
            borderLeft: '4px solid #2196f3',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Business sx={{ color: '#2196f3', fontSize: 32 }} />
            <Typography
              variant="h4"
              sx={{
                color: '#1976d2',
                fontWeight: 600,
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              Đặt Lịch Dịch Vụ Tại Trung Tâm
            </Typography>
          </Box>
        </Paper>

        {/* Service Configuration Section */}
        <Paper
          elevation={1}
          sx={{
            p: 4,
            mb: 4,
            backgroundColor: '#fff',
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              color: '#1976d2',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <LocationOn /> Thông Tin Dịch Vụ
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Location Selection */}
            <FormControl fullWidth>
              <InputLabel>Chọn Địa Điểm</InputLabel>
              <Select
                value={selectedLocation}
                onChange={handleLocationChange}
                input={<OutlinedInput label="Chọn Địa Điểm" />}
                sx={{
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2196f3',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  },
                }}
              >
                <MenuItem value="">
                  <em>-- Chọn địa điểm --</em>
                </MenuItem>
                {locations.map((location) => (
                  <MenuItem
                    key={location.locationId}
                    value={location.locationId}
                  >
                    {`${location.addressLine}, ${location.district}, ${location.city}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {/* Slot Selection */}
              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule sx={{ fontSize: 20 }} />
                    Chọn Slot
                  </Box>
                </InputLabel>
                <Select
                  value={selectedSlot}
                  onChange={handleSlotChange}
                  input={<OutlinedInput label="Chọn Slot" />}
                  disabled={selectedLocation === ''}
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2196f3',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>
                      {isLoadingSlots
                        ? '-- Đang tải slot --'
                        : '-- Chọn slot --'}
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
              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoney sx={{ fontSize: 20 }} />
                    Chọn Giá
                  </Box>
                </InputLabel>
                <Select
                  value={selectedPrice}
                  onChange={handlePriceChange}
                  input={<OutlinedInput label="Chọn Giá" />}
                  disabled={selectedSlot === ''}
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2196f3',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                    },
                  }}
                >
                  {price.map((priceItem) => (
                    <MenuItem key={priceItem.priceId} value={priceItem.priceId}>
                      {`${priceItem.price} : ${priceItem.time}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Payment Method */}
              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Payment sx={{ fontSize: 20 }} />
                    Phương thức thanh toán
                  </Box>
                </InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  input={<OutlinedInput label="Phương thức thanh toán" />}
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2196f3',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                    },
                  }}
                >
                  <MenuItem value="VN_PAY">VN PAY</MenuItem>
                  <MenuItem value="CASH">Tiền mặt</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* No slots message */}
            {selectedLocation && !isLoadingSlots && slots.length === 0 && (
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  backgroundColor: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  borderRadius: 2,
                }}
              >
                <Typography color="#856404">
                  Không có slot nào khả dụng cho địa điểm này
                </Typography>
              </Paper>
            )}
          </Box>
        </Paper>

        {/* Patient Information Section */}
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            color: '#1976d2',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Person /> Thông Tin Bệnh Nhân
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Patient One */}
          <Card
            elevation={2}
            sx={{
              backgroundColor: '#f0f8ff',
              border: '2px solid #e3f2fd',
              borderRadius: 3,
              '&:hover': {
                boxShadow: '0 8px 25px rgba(33, 150, 243, 0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#1976d2',
                  fontWeight: 600,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Person sx={{ fontSize: 24 }} />
                Người Thứ Nhất
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                {fieldLabels.map(({ name, label, type }) => (
                  <TextField
                    key={`one-${name}`}
                    size="small"
                    label={label}
                    type={type || 'text'}
                    name={name}
                    value={patientOne[name]}
                    onChange={handleInputPatientOne}
                    variant="outlined"
                    InputLabelProps={
                      type === 'date' ? { shrink: true } : undefined
                    }
                    sx={{
                      minWidth: '250px',
                      flex: '1 1 300px',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fff',
                        '&:hover fieldset': {
                          borderColor: '#2196f3',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2',
                        },
                      },
                    }}
                  />
                ))}
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Giới tính
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {['Nam', 'Nữ'].map((gender) => (
                    <Box
                      key={`one-gender-${gender}`}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <input
                        type="radio"
                        name="gender"
                        id={`one-gender-${gender}`}
                        value={gender}
                        checked={patientOne.gender === gender}
                        onChange={handleInputPatientOne}
                        style={{
                          accentColor: '#1976d2',
                          marginRight: '8px',
                          transform: 'scale(1.2)',
                        }}
                      />
                      <Typography
                        component="label"
                        htmlFor={`one-gender-${gender}`}
                        sx={{ cursor: 'pointer', fontWeight: 500 }}
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
            elevation={2}
            sx={{
              backgroundColor: '#f0f8ff',
              border: '2px solid #e3f2fd',
              borderRadius: 3,
              '&:hover': {
                boxShadow: '0 8px 25px rgba(33, 150, 243, 0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#1976d2',
                  fontWeight: 600,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Person sx={{ fontSize: 24 }} />
                Người Thứ Hai
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                {fieldLabels.map(({ name, label, type }) => (
                  <TextField
                    key={`two-${name}`}
                    size="small"
                    label={label}
                    type={type || 'text'}
                    name={name}
                    value={patientTwo[name]}
                    onChange={handleInputPatientTwo}
                    variant="outlined"
                    InputLabelProps={
                      type === 'date' ? { shrink: true } : undefined
                    }
                    sx={{
                      minWidth: '250px',
                      flex: '1 1 300px',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fff',
                        '&:hover fieldset': {
                          borderColor: '#2196f3',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2',
                        },
                      },
                    }}
                  />
                ))}
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Giới tính
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {['Nam', 'Nữ'].map((gender) => (
                    <Box
                      key={`two-gender-${gender}`}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <input
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
                        style={{
                          accentColor: '#1976d2',
                          marginRight: '8px',
                          transform: 'scale(1.2)',
                        }}
                      />
                      <Typography
                        component="label"
                        htmlFor={`two-gender-${gender}`}
                        sx={{ cursor: 'pointer', fontWeight: 500 }}
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

        {/* Action Buttons Section */}
        <Paper
          elevation={1}
          sx={{
            p: 4,
            mt: 4,
            backgroundColor: '#fff',
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <Divider sx={{ mb: 3 }} />
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!selectedSlot || isSubmitting}
              sx={{
                backgroundColor: '#1976d2',
                fontSize: '18px',
                fontWeight: 600,
                px: 6,
                py: 2,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  backgroundColor: '#1565c0',
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {isSubmitting ? 'Đang đăng ký...' : 'Đăng Ký Slot'}
            </Button>
          </Box>
        </Paper>
      </Container>

      <CustomSnackBar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default BookingAtCenter;
