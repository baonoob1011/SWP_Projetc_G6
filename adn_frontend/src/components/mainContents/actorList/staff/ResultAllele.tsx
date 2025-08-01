/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './ResultAllele.module.css';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { ArrowBack } from '@mui/icons-material';
Modal.setAppElement('#root'); // đảm bảo hỗ trợ accessibility

type Locus = {
  allele1: string;
  allele2: string;
  locusId: string;
  locusName: string;
  description: string;
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
  // const navigate = useNavigate();
  const { appointmentId } = location.state || {};
  const [alleleResultData, setAlleleResultData] = useState<any>('');
  const [showPopup, setShowPopup] = useState(false);

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

  const handleDelete = async (alleleId: string) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa?',
      text: 'Thao tác này sẽ không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `http://localhost:8080/api/result-allele/delete-allele?alleleId=${alleleId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (res.ok) {
          toast.success('Xóa thành công');
          fetchAlleleData();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

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
        setAlleleStatus('VALID');
        setSelectedLocus('');
        fetchAlleleData();
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
    <>
      <div className="rounded-xl mt-6">
        <button
          onClick={() => setShowPopup(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Xem danh sách Locus
        </button>
        <Modal
          isOpen={showPopup}
          onRequestClose={() => setShowPopup(false)}
          contentLabel="Danh sách Locus"
          className={styles.modalContent}
          overlayClassName={styles.modalOverlay}
        >
          <h3>Danh sách Locus</h3>
          <table className={styles.popupTable}>
            <thead>
              <tr>
                <th>Locus Name</th>
                <th>Mô tả</th>
              </tr>
            </thead>
            <tbody>
              {locusList.map((locus) => (
                <tr key={locus.locusId}>
                  <td>{locus.locusName}</td>
                  <td>{locus.description || 'Không có mô tả'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setShowPopup(false)}
            className={styles.closeButton}
          >
            Đóng
          </button>
        </Modal>{' '}
      </div>
      <div className={styles.container}>
        <div className={styles.formCard}>
          <div>
            <NavLink to={`/s-page/get-appointment/${appointmentId}`}>
              <ArrowBack fontSize="large"></ArrowBack>
            </NavLink>
          </div>
          <div className={styles.header}>
            <h1 className={styles.title}>
              Nhập Thông Tin Gen Di Truyền (Allele)
            </h1>
            <p className={styles.subtitle}>
              Cập nhật allele tại locus cụ thể cho mẫu ADN{' '}
            </p>
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
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.alleleGroup}>
              <div className={`${styles.formGroup} ${styles.alleleField}`}>
                <label className={styles.label}>Allele 1</label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={allele1}
                  onChange={(e) => {
                    const onlyNum = e.target.value.replace(/[^0-9.]/g, '');
                    setAllele1(onlyNum);
                  }}
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
                  onChange={(e) => {
                    const onlyNum = e.target.value.replace(/[^0-9.]/g, '');
                    setAllele2(onlyNum);
                  }}
                  placeholder="Nhập giá trị allele 2"
                  required
                />
              </div>
            </div>

            {/* <div className={styles.formGroup}>
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
            </div> */}

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
                <h2 className={styles.title}>Dữ liệu Allele đã thu</h2>
                <p className={styles.subtitle}>
                  Tổng hợp dữ liệu Allele đã thu với các locus khác nhau
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
                      <th>Nút</th>
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
                            <span
                              className={`badge ${
                                allele.alleleStatus === 'INVALID'
                                  ? 'bg-warning'
                                  : allele.alleleStatus === 'VALID'
                                  ? 'bg-success'
                                  : 'bg-secondary'
                              }`}
                            >
                              {allele.alleleStatus === 'INVALID'
                                ? 'Không hợp lệ'
                                : allele.alleleStatus === 'VALID'
                                ? 'Hợp lệ'
                                : allele.alleleStatus || 'Đã xác nhận'}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleDelete(allele.alleleId)}
                            >
                              {' '}
                              Xóa
                            </button>
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
    </>
  );
};

export default CreateResultAllele;
