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
import bg from '../../image/bg5.png';
import logo from '../../image/Logo.png';
import { motion } from 'framer-motion';

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
        alignItems: 'center',
        justifyContent: 'flex-end',
        background: 'linear-gradient(to right, #74ebd5, #ACB6E5)',
        position: 'relative',
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '40%',
          height: '100%',
          opacity: 1,
        }}
      ></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <Paper
          elevation={20}
          sx={{
            width: 400,
            borderRadius: '16px',
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.25)', // tăng opacity
            backdropFilter: 'blur(16px)', // tăng blur
            WebkitBackdropFilter: 'blur(16px)', // hỗ trợ Safari
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            marginLeft: 'auto',
            paddingRight: '40px',
            boxSizing: 'border-box',
            marginRight: 10,
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              position: 'absolute',
              top: -20,
              right: 0,
              width: '100px',
              height: 'auto',
            }}
          />

          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                color: '#fff',
                textAlign: 'center',
              }}
            >
              Đăng Ký
            </Typography>

            <TextField
              fullWidth
              margin="normal"
              id="fullname"
              name="fullName"
              label="Họ và tên"
              value={info.fullName}
              onChange={handleInput}
              error={!!error.fullName}
              helperText={error.fullName}
            />

            <TextField
              fullWidth
              margin="normal"
              id="username"
              name="username"
              label="Tên đăng nhập"
              value={info.username}
              onChange={handleInput}
              error={!!error.username}
              helperText={error.username}
            />

            <TextField
              fullWidth
              margin="normal"
              id="email"
              name="email"
              label="Địa chỉ email"
              type="email"
              value={info.email}
              onChange={handleInput}
              error={!!error.email}
              helperText={error.email}
            />

            <TextField
              fullWidth
              margin="normal"
              id="password"
              name="password"
              label="Mật khẩu"
              type="password"
              aria-describedby="rulePass"
              value={info.password}
              onChange={handleInput}
              error={!!error.password}
              helperText={error.password}
            />

            <FormHelperText
              id="rulePass"
              sx={{ textAlign: 'left', color: '#fff' }}
              component="div"
            >
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>Có ít nhất 8 ký tự</li>
                <li>Có ít nhất 1 chữ thường và hoa</li>
                <li>Có ít nhất 1 ký tự đặc biệt</li>
                <li>Có ít nhất 1 chữ số</li>
              </ul>
            </FormHelperText>

            <TextField
              fullWidth
              margin="normal"
              id="confirmPassword"
              name="confirmPassword"
              label="Nhập lại mật khẩu"
              type="password"
              value={info.confirmPassword}
              onChange={handleInput}
              error={!!error.confirmPassword}
              helperText={error.confirmPassword}
            />

            <TextField
              fullWidth
              margin="normal"
              id="phone"
              name="phone"
              label="Số điện thoại"
              type="tel"
              value={info.phone}
              onChange={handleInput}
              error={!!error.phone}
              helperText={error.phone}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Đăng Ký
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#fff' }}>
                Bạn đã có tài khoản?{' '}
                <Link to="/login" style={{ color: '#fff' }}>
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
