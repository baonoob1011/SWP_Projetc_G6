/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomSnackBar from '../../userinfor/Snackbar';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { startOfWeek, addWeeks, endOfWeek } from 'date-fns';
import {
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import StaffScheduleTable from './CreateStaffSchedule';

type Schedule = {
  staffId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
};

type SlotInfo = {
  slotId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  roomName: string;
  fullNames: string[];
};

type Room = {
  roomId: string;
  roomName: string;
  openTime: string;
  closeTime: string;
  roomStatus: string;
};

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

const SignUpStaffSchedule = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();

  const [isSchedule, setIsSchedule] = useState<Schedule>({
    staffId: staffId || '',
    slotDate: '',
    startTime: '',
    endTime: '',
  });

  const [isRoom, setIsRoom] = useState<Room[]>([]);
  const [isStaff, setIsStaff] = useState<Staff[]>([]);
  const [isCollector, setIsCollector] = useState<Staff[]>([]);
  const [isSlot, setIsSlot] = useState<SlotInfo[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedStaff1, setSelectedStaff1] = useState<string>('');
  const [selectedStaff2, setSelectedStaff2] = useState<string>('');
  const [auth, setAuth] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    setAuth(
      localStorage.getItem('role') === 'ADMIN' ||
        localStorage.getItem('role') === 'MANAGER'
    );
  }, []);

  useEffect(() => {
    setIsSchedule((prev) => ({
      ...prev,
      staffId: staffId || '',
    }));
  }, [staffId]);

  const fetchRoom = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/room/get-all-room', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        localStorage.clear();
        navigate('/login');
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setIsRoom(data);
    } catch (error) {
      console.error('Fetch rooms error:', error);
      toast.error('Không thể lấy danh sách phòng');
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/staff/get-all-staff', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        localStorage.clear();
        navigate('/login');
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setIsStaff(data);
    } catch (error) {
      console.error('Fetch rooms error:', error);
      toast.error('Không thể lấy danh sách nhân viên');
    }
  };

  const fetchCollector = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/staff/get-all-staff-collector',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        localStorage.clear();
        navigate('/login');
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setIsCollector(data);
    } catch (error) {
      console.error('Fetch rooms error:', error);
      toast.error('Không thể lấy danh sách nhân viên');
    }
  };

  const fetchSlot = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/slot/get-all-slot', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        localStorage.clear();
        navigate('/login');
        return;
      }
      if (!res.ok) {
        toast.error('lỗi');
      }

      const data: any[] = await res.json();

      const slotInfo: SlotInfo[] = data.map((item) => ({
        slotId: String(item.slotResponse?.slotId ?? ''),
        slotDate: item.slotResponse?.slotDate ?? '',
        startTime: item.slotResponse?.startTime ?? '',
        endTime: item.slotResponse?.endTime ?? '',
        roomName: item.roomSlotResponse?.roomName ?? '',
        fullNames: item.staffSlotResponses?.map((s: any) => s.fullName) ?? [],
      }));

      setIsSlot(slotInfo);
    } catch (error) {
      console.error('Fetch slots error:', error);
      toast.error('Không thể lấy danh sách lịch làm');
    }
  };

  useEffect(() => {
    if (auth) {
      fetchRoom();
      fetchSlot();
      fetchStaff();
      fetchCollector();
    }
  }, [auth]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoomChange = (event: SelectChangeEvent<string>) => {
    setSelectedRoom(event.target.value);
  };
  const handleStaff1Change = (event: SelectChangeEvent<string>) => {
    setSelectedStaff1(event.target.value);
  };
  const handleStaff2Change = (event: SelectChangeEvent<string>) => {
    setSelectedStaff2(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedRoom) {
      setSnackbar({
        open: true,
        message: 'Vui lòng chọn phòng',
        severity: 'error',
      });
      return;
    }

    const requestBody = {
      slotRequest: {
        slotDate: isSchedule.slotDate,
        startTime: isSchedule.startTime + ':00',
        endTime: isSchedule.endTime + ':00',
      },
      staffSlotRequest: [
        { staffId: selectedStaff1 },
        { staffId: selectedStaff2 },
      ],
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/slot/create-slot?roomId=${selectedRoom}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        const errorMessage = contentType?.includes('application/json')
          ? (await res.json()).message
          : await res.text();

        setSnackbar({
          open: true,
          message: errorMessage || 'Không thể đăng ký',
          severity: 'error',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Xếp lịch thành công',
          showConfirmButton: false,
          timer: 1500,
        });

        // Reset form
        setIsSchedule({
          staffId: '',
          slotDate: '',
          startTime: '',
          endTime: '',
        });
        setSelectedRoom('');
        setSelectedStaff1('');
        setSelectedStaff2('');
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Không có quyền truy cập</h3>
            <p className="text-gray-600">Bạn không có quyền truy cập vào trang này</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản Lý Lịch Làm Việc</h1>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Quản lý và sắp xếp lịch làm việc của nhân viên một cách hiệu quả</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Form Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="px-8 py-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Tạo Lịch Làm Việc Mới</h2>
              <p className="text-blue-100">Tất cả thông tin đăng ký lịch làm việc</p>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    PHÒNG <span className="text-red-500">*</span>
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={selectedRoom}
                      onChange={handleRoomChange}
                      input={<OutlinedInput />}
                      displayEmpty
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: '#f8fafc',
                          '&:hover fieldset': {
                            borderColor: '#3b82f6',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6',
                          },
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em style={{ color: '#9ca3af' }}>----Chọn Phòng----</em>
                      </MenuItem>
                      {isRoom.map((room) => (
                        <MenuItem key={room.roomId} value={room.roomId}>
                          {room.roomName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    NHÂN VIÊN <span className="text-red-500">*</span>
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={selectedStaff1}
                      onChange={handleStaff1Change}
                      input={<OutlinedInput />}
                      displayEmpty
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: '#f8fafc',
                          '&:hover fieldset': {
                            borderColor: '#3b82f6',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6',
                          },
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em style={{ color: '#9ca3af' }}>----Chọn Nhân Viên----</em>
                      </MenuItem>
                      {isStaff.map((staff) => (
                        <MenuItem key={staff.staffId} value={staff.staffId}>
                          {staff.fullName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    THU NGÂN <span className="text-red-500">*</span>
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={selectedStaff2}
                      onChange={handleStaff2Change}
                      input={<OutlinedInput />}
                      displayEmpty
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: '#f8fafc',
                          '&:hover fieldset': {
                            borderColor: '#3b82f6',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6',
                          },
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em style={{ color: '#9ca3af' }}>----Chọn Thu Ngân----</em>
                      </MenuItem>
                      {isCollector.map((staff) => (
                        <MenuItem key={staff.staffId} value={staff.staffId}>
                          {staff.fullName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div>
                  <label htmlFor="slotDate" className="block text-sm font-semibold text-gray-700 mb-3">
                    NGÀY <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    id="slotDate"
                    name="slotDate"
                    value={isSchedule.slotDate}
                    onChange={handleInput}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="startTime" className="block text-sm font-semibold text-gray-700 mb-3">
                    GIỜ BẮT ĐẦU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    id="startTime"
                    name="startTime"
                    value={isSchedule.startTime}
                    onChange={handleInput}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-semibold text-gray-700 mb-3">
                    GIỜ KẾT THÚC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    id="endTime"
                    name="endTime"
                    value={isSchedule.endTime}
                    onChange={handleInput}
                    required
                  />
                </div>
              </div>

              {/* Add Schedule Button */}
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 flex items-center shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Thêm Lịch Làm
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              className="px-6 py-3 bg-white border-2 border-blue-200 text-blue-600 font-medium rounded-xl hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 flex items-center"
              onClick={() => setCurrentWeekStart((prev) => addWeeks(prev, -1))}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Tuần Trước
            </button>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Tuần từ {currentWeekStart.toLocaleDateString()} đến{' '}
                {endOfWeek(currentWeekStart, {
                  weekStartsOn: 1,
                }).toLocaleDateString()}
              </h3>
            </div>
            
            <button
              className="px-6 py-3 bg-white border-2 border-blue-200 text-blue-600 font-medium rounded-xl hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 flex items-center"
              onClick={() => setCurrentWeekStart((prev) => addWeeks(prev, 1))}
            >
              Tuần Sau
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Schedule Table */} 
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <StaffScheduleTable slots={isSlot} currentWeekStart={currentWeekStart} />
        </div>
      </div>

      {/* Snackbar */}
      <CustomSnackBar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
};

export default SignUpStaffSchedule;