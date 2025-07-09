import { useEffect, useState } from 'react';
import CustomSnackBar from '../userinfor/Snackbar';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import locationImage from '../../mainContents/feature/featureImage/Location.png'
type Location = {
  addressLine: string;
  district: string;
  city: string;
  locationId: string;
};

const CreateLocation = () => {
  const [location, setLocation] = useState<Location>({
    addressLine: '',
    district: '',
    city: '',
    locationId: ''
  });

  const [auth, setAuth] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [isLocation, setIsLocation] = useState<Location[]>([]);

  useEffect(() => {
    setAuth(
      localStorage.getItem('role') === 'ADMIN' ||
      localStorage.getItem('role') === 'MANAGER'
    );
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/location/get-all-location',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      if (!res.ok) {
        toast.error('không thể lấy danh sách địa điểm')
      } else {
        const data = await res.json();
        setIsLocation(data)
      }

    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleDelete = async (locationId: string) => {
    const confirmation = await Swal.fire({
      title: 'Bạn chắc chắn muốn xóa địa điểm này?',
      text: 'Quá trình này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Có, xóa!',
    });

    if (confirmation.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:8080/api/location/delete-location/${locationId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) {
          toast.error('Không thể xóa địa điểm');
        } else {
          Swal.fire('Đã xóa!', 'Địa điểm đã được xóa thành công.', 'success');
          // Cập nhật lại danh sách địa điểm sau khi xóa
          fetchData();
        }
      } catch (error) {
        console.log(error);
        toast.error('Lỗi hệ thống');
      }
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(
        'http://localhost:8080/api/location/create-location',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(location),
        }
      );

      if (!res.ok) {
        let errorMessage = 'Không thể tạo'; // mặc định

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMessage = errorData.message || JSON.stringify(errorData);
        } else {
          errorMessage = await res.text();
        }

        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Tạo địa chỉ thành công',
          showConfirmButton: false,
          timer: 1300,
        });

        setLocation({ addressLine: '', district: '', city: '', locationId: '' });
        fetchData();
      }
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: 'Lỗi hệ thống',
        severity: 'error',
      });
    }
  };

  if (!auth) {
    return;
  }

  return (
    <div className="min-h-screen bg-white ml-10">
      <div className="max-w-full">
        {/* Statistics Header */}
        <div className="bg-[#405EF3] rounded-lg p-6 mb-6 relative">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-white text-lg font-semibold">Quản lý địa điểm</h2>
          </div>
          {/* Breadcrumb */}
          <div className="flex items-center mb-6 text-blue-100">
            <span className="text-white font-medium">Admin</span>
            <span className="mx-2">›</span>
            <span>địa điểm</span>
          </div>
          <div className="bg-green-500 bg-opacity-30 rounded-lg p-2 max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-blue-100 text-xl">Tổng số địa điểm: {isLocation.length}</div>
          </div>


          {/* Đặt hình ảnh vào trong header */}
          <div className="absolute right-0 bottom-0 mb-4 mr-40">
            <img src={locationImage} alt="location" className="h-40 object-contain" />
          </div>
        </div>


        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Thêm địa điểm
          </button>
        </div>

        {/* Create Form - Collapsible */}
        {showCreateForm && (
          <div className="bg-white border border-gray-200 rounded-lg mb-6 shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Thêm địa điểm mới</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa Chỉ
                  </label>
                  <input
                    type="text"
                    name="addressLine"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={location.addressLine}
                    onChange={handleInput}
                    placeholder="Nhập địa chỉ chi tiết"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phường
                  </label>
                  <input
                    type="text"
                    name="district"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={location.district}
                    onChange={handleInput}
                    placeholder="Nhập quận/huyện"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thành Phố
                  </label>
                  <input
                    type="text"
                    name="city"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={location.city}
                    onChange={handleInput}
                    placeholder="Nhập thành phố"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Tạo Địa Điểm
                </button>
              </div>
            </div>
          </div>
        )}
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
                    Địa chỉ
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Phường
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Thành phố
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
              {isLocation.map((location, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-blue-600 font-medium border-r border-gray-200">
                    #{String(index + 1).padStart(4, '0')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200">
                    {location.addressLine}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                    {location.district}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                    {location.city}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(location.locationId)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded border border-red-200 hover:border-red-300 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {isLocation.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No locations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CustomSnackBar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
};

export default CreateLocation;