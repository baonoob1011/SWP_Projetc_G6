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

  useEffect(() => {
    setIsAdmin(
      localStorage.getItem('role') === 'ADMIN' ||
        localStorage.getItem('role') === 'MANAGER'
    );
  }, []);

  const fetchKit = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/kit/get-all-kit-staff', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

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
        const error = 'Tên dịch vụ đã tồn tại';
        toast.warning(error);
      }
    } catch (err) {
      console.error(err);
      toast.warning('Đã xảy ra lỗi khi gửi dữ liệu.');
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div 
              className="text-white p-4 mb-0 rounded-top"
              style={{
                background: 'linear-gradient(135deg, #4285f4 0%, #1a73e8 100%)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div className="d-flex align-items-center">
                <div 
                  className="me-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 fw-bold">Thêm Dịch Vụ Mới</h3>
                  <p className="mb-0 opacity-75">Điền thông tin chi tiết dịch vụ bên dưới</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white p-4 rounded-bottom shadow-sm">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Kit Selection */}
                  <div className="col-12">
                    <div className="position-relative">
                      <div className="d-flex align-items-center mb-3">
                        <div 
                          className="me-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#e3f2fd',
                            borderRadius: '12px'
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="#4285f4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3.27 6.96L12 12.01L20.73 6.96" stroke="#4285f4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 22.08V12" stroke="#4285f4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <label className="form-label fw-semibold mb-0 text-dark">Chọn Kit</label>
                      </div>
                      <FormControl fullWidth>
                        <Select
                          value={selectedKit}
                          onChange={handleKitChange}
                          input={<OutlinedInput />}
                          displayEmpty
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: '#f8f9fa',
                              '&:hover': {
                                backgroundColor: '#e3f2fd',
                              },
                              '&.Mui-focused': {
                                backgroundColor: '#e3f2fd',
                              }
                            }
                          }}
                        >
                          <MenuItem value="">
                            <em style={{ color: '#6c757d' }}>----Chọn Kit----</em>
                          </MenuItem>
                          {kit.map((kit) => (
                            <MenuItem key={kit.kitId} value={kit.kitId}>
                              {kit.kitCode}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>

                  {/* Service Name */}
                  <div className="col-md-6">
                    <div className="position-relative">
                      <div className="d-flex align-items-center mb-3">
                        <div 
                          className="me-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#e3f2fd',
                            borderRadius: '12px'
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" stroke="#ff9800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <label className="form-label fw-semibold mb-0 text-dark">Tên Dịch Vụ</label>
                      </div>
                      <input
                        className="form-control py-3"
                        value={form.service.serviceName}
                        onChange={(e) =>
                          handleInput('service', 'serviceName', e.target.value)
                        }
                        placeholder="Nhập tên dịch vụ"
                        required
                        style={{
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Service Type */}
                  <div className="col-md-6">
                    <div className="position-relative">
                      <div className="d-flex align-items-center mb-3">
                        <div 
                          className="me-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#f3e5f5',
                            borderRadius: '12px'
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12L11 14L15 10" stroke="#9c27b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#9c27b0" strokeWidth="2"/>
                          </svg>
                        </div>
                        <label className="form-label fw-semibold mb-0 text-dark">Loại Dịch Vụ</label>
                      </div>
                      <select
                        className="form-select py-3"
                        value={form.service.serviceType}
                        onChange={(e) =>
                          handleInput('service', 'serviceType', e.target.value)
                        }
                        required
                        style={{
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          fontSize: '16px'
                        }}
                      >
                        <option value="">-- Chọn loại dịch vụ --</option>
                        <option value="ADMINISTRATIVE">Hành chính</option>
                        <option value="CIVIL">Dân sự</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="col-12">
                    <div className="position-relative">
                      <div className="d-flex align-items-center mb-3">
                        <div 
                          className="me-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#e8f5e8',
                            borderRadius: '12px'
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6H20M4 12H20M4 18H16" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <label className="form-label fw-semibold mb-0 text-dark">Mô Tả</label>
                      </div>
                      <textarea
                        className="form-control"
                        value={form.service.description}
                        onChange={(e) =>
                          handleInput('service', 'description', e.target.value)
                        }
                        placeholder="Nhập mô tả dịch vụ"
                        required
                        rows={3}
                        style={{
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          fontSize: '16px',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div className="col-md-6">
                    <div className="position-relative">
                      <div className="d-flex align-items-center mb-3">
                        <div 
                          className="me-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#fff3e0',
                            borderRadius: '12px'
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#ff9800" strokeWidth="1.5"/>
                            <path d="M12 6V12L16 14" stroke="#ff9800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <label className="form-label fw-semibold mb-0 text-dark">Thời Gian</label>
                      </div>
                      <input
                        className="form-control py-3"
                        value={form.price.time}
                        onChange={(e) => handleInput('price', 'time', e.target.value)}
                        placeholder="Nhập thời gian thực hiện"
                        required
                        style={{
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-md-6">
                    <div className="position-relative">
                      <div className="d-flex align-items-center mb-3">
                        <div 
                          className="me-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#e8f5e8',
                            borderRadius: '12px'
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 1V23" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <label className="form-label fw-semibold mb-0 text-dark">Giá Tiền</label>
                      </div>
                      <input
                        className="form-control py-3"
                        value={form.price.price}
                        onChange={(e) => handleInput('price', 'price', e.target.value)}
                        placeholder="Nhập giá dịch vụ"
                        required
                        style={{
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="col-12">
                    <div className="position-relative">
                      <div className="d-flex align-items-center mb-3">
                        <div 
                          className="me-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#f3e5f5',
                            borderRadius: '12px'
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="#9c27b0" strokeWidth="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5" stroke="#9c27b0" strokeWidth="2"/>
                            <path d="M21 15L16 10L5 21" stroke="#9c27b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <label className="form-label fw-semibold mb-0 text-dark">Hình Ảnh</label>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileRef}
                        onChange={handleFile}
                        className="form-control py-3"
                        style={{
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          fontSize: '16px'
                        }}
                      />
                      {file && (
                        <div className="mt-2 text-primary fw-medium">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                            <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4905 2.02168 11.3363C2.16356 9.18206 2.99721 7.13175 4.39828 5.49385C5.79935 3.85595 7.69279 2.71917 9.79619 2.24712C11.8996 1.77507 14.1003 1.98245 16.07 2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Đã chọn: {file.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Preview */}
                  {preview && (
                    <div className="col-12">
                      <div className="text-center">
                        <img
                          src={preview}
                          alt="preview"
                          className="img-fluid rounded shadow-sm"
                          style={{
                            maxWidth: '300px',
                            maxHeight: '200px',
                            objectFit: 'cover',
                            border: '3px solid #4285f4'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-3 fw-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #4285f4 0%, #1a73e8 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '18px',
                        boxShadow: '0 4px 15px rgba(66, 133, 244, 0.3)'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                        <path d="M12 4.5V19.5M4.5 12H19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Tạo Dịch Vụ
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;