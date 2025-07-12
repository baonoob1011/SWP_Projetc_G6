/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  fieldLabels,
  type Location,
  type Patient,
  type Price,
  type SlotInfo,
} from '../type/FillFormType';
import CustomSnackBar from '../userinfor/Snackbar';
import { book } from '../userinfor/Validation';

const BookingAtCenter = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [price, setPrice] = useState<Price[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(''); // Thêm state cho ngày được chọn
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const relationshipOption = [
    'Con',
    'Ba',
    'Mẹ',
    'Ông',
    'Bà',
    'Cô',
    'Chú',
    'Cháu',
  ];
  const [patientOne, setPatientOne] = useState<Patient>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    identityNumber: '',
    gender: '',
    relationship: '',
    birthCertificate: '',
  });

  const [patientTwo, setPatientTwo] = useState<Patient>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    identityNumber: '',
    gender: '',
    relationship: '',
    birthCertificate: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const [patientOneErrors, setPatientOneErrors] = useState<{
    [key: string]: string;
  }>({});
  const [patientTwoErrors, setPatientTwoErrors] = useState<{
    [key: string]: string;
  }>({});

  const validateField = async (field: string, value: string, setError: any) => {
    if (!book.fields || !(book.fields as any)[field]) {
      setError((prev: any) => ({ ...prev, [field]: '' }));
      return;
    }
    try {
      await (book.fields as any)[field].validate(value);
      setError((prev: any) => ({ ...prev, [field]: '' }));
    } catch (err: any) {
      setError((prev: any) => ({ ...prev, [field]: err.message }));
    }
  };

  const handleInputPatientOne = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientOne((prev) => {
      const updated = { ...prev, [name]: value };
      validateField(name, value, setPatientOneErrors);
      return updated;
    });
  };

  const handleInputPatientTwo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientTwo((prev) => {
      const updated = { ...prev, [name]: value };
      validateField(name, value, setPatientTwoErrors);
      return updated;
    });
  };

  // Fetch all locations when component mounts
  const fetchLocations = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/location/get-all-location',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('Location response status:', res.status);

      if (res.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        localStorage.clear();
        navigate('/login');
        return;
      }

      const data = await res.json();
      console.log('Locations data:', data);
      setLocations(data);
    } catch (error) {
      console.error('Fetch locations error:', error);
      toast.error('Không thể lấy danh sách địa điểm');
    }
  };

  // Fetch slots for selected location
  const fetchSlots = async (locationId: string) => {
    setIsLoadingSlots(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/slot/get-all-slot-user?locationId=${locationId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('Slots response status:', res.status);

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
      setSlots(data);
    } catch (error) {
      console.error('Fetch slots error:', error);
      toast.error('Không thể lấy danh sách slot');
      setSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const fetchPrice = async () => {
    setIsLoadingSlots(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/price/get-all-price/${serviceId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('Slots response status:', res.status);

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
      setPrice(data);
    } catch (error) {
      console.error('Fetch slots error:', error);
      toast.error('Không thể xem giá');
      setPrice([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = event.target.value;
    setSelectedLocation(locationId);
    setSelectedSlot(''); // Reset selected slot when location changes
    setSelectedDate(''); // Reset selected date when location changes

    if (locationId) {
      fetchSlots(locationId);
    } else {
      setSlots([]);
    }
  };

  const handleSlotChange = (slotId: string) => {
    setSelectedSlot(slotId);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const priceId = event.target.value;
    setSelectedPrice(priceId);
  };

  // Thêm handler cho việc thay đổi ngày
  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const date = event.target.value;
    setSelectedDate(date);
    setSelectedSlot(''); // Reset selected slot when date changes
  };

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    return m < 0 || (m === 0 && today.getDate() < birthDate.getDate())
      ? age - 1
      : age;
  };

  const handleSubmit = async () => {
    const validatePatients = (): boolean => {
      const patients = [patientOne, patientTwo];
      for (let i = 0; i < patients.length; i++) {
        const p = patients[i];
        const age = calculateAge(p.dateOfBirth);
        if (age < 14 && !p.birthCertificate) {
          toast.warning(
            `Người thứ ${i + 1}: Trẻ dưới 14 tuổi phải có giấy khai sinh`
          );
          return false;
        }
        if (age >= 16 && !p.identityNumber) {
          toast.warning(
            `Người thứ ${i + 1}: Từ 16 tuổi trở lên phải có số CMND/CCCD`
          );
          return false;
        }
      }
      return true;
    };

    if (!selectedLocation) {
      toast.warning('Vui lòng chọn một địa điểm');
      return;
    }

    if (!selectedSlot) {
      toast.warning('Vui lòng chọn một slot');
      return;
    }

    if (!serviceId) {
      toast.error('Service ID không hợp lệ');
      return;
    }
    if (!validatePatients()) {
      return; // Dừng submit nếu không hợp lệ
    }
    setIsSubmitting(true);
    try {
      // Tạo request body theo format BE yêu cầu
      const requestBody = {
        appointmentRequest: {},
        paymentRequest: { paymentMethod },
        patientRequestList: [patientOne, patientTwo],
      };
      const res = await fetch(
        `http://localhost:8080/api/appointment/book-appointment/${serviceId}?slotId=${selectedSlot}&locationId=${selectedLocation}&priceId=${selectedPrice}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log('Submit response status:', res.status);

      if (res.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        localStorage.clear();
        navigate('/login');
        return;
      }

      if (!res.ok) {
        setSnackbar({
          open: true,
          message: 'Kiểm tra và điền thông tin hợp lệ',
          severity: 'error',
        });
      } else {
        navigate(`/u-profile`);
        toast.success('Đặt lịch thành công');
        setSelectedSlot('');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Không thể đặt lịch');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group slots by date
  const groupSlotsByDate = (slots: SlotInfo[]) => {
    return slots.reduce((acc, slot) => {
      const date = slot.slotDate;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(slot);
      return acc;
    }, {} as Record<string, SlotInfo[]>);
  };

  const groupedSlots = groupSlotsByDate(slots);

  useEffect(() => {
    fetchLocations();
  }, []);
  useEffect(() => {
    fetchPrice();
  }, []);
const formatTime = (time: string) => {
  const [hour, minute] = time.split(':');
  // parseInt để bỏ số 0 đứng trước ở giờ, ví dụ "08" → "8"
  return `${parseInt(hour, 10)}:${minute}`;
};

  return (
    <div className="bg-gray-50 min-h-screen pt-12 pb-4">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white shadow-sm p-6 mb-6 mt-15 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"/>
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Đặt Lịch Dịch Vụ Tại Trung Tâm
            </h1>
          </div>
        </div>

        {/* Service Configuration Section */}
        <div className="bg-white shadow-sm p-6 mb-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Thông Tin Dịch Vụ
          </h2>

          <div className="space-y-6">
            {/* Location Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn Địa Điểm
              </label>
              <select
                value={selectedLocation}
                onChange={handleLocationChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Chọn địa điểm --</option>
                {locations.map((location) => (
                  <option key={location.locationId} value={location.locationId}>
                    {`${location.addressLine}, ${location.district}, ${location.city}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Slot Selection */}
            {/* Date and Slot Selection */}
            {selectedLocation && (
              <div className="space-y-4">
                {isLoadingSlots ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">Đang tải danh sách thời gian...</p>
                  </div>
                ) : Object.keys(groupedSlots).length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                    <p className="text-amber-700">Không có slot nào khả dụng cho địa điểm này</p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Chọn lịch hẹn
                    </label>
                    
                    {/* Date Selection Tabs */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      {/* Date Tabs Header */}
                      <div className="flex overflow-x-auto bg-gray-50 border-b border-gray-200">
                        {Object.keys(groupedSlots).map((date) => (
                          <button
                            key={date}
                            onClick={() => handleDateChange({ target: { value: date } } as React.ChangeEvent<HTMLSelectElement>)}
                            className={`flex-shrink-0 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                              selectedDate === date
                                ? 'border-blue-500 text-blue-600 bg-blue-50'
                                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                              </svg>
                              {date}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Slot Selection Grid */}
                      {selectedDate && (
                        <div className="p-6">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {groupedSlots[selectedDate].map((slot) => (
                              <button
                                key={slot.slotId}
                                onClick={() => handleSlotChange(slot.slotId)}
                                className={`p-4 rounded-lg border text-sm font-medium transition-all duration-200 ${
                                  selectedSlot === slot.slotId
                                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg transform scale-105'
                                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md'
                                }`}
                              >
                                <div className="text-center">
                                  <div className="font-semibold">
                                     {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                          
                          {groupedSlots[selectedDate].length === 0 && (
                            <div className="text-center py-8">
                              <p className="text-gray-500">Không có slot nào khả dụng cho ngày này</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Instruction when no date selected */}
                      {!selectedDate && (
                        <div className="p-8 text-center">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                          </svg>
                          <p className="text-gray-600 text-lg">Vui lòng chọn ngày để xem các slot khả dụng</p>
                          <p className="text-gray-500 text-sm mt-2">Nhấp vào một trong các tab ngày ở trên</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn Giá
                </label>
                <select
                  value={selectedPrice}
                  onChange={handlePriceChange}
                  disabled={selectedSlot === ''}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">-- Chọn giá --</option>
                  {price.map((priceItem) => (
                    <option key={priceItem.priceId} value={priceItem.priceId}>
                      {`${priceItem.price} : ${priceItem.time}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức thanh toán
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Chọn phương thức --</option>
                  <option value="VN_PAY">VN PAY</option>
                  <option value="CASH">Tiền mặt</option>
                  <option value="WALLET">Ví cá nhân</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Information Section */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          Thông Tin Bệnh Nhân
        </h2>

        <div className="space-y-6">
          {/* Patient One */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Người Thứ Nhất
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {fieldLabels.map(({ name, label, type }) => (
                <div key={`one-${name}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <input
                    type={type || 'text'}
                    name={name}
                    value={patientOne[name]}
                    onChange={handleInputPatientOne}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      patientOneErrors[name] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {patientOneErrors[name] && (
                    <p className="mt-1 text-sm text-red-600">{patientOneErrors[name]}</p>
                  )}
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mối quan hệ
                </label>
                <select
                  value={patientOne.relationship}
                  onChange={(e) =>
                    setPatientOne((prev) => ({
                      ...prev,
                      relationship: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Chọn mối quan hệ --</option>
                  {relationshipOption.map((relation) => (
                    <option key={relation} value={relation}>
                      {relation}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới tính
              </label>
              <div className="flex gap-4">
                {['Nam', 'Nữ'].map((gender) => (
                  <label key={`one-gender-${gender}`} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={patientOne.gender === gender}
                      onChange={handleInputPatientOne}
                      className="mr-2 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{gender}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Patient Two */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Người Thứ Hai
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {fieldLabels.map(({ name, label, type }) => (
                <div key={`two-${name}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <input
                    type={type || 'text'}
                    name={name}
                    value={patientTwo[name]}
                    onChange={handleInputPatientTwo}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      patientTwoErrors[name] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {patientTwoErrors[name] && (
                    <p className="mt-1 text-sm text-red-600">{patientTwoErrors[name]}</p>
                  )}
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mối quan hệ
                </label>
                <select
                  value={patientTwo.relationship}
                  onChange={(e) =>
                    setPatientTwo((prev) => ({
                      ...prev,
                      relationship: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Chọn mối quan hệ --</option>
                  {relationshipOption.map((relation) => (
                    <option key={relation} value={relation}>
                      {relation}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới tính
              </label>
              <div className="flex gap-4">
                {['Nam', 'Nữ'].map((gender) => (
                  <label key={`two-gender-${gender}`} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender2"
                      value={gender}
                      checked={patientTwo.gender === gender}
                      onChange={(e) =>
                        setPatientTwo((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                      className="mr-2 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{gender}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="bg-white shadow-sm p-6 mt-6 rounded-lg text-center">
          <button
            onClick={handleSubmit}
            disabled={!selectedSlot || isSubmitting}
            className={`px-8 py-3 rounded-lg font-semibold text-lg ${
              !selectedSlot || isSubmitting
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Đang đăng ký...' : 'Đăng Ký Slot'}
          </button>
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

export default BookingAtCenter;