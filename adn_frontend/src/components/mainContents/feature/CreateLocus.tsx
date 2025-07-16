import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

type Locus = {
  locusName: string;
  description: string;
  locusId?: string;
};

type FormErrors = {
  locusName: string;
  description: string;
};

const CreateLocus = () => {
  const [locus, setLocus] = useState<Locus>({
    locusName: '',
    description: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    locusName: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [locusList, setLocusList] = useState<Locus[]>([]);

  // Fetch all loci from API
  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/locus/get-all-locus', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        toast.error('Không thể lấy danh sách locus');
      } else {
        const data = await res.json();
        setLocusList(data);
      }
    } catch (error) {
      console.log(error);
      toast.error('Lỗi kết nối khi lấy danh sách locus');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocus((locus) => ({
      ...locus,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocus((locus) => ({
      ...locus,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      locusName: '',
      description: '',
    };

    if (!locus.locusName.trim()) {
      newErrors.locusName = 'Tên locus không được để trống';
    } else if (locus.locusName.trim().length < 2) {
      newErrors.locusName = 'Tên locus phải có ít nhất 2 ký tự';
    }

    if (!locus.description.trim()) {
      newErrors.description = 'Mô tả không được để trống';
    }

    setErrors(newErrors);
    return !newErrors.locusName && !newErrors.description;
  };

  const handleDelete = async (locusId: string) => {
    const confirmation = await Swal.fire({
      title: 'Bạn chắc chắn muốn xóa locus này?',
      text: 'Quá trình này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Có, xóa!',
      cancelButtonText: 'Hủy',
    });

    if (confirmation.isConfirmed) {
      try {
        const res = await fetch(
          `http://localhost:8080/api/locus/delete-locus/${locusId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!res.ok) {
          toast.error('Không thể xóa locus');
        } else {
          Swal.fire('Đã xóa!', 'Locus đã được xóa thành công.', 'success');
          // Cập nhật lại danh sách locus sau khi xóa
          fetchData();
        }
      } catch (error) {
        console.log(error);
        toast.error('Lỗi hệ thống');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ thông tin hợp lệ');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      console.log('Current token:', token ? 'Token exists' : 'No token found');

      // Parse token to get user info for debugging
      if (token) {
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          console.log('User role:', tokenPayload.role || 'Role not found');
          console.log('User info:', tokenPayload);
        } catch {
          console.log('Cannot parse token');
        }
      }

      const res = await fetch('http://localhost:8080/api/locus/create-locus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(locus),
      });

      console.log('Response status:', res.status);
      console.log('Response statusText:', res.statusText);

      if (!res.ok) {
        let errorMessage = `Lỗi ${res.status}: `; // mặc định với status code

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          console.log('Error response:', errorData);

          // Xử lý các lỗi phổ biến
          if (res.status === 403) {
            errorMessage +=
              'Bạn không có quyền tạo locus. Vui lòng liên hệ quản trị viên.';
          } else if (res.status === 401) {
            errorMessage +=
              'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          } else if (res.status === 400) {
            errorMessage += errorData.message || 'Dữ liệu không hợp lệ';
          } else {
            errorMessage += errorData.message || 'Không thể tạo locus';
          }
        } else {
          const textError = await res.text();
          console.log('Text error response:', textError);

          if (res.status === 403) {
            errorMessage +=
              'Bạn không có quyền tạo locus (Manager role có thể không được phép)';
          } else if (res.status === 401) {
            errorMessage += 'Không có quyền truy cập. Vui lòng đăng nhập lại.';
          } else {
            errorMessage += textError || 'Lỗi không xác định';
          }
        }

        toast.error(errorMessage);
      } else {
        toast.success('Tạo locus thành công');
        // Reset form after successful submission
        setLocus({
          locusName: '',
          description: '',
        });
        setErrors({
          locusName: '',
          description: '',
        });
        // Refresh the locus list
        fetchData();
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormControlClass = (fieldName: keyof Locus) => {
    let className =
      'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-blue-500';
    if (errors[fieldName as keyof FormErrors]) {
      className += ' border-red-500 focus:ring-red-500';
    } else if (locus[fieldName]) {
      className += ' border-green-500 focus:ring-green-500';
    } else {
      className += ' border-gray-300 focus:ring-blue-500';
    }
    return className;
  };

  return (
    <div className="min-h-screen bg-white ml-10">
      <div className="max-w-full">
        {/* Statistics Header */}
        <div className="bg-[#3F61E9] rounded-lg p-6 mb-6 relative">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-white text-lg font-semibold">Quản lý Locus</h2>
          </div>
          {/* Breadcrumb */}
          <div className="flex items-center mb-6 text-blue-100">
            <span className="text-white font-medium">Admin</span>
            <span className="mx-2">›</span>
            <span>Locus</span>
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-blue-100 text-xl">
              Tổng số locus: {locusList.length}
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Thêm Locus
            </button>
          </div>
        </div>

        {/* Create Form - Collapsible */}
        {showCreateForm && (
          <div className="bg-white border border-gray-200 rounded-lg mb-6 shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Thêm locus mới
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên Locus <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="locusName"
                      className={getFormControlClass('locusName')}
                      onChange={handleInput}
                      value={locus.locusName}
                      placeholder="Nhập tên locus (ví dụ: D3S1358)"
                      disabled={isSubmitting}
                    />
                    {errors.locusName && (
                      <div className="text-red-500 text-sm mt-1">
                        ⚠️ {errors.locusName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      className={getFormControlClass('description')}
                      onChange={handleTextareaInput}
                      value={locus.description}
                      placeholder="Nhập mô tả chi tiết về locus này..."
                      rows={4}
                      disabled={isSubmitting}
                    />
                    {errors.description && (
                      <div className="text-red-500 text-sm mt-1">
                        ⚠️ {errors.description}
                      </div>
                    )}
                    <div className="text-gray-500 text-sm mt-1">
                      Nhập mô tả về locus này
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Đang tạo...
                      </>
                    ) : (
                      'Tạo Locus'
                    )}
                  </button>
                </div>
              </form>
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
                    STT
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
                    Tên Locus
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
                    Mô tả
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {locusList.map((locusItem, index) => (
                <tr
                  key={locusItem.locusId || index}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-blue-600 font-medium border-r border-gray-200">
                    #{String(index + 1).padStart(4, '0')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200">
                    {locusItem.locusName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                    <div className="max-w-xs break-all">
                      {locusItem.description}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(locusItem.locusId || '')}
                        className="p-1 text-red-500 hover:bg-red-50 rounded border border-red-200 hover:border-red-300 transition-colors"
                        title="Delete"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {locusList.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Chưa có locus nào được tạo
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateLocus;
