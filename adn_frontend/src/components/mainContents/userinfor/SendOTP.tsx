import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import CountdownTimer from '../feature/CountDown';
import NewPass from './NewPass';
import CustomSnackBar from './Snackbar';
import styles from './SendOTP.module.css';
import bg from '../../../image/Login_banner.png';
import logo from '../../../image/Logo.png';
// import logo from "../../image/Logo.png";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SendOTP = ({ email }: { email: string }) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const res = await fetch('http://localhost:8080/api/otp/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      if (!res.ok) {
        setSnackbar({
          open: true,
          message: 'OTP không hợp lệ hoặc hết hạn',
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Xác thực thành công',
          severity: 'success',
        });
        setTimeout(() => {
          setVerified(true);
        }, 1500);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'lỗi hệ thống',
        severity: 'error',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOtp = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/otp/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        setSnackbar({
          open: true,
          message: 'Không thể gửi lại OTP',
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Gửi OTP thành công',
          severity: 'success',
        });
        setOtp('');
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: (err as Error).message,
        severity: 'error',
      });
    }
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    const visible = name.length <= 3 ? name[0] : name.slice(0, 3);
    return `${visible}${'*'.repeat(name.length - visible.length)}@${domain}`;
  };

  if (verified) return <NewPass email={email} />;

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

      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          right: '120px',
          top: '25%',
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
            backgroundColor: 'rgba(255, 255, 255, 0.85)', // match Login form
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              color: '#2c3e50', // same as Login title
              textAlign: 'center',
            }}
          >
            Xác thực OTP
          </Typography>

          <Typography
            sx={{
              color: '#7f8c8d', // same as Login subtitle
              textAlign: 'center',
              mb: 3,
            }}
          >
            Mã OTP đã gửi tới: {maskEmail(email)}
          </Typography>

          <form onSubmit={handleVerifyOtp}>
            <TextField
              fullWidth
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  height: 56,
                  borderRadius: '25px',
                  backgroundColor: '#eaf4ff', // light blue
                  border: 'none',
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': {
                    border: '2px solid #667eea',
                  },
                },
                '& input': { color: '#2c3e50' },
              }}
            />

            <Box
              mb={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <CountdownTimer
                duration={60000}
                onComplete={() => {}}
                onResend={resendOtp}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              disabled={isVerifying}
              sx={{
                py: 1.5,
                borderRadius: '25px',
                background:
                  'linear-gradient(135deg,hsl(229, 71.60%, 64.10%) 0%,#b786e8 100%)',
                textTransform: 'none',
                fontSize: 16,
                fontWeight: 'bold',
                mb: 1,
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
                '&:disabled': {
                  background:
                    'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
                },
              }}
            >
              {isVerifying ? (
                <div className={styles.spinner} />
              ) : (
                'Xác nhận OTP'
              )}
            </Button>
          </form>

          <CustomSnackBar
            open={snackbar.open}
            message={snackbar.message}
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          />
        </Paper>
      </motion.div>
    </div>
  );
};

export default SendOTP;
