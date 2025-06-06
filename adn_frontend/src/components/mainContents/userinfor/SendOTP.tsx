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
      const res = await fetch("http://localhost:8080/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Không thể gửi lại OTP");
      setSnackbar({
        open: true,
        message: "Gửi OTP thành công",
        severity: "success",
      });
      setOtp("");
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
    <Box className={styles.forgetContainer}>
      <Paper className={styles.forgetPaper} elevation={0}>
        <Typography className={styles.forgetTitle}>
          Xác thực OTP
        </Typography>
        <Typography className={styles.forgetSubtitle}>
          Mã OTP đã gửi tới: {maskEmail(email)}
        </Typography>
        
        <form onSubmit={handleVerifyOtp}>
          <div className={styles.inputGroup}>
            <TextField
              fullWidth
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              size="medium"
              className={styles.customTextField}
              InputLabelProps={{
                shrink: false,
              }}
            />
          </div>
          
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
            className={styles.forgetButton}
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
    </Box>
  );
};

export default SendOTP;