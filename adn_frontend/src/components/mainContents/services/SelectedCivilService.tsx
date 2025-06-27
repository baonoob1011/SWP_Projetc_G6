/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import MuiRating from '@mui/material/Rating';

const SelectedCivilService = () => {
  const location = useLocation();
  const { price } = location.state || {};
  const { serviceId } = useParams<string>();
  const [service, setService] = useState<any[]>([]);
  const [discount, setDiscount] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/services/get-service?serviceId=${serviceId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (res.ok) setService(await res.json());
      else toast.error('Dịch vụ không tồn tại, hãy tải lại trang');
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDiscount = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/discount/get-discount-by-service?serviceId=${serviceId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (res.ok) setDiscount(await res.json());
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFeedbackData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/feedback/get-all-feedback-of-service?serviceId=${serviceId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (!res.ok) throw new Error('Không thể lấy đánh giá');
      const data = await res.json();
      setFeedbackData(data);
      setFeedbacks(data.allFeedbackResponses || []);
    } catch (err) {
      toast.error('Không thể lấy đánh giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDiscount();
    fetchFeedbackData();
  }, [serviceId]);

  const mapRatingTextToNumber = (ratingText: string): number => {
    switch (ratingText) {
      case 'ONE_STAR':
        return 1;
      case 'TWO_STAR':
        return 2;
      case 'THREE_STAR':
        return 3;
      case 'FOUR_STAR':
        return 4;
      case 'FIVE_STAR':
        return 5;
      default:
        return 0;
    }
  };

  const { averageRating, ratingPercentage } = feedbackData || {};

  return (
    <div className="container " style={{ marginTop: 150 }}>
      {/* === Thông tin dịch vụ và ảnh === */}
      <div className="row mb-4">
        {service.map((svc) => (
          <div key={svc.serviceId} className="col-md-6">
            <div className="card shadow-sm">
              {svc.image && (
                <img
                  src={`data:image/*;base64,${svc.image}`}
                  className="card-img-top img-fluid"
                  alt={svc.serviceName}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{svc.serviceName}</h5>
                <p className="card-text">{svc.description}</p>
                <p className="text-muted">Loại dịch vụ: {svc.serviceType}</p>
              </div>
            </div>
          </div>
        ))}

        {/* === Bảng giá và khuyến mãi === */}
        <div className="col-md-6">
          <div className="mb-4">
            <h5>Bảng giá:</h5>
            {price?.map((item: any, idx: number) => {
              const isDiscountActive = discount.some((d: any) => d.active);
              const currentPrice = isDiscountActive
                ? item.price
                : item.priceTmp || item.price;

              return (
                <div key={idx} className="border rounded p-2 mb-2">
                  <div>
                    <strong>Thời gian:</strong> {item.time}
                  </div>
                  <div>
                    <strong>Giá:</strong>{' '}
                    {isDiscountActive && item.priceTmp ? (
                      <>
                        <span className="text-danger fw-bold">
                          {item.price} VND
                        </span>{' '}
                        <small className="text-muted text-decoration-line-through">
                          {item.priceTmp} VND
                        </small>
                      </>
                    ) : (
                      <span>{currentPrice} VND</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {discount.filter((d) => d.active).length > 0 && (
            <div>
              <h5>Khuyến mãi:</h5>
              {discount
                .filter((d) => d.active)
                .map((d) => (
                  <div
                    key={d.discountId}
                    className="alert alert-success py-2 px-3"
                  >
                    Giảm {d.discountValue}% khi sử dụng dịch vụ!
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* === Nút đặt lịch === */}
      <div className="d-flex gap-3 mb-5">
        {service.map((svc) => (
          <React.Fragment key={svc.serviceId}>
            <NavLink
              to={`/order/at-home/${svc.serviceId}`}
              className="btn btn-primary"
            >
              Đặt lịch tại nhà
            </NavLink>
            <NavLink
              to={`/order/at-center/${svc.serviceId}`}
              className="btn btn-outline-primary"
            >
              Đặt lịch tại cơ sở
            </NavLink>
          </React.Fragment>
        ))}
      </div>

      {/* === Feedback và đánh giá === */}
      <div className="mt-5">
        <h4>Danh sách đánh giá</h4>
        {feedbacks.length === 0 && (
          <div className="text-muted">Chưa có đánh giá nào.</div>
        )}

        <ul className="list-group">
          {feedbacks.map((fb: any) => (
            <li
              className="list-group-item"
              key={fb.feedbackResponse.feedbackId}
            >
              <div className="d-flex justify-content-between">
                <div>
                  <strong>
                    {fb.userFeedbackResponse?.fullName || 'Khách'}
                  </strong>
                  <div className="text-muted">
                    {new Date(
                      fb.feedbackResponse?.dateSubmitted
                    ).toLocaleDateString()}
                  </div>
                  <div>
                    {fb.feedbackResponse?.feedbackText || 'Không có nhận xét'}
                  </div>
                </div>
                <MuiRating
                  value={mapRatingTextToNumber(fb.feedbackResponse?.rating)}
                  readOnly
                  size="small"
                />
              </div>
            </li>
          ))}
        </ul>

        {/* Thống kê điểm đánh giá */}
        {feedbackData && (
          <div className="mt-4">
            <h5>
              Điểm đánh giá trung bình: {averageRating?.toFixed(2) || '0.00'}/5
            </h5>
            <p>Phân bố đánh giá:</p>
            <ul className="list-unstyled">
              <li>
                1 sao: {ratingPercentage?.ONE_STAR?.toFixed(2) || '0.00'}%
              </li>
              <li>
                2 sao: {ratingPercentage?.TWO_STAR?.toFixed(2) || '0.00'}%
              </li>
              <li>
                3 sao: {ratingPercentage?.THREE_STAR?.toFixed(2) || '0.00'}%
              </li>
              <li>
                4 sao: {ratingPercentage?.FOUR_STAR?.toFixed(2) || '0.00'}%
              </li>
              <li>
                5 sao: {ratingPercentage?.FIVE_STAR?.toFixed(2) || '0.00'}%
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedCivilService;
