import { Button, Paper, TextField, Box } from '@mui/material';
import { useState } from 'react';
import NewPassWord from './ResetPassword';
import CustomSnackBar from '../userinfor/Snackbar';
import Swal from 'sweetalert2';

type OldPassWordProps = {
  role: 'user' | 'staff' | 'manager';
};

const OldPassWord = ({ role }: OldPassWordProps) => {
  const [oldPassword, setOldPassWord] = useState('');
  const [show, setShow] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleChangPass = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra mật khẩu cũ có được nhập không
    if (!oldPassword.trim()) {
      setSnackbar({
        open: true,
        message: 'Vui lòng nhập mật khẩu cũ',
        severity: 'error',
      });
      return;
    }

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
        body: JSON.stringify({ oldPassword }),
      });

      if (!res.ok) {
        setSnackbar({
          open: true,
          message: 'Mật khẩu cũ không đúng',
          severity: 'error',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Xác thực thành công',
          showConfirmButton: false,
          timer: 1500,
        });
        setShow(true);
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

  if (show) {
    return <NewPassWord role={role} />;
  }

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
          label="Nhập mật khẩu cũ"
          fullWidth
          name="password"
          value={oldPassword}
          type="password"
          onChange={(e) => setOldPassWord(e.target.value)}
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

export default OldPassWord;
