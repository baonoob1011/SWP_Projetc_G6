import {
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  type SelectChangeEvent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type SlotInfo = {
  slotId: number;
  slotDate: string;
  startTime: string;
  endTime: string;
};

type Location = {
  locationId: string;
  addressLine: string;
  district: string;
  city: string;
};

const GetSlot = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Kiểm tra token và auth
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    console.log('Token:', token);
    console.log('Role:', role);

    if (!token || role !== 'USER') {
      console.log('Authentication failed - redirecting to login');
      toast.error('Vui lòng đăng nhập để sử dụng dịch vụ');
      navigate('/login');
      return false;
    }

    setAuth(true);
    return true;
  };

  // Fetch all locations when component mounts
  const fetchLocations = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/user/get-all-location',
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

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
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
    if (!locationId) return;

    setIsLoadingSlots(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/user/get-all-slot?locationId=${locationId}`,
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
      console.log('Slots data:', data);
      setSlots(data);
    } catch (error) {
      console.error('Fetch slots error:', error);
      toast.error('Không thể lấy danh sách slot');
      setSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleLocationChange = (event: SelectChangeEvent<string>) => {
    const locationId = event.target.value;
    setSelectedLocation(locationId);
    setSelectedSlot(''); // Reset selected slot when location changes

    if (locationId) {
      fetchSlots(locationId);
    } else {
      setSlots([]);
    }
  };

  const handleSlotChange = (event: SelectChangeEvent<number | string>) => {
    const value = event.target.value;
    setSelectedSlot(value === '' ? '' : Number(value));
  };

  const handleSubmit = async () => {
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

    setIsSubmitting(true);
    try {
      // Tạo request body theo format BE yêu cầu
      const requestBody = {
        appointmentRequest: {},
        serviceRequest: {
          serviceId: parseInt(serviceId),
        },
        slotRequest: {
          slotId: selectedSlot,
        },
        locationRequest: {
          locationId: parseInt(selectedLocation),
        },
      };

      const res = await fetch(
        `http://localhost:8080/api/appointment/book-appointment/${serviceId}`,
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
        const errorText = await res.text();
        console.error('Submit error response:', errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      setTimeout(() => {
        navigate('/order');
      }, 1500);
      toast.success('Đã đăng ký slot thành công');
      setSelectedSlot('');

      // Refresh slots data
      if (selectedLocation) {
        fetchSlots(selectedLocation);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Không thể đăng ký slot');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log('GetSlot component mounted');
    console.log('Service ID:', serviceId);

    if (checkAuth()) {
      fetchLocations();
    }
  }, [serviceId, navigate]);

  if (!auth) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <p>Đang kiểm tra quyền truy cập...</p>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <h2>Đặt lịch dịch vụ</h2>
      <p>Service ID: {serviceId}</p>

      {/* Location Selection */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="location-select-label">Chọn Địa Điểm</InputLabel>
          <Select
            labelId="location-select-label"
            value={selectedLocation}
            onChange={handleLocationChange}
            input={<OutlinedInput label="Chọn Địa Điểm" />}
            sx={{ fontSize: '16px' }}
          >
            <MenuItem value="">
              <em>-- Chọn địa điểm --</em>
            </MenuItem>
            {locations.map((location) => (
              <MenuItem key={location.locationId} value={location.locationId}>
                {`${location.addressLine}, ${location.district}, ${location.city}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Slot Selection */}
      {selectedLocation && (
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="slot-select-label">Chọn Slot</InputLabel>
            <Select
              labelId="slot-select-label"
              value={selectedSlot}
              onChange={handleSlotChange}
              input={<OutlinedInput label="Chọn Slot" />}
              sx={{ fontSize: '16px' }}
              disabled={isLoadingSlots}
            >
              <MenuItem value="">
                <em>
                  {isLoadingSlots ? '-- Đang tải slot --' : '-- Chọn slot --'}
                </em>
              </MenuItem>
              {slots.map((slot) => (
                <MenuItem key={slot.slotId} value={slot.slotId}>
                  {`${slot.slotDate} - ${slot.startTime} đến ${slot.endTime}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Action Buttons */}
      {selectedLocation && (
        <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!selectedSlot || isSubmitting}
            sx={{ fontSize: '16px' }}
          >
            {isSubmitting ? 'Đang đăng ký...' : 'Đăng Ký Slot'}
          </Button>

          {selectedSlot && (
            <Button
              variant="outlined"
              onClick={() => setSelectedSlot('')}
              sx={{ fontSize: '16px' }}
            >
              Bỏ Chọn Slot
            </Button>
          )}

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setSelectedLocation('');
              setSelectedSlot('');
              setSlots([]);
            }}
            sx={{ fontSize: '16px' }}
          >
            Reset
          </Button>
        </Box>
      )}

      {/* No slots message */}
      {selectedLocation && !isLoadingSlots && slots.length === 0 && (
        <Box sx={{ mt: 2, p: 2, textAlign: 'center', color: 'text.secondary' }}>
          Không có slot nào khả dụng cho địa điểm này
        </Box>
      )}
    </Box>
  );
};

export default GetSlot;
