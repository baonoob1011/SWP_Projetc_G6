import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { showErrorSnackbar, showSuccessAlert } from './utils/notifications';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';
import styles from './GetStaffByManager.module.css';

type Staff = {
  idCard: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  staffId: string;
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
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await fetch(
        'http://localhost:8080/api/manager/get-all-staff',
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        setError('Không thể lấy dữ liệu');
        return;
      }
      const data = await res.json();
      setAccount(data);
      setError(null);
    } catch (error) {
      console.log(error);
      setError('Không thể lấy dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsManager(localStorage.getItem('role') === 'MANAGER');
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
        cancelButtonColor: '#1976d2',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
      });

      if (!result.isConfirmed) {
        return;
      }

      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:8080/api/manager/delete-staff?phone=${phone}`,
        {
          method: 'DELETE',
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
      showErrorSnackbar(
        error instanceof Error ? error.message : 'Mất kết nối với hệ thống'
      );
    }
  };

  if (!isManager) {
    return;
  }

  const searchByphone = account.filter((user) => user.phone.includes(search));

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Quản Lý Nhân Viên</h1>
        <p className={styles.subtitle}>Danh sách nhân viên trong hệ thống</p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h2 className={styles.statNumber}>{account.length}</h2>
          <p className={styles.statLabel}>Tổng nhân viên</p>
        </div>
        <div className={styles.statCard}>
          <h2 className={styles.statNumber}>{account.filter(staff => staff.enabled).length}</h2>
          <p className={styles.statLabel}>Đang hoạt động</p>
        </div>
        <div className={styles.statCard}>
          <h2 className={styles.statNumber}>{searchByphone.length}</h2>
          <p className={styles.statLabel}>Kết quả tìm kiếm</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

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
                <TableCell className={styles.headerCell}>CCCD</TableCell>
                <TableCell className={styles.headerCell}>Ngày sinh</TableCell>
                <TableCell className={styles.headerCell}>Giới tính</TableCell>
                <TableCell className={styles.headerCell}>Email</TableCell>
                <TableCell className={styles.headerCell}>SĐT</TableCell>
                <TableCell className={styles.headerCell}>Địa chỉ</TableCell>
                <TableCell className={styles.headerCell}>Thao tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {searchByphone.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className={styles.noData}>
                    {search ? 'Không tìm thấy nhân viên với số điện thoại này' : 'Chưa có nhân viên nào'}
                  </TableCell>
                </TableRow>
              ) : (
                searchByphone.map((user, index) => (
                  <TableRow key={index} className={styles.bodyRow}>
                    <TableCell className={styles.bodyCell}>
                      {index + 1}
                    </TableCell>
                    <TableCell className={styles.bodyCell}>
                      {user.fullName}
                    </TableCell>
                    <TableCell className={styles.bodyCell}>
                      {user.idCard}
                    </TableCell>
                    <TableCell className={styles.bodyCell}>
                      {user.dateOfBirth}
                    </TableCell>
                    <TableCell className={styles.bodyCell}>
                      {user.gender}
                    </TableCell>
                    <TableCell className={styles.bodyCell}>
                      {user.email}
                    </TableCell>
                    <TableCell className={styles.bodyCell}>
                      {user.phone}
                    </TableCell>
                    <TableCell className={styles.bodyCell}>
                      {user.address}
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
                      <Button
                        variant="contained"
                        component={NavLink}
                        to={`/slot/${user.staffId}`}
                        size="small"
                        className={styles.addButton}
                      >
                        Slot
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

export default GetStaffByManager;
