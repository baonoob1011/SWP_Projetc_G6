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
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

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

function GetManagerByAdmin() {
  const [account, setAccount] = useState<Staff[]>([]);
  const [isAdmin, setIsAdmin] = useState(true);
  const [search, setSearch] = useState("");
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "http://localhost:8080/api/admin/get-all-manager",
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
    setIsAdmin(localStorage.getItem("role") === "ADMIN");
  }, []);

  useEffect(() => {
    fetchData(); // gọi lần đầu khi component mount
  }, []);

  const handleDelete = async (phone: string, fullName: string) => {
    const mes = window.confirm(
      `bạn có chắc chắn muốn xóa quản lý có tên là ${fullName} ?`
    );
    if (!mes) {
      return;
    } else {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          `http://localhost:8080/api/admin/delete-manager?phone=${phone}`,
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
  const searchByphone = account.filter((user) => user.phone.includes(search));
  return (
    <>
      <TableContainer component={Paper} sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ m: 2 }}>
          Danh sách quản lý
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
              <TableCell sx={{ fontSize: "13px", fontWeight: "bold" }}>
                ID
              </TableCell>
              <TableCell sx={{ fontSize: "13px", fontWeight: "bold" }}>
                Họ tên
              </TableCell>
              <TableCell sx={{ fontSize: "13px", fontWeight: "bold" }}>
                CCCD
              </TableCell>
              <TableCell sx={{ fontSize: "13px", fontWeight: "bold" }}>
                Ngày sinh
              </TableCell>
              <TableCell sx={{ fontSize: "13px", fontWeight: "bold" }}>
                Giới tính
              </TableCell>
              <TableCell sx={{ fontSize: "13px", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ fontSize: "13px", fontWeight: "bold" }}>
                SĐT
              </TableCell>
              <TableCell sx={{ fontSize: "13px", fontWeight: "bold" }}>
                Địa chỉ
              </TableCell>
              <TableCell sx={{ fontSize: "13px", fontWeight: "bold" }}>
                Vai trò
              </TableCell>
              <TableCell sx={{ fontSize: "13px", fontWeight: "bold" }}>
                Ngày đăng ký
              </TableCell>
              <TableCell sx={{ fontSize: "13px", fontWeight: "bold" }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ fontSize: "13px", fontWeight: "bold" }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchByphone.map((user, index) => (
              <TableRow key={index} sx={{ fontSize: "13px" }}>
                <TableCell sx={{ fontSize: "10px" }}>{index + 1}</TableCell>
                <TableCell sx={{ fontSize: "10px" }}>{user.fullName}</TableCell>
                <TableCell sx={{ fontSize: "10px" }}>{user.idCard}</TableCell>
                <TableCell sx={{ fontSize: "10px" }}>
                  {user.dateOfBirth}
                </TableCell>
                <TableCell sx={{ fontSize: "10px" }}>{user.gender}</TableCell>
                <TableCell sx={{ fontSize: "10px" }}>{user.email}</TableCell>
                <TableCell sx={{ fontSize: "10px" }}>{user.phone}</TableCell>
                <TableCell sx={{ fontSize: "10px" }}>{user.address}</TableCell>
                <TableCell sx={{ fontSize: "10px" }}>{user.role}</TableCell>
                <TableCell sx={{ fontSize: "10px" }}>{user.createAt}</TableCell>
                <TableCell sx={{ fontSize: "10px" }}>
                  {user.enabled ? "Đã kích hoạt" : "Chưa kích hoạt"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ minWidth: 0, padding: "6px", borderRadius: "4px" }}
                    onClick={() => handleDelete(user.phone, user.fullName)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <>
        <Button
          component={NavLink}
          to="/signup-manager"
          className="normal-case"
          style={{ textDecoration: "none" }}
        >
          <Plus size={20} />
        </Button>
      </>
    </>
  );
}

export default GetManagerByAdmin;
