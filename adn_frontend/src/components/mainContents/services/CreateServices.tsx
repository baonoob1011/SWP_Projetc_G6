import { useState, useRef, useEffect } from "react";
import styles from "./Services.module.css";

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

const Services = () => {
  const [form, setForm] = useState<{
    service: FormService;
    price: PriceList;
    type: TypeService;
  }>({
    service: {
      serviceName: "",
      description: "",
      serviceType: "",
    },
    price: {
      time: "",
      price: "",
    },
    type: {
      someCivilField: "",
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("role") === "ADMIN" || localStorage.getItem("role")==="MANAGER");
  }, []);

  
  const handleInput = (
    section: "service" | "price" | "type",
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
    if (selected?.type.startsWith("image/")) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    } else {
      alert("Vui lòng chọn ảnh hợp lệ");
    }
  };

  const getOptions = () =>
    form.service.serviceType === "ADMINISTRATIVE"
      ? ["Lấy mẫu xét nghiệm tại cơ sở"]
      : form.service.serviceType === "CIVIL"
      ? ["Lấy mẫu xét nghiệm tại cơ sở", "Lấy mẫu xét nghiệm tại nhà"]
      : [];

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!file) return alert("Chưa chọn ảnh");

  const parsedPrice = Number(form.price.price);
  if (isNaN(parsedPrice)) {
    return alert("Giá phải là số");
  }

  const request = {
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
      form.service.serviceType === "ADMINISTRATIVE" ? form.type : {},
    civilServiceRequest:
      form.service.serviceType === "CIVIL" ? form.type : {},
  };

  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(request)], { type: "application/json" })
  );
  formData.append("file", file);

  try {
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
      setForm({
        service: { serviceName: "", description: "", serviceType: "" },
        price: { time: "", price: "" },
        type: { someCivilField: "" },
      });
      setFile(null);
      setPreview("");
      if (fileRef.current) fileRef.current.value = "";
    } else {
      const error = await res.text();
      alert("Lỗi: " + error);
    }
  } catch (err) {
    console.error(err);
    alert("Đã xảy ra lỗi khi gửi dữ liệu.");
  }
};


  if (!isAdmin) return null;

  return (
    <form onSubmit={handleSubmit} className={styles.form} style={{marginTop: 120}}>
      {/* Service section */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Tên dịch vụ</label>
        <input
          name="serviceName"
          value={form.service.serviceName}
          onChange={(e) =>
            handleInput("service", "serviceName", e.target.value)
          }
          placeholder="Nhập tên dịch vụ"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Loại dịch vụ</label>
        <select
          name="serviceType"
          value={form.service.serviceType}
          onChange={(e) =>
            handleInput("service", "serviceType", e.target.value)
          }
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
          value={form.service.description}
          onChange={(e) =>
            handleInput("service", "description", e.target.value)
          }
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

      {/* Price section */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Thời gian</label>
        <input
          name="time"
          value={form.price.time}
          onChange={(e) => handleInput("price", "time", e.target.value)}
          placeholder="Nhập thời gian"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Giá</label>
        <input
          name="price"
          value={form.price.price}
          onChange={(e) => handleInput("price", "price", e.target.value)}
          placeholder="Nhập giá"
          className={styles.input}
          required
        />
      </div>

      {/* File upload */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Hình ảnh</label>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={styles.fileButton}
        >
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
        <img src={preview} alt="preview" className={styles.previewImage} />
      )}

      <button
        type="submit"
        className={styles.submitButton}
      >
        Gửi đăng ký
      </button>
    </form>
  );
};

export default Services;
