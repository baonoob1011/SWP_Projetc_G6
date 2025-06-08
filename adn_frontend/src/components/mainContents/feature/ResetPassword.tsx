import { Button, Paper, TextField, Box } from '@mui/material';
import { useState } from 'react';

type ChangPass = {
  password: string;
  confirmPassword: string;
};

type NewPassWordProps = {
  role: 'user' | 'staff' | 'manager';
};

const NewPassWord = ({ role }: NewPassWordProps) => {
  const [newPassword, setNewPassWord] = useState<ChangPass>({
    password: '',
    confirmPassword: '',
  });
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPassWord({
      ...newPassword,
      [name]: value,
    });
  };
  const handleChangPass = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiMap = {
      user: 'http://localhost:8080/api/user/update-user',
      staff: 'http://localhost:8080/api/staff/update-staff',
      manager: 'http://localhost:8080/api/manager/update-manager',
    };
    try {
      const res = await fetch(apiMap[role], {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          password: newPassword.password,
          confirmPassword: newPassword.confirmPassword,
        }),
      });

      if (!res.ok) {
        alert('Mật khẩu cũ không đúng');
      } else {
        alert('Đổi mật khẩu thành công');
        // Điều hướng nếu cần
        // navigate("/chang-pass");
      }
    } catch (error) {
      console.log(error);
      alert('Lỗi hệ thống');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleChangPass}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 5,
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
        <TextField
          label="Nhập mật khẩu mới"
          fullWidth
          name="password"
          value={newPassword.password}
          type="password"
          onChange={handleInput}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Nhập lại mật khẩu"
          fullWidth
          name="confirmPassword"
          value={newPassword.confirmPassword}
          type="password"
          onChange={handleInput}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Xác nhận
        </Button>
      </Paper>
    </Box>
  );
};

export default NewPassWord;
