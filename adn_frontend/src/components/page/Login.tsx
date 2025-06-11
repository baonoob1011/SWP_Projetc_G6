import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import CustomSnackBar from '../mainContents/userinfor/Snackbar';
import bg from '../../image/bg5.png';
import logo from '../../image/Logo.png';
import './Login.module.css';
import { motion } from 'framer-motion';

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

  //    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //    const handleGoogleLoginSuccess = (fullName: string, token: string) => {
  //   setFullName(fullName);

  //   Swal.fire({
  //     icon: "success",
  //     title: "Đăng nhập Google thành công!",
  //     showConfirmButton: false,
  //     timer: 1300,
  //   });

  //   navigate("/");
  // };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'flex-end', // chia 2 bên
        background: 'linear-gradient(to right, #74ebd5, #ACB6E5)',
        position: 'relative',
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '0 60px', // thêm padding trái phải
        boxSizing: 'border-box',
      }}
    >
      {/* DNA Icons Container - Bên phải (trống, có thể thêm hình ảnh/animation) */}
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
        {/* Form Section */}
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
            height: '70vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative', // để làm vị trí tham chiếu cho logo
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
              top: -0,
              right: 0,
              width: '100px', // chỉnh kích thước logo phù hợp
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
              Đăng nhập
            </Typography>

            <TextField
              label="Tên đăng nhập"
              fullWidth
              margin="normal"
              name="username"
              value={user.username}
              onChange={handleInput}
              variant="outlined"
            />
            <TextField
              label="Mật khẩu"
              type="password"
              fullWidth
              margin="normal"
              name="password"
              value={user.password}
              onChange={handleInput}
              variant="outlined"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Đăng nhập
            </Button>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" align="center">
                <Link to="/forget" style={{ color: '#fff' }}>
                  Quên mật khẩu ?
                </Link>
              </Typography>
            </Box>

            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" align="center">
                Bạn chưa có tài khoản?{' '}
                <Link to="/signup" style={{ color: '#fff' }}>
                  Đăng ký
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
