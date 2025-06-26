import { useEffect, useState } from 'react';
import CustomSnackBar from '../userinfor/Snackbar';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

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
    locationId:''
  });

  const [auth, setAuth] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
const [isLocation, setIsLocation] = useState<Location[]>([


]
)
  useEffect(() => {
    setAuth(
      localStorage.getItem('role') === 'ADMIN' ||
        localStorage.getItem('role') === 'MANAGER'
    );
  }, []);

  const fetchData = async()=>{
    try {
      const res = await fetch('http://localhost:8080/api/location/get-all-location',
         {
          method:'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      if(!res.ok){
        toast.error('không thể lấy danh sách địa điểm')
      }else{
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

        setLocation({ addressLine: '', district: '', city: '',locationId:''});
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
    <div className="min-h-screen bg-gradient-to-br p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Quản Lý Địa Điểm
            </h1>
            <p className="text-sm text-slate-600 mt-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Quản lý và tổ chức dữ liệu địa điểm một cách hiệu quả
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              {showCreateForm ? 'Ẩn Form' : 'Thêm Địa Điểm'}
            </button>
          </div>
        </div>

        {/* Create Form - Collapsible */}
        <div className={`transition-all duration-500 ease-in-out ${showCreateForm ? 'opacity-100 max-h-[500px] transform translate-y-0' : 'opacity-0 max-h-0 overflow-hidden transform -translate-y-4'}`}>
          <div className="bg-white rounded-2xl border border-blue-100 shadow-xl shadow-blue-100/50">
            <div className="border-b border-blue-50 px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Thêm Địa Điểm Mới</h3>
                  <p className="text-blue-100 text-sm">Điền thông tin chi tiết địa điểm bên dưới</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    Địa Chỉ
                  </label>
                  <input
                    type="text"
                    name="addressLine"
                    className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-700 placeholder-slate-400 bg-blue-50/30 hover:border-blue-200"
                    value={location.addressLine}
                    onChange={handleInput}
                    placeholder="Nhập địa chỉ chi tiết"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    Quận/Huyện
                  </label>
                  <input
                    type="text"
                    name="district"
                    className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-700 placeholder-slate-400 bg-blue-50/30 hover:border-blue-200"
                    value={location.district}
                    onChange={handleInput}
                    placeholder="Nhập quận/huyện"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    Thành Phố
                  </label>
                  <input
                    type="text"
                    name="city"
                    className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-700 placeholder-slate-400 bg-blue-50/30 hover:border-blue-200"
                    value={location.city}
                    onChange={handleInput}
                    placeholder="Nhập thành phố"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-10 pt-6 border-t border-blue-50">
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tạo Địa Điểm
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-xl shadow-blue-100/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <h2 className="text-xl font-bold text-white">Danh Sách Địa Điểm</h2>
            <p className="text-blue-100 text-sm mt-1">Tất cả địa điểm đã đăng ký</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-50/50 border-b border-blue-100">
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      STT
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Địa Chỉ
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Quận/Huyện
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Thành Phố
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-50">
                {isLocation.map((location, index) => (
                  <tr key={index} className="hover:bg-blue-50/50 transition-colors duration-200">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold rounded-full shadow-lg">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-900 font-semibold">
                      {location.addressLine}
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-600 font-medium">
                      {location.district}
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-600 font-medium">
                      {location.city}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDelete(location.locationId)}
                          className="p-3 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-xl transition-all duration-200 transform hover:scale-110"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {isLocation.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-slate-700 font-bold text-lg">Không tìm thấy địa điểm nào</p>
                          <p className="text-sm text-slate-500 mt-1">Bắt đầu bằng cách tạo địa điểm đầu tiên của bạn</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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