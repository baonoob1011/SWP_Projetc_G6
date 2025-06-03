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
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("role") === "MANAGER");
  }, []);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected?.type.startsWith("image/")) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    } else {
      alert("Vui lòng chọn ảnh hợp lệ");
    }
  };

  const getOptions = () =>
    form.serviceType === "ADMINISTRATIVE"
      ? ["Lấy mẫu xét nghiệm tại cơ sở"]
      : form.serviceType === "CIVIL"
      ? ["Lấy mẫu xét nghiệm tại cơ sở", "Lấy mẫu xét nghiệm tại nhà"]
      : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Chưa chọn ảnh");

    const request = {
      serviceRequest: { ...form },
      priceListRequest: {},
      administrativeServiceRequest: {},
      civilServiceRequest: {},
    };

    const formData = new FormData();
    formData.append(
      "request",
      new Blob([JSON.stringify(request)], { type: "application/json" })
    );
    formData.append("file", file);

    const res = await fetch(
      "http://localhost:8080/api/services/create-service",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: formData,
      }
    );

    if (res.ok) {
      alert("Tạo dịch vụ thành công");
      setForm({ serviceName: "", description: "", serviceType: "" });
      setFile(null);
      setPreview("");
    } else {
      alert("Lỗi: " + (await res.text()));
    }
  };

  if (!isAdmin) return null;

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 500, margin: "50px auto", padding: 20 }}
    >
      <input
        name="serviceName"
        value={form.serviceName}
        onChange={handleInput}
        placeholder="Tên dịch vụ"
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <select
        name="serviceType"
        value={form.serviceType}
        onChange={handleInput}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      >
        <option value="">-- Chọn loại dịch vụ --</option>
        <option value="ADMINISTRATIVE">Hành Chính</option>
        <option value="CIVIL">Dân sự</option>
      </select>

      <select
        name="description"
        value={form.description}
        onChange={handleInput}
        disabled={!getOptions().length}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      >
        <option value="">-- Chọn hình thức --</option>
        {getOptions().map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        style={{
          padding: 10,
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
        }}
      >
        Chọn ảnh
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />

      <input
        type="text"
        readOnly
        value={preview}
        placeholder="URL ảnh"
        style={{ width: "100%", padding: 8, marginTop: 10 }}
      />

      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{ width: "100%", marginTop: 10, borderRadius: 8 }}
        />
      )}

      <button
        type="submit"
        style={{
          width: "100%",
          marginTop: 15,
          padding: 10,
          backgroundColor: "green",
          color: "white",
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
