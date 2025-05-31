import { useState, useRef } from "react";

export default function Civil() {
  const [selectFile, setSelectFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith(`image/`)) {
      setSelectFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setImageBase64(result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert("Chọn đúng dịnh đạng ảnh");
    }
  };

  const handleSubmit = () => {
    if (!selectFile) {
      alert("Chưa chọn ảnh");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectFile);

    fetch("http://localhost:8080/api/services/create", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.text())
      .then(() => {
        alert("tạo thành công");
      })
      .catch(() => {
        alert("thất bại");
      });
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "50px auto" }}>
      {/* Nút chọn ảnh */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Chọn ảnh
      </button>

      {/* input file ẩn */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Input hiển thị đường dẫn ảnh (readonly) */}
      <input
        type="text"
        readOnly
        value={previewUrl || ""}
        placeholder="Đường dẫn ảnh sẽ hiện ở đây"
        style={{
          marginTop: 10,
          width: "100%",
          padding: "8px 10px",
          borderRadius: 4,
          border: "1px solid #ccc",
          fontSize: 14,
          boxSizing: "border-box",
        }}
      />

      {/* Nút gửi */}
      <button
        onClick={handleSubmit}
        style={{
          marginTop: 15,
          width: "100%",
          backgroundColor: "green",
          color: "white",
          padding: "10px",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Gửi form (ảnh base64)
      </button>

      {/* Preview ảnh */}
      {previewUrl && (
        <div style={{ marginTop: 15, textAlign: "center" }}>
          <img
            src={previewUrl}
            alt="preview"
            style={{ maxWidth: "100%", borderRadius: 8 }}
          />
        </div>
      )}
    </div>
  );
}
