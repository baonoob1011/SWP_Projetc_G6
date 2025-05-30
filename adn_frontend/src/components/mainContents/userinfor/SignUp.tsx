import { useState } from "react";
import "./mainContent.css";
import { signUpSchema } from "./Validation";
import { ValidationError } from "yup";
import {
  Box,
  Button,
  FormHelperText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import CustomSnackBar from "./Snackbar";

type Info = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
};

const SignUp = () => {
  const [info, setInfo] = useState<Info>({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [error, setError] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  }); //create popup notice

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const onlynums = value.replace(/\D/g, ""); //only get number and, remove text
      setInfo({
        ...info,
        [name]: onlynums,
      });
    } else {
      setInfo({
        ...info,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const { confirmPassword, ...dataToSend } = info;
    try {
      //check valid before submit form
      await signUpSchema.validate(info, { abortEarly: false }); //if false will print all error, if true just print first error

      //if error set field to empty
      setError({});

      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });

      if (!response.ok) {
        setSnackbar({
          open: true,
          message: "Tên đăng nhập hoặc email đã tồn tại",
          severity: "error",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Đăng ký thành công!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
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

  return (
    <>
      <Paper elevation={20} style={{ padding: 40, borderRadius: 20, marginTop: 50 }}>
        <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom color="blue">
          Đăng Ký
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          id="fullname"
          name="fullName"
          label="Họ và tên"
          value={info.fullName}
          onChange={handleInput}
          error={!!error.fullName}
          helperText={error.fullName}
        />

        <TextField
          fullWidth
          margin="normal"
          id="username"
          name="username"
          label="Tên đăng nhập"
          value={info.username}
          onChange={handleInput}
          error={!!error.username}
          helperText={error.username}
        />

        <TextField
          fullWidth
          margin="normal"
          id="email"
          name="email"
          label="Địa chỉ email"
          type="email"
          value={info.email}
          onChange={handleInput}
          error={!!error.email}
          helperText={error.email}
        />

        <TextField
          fullWidth
          margin="normal"
          id="password"
          name="password"
          label="Mật khẩu"
          type="password"
          aria-describedby="rulePass"
          value={info.password}
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
          id="confirmPassword"
          name="confirmPassword"
          label="Nhập lại mật khẩu"
          type="password"
          value={info.confirmPassword}
          onChange={handleInput}
          error={!!error.confirmPassword}
          helperText={error.confirmPassword}
        />

        <TextField
          fullWidth
          margin="normal"
          id="phone"
          name="phone"
          label="Số điện thoại"
          type="tel"
          value={info.phone}
          onChange={handleInput}
          error={!!error.phone}
          helperText={error.phone}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ display: "flex" }}
        >
          Đăng Ký
        </Button>

        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Bạn đã có tài khoản? {"  "}
            <Link to="/login">Đăng nhập</Link>
          </Typography>
        </Box>
        </Box>
      </Paper>
      <CustomSnackBar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default SignUp;
