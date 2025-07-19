import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { showErrorSnackbar, showSuccessAlert } from './utils/notifications';
import Swal from 'sweetalert2';
import './styles/swal-custom.css';

type Staff = {
  idCard: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  staffId: number;
  fullName: string;
  email: string;
  enabled: boolean;
  role: string;
  phone: string;
  createAt: string;
};

function GetStaffByAdmin() {
  const [account, setAccount] = useState<Staff[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:8080/api/staff/get-all-staff', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
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
      text: `Bạn có chắc chắn muốn xóa nhân viên có tên là ${fullName}?`,
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
        `http://localhost:8080/api/admin/delete-staff?phone=${phone}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        setError('Không thể xóa nhân viên');
        return;
      }
      showSuccessAlert('Thành công', 'Xóa nhân viên thành công');
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
              <th className="px-2 py-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200">
                ID
              </th>
              <th className="px-2 py-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200">
                Họ tên
              </th>
              <th className="px-2 py-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200">
                CCCD
              </th>
              <th className="px-2 py-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200">
                Ngày sinh
              </th>
              <th className="px-2 py-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200">
                Giới tính
              </th>
              <th className="px-2 py-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200">
                Email
              </th>
              <th className="px-2 py-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200">
                SĐT
              </th>
              <th className="px-2 py-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200">
                Địa chỉ
              </th>
              <th className="px-2 py-3 text-center text-sm font-medium text-gray-600">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {searchByphone.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-2 py-3 text-sm text-blue-600 font-medium border-r border-gray-200">
                  #{String(index + 1).padStart(4, '0')}
                </td>
                <td className="px-2 py-3 text-sm text-gray-800 border-r border-gray-200 w-48">
                  {user.fullName}
                </td>
                <td className="px-2 py-3 text-sm text-gray-600 border-r border-gray-200">
                  {user.idCard}
                </td>
                <td className="px-2 py-3 text-sm text-gray-600 border-r border-gray-200 w-32">
                  {user.dateOfBirth}
                </td>
                <td className="px-2 py-3 text-sm text-gray-600 border-r border-gray-200">
                  {user.gender}
                </td>
                <td className="px-2 py-3 text-sm text-gray-600 border-r border-gray-200">
                  {user.email}
                </td>
                <td className="px-2 py-3 text-sm text-gray-600 border-r border-gray-200">
                  {user.phone}
                </td>
                <td className="px-2 py-3 text-sm text-gray-600 border-r border-gray-200">
                  {user.address}
                </td>
                <td className="px-2 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(user.phone, user.fullName)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded border border-red-200 hover:border-red-300 transition-colors"
                      title="Xóa nhân viên"
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
                  Không tìm thấy thông tin nhân viên nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Staff Button */}
      <div className="mt-4">
        <NavLink
          to="/signup-staff"
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1 transition-colors no-underline inline-flex"
        >
          <Plus size={16} />
          Thêm nhân viên
        </NavLink>
      </div>
    </div>
  );
}

export default GetStaffByAdmin;
