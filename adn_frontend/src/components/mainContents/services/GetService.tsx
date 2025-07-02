import { useEffect, useState } from 'react';
import './ServiceList.css';
import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import CustomSnackBar from '../userinfor/Snackbar';
import Swal from 'sweetalert2';

type PriceItem = {
  time: string;
  price: number;
};

type UserCreateServiceResponse = {
  fullName: string;
};

type ServiceRequest = {
  serviceId: number;
  serviceName: string;
  registerDate: string;
  description: string;
  serviceType: string;
  image?: string;
  active: boolean;
};

type ServiceItem = {
  serviceRequest: ServiceRequest;
  priceListRequest: PriceItem[];
  userCreateServiceResponse: UserCreateServiceResponse;
};

const ServiceList = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auth, setAuth] = useState(false);

  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState<number>(0);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error' as 'success' | 'error',
  });

  const token = localStorage.getItem('token');

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        'http://localhost:8080/api/services/get-all-service',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error('Không thể lấy dữ liệu dịch vụ');

      const data = await res.json();
      const fixedData = Array.isArray(data)
        ? data.map((item) => ({
          ...item,
          serviceRequest: {
            ...item.serviceRequest,
            serviceId: Number(item.serviceRequest.serviceId) || 0,
          },
        }))
        : [];

      setServices(fixedData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    setAuth(role === 'ADMIN' || role === 'MANAGER');
    fetchServices();
  }, []);

  const startEdit = (service: ServiceItem) => {
    setEditingServiceId(service.serviceRequest.serviceId);
    setUpdatedName(service.serviceRequest.serviceName);
    setUpdatedDescription(service.serviceRequest.description);
    const latestPrice = service.priceListRequest.at(-1)?.price || 0;
    setUpdatedPrice(latestPrice);
  };

  const handleDelete = async (serviceId: number) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xoá dịch vụ này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Huỷ',
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/services/delete-service/${serviceId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error('Xoá không thành công');
      await Swal.fire({
        title: 'Xoá thành công',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      fetchServices();
    } catch (err: unknown) {
      let message = 'Lỗi xoá dịch vụ';
      if (err instanceof Error) message = err.message;
      setSnackbar({
        open: true,
        message,
        severity: 'error',
      });
    }
  };

  const handleUpdate = async (serviceId: number) => {
    if (!updatedName.trim()) {
      setSnackbar({
        open: true,
        message: 'Tên dịch vụ không được để trống',
        severity: 'error',
      });
      return;
    }
    const currentService = services.find(
      (s) => s.serviceRequest.serviceId === serviceId
    );
    if (!currentService) {
      setSnackbar({
        open: true,
        message: 'Không tìm thấy dịch vụ',
        severity: 'error',
      });
      return;
    }
    try {
      const formData = new FormData();
      const today = new Date().toISOString().split('T')[0];
      const requestPayload = {
        updateServiceTestRequest: {
          serviceName: updatedName,
          description: updatedDescription,
          registerDate: currentService.serviceRequest.registerDate,
        },
        priceListRequest: { time: today, price: updatedPrice },
      };
      formData.append(
        'request',
        new Blob([JSON.stringify(requestPayload)], { type: 'application/json' })
      );

      const res = await fetch(
        `http://localhost:8080/api/services/update-service/${serviceId}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!res.ok) throw new Error('Cập nhật không thành công');
      await Swal.fire({
        title: 'Cập nhật thành công',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      setEditingServiceId(null);
      fetchServices();
    } catch (err: unknown) {
      let message = 'Lỗi cập nhật';
      if (err instanceof Error) message = err.message;
      setSnackbar({
        open: true,
        message,
        severity: 'error',
      });
    }
  };

  if (!auth) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br p-6 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-600 font-semibold">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-semibold">Lỗi: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Services Table */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-xl shadow-blue-100/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <h2 className="text-xl font-bold text-white">Danh Sách Dịch Vụ</h2>
            <p className="text-blue-100 text-sm mt-1">Tất cả dịch vụ đã đăng ký</p>
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
                      Tên Dịch Vụ
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Loại
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Mô Tả
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Ngày Đăng Ký
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Giá Hiện Tại
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
                {services.map((s, index) => {
                  const latestPrice = s.priceListRequest.at(-1);
                  const isEditing = editingServiceId === s.serviceRequest.serviceId;

                  return (
                    <tr key={s.serviceRequest.serviceId} className="hover:bg-blue-50/50 transition-colors duration-200">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold rounded-full shadow-lg">
                          {index + 1}
                        </span>
                      </td>

                      {/* Tên dịch vụ */}
                      <td className="px-8 py-6">
                        {isEditing ? (
                          <input
                            className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-700 placeholder-slate-400 bg-blue-50/30 hover:border-blue-200"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            placeholder="Nhập tên dịch vụ"
                          />
                        ) : (
                          <span className="text-sm text-slate-900 font-semibold">
                            {s.serviceRequest.serviceName}
                          </span>
                        )}
                      </td>

                      {/* Loại */}
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200">
                          {s.serviceRequest.serviceType}
                        </span>
                      </td>

                      {/* Mô tả */}
                      <td className="px-8 py-6">
                        {isEditing ? (
                          <textarea
                            className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-700 placeholder-slate-400 bg-blue-50/30 hover:border-blue-200 resize-none"
                            rows={2}
                            value={updatedDescription}
                            onChange={(e) => setUpdatedDescription(e.target.value)}
                            placeholder="Nhập mô tả"
                          />
                        ) : (
                          <span className="text-sm text-slate-600 font-medium">
                            {s.serviceRequest.description}
                          </span>
                        )}
                      </td>

                      {/* Ngày đăng ký */}
                      <td className="px-8 py-6 text-sm text-slate-600 font-medium">
                        {new Date(s.serviceRequest.registerDate).toLocaleDateString('vi-VN')}
                      </td>

                      {/* Giá hiện tại */}
                      <td className="px-8 py-6">
                        {isEditing ? (
                          <input
                            type="number"
                            min={0}
                            className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-700 placeholder-slate-400 bg-blue-50/30 hover:border-blue-200"
                            value={updatedPrice}
                            onChange={(e) => setUpdatedPrice(Number(e.target.value))}
                            placeholder="Nhập giá"
                          />
                        ) : latestPrice ? (
                          <div>
                            <div className="text-sm font-bold text-green-600">
                              {latestPrice.price.toLocaleString()} VNĐ
                            </div>
                            <small className="text-xs text-slate-500">
                              ({new Date(latestPrice.time).toLocaleDateString('vi-VN')})
                            </small>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 italic">Chưa có</span>
                        )}
                      </td>

                      {/* Hành động */}
                      <td className="px-8 py-6 whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <button
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-xl transition-all duration-200 transform hover:scale-110"
                              onClick={() => handleUpdate(s.serviceRequest.serviceId)}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-xl transition-all duration-200 transform hover:scale-110"
                              onClick={() => setEditingServiceId(null)}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-xl transition-all duration-200 transform hover:scale-110"
                              onClick={() => startEdit(s)}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-xl transition-all duration-200 transform hover:scale-110"
                              onClick={() => handleDelete(s.serviceRequest.serviceId)}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            <Button
                              component={NavLink}
                              to={`/newPrice/${s.serviceRequest.serviceId}`}
                              className="!p-2 !text-purple-500 hover:!text-purple-700 hover:!bg-purple-100 !rounded-xl !transition-all !duration-200 transform hover:scale-110 !min-w-0"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </Button>
                            <Button
                              component={NavLink}
                              to={`/discount/${s.serviceRequest.serviceId}`}
                              className="!p-2 !text-orange-500 hover:!text-orange-700 hover:!bg-orange-100 !rounded-xl !transition-all !duration-200 transform hover:scale-110 !min-w-0"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {services.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-slate-700 font-bold text-lg">Không tìm thấy dịch vụ nào</p>
                          <p className="text-sm text-slate-500 mt-1">Bắt đầu bằng cách tạo dịch vụ đầu tiên của bạn</p>
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

export default ServiceList;