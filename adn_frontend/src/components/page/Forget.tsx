import { Box, Button, Paper, TextField, Typography, CircularProgress, InputAdornment } from "@mui/material";
import { useState } from "react";
import CustomSnackBar from "../mainContents/userinfor/Snackbar";
import SendOTP from "../mainContents/userinfor/SendOTP";
import EmailIcon from "@mui/icons-material/Email";

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
      const res = await fetch("http://localhost:8080/api/otp/send", {
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
      }
      setSnackbar({
        open: true,
        message: "Gửi OTP thành công",
        severity: "success",
      });
      setTimeout(() => setShow(true), 1500);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
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
    <Box display="flex" justifyContent="center" alignItems="center" >
      <Paper elevation={6} sx={{ borderRadius: 4, p: 5, width: "100%", maxWidth: 420 }}>
        <Typography variant="h5" textAlign="center" fontWeight={700} mb={1}>
          Quên Mật Khẩu
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
          Vui lòng nhập email để nhận mã xác thực (OTP)
        </Typography>

        <form onSubmit={handleSendEmail}>
          <TextField
            label="Địa chỉ Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, py: 1.2, fontWeight: 600 }}
            disabled={sending}
            startIcon={sending && <CircularProgress size={20} color="inherit" />}
          >
            {sending ? "Đang gửi..." : "Gửi OTP"}
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

export default Forget;
