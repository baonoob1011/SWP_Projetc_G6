import { useState } from 'react';
import '../mainContents/userinfor/mainContent.css';
import { signUpSchema } from '../mainContents/userinfor/Validation';
import { ValidationError } from 'yup';
import {
  Box,
  Button,
  FormHelperText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CustomSnackBar from '../mainContents/userinfor/Snackbar';
import bg from '../../image/Login_banner.png';
import logo from '../../image/Logo.png';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';

type Info = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
};

type ErrorResponse = {
  message: string;
  errors?: {
    username?: string;
    email?: string;
    phone?: string;
  };
};

const SignUp = () => {
  const [info, setInfo] = useState<Info>({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [error, setError] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const validateField = async (name: string, value: string) => {
    try {
      await signUpSchema.validateAt(name, { ...info, [name]: value });
      setError((prev) => ({ ...prev, [name]: '' }));
    } catch (err) {
      if (err instanceof ValidationError) {
        setError((prev) => ({ ...prev, [name]: err.message }));
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'phone') {
      newValue = value.replace(/\D/g, '');
    }

    setInfo((prev) => ({ ...prev, [name]: newValue }));
    validateField(name, newValue);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validate form bằng Yup
      await signUpSchema.validate(info, { abortEarly: false });
      setError({}); // Clear lỗi frontend

      const response = await fetch(
        'http://localhost:8080/api/register/user-account',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(info),
        }
      );

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();

        // Nếu server trả về lỗi từng field
        if (errorData.errors) {
          const newServerErrors: { [key: string]: string } = {};

          // Xử lý tất cả các lỗi cùng lúc thay vì dừng ở lỗi đầu tiên
          if (errorData.errors.username) {
            newServerErrors.username = 'Tên đăng nhập đã tồn tại';
          }
          if (errorData.errors.email) {
            newServerErrors.email = 'Email đã tồn tại';
          }
          if (errorData.errors.phone) {
            newServerErrors.phone = 'Số điện thoại đã tồn tại';
          }

          // Hiển thị tất cả lỗi lên các field cùng lúc
          setError((prev) => ({ ...prev, ...newServerErrors }));

          // Không return ở đây để tránh dừng xử lý
          // return; // <- Xóa dòng này
        } else {
          // Nếu không phải lỗi cụ thể
          setSnackbar({
            open: true,
            message: errorData.message || 'Đã xảy ra lỗi',
            severity: 'error',
          });
        }
        return; // Chỉ return ở đây sau khi đã xử lý hết tất cả lỗi
      }

      // Nếu thành công
      Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công!',
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      // Lỗi Yup (validation frontend)
      if (error instanceof ValidationError) {
        const yupErrors: { [key: string]: string } = {};
        error.inner.forEach((err) => {
          if (err.path) {
            yupErrors[err.path] = err.message;
          }
        });
        setError(yupErrors);
      } else {
        // Lỗi mạng
        setSnackbar({
          open: true,
          message: 'Không thể kết nối tới máy chủ',
          severity: 'error',
        });
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dark Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.1)',
          zIndex: 1,
        }}
      />

      {/* Navigation */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '100px' }}>
          <Typography
            variant="body1"
            component={Link}
            to="/"
            sx={{
              color: 'white',
              cursor: 'pointer',
              textDecoration: 'none',
              '&:hover': { opacity: 0.8 },
            }}
          >
            Trang chủ
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
          >
            Về chúng tôi
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
          >
            Trợ giúp
          </Typography>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              letterSpacing: '1px',
            }}
          >
            GENELINK
          </Typography>
          <div
            style={{
              width: '70px',
              height: '70px',
              backgroundColor: 'white',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ width: '70px', height: '70px' }}
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '60px',
          zIndex: 3,
          display: 'grid',
          gridTemplateColumns: 'auto auto',
          columnGap: '200px', // khoảng cách giữa 2 cột
          rowGap: '60px', // khoảng cách giữa các hàng
        }}
      >
        {/** Hàng 1, Cột 1: Phone **/}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'white', fontSize: 16 }}>📞</Typography>
          </div>
          <div>
            <Typography
              variant="body2"
              sx={{ color: 'white', fontWeight: 'bold' }}
            >
              Số điện thoại
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              0943.283.195
            </Typography>
          </div>
        </div>

        {/** Hàng 1, Cột 2: E-Mail **/}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'white', fontSize: 16 }}>✉️</Typography>
          </div>
          <div>
            <Typography
              variant="body2"
              sx={{ color: 'white', fontWeight: 'bold' }}
            >
              E-Mail
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              genlink.fpt.vn@gmail.com
            </Typography>
          </div>
        </div>

        {/** Hàng 2, Cột 1: Website **/}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'white', fontSize: 16 }}>🌐</Typography>
          </div>
          <div>
            <Typography
              variant="body2"
              sx={{ color: 'white', fontWeight: 'bold' }}
            >
              Website
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              www.genelink.com
            </Typography>
          </div>
        </div>

        {/** Hàng 2, Cột 2: Address **/}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'white', fontSize: 16 }}>📍</Typography>
          </div>
          <div>
            <Typography
              variant="body2"
              sx={{ color: 'white', fontWeight: 'bold' }}
            >
              Địa chỉ
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            22/14 Đ. Phan Văn Hớn, Tân Thới Nhất, Quận 12, Hồ Chí Minh
            </Typography>
          </div>
        </div>
      </div>

      {/* SignUp Form */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          right: '150px',
          top: '10%',
          transform: 'translateY(-50%)',
          zIndex: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '450px',
            borderRadius: '20px',
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.85)', // nền trắng mờ giống Login
            border: 'none', // bỏ viền
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                color: '#2c3e50',
                textAlign: 'center',
                letterSpacing: '2px',
              }}
            >
              ĐĂNG KÝ
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 3,
                color: '#7f8c8d',
                textAlign: 'center',
              }}
            >
              Tạo tài khoản của bạn
            </Typography>

            {/* Full Name */}
            <Box sx={{ mb: 2, position: 'relative' }}>
              <TextField
                placeholder="Họ và tên"
                fullWidth
                name="fullName"
                value={info.fullName}
                onChange={handleInput}
                error={!!error.fullName}
                helperText={error.fullName}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <BadgeIcon sx={{ color: '#b0b8c8', mr: 1 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    height: 56,
                    backgroundColor: '#eaf4ff', // xanh nhạt như Login
                    border: 'none',
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': {
                      border: '2px solid #667eea',
                    },
                  },
                  '& input': { color: '#2c3e50' },
                  '& .MuiFormHelperText-root': { color: '#7f8c8d' },
                }}
              />
            </Box>

            {/* Username */}
            <Box sx={{ mb: 2, position: 'relative' }}>
              <TextField
                placeholder="Tên đăng nhập"
                fullWidth
                name="username"
                value={info.username}
                onChange={handleInput}
                error={!!error.username}
                helperText={error.username}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ color: '#b0b8c8', mr: 1 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    height: 56,
                    backgroundColor: '#eaf4ff',
                    border: 'none',
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': {
                      border: '2px solid #667eea',
                    },
                  },
                  '& input': { color: '#2c3e50' },
                  '& .MuiFormHelperText-root': { color: '#7f8c8d' },
                }}
              />
            </Box>

            {/* Email */}
            <Box sx={{ mb: 2, position: 'relative' }}>
              <TextField
                placeholder="Email"
                fullWidth
                name="email"
                type="email"
                value={info.email}
                onChange={handleInput}
                error={!!error.email}
                helperText={error.email}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ color: '#b0b8c8', mr: 1 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    height: 56,
                    backgroundColor: '#eaf4ff',
                    border: 'none',
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': {
                      border: '2px solid #667eea',
                    },
                  },
                  '& input': { color: '#2c3e50' },
                  '& .MuiFormHelperText-root': { color: '#7f8c8d' },
                }}
              />
            </Box>

            {/* Phone */}
            <Box sx={{ mb: 2, position: 'relative' }}>
              <TextField
                placeholder="Số điện thoại"
                fullWidth
                name="phone"
                type="tel"
                value={info.phone}
                onChange={handleInput}
                error={!!error.phone}
                helperText={error.phone}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <PhoneIcon sx={{ color: '#b0b8c8', mr: 1 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    height: 56,
                    backgroundColor: '#eaf4ff',
                    border: 'none',
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': {
                      border: '2px solid #667eea',
                    },
                  },
                  '& input': { color: '#2c3e50' },
                  '& .MuiFormHelperText-root': { color: '#7f8c8d' },
                }}
              />
            </Box>

            {/* Password */}
            <Box sx={{ mb: 1, position: 'relative' }}>
              <TextField
                placeholder="Mật khẩu"
                type="password"
                fullWidth
                name="password"
                value={info.password}
                onChange={handleInput}
                error={!!error.password}
                helperText={error.password}
                variant="outlined"
                InputProps={{
                  startAdornment: <LockIcon sx={{ color: '#b0b8c8', mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    height: 56,
                    backgroundColor: '#eaf4ff',
                    border: 'none',
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': {
                      border: '2px solid #667eea',
                    },
                  },
                  '& input': { color: '#2c3e50' },
                  '& .MuiFormHelperText-root': { color: '#7f8c8d' },
                }}
              />
            </Box>

            {/* Password Rules */}
            <FormHelperText
              sx={{
                textAlign: 'left',
                color: '#7f8c8d',
                fontSize: '12px',
                mb: 2,
                ml: 1,
              }}
              component="div"
            >
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                <li>Có ít nhất 8 ký tự</li>
                <li>Có ít nhất 1 chữ thường và hoa</li>
                <li>Có ít nhất 1 ký tự đặc biệt</li>
                <li>Có ít nhất 1 chữ số</li>
              </ul>
            </FormHelperText>

            {/* Confirm Password */}
            <Box sx={{ mb: 3, position: 'relative' }}>
              <TextField
                placeholder="Nhập lại mật khẩu"
                type="password"
                fullWidth
                name="confirmPassword"
                value={info.confirmPassword}
                onChange={handleInput}
                error={!!error.confirmPassword}
                helperText={error.confirmPassword}
                variant="outlined"
                InputProps={{
                  startAdornment: <LockIcon sx={{ color: '#b0b8c8', mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    height: 56,
                    backgroundColor: '#eaf4ff',
                    border: 'none',
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': {
                      border: '2px solid #667eea',
                    },
                  },
                  '& input': { color: '#2c3e50' },
                  '& .MuiFormHelperText-root': { color: '#7f8c8d' },
                }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: '25px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                mb: 3,
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              Đăng ký
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                Đã có tài khoản?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Đăng nhập
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </motion.div>

      <CustomSnackBar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
};

export default SignUp;
