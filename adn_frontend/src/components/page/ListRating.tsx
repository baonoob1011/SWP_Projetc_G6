import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Import useNavigate
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  Button,
} from '@mui/material';
import MuiRating from '@mui/material/Rating';
import { toast } from 'react-toastify';

interface Feedback {
  id: number;
  rating: number;
  comment: string;
  user?: { fullName: string; avatarUrl?: string };
  createdAt: string;
}

const ListRating: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [feedbackData, setFeedbackData] = useState<any>(null); // Store average rating data
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate(); // Declare useNavigate to handle navigation

  // Fetch feedback data
  const fetchData = useCallback(async () => {
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
      setFeedbackData(data); // Save the response in state
      setFeedbacks(data.allFeedbackResponses); // Save all feedbacks
    } catch (error) {
      console.error(error);
      toast.error('Không thể lấy danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!feedbackData) {
    return <Typography variant="body1">Chưa có dữ liệu feedback.</Typography>;
  }

  const { averageRating, ratingPercentage } = feedbackData;

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Danh sách đánh giá
      </Typography>

      {/* Hiển thị danh sách đánh giá */}
      {feedbacks.length === 0 ? (
        <Typography>Chưa có đánh giá nào.</Typography>
      ) : (
        <List>
          {feedbacks.map((fb: any) => (
            <ListItem key={fb.feedbackResponse.feedbackId} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar>{fb.userFeedbackResponse.fullName.charAt(0) || 'U'}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    <Typography component="span" variant="subtitle1">
                      {fb.userFeedbackResponse.fullName || 'Khách'}
                    </Typography>
                    <MuiRating
                      value={fb.feedbackResponse.rating}
                      readOnly
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2">
                      {fb.feedbackResponse.feedbackText}
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                    >
                      {new Date(fb.feedbackResponse.dateSubmitted).toLocaleDateString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Hiển thị thông tin đánh giá trung bình và tỷ lệ */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Điểm đánh giá trung bình: {averageRating.toFixed(2)}
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        Tỷ lệ đánh giá:
      </Typography>
      <Typography variant="body1">
        1 Sao: {ratingPercentage.ONE_STAR.toFixed(2)}%
      </Typography>
      <Typography variant="body1">
        2 Sao: {ratingPercentage.TWO_STAR.toFixed(2)}%
      </Typography>
      <Typography variant="body1">
        3 Sao: {ratingPercentage.THREE_STAR.toFixed(2)}%
      </Typography>
      <Typography variant="body1">
        4 Sao: {ratingPercentage.FOUR_STAR.toFixed(2)}%
      </Typography>
      <Typography variant="body1">
        5 Sao: {ratingPercentage.FIVE_STAR.toFixed(2)}%
      </Typography>

      {/* Nút Quay lại */}
      <Button
        variant="outlined"
        onClick={() => navigate(-1)}  // Quay lại trang trước
        sx={{ mt: 3 }}
      >
        Quay lại
      </Button>
    </Box>
  );
};

export default ListRating;
