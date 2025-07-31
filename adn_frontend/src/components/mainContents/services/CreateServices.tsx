/* eslint-disable @typescript-eslint/no-explicit-any */
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
import ServiceList from './GetService';
import ServiceImage from '../../mainContents/feature/featureImage/Service.png';

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

// Types for service count
type PriceItem = {
  time: string;
  price: number;
};

type UserCreateServiceResponse = {
  fullName: string;
};

type ServiceRequest = {
  serviceId: number;
  serviceName: string;
  registerDate: string;
  description: string;
  serviceType: string;
  image?: string;
  active: boolean;
};

type ServiceItem = {
  serviceRequest: ServiceRequest;
  priceListRequest: PriceItem[];
  userCreateServiceResponse: UserCreateServiceResponse;
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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [reloadServiceList, setReloadServiceList] = useState(false);

  // State cho service count
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  // Fetch services count
  const fetchServicesCount = async () => {
    setLoadingServices(true);
    setServiceError(null);
    try {
      const res = await fetch(
        'http://localhost:8080/api/services/get-all-service',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error('Không thể lấy dữ liệu dịch vụ');

      const data = await res.json();
      const fixedData = Array.isArray(data)
        ? data.map((item) => ({
            ...item,
            serviceRequest: {
              ...item.serviceRequest,
              serviceId: Number(item.serviceRequest.serviceId) || 0,
            },
          }))
        : [];

      setServices(fixedData);
    } catch (err: any) {
      setServiceError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    setIsAdmin(role === 'ADMIN' || role === 'MANAGER');
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchServicesCount();
    }
  }, [isAdmin]);

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
        // Refresh service count after creating new service
        fetchServicesCount();
        setReloadServiceList((prev) => !prev); // Toggle để thông báo cho ServiceList
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
    <div className="min-h-screen bg-white ml-10">
      <div className="max-w-full">
        {/* Statistics Header */}
        <div className="bg-[#3667F9] rounded-lg p-6 mb-6 relative">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-white text-lg font-semibold">
              Quản lý dịch vụ
            </h2>
          </div>
          {/* Breadcrumb */}
          <div className="flex items-center mb-6 text-blue-100">
            <span className="text-white font-medium">Manager</span>
            <span className="mx-2">›</span>
            <span>Danh sách dịch vụ</span>
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div className="text-blue-100 text-xl">
              {loadingServices ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-100 border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang tải...</span>
                </div>
              ) : serviceError ? (
                <span className="text-red-200">Lỗi: {serviceError}</span>
              ) : (
                <span>Tổng số dịch vụ: {services.length}</span>
              )}
            </div>
          </div>
          {/* Đặt hình ảnh vào trong header */}
          <div className="absolute right-0 bottom-0 mb-4 mr-40">
            <img
              src={ServiceImage}
              alt="service"
              className="h-40 object-contain"
            />
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Thêm Dịch Vụ
          </button>
        </div>

        {/* Create Form - Collapsible */}
        {showCreateForm && (
          <div className="bg-white border border-gray-200 rounded-lg mb-6 shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Thêm Dịch Vụ Mới
              </h3>
              <form onSubmit={handleSubmit}>
                {/* Kit Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn Kit
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={selectedKit}
                      onChange={handleKitChange}
                      input={<OutlinedInput />}
                      displayEmpty
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          '&:hover': {
                            borderColor: '#9ca3af',
                          },
                          '&.Mui-focused': {
                            borderColor: '#2563eb',
                            boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)',
                          },
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em style={{ color: '#6b7280' }}>----Chọn Kit----</em>
                      </MenuItem>
                      {kit.map((kit) => (
                        <MenuItem key={kit.kitId} value={kit.kitId}>
                          {kit.kitName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Service Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên Dịch Vụ
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={form.service.serviceName}
                      onChange={(e) =>
                        handleInput('service', 'serviceName', e.target.value)
                      }
                      placeholder="Nhập tên dịch vụ"
                      required
                    />
                  </div>

                  {/* Service Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại Dịch Vụ
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={form.service.serviceType}
                      onChange={(e) =>
                        handleInput('service', 'serviceType', e.target.value)
                      }
                      required
                    >
                      <option value="">-- Chọn loại dịch vụ --</option>
                      <option value="ADMINISTRATIVE">Hành chính</option>
                      <option value="CIVIL">Dân sự</option>
                    </select>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời Gian
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={form.price.time}
                      onChange={(e) =>
                        handleInput('price', 'time', e.target.value)
                      }
                      placeholder="Nhập thời gian thực hiện"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá Tiền
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={form.price.price}
                      onChange={(e) =>
                        handleInput('price', 'price', e.target.value)
                      }
                      placeholder="Nhập giá dịch vụ"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô Tả
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={form.service.description}
                      onChange={(e) =>
                        handleInput('service', 'description', e.target.value)
                      }
                      placeholder="Nhập mô tả dịch vụ"
                      required
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình Ảnh
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileRef}
                    onChange={handleFile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {file && (
                    <div className="mt-2 text-sm text-blue-600">
                      Đã chọn: {file.name}
                    </div>
                  )}
                </div>

                {/* Image Preview */}
                {preview && (
                  <div className="mb-4 text-center">
                    <img
                      src={preview}
                      alt="preview"
                      className="inline-block max-w-xs max-h-48 object-cover rounded-md border border-gray-300"
                    />
                  </div>
                )}

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
                    Tạo Dịch Vụ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <ServiceList reloadTrigger={reloadServiceList} />
    </div>
  );
};

export default Services;
