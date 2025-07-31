/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArrowBack } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from '../../feature/GetAllResult.module.css';
import Logo from '../../../../image/Logo.png';
import Sign from '../../../../image/Sign.png';
import ExportResultPDF from '../../feature/PrintPDF';
import Swal from 'sweetalert2';
const GetAllResultByManager = () => {
  const { appointmentId } = useParams();
  const [isResult, setIsResult] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/appointment/get-all-result-by-manager?appointmentId=${appointmentId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!res.ok) {
        toast.error('Không thể lấy dữ liệu');
        return;
      }

      const data = await res.json();
      setIsResult(data);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi hệ thống khi lấy dữ liệu');
    }
  };
  const handleResult = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/appointment/update-complete-appointment-by-manager?appointmentId=${appointmentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({}),
        }
      );
      if (!res.ok) {
        toast.warning('Ko thể thực hiện');
      } else {
        toast.success('Gửi kết quả thành công');
        navigate('/manager/checkResult');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (appointmentId) fetchData();
  }, [appointmentId]);

  return (
    <div className={styles.container}>
      {isResult
        .filter(
          (item) =>
            item.resultAppointmentResponse?.[0]?.resultStatus === 'COMPLETED'
        )
        .map((item, index) => (
          <div key={index} className={styles.reportCard}>
            <Button
              component={NavLink}
              to="/manager/checkResult"
              className={styles.backButton}
            >
              <ArrowBack />
              Quay lại
            </Button>
            {/* Header */}
            <div className={styles.reportHeader}>
              <div className={styles.headerTop}>
                <div className={styles.logoSection}>
                  <img src={Logo} alt="GENELINK Logo" className={styles.logo} />
                </div>
                <div className={styles.reportId}>
                  <p className={styles.reportIdLabel}>No:</p>
                  <p className={styles.reportIdValue}>
                    KQ {item.showAppointmentResponse?.appointmentId}
                  </p>
                </div>
              </div>
              <h2 className={styles.reportTitle}>
                PHIẾU KẾT QUẢ PHÂN TÍCH ADN
              </h2>
            </div>

            {/* Watermark */}
            <div className={styles.watermark}>GENELINK</div>

            {/* Body */}
            <div className={styles.reportBody}>
              {/* Phần giới thiệu */}
              <div className={styles.introSection}>
                <p className={styles.introText}>
                  Ông (Bà):{' '}
                  <span className={styles.applicantName}>
                    {item.userAppointmentResponse.fullName}
                  </span>
                </p>
                <p className={styles.introText}>
                  Số điện thoại:{' '}
                  <span className={styles.applicantName}>
                    {item.userAppointmentResponse.phone}
                  </span>
                </p>
                <p className={styles.introText}>
                  Địa chỉ:{' '}
                  <span className={styles.applicantName}>
                    {item.userAppointmentResponse.address}
                  </span>
                </p>
                <p className={styles.companyStatement}>
                  Công ty Genelink tiến hành phân tích các mẫu ADN sau:
                </p>
              </div>

              {/* Thông tin mẫu giám định theo template */}
              <div className={styles.section}>
                <table className={styles.table}>
                  <thead className={styles.tableHeader}>
                    <tr>
                      <th className={styles.tableHeaderCell}>TT</th>
                      <th className={styles.tableHeaderCell}>Họ tên</th>
                      <th className={styles.tableHeaderCell}>Quan hệ</th>
                      <th className={styles.tableHeaderCell}>Loại mẫu</th>
                      <th className={styles.tableHeaderCell}>Ngày thu mẫu</th>
                      <th className={styles.tableHeaderCell}>Ký hiệu mẫu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.patientAppointmentResponse
                      ?.slice(0, 2)
                      .map((patient: any, i: number) => (
                        <tr key={i} className={styles.tableRow}>
                          <td className={styles.tableCell}>{i + 1}</td>
                          <td
                            className={`${styles.tableCell} ${styles.patientName}`}
                          >
                            {patient.fullName}
                          </td>
                          <td className={styles.tableCell}>
                            {patient.relationship}
                          </td>
                          <td className={styles.tableCell}>
                            {item.sampleAppointmentResponse?.[0].sampleType}
                          </td>
                          <td className={styles.tableCell}>
                            {item.showAppointmentResponse?.appointmentDate}
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.sampleCode}>
                              {item.sampleAppointmentResponse?.[i]
                                ?.sampleCode || '---'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Ghi chú về phân tích */}
              <p className={styles.templateNote}>
                Sau khi phân tích các mẫu ADN có ký hiệu trên bằng bộ kít
                Identifiler - Plus của hãng Appliedbiosystems - Mỹ chúng tôi có
                kết quả sau:
              </p>

              {/* Bảng Locus phức tạp theo template */}
              <div className={styles.section}>
                <table
                  className={`${styles.table} ${styles.locusTableComplex}`}
                >
                  <thead className={styles.tableHeader}>
                    <tr>
                      <th rowSpan={2} className={styles.tableHeaderCell}>
                        Locus Gen
                      </th>
                      <th colSpan={2} className={styles.tableHeaderCell}>
                        Kiểu gen
                      </th>
                      <th rowSpan={2} className={styles.tableHeaderCell}>
                        PI
                      </th>
                    </tr>
                    <tr className={styles.subHeader}>
                      <th className={styles.tableHeaderCell}>
                        {item.resultLocusAppointmentResponse?.[0]
                          ?.sampleCode1 || 'Mã mẫu 1'}
                      </th>
                      <th className={styles.tableHeaderCell}>
                        {item.resultLocusAppointmentResponse?.[0]
                          ?.sampleCode2 || 'Mã mẫu 2'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.resultLocusAppointmentResponse?.map(
                      (locus: any, i: number) => (
                        <tr key={i} className={styles.tableRow}>
                          <td
                            className={`${styles.tableCell} ${styles.locusName}`}
                          >
                            {locus.locusName}
                          </td>
                          <td
                            className={`${styles.tableCell} ${styles.alleleCell}`}
                          >
                            {locus.allele1} - {locus.allele2}
                          </td>
                          <td
                            className={`${styles.tableCell} ${styles.alleleCell}`}
                          >
                            {locus.fatherAllele1 ?? 'N/A'} -{' '}
                            {locus.fatherAllele2 ?? 'N/A'}
                          </td>
                          <td
                            className={`${styles.tableCell} ${styles.piValue}`}
                          >
                            {locus.pi?.toFixed(6)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan={3}
                        className="p-3 text-sm font-bold text-left text-orange-800"
                      >
                        Tổng CPI:
                      </td>
                      <td className="p-3 text-sm font-bold text-center text-orange-800 font-mono">
                        {(
                          item.resultDetailAppointmentResponse?.[0]
                            ?.paternityProbability /
                          (100 -
                            item.resultDetailAppointmentResponse?.[0]
                              ?.paternityProbability)
                        )?.toFixed(6)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="mb-8">
                <div className="border-2 border-orange-400 rounded-lg p-6 bg-orange-50">
                  <div className="text-center">
                    <h3 className="text-base font-bold text-orange-700 mb-2">
                      XÁC SUẤT HUYẾT THỐNG
                    </h3>
                    <p className="text-3xl font-bold text-orange-600">
                      {item.resultDetailAppointmentResponse?.[0]?.paternityProbability?.toFixed(
                        4
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>
              {/* Kết luận của hội đồng khoa học */}
              <div className={styles.companyDecision}>
                <h3 className={styles.decisionTitle}>
                  Hội đồng khoa học công ty Genelink kết luận:
                </h3>
                <div className={styles.decisionContent}>
                  <p>
                    Người có mẫu ADN ký hiệu:{' '}
                    <span className={styles.sampleCodes}>
                      {item.resultLocusAppointmentResponse?.[0]?.sampleCode1}
                    </span>{' '}
                    và người có mẫu ADN ký hiệu:{' '}
                    <span className={styles.sampleCodes}>
                      {item.resultLocusAppointmentResponse?.[0]?.sampleCode2}
                    </span>
                  </p>
                  <div className={styles.conclusionResult}>
                    {item.resultDetailAppointmentResponse?.[0]
                      ?.paternityProbability >= 99
                      ? 'CÓ QUAN HỆ HUYẾT THỐNG '
                      : 'KHÔNG CÓ QUAN HỆ HUYẾT THỐNG'}
                  </div>
                </div>
              </div>

              {/* Ghi chú miễn trách */}
              <div className={styles.disclaimer}>
                <div className={styles.disclaimerTitle}>Ghi chú:</div>
                <p>
                  {item.serviceAppointmentResponses?.serviceType ===
                  'ADMINISTRATIVE'
                    ? 'Kết quả xét nghiệm này được sử dụng cho mục đích hành chính, có thể làm căn cứ pháp lý trong các thủ tục như xác nhận cha con, khai sinh, hoặc các vấn đề pháp lý liên quan.'
                    : 'Kết quả xét nghiệm này được sử dụng cho mục đích dân sự, chỉ mang tính tham khảo cá nhân và không có giá trị pháp lý.'}
                </p>
              </div>

              <div
                className={styles.disclaimer}
                style={{ display: 'flex', justifyContent: 'flex-start' }}
              ></div>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div className={styles.decisionTitle}>
                  <h6>Chữ ký người thanh toán</h6>
                </div>
                <div>
                  <img style={{ width: 230 }} src={Sign} alt="" />
                </div>
              </div>
            </div>
          </div>
        ))}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '30px',
          marginTop: '24px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={async () => {
            const result = await Swal.fire({
              title: 'Xác nhận gửi kết quả?',
              text: 'Bạn có chắc muốn gửi kết quả xét nghiệm này?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Gửi',
              cancelButtonText: 'Hủy',
            });

            if (result.isConfirmed) {
              handleResult();
            }
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2c3e50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#1a242f';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#2c3e50';
          }}
        >
          Gửi kết quả
        </button>
      </div>
      {isResult
        .filter(
          (item) =>
            item.resultAppointmentResponse?.[0]?.resultStatus === 'COMPLETED'
        )
        .map((item, index) => (
          <ExportResultPDF key={index} item={item} />
        ))}
    </div>
  );
};

export default GetAllResultByManager;
