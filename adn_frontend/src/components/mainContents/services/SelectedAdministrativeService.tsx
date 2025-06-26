/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const SelectedAdministrativeService = () => {
  const location = useLocation();
  const { price } = location.state || {};
  const { serviceId } = useParams<string>();
  const [service, setService] = useState<any[]>([]);
  const [discount, setDiscount] = useState<any[]>([]);
  const fetchData = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/services/get-service?serviceId=${serviceId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setService(data);
      } else {
        toast.error('dịch vụ không tồn tại hãy tải lịa trang');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDiscount = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/discount/get-discount-by-service?serviceId=${serviceId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setDiscount(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchDiscount();
  }, []);
  return (
    <div style={{ margin: 200 }}>
      <div>
        {service.map((service) => (
          <div key={service.serviceId}>
            <div>
              {service.image && (
                <img
                  src={`data:image/*;base64,${service.image}`}
                  alt={service.serviceName}
                />
              )}
            </div>
            <div>{service.serviceName}</div>

            <div>{service.description}</div>
            <div>{service.serviceType}</div>
            {price?.map((item: any, idx: number) => (
              <div key={idx}>
                <span>
                  {item.time} – {item.price} VND
                </span>
              </div>
            ))}
            <div>
              <NavLink to={`/order/at-center/${service.serviceId}`}>
                Đặt lịch tại cơ sở
              </NavLink>
            </div>
          </div>
        ))}
        {discount
          .filter((discount) => discount.active === true)
          .map((discount) => (
            <div key={discount.discountId}>
              <div>
                {discount.discountValue}
                {'%'}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SelectedAdministrativeService;
