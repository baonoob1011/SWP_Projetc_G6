import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

type Locus = {
  allele1: string;
  allele2: string;
  locusId: string;
  locusName: string;
};

const CreateResultAllele = () => {
  const [allele1, setAllele1] = useState('');
  const [allele2, setAllele2] = useState('');
  const [alleleStatus, setAlleleStatus] = useState('ENTERED');
  const [locusList, setLocusList] = useState<Locus[]>([]);
  const [selectedLocus, setSelectedLocus] = useState('');
  const { sampleId } = useParams();
  const location = useLocation();
  const { patientName } = location.state || {};
  const navigate = useNavigate();
  const { appointmentId } = location.state || {};
  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/locus/get-all-locus', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) {
        toast.error('Không thể lấy danh sách locus');
      } else {
        const data = await res.json();
        setLocusList(data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy locus:', error);
      toast.error('Lỗi khi lấy dữ liệu locus.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sampleId || !selectedLocus) {
      toast.error('Vui lòng chọn đầy đủ sampleId và locus.');
      return;
    }

    const data = {
      allele1,
      allele2,
      alleleStatus,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/result-allele/create-result-allele?sampleId=${sampleId}&locusId=${selectedLocus}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        toast.success('Tạo kết quả allele thành công!');
        setAllele1('');
        setAllele2('');
        setAlleleStatus('ENTERED');
        setSelectedLocus('');
        navigate(`/s-page/get-appointment/${appointmentId}`);
      } else {
        const errorData = await response.json();
        toast.error('Lỗi: ' + errorData.message);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      toast.error('Đã xảy ra lỗi khi gửi dữ liệu.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <h4 className="mb-4">Ghi kết quả allele</h4>

      {patientName && (
        <div className="mb-3">
          <label className="form-label">Tên bệnh nhân</label>
          <input
            type="text"
            className="form-control"
            value={patientName}
            disabled
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Giá trị Allele</label>
          <input
            type="text"
            className="form-control"
            value={allele1}
            onChange={(e) => setAllele1(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Giá trị Allele</label>
          <input
            type="text"
            className="form-control"
            value={allele2}
            onChange={(e) => setAllele2(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Trạng thái Allele</label>
          <select
            className="form-select"
            value={alleleStatus}
            onChange={(e) => setAlleleStatus(e.target.value)}
            required
          >
            <option value="ENTERED">Đã nhập</option>
            <option value="NOT_ENTERED">Chưa nhập</option>
            <option value="SUSPECT">Nghi ngờ</option>
            <option value="VALID">Hợp lệ</option>
            <option value="DONE">Hoàn thành</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label">Chọn Locus</label>
          <select
            className="form-select"
            value={selectedLocus}
            onChange={(e) => setSelectedLocus(e.target.value)}
            required
          >
            <option value="">-- Chọn locus --</option>
            {locusList.map((locus) => (
              <option key={locus.locusId} value={locus.locusId}>
                {locus.locusName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 fw-bold"
          disabled={!selectedLocus}
        >
          Ghi kết quả
        </button>
      </form>
    </div>
  );
};

export default CreateResultAllele;
