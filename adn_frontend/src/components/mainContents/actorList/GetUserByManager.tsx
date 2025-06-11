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
} from '@mui/material';
import { useEffect, useState } from 'react';
import { showErrorSnackbar, showSuccessAlert } from './utils/notifications';
import Swal from 'sweetalert2';

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
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  // ✅ Gọi API lấy dữ liệu
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        'http://localhost:8080/api/manager/get-all-user',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        setError('Không thể lấy dữ liệu');
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        setError('Dữ liệu không hợp lệ');
        return;
      }

      setAccount(data);
    } catch (error) {
      console.error('Lỗi fetch:', error);
      setError('Lỗi khi tải dữ liệu người dùng.');
    }
  };

  // ✅ Xóa người dùng
  const handleDelete = async (phone: string, fullName: string) => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận xóa?',
        text: `Bạn có chắc chắn muốn xóa người dùng ${fullName}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
      });

      if (!result.isConfirmed) {
        return;
      }

      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:8080/api/manager/delete-user?phone=${phone}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Không thể xóa người dùng');
      }

      showSuccessAlert('Thành công', 'Xóa người dùng thành công');
      fetchData();
    } catch (error) {
      console.error('Lỗi xóa:', error);
      showErrorSnackbar(
        error instanceof Error ? error.message : 'Không thể xóa người dùng'
      );
    }
  };

  useEffect(() => {
    setIsManager(localStorage.getItem('role') === 'MANAGER');
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  if (!isManager) {
    return;
  }

  const searchByPhone = account.filter((user) => user.phone.includes(search));

  return (
    <>
      {error && showErrorSnackbar(error)}
      <TableContainer component={Paper} sx={{ flexGrow: 1 }}>
        <TextField
          label="Nhập số điện thoại"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ margin: '10px 5px' }}
        />
        <Table
          sx={{
            fontSize: '13px',
            borderCollapse: 'collapse',
            width: '100%',
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: '13px', border: '1px solid #ccc' }}>
                <strong>ID</strong>
              </TableCell>
              <TableCell sx={{ fontSize: '13px', border: '1px solid #ccc' }}>
                <strong>Họ tên</strong>
              </TableCell>
              <TableCell sx={{ fontSize: '13px', border: '1px solid #ccc' }}>
                <strong>Email</strong>
              </TableCell>
              <TableCell sx={{ fontSize: '13px', border: '1px solid #ccc' }}>
                <strong>SĐT</strong>
              </TableCell>
              <TableCell sx={{ fontSize: '13px', border: '1px solid #ccc' }}>
                <strong>Thao tác</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {searchByPhone.map((user, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: '12px', border: '1px solid #ccc' }}>
                  {index + 1}
                </TableCell>
                <TableCell sx={{ fontSize: '12px', border: '1px solid #ccc' }}>
                  {user.fullName}
                </TableCell>
                <TableCell sx={{ fontSize: '12px', border: '1px solid #ccc' }}>
                  {user.email}
                </TableCell>
                <TableCell sx={{ fontSize: '12px', border: '1px solid #ccc' }}>
                  {user.phone}
                </TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>
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

export default GetUserByManager;
