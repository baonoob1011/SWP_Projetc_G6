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
  const [showCreateForm, setShowCreateForm] = useState(false);

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

    if (!price.effectiveDate || !price.price || !price.time) {
      setSnackbar({
        open: true,
        message: 'Vui lòng nhập đầy đủ thông tin',
        severity: 'error',
      });
      return;
    }

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
        setShowCreateForm(false);
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
    <div className="min-h-screen bg-white ml-10">
      <div className="max-w-full">
        {/* Statistics Header */}
        <div className="bg-[#4162EB] rounded-lg p-6 mb-6 relative">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-white text-lg font-semibold">Quản lý giá dịch vụ</h2>
          </div>
          {/* Breadcrumb */}
          <div className="flex items-center mb-6 text-blue-100">
            <span className="text-white font-medium">Admin</span>
            <span className="mx-2">›</span>
            <span>Price</span>
          </div>
        </div>
        {/* Create Form - Collapsible */}

          <div className="bg-white border border-gray-200 rounded-lg mb-6 shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Tạo giá mới</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày áp dụng
                    </label>
                    <input
                      type="date"
                      name="effectiveDate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={price.effectiveDate}
                      onChange={handleInput}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá
                    </label>
                    <input
                      type="number"
                      name="price"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={price.price}
                      onChange={handleInput}
                      placeholder="Nhập giá mới"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian
                    </label>
                    <input
                      type="text"
                      name="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={price.time}
                      onChange={handleInput}
                      placeholder="Nhập thời gian"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Thêm Giá
                  </button>
                </div>
              </form>
            </div>
          </div>

        <CustomSnackBar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </div>
    </div>
  );
};

export default NewPrice;