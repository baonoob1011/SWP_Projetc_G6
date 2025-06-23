import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import CustomSnackBar from '../userinfor/Snackbar';
import { toast } from 'react-toastify';

type Kit = {
  kitCode: string;
  kitName: string;
  targetPersonCount: string;
  price: string;
  contents: string;
};

const CreateKit = () => {
  const [auth, setAuth] = useState(false);
  const [kit, setKit] = useState<Kit>({
    kitCode: '',
    kitName: '',
    targetPersonCount: '',
    price: '',
    contents: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  useEffect(() => {
    setAuth(
      localStorage.getItem('role') === 'MANAGER' ||
        localStorage.getItem('role') === 'ADMIN'
    );
  }, []);

  const [isKit, setIsKit] = useState<Kit[]>([]);

  const fetchData = async()=>{
    try {
      const res = await fetch('http://localhost:8080/api/kit/get-all-kit-staff',
         {
          method:'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      if(!res.ok){
        toast.error('không thể lấy danh sách Kit')
      }else{
        const data = await res.json();
        setIsKit(data)
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
    setKit((kit) => ({
      ...kit,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8080/api/kit/create-kit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(kit),
      });

      if (!res.ok) {
        let errorMessage = 'Không thể đăng ký'; // mặc định

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
          title: 'Tạo kit thành công',
          showConfirmButton: false,
          timer: 1300,
        });

        setKit({
          kitCode: '',
          kitName: '',
          targetPersonCount: '',
          price: '',
          contents: '',
        });
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Quản Lý Kit
            </h1>
            <p className="text-sm text-slate-600 mt-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
              </svg>
              Quản lý và tổ chức kho kit một cách hiệu quả
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
              </svg>
              {showCreateForm ? 'Ẩn Form' : 'Thêm Kit'}
            </button>
          </div>
        </div>

        {/* Create Form - Collapsible */}
        <div className={`transition-all duration-500 ease-in-out ${showCreateForm ? 'opacity-100 max-h-[800px] transform translate-y-0' : 'opacity-0 max-h-0 overflow-hidden transform -translate-y-4'}`}>
          <div className="bg-white rounded-2xl border border-blue-100 shadow-xl shadow-blue-100/50">
            <div className="border-b border-blue-50 px-8 py-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Thêm Kit Mới</h3>
                  <p className="text-blue-100 text-sm">Điền thông tin chi tiết kit bên dưới</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      Mã Kit
                    </div>
                  </label>
                  <input
                    type="text"
                    name="kitCode"
                    className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-700 placeholder-slate-400 bg-blue-50/30 hover:border-blue-200"
                    value={kit.kitCode}
                    onChange={handleInput}
                    placeholder="Nhập mã kit (ví dụ: KIT001, KIT002...)"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      Tên Kit
                    </div>
                  </label>
                  <input
                    type="text"
                    name="kitName"
                    className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-700 placeholder-slate-400 bg-blue-50/30 hover:border-blue-200"
                    value={kit.kitName}
                    onChange={handleInput}
                    placeholder="Nhập tên kit"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      Giá
                    </div>
                  </label>
                  <input
                    type="number"
                    name="price"
                    className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-700 placeholder-slate-400 bg-blue-50/30 hover:border-blue-200"
                    value={kit.price}
                    onChange={handleInput}
                    placeholder="Nhập giá"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      Số Lượng Người Dự Kiến
                    </div>
                  </label>
                  <input
                    type="text"
                    name="targetPersonCount"
                    className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-700 placeholder-slate-400 bg-blue-50/30 hover:border-blue-200"
                    value={kit.targetPersonCount}
                    onChange={handleInput}
                    placeholder="Nhập số lượng người dự kiến"
                  />
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <label className="block text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    Nội Dung
                  </div>
                </label>
                <input
                  type="text"
                  name="contents"
                  className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-700 placeholder-slate-400 bg-blue-50/30 hover:border-blue-200"
                  value={kit.contents}
                  onChange={handleInput}
                  placeholder="Nhập mô tả nội dung kit"
                />
              </div>

              <div className="flex justify-end mt-10 pt-6 border-t border-blue-50">
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tạo Kit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-xl shadow-blue-100/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
            <h2 className="text-xl font-bold text-white">Danh Sách Kit</h2>
            <p className="text-blue-100 text-sm mt-1">Tất cả các kit đã đăng ký</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-50/50 border-b border-blue-100">
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Mã Kit
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Tên Kit
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Số Lượng Dự Kiến
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Giá
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Nội Dung
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-50">
                {isKit && isKit.length > 0 ? (
                  isKit.map((kit, index) => (
                    <tr key={index} className="hover:bg-blue-50/50 transition-colors duration-200">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-full shadow-lg">
                            {index + 1}
                          </span>
                          <span className="text-sm font-semibold text-slate-900">{kit.kitCode}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-900 font-semibold">
                        {kit.kitName}
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-600 font-medium">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {kit.targetPersonCount} người
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-600 font-medium">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {kit.price}đ
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-600 font-medium max-w-xs truncate">
                        {kit.contents}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-slate-700 font-bold text-lg">Không tìm thấy kit nào</p>
                          <p className="text-sm text-slate-500 mt-1">Bắt đầu bằng cách tạo kit đầu tiên của bạn</p>
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

export default CreateKit;