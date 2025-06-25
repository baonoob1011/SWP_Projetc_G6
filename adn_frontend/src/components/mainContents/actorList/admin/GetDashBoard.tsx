import React, { useEffect, useState } from 'react';

const TotalUserDisplay = () => {
  const [totalUser, setTotalUser] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Kiểm tra token
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Không có token xác thực. Vui lòng đăng nhập lại.');
        }

        console.log('Fetching total users...');

        const res = await fetch(
          'http://localhost:8080/api/dashboard/total-users',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Response status:', res.status);

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Token hết hạn. Vui lòng đăng nhập lại.');
          } else if (res.status === 403) {
            throw new Error('Không có quyền truy cập.');
          } else if (res.status === 404) {
            throw new Error('API endpoint không tồn tại.');
          } else {
            throw new Error(`Lỗi server: ${res.status}`);
          }
        }

        const data = await res.json();
        console.log('Response data:', data);

        // Kiểm tra cấu trúc dữ liệu
        if (data && typeof data.result === 'number') {
          setTotalUser(data.result);
        } else if (data && typeof data === 'number') {
          setTotalUser(data);
        } else if (data && data.totalUsers) {
          setTotalUser(data.totalUsers);
        } else {
          console.error('Dữ liệu không đúng format:', data);
          throw new Error('Dữ liệu trả về không đúng định dạng');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalUsers();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="text-red-500">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="font-medium text-red-600">Có lỗi xảy ra</p>
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Tổng số người dùng đã đăng ký dịch vụ
        </h2>
        <div className="text-5xl font-bold text-blue-600 mb-4">
          {totalUser.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default TotalUserDisplay;
