import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import CustomSnackBar from "../mainContents/userinfor/Snackbar";
import SendOTP from "../mainContents/userinfor/SendOTP";
import EmailIcon from "@mui/icons-material/Email";
import styles from "./Forget.module.css";

const Forget = () => {
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("http://localhost:8080/api/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        setSnackbar({
          open: true,
          message: "Email không tồn tại",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Gửi OTP thành công",
          severity: "success",
        });
        setTimeout(() => setShow(true), 1500);
      }
    } catch (err) {
      console.log(err)
      setSnackbar({
        open: true,
        message: "Lỗi mạng",
        severity: "error",
      });
    } finally {
      setSending(false);
    }
  };

  if (show) {
    return <SendOTP email={email} />;
  }

  return (
    <Box className={styles.forgetContainer}>
      <Paper elevation={6} className={styles.forgetPaper}>
        <Typography 
          variant="h5" 
          className={styles.forgetTitle}
        >
          Quên Mật Khẩu
        </Typography>
        
        <Typography
          variant="body2"
          className={styles.forgetSubtitle}
        >
          Vui lòng nhập email để nhận mã xác thực (OTP)
        </Typography>

        <Box component="form" onSubmit={handleSendEmail}>
          <Box className={styles.inputGroup}>
            <TextField
              label="Địa chỉ Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.customTextField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#666" }} />
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
            className={styles.forgetButton}
            disabled={sending}
            startIcon={
              sending && <div className={styles.spinner} />
            }
          >
            {sending ? "Đang gửi..." : "Gửi OTP"}
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
  );
};

export default Forget;