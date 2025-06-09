import { useEffect, useState } from 'react';
import './ServiceList.css';

type PriceItem = {
  time: string; // định dạng "YYYY-MM-DD"
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const token = localStorage.getItem('token');

  // Lấy danh sách dịch vụ từ backend
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

  // Bắt đầu sửa dịch vụ
  const startEdit = (service: ServiceItem) => {
    setEditingServiceId(service.serviceRequest.serviceId);
    setUpdatedName(service.serviceRequest.serviceName);
    setUpdatedDescription(service.serviceRequest.description);

    // Lấy giá mới nhất (giá cuối cùng trong danh sách) để hiển thị
    const latestPrice = service.priceListRequest.length
      ? service.priceListRequest[service.priceListRequest.length - 1].price
      : 0;
    setUpdatedPrice(latestPrice);

    setSelectedFile(null);
  };

  // Cập nhật dịch vụ
  const handleUpdate = async (serviceId: number) => {
    if (!updatedName.trim()) {
      alert('Tên dịch vụ không được để trống');
      return;
    }

    // Tìm service hiện tại để lấy thông tin
    const currentService = services.find(
      (s) => s.serviceRequest.serviceId === serviceId
    );
    if (!currentService) {
      alert('Không tìm thấy dịch vụ');
      return;
    }

    try {
      const formData = new FormData();

      // Lấy thời gian hiện tại dạng 'YYYY-MM-DD' cho việc cập nhật giá mới
      const currentDateTime = new Date();
      const today = currentDateTime.toISOString().split('T')[0];

      // Tạo đối tượng giá mới với thời gian cập nhật hiện tại
      const newPriceItem = {
        time: today, // Thời gian cập nhật giá mới (thời gian hiện tại)
        price: updatedPrice,
      };

      const requestPayload = {
        updateServiceTestRequest: {
          serviceName: updatedName,
          description: updatedDescription,
          registerDate: currentService.serviceRequest.registerDate, // Giữ nguyên ngày đăng ký dịch vụ ban đầu
        },
        priceListRequest: newPriceItem, // Thời gian trong bảng giá là thời gian cập nhật mới
      };

      const blob = new Blob([JSON.stringify(requestPayload)], {
        type: 'application/json',
      });

      formData.append('request', blob);
      if (selectedFile) formData.append('file', selectedFile);

      const res = await fetch(
        `http://localhost:8080/api/services/update-service/${serviceId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error('Cập nhật không thành công');

      alert('Cập nhật thành công');
      setEditingServiceId(null);
      setSelectedFile(null);

      // Gọi lại API lấy dữ liệu mới nhất từ backend
      fetchServices();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message || 'Lỗi cập nhật');
    }
  };

  // Hàm format thời gian hiện tại để hiển thị
  const getCurrentDateTimeForDisplay = () => {
    const now = new Date();
    return now.toLocaleDateString('vi-VN');
  };

  if (!auth) return null;
  if (loading)
    return <p className="loading-text">Đang tải danh sách dịch vụ...</p>;
  if (error) return <p className="error-text">Lỗi: {error}</p>;

  return (
    <section className="service-section">
      <h2>Danh sách dịch vụ</h2>
      {services.length === 0 ? (
        <p className="empty-text">Không có dịch vụ nào.</p>
      ) : (
        <div className="services-grid">
          {services.map((service) => {
            const { serviceRequest } = service;
            const isEditing = editingServiceId === serviceRequest.serviceId;

            return (
              <div key={serviceRequest.serviceId} className="service-card">
                {serviceRequest.image && !isEditing && (
                  <img
                    src={`data:image/*;base64,${serviceRequest.image}`}
                    alt="service"
                    className="service-image"
                  />
                )}

                {isEditing ? (
                  <form
                    className="edit-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdate(serviceRequest.serviceId);
                    }}
                  >
                    <div className="form-group">
                      <label>Tên dịch vụ:</label>
                      <input
                        className="form-input"
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Mô tả:</label>
                      <textarea
                        className="form-textarea"
                        value={updatedDescription}
                        onChange={(e) => setUpdatedDescription(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Ảnh mới (tuỳ chọn):</label>
                      <input
                        className="form-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setSelectedFile(e.target.files?.[0] || null)
                        }
                      />
                    </div>

                    <div className="price-input-group">
                      <strong>Cập nhật giá mới:</strong>
                      <div className="form-group">
                        <label>Thời gian cập nhật giá:</label>
                        <input
                          className="form-input"
                          value={getCurrentDateTimeForDisplay()}
                          disabled
                          title="Thời gian này sẽ được lưu khi bạn cập nhật giá mới"
                        />
                      </div>
                      <div className="form-group">
                        <label>Giá tiền mới (VNĐ):</label>
                        <input
                          className="form-input"
                          type="number"
                          min={0}
                          value={updatedPrice}
                          onChange={(e) =>
                            setUpdatedPrice(Number(e.target.value))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="button-group">
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
                  <div className="service-info">
                    <h3>{serviceRequest.serviceName}</h3>
                    <p>
                      <strong>Loại:</strong> {serviceRequest.serviceType}
                    </p>
                    <p>
                      <strong>Ngày đăng ký:</strong>{' '}
                      {serviceRequest.registerDate}
                    </p>
                    <p>
                      <strong>Mô tả:</strong> {serviceRequest.description}
                    </p>

                    <div className="price-section">
                      <strong>Giá hiện tại:</strong>
                      {service.priceListRequest.length > 0 ? (
                        <div className="price-info">
                          <div>
                            Cập nhật lần cuối:{' '}
                            {new Date(
                              service.priceListRequest[
                                service.priceListRequest.length - 1
                              ].time
                            ).toLocaleDateString('vi-VN')}
                          </div>
                          <div>
                            Giá:{' '}
                            {service.priceListRequest[
                              service.priceListRequest.length - 1
                            ].price.toLocaleString()}{' '}
                            VNĐ
                          </div>
                        </div>
                      ) : (
                        <div>Chưa có bảng giá</div>
                      )}
                    </div>

                    <button
                      className="btn btn-edit"
                      onClick={() => startEdit(service)}
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ServiceList;
