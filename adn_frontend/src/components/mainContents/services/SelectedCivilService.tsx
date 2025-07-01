/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
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
  Container,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Divider,
  Paper,
  Stack,
  Fade,
  Zoom,
  Skeleton,
} from '@mui/material';
import MuiRating from '@mui/material/Rating';
import {
  Star,
  StarBorder,
  LocalOffer,
  Home,
  Business,
  Schedule,
  AttachMoney,
  Person,
  DateRange,
  TrendingUp,
  Verified,
} from '@mui/icons-material';

const SelectedCivilService = () => {
  const location = useLocation();
  const { price } = location.state || {};
  const { serviceId } = useParams<string>();
  const [service, setService] = useState<any[]>([]);
  const [discount, setDiscount] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/services/get-service?serviceId=${serviceId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (res.ok) setService(await res.json());
      else navigate('/login');
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
      if (!res.ok) {
        navigate('/login');
      }
      const data = await res.json();
      setFeedbackData(data);
      setFeedbacks(data.allFeedbackResponses || []);
    } catch (err) {
      console.log(err);
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card sx={{ mb: 4, overflow: 'hidden' }}>
          <Box
            sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}
          >
            <Box sx={{ flex: { md: '0 0 400px' } }}>
              <Skeleton variant="rectangular" height={400} />
            </Box>
            <CardContent sx={{ flex: 1, p: 4 }}>
              <Skeleton variant="text" height={60} width="80%" />
              <Skeleton variant="text" height={40} width="40%" sx={{ mb: 2 }} />
              <Skeleton variant="text" height={30} width="60%" sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" height={120} sx={{ mb: 3 }} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="rectangular" height={50} width={200} />
                <Skeleton variant="rectangular" height={50} width={200} />
              </Box>
            </CardContent>
          </Box>
        </Card>
      </Container>
    );
  }

  if (!service || service.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          Dữ liệu dịch vụ không tồn tại.
        </Typography>
      </Container>
    );
  }

  const { averageRating, ratingPercentage } = feedbackData || {};
  const activeDiscounts = discount.filter((d) => d.active === true);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {service.map((svc) => (
        <Fade in={true} timeout={800} key={svc.serviceId}>
          <Card
            sx={{
              mt: 10,
              mb: 4,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(25, 118, 210, 0.08)',
              borderRadius: 3,
              border: '1px solid rgba(25, 118, 210, 0.1)',
              background: 'linear-gradient(145deg, #ffffff 0%, #f5f8ff 100%)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
              }}
            >
              {/* Product Image */}
              <Box sx={{ flex: { md: '0 0 450px' }, position: 'relative' }}>
                {svc.image && (
                  <CardMedia
                    component="img"
                    image={`data:image/*;base64,${svc.image}`}
                    alt={svc.serviceName}
                    sx={{
                      height: { xs: 700, md: 700 },
                      objectFit: 'cover',
                      borderRadius: { xs: 0, md: '12px 0 0 12px' },
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      },
                    }}
                  />
                )}

                {/* Discount Badge */}
                {activeDiscounts.length > 0 && (
                  <Zoom in={true} timeout={600}>
                    <Chip
                      icon={<LocalOffer sx={{ color: 'white !important' }} />}
                      label={`GIẢM ${activeDiscounts[0].discountValue}%`}
                      sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        background:
                          'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                        color: 'white',
                        boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 6px 20px rgba(244, 67, 54, 0.4)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </Zoom>
                )}

                {/* Quality Badge */}
                <Chip
                  icon={<Verified sx={{ color: 'white !important' }} />}
                  label="CHẤT LƯỢNG CAO"
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    background: 'linear-gradient(135deg, #F72009   100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 10px rgba(25, 118, 210, 0.3)',
                  }}
                />
              </Box>

              {/* Product Details */}
              <CardContent sx={{ flex: 1, p: 4 }}>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      mb: 2,
                      fontWeight: 'bold',
                      background:
                        'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.2,
                    }}
                  >
                    {svc.serviceName}
                  </Typography>

                  <Chip
                    label={svc.serviceType}
                    variant="outlined"
                    sx={{
                      mb: 3,
                      borderColor: '#1976d2',
                      color: '#1976d2',
                      fontWeight: 'medium',
                      '&:hover': {
                        backgroundColor: '#1976d2',
                        color: 'white',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  />

                  {/* Rating Summary */}
                  {averageRating ? (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 3,
                        background:
                          'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                        border: '1px solid #1976d2',
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <MuiRating
                          value={averageRating}
                          readOnly
                          precision={0.1}
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: '#ffc107',
                            },
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 'bold', color: '#1565c0' }}
                        >
                          {averageRating.toFixed(1)}/5
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ({feedbacks.length} đánh giá)
                        </Typography>
                        <Chip
                          icon={<TrendingUp />}
                          label="Được yêu thích"
                          size="small"
                          sx={{
                            backgroundColor: '#FF7357',
                            color: 'white',
                            '& .MuiChip-icon': { color: 'white !important' },
                          }}
                        />
                      </Box>
                    </Paper>
                  ) : null}
                </Box>

                <Divider
                  sx={{ my: 3, borderColor: 'rgba(25, 118, 210, 0.1)' }}
                />

                {/* Description */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    background: 'rgba(25, 118, 210, 0.05)',
                    border: '1px solid rgba(25, 118, 210, 0.1)',
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}
                  >
                    Mô tả dịch vụ
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, color: 'text.primary' }}
                  >
                    {svc.description}
                  </Typography>
                </Paper>

                {/* Pricing */}
                {price && price.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Stack spacing={2}>
                      {price.map((item: any, idx: number) => {
                        const isDiscountActive = discount.some(
                          (d: any) => d.active
                        );
                        const currentPrice = isDiscountActive
                          ? item.price
                          : item.priceTmp || item.price;

                        return (
                          <Paper
                            key={idx}
                            elevation={0}
                            sx={{
                              p: 3,
                              background:
                                'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                              border: '1px solid #1976d2',
                              borderRadius: 2,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                              }}
                            >
                              <Schedule sx={{ color: '#F72009' }} />
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: 'bold', color: '#F72009' }}
                              >
                                Thời gian: {item.time}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              {isDiscountActive && item.priceTmp ? (
                                <>
                                  <Typography
                                    variant="h5"
                                    sx={{
                                      fontWeight: 'bold',
                                      color: '#F72009',
                                    }}
                                  >
                                    {item.price} VND
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      textDecoration: 'line-through',
                                      color: 'text.secondary',
                                    }}
                                  >
                                    {item.priceTmp} VND
                                  </Typography>
                                </>
                              ) : (
                                <Typography
                                  variant="h5"
                                  sx={{ fontWeight: 'bold', color: '#0d47a1' }}
                                >
                                  {currentPrice} VND
                                </Typography>
                              )}
                            </Box>
                          </Paper>
                        );
                      })}
                    </Stack>
                  </Box>
                )}
                {/* Active Discounts */}
                {activeDiscounts.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 'bold',
                        color: '#f44336',
                      }}
                    >
                      🎉 Khuyến mãi đang áp dụng
                    </Typography>
                    {activeDiscounts.map((d) => (
                      <Paper
                        key={d.discountId}
                        elevation={0}
                        sx={{
                          p: 2,
                          mb: 2,
                          background:
                            'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                          border: '1px solid #f44336',
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 'bold', color: '#c62828' }}
                        >
                          Giảm {d.discountValue}% khi sử dụng dịch vụ!
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                )}
                <Divider
                  sx={{ my: 4, borderColor: 'rgba(25, 118, 210, 0.1)' }}
                />

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Button
                    component={NavLink}
                    to={`/order/at-home/${svc.serviceId}`}
                    variant="contained"
                    size="large"
                    startIcon={<Home />}
                    sx={{
                      flex: { xs: '1 1 100%', sm: '1 1 auto' },
                      background:
                        'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      py: 2,
                      px: 4,
                      borderRadius: 3,
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        background:
                          'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Đặt lịch tại nhà
                  </Button>
                  <Button
                    component={NavLink}
                    to={`/order/at-center/${svc.serviceId}`}
                    variant="outlined"
                    size="large"
                    startIcon={<Business />}
                    sx={{
                      flex: { xs: '1 1 100%', sm: '1 1 auto' },
                      py: 2,
                      px: 4,
                      borderRadius: 3,
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      borderWidth: 2,
                      borderColor: '#1976d2',
                      color: '#1976d2',
                      '&:hover': {
                        borderWidth: 2,
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        transform: 'translateY(-3px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Đặt lịch tại cơ sở
                  </Button>
                </Box>
              </CardContent>
            </Box>
          </Card>
        </Fade>
      ))}

      {/* Reviews Section */}
      <Fade in={true} timeout={1000}>
        <Card
          sx={{
            mt: 4,
            boxShadow: '0 8px 32px rgba(25, 118, 210, 0.08)',
            borderRadius: 3,
            border: '1px solid rgba(25, 118, 210, 0.1)',
            background: 'linear-gradient(145deg, #ffffff 0%, #f5f8ff 100%)',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {/* Header */}
            <Box
              sx={{
                p: 4,
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 'bold', textAlign: 'center' }}
              >
                Danh sách đánh giá
              </Typography>
            </Box>

            <Box sx={{ p: 4 }}>
              {/* Rating Statistics */}
              {feedbackData && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    mb: 4,
                    background:
                      'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    border: '1px solid #1976d2',
                    borderRadius: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {/* Rating Overview - Left side */}
                    <Box
                      sx={{
                        flex: { md: '0 0 33.333333%' },
                        width: { xs: '100%', md: 'auto' },
                      }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h2"
                          sx={{
                            fontWeight: 'bold',
                            background:
                              'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1,
                          }}
                        >
                          {averageRating ? averageRating.toFixed(2) : '0.00'}
                        </Typography>
                        <MuiRating
                          value={averageRating || 0}
                          readOnly
                          precision={0.1}
                          size="large"
                          sx={{
                            mb: 2,
                            '& .MuiRating-iconFilled': {
                              color: '#ffc107',
                            },
                          }}
                        />
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          sx={{ fontWeight: 'medium' }}
                        >
                          {feedbacks.length} đánh giá
                        </Typography>
                      </Box>
                    </Box>

                    {/* Rating Distribution - Right side */}
                    <Box
                      sx={{
                        flex: { md: '0 0 66.666667%' },
                        width: { xs: '100%', md: 'auto' },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}
                      >
                        📊 Tỷ lệ đánh giá
                      </Typography>
                      {[
                        { stars: 5, key: 'FIVE_STAR' },
                        { stars: 4, key: 'FOUR_STAR' },
                        { stars: 3, key: 'THREE_STAR' },
                        { stars: 2, key: 'TWO_STAR' },
                        { stars: 1, key: 'ONE_STAR' },
                      ].map(({ stars, key }) => {
                        const percentage =
                          ratingPercentage?.[
                            key as keyof typeof ratingPercentage
                          ] || 0;

                        return (
                          <Box
                            key={stars}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                minWidth: '80px',
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{ mr: 1, fontWeight: 'medium' }}
                              >
                                {stars}
                              </Typography>
                              <Star
                                sx={{ color: '#ffc107', fontSize: '1.2rem' }}
                              />
                            </Box>
                            <Box
                              sx={{
                                flex: 1,
                                height: 12,
                                bgcolor: 'rgba(25, 118, 210, 0.1)',
                                borderRadius: 2,
                                mx: 3,
                                overflow: 'hidden',
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${percentage}%`,
                                  height: '100%',
                                  background:
                                    'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
                                  borderRadius: 2,
                                  transition: 'width 0.8s ease',
                                }}
                              />
                            </Box>
                            <Typography
                              variant="body1"
                              sx={{
                                minWidth: '60px',
                                fontWeight: 'bold',
                                color: '#1976d2',
                              }}
                            >
                              {percentage.toFixed(2)}%
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Paper>
              )}

              {/* Individual Reviews */}
              {feedbacks.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    background:
                      'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    borderRadius: 3,
                    border: '2px dashed rgba(25, 118, 210, 0.2)',
                  }}
                >
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    😊 Chưa có đánh giá nào
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Hãy là người đầu tiên đánh giá dịch vụ này!
                  </Typography>
                </Box>
              ) : (
                <List sx={{ '& .MuiListItem-root': { px: 0 } }}>
                  {feedbacks.map((fb: any, index: number) => (
                    <React.Fragment key={fb.feedbackResponse.feedbackId}>
                      <Fade in={true} timeout={600 + index * 100}>
                        <ListItem
                          alignItems="flex-start"
                          sx={{
                            py: 3,
                            '&:hover': {
                              backgroundColor: 'rgba(25, 118, 210, 0.03)',
                              borderRadius: 2,
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                background:
                                  'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                width: 56,
                                height: 56,
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                              }}
                            >
                              {fb.userFeedbackResponse?.fullName?.charAt(0) ||
                                '👤'}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ mb: 2 }}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 'bold',
                                    mb: 1,
                                    color: '#191A1C',
                                    ml: 2,
                                  }}
                                >
                                  {fb.userFeedbackResponse?.fullName || 'Khách'}
                                </Typography>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    flexWrap: 'wrap',
                                  }}
                                >
                                  <MuiRating
                                    value={mapRatingTextToNumber(
                                      fb.feedbackResponse?.rating
                                    )}
                                    readOnly
                                    size="small"
                                    sx={{
                                      '& .MuiRating-iconFilled': {
                                        color: '#ffc107',
                                      },
                                    }}
                                  />
                                  <Chip
                                    icon={<DateRange />}
                                    label={
                                      new Date(
                                        fb.feedbackResponse?.dateSubmitted
                                      ).toLocaleDateString() || 'N/A'
                                    }
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      borderColor: '#1976d2',
                                      color: '#1976d2',
                                      '& .MuiChip-icon': {
                                        color: '#1976d2 !important',
                                      },
                                    }}
                                  />
                                </Box>
                              </Box>
                            }
                            secondary={
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 3,
                                  mt: 2,
                                  background:
                                    'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                                  border: '1px solid rgba(25, 118, 210, 0.15)',
                                  borderRadius: 2,
                                  borderLeft: '4px solid #1976d2',
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{ lineHeight: 1.7, fontStyle: 'italic' }}
                                >
                                  "
                                  {fb.feedbackResponse?.feedbackText ||
                                    'Không có nhận xét'}
                                  "
                                </Typography>
                              </Paper>
                            }
                          />
                        </ListItem>
                      </Fade>
                      {index < feedbacks.length - 1 && (
                        <Divider
                          variant="inset"
                          component="li"
                          sx={{ borderColor: 'rgba(25, 118, 210, 0.1)' }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
};

export default SelectedCivilService;
