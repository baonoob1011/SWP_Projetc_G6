import {
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

  // Gọi API lấy dữ liệu người dùng theo số điện thoại
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
      setError(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Lỗi khi tải dữ liệu người dùng';
      setAccount([]);
      setError(message);
      showErrorSnackbar(message);
    }
  };

  useEffect(() => {
    setIsManager(localStorage.getItem('role') === 'STAFF');
  }, []);

  if (!isManager) {
    return null;
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px' }}>
      {/* Search Section */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <TextField
          label="Tìm theo SĐT"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') fetchData();
          }}
          sx={{ 
            minWidth: '300px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#3b82f6',
              },
              '&:hover fieldset': {
                borderColor: '#3b82f6',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3b82f6',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#3b82f6',
              '&.Mui-focused': {
                color: '#3b82f6',
              },
            },
          }}
        />
      </div>

      {/* Blue Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
        borderRadius: '10px 10px 0 0',
        padding: '20px 30px',
        color: 'white'
      }}>
        <h2 style={{ margin: 0, fontWeight: '600', fontSize: '28px' }}>
          Danh Sách Người Dùng
        </h2>
      </div>

      {/* Table Section */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0 0 10px 10px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#3b82f6' }}>
              <th style={{
                padding: '15px',
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                width: '10%'
              }}>
                STT
              </th>
              <th style={{
                padding: '15px',
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                width: '25%'
              }}>
                HỌ VÀ TÊN
              </th>
              <th style={{
                padding: '15px',
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                width: '30%'
              }}>
                EMAIL
              </th>
              <th style={{
                padding: '15px',
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                width: '20%'
              }}>
                SĐT
              </th>
              <th style={{
                padding: '15px',
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                width: '35%'
              }}>
                NGÀY ĐĂNG KÝ
              </th>
            </tr>
          </thead>
          <tbody>
            {account.length > 0 ? (
              account.map((user, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{
                    padding: '20px',
                    textAlign: 'center',
                    borderRight: '1px solid #e5e7eb',
                    backgroundColor: '#f8fafc',
                    width: '10%'
                  }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                    </div>
                  </td>
                  <td style={{
                    padding: '20px',
                    textAlign: 'center',
                    borderRight: '1px solid #e5e7eb',
                    fontWeight: '500',
                    color: '#374151',
                    width: '25%'
                  }}>
                    {user.fullName}
                  </td>
                  <td style={{
                    padding: '20px',
                    textAlign: 'center',
                    borderRight: '1px solid #e5e7eb',
                    color: '#374151',
                    width: '30%'
                  }}>
                    {user.email}
                  </td>
                  <td style={{
                    padding: '20px',
                    textAlign: 'center',
                    borderRight: '1px solid #e5e7eb',
                    color: '#374151',
                    width: '20%'
                  }}>
                    {user.phone}
                  </td>
                  <td style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#374151',
                    width: '35%'
                  }}>
                    {user.createAt}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#9ca3af',
                  fontSize: '16px'
                }}>
                  {error ? error : 'Không tìm thấy người dùng'}
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
