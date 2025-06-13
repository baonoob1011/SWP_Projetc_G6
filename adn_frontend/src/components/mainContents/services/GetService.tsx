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
  if (loading) return <div className="text-center mt-4">Đang tải...</div>;
  if (error)
    return <div className="text-danger text-center mt-4">Lỗi: {error}</div>;

  return (
    <div
      className="container py-4 service-list-container"
      style={{
        background: 'linear-gradient(to right, #e3f2fd, #ffffff)',
        borderRadius: '12px',
        padding: '25px',
        boxShadow: '0 0 15px rgba(33, 150, 243, 0.1)',
      }}
    >
      <h2
        className="mb-4 text-primary text-center"
        style={{ fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}
      >
        Quản lý Dịch vụ
      </h2>

      {services.length === 0 ? (
        <div className="text-muted text-center">Không có dịch vụ nào.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center align-middle table-medical">
            <thead className="table-primary text-start">
              <tr style={{ fontWeight: '600' }}>
                <th>Số thứ tự</th>
                <th>Tên dịch vụ</th>
                <th>Loại</th>
                <th>Mô tả</th>
                <th>Ngày đăng ký</th>
                <th>Giá hiện tại</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody className="text-start">
              {services.map((s, index) => {
                const latestPrice = s.priceListRequest.at(-1);
                const isEditing =
                  editingServiceId === s.serviceRequest.serviceId;

                return (
                  <tr key={s.serviceRequest.serviceId}>
                    <td>{index + 1}</td>

                    {/* Tên dịch vụ */}
                    <td style={{ minWidth: '160px' }}>
                      {isEditing ? (
                        <input
                          className="form-control form-control-sm"
                          style={{ borderColor: '#0d6efd' }}
                          value={updatedName}
                          onChange={(e) => setUpdatedName(e.target.value)}
                        />
                      ) : (
                        <span style={{ fontWeight: 500, color: '#0d47a1' }}>
                          {s.serviceRequest.serviceName}
                        </span>
                      )}
                    </td>

                    {/* Loại */}
                    <td style={{ minWidth: '100px' }}>
                      <span className="badge text-dark">
                        {s.serviceRequest.serviceType}
                      </span>
                    </td>

                    {/* Mô tả */}
                    <td style={{ minWidth: '220px' }}>
                      {isEditing ? (
                        <textarea
                          className="form-control form-control-sm"
                          style={{ borderColor: '#0d6efd' }}
                          rows={2}
                          value={updatedDescription}
                          onChange={(e) =>
                            setUpdatedDescription(e.target.value)
                          }
                        />
                      ) : (
                        <span>{s.serviceRequest.description}</span>
                      )}
                    </td>

                    {/* Ngày đăng ký */}
                    <td style={{ minWidth: '120px', color: '#555' }}>
                      {new Date(
                        s.serviceRequest.registerDate
                      ).toLocaleDateString('vi-VN')}
                    </td>

                    {/* Giá hiện tại */}
                    <td style={{ minWidth: '160px' }}>
                      {isEditing ? (
                        <input
                          type="number"
                          min={0}
                          className="form-control form-control-sm"
                          style={{ borderColor: '#0d6efd' }}
                          value={updatedPrice}
                          onChange={(e) =>
                            setUpdatedPrice(Number(e.target.value))
                          }
                        />
                      ) : latestPrice ? (
                        <>
                          <div style={{ fontWeight: 600, color: '#2e7d32' }}>
                            {latestPrice.price.toLocaleString()} VNĐ
                          </div>
                          <small className="text-muted">
                            (
                            {new Date(latestPrice.time).toLocaleDateString(
                              'vi-VN'
                            )}
                            )
                          </small>
                        </>
                      ) : (
                        <span className="text-muted">Chưa có</span>
                      )}
                    </td>

                    {/* Hành động */}
                    <td style={{ minWidth: '160px' }}>
                      {isEditing ? (
                        <>
                          <button
                            className="btn btn-sm btn-outline-success me-1"
                            onClick={() =>
                              handleUpdate(s.serviceRequest.serviceId)
                            }
                          >
                            💾 Lưu
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setEditingServiceId(null)}
                          >
                            ❌ Huỷ
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => startEdit(s)}
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleDelete(s.serviceRequest.serviceId)
                            }
                          >
                            🗑️ Xoá
                          </button>
                          <Button
                            component={NavLink}
                            to={`/newPrice/${s.serviceRequest.serviceId}`}
                            className="btn btn-sm btn-outline-secondary"
                          >
                            ➕ thêm giá
                          </Button>
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
