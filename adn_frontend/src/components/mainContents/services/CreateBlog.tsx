import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import CustomSnackBar from '../userinfor/Snackbar';

type Blog = {
  title: string;
  content: string;
};

const CreateBlog = () => {
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>('');
  const [auth, setAuth] = useState(false);
  const [isBlog, setIsBlog] = useState<Blog>({
    title: '',
    content: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected?.type.startsWith('image/')) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    } else {
      toast.warning('Vui lòng chọn ảnh hợp lệ');
    }
  };

  useEffect(() => {
    setAuth(
      localStorage.getItem('role') === 'ADMIN' ||
        localStorage.getItem('role') === 'MANAGER' ||
        localStorage.getItem('role') === 'STAFF'
    );
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsBlog((isBlog) => ({
      ...isBlog,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) return toast.warning('Chưa chọn ảnh');

    const request = {
      title: isBlog.title,
      content: isBlog.content,
    };

    const formData = new FormData();
    formData.append(
      'blogRequest', // 👈 chính xác tên phải là "blogRequest"
      new Blob([JSON.stringify(request)], { type: 'application/json' })
    );
    formData.append('file', file);
    try {
      const res = await fetch('http://localhost:8080/api/blog/create-blog', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
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
        toast.success('Thành công');
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!auth) {
    return;
  }

  return (
    <div
      className="container mt-5"
      style={{
        background: 'linear-gradient(to bottom right, #e3f2fd, #ffffff)',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 0 20px rgba(33, 150, 243, 0.2)',
        maxWidth: '600px',
      }}
    >
      <form onSubmit={handleSubmit}>
        <h3
          className="text-center mb-4"
          style={{
            color: '#0d6efd',
            fontWeight: 700,
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Tạo Blog
        </h3>

        <div className="mb-3">
          <label className="form-label">Tên blog</label>
          <input
            className="form-control"
            name="title"
            value={isBlog.title}
            onChange={handleInput}
            placeholder="Nhập tên blog"
            required
            style={{ borderColor: '#2196f3' }}
          />
        </div>

        {/* Mô tả */}
        <div className="mb-3">
          <label className="form-label">Nội dung</label>
          <input
            type="text"
            className="form-control"
            name="content"
            value={isBlog.content}
            onChange={handleInput}
            placeholder="Nhập nội dung"
            required
            style={{ borderColor: '#2196f3' }}
          />
        </div>

        {/* Hình ảnh */}
        <div className="mb-3">
          <label className="form-label">Hình ảnh</label>
          <div className="input-group">
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={handleFile}
              className="form-control"
              style={{ borderColor: '#2196f3' }}
            />
          </div>
          {file && (
            <div className="form-text" style={{ color: '#1976d2' }}>
              Đã chọn: {file.name}
            </div>
          )}
        </div>

        {/* Preview ảnh */}
        {preview && (
          <div className="mb-3 text-center">
            <img
              src={preview}
              alt="preview"
              className="img-thumbnail"
              style={{
                maxWidth: '200px',
                border: '2px solid #0d6efd',
                borderRadius: '10px',
              }}
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary w-100"
          style={{
            backgroundColor: '#0d6efd',
            borderColor: '#0d6efd',
            fontWeight: 600,
            fontSize: '16px',
          }}
        >
          Gửi đăng ký
        </button>
      </form>
      <CustomSnackBar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
};

export default CreateBlog;
