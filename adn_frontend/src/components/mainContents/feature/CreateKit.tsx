import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import CustomSnackBar from '../userinfor/Snackbar';

type Kit = {
  kitCode: string;
  kitName: string;
  targetPersonCount: string;
  price: string;
  contents: string;
};

const CreateKit = () => {
  const [auth, setAuth] = useState(false);
  const [kit, setKit] = useState<Kit>({
    kitCode: '',
    kitName: '',
    targetPersonCount: '',
    price: '',
    contents: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  useEffect(() => {
    setAuth(
      localStorage.getItem('role') === 'MANAGER' ||
        localStorage.getItem('role') === 'ADMIN'
    );
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKit((kit) => ({
      ...kit,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8080/api/kit/create-kit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(kit),
      });

      if (!res.ok) {
        let errorMessage = 'Không thể đăng ký'; // mặc định

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
          title: 'Tạo kit thành công',
          showConfirmButton: false,
          timer: 1300,
        });

        setKit({
          kitCode: '',
          kitName: '',
          targetPersonCount: '',
          price: '',
          contents: '',
        });
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
      <h2 className="mb-4 text-center">Tạo kit</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Mã kit</label>
          <input
            type="text"
            name="kitCode"
            className="form-control"
            value={kit.kitCode}
            onChange={handleInput}
            placeholder="Nhập Mã kit"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tên kit</label>
          <input
            type="text"
            name="kitName"
            className="form-control"
            value={kit.kitName}
            onChange={handleInput}
            placeholder="Nhập Tên kit"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Giá kit</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={kit.price}
            onChange={handleInput}
            placeholder="Nhập Giá kit"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Số người dùng</label>
          <input
            type="text"
            name="targetPersonCount"
            className="form-control"
            value={kit.targetPersonCount}
            onChange={handleInput}
            placeholder="Nhập số người dùng"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nội dung</label>
          <input
            type="text"
            name="contents"
            className="form-control"
            value={kit.contents}
            onChange={handleInput}
            placeholder="Nhập Nội dung"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Tạo kit
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

export default CreateKit;
