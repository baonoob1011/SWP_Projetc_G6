/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import CustomSnackBar from '../mainContents/userinfor/Snackbar';
import bg from '../../image/Login_banner.png';
import logo from '../../image/Logo.png';

import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { GoogleLogin } from '@react-oauth/google';

type UserInfo = {
  username: string;
  password: string;
};

type LoginProps = {
  setFullName: React.Dispatch<React.SetStateAction<string>>;
};

const Login = ({ setFullName }: LoginProps) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserInfo>({
    username: '',
    password: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const TimeLeftLogout = (exp: number) => {
    const now = Date.now() / 1000;
    const timeleft = (exp - now) * 1000;
    if (timeleft > 0) {
      setTimeout(() => {
        toast.error('Hết thời gian đăng nhập');
        localStorage.clear();
        setFullName('');
        navigate('/login');
      }, timeleft);
    }
  };
  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;

      const response = await fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        toast.error('Đăng nhập Google thất bại');
        return;
      }

      const data = await response.json();
      const token = data.token;

      const decoded: {
        sub: string;
        exp: number;
        fullName: string;
        role: string;
      } = jwtDecode(token);

      localStorage.setItem('token', token);
      localStorage.setItem('username', decoded.sub);
      localStorage.setItem('fullName', decoded.fullName);
      localStorage.setItem('role', decoded.role);

      setFullName(decoded.fullName);
      TimeLeftLogout(decoded.exp);

      Swal.fire({
        icon: 'success',
        title: 'Đăng nhập bằng Google thành công!',
        showConfirmButton: false,
        timer: 1300,
      });

      setTimeout(() => navigate('/'), 1500);
    } catch (error: any) {
      console.error('Google login error:', error);
      Swal.fire('Lỗi!', 'Không thể đăng nhập bằng Google', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        setSnackbar({
          open: true,
          message: 'Sai tên đăng nhập hoặc mật khẩu',
          severity: 'error',
        });
      } else {
        const data = await response.json();
        const token = data.result.token;

        try {
          const decoded: {
            sub: string;
            exp: number;
            fullName: string;
            role: string;
          } = jwtDecode(token);

          localStorage.setItem('token', token);
          localStorage.setItem('username', decoded.sub);
          localStorage.setItem('fullName', decoded.fullName);
          localStorage.setItem('role', decoded.role);

          setFullName(decoded.fullName);
          TimeLeftLogout(decoded.exp);

          Swal.fire({
            icon: 'success',
            title: 'Đăng nhập thành công!',
            showConfirmButton: false,
            timer: 1300,
          });

          setTimeout(() => navigate('/'), 1500);
        } catch {
          Swal.fire({
            icon: 'error',
            title: 'Token không hợp lệ!',
            text: 'Vui lòng thử lại hoặc liên hệ quản trị viên',
          });
        }
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi hệ thống!',
        text: 'Không thể kết nối tới máy chủ',
      });
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
          background: 'rgba(0, 0, 0,0.1)',
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

      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          right: '120px',
          top: '20%',
          transform: 'translateY(-50%)',
          zIndex: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '400px',
            borderRadius: '20px',
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
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
              ĐĂNG NHẬP
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: '#7f8c8d',
                textAlign: 'center',
              }}
            >
              Đăng nhập vào tài khoản của bạn
            </Typography>

            <Box sx={{ mb: 3, position: 'relative' }}>
              <TextField
                placeholder="Tên đăng nhập"
                fullWidth
                name="username"
                value={user.username}
                onChange={handleInput}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ color: '#bdc3c7', mr: 1 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    backgroundColor: '#f8f9fa',
                    border: 'none',
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: '2px solid #667eea',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3, position: 'relative' }}>
              <TextField
                placeholder="Mật khẩu"
                type="password"
                fullWidth
                name="password"
                value={user.password}
                onChange={handleInput}
                variant="outlined"
                InputProps={{
                  startAdornment: <LockIcon sx={{ color: '#bdc3c7', mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    backgroundColor: '#f8f9fa',
                    border: 'none',
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: '2px solid #667eea',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3, textAlign: 'right' }}>
              <Link
                to="/forget"
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontSize: '14px',
                }}
              >
                Quên mật khẩu?
              </Link>
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
              Đăng nhập
            </Button>
            <Box sx={{ mb: 2 }}>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => toast.error('Đăng nhập Google thất bại')}
                width="100%"
              />
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                Chưa có tài khoản?{' '}
                <Link
                  to="/signup"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Đăng ký ngay
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

export default Login;
