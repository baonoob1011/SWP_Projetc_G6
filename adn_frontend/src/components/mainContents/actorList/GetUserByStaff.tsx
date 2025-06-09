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
} from '@mui/material';
import { useEffect, useState } from 'react';
import { showErrorSnackbar } from './utils/notifications';

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
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  // ✅ Gọi API lấy dữ liệu người dùng theo số điện thoại
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!search) {
      setAccount([]);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/staff/get-user-phone?phone=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Không tìm thấy người dùng với số điện thoại này');
      }

      const data = await res.json();
      if (!data) {
        throw new Error('Không tìm thấy dữ liệu người dùng');
      }
      
      setAccount([data]); // ép object thành array
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Lỗi fetch:', error);
      setAccount([]); // clear kết quả cũ
      showErrorSnackbar(error instanceof Error ? error.message : 'Lỗi khi tải dữ liệu người dùng');
    }
  };

  useEffect(() => {
    setIsManager(localStorage.getItem('role') === 'STAFF');
  }, []);

  if (!isManager) {
    return null;
  }

  return (
    <>
      {error && showErrorSnackbar(error)}
      <TableContainer component={Paper} sx={{ flexGrow: 1, marginTop: 20 }}>
        <TextField
          label="Tìm theo SĐT"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') fetchData();
          }}
          sx={{ margin: '10px 5px' }}
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
            {account.length > 0 ? (
              account.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.createAt}</TableCell>
                  <TableCell>
                    {user.enabled ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không tìm thấy người dùng
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default GetUserByStaff;
