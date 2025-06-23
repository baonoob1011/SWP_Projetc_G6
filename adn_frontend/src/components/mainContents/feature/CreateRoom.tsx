import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import CustomSnackBar from '../userinfor/Snackbar';
import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

type Room = {
  roomName: string;
  openTime: string;
  closeTime: string;
  roomId: string;
};

const CreateRoom = () => {
  const [room, setRoom] = useState<Room>({
    roomName: '',
    openTime: '',
    closeTime: '',
    roomId:'',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const [auth, setAuth] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    setAuth(
      localStorage.getItem('role') === 'ADMIN' ||
        localStorage.getItem('role') === 'MANAGER'
    );
  }, []);

  const [isRoom, setIsRoom] = useState<Room[]>([]);

  const fetchData = async()=>{
    try {
      const res = await fetch('http://localhost:8080/api/room/get-all-room',
         {
          method:'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      if(!res.ok){
        toast.error('không thể lấy danh sách phòng')
      }else{
        const data = await res.json();
        setIsRoom(data)
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
    setRoom((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (roomId: string) => {
    const confirmation = await Swal.fire({
      title: 'Bạn chắc chắn muốn xóa phòng này?',
      text: 'Quá trình này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Có, xóa!',
    });

    if (confirmation.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:8080/api/room/delete-room/${roomId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) {
          toast.error('Không thể xóa phòng');
        } else {
          Swal.fire('Đã xóa!', 'Phòng đã được xóa thành công.', 'success');
          // Cập nhật lại danh sách phòng sau khi xóa
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
      const res = await fetch('http://localhost:8080/api/room/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(room),
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
          title: 'Tạo phòng thành công',
          showConfirmButton: false,
          timer: 1300,
        });

        setRoom({ roomName: '', openTime: '', closeTime: '' ,roomId:''});
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
              Quản Lý phòng xét nghiệm
            </h1>
            <p className="text-sm text-slate-600 mt-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Quản lý và tổ chức dữ liệu phòng xét nghiệm một cách hiệu quả
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              component={NavLink} 
              to="/schedule"
              className="!bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 !text-white !font-semibold !py-3 !px-6 !rounded-xl !transition-all !duration-300 !transform hover:!scale-105 !shadow-lg hover:!shadow-xl !flex !items-center !gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Tạo thời khóa biểu</span>
            </Button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {showCreateForm ? 'Ẩn Form' : 'Thêm Phòng'}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Thêm Phòng Mới</h3>
                  <p className="text-blue-100 text-sm">Điền thông tin chi tiết phòng xét nghiệm bên dưới</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-sky-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      Tên Phòng
                    </div>
                  </label>
                  <input
                    type="text"
                    name="roomName"
                    className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-700 placeholder-slate-400 bg-blue-50/30 hover:border-blue-200"
                    value={room.roomName}
                    onChange={handleInput}
                    placeholder="Nhập tên phòng (VD: A101, B205...)"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      Giờ Mở Cửa
                    </div>
                  </label>
                  <input
                    type="time"
                    name="openTime"
                    className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-700 placeholder-slate-400 bg-blue-50/30 hover:border-blue-200"
                    value={room.openTime}
                    onChange={handleInput}
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-red-100 to-rose-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      </div>
                      Giờ Đóng Cửa
                    </div>
                  </label>
                  <input
                    type="time"
                    name="closeTime"
                    className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-700 placeholder-slate-400 bg-blue-50/30 hover:border-blue-200"
                    value={room.closeTime}
                    onChange={handleInput}
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
                  Tạo Phòng
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-xl shadow-blue-100/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <h2 className="text-xl font-bold text-white">Danh Sách Phòng</h2>
            <p className="text-blue-100 text-sm mt-1">Tất cả phòng đã đăng ký</p>
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
                      Tên Phòng
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Giờ Mở Cửa
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Giờ Đóng Cửa
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
                {isRoom.map((room, index) => (
                  <tr key={index} className="hover:bg-blue-50/50 transition-colors duration-200">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold rounded-full shadow-lg">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-900 font-semibold">
                      {room.roomName}
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-600 font-medium">
                      {room.openTime}
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-600 font-medium">
                      {room.closeTime}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDelete(room.roomId)}
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
                {isRoom.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-slate-700 font-bold text-lg">Không tìm thấy phòng nào</p>
                          <p className="text-sm text-slate-500 mt-1">Bắt đầu bằng cách tạo phòng đầu tiên của bạn</p>
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

export default CreateRoom;