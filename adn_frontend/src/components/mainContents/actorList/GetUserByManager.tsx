import {
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
import styles from './GetUserByManager.module.css';

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
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Gọi API lấy dữ liệu
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
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
      setError(null);
    } catch (error) {
      console.error('Lỗi fetch:', error);
      setError('Lỗi khi tải dữ liệu người dùng.');
    } finally {
      setLoading(false);
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
        cancelButtonColor: '#1976d2',
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
    fetchData();
  }, []);

  const searchByPhone = account.filter((user) =>
    (user.phone || '').includes(search)
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Quản Lý Người Dùng</h1>
        <p className={styles.subtitle}>Danh sách người dùng trong hệ thống</p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h2 className={styles.statNumber}>{account.length}</h2>
          <p className={styles.statLabel}>Tổng người dùng</p>
        </div>
        <div className={styles.statCard}>
          <h2 className={styles.statNumber}>
            {account.filter((user) => user.enabled).length}
          </h2>
          <p className={styles.statLabel}>Đang hoạt động</p>
        </div>
        <div className={styles.statCard}>
          <h2 className={styles.statNumber}>{searchByPhone.length}</h2>
          <p className={styles.statLabel}>Kết quả tìm kiếm</p>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Table Card */}
      <div className={styles.tableCard}>
        {/* Search Section */}
        <div className={styles.searchContainer}>
          <TextField
            label="Tìm kiếm theo số điện thoại"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchField}
            placeholder="Nhập số điện thoại để tìm kiếm..."
          />
        </div>

        {/* Table */}
        <TableContainer className={styles.tableContainer}>
          <Table className={styles.table}>
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell className={styles.headerCell}>STT</TableCell>
                <TableCell className={styles.headerCell}>Họ tên</TableCell>
                <TableCell className={styles.headerCell}>Email</TableCell>
                <TableCell className={styles.headerCell}>SĐT</TableCell>
                <TableCell className={styles.headerCell}>Thao tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {searchByPhone.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className={styles.noData}>
                    {search
                      ? 'Không tìm thấy người dùng với số điện thoại này'
                      : 'Chưa có người dùng nào'}
                  </TableCell>
                </TableRow>
              ) : (
                searchByPhone.map((user, index) => (
                  <TableRow key={index} className={styles.bodyRow}>
                    <TableCell className={styles.bodyCell}>
                      {index + 1}
                    </TableCell>
                    <TableCell className={styles.bodyCell}>
                      {user.fullName}
                    </TableCell>
                    <TableCell className={styles.bodyCell}>
                      {user.email}
                    </TableCell>
                    <TableCell className={styles.bodyCell}>
                      {user.phone}
                    </TableCell>
                    <TableCell className={styles.actionCell}>
                      <Button
                        variant="contained"
                        size="small"
                        className={styles.deleteButton}
                        onClick={() => handleDelete(user.phone, user.fullName)}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default GetUserByManager;
