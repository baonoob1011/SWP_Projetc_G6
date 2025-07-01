import {
  TextField,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { showErrorSnackbar } from './utils/notifications';
import styles from './GetUserByStaff.module.css';

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
  const [isStaff, setIsStaff] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Gọi API lấy dữ liệu người dùng theo số điện thoại
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!search.trim()) {
      setAccount([]);
      setError('Vui lòng nhập số điện thoại để tìm kiếm');
      return;
    }

    setLoading(true);
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
      setError(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Lỗi khi tải dữ liệu người dùng';
      setAccount([]);
      setError(message);
      showErrorSnackbar(message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchData();
    }
  };

  useEffect(() => {
    setIsStaff(localStorage.getItem('role') === 'STAFF');
  }, []);

  if (!isStaff) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Search Section */}
      <div className={styles.searchCard}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1976d2', fontSize: '20px', fontWeight: '600' }}>
          Tìm kiếm người dùng
        </h3>
        <div className={styles.searchContainer}>
          <TextField
            label="Tìm theo số điện thoại"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyPress}
            className={styles.searchField}
            placeholder="Nhập số điện thoại..."
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={fetchData}
            className={styles.searchButton}
            disabled={loading || !search.trim()}
          >
            {loading ? 'Đang tìm...' : 'Tìm kiếm'}
          </Button>
        </div>
        <p className={styles.instructionText}>
          Nhập số điện thoại và nhấn Enter hoặc click "Tìm kiếm"
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          Thông Tin Người Dùng
        </h2>
      </div>

      {/* Table Section */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th className={styles.headerCell} style={{ width: '10%' }}>STT</th>
              <th className={styles.headerCell} style={{ width: '25%' }}>HỌ VÀ TÊN</th>
              <th className={styles.headerCell} style={{ width: '30%' }}>EMAIL</th>
              <th className={styles.headerCell} style={{ width: '20%' }}>SĐT</th>
              <th className={styles.headerCell} style={{ width: '15%' }}>NGÀY ĐĂNG KÝ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className={styles.loadingContainer}>
                  Đang tìm kiếm...
                </td>
              </tr>
            ) : account.length > 0 ? (
              account.map((user, index) => (
                <tr key={index} className={styles.bodyRow}>
                  <td className={styles.indexCell}>
                    <div className={styles.indexNumber}>
                      {index + 1}
                    </div>
                  </td>
                  <td className={styles.bodyCell}>
                    {user.fullName}
                  </td>
                  <td className={styles.bodyCell}>
                    {user.email}
                  </td>
                  <td className={styles.bodyCell}>
                    {user.phone}
                  </td>
                  <td className={styles.bodyCell}>
                    {user.createAt}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.noData}>
                  {error ? error : 'Chưa có kết quả tìm kiếm'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GetUserByStaff;
