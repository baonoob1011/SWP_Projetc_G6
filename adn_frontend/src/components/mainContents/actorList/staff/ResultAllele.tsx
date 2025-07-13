/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [alleleStatus, setAlleleStatus] = useState('VALID');
  const [locusList, setLocusList] = useState<Locus[]>([]);
  const [selectedLocus, setSelectedLocus] = useState('');
  const { sampleId } = useParams();
  const location = useLocation();
  const { patientName } = location.state || {};
  const { patientId } = location.state || {};
  const navigate = useNavigate();
  const { appointmentId } = location.state || {};
  const [alleleResultData, setAlleleResultData] = useState<any>('');
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
  const fetchAlleleData = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/result-allele/get-result-allele?patientId=${patientId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!res.ok) {
        toast.error('Không thể lấy dữ liệu đã ghi');
      } else {
        const data = await res.json();
        setAlleleResultData(data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy locus:', error);
      toast.error('Lỗi khi lấy dữ liệu đã ghi');
    }
  };

  useEffect(() => {
    fetchData();
    fetchAlleleData();
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
          <h1 className={styles.title}>Ghi Kết Quả Allele</h1>
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
              <option value="VALID">Hợp lệ</option>
              <option value="INVALID">Không hợp lệ</option>
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
            className={styles.submitButton}
            disabled={!selectedLocus}
          >
            Ghi kết quả
          </button>
        </form>
      </div>
      {alleleResultData &&
        alleleResultData.resultAlleleResponse?.length > 0 && (
          <div className={styles.resultTableContainer}>
            <div className={styles.header}>
              <h2 className={styles.title}>Kết quả Allele</h2>
              <p className={styles.subtitle}>
                Thông tin chi tiết kết quả phân tích DNA
              </p>
            </div>

            <div className={styles.patientInfo}>
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Bệnh nhân:</strong>{' '}
                    {alleleResultData.patientAppointmentResponse?.fullName}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Loại mẫu:</strong>{' '}
                    {alleleResultData.sampleAlleleResponse?.[0]?.sampleType ||
                      'Không có dữ liệu'}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Ngày nhận mẫu:</strong>{' '}
                    {new Date().toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Tổng số allele:</strong>{' '}
                    {alleleResultData.resultAlleleResponse?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Locus</th>
                    <th>Giá trị Allele</th>
                    <th>Vị trí Allele</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {alleleResultData.resultAlleleResponse.map(
                    (allele: any, index: number) => (
                      <tr key={allele.alleleId}>
                        <td>{index + 1}</td>
                        <td>
                          <span className="badge bg-primary">
                            {allele.locusResponse.locusName || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <strong>{allele.alleleValue}</strong>
                        </td>
                        <td>{allele.allelePosition}</td>
                        <td>
                          <span className={`badge ${
                            allele.alleleStatus === 'INVALID' 
                              ? 'bg-warning' 
                              : allele.alleleStatus === 'VALID' 
                              ? 'bg-success' 
                              : 'bg-secondary'
                          }`}>
                            {allele.alleleStatus === 'INVALID'
                              ? 'Không hợp lệ'
                              : allele.alleleStatus === 'VALID'
                              ? 'Hợp lệ'
                              : allele.alleleStatus || 'Đã xác nhận'}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className={styles.tableSummary}>
              <div className="row text-center">
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded">
                    <h5 className="text-primary">
                      {alleleResultData.resultAlleleResponse?.length || 0}
                    </h5>
                    <small className="text-muted">Tổng Allele</small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded">
                    <h5 className="text-success">
                      {alleleResultData.resultAlleleResponse?.filter(
                        (a: any) => a.alleleStatus === 'VALID'
                      ).length || 0}
                    </h5>
                    <small className="text-muted">Hợp lệ</small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded">
                    <h5 className="text-warning">
                      {alleleResultData.resultAlleleResponse?.filter(
                        (a: any) => a.alleleStatus === 'INVALID'
                      ).length || 0}
                    </h5>
                    <small className="text-muted">Không hợp lệ</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default CreateResultAllele;
