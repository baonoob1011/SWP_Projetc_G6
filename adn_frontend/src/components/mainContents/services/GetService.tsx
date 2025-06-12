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

interface ApiError extends Error {
  message: string;
}

const ServiceList = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auth, setAuth] = useState(false);

  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success"
  });

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

    const latestPrice = service.priceListRequest.length
      ? service.priceListRequest[service.priceListRequest.length - 1].price
      : 0;
    setUpdatedPrice(latestPrice);
    setSelectedFile(null);
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        priceListRequest: newPriceItem,
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
  if (loading)
    return (
      <div className="text-center mt-4">Đang tải danh sách dịch vụ...</div>
    );
  if (error)
    return <div className="text-danger text-center mt-4">Lỗi: {error}</div>;

  return (
    <>
      <div className="container py-4">
        <h2 className="mb-4">Danh sách dịch vụ</h2>
        {services.length === 0 ? (
          <div className="text-muted">Không có dịch vụ nào.</div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {services.map((service) => {
              const { serviceRequest, priceListRequest } = service;
              const isEditing = editingServiceId === serviceRequest.serviceId;

              return (
                <div className="col" key={serviceRequest.serviceId}>
                  <div className="card h-100 shadow-sm">
                    {serviceRequest.image && !isEditing && (
                      <img
                        src={`data:image/*;base64,${serviceRequest.image}`}
                        alt="service"
                        className="card-img-top img-fluid"
                      />
                    )}

                    <div className="card-body">
                      {isEditing ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdate(serviceRequest.serviceId);
                          }}
                        >
                          <div className="mb-3">
                            <label className="form-label">Tên dịch vụ</label>
                            <input
                              className="form-control"
                              value={updatedName}
                              onChange={(e) => setUpdatedName(e.target.value)}
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Mô tả</label>
                            <textarea
                              className="form-control"
                              value={updatedDescription}
                              onChange={(e) =>
                                setUpdatedDescription(e.target.value)
                              }
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">
                              Ảnh mới (tuỳ chọn)
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              accept="image/*"
                              onChange={(e) =>
                                setSelectedFile(e.target.files?.[0] || null)
                              }
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">
                              Thời gian cập nhật giá
                            </label>
                            <input
                              className="form-control"
                              value={new Date().toLocaleDateString('vi-VN')}
                              disabled
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Giá mới (VNĐ)</label>
                            <input
                              type="number"
                              min={0}
                              className="form-control"
                              value={updatedPrice}
                              onChange={(e) =>
                                setUpdatedPrice(Number(e.target.value))
                              }
                              required
                            />
                          </div>

                          <div className="d-flex justify-content-between">
                            <button type="submit" className="btn btn-primary">
                              Lưu
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setEditingServiceId(null)}
                            >
                              Hủy
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <h5 className="card-title">
                            {serviceRequest.serviceName}
                          </h5>
                          <p className="card-text">
                            <strong>Loại:</strong> {serviceRequest.serviceType}
                          </p>
                          <p className="card-text">
                            <strong>Ngày đăng ký:</strong>{' '}
                            {serviceRequest.registerDate}
                          </p>
                          <p className="card-text">
                            <strong>Mô tả:</strong> {serviceRequest.description}
                          </p>

                          <div className="card-text">
                            <strong>Giá hiện tại:</strong>
                            <br />
                            {priceListRequest.length > 0 ? (
                              <>
                                <small className="text-muted">
                                  Cập nhật lần cuối:{' '}
                                  {new Date(
                                    priceListRequest[
                                      priceListRequest.length - 1
                                    ].time
                                  ).toLocaleDateString('vi-VN')}
                                </small>
                                <div>
                                  {priceListRequest[
                                    priceListRequest.length - 1
                                  ].price.toLocaleString()}{' '}
                                  VNĐ
                                </div>
                              </>
                            ) : (
                              <span className="text-muted">Chưa có bảng giá</span>
                            )}
                          </div>

                          <button
                            className="btn btn-outline-primary mt-3"
                            onClick={() => startEdit(service)}
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => handleDelete(serviceRequest.serviceId)}
                          >
                            Xoá
                          </button>
                        </>
                      )}

                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
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
