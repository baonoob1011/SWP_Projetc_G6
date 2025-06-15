import {
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CustomSnackBar from '../userinfor/Snackbar';

type FormService = {
  serviceName: string;
  description: string;
  serviceType: string;
};

type PriceList = {
  time: string;
  price: string;
};

type TypeService = {
  someCivilField: string;
};

type Kit = {
  kitId: string;
  kitCode: string;
  kitName: string;
  targetPersonCount: string;
  price: string;
  contents: string;
};

const Services = () => {
  const [form, setForm] = useState<{
    service: FormService;
    price: PriceList;
    type: TypeService;
  }>({
    service: {
      serviceName: '',
      description: '',
      serviceType: '',
    },
    price: {
      time: '',
      price: '',
    },
    type: {
      someCivilField: '',
    },
  });
  const navigate = useNavigate();
  const [kit, setKit] = useState<Kit[]>([]);
  const [selectedKit, setSelectedKit] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    setIsAdmin(
      localStorage.getItem('role') === 'ADMIN' ||
        localStorage.getItem('role') === 'MANAGER'
    );
  }, []);

  const fetchKit = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/kit/get-all-kit-staff',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        localStorage.clear();
        navigate('/login');
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setKit(data);
    } catch (error) {
      console.error('Fetch locations error:', error);
      toast.error('Không thể lấy kit');
    }
  };
  useEffect(() => {
    if (isAdmin) {
      fetchKit();
    }
  }, [isAdmin]);
  const handleKitChange = (e: SelectChangeEvent<string>) => {
    const kitId = e.target.value;
    setSelectedKit(kitId);
    setForm({
      service: { serviceName: '', description: '', serviceType: '' },
      price: { time: '', price: '' },
      type: { someCivilField: '' },
    });
  };
  const handleInput = (
    section: 'service' | 'price' | 'type',
    field: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected?.type.startsWith('image/')) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    } else {
      toast.warning('Vui lòng chọn ảnh hợp lệ');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return toast.warning('Chưa chọn ảnh');

    const parsedPrice = Number(form.price.price);
    if (isNaN(parsedPrice)) {
      return toast.warning('Giá phải là số');
    }
    const kitId = selectedKit;
    const request = {
      kitId,
      serviceRequest: {
        serviceName: form.service.serviceName,
        description: form.service.description,
        serviceType: form.service.serviceType,
      },
      priceListRequest: {
        time: form.price.time,
        price: parsedPrice,
      },
      administrativeServiceRequest:
        form.service.serviceType === 'ADMINISTRATIVE' ? form.type : {},
      civilServiceRequest:
        form.service.serviceType === 'CIVIL' ? form.type : {},
    };

    const formData = new FormData();
    formData.append(
      'request',
      new Blob([JSON.stringify(request)], { type: 'application/json' })
    );
    formData.append('file', file);

    try {
      const res = await fetch(
        `http://localhost:8080/api/services/create-service/${selectedKit}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: formData,
        }
      );

      if (res.ok) {
        toast.success('Tạo dịch vụ thành công');
        setForm({
          service: { serviceName: '', description: '', serviceType: '' },
          price: { time: '', price: '' },
          type: { someCivilField: '' },
        });
        setFile(null);
        setPreview('');
        if (fileRef.current) fileRef.current.value = '';
      } else {
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
      }
    } catch (err) {
      console.error(err);
      toast.warning('Đã xảy ra lỗi khi gửi dữ liệu.');
    }
  };

  if (!isAdmin) return null;

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
          Tạo Dịch Vụ ADN
        </h3>

        {/* Tên dịch vụ */}
        <div className="mb-3">
          <FormControl fullWidth>
            <Select
              labelId="roomId"
              value={selectedKit}
              onChange={handleKitChange}
              input={<OutlinedInput />}
              displayEmpty
            >
              <MenuItem value="">
                <em>----Chọn kit----</em>
              </MenuItem>
              {kit.map((kit) => (
                <MenuItem key={kit.kitId} value={kit.kitId}>
                  {kit.kitCode}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="mb-3">
          <label className="form-label">Tên dịch vụ</label>
          <input
            className="form-control"
            value={form.service.serviceName}
            onChange={(e) =>
              handleInput('service', 'serviceName', e.target.value)
            }
            placeholder="Nhập tên dịch vụ"
            required
            style={{ borderColor: '#2196f3' }}
          />
        </div>

        {/* Loại dịch vụ */}
        <div className="mb-3">
          <label className="form-label">Loại dịch vụ</label>
          <select
            className="form-select"
            value={form.service.serviceType}
            onChange={(e) =>
              handleInput('service', 'serviceType', e.target.value)
            }
            required
            style={{ borderColor: '#2196f3' }}
          >
            <option value="">-- Chọn loại dịch vụ --</option>
            <option value="ADMINISTRATIVE">Hành Chính</option>
            <option value="CIVIL">Dân sự</option>
          </select>
        </div>

        {/* Mô tả */}
        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <input
            type="text"
            className="form-control"
            value={form.service.description}
            onChange={(e) =>
              handleInput('service', 'description', e.target.value)
            }
            placeholder="Nhập mô tả"
            required
            style={{ borderColor: '#2196f3' }}
          />
        </div>

        {/* Thời gian */}
        <div className="mb-3">
          <label className="form-label">Thời gian</label>
          <input
            className="form-control"
            value={form.price.time}
            onChange={(e) => handleInput('price', 'time', e.target.value)}
            placeholder="Nhập thời gian"
            required
            style={{ borderColor: '#2196f3' }}
          />
        </div>

        {/* Giá */}
        <div className="mb-3">
          <label className="form-label">Giá</label>
          <input
            className="form-control"
            value={form.price.price}
            onChange={(e) => handleInput('price', 'price', e.target.value)}
            placeholder="Nhập giá"
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

export default Services;
