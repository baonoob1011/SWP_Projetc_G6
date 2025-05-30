import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState, type FormEvent } from "react";
import SendOTP from "./SendOTP";

const Forget = () => {
  const [email, setEmail] = useState<string>("");
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        alert("Email ko tồn tại");
      } else {
        setShowOTP(true);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi gửi mail");
    } finally {
      setIsLoading(false);
    }
  };

  if (showOTP) {
    return <SendOTP email={email} />;
  }

  return (
    <Box component={"form"} onSubmit={handleSubmit}>
      <Paper elevation={20} style={{ borderRadius: 10, padding: 20 }}>
        <Typography variant="h5">
          Hãy nhập email đã được đăng ký của bạn
        </Typography>
        <TextField
          type="email"
          fullWidth
          label="Địa chỉ email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Gửi OTP"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Forget;
