import { Snackbar, Alert } from '@mui/material';
import Swal from 'sweetalert2';

export const showErrorSnackbar = (message: string) => {
  return (
    <Snackbar open={true} autoHideDuration={6000}>
      <Alert severity="error" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export const showSuccessAlert = (title: string, message: string) => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'success',
    confirmButtonText: 'OK'
  });
}; 