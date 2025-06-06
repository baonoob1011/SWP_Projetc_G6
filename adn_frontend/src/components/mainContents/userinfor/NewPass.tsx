import {
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NewPass.module.css";
import CustomSnackBar from "./Snackbar";
import Swal from "sweetalert2";

type Severity = "success" | "error";

const NewPass = ({ email }: { email: string }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: Severity;
  }>({
    open: false,
    message: "",
    severity: "error"
  });
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setSnackbar({
        open: true,
        message: "Mật khẩu xác nhận không khớp",
        severity: "error"
      });
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
      
      await Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đổi mật khẩu thành công",
        timer: 2000,
        showConfirmButton: false
      });
      navigate("/login");
    } catch (err) {
      setSnackbar({
        open: true,
        message: (err as Error).message,
        severity: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.newPassContainer}>
      <CustomSnackBar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
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