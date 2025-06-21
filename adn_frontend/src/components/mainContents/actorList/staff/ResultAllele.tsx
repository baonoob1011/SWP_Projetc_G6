import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const CreateResultAllele = () => {
  const [alleleValue, setAlleleValue] = useState('');
  const [allelePosition, setAllelePosition] = useState('');
  const [alleleStatus, setAlleleStatus] = useState('ENTERED');
  const { sampleId } = useParams(); // sampleId lấy từ URL
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      alleleValue: parseFloat(alleleValue),
      allelePosition,
      alleleStatus,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/result-allele/create-result-allele?sampleId=${sampleId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        alert('Tạo kết quả allele thành công!');
      } else {
        const errorData = await response.json();
        alert('Lỗi: ' + errorData.message);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      alert('Đã xảy ra lỗi khi gửi dữ liệu.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Allele Value:</label>
        <input
          type="number"
          step="0.1"
          value={alleleValue}
          onChange={(e) => setAlleleValue(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Allele Position:</label>
        <input
          type="text"
          value={allelePosition}
          onChange={(e) => setAllelePosition(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Allele Status:</label>
        <select
          value={alleleStatus}
          onChange={(e) => setAlleleStatus(e.target.value)}
        >
          <option value="ENTERED">Đã nhập</option>
          <option value="NOT_ENTERED">Chưa nhập</option>
          <option value="SUSPECT">Nghi ngờ</option>
          <option value="VALID">Hợp lệ</option>
          <option value="DONE">Hoàn thành</option>
        </select>
      </div>

      <button type="submit">Gửi kết quả</button>
    </form>
  );
};

export default CreateResultAllele;
