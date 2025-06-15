
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import CustomSnackBar from "../mainContents/userinfor/Snackbar";
import SendOTP from "../mainContents/userinfor/SendOTP";
import EmailIcon from "@mui/icons-material/Email";
import styles from "./Forget.module.css";
import bg from "../../image/Login_banner.png";
import logo from "../../image/Logo.png";
import { motion } from "framer-motion";


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
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dark Overlay - lighter to show background better */}
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

        <div style={{ display: "flex", gap: "60px" }}>

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
            Home
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
          >
            About Us
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
          >
            Help
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
              rowGap: '60px',    // khoảng cách giữa các hàng
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
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Phone
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  +123-456-7890
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
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                  E-Mail
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  hello@genelink.com
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
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
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
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Address
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  123 Anywhere St., Any City
                </Typography>
              </div>
            </div>
          </div>
    

      {/* Forget Password Form */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          right: '120px',
          top: '30%',
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
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <Box component="form" onSubmit={handleSendEmail}>
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
              FORGET PASSWORD
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: '#7f8c8d',
                textAlign: 'center',
              }}
            >
              Enter your email to receive OTP code
            </Typography>

            <Box sx={{ mb: 3, position: 'relative' }}>
              <TextField
                placeholder="Email Address"
                type="email"
                fullWidth
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ color: '#bdc3c7', mr: 1 }} />
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

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={sending}
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
                '&:disabled': {
                  background:
                    'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
                },
              }}
              startIcon={sending && <div className={styles.spinner} />}
            >
              {sending ? 'Đang gửi...' : 'Gửi OTP'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                Remember your password?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Back to Login
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

export default Forget;
