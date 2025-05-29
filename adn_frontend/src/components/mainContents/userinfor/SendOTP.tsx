import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState, type FormEvent } from "react";
import NewPass from "./NewPass";

type Props = {
  email: string;
};

const SendOTP = ({ email }: Props) => {
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false)
  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/otp/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });
      if (!response.ok) {
        alert("OTP không hợp lệ hoặc đã hết hạn");
      } else {
        alert("Xác thực OTP thành công");
        setShow(true)
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Xác thực OTP thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  if(show){
    return <NewPass email={email}/>
  }

  return (
    <Box component="form" onSubmit={handleSendOtp}>
      <Paper elevation={20} style={{ borderRadius: 10, padding: 20, marginTop: 20 }}>
        <Typography variant="h6">Nhập mã OTP đã gửi đến email</Typography>
        <Typography>Email: {email}</Typography>
        <TextField
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" fullWidth disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Xác nhận OTP"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SendOTP;
