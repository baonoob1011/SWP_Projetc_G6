import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

type Staff = {
  idCard: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  userId: string;
  fullName: string;
  email: string;
  enabled: boolean;
  role: string;
  phone: string;
  createAt: string;
};

function GetStaffByManager() {
  const [account, setAccount] = useState<Staff[]>([]);
  const [isManager, setIsManager] = useState(true);
  const [search, setSearch] = useState("");
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "http://localhost:8080/api/manager/get-all-staff",
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
    setIsManager(localStorage.getItem("role") === "MANAGER");
  }, []);

  useEffect(() => {
    fetchData(); // gọi lần đầu khi component mount
  }, []);

  const handleDelete = async (phone: string, fullName: string) => {
    const mes = window.confirm(
      `bạn có chắc chắn muốn xóa nhân viên có tên là ${fullName} ?`
    );
    if (!mes) {
      return;
    } else {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          `http://localhost:8080/api/manager/delete-staff?phone=${phone}`,
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

  if (!isManager) {
    return;
  }

  const searchByphone = account.filter((user) => user.phone.includes(search))

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 4, marginTop: 10 }}>
      <Typography variant="h6" sx={{ m: 2 }}>
        Danh sách nhân viên
      </Typography>
      <TextField
        label="Nhập số điện thoại"
        variant="outlined"
        size="small"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Họ tên</strong></TableCell>
            <TableCell><strong>CCCD</strong></TableCell>
            <TableCell><strong>Ngày sinh</strong></TableCell>
            <TableCell><strong>Giới tính</strong></TableCell>
            <TableCell><strong>Email</strong></TableCell>
            <TableCell><strong>Số điện thoại</strong></TableCell>
            <TableCell><strong>Địa chỉ</strong></TableCell>
            <TableCell><strong>Vai trò</strong></TableCell>
            <TableCell><strong>Ngày đăng ký</strong></TableCell>
            <TableCell><strong>Trạng thái</strong></TableCell>
            <TableCell><strong>Thao tác</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {searchByphone.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{index +1}</TableCell>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.idCard}</TableCell>
              <TableCell>{user.dateOfBirth}</TableCell>
              <TableCell>{user.gender}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.address}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.createAt}</TableCell>
              <TableCell>{user.enabled ? "Đã kích hoạt" : "Chưa kích hoạt"}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(user.phone, user.fullName)}
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}

export default GetStaffByManager;
