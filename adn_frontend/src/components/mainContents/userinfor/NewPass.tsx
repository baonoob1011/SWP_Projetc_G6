import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomSnackBar from "./Snackbar";
import Swal from "sweetalert2";
import bg from "../../../image/bg5.png";
import logo from "../../../image/Logo.png";
import { motion } from "framer-motion";

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
    (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "flex-end",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "0 60px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* Logo hoặc trang trí bên phải nếu muốn */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "40%",
            height: "100%",
            opacity: 1,
          }}
        ></div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <Paper
            elevation={20}
            sx={{
              width: 400,
              borderRadius: "16px",
              p: 4,
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.3)",
              height: "70vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
              marginLeft: "auto",
              paddingRight: "40px",
              boxSizing: "border-box",
              marginRight: 10,
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "100px",
                height: "auto",
              }}
            />

            <Box component="form" onSubmit={handleReset}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                Đặt Lại Mật Khẩu
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#fff",
                  textAlign: "center",
                  mb: 3,
                }}
              >
                Nhập mật khẩu mới để hoàn tất quá trình đặt lại
              </Typography>

              <TextField
                label="Mật khẩu mới"
                type="password"
                fullWidth
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                variant="outlined"
                required
              />
              <TextField
                label="Xác nhận mật khẩu"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="outlined"
                required
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đổi Mật Khẩu"}
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
    )
  );
};

export default NewPass;