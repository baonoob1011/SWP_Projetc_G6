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
  const [showCreateForm, setShowCreateForm] = useState(false);

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

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Handle submit (create blog)
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
        Swal.fire({
          icon: 'success',
          title: 'Tạo blog thành công',
          showConfirmButton: false,
          timer: 1300,
        });
        setForm({ blogId: 0, title: '', content: '', image: '' });
        setFile(null);
        setPreview('');
        setShowCreateForm(false);
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
        setShowCreateForm(false);
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

  const handleEdit = (blog: Blog) => {
    setForm(blog);
    setPreview(`data:image/png;base64,${blog.image}`);
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setForm({ blogId: 0, title: '', content: '', image: '' });
    setFile(null);
    setPreview('');
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-white ml-10">
      <div className="max-w-full">
        
        {/* Statistics Header */}
        <div className="bg-[#3F61E9] rounded-lg p-6 mb-6 relative">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-white text-lg font-semibold">Quản lý Blog/ Tin tức</h2>
          </div>
          {/* Breadcrumb */}
          <div className="flex items-center mb-6 text-blue-100">
            <span className="text-white font-medium">Manager</span>
            <span className="mx-2">›</span>
            <span>Blog/Tin tức</span>
          </div>
          <div className="bg-green-500 bg-opacity-30 rounded-lg p-2 max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-blue-100 text-xl">Tổng số Blog/Tin tức: {blogs.length}</div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              {form.blogId ? 'Cập nhật Blog' : 'Thêm Blog'}
            </button>
          </div>
        </div>

        {/* Create/Update Form - Collapsible */}
        {showCreateForm && (
          <div className="bg-white border border-gray-200 rounded-lg mb-6 shadow-sm">
            <div className="p-8">
              <h3 className="text-lg font-medium text-gray-800 mb-6">
                {form.blogId ? 'Cập nhật Blog' : 'Thêm Blog mới'}
              </h3>
              
              {/* Form Fields Container */}
              <div className="space-y-6">
                {/* Title and Image Upload Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Tiêu đề Blog
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleInput}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Nhập tiêu đề blog hấp dẫn..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Hình ảnh đại diện
                    </label>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                {/* Content Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nội dung
                  </label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleTextareaChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                    placeholder="Viết nội dung blog của bạn..."
                    required
                  />
                </div>

                {/* Image Preview */}
                {preview && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Xem trước hình ảnh
                    </label>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <img
                        src={preview}
                        alt="preview"
                        className="w-40 h-40 object-cover rounded-lg shadow-sm border border-gray-200"
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                  {form.blogId ? (
                    <button
                      onClick={handleUpdate}
                      className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                    >
                      Cập nhật Blog
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Tạo Blog
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    STT
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Tiêu đề
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Nội dung
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {blogs.map((blog, index) => (
                <tr key={blog.blogId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-blue-600 font-medium border-r border-gray-200">
                    #{String(index + 1).padStart(4, '0')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 border-r border-gray-200">
                    {blog.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-200">
                    <div className="max-w-xs truncate">
                      {blog.content}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg border border-yellow-200 hover:border-yellow-300 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(blog.blogId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy blog nào
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
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </div>
  );
};

export default CreateBlog;