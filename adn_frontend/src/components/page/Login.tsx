<<<<<<< Updated upstream
import { Box, Button, Paper, TextField, Typography, IconButton } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import CustomSnackBar from "../mainContents/userinfor/Snackbar";
import logo from "../../image/Logo.png";
import "./Login.module.css";
import { motion } from "framer-motion";
import HomeIcon from '@mui/icons-material/Home';
=======
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import CustomSnackBar from '../mainContents/userinfor/Snackbar';
import bg from '../../image/bg6.png';
import logo from '../../image/Logo.png';
import './Login.module.css';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
>>>>>>> Stashed changes

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
    username: "",
    password: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
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
        toast.error("Hết thời gian đăng nhập");
        localStorage.clear();
        setFullName("");
        navigate("/login");
      }, timeleft);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        setSnackbar({
          open: true,
          message: "Sai tên đăng nhập hoặc mật khẩu",
          severity: "error",
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

          localStorage.setItem("token", token);
          localStorage.setItem("username", decoded.sub);
          localStorage.setItem("fullName", decoded.fullName);
          localStorage.setItem("role", decoded.role);

          setFullName(decoded.fullName);
          TimeLeftLogout(decoded.exp);

          Swal.fire({
            icon: "success",
            title: "Đăng nhập thành công!",
            showConfirmButton: false,
            timer: 1300,
          });

          setTimeout(() => navigate("/"), 1500);
        } catch {
          Swal.fire({
            icon: "error",
            title: "Token không hợp lệ!",
            text: "Vui lòng thử lại hoặc liên hệ quản trị viên",
          });
        }
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Lỗi hệ thống!",
        text: "Không thể kết nối tới máy chủ",
      });
    }
  };

  return (
    <div
      style={{
<<<<<<< Updated upstream
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: `
          radial-gradient(ellipse at top left, rgba(135, 206, 235, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse at bottom right, rgba(173, 216, 230, 0.4) 0%, transparent 50%),
          radial-gradient(ellipse at center, rgba(176, 224, 230, 0.2) 0%, transparent 70%),
          linear-gradient(135deg, #e6f3ff 0%, #cce7ff 25%, #b3dbff 50%, #99cfff 75%, #80c3ff 100%)
        `,
        position: "relative",
        padding: "20px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Animated Background DNA Elements */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
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
          animation: "dnaRotate 20s linear infinite",
        }}
      />

      {/* DNA Helix Pattern */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "4px",
            height: "100vh",
            background: `linear-gradient(
              to bottom,
              rgba(135, 206, 235, 0.1) 0%,
              rgba(173, 216, 230, 0.2) 50%,
              rgba(135, 206, 235, 0.1) 100%
            )`,
            left: `${15 + i * 15}%`,
            transform: `rotate(${i * 30}deg)`,
            transformOrigin: "center",
            animation: `helixFloat ${8 + i}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      {/* Floating DNA Bases */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: `${6 + Math.random() * 4}px`,
            height: `${6 + Math.random() * 4}px`,
            background: `rgba(${135 + Math.random() * 40}, ${200 + Math.random() * 30}, ${230 + Math.random() * 25}, ${0.3 + Math.random() * 0.4})`,
            borderRadius: "50%",
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
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          width: 64,
          height: 64,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
          color: "#4682B4",
          zIndex: 1000,
          boxShadow: "0 8px 32px rgba(70, 130, 180, 0.25)",
          border: "1px solid rgba(135, 206, 235, 0.3)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 1)",
            transform: "scale(1.1) translateY(-2px)",
            boxShadow: "0 12px 40px rgba(70, 130, 180, 0.35)",
            color: "#1e3a8a",
          },
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
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
        {/* Main Login Container */}
        <Paper
          elevation={24}
          sx={{
            width: { xs: 380, sm: 460 },
            borderRadius: "24px",
            p: 6,
            background: `
              linear-gradient(145deg, 
                rgba(255, 255, 255, 0.98) 0%,
                rgba(248, 252, 255, 0.95) 50%,
                rgba(240, 248, 255, 0.92) 100%
              )
            `,
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            boxShadow: `
              0 32px 64px rgba(70, 130, 180, 0.12),
              0 16px 32px rgba(135, 206, 235, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.9),
              inset 0 -1px 0 rgba(135, 206, 235, 0.1)
            `,
            border: "1px solid rgba(135, 206, 235, 0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* DNA Logo Container */}
          <Box
            sx={{
              position: "absolute",
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
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "logoFloat 6s ease-in-out infinite",
            }}
          >
            <img
              src={logo}
              alt="DNA Logo"
              style={{
                width: "90px",
                height: "auto",
                filter: "drop-shadow(0 6px 20px rgba(70, 130, 180, 0.25))",
              }}
            />
          </Box>

          {/* Decorative DNA Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
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
              borderRadius: "24px",
            }}
          />

          <Box component="form" onSubmit={handleSubmit} sx={{ position: "relative", zIndex: 2 }}>
            {/* Enhanced Title */}
            <Box sx={{ textAlign: "center", mb: 5, mt: 4 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "800",
                  background: "linear-gradient(135deg, #4682B4 0%, #5B9BD5 25%, #87CEEB 50%, #ADD8E6 75%, #B0E0E6 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 4px 8px rgba(70, 130, 180, 0.15)",
                  mb: 2,
                  letterSpacing: "2px",
                  fontSize: { xs: "2.5rem", sm: "3rem" },
                }}
              >
                🧬 LOGIN
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#4682B4",
                  fontWeight: 500,
                  letterSpacing: "1.5px",
                  opacity: 0.9,
                  mb: 2,
                }}
              >
                Hệ thống xét nghiệm ADN
              </Typography>
              <Box
                sx={{
                  width: "100px",
                  height: "4px",
                  background: "linear-gradient(90deg, #4682B4, #87CEEB, #ADD8E6)",
                  margin: "16px auto",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(70, 130, 180, 0.3)",
                }}
              />
            </Box>

            {/* Beautiful Input Fields */}
            <TextField
              label="🔬 Tên đăng nhập"
              fullWidth
              margin="normal"
              name="username"
              value={user.username}
              onChange={handleInput}
              variant="outlined"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(135, 206, 235, 0.03)",
                  borderRadius: "16px",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  "& fieldset": {
                    borderColor: "rgba(70, 130, 180, 0.25)",
                    borderWidth: "2px",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(70, 130, 180, 0.4)",
                    boxShadow: "0 0 0 4px rgba(135, 206, 235, 0.1)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4682B4",
                    borderWidth: "2px",
                    boxShadow: "0 0 0 4px rgba(135, 206, 235, 0.15)",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "rgba(135, 206, 235, 0.06)",
                    transform: "translateY(-2px)",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#4682B4",
                  fontWeight: 600,
                  "&.Mui-focused": {
                    color: "#1e3a8a",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  color: "#1e3a8a",
                  fontWeight: 500,
                  fontSize: "1.1rem",
                },
              }}
            />

            <TextField
              label="🔐 Mật khẩu"
              type="password"
              fullWidth
              margin="normal"
              name="password"
              value={user.password}
              onChange={handleInput}
              variant="outlined"
              sx={{
                mb: 4,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(135, 206, 235, 0.03)",
                  borderRadius: "16px",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  "& fieldset": {
                    borderColor: "rgba(70, 130, 180, 0.25)",
                    borderWidth: "2px",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(70, 130, 180, 0.4)",
                    boxShadow: "0 0 0 4px rgba(135, 206, 235, 0.1)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4682B4",
                    borderWidth: "2px",
                    boxShadow: "0 0 0 4px rgba(135, 206, 235, 0.15)",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "rgba(135, 206, 235, 0.06)",
                    transform: "translateY(-2px)",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#4682B4",
                  fontWeight: 600,
                  "&.Mui-focused": {
                    color: "#1e3a8a",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  color: "#1e3a8a",
                  fontWeight: 500,
                  fontSize: "1.1rem",
                },
              }}
            />
=======
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
        <div style={{ display: 'flex', gap: '30px' }}>
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
            Home
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }}
          >
            About Us
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
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
          bottom: '40px',
          left: '40px',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'white', fontSize: '16px' }}>📞</Typography>
          </div>
          <div>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
              Phone
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              +123-456-7890
            </Typography>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'white', fontSize: '16px' }}>🌐</Typography>
          </div>
          <div>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
              Website
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              www.genelink.com
            </Typography>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'white', fontSize: '16px' }}>✉️</Typography>
          </div>
          <div>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
              E-Mail
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              hello@genelink.com
            </Typography>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'white', fontSize: '16px' }}>📍</Typography>
          </div>
          <div>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
              Address
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              123 Anywhere St., Any City
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
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
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
              LOGIN
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: '#7f8c8d',
                textAlign: 'center',
              }}
            >
              Sign in to your account
            </Typography>

            <Box sx={{ mb: 3, position: 'relative' }}>
              <TextField
                placeholder="Username"
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
                placeholder="Password"
                type="password"
                fullWidth
                name="password"
                value={user.password}
                onChange={handleInput}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <LockIcon sx={{ color: '#bdc3c7', mr: 1 }} />
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

            <Box sx={{ mb: 3, textAlign: 'right' }}>
              <Link
                to="/forget"
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontSize: '14px',
                }}
              >
                Forgot password?
              </Link>
            </Box>
>>>>>>> Stashed changes

            {/* Premium Login Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
<<<<<<< Updated upstream
                py: 2.5,
                borderRadius: "16px",
                background: "linear-gradient(135deg, #4682B4 0%, #5B9BD5 25%, #6CB4EE 50%, #87CEEB 75%, #ADD8E6 100%)",
                boxShadow: "0 12px 32px rgba(70, 130, 180, 0.25)",
                fontSize: "1.2rem",
                fontWeight: "700",
                textTransform: "none",
                letterSpacing: "1px",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                "&:hover": {
                  background: "linear-gradient(135deg, #36648B 0%, #4682B4 25%, #5B9BD5 50%, #6CB4EE 75%, #87CEEB 100%)",
                  transform: "translateY(-3px)",
                  boxShadow: "0 16px 40px rgba(70, 130, 180, 0.35)",
                },
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              🧬 Đăng nhập 🧬
            </Button>

            {/* Elegant Links */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                <Link 
                  to="/forget" 
                  style={{ 
                    color: "#4682B4",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    borderBottom: "2px solid transparent",
                    transition: "all 0.3s ease",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    background: "rgba(135, 206, 235, 0.05)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = "#1e3a8a";
                    e.currentTarget.style.backgroundColor = "rgba(135, 206, 235, 0.12)";
                    e.currentTarget.style.borderBottomColor = "#4682B4";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = "#4682B4";
                    e.currentTarget.style.backgroundColor = "rgba(135, 206, 235, 0.05)";
                    e.currentTarget.style.borderBottomColor = "transparent";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  🔒 Quên mật khẩu?
                </Link>
              </Typography>

              <Box
                sx={{
                  width: "90%",
                  height: "2px",
                  background: "linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.4), rgba(173, 216, 230, 0.6), rgba(135, 206, 235, 0.4), transparent)",
                  margin: "20px auto",
                  borderRadius: "2px",
                }}
              />

              <Typography variant="body1" sx={{ color: "#4682B4", fontWeight: 500, fontSize: "1rem" }}>
                Bạn chưa có tài khoản?{" "}
                <Link 
                  to="/signup" 
                  style={{ 
                    color: "#1e3a8a",
                    textDecoration: "none",
                    fontWeight: 700,
                    borderBottom: "2px solid transparent",
                    transition: "all 0.3s ease",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, rgba(135, 206, 235, 0.08), rgba(173, 216, 230, 0.05))",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = "#0f172a";
                    e.currentTarget.style.backgroundColor = "rgba(135, 206, 235, 0.15)";
                    e.currentTarget.style.borderBottomColor = "#1e3a8a";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(70, 130, 180, 0.2)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = "#1e3a8a";
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(135, 206, 235, 0.08), rgba(173, 216, 230, 0.05))";
                    e.currentTarget.style.borderBottomColor = "transparent";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  🧪 Đăng ký ngay
=======
                py: 1.5,
                borderRadius: '25px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                mb: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              Login
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Sign up now
>>>>>>> Stashed changes
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

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes dnaFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.4;
          }
          25% { 
            transform: translateY(-20px) translateX(10px) rotate(90deg);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-15px) translateX(-5px) rotate(180deg);
            opacity: 0.6;
          }
          75% { 
            transform: translateY(-25px) translateX(8px) rotate(270deg);
            opacity: 0.9;
          }
        }
        
        @keyframes helixFloat {
          0% { transform: translateY(0px) rotateZ(0deg) scaleY(1); opacity: 0.3; }
          50% { transform: translateY(-15px) rotateZ(180deg) scaleY(1.1); opacity: 0.6; }
          100% { transform: translateY(-10px) rotateZ(360deg) scaleY(0.95); opacity: 0.4; }
        }

        @keyframes dnaRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes logoFloat {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          50% { 
            transform: translateY(-8px) rotate(5deg) scale(1.05);
          }
        }
        
        /* Custom scrollbar for DNA theme */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(135, 206, 235, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #4682B4, #87CEEB);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #36648B, #4682B4);
        }
      `}</style>
    </div>
  );
};

export default Login;