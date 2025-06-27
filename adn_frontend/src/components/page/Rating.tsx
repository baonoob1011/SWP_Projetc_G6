import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
} from '@mui/material';
import MuiRating from '@mui/material/Rating';
import { toast } from 'react-toastify';

const Feedback: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { serviceId } = useParams<{ serviceId: string }>();

  const handleSubmit = async () => {
    if (!rating || !feedbackText.trim()) {
      toast.error('Vui lòng chọn đánh giá và nhập bình luận');
      return;
    }
    setSubmitting(true);
    try {
      const mappedRating = rating - 1;
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:8080/api/feedback/create-feedback?serviceId=${serviceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            serviceId: Number(serviceId),
            rating: mappedRating,
            feedbackText,
          }),
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || res.statusText);
      }
      toast.success('Gửi đánh giá thành công');
      setRating(null);
      setFeedbackText('');
    } catch (err) {
      console.error(err);
      toast.error('Gửi đánh giá thất bại');
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Đánh giá dịch vụ
      </Typography>

      {/* Form tạo đánh giá mới */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography>Chia sẻ trải nghiệm của bạn:</Typography>
        <MuiRating
          value={rating}
          onChange={(_, value) => setRating(value)}
          size="large"
        />
        <TextField
          label="Bình luận"
          multiline
          rows={3}
          variant="outlined"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
        />
        <Button
          variant="contained"
          disabled={submitting}
          onClick={handleSubmit}
        >
          {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </Button>
      </Box>
    </Box>
  );
};

export default Feedback;
