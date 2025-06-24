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
import { fieldLabels, type Patient, type Price } from '../type/FillFormType';
import { Home, Person, Payment, LocationOn } from '@mui/icons-material';

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
            <Home sx={{ color: '#2196f3', fontSize: 32 }} />
            <Typography
              variant="h4"
              sx={{
                color: '#1976d2',
                fontWeight: 600,
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              Đặt Lịch Dịch Vụ Tại Nhà
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
            <TextField
              fullWidth
              label="Địa chỉ nhà"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập địa chỉ chi tiết"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#2196f3',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>Chọn Gói Giá</InputLabel>
                <Select
                  value={selectedPrice}
                  onChange={handlePriceChange}
                  input={<OutlinedInput label="Chọn Gói Giá" />}
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
                      {`${priceItem.price} - ${priceItem.time}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>Phương thức thanh toán</InputLabel>
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
                  <MenuItem value="VN_PAY">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Payment sx={{ fontSize: 20 }} />
                      VN PAY
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Paper>

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

        {/* Submit Section */}
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
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={isSubmitting}
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
            {isSubmitting ? 'Đang xử lý...' : 'Đăng Ký Dịch Vụ'}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default BookingAtHome;
