import React, { useEffect, useState } from 'react';
import CustomSnackBar from "../userinfor/Snackbar";

type PriceItem = {
  time: string;
  price: number;
};

type ServiceResponse = {
  sampleCollectionMethods: string[];
};

type ServiceItem = {
  serviceRequest: {
    serviceName: string;
    description: string;
    serviceType: string;
    image?: string; // base64 image
  };
  priceListRequest: PriceItem[];
  serviceResponses: ServiceResponse[];
};

interface ApiError extends Error {
  message: string;
}

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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success"
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/services/get-all-civil-service',
          { method: 'GET' }
        );
        if (!response.ok) {
          setSnackbar({
            open: true,
            message: "Không thể lấy dữ liệu dịch vụ",
            severity: "error"
          });
          setLoading(false);
          return;
        }
        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        const error = err as ApiError;
        console.error(error);
        setError(error.message || 'Đã xảy ra lỗi');
        setSnackbar({
          open: true,
          message: error.message || "Đã xảy ra lỗi khi tải dữ liệu",
          severity: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <p>Đang tải danh sách dịch vụ...</p>;
  if (error) return <p style={{ color: 'red' }}>Lỗi: {error}</p>;

  return (
    <>
      <section>
        <div style={{ padding: '20px' }}>
          <h2 style={{ marginBottom: '20px' }}>Danh sách dịch vụ dân sự</h2>
          {services.length === 0 ? (
            <p>Không có dịch vụ nào.</p>
          ) : (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
              }}
            >
              {services.map((service, index) => (
                <div
                  key={index}
                  style={{
                    width: '300px',
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    padding: '15px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {/* Ảnh dịch vụ */}
                  {service.serviceRequest.image && (
                    <img
                      src={`data:image/*;base64,${service.serviceRequest.image}`}
                      alt={service.serviceRequest.serviceName}
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '10px',
                      }}
                    />
                  )}

                  {/* Thông tin */}
                  <h3 style={{ textAlign: 'center' }}>
                    {service.serviceRequest.serviceName}
                  </h3>
                  <p>
                    <strong>Loại:</strong>{' '}
                    {translateServiceType(service.serviceRequest.serviceType)}
                  </p>
                  <p>
                    <strong>Mô tả:</strong> {service.serviceRequest.description}
                  </p>

                  <div style={{ marginTop: '10px', width: '100%' }}>
                    <strong>Bảng giá:</strong>
                    {service.priceListRequest?.map((item, idx) => (
                      <div key={idx} style={{ marginTop: 6 }}>
                        <div>
                          <strong>Thời gian:</strong> {item.time}
                        </div>
                        <div>
                          <strong>Giá tiền:</strong> {item.price.toLocaleString()}{' '}
                          VNĐ
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '10px', width: '100%' }}>
                    <strong>Phương pháp lấy mẫu:</strong>
                    {service.serviceResponses?.[0]?.sampleCollectionMethods
                      .length ? (
                      service.serviceResponses[0].sampleCollectionMethods.map(
                        (method, idx) => (
                          <p key={idx}>{translateSampleMethod(method)}</p>
                        )
                      )
                    ) : (
                      <p>Không có dữ liệu</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <CustomSnackBar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default CivilServiceList;
