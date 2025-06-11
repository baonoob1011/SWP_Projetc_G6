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
  IconButton,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CustomSnackBar from '../mainContents/userinfor/Snackbar';
import logo from '../../image/Logo.png';
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';

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

  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signUpSchema.validate(info, { abortEarly: false });
      setError({});

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

        if (errorData.errors) {
          const newServerErrors: { [key: string]: string } = {};

          if (errorData.errors.username) {
            newServerErrors.username = 'Tên đăng nhập đã tồn tại';
          }
          if (errorData.errors.email) {
            newServerErrors.email = 'Email đã tồn tại';
          }
          if (errorData.errors.phone) {
            newServerErrors.phone = 'Số điện thoại đã tồn tại';
          }

          setError((prev) => ({ ...prev, ...newServerErrors }));
        } else {
          setSnackbar({
            open: true,
            message: errorData.message || 'Đã xảy ra lỗi',
            severity: 'error',
          });
        }
        return;
      }

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
      if (error instanceof ValidationError) {
        const yupErrors: { [key: string]: string } = {};
        error.inner.forEach((err) => {
          if (err.path) {
            yupErrors[err.path] = err.message;
          }
        });
        setError(yupErrors);
      } else {
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
        justifyContent: 'center',
        background: `
          radial-gradient(ellipse at top left, rgba(135, 206, 235, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse at bottom right, rgba(173, 216, 230, 0.4) 0%, transparent 50%),
          radial-gradient(ellipse at center, rgba(176, 224, 230, 0.2) 0%, transparent 70%),
          linear-gradient(135deg, #e6f3ff 0%, #cce7ff 25%, #b3dbff 50%, #99cfff 75%, #80c3ff 100%)
        `,
        position: 'relative',
        padding: '20px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background DNA Elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            repeating-linear-gradient(
              45deg,
              transparent 0px,
              rgba(135, 206, 235, 0.05) 20px,
              transparent 40px,
              rgba(173, 216, 230, 0.05) 60px,
              transparent 80px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent 0px,
              rgba(176, 224, 230, 0.03) 30px,
              transparent 60px
            )
          `,
          animation: 'dnaRotate 20s linear infinite',
        }}
      />

      {/* DNA Helix Pattern */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '4px',
            height: '100vh',
            background: `linear-gradient(
              to bottom,
              rgba(135, 206, 235, 0.1) 0%,
              rgba(173, 216, 230, 0.2) 50%,
              rgba(135, 206, 235, 0.1) 100%
            )`,
            left: `${15 + i * 15}%`,
            transform: `rotate(${i * 30}deg)`,
            transformOrigin: 'center',
            animation: `helixFloat ${8 + i}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      {/* Floating DNA Bases */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${6 + Math.random() * 4}px`,
            height: `${6 + Math.random() * 4}px`,
            background: `rgba(${135 + Math.random() * 40}, ${200 + Math.random() * 30}, ${230 + Math.random() * 25}, ${0.3 + Math.random() * 0.4})`,
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `dnaFloat ${6 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            boxShadow: `0 0 10px rgba(135, 206, 235, 0.3)`,
          }}
        />
      ))}

      {/* Home Button */}
      <IconButton
        onClick={() => navigate('/')}
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          width: 64,
          height: 64,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          color: '#4682B4',
          zIndex: 1000,
          boxShadow: '0 8px 32px rgba(70, 130, 180, 0.25)',
          border: '1px solid rgba(135, 206, 235, 0.3)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
            transform: 'scale(1.1) translateY(-2px)',
            boxShadow: '0 12px 40px rgba(70, 130, 180, 0.35)',
            color: '#1e3a8a',
          },
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <HomeIcon sx={{ fontSize: 36 }} />
      </IconButton>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -50 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        style={{ zIndex: 10 }}
      >
        {/* Main SignUp Container */}
        <Paper
          elevation={24}
          sx={{
            width: { xs: 420, sm: 500 },
            borderRadius: '24px',
            p: 5,
            background: `
              linear-gradient(145deg, 
                rgba(255, 255, 255, 0.98) 0%,
                rgba(248, 252, 255, 0.95) 50%,
                rgba(240, 248, 255, 0.92) 100%
              )
            `,
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            boxShadow: `
              0 32px 64px rgba(70, 130, 180, 0.12),
              0 16px 32px rgba(135, 206, 235, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.9),
              inset 0 -1px 0 rgba(135, 206, 235, 0.1)
            `,
            border: '1px solid rgba(135, 206, 235, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            maxHeight: '95vh',
            overflowY: 'auto',
          }}
        >
          {/* DNA Logo Container */}
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 140,
              height: 140,
              background: `
                radial-gradient(circle, 
                  rgba(135, 206, 235, 0.08) 0%,
                  rgba(173, 216, 230, 0.05) 40%,
                  transparent 70%
                )
              `,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'logoFloat 6s ease-in-out infinite',
            }}
          >
            <img
              src={logo}
              alt="DNA Logo"
              style={{
                width: '90px',
                height: 'auto',
                filter: 'drop-shadow(0 6px 20px rgba(70, 130, 180, 0.25))',
              }}
            />
          </Box>

          {/* Decorative DNA Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `
                repeating-linear-gradient(
                  135deg,
                  transparent 0px,
                  rgba(135, 206, 235, 0.02) 15px,
                  transparent 30px,
                  rgba(173, 216, 230, 0.02) 45px,
                  transparent 60px
                )
              `,
              borderRadius: '24px',
            }}
          />

          <Box component="form" onSubmit={handleSubmit} sx={{ position: 'relative', zIndex: 2 }}>
            {/* Enhanced Title */}
            <Box sx={{ textAlign: 'center', mb: 4, mt: 4 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #4682B4 0%, #5B9BD5 25%, #87CEEB 50%, #ADD8E6 75%, #B0E0E6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 4px 8px rgba(70, 130, 180, 0.15)',
                  mb: 2,
                  letterSpacing: '2px',
                  fontSize: { xs: '2.2rem', sm: '2.8rem' },
                }}
              >
                🧬 ĐĂNG KÝ
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#4682B4',
                  fontWeight: 500,
                  letterSpacing: '1.5px',
                  opacity: 0.9,
                  mb: 2,
                }}
              >
                Tạo tài khoản xét nghiệm ADN
              </Typography>
              <Box
                sx={{
                  width: '120px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #4682B4, #87CEEB, #ADD8E6)',
                  margin: '16px auto',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(70, 130, 180, 0.3)',
                }}
              />
            </Box>

            {/* Form Fields */}
            <TextField
              fullWidth
              margin="normal"
              name="fullName"
              label="👤 Họ và tên"
              value={info.fullName}
              onChange={handleInput}
              error={!!error.fullName}
              helperText={error.fullName}
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(135, 206, 235, 0.03)',
                  borderRadius: '16px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '& fieldset': {
                    borderColor: 'rgba(70, 130, 180, 0.25)',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(70, 130, 180, 0.4)',
                    boxShadow: '0 0 0 4px rgba(135, 206, 235, 0.1)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4682B4',
                    borderWidth: '2px',
                    boxShadow: '0 0 0 4px rgba(135, 206, 235, 0.15)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(135, 206, 235, 0.06)',
                    transform: 'translateY(-2px)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#4682B4',
                  fontWeight: 600,
                  '&.Mui-focused': {
                    color: '#1e3a8a',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: '#1e3a8a',
                  fontWeight: 500,
                },
              }}
            /></Box> 

            <TextField
              fullWidth
              margin="normal"
              name="username"
              label="🔬 Tên đăng nhập"
              value={info.username}
              onChange={handleInput}
              error={!!error.username}
              helperText={error.username}
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(135, 206, 235, 0.03)',
                  borderRadius: '16px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '& fieldset': {
                    borderColor: 'rgba(70, 130, 180, 0.25)',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(70, 130, 180, 0.4)',
                    boxShadow: '0 0 0 4px rgba(135, 206, 235, 0.1)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4682B4',
                    borderWidth: '2px',
                    boxShadow: '0 0 0 4px rgba(135, 206, 235, 0.15)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(135, 206, 235, 0.06)',
                    transform: 'translateY(-2px)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#4682B4',
                  fontWeight: 600,
                  '&.Mui-focused': {
                    color: '#1e3a8a',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: '#1e3a8a',
                  fontWeight: 500,
                },
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              name="email"
              label="📧 Địa chỉ email"
              type="email"
              value={info.email}
              onChange={handleInput}
              error={!!error.email}
              helperText={error.email}
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(135, 206, 235, 0.03)',
                  borderRadius: '16px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '& fieldset': {
                    borderColor: 'rgba(70, 130, 180, 0.25)',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(70, 130, 180, 0.4)',
                    boxShadow: '0 0 0 4px rgba(135, 206, 235, 0.1)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4682B4',
                    borderWidth: '2px',
                    boxShadow: '0 0 0 4px rgba(135, 206, 235, 0.15)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(135, 206, 235, 0.06)',
                    transform: 'translateY(-2px)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#4682B4',
                  fontWeight: 600,
                  '&.Mui-focused': {
                    color: '#1e3a8a',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: '#1e3a8a',
                  fontWeight: 500,
                },
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              name="password"
              label="🔐 Mật khẩu"
              type="password"
              aria-describedby="rulePass"
              value={info.password}
              onChange={handleInput}
              error={!!error.password}
              helperText={error.password}
              variant="outlined"
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(135, 206, 235, 0.03)',
                  borderRadius: '16px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '& fieldset': {
                    borderColor: 'rgba(70, 130, 180, 0.25)',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(70, 130, 180, 0.4)',
                    boxShadow: '0 0 0 4px rgba(135, 206, 235, 0.1)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4682B4',
                    borderWidth: '2px',
                    boxShadow: '0 0 0 4px rgba(135, 206, 235, 0.15)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(135, 206, 235, 0.06)',
                    transform: 'translateY(-2px)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#4682B4',
                  fontWeight: 600,
                  '&.Mui-focused': {
                    color: '#1e3a8a',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: '#1e3a8a',
                  fontWeight: 500,
                },
              }}
            />

            <FormHelperText
              id="rulePass"
              sx={{ 
                textAlign: 'left', 
                color: '#4682B4',
                backgroundColor: 'rgba(135, 206, 235, 0.05)',
                borderRadius: '12px',
                padding: '12px 16px',
                border: '1px solid rgba(135, 206, 235, 0.2)',
                mb: 2,
              }}
              component="div"
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#1e3a8a' }}>
                🔒 Yêu cầu mật khẩu:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20, color: '#4682B4' }}>
                <li>Có ít nhất 8 ký tự</li>
                <li>Có ít nhất 1 chữ thường và hoa</li>
                <li>Có ít nhất 1 ký tự đặc biệt</li>
                <li>Có ít nhất 1 chữ số</li>
              </ul>
            </FormHelperText>

            <TextField
              fullWidth
              margin="normal"
              name="confirmPassword"
              label="🔓 Nhập lại mật khẩu"
              type="password"
              value={info.confirmPassword}
              onChange={handleInput}
              error={!!error.confirmPassword}
              helperText={error.confirmPassword}
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(135, 206, 235, 0.03)',
                  borderRadius: '16px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '& fieldset': {
                    borderColor: 'rgba(70, 130, 180, 0.25)',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(70, 130, 180, 0.4)',
                    boxShadow: '0 0 0 4px rgba(135, 206, 235, 0.1)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4682B4',
                    borderWidth: '2px',
                    boxShadow: '0 0 0 4px rgba(135, 206, 235, 0.15)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(135, 206, 235, 0.06)',
                    transform: 'translateY(-2px)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#4682B4',
                  fontWeight: 600,
                  '&.Mui-focused': {
                    color: '#1e3a8a',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: '#1e3a8a',
                  fontWeight: 500,
                },
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              name="phone"
              label="📱 Số điện thoại"
              type="tel"
              value={info.phone}
              onChange={handleInput}
              error={!!error.phone}
              helperText={error.phone}
              variant="outlined"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(135, 206, 235, 0.03)',
                  borderRadius: '16px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '& fieldset': {
                    borderColor: 'rgba(70, 130, 180, 0.25)',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(70, 130, 180, 0.4)',
                    boxShadow: '0 0 0 4px rgba(135, 206, 235, 0.1)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4682B4',
                    borderWidth: '2px',
                    boxShadow: '0 0 0 4px rgba(135, 206, 235, 0.15)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(135, 206, 235, 0.06)',
                    transform: 'translateY(-2px)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#4682B4',
                  fontWeight: 600,
                  '&.Mui-focused': {
                    color: '#1e3a8a',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: '#1e3a8a',
                  fontWeight: 500,
                },
              }}
            />

            {/* Premium SignUp Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 2.5,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #4682B4 0%, #5B9BD5 25%, #6CB4EE 50%, #87CEEB 75%, #ADD8E6 100%)',
                boxShadow: '0 12px 32px rgba(70, 130, 180, 0.25)',
                fontSize: '1.2rem',
                fontWeight: '700',
                textTransform: 'none',
                letterSpacing: '1px',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #36648B 0%, #4682B4 25%, #5B9BD5 50%, #6CB4EE 75%, #87CEEB 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 16px 40px rgba(70, 130, 180, 0.35)',
                },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                mb: 3,
              }}
            >
              🧬 Tạo tài khoản 🧬
            </Button>

            {/* Elegant Links */}
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: '90%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.4), rgba(173, 216, 230, 0.6), rgba(135, 206, 235, 0.4), transparent)',
                  margin: '20px auto',
                  borderRadius: '2px',
                }}
              />

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#AAC7DF' }}>
                Bạn đã có tài khoản?{' '}
                <Link to="/login" style={{ color: '#AAC7DF' }}>
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
