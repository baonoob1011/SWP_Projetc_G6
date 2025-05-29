import { Snackbar, Alert } from "@mui/material";

type CustomPopup = {
  open: boolean;
  message: string;
  severity: "success" | "error";
  onClose: () => void;
};

const CustomSnackBar = ({ open, message, severity, onClose }: CustomPopup) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
export default CustomSnackBar;