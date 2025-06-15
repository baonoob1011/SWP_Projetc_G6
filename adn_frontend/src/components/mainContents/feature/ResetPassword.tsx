import { Button, Paper, TextField, Box } from '@mui/material';
import { useState } from 'react';
import CustomSnackBar from '../userinfor/Snackbar';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

type ChangPass = {
  password: string;
  confirmPassword: string;
};

type NewPassWordProps = {
  role: 'USER' | 'STAFF' | 'MANAGER';
};

const NewPassWord = ({ role }: NewPassWordProps) => {
  const [newPassword, setNewPassWord] = useState<ChangPass>({
    password: '',
    confirmPassword: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const navigate = useNavigate();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPassWord({
      ...newPassword,
      [name]: value,
    });
  };

  const handleChangPass = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!newPassword.password || !newPassword.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'Vui lòng điền đầy đủ thông tin',
        severity: 'error',
      });
      return;
    }

    // Kiểm tra mật khẩu khớp nhau
    if (newPassword.password !== newPassword.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'Mật khẩu không khớp',
        severity: 'error',
      });
      return;
    }

    const apiMap = {
      USER: 'http://localhost:8080/api/user/update-user',
      STAFF: 'http://localhost:8080/api/staff/update-profile',
      MANAGER: 'http://localhost:8080/api/manager/update-manager',
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
        let errorMessage = 'Không thể đăng ký'; // mặc định

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMessage = errorData.message || JSON.stringify(errorData);
        } else {
          errorMessage = await res.text();
        }
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Đổi mật khẩu thành công',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/u-profile');
      }
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: 'Lỗi hệ thống',
        severity: 'error',
      });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleChangPass}
      sx={{
        display: 'flex',
        flexDirection: 'column',
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
      <CustomSnackBar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default NewPassWord;
