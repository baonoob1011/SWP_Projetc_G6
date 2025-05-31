import { useState } from "react";
import Countdown from "react-countdown";
import { Button, Typography, Box } from "@mui/material";

type Props = {
  duration: number; // ví dụ: 60000 = 60 giây
  onComplete: () => void;
  onResend: () => Promise<void>;
};

const CountdownTimer = ({ duration, onComplete, onResend }: Props) => {
  const [targetTime, setTargetTime] = useState(Date.now() + duration);
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  const handleResendClick = async () => {
    await onResend();
    const newTarget = Date.now() + duration;
    setTargetTime(newTarget); // cập nhật thời gian mới
    setCompleted(false);
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {!completed ? (
        <Countdown
          date={targetTime}
          onComplete={handleComplete}
          renderer={({ minutes, seconds }) => (
            <Typography sx={{ fontWeight: "bold", color: "#1976d2" }}>
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </Typography>
          )}
        />
      ) : (
        <Button variant="outlined" size="small" onClick={handleResendClick}>
          Gửi lại OTP
        </Button>
      )}
    </Box>
  );
};

export default CountdownTimer;
