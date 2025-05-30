import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import CustomSnackBar from "../mainContents/userinfor/Snackbar";

type UserInfo = {
  username: string;
  password: string;
};

type LoginProps = {
  setFullName: React.Dispatch<React.SetStateAction<string>>;
};

const Login = ({ setFullName }: LoginProps) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserInfo>({
    username: "",
    password: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  }); //create popup notice

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const TimeLeftLogout = (exp: number) => {
    const now = Date.now() / 1000;
    const timeleft = (exp - now) * 1000 * 60 * 60;

    if (timeleft > 0) {
      setTimeout(() => {
        toast.error("Hết thời gian đăng nhập");
        localStorage.clear();
        setFullName("");
        navigate("/login");
      }, timeleft);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        setSnackbar({
          open: true,
          message: "Sai tên đăng nhập hoặc mật khẩu",
          severity: "error",
        });
      } else {
        const data = await response.json();
        const token = data.result.token;

        try {
          const decoded: { sub: string; exp: number; fullName: string } = jwtDecode(token);

          localStorage.setItem("token", token);
          localStorage.setItem("username", decoded.sub);
          localStorage.setItem("fullName", decoded.fullName);
          setFullName(decoded.fullName);// Cập nhật state App => Header re-render
          TimeLeftLogout(decoded.exp);
          Swal.fire({
            icon: "success",
            title: "Đăng nhập thành công!",
            showConfirmButton: false,
            timer: 1300,
          });

          setTimeout(() => navigate("/"), 1500);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (decodeError) {
          Swal.fire({
            icon: "error",
            title: "Token không hợp lệ!",
            text: "Vui lòng thử lại hoặc liên hệ quản trị viên",
          });
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi hệ thống!",
        text: "Không thể kết nối tới máy chủ",
      });
    }
  };

  return (
    <div>
      <Paper elevation={20} style={{ padding: 40, borderRadius: 20 }}>
        <Box component={"form"} onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom>
            Đăng nhập
          </Typography>
          <TextField
            label="Tên đăng nhập"
            fullWidth
            margin="normal"
            name="username"
            value={user.username}
            onChange={handleInput}
          />
          <TextField
            label="Mật khẩu"
            type="password"
            fullWidth
            margin="normal"
            name="password"
            value={user.password}
            onChange={handleInput}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Đăng nhập
          </Button>

          <Box mt={3} textAlign="start">
            <Typography variant="body2">
              <Link to="/forget">Quên mật khẩu ? </Link>
            </Typography>
          </Box>
          <Box mt={3} textAlign="center">
            <Typography variant="body2">
              Bạn chưa có tài khoản? <Link to="/signup">Đăng ký</Link>
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
    </div>
  );
};
export default Login;
