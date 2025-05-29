import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

type UserInfo = {
  username: string;
  password: string;
};

type LoginProps = {
  setUsername: React.Dispatch<React.SetStateAction<string>>;
};

const Login = ({ setUsername }: LoginProps) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserInfo>({
    username: "",
    password: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const TimeLeftLogout = (exp: number) => {
    const now = Date.now() / 1000;
    const timeleft = (exp - now) * 1000;

    if (timeleft > 0) {
      setTimeout(() => {
        toast.error("Hết thời gian đăng nhập");
        localStorage.clear();
        setUsername("");
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
        Swal.fire({
          icon: "error",
          title: "Đăng nhập thất bại!",
          text: "Sai tên đăng nhập hoặc mật khẩu",
        });
      } else {
        const data = await response.json();
        const token = data.result.token;

        try {
          const decoded: { sub: string; exp: number } = jwtDecode(token);

          localStorage.setItem("token", token);
          localStorage.setItem("username", decoded.sub);

          setUsername(decoded.sub); // Cập nhật state App => Header re-render
          TimeLeftLogout(decoded.exp);
          Swal.fire({
            icon: "success",
            title: "Đăng nhập thành công!",
            showConfirmButton: false,
            timer: 1500,
          });

          setTimeout(() => navigate("/"), 1000);
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
    </div>
  );
};
export default Login;
