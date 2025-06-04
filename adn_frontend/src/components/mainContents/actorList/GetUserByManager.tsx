import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

type User = {
  // userId: string;
  fullName: string;
  email: string;
  enabled: boolean;
  role: string;
  phone: string;
  createAt: string;
};

function GetUserByManager() {
  const [account, setAccount] = useState<User[]>([]);
  const [isManager, setIsManager] = useState(true);
  const [search, setSearch] = useState("");
  // ✅ Gọi API lấy dữ liệu
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "http://localhost:8080/api/manager/get-all-user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) alert("Không thể lấy dữ liệu");

      const data = await res.json();

      if (!Array.isArray(data)) throw new Error("Dữ liệu không hợp lệ");

      setAccount(data);
    } catch (error) {
      console.error("Lỗi fetch:", error);
      alert("Lỗi khi tải dữ liệu người dùng.");
    }
  };

  // ✅ Xóa người dùng
  const handleDelete = async (phone: string, fullName: string) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa người dùng tên là ${fullName}?`
      )
    )
      return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:8080/api/manager/delete-user?phone=${phone}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Xóa thất bại");

      alert("Xóa thành công");
      fetchData();
    } catch (error) {
      console.error("Lỗi xóa:", error);
      alert("Không thể xóa người dùng");
    }
  };

  useEffect(() => {
    setIsManager(localStorage.getItem("role") === "MANAGER");
  }, []);

  useEffect(() => {
    fetchData(); // gọi lần đầu khi component mount
  }, []);

  if (!isManager) {
    return;
  }

  const searchByPhone = account.filter((user) => user.phone.includes(search));

  return (
    <TableContainer component={Paper} sx={{ flexGrow: 1 }}>
      <Typography variant="h6" sx={{ m: 2 }}>
        Danh sách người dùng
      </Typography>
      <TextField
        label="Nhập số điện thoại"
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table sx={{ fontSize: "13px" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: "13px" }}>
              <strong>ID</strong>
            </TableCell>
            <TableCell sx={{ fontSize: "13px" }}>
              <strong>Họ tên</strong>
            </TableCell>
            <TableCell sx={{ fontSize: "13px" }}>
              <strong>Email</strong>
            </TableCell>
            <TableCell sx={{ fontSize: "13px" }}>
              <strong>SĐT</strong>
            </TableCell>
            <TableCell sx={{ fontSize: "13px" }}>
              <strong>Vai trò</strong>
            </TableCell>
            <TableCell sx={{ fontSize: "13px" }}>
              <strong>Ngày đăng ký</strong>
            </TableCell>
            <TableCell sx={{ fontSize: "13px" }}>
              <strong>Trạng thái</strong>
            </TableCell>
            <TableCell sx={{ fontSize: "13px" }}>
              <strong>Thao tác</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {searchByPhone.map((user, index) => (
            <TableRow key={index}>
              <TableCell sx={{ fontSize: "12px" }}>{index + 1}</TableCell>
              <TableCell sx={{ fontSize: "12px" }}>{user.fullName}</TableCell>
              <TableCell sx={{ fontSize: "12px" }}>{user.email}</TableCell>
              <TableCell sx={{ fontSize: "12px" }}>{user.phone}</TableCell>
              <TableCell sx={{ fontSize: "12px" }}>{user.role}</TableCell>
              <TableCell sx={{ fontSize: "12px" }}>{user.createAt}</TableCell>
              <TableCell sx={{ fontSize: "12px" }}>
                {user.enabled ? "Đã kích hoạt" : "Chưa kích hoạt"}
              </TableCell>
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
  );
}

export default GetUserByManager;
