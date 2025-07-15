import { useEffect, useState } from 'react';
import './ServiceList.css';
import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import CustomSnackBar from '../userinfor/Snackbar';
import Swal from 'sweetalert2';

type PriceItem = {
  time: string;
  price: number;
  priceTmp: number;
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
type Props = {
  reloadTrigger?: boolean;
};
const ServiceList = ({ reloadTrigger }: Props) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [auth, setAuth] = useState(false);

  // const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  // const [updatedName, setUpdatedName] = useState('');
  // const [updatedDescription, setUpdatedDescription] = useState('');
  // const [updatedPrices, setUpdatedPrices] = useState<PriceItem[]>([]);

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
    fetchServices(); // gọi khi reloadTrigger thay đổi
  }, [reloadTrigger]);

  // const startEdit = (service: ServiceItem) => {
  //   setEditingServiceId(service.serviceRequest.serviceId);
  //   setUpdatedName(service.serviceRequest.serviceName);
  //   setUpdatedDescription(service.serviceRequest.description);
  //   setUpdatedPrices(service.priceListRequest.map((p) => ({ ...p }))); // new state
  // };

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

  // const handleUpdate = async (serviceId: number) => {
  //   if (!updatedName.trim()) {
  //     setSnackbar({
  //       open: true,
  //       message: 'Tên dịch vụ không được để trống',
  //       severity: 'error',
  //     });
  //     return;
  //   }
  //   const currentService = services.find(
  //     (s) => s.serviceRequest.serviceId === serviceId
  //   );
  //   if (!currentService) {
  //     setSnackbar({
  //       open: true,
  //       message: 'Không tìm thấy dịch vụ',
  //       severity: 'error',
  //     });
  //     return;
  //   }
  //   try {
  //     const formData = new FormData();
  //     const today = new Date().toISOString().split('T')[0];
  //     const requestPayload = {
  //       updateServiceTestRequest: {
  //         serviceName: updatedName,
  //         description: updatedDescription,
  //         registerDate: currentService.serviceRequest.registerDate,
  //       },
  //       priceListRequest: [{ time: today, price: updatedPrices }],
  //     };
  //     formData.append(
  //       'request',
  //       new Blob([JSON.stringify(requestPayload)], { type: 'application/json' })
  //     );

  //     const res = await fetch(
  //       `http://localhost:8080/api/services/update-service/${serviceId}`,
  //       {
  //         method: 'PUT',
  //         headers: { Authorization: `Bearer ${token}` },
  //         body: formData,
  //       }
  //     );
  //     if (!res.ok) throw new Error('Cập nhật không thành công');
  //     await Swal.fire({
  //       title: 'Cập nhật thành công',
  //       icon: 'success',
  //       timer: 1500,
  //       showConfirmButton: false,
  //     });
  //     setEditingServiceId(null);
  //     fetchServices();
  //   } catch (err: unknown) {
  //     let message = 'Lỗi cập nhật';
  //     if (err instanceof Error) message = err.message;
  //     setSnackbar({
  //       open: true,
  //       message,
  //       severity: 'error',
  //     });
  //   }
  // };
  const showDiscountColumn = services.some((service) =>
    service.priceListRequest.some((price) => price.priceTmp > 0)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-600 font-semibold">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
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
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-600 font-semibold">Lỗi: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-full">
        {/* Services Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    STT
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Tên Dịch Vụ
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Loại
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Mô Tả
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Ngày Đăng Ký
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Giá Hiện Tại
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </th>
                {showDiscountColumn ? (
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      Giá Khuyến Mãi
                      <svg
                        className="w-3 h-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                        />
                      </svg>
                    </div>
                  </th>
                ) : null}

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {services.map((s, index) => {
                // const isEditing =
                //   editingServiceId === s.serviceRequest.serviceId;

                return (
                  <tr
                    key={s.serviceRequest.serviceId}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-blue-600 font-medium border-r border-gray-200">
                      {index + 1}
                    </td>

                    {/* Tên dịch vụ */}
                    <td className="px-4 py-3 border-r border-gray-200">
                      <span className="text-sm text-gray-800">
                        {s.serviceRequest.serviceName}
                      </span>
                    </td>

                    {/* Loại */}
                    <td className="px-4 py-3 border-r border-gray-200">
                      <span className="text-sm text-gray-600">
                        {s.serviceRequest.serviceType}
                      </span>
                    </td>

                    {/* Mô tả */}
                    <td className="px-4 py-3 border-r border-gray-200">
                      <span className="text-sm text-gray-600 max-w-xs truncate block">
                        {s.serviceRequest.description}
                      </span>
                    </td>

                    {/* Ngày đăng ký */}
                    <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                      {new Date(
                        s.serviceRequest.registerDate
                      ).toLocaleDateString('vi-VN')}
                    </td>

                    {/* Giá hiện tại */}
                    <td className="px-4 py-3 border-r border-gray-200">
                      {s.priceListRequest.length > 0 ? (
                        <div className="space-y-1">
                          {s.priceListRequest.map((priceItem, idx) => (
                            <div key={idx}>
                              <div className="text-sm font-medium text-gray-800">
                                {priceItem.price.toLocaleString()}đ
                              </div>
                              <small className="text-xs text-gray-500">
                                ({priceItem.time})
                              </small>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">
                          Chưa có
                        </span>
                      )}
                    </td>
                    {showDiscountColumn ? (
                      <td className="px-4 py-3 border-r border-gray-200">
                        {s.priceListRequest.length > 0 ? (
                          <div className="space-y-1">
                            {s.priceListRequest.map((priceItem, idx) => (
                              <div key={idx}>
                                <div className="text-sm font-medium text-blue-600">
                                  {priceItem.priceTmp.toLocaleString()}đ
                                </div>
                                <small className="text-xs text-gray-500">
                                  ({priceItem.time})
                                </small>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">
                            Chưa có
                          </span>
                        )}
                      </td>
                    ) : null}

                    {/* Hành động */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors"
                          onClick={() =>
                            handleDelete(s.serviceRequest.serviceId)
                          }
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                        <Button
                          component={NavLink}
                          to={`/newPrice/${s.serviceRequest.serviceId}`}
                          className="!p-2 !text-purple-500 hover:!text-purple-700 hover:!bg-purple-100 !rounded-md !transition-colors !min-w-0"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </Button>
                        <Button
                          component={NavLink}
                          to={`/discount/${s.serviceRequest.serviceId}`}
                          className="!p-2 !text-orange-500 hover:!text-orange-700 hover:!bg-orange-100 !rounded-md !transition-colors !min-w-0"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {services.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Không tìm thấy dịch vụ nào
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

export default ServiceList;
