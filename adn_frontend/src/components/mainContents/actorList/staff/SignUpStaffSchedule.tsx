/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomSnackBar from '../../userinfor/Snackbar';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { startOfWeek, addWeeks, endOfWeek } from 'date-fns';
import {
  CircularProgress,
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
  const [isLoading, setIsLoading] = useState(false);

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
  const [showCreateForm, setShowCreateForm] = useState(false);
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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (!selectedRoom) {
      setSnackbar({
        open: true,
        message: 'Vui lòng chọn phòng',
        severity: 'error',
      });
      setIsLoading(false);

      return;
    }

    if (!selectedStaff1 || !selectedStaff2) {
      setSnackbar({
        open: true,
        message: 'Vui lòng chọn đủ 2 nhân viên',
        severity: 'error',
      });
      setIsLoading(false);
      return;
    }

    const staffSlotRequest: { staffId: string }[] = [
      { staffId: selectedStaff1 },
      { staffId: selectedStaff2 },
    ];

    const requestBody = {
      slotRequest: {
        slotDate: isSchedule.slotDate,
        startTime: isSchedule.startTime + ':00',
        endTime: isSchedule.endTime + ':00',
      },
      staffSlotRequest: staffSlotRequest,
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
        setSnackbar({
          open: true,
          message: 'Nhập đầy đủ thời gian theo phòng',
          severity: 'error',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Xếp lịch thành công',
          showConfirmButton: false,
          timer: 1500,
        });
        await fetchSlot();

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
        setShowCreateForm(false);
      }
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: 'Lỗi hệ thống',
        severity: 'error',
      });
    } finally {
      setIsLoading(false); // 👉 Stop loading
    }
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Không có quyền truy cập
            </h3>
            <p className="text-gray-600">
              Bạn không có quyền truy cập vào trang này
            </p>
          </div>
        </div>
      </div>
    );
  }
  const handleBack = () => {
    navigate('/manager/room');
  };
  return (
    <div className="min-h-screen bg-white ml-10">
      <div className="max-w-full">
        {/* Statistics Header */}
        <div className="bg-[#405EF3] rounded-lg p-6 mb-6 relative">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-white text-lg font-semibold">
              Quản lý lịch làm việc
            </h2>
          </div>
          {/* Breadcrumb */}
          <div className="flex items-center mb-6 text-blue-100">
            <span className="text-white font-medium">Manager</span>
            <span className="mx-2">›</span>
            <span>Lịch làm việc</span>
          </div>
          <div className="bg-green-500 bg-opacity-30 rounded-lg p-2 max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-blue-100 text-xl">
              Tổng số lịch làm: {isSlot.length}
            </div>
          </div>
        </div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Thêm lịch làm việc
          </button>
        </div>
        <button
          onClick={handleBack}
          type="button"
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Quay về
        </button>
        {/* Create Form - Collapsible */}
        {showCreateForm && (
          <div className="bg-white border border-gray-200 rounded-lg mb-6 shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Tạo lịch làm việc mới
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phòng <span className="text-red-500">*</span>
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={selectedRoom}
                      onChange={handleRoomChange}
                      input={<OutlinedInput />}
                      displayEmpty
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: '#fff',
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhân viên phụ <span className="text-red-500">*</span>
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={selectedStaff1}
                      onChange={handleStaff1Change}
                      input={<OutlinedInput />}
                      displayEmpty
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: '#fff',
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
                        <em style={{ color: '#9ca3af' }}>
                          ----Chọn Nhân Viên----
                        </em>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhân viên thu mẫu <span className="text-red-500">*</span>
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={selectedStaff2}
                      onChange={handleStaff2Change}
                      input={<OutlinedInput />}
                      displayEmpty
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: '#fff',
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
                        <em style={{ color: '#9ca3af' }}>
                          ----Chọn Nhân Viên Thu Mẫu----
                        </em>
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
                  <label
                    htmlFor="slotDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Ngày <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    id="slotDate"
                    name="slotDate"
                    value={isSchedule.slotDate}
                    onChange={handleInput}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="startTime"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Giờ bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    id="startTime"
                    name="startTime"
                    value={isSchedule.startTime}
                    onChange={handleInput}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="endTime"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Giờ kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    id="endTime"
                    name="endTime"
                    value={isSchedule.endTime}
                    onChange={handleInput}
                    required
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[130px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} style={{ color: 'white' }} />
                ) : (
                  'Tạo Lịch Làm'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Week Navigation */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
              onClick={() => setCurrentWeekStart((prev) => addWeeks(prev, -1))}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Tuần Trước
            </button>

            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-800">
                Tuần từ {currentWeekStart.toLocaleDateString()} đến{' '}
                {endOfWeek(currentWeekStart, {
                  weekStartsOn: 1,
                }).toLocaleDateString()}
              </h3>
            </div>

            <button
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
              onClick={() => setCurrentWeekStart((prev) => addWeeks(prev, 1))}
            >
              Tuần Sau
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <StaffScheduleTable
            slots={isSlot}
            currentWeekStart={currentWeekStart}
          />
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
