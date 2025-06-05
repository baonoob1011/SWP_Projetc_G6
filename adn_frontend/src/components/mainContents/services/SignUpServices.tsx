import React, { useState } from "react";

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
        alert("Đăng ký lịch hẹn thành công!");
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
        alert("Lỗi: " + err);
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  return (
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
  );
};

export default BookAppointmentForm;
