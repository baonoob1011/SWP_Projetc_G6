import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Button, TextField } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { NavLink } from 'react-router-dom';
import { showErrorSnackbar, showSuccessAlert } from './utils/notifications';

type OldProfile = {
  fullName: string;
  email: string;
  phone: string;
};

type Profile = {
  role: 'MANAGER' | 'STAFF';
};

const NewProfile = ({ role }: Profile) => {
  const [profile, setProfile] = useState<OldProfile | null>(null);
  const [updateProfile, setUpdateProfile] = useState<OldProfile>({
    fullName: '',
    email: '',
    phone: '',
  });
  const [editableField, setEditableField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: OldProfile = jwtDecode(token);
        setProfile(decoded);
        setUpdateProfile(decoded);
      } catch (error) {
        console.error('Lỗi giải mã token:', error);
        setError('Không thể đọc thông tin người dùng');
      }
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateProfile((updateProfile) => ({
      ...updateProfile,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const apiMap = {
      STAFF: 'http://localhost:8080/api/staff/update-staff',
      MANAGER: 'http://localhost:8080/api/manager/update-manager',
    };
    try {
      const res = await fetch(apiMap[role], {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updateProfile),
      });

      if (!res.ok) {
        setError('Cập nhật thất bại!');
        return;
      }

      const updated = await res.json();
      showSuccessAlert('Thành công', 'Cập nhật thông tin thành công!');
      setProfile(updated);
      setUpdateProfile(updated);
    } catch (error) {
      console.log(error);
      setError('Lỗi kết nối với hệ thống');
    }
  };

  if (!profile) return <Typography>Không có thông tin người dùng.</Typography>;

  return (
    <>
      {error && showErrorSnackbar(error)}
      <Box
        component="form"
        onSubmit={handleSave}
        sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
      >
        <Paper
          sx={{
            p: 4,
            width: 400,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            backgroundColor: '#f9f9f9',
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              mb: 3,
              fontWeight: 'bold',
              color: '#333',
              borderBottom: '2px solid #1976d2',
              pb: 1,
            }}
          >
            Thông tin cá nhân
          </Typography>

          <TextField
            label="Họ và tên"
            name="fullName"
            value={updateProfile.fullName}
            onChange={handleInput}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: editableField !== 'fullName',
            }}
            onClick={() => setEditableField('fullName')}
            onBlur={() => setEditableField(null)}
          />

          <TextField
            label="Email"
            name="email"
            value={updateProfile.email}
            onChange={handleInput}
            fullWidth
            margin="normal"
            type="email"
            InputProps={{
              readOnly: editableField !== 'email',
            }}
            onClick={() => setEditableField('email')}
            onBlur={() => setEditableField(null)}
          />

          <TextField
            label="Số điện thoại"
            name="phone"
            value={updateProfile.phone}
            onChange={handleInput}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: editableField !== 'phone',
            }}
            onClick={() => setEditableField('phone')}
            onBlur={() => setEditableField(null)}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Lưu thay đổi
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            component={NavLink}
            to="/change-pass"
            sx={{ mt: 3 }}
          >
            Đổi mật khẩu
          </Button>
        </Paper>
      </Box>
    </>
  );
};

export default NewProfile;
