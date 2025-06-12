import { useEffect, useState } from 'react';
import CustomSnackBar from '../userinfor/Snackbar';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';

type Price = {
  effectiveDate: string;
  price: string;
  time: string;
};

const NewPrice = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [price, setPrice] = useState<Price>({
    effectiveDate: '',
    price: '',
    time: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    setAuth(
      localStorage.getItem('role') === 'ADMIN' ||
        localStorage.getItem('role') === 'MANAGER'
    );
  }, []);

  if (!auth) {
    return;
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPrice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

<<<<<<< fix-forget-sendOTP-newPass
    if (!price.effectiveDate || !price.price || !price.time) {
      setSnackbar({
        open: true,
        message: 'Vui lòng nhập đầy đủ thông tin',
        severity: 'error',
      });
      return;
    }

=======
>>>>>>> main
    try {
      const res = await fetch(
        `http://localhost:8080/api/price/add-more-price/${serviceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(price),
        }
      );

      if (!res.ok) {
        setSnackbar({
          open: true,
          message: 'Điền đầy đủ thông tin',
          severity: 'error',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Thêm giá thành công',
          showConfirmButton: false,
          timer: 1300,
        });

        setPrice({ effectiveDate: '', price: '', time: '' });
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

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Tạo giá mới</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Ngày áp dụng</label>
          <input
            type="date"
            name="effectiveDate"
            className="form-control"
            value={price.effectiveDate}
            onChange={handleInput}
            placeholder="chọn ngày"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Giá</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={price.price}
            onChange={handleInput}
            placeholder="Nhập giá mới"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Thời gian</label>
          <input
            type="text"
            name="time"
            className="form-control"
            value={price.time}
            onChange={handleInput}
            placeholder="Nhập thời gian"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Thêm giá
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

export default NewPrice;
