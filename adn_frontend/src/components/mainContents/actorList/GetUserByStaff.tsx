import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

type User = {
  fullName: string;
  email: string;
  enabled: boolean;
  role: string;
  phone: string;
  createAt: string;
};

function GetUserByStaff() {
  const [account, setAccount] = useState<User[]>([]);
  const [isManager, setIsManager] = useState(true);
  const [search, setSearch] = useState("");
  // ✅ Gọi API lấy dữ liệu
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:8080/api/staff/get-user-phone?phone=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Không thể lấy dữ liệu");

      const data = await res.json();

      if (!Array.isArray(data)) throw new Error("Dữ liệu không hợp lệ");

      setAccount(data);
    } catch (error) {
      console.error("Lỗi fetch:", error);
      alert("Lỗi khi tải dữ liệu người dùng.");
    }
  };

  useEffect(() => {
    setIsManager(localStorage.getItem("role") === "STAFF");
  }, []);

  useEffect(() => {
    fetchData(); // gọi lần đầu khi component mount
  }, []);

  if (!isManager) {
    return;
  }

  const searchByPhone = account.find((user) => user.phone === search);

  return (
    <TableContainer component={Paper} sx={{ flexGrow: 1 }}>
      <TextField
        label="Tìm theo SĐT"
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Typography variant="h6" sx={{ m: 2 }}>
        Danh sách người dùng
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Họ tên</strong>
            </TableCell>
            <TableCell>
              <strong>Email</strong>
            </TableCell>
            <TableCell>
              <strong>SĐT</strong>
            </TableCell>
            <TableCell>
              <strong>Vai trò</strong>
            </TableCell>
            <TableCell>
              <strong>Ngày đăng ký</strong>
            </TableCell>
            <TableCell>
              <strong>Trạng thái</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {searchByPhone ? (
            <TableRow>
              <TableCell>{searchByPhone.fullName}</TableCell>
              <TableCell>{searchByPhone.email}</TableCell>
              <TableCell>{searchByPhone.phone}</TableCell>
              <TableCell>{searchByPhone.role}</TableCell>
              <TableCell>{searchByPhone.createAt}</TableCell>
              <TableCell>
                {searchByPhone.enabled ? "Đã kích hoạt" : "Chưa kích hoạt"}
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                Không tìm thấy người dùng
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GetUserByStaff;
