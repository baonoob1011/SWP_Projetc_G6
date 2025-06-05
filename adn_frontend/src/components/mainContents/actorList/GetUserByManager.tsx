import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
      <TextField
        label="Nhập số điện thoại"
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ margin: "10px 5px" }}
      />
      <Table
        sx={{
          fontSize: "13px",
          borderCollapse: "collapse",
          width: "100%",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: "13px", border: "1px solid #ccc" }}>
              <strong>ID</strong>
            </TableCell>
            <TableCell sx={{ fontSize: "13px", border: "1px solid #ccc" }}>
              <strong>Họ tên</strong>
            </TableCell>
            <TableCell sx={{ fontSize: "13px", border: "1px solid #ccc" }}>
              <strong>Email</strong>
            </TableCell>
            <TableCell sx={{ fontSize: "13px", border: "1px solid #ccc" }}>
              <strong>SĐT</strong>
            </TableCell>
            <TableCell sx={{ fontSize: "13px", border: "1px solid #ccc" }}>
              <strong>Vai trò</strong>
            </TableCell>
            <TableCell sx={{ fontSize: "13px", border: "1px solid #ccc" }}>
              <strong>Ngày đăng ký</strong>
            </TableCell>
            <TableCell sx={{ fontSize: "13px", border: "1px solid #ccc" }}>
              <strong>Trạng thái</strong>
            </TableCell>
            <TableCell sx={{ fontSize: "13px", border: "1px solid #ccc" }}>
              <strong>Thao tác</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {searchByPhone.map((user, index) => (
            <TableRow key={index}>
              <TableCell sx={{ fontSize: "12px", border: "1px solid #ccc" }}>
                {index + 1}
              </TableCell>
              <TableCell sx={{ fontSize: "12px", border: "1px solid #ccc" }}>
                {user.fullName}
              </TableCell>
              <TableCell sx={{ fontSize: "12px", border: "1px solid #ccc" }}>
                {user.email}
              </TableCell>
              <TableCell sx={{ fontSize: "12px", border: "1px solid #ccc" }}>
                {user.phone}
              </TableCell>
              <TableCell sx={{ fontSize: "12px", border: "1px solid #ccc" }}>
                [{user.role}]
              </TableCell>
              <TableCell sx={{ fontSize: "12px", border: "1px solid #ccc" }}>
                {user.createAt}
              </TableCell>
              <TableCell sx={{ fontSize: "12px", border: "1px solid #ccc" }}>
                {user.enabled ? "Đã kích hoạt" : "Chưa kích hoạt"}
              </TableCell>
              <TableCell sx={{ border: "1px solid #ccc" }}>
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
