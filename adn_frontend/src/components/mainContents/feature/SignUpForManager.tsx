import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  FormHelperText,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import CustomSnackBar from '../userinfor/Snackbar';
import { signUpStaffSchema } from '../userinfor/Validation';
import { ValidationError } from 'yup';
import Swal from 'sweetalert2';
import styles from './Staff.module.css';

type Manager = {
  fullName: string;
  idCard: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender: 'Male' | 'Female';
  address: string;
  phone: string;
  dateOfBirth: string;
};

type ErrorResponse = {
  message: string;
  errors?: {
    username?: string;
    email?: string;
    phone?: string;
    idCard?: string;
  };
};

const SignUpManager = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const [manager, setManager] = useState<Manager>({
    fullName: '',
    idCard: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: 'Male',
    address: '',
    phone: '',
    dateOfBirth: '',
  });

  const [error, setError] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    setIsAdmin(localStorage.getItem('role') === 'ADMIN');
  }, []);

  const validateField = async (name: string, value: string) => {
    try {
      await signUpStaffSchema.validateAt(name, { ...manager, [name]: value });
      setError((prev) => ({ ...prev, [name]: '' }));
    } catch (err) {
      if (err instanceof ValidationError) {
        setError((prev) => ({ ...prev, [name]: err.message }));
        if (value === '') {
          setSnackbar({
            open: true,
            message: 'Vui lòng điền đầy đủ thông tin',
            severity: 'error',
          });
        } else if (name === 'phone') {
          setSnackbar({
            open: true,
            message: 'Vui lòng nhập số điện thoại hợp lệ',
            severity: 'error',
          });
        }
      }
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'phone' || name === 'idCard') {
      newValue = value.replace(/\D/g, '');
    }

    setManager((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    validateField(name, newValue);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emptyFields = Object.entries(manager).filter(
      ([key, value]) => !value && key !== 'gender'
    );
    if (emptyFields.length > 0) {
      setSnackbar({
        open: true,
        message: 'Vui lòng điền đầy đủ thông tin',
        severity: 'error',
      });
      return;
    }

    try {
      await signUpStaffSchema.validate(manager, { abortEarly: false });
      setError({});
      setLoading(true);

      const token = localStorage.getItem('token');

      const response = await fetch(
        'http://localhost:8080/api/register/manager-account',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(manager),
        }
      );
      setLoading(false);
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();

        if (errorData.errors) {
          const messages = [];
          if (errorData.errors.username)
            messages.push('Tên đăng nhập đã tồn tại');
          if (errorData.errors.email) messages.push('Email đã tồn tại');
          if (errorData.errors.phone) messages.push('Số điện thoại đã tồn tại');
          if (errorData.errors.idCard) messages.push('CCCD không hợp lệ');

          setSnackbar({
            open: true,
            message: messages.join(', '),
            severity: 'error',
          });
        } else {
          let message = 'Đã xảy ra lỗi';
          if (response.status === 401) message = 'Không có quyền thực hiện';
          else if (response.status === 403) message = 'Truy cập bị từ chối';
          else if (response.status === 400) message = 'Dữ liệu không hợp lệ';

          setSnackbar({ open: true, message, severity: 'error' });
        }
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Đăng ký quản lý thành công!',
        showConfirmButton: false,
        timer: 1500,
      });

      setManager({
        fullName: '',
        idCard: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        gender: 'Male',
        address: '',
        phone: '',
        dateOfBirth: '',
      });
    } catch (err) {
      setLoading(false);
      if (err instanceof ValidationError) {
        setSnackbar({
          open: true,
          message: 'Vui lòng kiểm tra lại thông tin đã nhập',
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Không thể kết nối tới máy chủ',
          severity: 'error',
        });
      }
    }
  };

  if (!isAdmin) return null;

  return (
    <div className={styles.container}>
      <Paper elevation={20} className={styles.paper}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Typography variant="h5" gutterBottom className={styles.title}>
            Thông tin quản lý
          </Typography>

          <TextField
            fullWidth
            margin="normal"
            name="fullName"
            label="Họ và tên"
            value={manager.fullName}
            onChange={handleInput}
            error={!!error.fullName}
            helperText={error.fullName}
          />
          <TextField
            fullWidth
            margin="normal"
            name="idCard"
            label="Nhập CCCD"
            value={manager.idCard}
            onChange={handleInput}
            error={!!error.idCard}
            helperText={error.idCard}
            inputProps={{ maxLength: 12 }}
          />
          <TextField
            fullWidth
            margin="normal"
            name="email"
            label="Địa chỉ email"
            type="email"
            value={manager.email}
            onChange={handleInput}
            error={!!error.email}
            helperText={error.email}
          />
          <TextField
            fullWidth
            margin="normal"
            name="username"
            label="Tên đăng nhập"
            value={manager.username}
            onChange={handleInput}
            error={!!error.username}
            helperText={error.username}
          />
          <TextField
            fullWidth
            margin="normal"
            name="password"
            label="Mật khẩu"
            type="password"
            value={manager.password}
            onChange={handleInput}
            error={!!error.password}
            helperText={error.password}
          />
          <FormHelperText id="rulePass" sx={{ textAlign: 'left' }}>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Có ít nhất 8 ký tự</li>
              <li>Có ít nhất 1 chữ thường và hoa</li>
              <li>Có ít nhất 1 ký tự đặc biệt</li>
              <li>Có ít nhất 1 chữ số</li>
            </ul>
          </FormHelperText>
          <TextField
            fullWidth
            margin="normal"
            name="confirmPassword"
            label="Nhập lại mật khẩu"
            type="password"
            value={manager.confirmPassword}
            onChange={handleInput}
            error={!!error.confirmPassword}
            helperText={error.confirmPassword}
          />
          <RadioGroup
            row
            name="gender"
            value={manager.gender}
            onChange={handleInput}
          >
            <FormControlLabel value="Male" control={<Radio />} label="Nam" />
            <FormControlLabel value="Female" control={<Radio />} label="Nữ" />
          </RadioGroup>
          <TextField
            fullWidth
            margin="normal"
            name="address"
            label="Nhập địa chỉ"
            value={manager.address}
            onChange={handleInput}
            error={!!error.address}
            helperText={error.address}
          />
          <TextField
            fullWidth
            margin="normal"
            name="phone"
            label="Số điện thoại"
            type="tel"
            value={manager.phone}
            onChange={handleInput}
            error={!!error.phone}
            helperText={error.phone}
            inputProps={{ maxLength: 10 }}
          />
          <TextField
            fullWidth
            margin="normal"
            name="dateOfBirth"
            label="Ngày sinh"
            type="date"
            value={manager.dateOfBirth}
            onChange={handleInput}
            error={!!error.dateOfBirth}
            helperText={error.dateOfBirth}
            InputLabelProps={{ shrink: true }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Đăng ký nhân viên'
            )}
          </Button>
        </Box>
      </Paper>

      <CustomSnackBar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
};

export default SignUpManager;
