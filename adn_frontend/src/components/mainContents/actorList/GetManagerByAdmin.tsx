import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { showErrorSnackbar, showSuccessAlert } from './utils/notifications';
import Swal from 'sweetalert2';
import './styles/swal-custom.css';

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
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        'http://localhost:8080/api/admin/get-all-manager',
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
    } catch (error) {
      console.log(error);
      setError('Không thể lấy dữ liệu');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (phone: string, fullName: string) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: `Bạn có chắc chắn muốn xóa quản lý có tên là ${fullName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      background: '#fff',
      customClass: {
        container: 'custom-swal-container',
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        htmlContainer: 'custom-swal-html',
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel',
      },
    });

    if (!result.isConfirmed) {
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/delete-manager?phone=${phone}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        setError('Không thể xóa quản lý');
        return;
      }
      showSuccessAlert('Thành công', 'Xóa quản lý thành công');
      fetchData();
    } catch (error) {
      console.log(error);
      setError('Mất kết nối với hệ thống');
    }
  };

  const searchByphone = account.filter((user) => user.phone.includes(search));

  return (
    <div className="bg-white">
      {error && showErrorSnackbar(error)}
      
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nhập số điện thoại"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    ID
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Họ tên
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    CCCD
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Ngày sinh
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Giới tính
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Email
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    SĐT
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Địa chỉ
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {searchByphone.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-blue-600 font-medium border-r border-gray-200">
                    #{String(index + 1).padStart(4, '0')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200">
                    {user.fullName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                    {user.idCard}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                    {user.dateOfBirth}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                    {user.gender}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                    {user.phone}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                    {user.address}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(user.phone, user.fullName)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded border border-red-200 hover:border-red-300 transition-colors"
                        title="Xóa quản lý"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {searchByphone.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    Không tìm thấy thông tin quản lý nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Manager Button */}
        <div className="mt-4">
          <button
            onClick={() => {
              window.location.href = '/signup-manager';
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Thêm thông tin Quản Lý
          </button>
        </div>
      </div>
    );
  }

export default GetManagerByAdmin;