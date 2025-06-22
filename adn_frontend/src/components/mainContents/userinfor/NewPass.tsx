import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import CustomSnackBar from "./Snackbar";
import Swal from "sweetalert2";
import bg from "../../../image/Login_banner.png";
import logo from "../../../image/Logo.png";
import { motion } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';

type Severity = "success" | "error";

const NewPass = ({ email }: { email: string }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: Severity;
  }>({
    open: false,
    message: "",
    severity: "error"
  });
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setSnackbar({
        open: true,
        message: "Mật khẩu xác nhận không khớp",
        severity: "error"
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/otp/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      if (!res.ok) throw new Error("Không thể đặt lại mật khẩu");

      await Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đổi mật khẩu thành công",
        timer: 2000,
        showConfirmButton: false
      });
      navigate("/login");
    } catch (err) {
      setSnackbar({
        open: true,
        message: (err as Error).message,
        severity: "error"
      });
    } finally {
      setIsLoading(false);
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
              '&:hover': { opacity: 0.8 }
            }}
          >
            Trang chủ
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }}
          >
            Về chúng tôi
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
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
              letterSpacing: '1px'
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
            <img src={logo} alt="Logo" style={{ width: '70px', height: '70px' }} />
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
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
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
            backgroundColor: 'rgba(255, 255, 255, 0.85)',   // match Login
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <Box component="form" onSubmit={handleReset}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                color: '#2c3e50',     // same as Login title
                textAlign: 'center',
              }}
            >
              Đặt Lại Mật Khẩu
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#7f8c8d',     // same as Login subtitle
                textAlign: 'center',
                mb: 3,
              }}
            >
              Nhập mật khẩu mới để hoàn tất quá trình đặt lại
            </Typography>

            {/* New Password */}
            <TextField
              placeholder="Mật khẩu mới"
              type="password"
              fullWidth
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  height: 56,
                  borderRadius: '25px',
                  backgroundColor: '#eaf4ff',   // light blue like Login inputs
                  border: 'none',
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: '2px solid #667eea' },
                },
                '& input': { color: '#2c3e50' },
              }}
            />

            {/* Confirm Password */}
            <TextField
              placeholder="Xác nhận mật khẩu"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              variant="outlined"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  height: 56,
                  borderRadius: '25px',
                  backgroundColor: '#eaf4ff',
                  border: 'none',
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: '2px solid #667eea' },
                },
                '& input': { color: '#2c3e50' },
              }}
            />

            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              sx={{
                py: 1.5,
                borderRadius: '25px',
                background: 'linear-gradient(135deg,rgb(124, 142, 235) 0%,hsl(270, 67.20%, 74.90%) 100%)',
                textTransform: 'none',
                fontSize: 16,
                fontWeight: 'bold',
                mb: 1,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
                },
              }}
            >
              {isLoading ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
            </Button>
          </Box>
        </Paper>

      </motion.div>

      <CustomSnackBar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default NewPass;