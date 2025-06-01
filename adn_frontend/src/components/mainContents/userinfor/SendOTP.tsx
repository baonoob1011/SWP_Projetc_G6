import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CountdownTimer from "../feature/CountDown";
import NewPass from "./NewPass";
import CustomSnackBar from "./Snackbar";
import Swal from "sweetalert2";

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
        Swal.fire({
          icon: "success",
          title: "Xác thực thành công",
          showConfirmButton: false,
          timer: 1300,
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
      alert((err as Error).message);
    }
  };

  if (verified) return <NewPass email={email} />;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={2}
    >
      <Paper
        elevation={8}
        sx={{ borderRadius: 4, p: 5, maxWidth: 440, width: "100%" }}
      >
        <Typography variant="h5" textAlign="center" fontWeight={700} mb={2}>
          Xác thực OTP
        </Typography>
        <Typography
          textAlign="center"
          mb={3}
          sx={{ color: "primary.main", fontWeight: "bold" }}
        >
          Mã OTP đã gửi tới: {email}
        </Typography>
        <form onSubmit={handleVerifyOtp}>
          <TextField
            fullWidth
            placeholder="Nhập mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            size="medium"
          />
          <Box
            mt={3}
            mb={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <CountdownTimer duration={60000} onComplete={() => {}} onResend={resendOtp} />
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, py: 1.3, fontWeight: 600 }}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <CircularProgress size={24} color="inherit" />
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
