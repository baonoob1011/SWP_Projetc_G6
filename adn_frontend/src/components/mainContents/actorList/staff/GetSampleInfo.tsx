import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './GetSampleInfo.module.css';

// type Result = {
//   locusName: string;
//   allele1: number;
//   allele2: number;
//   frequency: number;
//   pi: number;
//   locusId: number;
// };
const GetSampleInfo = () => {
  const { appointmentId } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [samples, setSamples] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [result, setResult] = useState<Result>({
  //   locusName: '',
  //   allele1: 0,
  //   allele2: 0,
  //   frequency: 0,
  //   pi: 0,
  //   locusId: 0,
  // });
  const [loading, setLoading] = useState(false);
  const handleResult = async () => {
    const sampleId1 = samples[0]?.sampleResponse?.sampleId;
    const sampleId2 = samples[1]?.sampleResponse?.sampleId;
    try {
      const res = await fetch(
        `http://localhost:8080/api/result-locus/create-result-locus?sampleId1=${sampleId1}&sampleId2=${sampleId2}&appointmentId=${appointmentId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({}),
        }
      );
      if (!res.ok) {
        toast.error('Không đúng định dạng');
      } else {
        toast.success('thành công');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdate = async (sampleId: string, sampleStatus: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/sample/update-status-sample?sampleId=${sampleId}&appointmentId=${appointmentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            sampleStatus: sampleStatus,
          }),
        }
      );

      if (!res.ok) {
        toast.error('Không đúng định dạng hoặc cập nhật thất bại');
      } else {
        toast.success('Cập nhật trạng thái thành công');
        setSamples((prevSamples) =>
          prevSamples.map((s) =>
            s.sampleResponse.sampleId === sampleId
              ? {
                  ...s,
                  sampleResponse: {
                    ...s.sampleResponse,
                    sampleStatus: sampleStatus,
                  },
                }
              : s
          )
        );
      }
    } catch (error) {
      console.log(error);
      toast.error('Lỗi khi cập nhật trạng thái mẫu');
    }
  };

  useEffect(() => {
    const fetchSamples = async () => {
      if (!appointmentId) return;

      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:8080/api/sample/get-all-sample?appointmentId=${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (!res.ok) throw new Error('Không thể lấy dữ liệu mẫu');

        const data = await res.json();
        setSamples(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu mẫu');
      } finally {
        setLoading(false);
      }
    };

    fetchSamples();
  }, [appointmentId]);

  // Helper function to get gender badge class

  const sampleStatusOptions = [
    { value: 'COLLECTED', label: 'Đã thu thập mẫu' },
    { value: 'IN_TRANSIT', label: 'Đang vận chuyển đến phòng xét nghiệm' },
    { value: 'RECEIVED', label: 'Phòng xét nghiệm đã nhận' },
    { value: 'TESTING', label: 'Đang xét nghiệm' },
    { value: 'COMPLETED', label: 'Đã xét nghiệm xong' },
    { value: 'DAMAGED', label: 'Mẫu bị hỏng' },
    { value: 'REJECTED', label: 'Mẫu bị từ chối' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}> Danh Sách Mẫu Đã Thu</div>

      {/* Stats Cards */}
      {samples.length > 0 && (
        <div className={styles.statsContainer}>
          <div className={styles.statsCard}>
            <div className={styles.statsNumber}>{samples.length}</div>
            <div className={styles.statsLabel}>Tổng mẫu</div>
          </div>
          <div className={styles.statsCard}>
            <div className={styles.statsNumber}>
              {
                new Set(samples.map((s) => s.patientSampleResponse?.patientId))
                  .size
              }
            </div>
            <div className={styles.statsLabel}>Bệnh nhân</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>Đang tải dữ liệu mẫu...</div>
        </div>
      ) : samples.length > 0 ? (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell}>Họ tên bệnh nhân</th>
                  <th className={styles.tableHeaderCell}>Quan hệ</th>
                  <th className={styles.tableHeaderCell}>Loại mẫu</th>
                  <th className={styles.tableHeaderCell}>Mã mẫu</th>
                  <th className={styles.tableHeaderCell}>Trạng thái mẫu</th>
                  <th className={styles.tableHeaderCell}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {samples.map((item, index) => (
                  <tr key={index} className={styles.tableRow}>
                    <td className={`${styles.tableCell} ${styles.patientName}`}>
                      {item.patientSampleResponse.fullName}
                    </td>

                    <td className={styles.tableCell}>
                      <span className={styles.relationshipBadge}>
                        {item.patientSampleResponse.relationship}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {item.sampleResponse.sampleType}
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.sampleCode}>
                        {item.sampleResponse.sampleCode}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <select
                        className={styles.statusSelect}
                        value={item.sampleResponse?.sampleStatus}
                        onChange={(e) =>
                          handleUpdate(
                            item.sampleResponse.sampleId,
                            e.target.value
                          )
                        }
                      >
                        {sampleStatusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className={styles.tableCell}>
                      <NavLink
                        className={styles.actionButton}
                        to={`/s-page/record-result/${item.sampleResponse.sampleId}`}
                        state={{
                          patientName: item.patientSampleResponse.fullName,
                          sampleId: item.sampleResponse.sampleId,
                          appointmentId: appointmentId,
                          patientId: item.patientSampleResponse.patientId,
                        }}
                      >
                        Ghi kết quả
                      </NavLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.submitContainer}>
            <button
              type="button"
              onClick={handleResult}
              className={styles.submitButton}
            >
              Gửi kết quả
            </button>
          </div>
        </>
      ) : (
        <div className={styles.noDataContainer}>
          <span className={styles.noDataIcon}>🔬</span>
          <p className={styles.noDataText}>Không có mẫu nào được thu.</p>
        </div>
      )}
    </div>
  );
};

export default GetSampleInfo;
