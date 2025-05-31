import { useState, useRef, useEffect } from "react";

type FormService = {
  serviceName: string;
  description: string;
  serviceType: string;
};

const Services = () => {
  const [form, setForm] = useState<FormService>({
    serviceName: "",
    description: "",
    serviceType: "",
  });

  const [selectFile, setSelectFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "ADMIN") {
      setIsAdmin(true);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert("Chọn đúng định dạng ảnh");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectFile) {
      alert("Chưa chọn ảnh");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const serviceRequest = {
        serviceName: form.serviceName,
        description: form.description,
        serviceType: form.serviceType,
      };

      const request = {
        serviceRequest,
        priceListRequest: {}, // Nếu có thông tin giá, bổ sung vào đây
        administrativeServiceRequest: {}, // Hoặc dùng civilServiceRequest nếu gọi API dân sự
      };

      const formData = new FormData();
      formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
      formData.append("file", selectFile);

      const response = await fetch(
        "http://localhost:8080/api/services/create-administrative-service",
        {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        alert("Lỗi khi tạo dịch vụ: " + errorText);
      } else {
        alert("Tạo dịch vụ thành công");
        setForm({ serviceName: "", description: "", serviceType: "" });
        setSelectFile(null);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi hệ thống");
    }
  };

  if (!isAdmin) return null;

  return (
    <form
      onSubmit={handleSubmit}
      style={{ padding: 20, maxWidth: 500, margin: "50px auto" }}
    >
      <input
        type="text"
        name="serviceName"
        placeholder="Tên dịch vụ"
        value={form.serviceName}
        onChange={handleInput}
        style={{
          display: "block",
          width: "100%",
          padding: 8,
          marginBottom: 10,
        }}
      />
      <input
        type="text"
        name="description"
        placeholder="Hình thức"
        value={form.description}
        onChange={handleInput}
        style={{
          display: "block",
          width: "100%",
          padding: 8,
          marginBottom: 10,
        }}
      />
      <input
        type="text"
        name="serviceType"
        placeholder="Loại dịch vụ"
        value={form.serviceType}
        onChange={handleInput}
        style={{
          display: "block",
          width: "100%",
          padding: 8,
          marginBottom: 10,
        }}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
        }}
      >
        Chọn ảnh
      </button>

      <input
        type="file"
        accept="image/*"
        name="image"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <input
        type="text"
        readOnly
        value={previewUrl || ""}
        placeholder="URL"
        style={{ display: "block", width: "100%", padding: 8, marginTop: 10 }}
      />

      {previewUrl && (
        <div style={{ marginTop: 10, textAlign: "center" }}>
          <img
            src={previewUrl}
            alt="preview"
            style={{ maxWidth: "100%", borderRadius: 8 }}
          />
        </div>
      )}

      <button
        type="submit"
        style={{
          marginTop: 15,
          width: "100%",
          backgroundColor: "green",
          color: "white",
          padding: 10,
          border: "none",
          borderRadius: 4,
        }}
      >
        Gửi đăng ký
      </button>
    </form>
  );
};

export default Services;
