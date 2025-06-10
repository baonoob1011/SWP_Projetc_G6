import React, { useState } from "react";
import CustomSnackBar from "../userinfor/Snackbar";
import Swal from "sweetalert2";

const BookAppointmentForm = () => {
  const [appointmentRequest, setAppointmentRequest] = useState({
    appointmentDate: "",
    location: "",
    appointmentStatus: "PENDING",
    note: "",
  });

  const [serviceRequest, setServiceRequest] = useState({
    serviceId: "",
  });

  const [staffRequest, setStaffRequest] = useState({
    staffId: "",
  });

  const [slotRequest, setSlotRequest] = useState({
    slotName: "",
    startTime: "",
    endTime: "",
    maxSlot: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success"
  });

  const handleAppointmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAppointmentRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setServiceRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleStaffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStaffRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSlotRequest((prev) => ({ ...prev, [name]: value }));
  };

  const formatTimeWithSeconds = (time: string) => {
    if (!time) return "";
    const [hh, mm] = time.split(":");
    return `${hh}:${mm}:00`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!appointmentRequest.appointmentDate) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn ngày hẹn",
        severity: "error"
      });
      return;
    }

    // Kiểm tra ngày hẹn không được là ngày trong quá khứ
    const selectedDate = new Date(appointmentRequest.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setSnackbar({
        open: true,
        message: "Ngày hẹn không thể là ngày trong quá khứ",
        severity: "error"
      });
      return;
    }

    if (!appointmentRequest.location.trim()) {
      setSnackbar({
        open: true,
        message: "Vui lòng nhập địa điểm",
        severity: "error"
      });
      return;
    }

    if (!serviceRequest.serviceId) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn dịch vụ",
        severity: "error"
      });
      return;
    }

    if (!staffRequest.staffId) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn nhân viên",
        severity: "error"
      });
      return;
    }

    if (!slotRequest.slotName.trim()) {
      setSnackbar({
        open: true,
        message: "Vui lòng nhập tên ca",
        severity: "error"
      });
      return;
    }

    if (!slotRequest.startTime || !slotRequest.endTime) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn thời gian bắt đầu và kết thúc",
        severity: "error"
      });
      return;
    }

    // Kiểm tra thời gian kết thúc phải sau thời gian bắt đầu
    const startTime = new Date(`2000-01-01T${slotRequest.startTime}`);
    const endTime = new Date(`2000-01-01T${slotRequest.endTime}`);
    if (endTime <= startTime) {
      setSnackbar({
        open: true,
        message: "Thời gian kết thúc phải sau thời gian bắt đầu",
        severity: "error"
      });
      return;
    }

    const maxSlot = Number(slotRequest.maxSlot);
    if (!maxSlot || maxSlot <= 0) {
      setSnackbar({
        open: true,
        message: "Số lượng tối đa phải là số dương",
        severity: "error"
      });
      return;
    }

    const payload = {
      appointmentRequest: {
        ...appointmentRequest,
      },
      serviceRequest: {
        serviceId: Number(serviceRequest.serviceId),
      },
      staffRequest: {
        staffId: Number(staffRequest.staffId),
      },
      slotRequest: {
        slotName: slotRequest.slotName,
        startTime: formatTimeWithSeconds(slotRequest.startTime),
        endTime: formatTimeWithSeconds(slotRequest.endTime),
        maxSlot: Number(slotRequest.maxSlot),
      },
    };

    try {
      const res = await fetch("http://localhost:8080/api/appointment/book-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Swal.fire({
          title: "Thành công!",
          text: "Đăng ký lịch hẹn thành công!",
          icon: "success",
          confirmButtonText: "OK"
        });

        setAppointmentRequest({
          appointmentDate: "",
          location: "",
          appointmentStatus: "PENDING",
          note: "",
        });
        setServiceRequest({ serviceId: "" });
        setStaffRequest({ staffId: "" });
        setSlotRequest({
          slotName: "",
          startTime: "",
          endTime: "",
          maxSlot: "",
        });
      } else {
        const err = await res.text();
        setSnackbar({
          open: true,
          message: "Lỗi: " + err,
          severity: "error"
        });
      }
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Đã xảy ra lỗi, vui lòng thử lại",
        severity: "error"
      });
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
          Đăng ký dịch vụ
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* appointmentRequest */}
          <div>
            <label className="block font-medium">Ngày hẹn</label>
            <input
              type="date"
              name="appointmentDate"
              value={appointmentRequest.appointmentDate}
              onChange={handleAppointmentChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Địa điểm</label>
            <input
              type="text"
              name="location"
              value={appointmentRequest.location}
              onChange={handleAppointmentChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Trạng thái</label>
            <select
              name="appointmentStatus"
              value={appointmentRequest.appointmentStatus}
              onChange={handleAppointmentChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="PENDING">Đang chờ</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="CANCELLED">Đã huỷ</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Ghi chú</label>
            <input
              type="text"
              name="note"
              value={appointmentRequest.note}
              onChange={handleAppointmentChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* serviceRequest */}
          <div>
            <label className="block font-medium">Service ID</label>
            <input
              type="number"
              name="serviceId"
              value={serviceRequest.serviceId}
              onChange={handleServiceChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* staffRequest */}
          <div>
            <label className="block font-medium">Staff ID</label>
            <input
              type="number"
              name="staffId"
              value={staffRequest.staffId}
              onChange={handleStaffChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* slotRequest */}
          <div>
            <label className="block font-medium">Tên ca</label>
            <input
              type="text"
              name="slotName"
              value={slotRequest.slotName}
              onChange={handleSlotChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Thời gian bắt đầu</label>
            <input
              type="time"
              name="startTime"
              value={slotRequest.startTime}
              onChange={handleSlotChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Thời gian kết thúc</label>
            <input
              type="time"
              name="endTime"
              value={slotRequest.endTime}
              onChange={handleSlotChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Số lượng tối đa</label>
            <input
              type="number"
              name="maxSlot"
              value={slotRequest.maxSlot}
              onChange={handleSlotChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Đặt lịch
            </button>
          </div>
        </form>
      </div>
      <CustomSnackBar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default BookAppointmentForm;
