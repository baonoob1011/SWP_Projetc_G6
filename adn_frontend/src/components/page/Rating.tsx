import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import MuiRating from '@mui/material/Rating';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';

// Custom styled Rating component with DNA theme
const DNARating = styled(MuiRating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: '#FFD700', // Gold/Yellow stars
    filter: 'drop-shadow(0 3px 6px rgba(255, 215, 0, 0.4))',
  },
  '& .MuiRating-iconHover': {
    color: '#FFA500', // Orange on hover
    filter: 'drop-shadow(0 4px 8px rgba(255, 165, 0, 0.5))',
  },
  '& .MuiRating-iconEmpty': {
    color: '#E8E8E8',
    border: '1px solid #D0D0D0',
    borderRadius: '50%',
  },
  '& .MuiRating-icon': {
    fontSize: '2.8rem',
    margin: '0 10px',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.2) rotate(5deg)',
    },
  },
}));

// Custom Paper with DNA-themed styling
const DNACard = styled(Paper)(({ theme }) => ({
  background: `
    linear-gradient(135deg, 
      rgba(46, 125, 154, 0.03) 0%, 
      rgba(129, 199, 132, 0.05) 25%, 
      rgba(255, 215, 0, 0.02) 50%, 
      rgba(46, 125, 154, 0.04) 75%, 
      rgba(225, 245, 254, 0.6) 100%
    ),
    radial-gradient(ellipse at top left, rgba(46, 125, 154, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba(129, 199, 132, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at center, rgba(255, 215, 0, 0.03) 0%, transparent 70%)
  `,
  border: '2px solid transparent',
  backgroundClip: 'padding-box',
  borderRadius: '20px',
  padding: '36px',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(46, 125, 154, 0.15)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      linear-gradient(45deg, transparent 30%, rgba(255, 215, 0, 0.08) 50%, transparent 70%),
      linear-gradient(-45deg, transparent 30%, rgba(46, 125, 154, 0.05) 50%, transparent 70%)
    `,
    animation: 'shimmer 6s ease-in-out infinite',
    pointerEvents: 'none',
  },
  '@keyframes shimmer': {
    '0%, 100%': {
      opacity: 0.3,
      transform: 'translateX(-100%)',
    },
    '50%': {
      opacity: 0.8,
      transform: 'translateX(100%)',
    },
  },
}));

// DNA Helix decorative element - more dynamic
const DNAHelix = styled(Box)({
  position: 'absolute',
  top: '15px',
  right: '15px',
  width: '50px',
  height: '80px',
  background: `
    linear-gradient(45deg, #2E7D9A 25%, transparent 25%),
    linear-gradient(-45deg, #2E7D9A 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #81C784 75%),
    linear-gradient(-45deg, transparent 75%, #81C784 75%),
    linear-gradient(90deg, rgba(255, 215, 0, 0.1) 50%, transparent 50%)
  `,
  backgroundSize: '10px 10px, 10px 10px, 10px 10px, 10px 10px, 20px 20px',
  backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px, 0 0',
  opacity: 0.15,
  borderRadius: '25px',
  animation: 'dnaRotate 12s linear infinite',
  '@keyframes dnaRotate': {
    '0%': {
      transform: 'rotate(0deg) scale(1)',
    },
    '50%': {
      transform: 'rotate(180deg) scale(1.1)',
    },
    '100%': {
      transform: 'rotate(360deg) scale(1)',
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30px',
    height: '30px',
    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'pulse 3s ease-in-out infinite',
  },
  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 0.3,
      transform: 'translate(-50%, -50%) scale(0.8)',
    },
    '50%': {
      opacity: 0.8,
      transform: 'translate(-50%, -50%) scale(1.2)',
    },
  },
});

const RatingLabel = styled(Typography)(({ theme }) => ({
  color: '#2E7D9A',
  fontWeight: 600,
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  '&::before': {
    content: '"🧬"',
    fontSize: '24px',
  },
}));

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

  const getRatingText = (rating: number | null) => {
    if (!rating) return '';
    const labels = [
      'Không hài lòng',
      'Tạm được', 
      'Bình thường',
      'Hài lòng',
      'Rất hài lòng'
    ];
    return labels[rating - 1];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress sx={{ color: '#2E7D9A' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          color: '#2E7D9A', 
          fontWeight: 700,
          textAlign: 'center',
          mb: 4,
          '&::after': {
            content: '""',
            display: 'block',
            width: '60px',
            height: '4px',
            background: 'linear-gradient(90deg, #2E7D9A, #81C784)',
            margin: '16px auto',
            borderRadius: '2px',
          }
        }}
      >
        Đánh giá dịch vụ xét nghiệm ADN
      </Typography>

      <DNACard elevation={0}>
        <DNAHelix />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <RatingLabel variant="h6">
            Mức độ hài lòng của bạn
          </RatingLabel>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: 3 
          }}>
            <DNARating
              value={rating}
              onChange={(_, value) => setRating(value)}
              size="large"
              precision={1}
            />
            
            {rating && (
              <Typography 
                sx={{ 
                  mt: 2, 
                  color: '#2E7D9A', 
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(46, 125, 154, 0.1) 100%)',
                  padding: '12px 20px',
                  borderRadius: '25px',
                  border: '2px solid rgba(255, 215, 0, 0.3)',
                  boxShadow: '0 4px 12px rgba(255, 215, 0, 0.2)',
                  animation: 'fadeInUp 0.5s ease-out',
                  '@keyframes fadeInUp': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateY(20px)',
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                ⭐ {getRatingText(rating)}
              </Typography>
            )}
          </Box>

          <Divider sx={{ 
            my: 3, 
            background: 'linear-gradient(90deg, transparent, #B3E5FC, transparent)' 
          }} />

          <Typography 
            sx={{ 
              mb: 2, 
              color: '#2E7D9A', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            💬 Chia sẻ trải nghiệm của bạn:
          </Typography>
          
          <TextField
            label="Nhận xét về chất lượng dịch vụ"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Hãy chia sẻ cảm nhận của bạn về quy trình xét nghiệm, thời gian chờ kết quả, độ chính xác và sự hỗ trợ từ đội ngũ nhân viên..."
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: '#fff',
                '&:hover fieldset': {
                  borderColor: '#2E7D9A',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2E7D9A',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#2E7D9A',
              },
            }}
          />
          
          <Button
            variant="contained"
            fullWidth
            disabled={submitting}
            onClick={handleSubmit}
            sx={{
              py: 1.5,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2E7D9A 0%, #1B5E73 100%)',
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(46, 125, 154, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1B5E73 0%, #0D4A5A 100%)',
                boxShadow: '0 6px 16px rgba(46, 125, 154, 0.4)',
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                background: '#B0BEC5',
                color: '#fff',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {submitting ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} sx={{ color: '#fff' }} />
                Đang gửi đánh giá...
              </Box>
            ) : (
              '🧬 Gửi đánh giá'
            )}
          </Button>
        </Box>
      </DNACard>
    </Box>
  );
};

export default Feedback;