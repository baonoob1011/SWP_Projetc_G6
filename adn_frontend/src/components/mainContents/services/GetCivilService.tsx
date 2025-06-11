import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Plus } from 'lucide-react';

type PriceItem = {
  time: string;
  price: number;
};

type ServiceResponse = {
  sampleCollectionMethods: string[];
};

type ServiceItem = {
  serviceRequest: {
    serviceId: number;
    serviceName: string;
    description: string;
    serviceType: string;
    image?: string;
  };
  priceListRequest: PriceItem[];
  serviceResponses: ServiceResponse[];
};

const translateServiceType = (type: string): string => {
  switch (type) {
    case 'CIVIL':
      return 'Dân sự';
    case 'LEGAL':
      return 'Pháp lý';
    case 'IMMIGRATION':
      return 'Di trú';
    default:
      return type;
  }
};

const translateSampleMethod = (method: string): string => {
  switch (method) {
    case 'AT_HOME':
      return 'Tại nhà';
    case 'AT_CLINIC':
      return 'Tại phòng khám';
    default:
      return method;
  }
};

const CivilServiceList = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/services/get-all-civil-service'
        );
        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu dịch vụ');
        }
        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-4">Đang tải danh sách dịch vụ...</div>
    );

  if (error)
    return (
      <div className="alert alert-danger text-center mt-4" role="alert">
        Lỗi: {error}
      </div>
    );

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-primary">Danh sách dịch vụ dân sự</h2>
      {services.length === 0 ? (
        <p className="text-muted">Không có dịch vụ nào.</p>
      ) : (
        <div className="row g-4">
          {services.map((service, index) => (
            <div className="col-md-4" key={index}>
              <div className="card shadow-sm h-100">
                {service.serviceRequest.image && (
                  <img
                    src={`data:image/*;base64,${service.serviceRequest.image}`}
                    className="card-img-top"
                    alt={service.serviceRequest.serviceName}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-center text-success">
                    {service.serviceRequest.serviceName}
                  </h5>
                  <p className="card-text">
                    <strong>Loại:</strong>{' '}
                    {translateServiceType(service.serviceRequest.serviceType)}
                  </p>
                  <p className="card-text">
                    <strong>Mô tả:</strong>{' '}
                    {service.serviceRequest.description || 'Không có mô tả'}
                  </p>

                  <div className="mb-2">
                    <strong>Bảng giá:</strong>
                    {service.priceListRequest.map((item, idx) => (
                      <div key={idx}>
                        <small className="d-block">
                          <strong>Thời gian:</strong> {item.time}
                        </small>
                        <small className="d-block mb-1">
                          <strong>Giá:</strong> {item.price.toLocaleString()}{' '}
                          VNĐ
                        </small>
                      </div>
                    ))}
                  </div>

                  <div className="mb-2">
                    <strong>Phương pháp lấy mẫu:</strong>
                    {service.serviceResponses?.[0]?.sampleCollectionMethods
                      .length ? (
                      service.serviceResponses[0].sampleCollectionMethods.map(
                        (method, idx) => (
                          <div key={idx}>
                            <small>{translateSampleMethod(method)}</small>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-muted mb-1">Không có dữ liệu</p>
                    )}
                  </div>

                  <div className="mt-auto text-center">
                    <NavLink
                      to={`/order/${service.serviceRequest.serviceId}`}
                      className="btn btn-outline-danger btn-sm"
                    >
                      <Plus size={14} className="me-1" />
                      Đặt dịch vụ
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CivilServiceList;
