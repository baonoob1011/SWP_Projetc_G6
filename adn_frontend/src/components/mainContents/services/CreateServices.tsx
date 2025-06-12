import { useState, useRef, useEffect } from "react";
import styles from "./Services.module.css";
import CustomSnackBar from "../userinfor/Snackbar";
import Swal from "sweetalert2";

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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success"
  });

  useEffect(() => {
    setIsAdmin(localStorage.getItem("role") === "ADMIN" || localStorage.getItem("role") === "MANAGER");
  }, []);

  const role = localStorage.getItem("role")

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
      toast.warning('Vui lòng chọn ảnh hợp lệ');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.service.serviceName.trim()) {
      setSnackbar({
        open: true,
        message: "Vui lòng nhập tên dịch vụ",
        severity: "error"
      });
      return;
    }

    if (!form.service.description.trim()) {
      setSnackbar({
        open: true,
        message: "Vui lòng nhập mô tả dịch vụ",
        severity: "error"
      });
      return;
    }

    if (!form.service.serviceType) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn loại dịch vụ",
        severity: "error"
      });
      return;
    }

    if (!form.price.time.trim()) {
      setSnackbar({
        open: true,
        message: "Vui lòng nhập thời gian",
        severity: "error"
      });
      return;
    }

    if (!file) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn ảnh",
        severity: "error"
      });
      return;
    }

    const parsedPrice = Number(form.price.price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setSnackbar({
        open: true,
        message: "Giá phải là số dương",
        severity: "error"
      });
      return;
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
        Swal.fire({
          title: "Thành công!",
          text: "Tạo dịch vụ thành công",
          icon: "success",
          confirmButtonText: "OK"
        });
        
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
        setSnackbar({
          open: true,
          message: "Lỗi: " + error,
          severity: "error"
        });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Đã xảy ra lỗi khi gửi dữ liệu",
        severity: "error"
      });
    }
  };

  if (!isAdmin) return null;

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form} style={role !== "ADMIN" ? { marginTop: 120 } : undefined}>
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
          <label className={styles.label}>Mô tả</label>
          <input
            type="text"
            name="description"
            value={form.service.description}
            onChange={(e) => handleInput("service", "description", e.target.value)}
            placeholder="Nhập mô tả"
            className={styles.input}
            required
          />
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
      <CustomSnackBar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default Services;
