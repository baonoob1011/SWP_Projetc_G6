import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewPass = ({ email }: { email: string }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/otp/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      if (!res.ok) throw new Error("Không thể đặt lại mật khẩu");
      alert("Đổi mật khẩu thành công");
      navigate("/login");
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Paper elevation={8} sx={{ borderRadius: 4, p: 5, maxWidth: 440, width: "100%" }}>
        <Typography variant="h5" textAlign="center" fontWeight={700} mb={2}>
          Đặt Lại Mật Khẩu
        </Typography>
        <form onSubmit={handleReset}>
          <TextField
            fullWidth
            type="password"
            label="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            type="password"
            label="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.2, fontWeight: 600 }}
          >
            Đổi Mật Khẩu
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default NewPass;
