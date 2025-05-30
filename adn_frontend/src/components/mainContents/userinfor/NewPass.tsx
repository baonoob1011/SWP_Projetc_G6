import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";


type Pass = {
  newPassword: string;
  confirmPassword: string;
};

type Props = {
  email: string;
};

const NewPass = ({ email }: Props) => {
  const [newPass, setNewPass] = useState<Pass>({
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const { newPassword, confirmPassword } = newPass;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/otp/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, newPassword }),
        }
      );

      if (!response.ok) {
        alert("Không thể đổi mật khẩu. Vui lòng thử lại");
      } else {
        navigate("/login")
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đã xảy ra lỗi khi gửi yêu cầu");
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPass({
      ...newPass,
      [name]: value,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Paper
        elevation={20}
        style={{ borderRadius: 10, padding: 20, marginTop: 20 }}
      >
        <Typography variant="h6">Đặt lại mật khẩu</Typography>

        <TextField
          type="password"
          name="newPassword"
          label="Mật khẩu mới"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={handleInput}
          required
        />

        <TextField
          type="password"
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={handleInput}
          required
        />

        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Đổi mật khẩu
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NewPass;
