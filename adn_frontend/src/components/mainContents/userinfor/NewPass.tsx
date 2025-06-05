import {
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NewPass.module.css";

const NewPass = ({ email }: { email: string }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/otp/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      if (!res.ok) throw new Error("Không thể đặt lại mật khẩu");
      alert("Đổi mật khẩu thành công");
      navigate("/login");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.newPassContainer}>
      <Paper className={styles.newPassPaper} elevation={0}>
        <Typography className={styles.newPassTitle} variant="h5">
          Đặt Lại Mật Khẩu
        </Typography>
        <Typography className={styles.newPassSubtitle}>
          Nhập mật khẩu mới để hoàn tất quá trình đặt lại
        </Typography>
        
        <form onSubmit={handleReset}>
          <div className={styles.inputGroup}>
            <TextField
              className={styles.customTextField}
              fullWidth
              type="password"
              label="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              variant="outlined"
            />
          </div>
          
          <div className={styles.inputGroup}>
            <TextField
              className={styles.customTextField}
              fullWidth
              type="password"
              label="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              variant="outlined"
            />
          </div>
          
          <Button
            className={styles.newPassButton}
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className={styles.spinner}></div>
                Đang xử lý...
              </>
            ) : (
              "Đổi Mật Khẩu"
            )}
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default NewPass;