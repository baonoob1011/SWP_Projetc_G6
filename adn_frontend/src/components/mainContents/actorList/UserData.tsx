import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

type User = {
  userId: string;
  fullName: string;
  email: string;
  otpCode: string;
  role: string;
  phone: string;
  username: string;
};

function UserData() {
  const [account, setAccount] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(true);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "http://localhost:8080/api/manager/get-all-user",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setAccount(data);
    } catch (error) {
      console.log(error);
      alert("không thể lấy dữ liệu");
    }
  };
  useEffect(() => {
    setIsAdmin(localStorage.getItem("role") === "MANAGER");
  }, []);

  useEffect(() => {
    fetchData(); // gọi lần đầu khi component mount
  }, []);

  const handleDelete = async (phone: string, fullName: string) => {
    const mes = window.confirm(
      `bạn có chắc chắn muốn xóa người dùng có tên là ${fullName} ?`
    );
    if (!mes) {
      return;
    } else {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          `http://localhost:8080/api/manager/delete-user?phone=${phone}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res) {
          alert("không thể thể xóa");
        } else {
          alert("xóa thành công");
          fetchData();
        }
      } catch (error) {
        console.log(error);
        alert("Mất kết nối với hệ thống");
      }
    }
  };

  if (!isAdmin) {
    return;
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 4, marginTop: 10 }}>
        <Typography variant="h6" sx={{ m: 2 }}>
          Danh sách người dùng
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Họ tên</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Username</strong>
              </TableCell>
              <TableCell>
                <strong>SĐT</strong>
              </TableCell>
              <TableCell>
                <strong>Vai trò</strong>
              </TableCell>
              <TableCell>
                <strong>OTP</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {account.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{user.userId}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.otpCode}</TableCell>
                <TableCell>
                  <button
                    type="submit"
                    onClick={() => handleDelete(user.phone, user.fullName)}
                  >
                    Xóa
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default UserData;
