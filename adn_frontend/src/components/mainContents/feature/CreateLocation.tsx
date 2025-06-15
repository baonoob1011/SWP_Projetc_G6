import { useEffect, useState } from 'react';
import CustomSnackBar from '../userinfor/Snackbar';
import Swal from 'sweetalert2';

type Location = {
  addressLine: string;
  district: string;
  city: string;
};

const CreateLocation = () => {
  const [location, setLocation] = useState<Location>({
    addressLine: '',
    district: '',
    city: '',
  });

  const [auth, setAuth] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    setAuth(
      localStorage.getItem('role') === 'ADMIN' ||
        localStorage.getItem('role') === 'MANAGER'
    );
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(
        'http://localhost:8080/api/location/create-location',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(location),
        }
      );

      if (!res.ok) {
        let errorMessage = 'Không thể tạo'; // mặc định

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMessage = errorData.message || JSON.stringify(errorData);
        } else {
          errorMessage = await res.text();
        }

        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Tạo địa chỉ thành công',
          showConfirmButton: false,
          timer: 1300,
        });

        setLocation({ addressLine: '', district: '', city: '' });
      }
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: 'Lỗi hệ thống',
        severity: 'error',
      });
    }
  };

  if (!auth) {
    return;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Tạo Địa Chỉ Mới</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Địa chỉ</label>
          <input
            type="text"
            name="addressLine"
            className="form-control"
            value={location.addressLine}
            onChange={handleInput}
            placeholder="Nhập địa chỉ chi tiết"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Quận</label>
          <input
            type="text"
            name="district"
            className="form-control"
            value={location.district}
            onChange={handleInput}
            placeholder="Nhập quận"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tỉnh / Thành phố</label>
          <input
            type="text"
            name="city"
            className="form-control"
            value={location.city}
            onChange={handleInput}
            placeholder="Nhập tỉnh hoặc thành phố"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Tạo địa chỉ
        </button>

        <CustomSnackBar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </form>
    </div>
  );
};

export default CreateLocation;
