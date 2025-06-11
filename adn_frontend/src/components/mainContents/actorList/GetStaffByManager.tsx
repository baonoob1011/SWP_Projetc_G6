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
} from "@mui/material";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { showErrorSnackbar, showSuccessAlert } from './utils/notifications';
import Swal from 'sweetalert2';

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
  const [error, setError] = useState<string | null>(null);

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
      if (!res.ok) {
        setError('Không thể lấy dữ liệu');
        return;
      }
      const data = await res.json();
      setAccount(data);
    } catch (error) {
      console.log(error);
      setError('Không thể lấy dữ liệu');
    }
  };

  useEffect(() => {
    setIsManager(localStorage.getItem("role") === "MANAGER");
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (phone: string, fullName: string) => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận xóa?',
        text: `Bạn có chắc chắn muốn xóa nhân viên ${fullName}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      });

      if (!result.isConfirmed) {
        return;
      }

      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/api/manager/delete-staff?phone=${phone}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error('Không thể xóa nhân viên');
      }

      showSuccessAlert('Thành công', 'Xóa nhân viên thành công');
      fetchData();
    } catch (error) {
      console.error(error);
      showErrorSnackbar(error instanceof Error ? error.message : 'Mất kết nối với hệ thống');
    }
  };

  if (!isManager) {
    return;
  }

  const searchByphone = account.filter((user) => user.phone.includes(search))

  return (
    <>
      {error && showErrorSnackbar(error)}
      <TableContainer component={Paper} sx={{flexGrow: 1}}>
        <TextField
          label="Nhập số điện thoại"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ margin: "10px 5px" }}
        />
        <Table sx={{ fontSize: "13px" }}>
          <TableHead>
            <TableRow>
              {/** Dòng tiêu đề với border */}
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ccc" }}>
                ID
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ccc" }}>
                Họ tên
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ccc" }}>
                CCCD
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ccc" }}>
                Ngày sinh
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ccc" }}>
                Giới tính
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ccc" }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ccc" }}>
                SĐT
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ccc" }}>
                Địa chỉ
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ccc" }}>
                Vai trò
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ccc" }}>
                Ngày đăng ký
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ccc" }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", border: "1px solid #ccc" }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {searchByphone.map((user, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: "10px", border: "1px solid #ccc" }}>
                  {index + 1}
                </TableCell>
                <TableCell sx={{ fontSize: "10px", border: "1px solid #ccc" }}>
                  {user.fullName}
                </TableCell>
                <TableCell sx={{ fontSize: "10px", border: "1px solid #ccc" }}>
                  {user.idCard}
                </TableCell>
                <TableCell sx={{ fontSize: "10px", border: "1px solid #ccc" }}>
                  {user.dateOfBirth}
                </TableCell>
                <TableCell sx={{ fontSize: "10px", border: "1px solid #ccc" }}>
                  {user.gender}
                </TableCell>
                <TableCell sx={{ fontSize: "10px", border: "1px solid #ccc" }}>
                  {user.email}
                </TableCell>
                <TableCell sx={{ fontSize: "10px", border: "1px solid #ccc" }}>
                  {user.phone}
                </TableCell>
                <TableCell sx={{ fontSize: "10px", border: "1px solid #ccc" }}>
                  {user.address}
                </TableCell>
                <TableCell sx={{ fontSize: "10px", border: "1px solid #ccc" }}>
                  {user.role}
                </TableCell>
                <TableCell sx={{ fontSize: "10px", border: "1px solid #ccc" }}>
                  {user.createAt}
                </TableCell>
                <TableCell sx={{ fontSize: "10px", border: "1px solid #ccc" }}>
                  {user.enabled ? "Đã kích hoạt" : "Chưa kích hoạt"}
                </TableCell>
                <TableCell sx={{ border: "1px solid #ccc" }}>
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
    </>
  );
}

export default GetStaffByManager;
