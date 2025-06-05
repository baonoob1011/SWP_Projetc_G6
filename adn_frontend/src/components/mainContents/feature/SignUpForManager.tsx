import {
  Box,
  Button,
  FormControlLabel,
  FormHelperText,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CustomSnackBar from "../userinfor/Snackbar";
import { signUpStaffSchema } from "../userinfor/Validation";
import { ValidationError } from "yup";
import Swal from "sweetalert2";
import styles from "./Staff.module.css";


type Manager = {
  fullName: string;
  idCard: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender: "Male" | "Female";
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
  };
};

const SignUpManager = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [manager, setManager] = useState<Manager>({
    fullName: "",
    idCard: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "Male",
    address: "",
    phone: "",
    dateOfBirth: "",
  });
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    setIsAdmin(localStorage.getItem("role") === "ADMIN");
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateField = async (name: string, value: any) => {
    try {
      await signUpStaffSchema.validateAt(name, { ...manager, [name]: value });
      setError((prev) => ({ ...prev, [name]: "" }));
    } catch (err) {
      if (err instanceof ValidationError) {
        setError((prev) => ({ ...prev, [name]: err.message }));
      }
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let newValue: any = value;

    if (name === "phone" || name === "idCard") {
      newValue = value.replace(/\D/g, "");
    }

    setManager((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    validateField(name, newValue);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signUpStaffSchema.validate(manager, { abortEarly: false });
      setError({});

      // Chuẩn bị data để gửi
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...dataToSend } = manager;

      const token = localStorage.getItem("token");

      //   if (!token) {
      //     setSnackbar({
      //       open: true,
      //       message: "Bạn cần đăng nhập để thực hiện chức năng này",
      //       severity: "error",
      //     });
      //     return;
      //   }

      const response = await fetch(
        "http://localhost:8080/api/register/manager-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Fix 3: Thêm Authorization header
          },
          body: JSON.stringify(dataToSend),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {

        const errorData: ErrorResponse = await response.json();

        // Nếu server trả về lỗi từng field
        if (errorData.errors) {
          const newServerErrors: { [key: string]: string } = {};
          
          // Xử lý tất cả các lỗi cùng lúc thay vì dừng ở lỗi đầu tiên
          if (errorData.errors.username) {
            newServerErrors.username = "Tên đăng nhập đã tồn tại";
          }
          if (errorData.errors.email) {
            newServerErrors.email = "Email đã tồn tại";
          }
          if (errorData.errors.phone) {
            newServerErrors.phone = "Số điện thoại đã tồn tại";
          }

          // Hiển thị tất cả lỗi lên các field cùng lúc
          setError((prev) => ({ ...prev, ...newServerErrors }));
          
          // Không return ở đây để tránh dừng xử lý
          // return; // <- Xóa dòng này
        } else {
          // Nếu không phải lỗi cụ thể
          setSnackbar({
            open: true,
            message: errorData.message || "Đã xảy ra lỗi",
            severity: "error",
          });
        }
        let errorMessage = "Tên đăng nhập hoặc email đã tồn tại";

        // Kiểm tra các lỗi cụ thể
        if (response.status === 401) {
          errorMessage = "Bạn không có quyền thực hiện chức năng này";
        } else if (response.status === 403) {
          errorMessage = "Truy cập bị từ chối";
        } else if (response.status === 400) {
          errorMessage = "Dữ liệu không hợp lệ";
        }

        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Đăng ký nhân viên thành công!",
          showConfirmButton: false,
          timer: 1500,
        });

        // Reset form sau khi thành công
        setManager({
          fullName: "",
          idCard: "",
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
          gender: "Male",
          address: "",
          phone: "",
          dateOfBirth: "",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);

      if (error instanceof ValidationError) {
        const newErrors: { [key: string]: string } = {};
        error.inner.forEach((item) => {
          if (item.path) {
            newErrors[item.path] = item.message;
          }
        });
        setError(newErrors);
      } else {
        setSnackbar({
          open: true,
          message: "Không thể kết nối tới máy chủ",
          severity: "error",
        });
      }
    }
  };

  if (!isAdmin) {
    return;
  }

  return (
    <div className={styles.container}>
      <Paper elevation={20} className={styles.paper} >
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
            aria-describedby="rulePass"
            value={manager.password}
            onChange={handleInput}
            error={!!error.password}
            helperText={error.password}
          />
          <FormHelperText
            id="rulePass"
            sx={{ textAlign: "left" }}
            component="div"
          >
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
          {error.gender && (
            <FormHelperText error sx={{ textAlign: "left", mb: 1 }}>
              {error.gender}
            </FormHelperText>
          )}

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
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Đăng Ký Nhân Viên
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
