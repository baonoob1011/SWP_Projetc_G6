/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import CustomSnackBar from '../userinfor/Snackbar';
import Swal from 'sweetalert2';

type Blog = {
  blogId: number;
  title: string;
  content: string;
  image: string;
};

const CreateBlog = () => {
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>('');
  const [form, setForm] = useState<Blog>({
    blogId: 0,
    title: '',
    content: '',
    image: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Fetch all blogs from the server
  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/blog/get-all-blogs', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBlogs(data);
    } catch {
      toast.error('Không thể lấy danh sách Blog');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sel = e.target.files?.[0] ?? null;
    if (sel && sel.type.startsWith('image/')) {
      setFile(sel);
      setPreview(URL.createObjectURL(sel));
    } else {
      toast.warning('Vui lòng chọn ảnh hợp lệ');
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Handle submit (create blog)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.warning('Chưa chọn ảnh');

    const req = new Blob([JSON.stringify(form)], { type: 'application/json' });
    const fd = new FormData();
    fd.append('blogRequest', req);
    fd.append('file', file);

    try {
      const res = await fetch('http://localhost:8080/api/blog/create-blog', {
        method: 'POST',
        // ✅ KHÔNG set Content-Type
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: fd,
      });

      if (!res.ok) {
        const ct = res.headers.get('content-type') || '';
        const msg = ct.includes('json')
          ? (await res.json()).message
          : await res.text();
        setSnackbar({ open: true, message: msg, severity: 'error' });
      } else {
        toast.success('Tạo blog thành công');
        setForm({ blogId: 0, title: '', content: '', image: '' });
        setFile(null);
        setPreview('');
        fetchData();
      }
    } catch {
      setSnackbar({ open: true, message: 'Lỗi hệ thống', severity: 'error' });
    }
  };

  // Handle update blog
  const handleUpdate = async () => {
    if (!file) return toast.warning('Chưa chọn ảnh');

    const req = new Blob([JSON.stringify(form)], { type: 'application/json' });
    const fd = new FormData();
    fd.append('blogRequest', req);
    fd.append('file', file);

    try {
      const res = await fetch(
        `http://localhost:8080/api/blog/update-blog/${form.blogId}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: fd,
        }
      );

      if (!res.ok) {
        const ct = res.headers.get('content-type') || '';
        const msg = ct.includes('json')
          ? (await res.json()).message
          : await res.text();
        setSnackbar({ open: true, message: msg, severity: 'error' });
      } else {
        toast.success('Cập nhật blog thành công');
        setForm({ blogId: 0, title: '', content: '', image: '' });
        setFile(null);
        setPreview('');
        fetchData();
      }
    } catch {
      setSnackbar({ open: true, message: 'Lỗi hệ thống', severity: 'error' });
    }
  };

  const handleDelete = async (blogId: number) => {
    const confirmation = await Swal.fire({
      title: 'Bạn chắc chắn muốn xóa blog này?',
      text: 'Quá trình này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Có, xóa!',
    });

    if (confirmation.isConfirmed) {
      try {
        const res = await fetch(
          `http://localhost:8080/api/blog/delete-blog/${blogId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!res.ok) {
          toast.error('Không thể xóa blog');
        } else {
          Swal.fire('Đã xóa!', 'Blog đã được xóa thành công.', 'success');
          fetchData(); // Cập nhật lại danh sách blog sau khi xóa
        }
      } catch (error) {
        console.error(error);
        toast.error('Lỗi hệ thống');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản Lý Blog</h1>
            <p className="text-gray-600 mt-1">
              Quản lý và tổ chức nội dung blog một cách hiệu quả
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                setForm({ blogId: 0, title: '', content: '', image: '' });
                setFile(null);
                setPreview('');
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={showForm ? 'M6 18L18 6M6 6l12 12' : 'M12 4v16m8-8H4'}
              />
            </svg>
            {showForm ? 'Đóng Form' : 'Thêm Blog'}
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Blog Form Card - Conditionally Rendered */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {form.blogId ? 'Cập Nhật Blog' : 'Tạo Blog Mới'}
                </h2>
                <p className="text-gray-600">
                  {form.blogId
                    ? 'Chỉnh sửa thông tin blog của bạn'
                    : 'Tạo nội dung blog mới để chia sẻ với mọi người'}
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      Tiêu đề Blog
                    </span>
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleInput}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Nhập tiêu đề blog hấp dẫn..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Nội dung
                    </span>
                  </label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={(e) => handleInput(e as any)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                    placeholder="Viết nội dung blog của bạn..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Hình ảnh đại diện
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Preview */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Xem trước
                    </span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
                    {preview ? (
                      <div className="space-y-3">
                        <img
                          src={preview}
                          alt="preview"
                          className="w-full h-48 object-cover rounded-lg shadow-sm"
                        />
                        <p className="text-sm text-gray-600">
                          Hình ảnh đã chọn
                        </p>
                      </div>
                    ) : (
                      <div className="py-8">
                        <svg
                          className="w-12 h-12 text-gray-400 mx-auto mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-gray-500 text-sm">
                          Chưa có hình ảnh
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {form.blogId ? 'Cập nhật Blog' : 'Tạo Blog'}
              </button>
              {form.blogId && (
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="sm:w-auto px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Cập nhật
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm({ blogId: 0, title: '', content: '', image: '' });
                  setFile(null);
                  setPreview('');
                }}
                className="sm:w-auto px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Blog List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Danh Sách Blog
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Tất cả các blog đã được tạo
            </p>
          </div>

          {blogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tiêu đề
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nội dung
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr
                      key={blog.blogId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {blog.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-600 truncate max-w-md">
                          {blog.content}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setForm(blog);
                              setPreview(`data:image/png;base64,${blog.image}`);
                              setShowForm(true);
                            }}
                            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(blog.blogId)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
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
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy blog nào
              </h3>
              <p className="text-gray-600">
                Bắt đầu bằng cách tạo blog đầu tiên của bạn
              </p>
            </div>
          )}
        </div>
      </div>

      <CustomSnackBar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </div>
  );
};

export default CreateBlog;
