import { useState, useRef, useEffect } from "react";
import styles from "./Services.module.css";



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
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } else {
      alert("Lỗi: " + (await res.text()));
    }
  };

  if (!isAdmin) return null;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Tên dịch vụ</label>
        <input
          name="serviceName"
          value={form.serviceName}
          onChange={handleInput}
          placeholder="Nhập tên dịch vụ"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Loại dịch vụ</label>
        <select
          name="serviceType"
          value={form.serviceType}
          onChange={handleInput}
          className={styles.select}
          required
        >
          <option value="">-- Chọn loại dịch vụ --</option>
          <option value="ADMINISTRATIVE">Hành Chính</option>
          <option value="CIVIL">Dân sự</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Hình thức</label>
        <select
          name="description"
          value={form.description}
          onChange={handleInput}
          disabled={!getOptions().length}
          className={styles.select}
          required
        >
          <option value="">-- Chọn hình thức --</option>
          {getOptions().map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Hình ảnh</label>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={styles.fileButton}
        >
          <svg className={styles.fileIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Chọn ảnh
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={handleFile}
        />

        <input
          type="text"
          readOnly
          value={file ? file.name : ""}
          placeholder="Chưa chọn file"
          className={styles.urlInput}
        />
      </div>

      {preview && (
        <img
          src={preview}
          alt="preview"
          className={styles.previewImage}
        />
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={!form.serviceName || !form.serviceType || !form.description || !file}
      >
        Gửi đăng ký
      </button>
    </form>
  );
};

export default Services;