/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import MuiRating from '@mui/material/Rating';

const SelectedCivilService = () => {
  const location = useLocation();
  const { price } = location.state || {};
  const { serviceId } = useParams<string>();
  const [service, setService] = useState<any[]>([]);
  const [discount, setDiscount] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackData, setFeedbackData] = useState<any>(null); // Store average rating data
  const [loading, setLoading] = useState(false);

  // Fetch service data
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
        toast.error('Dịch vụ không tồn tại, hãy tải lại trang');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch discount data
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

  // Fetch feedback data
  const fetchFeedbackData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/feedback/get-all-feedback-of-service?serviceId=${serviceId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (!res.ok) throw new Error('Không thể lấy danh sách đánh giá');
      const data = await res.json();
      console.log(data); // Log toàn bộ phản hồi để kiểm tra cấu trúc
      setFeedbackData(data); // Save the response in state
      setFeedbacks(data.allFeedbackResponses || []); // Save all feedbacks
    } catch (error) {
      console.error(error);
      toast.error('Không thể lấy danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDiscount();
    fetchFeedbackData();
  }, [serviceId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!service) {
    return (
      <Typography variant="body1">Dữ liệu dịch vụ không tồn tại.</Typography>
    );
  }

  const { averageRating, ratingPercentage } = feedbackData || {};

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
              <NavLink to={`/order/at-home/${service.serviceId}`}>
                Đặt lịch tại nhà
              </NavLink>
            </div>
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

      {/* Rating List */}
      <div style={{ marginTop: '40px' }}>
        <Typography variant="h4" gutterBottom>
          Danh sách đánh giá
        </Typography>

        {feedbacks.length === 0 ? (
          <Typography>Chưa có đánh giá nào.</Typography>
        ) : (
          <List>
            {feedbacks.map((fb: any) => (
              <ListItem
                key={fb.feedbackResponse.feedbackId}
                alignItems="flex-start"
              >
                <ListItemAvatar>
                  <Avatar>
                    {fb.userFeedbackResponse?.fullName?.charAt(0) || 'U'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      <Typography component="span" variant="subtitle1">
                        {fb.userFeedbackResponse?.fullName || 'Khách'}
                      </Typography>
                      <MuiRating
                        value={fb.feedbackResponse?.rating || 0} // Default to 0 if rating is undefined
                        readOnly
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        {fb.feedbackResponse?.feedbackText ||
                          'Không có nhận xét'}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        {new Date(
                          fb.feedbackResponse?.dateSubmitted
                        ).toLocaleDateString() || 'N/A'}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        {/* Average Rating and Rating Percentage */}
        {feedbackData && (
          <div>
            <Typography variant="h6" sx={{ mt: 3 }}>
              Điểm đánh giá trung bình:{' '}
              {averageRating ? averageRating.toFixed(2) : '0.00'}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Tỷ lệ đánh giá:
            </Typography>
            <Typography variant="body1">
              1 Sao: {ratingPercentage?.ONE_STAR?.toFixed(2) || '0.00'}%
            </Typography>
            <Typography variant="body1">
              2 Sao: {ratingPercentage?.TWO_STAR?.toFixed(2) || '0.00'}%
            </Typography>
            <Typography variant="body1">
              3 Sao: {ratingPercentage?.THREE_STAR?.toFixed(2) || '0.00'}%
            </Typography>
            <Typography variant="body1">
              4 Sao: {ratingPercentage?.FOUR_STAR?.toFixed(2) || '0.00'}%
            </Typography>
            <Typography variant="body1">
              5 Sao: {ratingPercentage?.FIVE_STAR?.toFixed(2) || '0.00'}%
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedCivilService;
