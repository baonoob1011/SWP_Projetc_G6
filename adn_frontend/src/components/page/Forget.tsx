import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import { useState } from 'react';
import CustomSnackBar from '../mainContents/userinfor/Snackbar';
import SendOTP from '../mainContents/userinfor/SendOTP';
import EmailIcon from '@mui/icons-material/Email';
import bg from '../../image/bg5.png';
import logo from '../../image/Logo.png';

const Forget = () => {
  const [email, setEmail] = useState('');
  const [show, setShow] = useState(false);
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('http://localhost:8080/api/otp/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        setSnackbar({
          open: true,
          message: 'Email không tồn tại',
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Gửi OTP thành công',
          severity: 'success',
        });
        setTimeout(() => setShow(true), 1500);
      }
    } catch (err) {
      console.log(err);
      setSnackbar({
        open: true,
        message: 'Lỗi mạng',
        severity: 'error',
      });
    } finally {
      setSending(false);
    }
  };

  if (show) {
    return <SendOTP email={email} />;
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'flex-end',
        background: 'linear-gradient(to right, #74ebd5, #ACB6E5)',
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '0 60px',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* Phần bên phải để trống hoặc animation nếu cần */}
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

      <Box>
        <Paper
          elevation={20}
          sx={{
            width: 400,
            borderRadius: '16px',
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
            height: '70vh',
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
              top: -0,
              right: 0,
              width: '100px', // chỉnh kích thước logo phù hợp
              height: 'auto',
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              color: '#fff',
              textAlign: 'center',
            }}
          >
            Quên Mật Khẩu
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#fff',
              textAlign: 'center',
              mb: 3,
            }}
          >
            Vui lòng nhập email để nhận mã xác thực (OTP)
          </Typography>

          <Box component="form" onSubmit={handleSendEmail}>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Địa chỉ Email"
                type="email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: 1,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={sending}
              sx={{
                mt: 1,
              }}
              startIcon={sending}
            >
              {sending ? 'Đang gửi...' : 'Gửi OTP'}
            </Button>
          </Box>

          <CustomSnackBar
            open={snackbar.open}
            message={snackbar.message}
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          />
        </Paper>
      </Box>
    </div>
  );
};

export default Forget;
