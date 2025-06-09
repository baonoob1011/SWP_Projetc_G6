import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CountdownTimer from "../feature/CountDown";
import NewPass from "./NewPass";
import CustomSnackBar from "./Snackbar";
import styles from "./SendOTP.module.css";
import bg from "../../../image/bg5.png"
// import logo from "../../image/Logo.png";
import { motion } from "framer-motion";

const SendOTP = ({ email }: { email: string }) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const res = await fetch("http://localhost:8080/api/otp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      if (!res.ok) {
        setSnackbar({
          open: true,
          message: "OTP không hợp lệ hoặc hết hạn",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Xác thực thành công",
          severity: "success",
        });
        setTimeout(() => {
          setVerified(true);
        }, 1500);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setSnackbar({
        open: true,
        message: "lỗi hệ thống",
        severity: "error",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOtp = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) { alert("Không thể gửi lại OTP") } else {
        setSnackbar({
          open: true,
          message: "Gửi OTP thành công",
          severity: "success",
        });
        setOtp("");
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: (err as Error).message,
        severity: "error",
      });
    }
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    const visible = name.length <= 3 ? name[0] : name.slice(0, 3);
    return `${visible}${"*".repeat(name.length - visible.length)}@${domain}`;
  };

  if (verified) return <NewPass email={email} />;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "flex-end",
        background: "linear-gradient(to right, #74ebd5, #ACB6E5)",
        position: "relative",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "0 60px",
        boxSizing: "border-box",
      }}
    >
      {/* Bên phải để hình ảnh/animation nếu cần */}
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
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              mb: 2,
              color: "#fff",
              textAlign: "center",
            }}
          >
            Xác thực OTP
          </Typography>

          <Typography
            sx={{ color: "#fff", textAlign: "center", mb: 2 }}
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
              size="medium"
              InputLabelProps={{ shrink: false }}
              sx={{ backgroundColor: "#fff", borderRadius: 1, mb: 2 }}
            />

            <Box
              mb={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <CountdownTimer
                duration={60000}
                onComplete={() => { }}
                onResend={resendOtp}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isVerifying}
            >
              {isVerifying ? (
                <div className={styles.spinner} />
              ) : (
                "Xác nhận OTP"
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