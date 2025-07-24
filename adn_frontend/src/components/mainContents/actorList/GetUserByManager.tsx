import { Trash2 } from 'lucide-react';
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
      <div className="bg-white p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nhập số điện thoại để tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-16" />
            <col className="w-40" />
            <col className="w-56" />
            <col className="w-32" />
            <col className="w-28" />
            <col className="w-24" />
            <col className="w-20" />
          </colgroup>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200">
                STT
              </th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                Họ tên
              </th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                Email
              </th>
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200">
                SĐT
              </th>
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200">
                Trạng thái
              </th>
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200">
                Vai trò
              </th>
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {searchByPhone.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  {search
                    ? 'Không tìm thấy người dùng với số điện thoại này'
                    : 'Chưa có người dùng nào'}
                </td>
              </tr>
            ) : (
              searchByPhone.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-3 text-sm text-blue-600 font-medium text-center border-r border-gray-200">
                    #{String(index + 1).padStart(4, '0')}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-800 border-r border-gray-200 truncate" title={user.fullName}>
                    {user.fullName}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600 border-r border-gray-200 truncate" title={user.email}>
                    {user.email}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600 text-center border-r border-gray-200">
                    {user.phone}
                  </td>
                  <td className="px-3 py-3 text-sm text-center border-r border-gray-200">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.enabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.enabled ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600 text-center border-r border-gray-200">
                    {user.role}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleDelete(user.phone, user.fullName)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded border border-red-200 hover:border-red-300 transition-colors"
                        title="Xóa người dùng"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GetUserByManager;