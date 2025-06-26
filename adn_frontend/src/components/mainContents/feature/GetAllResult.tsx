/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArrowBack } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import styles from './GetAllResult.module.css';
import Logo from '../../../image/Logo.png';
import Sign from '../../../image/Sign.png';
const GetAllResult = () => {
  const { appointmentId } = useParams();
  const [isResult, setIsResult] = useState<any[]>([]);

  const exportResultToPDF = (item: any) => {
    const doc = new jsPDF();

    doc.setFont('Roboto');
    doc.setFontSize(16);
    doc.text('PHIẾU KẾT QUẢ XÉT NGHIỆM ADN', 70, 15, { maxWidth: 180 });

    doc.setFontSize(12);
    let y = 30;

    const addLine = (text: string) => {
      doc.text(text, 10, y, { maxWidth: 180 });
      y += 8;
    };

    addLine(`Mã cuộc hẹn: ${item.showAppointmentResponse?.appointmentId}`);
    addLine(`Ngày hẹn: ${item.showAppointmentResponse?.appointmentDate}`);
    addLine(`Trạng thái: ${item.showAppointmentResponse?.appointmentStatus}`);
    addLine(`Hình thức: ${item.showAppointmentResponse?.appointmentType}`);
    y += 8;
    addLine(`--- KẾT QUẢ ---`);
    addLine(`Mã kết quả: ${item.resultAppointmentResponse?.[0]?.result_id}`);
    addLine(`Ngày trả: ${item.resultAppointmentResponse?.[0]?.resultDate}`);
    addLine(`Trạng thái: ${item.resultAppointmentResponse?.[0]?.resultStatus}`);

    if (item.resultDetailAppointmentResponse?.length > 0) {
      const detail = item.resultDetailAppointmentResponse[0];
      y += 8;
      addLine(`--- TỔNG KẾT ---`);
      addLine(`Kết luận: ${detail.conclusion}`);
      addLine(`Combined PI: ${detail.combinedPaternityIndex}`);
      addLine(`Xác suất cha con: ${detail.paternityProbability?.toFixed(4)}%`);
      addLine(`Tóm tắt: ${detail.resultSummary}`);
    }

    doc.save(
      `phieu-ket-qua-${item.showAppointmentResponse?.appointmentId}.pdf`
    );
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/appointment/get-all-result?appointmentId=${appointmentId}`,
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
              to="/u-profile"
              className={styles.backButton}
            >
              <ArrowBack />
              Quay lại
            </Button>
            {/* Header */}
            <div className={styles.reportHeader}>
              <div className={styles.headerTop}>
                <div className={styles.logoSection}>
                  <img src={Logo} alt="GENETIS Logo" className={styles.logo} />
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
                  Căn cứ vào giấy đề nghị phân tích ADN số:{' '}
                  <span className={styles.requestNumber}>HID15 5986</span>
                </p>
                <p className={styles.introText}>
                  Của Ông (Bà):{' '}
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
                              {i === 0
                                ? item.resultLocusAppointmentResponse?.[0]
                                    ?.sampleCode1 || '---'
                                : item.resultLocusAppointmentResponse?.[0]
                                    ?.sampleCode2 || '---'}
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
                </table>
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
                    CÓ QUAN HỆ HUYẾT THỐNG CHA - CON
                  </div>
                </div>
              </div>

              {/* Ghi chú miễn trách */}
              <div className={styles.disclaimer}>
                <div className={styles.disclaimerTitle}>Ghi chú:</div>
                <p>{item.showAppointmentResponse.note}</p>
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
      {isResult
        .filter(
          (item) =>
            item.resultAppointmentResponse?.[0]?.resultStatus === 'COMPLETED'
        )
        .map((item) => (
          <Button
            variant="outlined"
            className={styles.downloadButton}
            onClick={() => exportResultToPDF(item)}
          >
            📄 Tải phiếu kết quả PDF
          </Button>
        ))}
    </div>
  );
};

export default GetAllResult;
