import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import CustomSnackBar from '../userinfor/Snackbar';
import { toast } from 'react-toastify';
import Kit from '../../mainContents/feature/featureImage/Kit.png';

type Kit = {
  kitId: string;
  kitCode: string;
  kitName: string;
  targetPersonCount: string;
  price: string;
  contents: string;
  quantity: string;
};

const CreateKit = () => {
  const [auth, setAuth] = useState(false);
  const [kit, setKit] = useState<Kit>({
    kitId: '',
    kitCode: '',
    kitName: '',
    targetPersonCount: '',
    price: '',
    contents: '',
    quantity: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  useEffect(() => {
    setAuth(
      localStorage.getItem('role') === 'MANAGER' ||
        localStorage.getItem('role') === 'ADMIN'
    );
  }, []);

  const [isKit, setIsKit] = useState<Kit[]>([]);
  const [newQuantity, setNewQuantity] = useState('');
  const [editQuantityIndex, setEditQuantityIndex] = useState<number | null>(
    null
  );
  const fetchData = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/kit/get-all-kit-staff',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!res.ok) {
        toast.error('không thể lấy danh sách Kit');
      } else {
        const data = await res.json();
        setIsKit(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKit((kit) => ({
      ...kit,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
          kitId: '',
          kitCode: '',
          kitName: '',
          targetPersonCount: '',
          price: '',
          contents: '',
          quantity: '',
        });
        fetchData();
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
  const handleUpdateKitQuantity = async (kitId: string, quantity: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/kit/add-kit-quantity?kitId=${kitId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ kitId, quantity }),
        }
      );
      if (res.ok) {
        setSnackbar({
          open: true,
          message: 'Cập nhật thành công',
          severity: 'success',
        });
        setEditQuantityIndex(null);
        fetchData();
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
    <div className="min-h-screen bg-white ml-10">
      <div className="max-w-full">
        {/* Statistics Header */}
        <div className="bg-[#4162EB] rounded-lg p-6 mb-6 relative">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-white text-lg font-semibold">Quản lý Kit</h2>
          </div>
          {/* Breadcrumb */}
          <div className="flex items-center mb-6 text-blue-100">
            <span className="text-white font-medium">Manager</span>
            <span className="mx-2">›</span>
            <span>Kit</span>
          </div>
          <div className="bg-green-500 bg-opacity-30 rounded-lg p-2 max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="text-blue-100 text-xl">
              Tổng số Kit: {isKit.length}
            </div>
          </div>

          {/* Đặt hình ảnh vào trong header */}
          <div className="absolute right-0 bottom-0 mb-4 mr-40">
            <img src={Kit} alt="Kit" className="h-40 object-contain" />
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Thêm Kit
          </button>
        </div>

        {/* Create Form - Collapsible */}
        {showCreateForm && (
          <div className="bg-white border border-gray-200 rounded-lg mb-6 shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Thêm Kit mới
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã Kit
                  </label>
                  <input
                    type="text"
                    name="kitCode"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={kit.kitCode}
                    onChange={handleInput}
                    placeholder="Nhập mã kit (ví dụ: KIT001, KIT002...)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên Kit
                  </label>
                  <input
                    type="text"
                    name="kitName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={kit.kitName}
                    onChange={handleInput}
                    placeholder="Nhập tên kit"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số Lượng Người Dự Kiến
                  </label>
                  <input
                    type="text"
                    name="targetPersonCount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={kit.targetPersonCount}
                    onChange={handleInput}
                    placeholder="Nhập số lượng người dự kiến"
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
                    value={kit.price}
                    onChange={handleInput}
                    placeholder="Nhập giá"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số Lượng Kit
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={kit.quantity}
                    onChange={handleInput}
                    placeholder="Nhập số lượng kit"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội Dung
                  </label>
                  <input
                    type="text"
                    name="contents"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={kit.contents}
                    onChange={handleInput}
                    placeholder="Nhập mô tả nội dung kit"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Tạo Kit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Mã Kit
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Tên Kit
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </th>
                {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Số Người Sử Dụng
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </th> */}
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Số Lượng Kit
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </th>
                {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Giá
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </th> */}
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  <div className="flex items-center gap-1">
                    Nội Dung
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isKit && isKit.length > 0 ? (
                isKit.map((kit, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-blue-600 font-medium border-r border-gray-200">
                      {kit.kitCode}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200">
                      {kit.kitName}
                    </td>
                    {/* <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                      {kit.targetPersonCount} người
                    </td> */}
                    <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                      {editQuantityIndex === index ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            pattern="[0-9]*"
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập SL"
                            value={newQuantity}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              setNewQuantity(value);
                            }}
                          />
                          <button
                            onClick={() => {
                              Swal.fire({
                                title: 'Xác nhận cập nhật',
                                text: `Bạn có chắc muốn thêm ${newQuantity} kit cho "${kit.kitName}" không?`,
                                icon: 'question',
                                showCancelButton: true,
                                confirmButtonText: 'Có, cập nhật',
                                cancelButtonText: 'Hủy',
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  handleUpdateKitQuantity(
                                    kit.kitId,
                                    newQuantity
                                  );
                                }
                              });
                            }}
                            className="px-2 py-2 text-white rounded hover:bg-blue-600"
                          >
                            ✔
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>{kit.quantity} kit</span>
                          <button
                            onClick={() => {
                              setEditQuantityIndex(index);
                              setNewQuantity('');
                            }}
                            className="text-blue-500 hover:text-blue-700 font-bold text-lg leading-none"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </td>

                    {/* <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                      {kit.price}đ
                    </td> */}
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                      {kit.contents}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Không tìm thấy kit nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CustomSnackBar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
};

export default CreateKit;
