import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './ResultAllele.module.css';

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
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>🧬 Ghi Kết Quả Allele</h1>
          <p className={styles.subtitle}>Nhập thông tin allele cho mẫu DNA</p>
        </div>

        {patientName && (
          <div className={styles.patientInfo}>
            <label className={styles.label}>Tên bệnh nhân</label>
            <input
              type="text"
              className={styles.inputField}
              value={patientName}
              disabled
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.alleleGroup}>
            <div className={`${styles.formGroup} ${styles.alleleField}`}>
              <label className={styles.label}>Allele 1</label>
              <input
                type="text"
                className={styles.inputField}
                value={allele1}
                onChange={(e) => setAllele1(e.target.value)}
                placeholder="Nhập giá trị allele 1"
                required
              />
            </div>
            
            <div className={`${styles.formGroup} ${styles.alleleField}`}>
              <label className={styles.label}>Allele 2</label>
              <input
                type="text"
                className={styles.inputField}
                value={allele2}
                onChange={(e) => setAllele2(e.target.value)}
                placeholder="Nhập giá trị allele 2"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Trạng thái Allele</label>
            <select
              className={`${styles.selectField} ${styles.statusSelect}`}
              value={alleleStatus}
              onChange={(e) => setAlleleStatus(e.target.value)}
              required
            >
              <option value="ENTERED">✅ Đã nhập</option>
              <option value="NOT_ENTERED">❌ Chưa nhập</option>
              <option value="SUSPECT">🤔 Nghi ngờ</option>
              <option value="VALID">✔️ Hợp lệ</option>
              <option value="DONE">🎉 Hoàn thành</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Chọn Locus</label>
            <select
              className={`${styles.selectField} ${styles.locusSelect}`}
              value={selectedLocus}
              onChange={(e) => setSelectedLocus(e.target.value)}
              required
            >
              <option value="">🔬 -- Chọn locus --</option>
              {locusList.map((locus) => (
                <option key={locus.locusId} value={locus.locusId}>
                  📍 {locus.locusName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={!selectedLocus}
          >
            🧬 Ghi kết quả
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateResultAllele;
