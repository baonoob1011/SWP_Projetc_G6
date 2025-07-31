/* eslint-disable @typescript-eslint/no-explicit-any */
import pdfMake from 'pdfmake/build/pdfmake';
import { customVfs } from '../../../../pdf-font-gen/vfs_fonts'; // import file đã build từ Roboto.ttf
import Logo from '../../mainContents/feature/featureImage/Logo.png';
import Sign from '../../mainContents/feature/featureImage/Sign.png';

pdfMake.vfs = customVfs;

pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Regular.ttf',
    italics: 'Roboto-Regular.ttf',
    bolditalics: 'Roboto-Regular.ttf',
  },
};

interface ExportResultPDFProps {
  item: any;
}

// Hàm chuyển đổi image URL thành base64
const getImageBase64 = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
};

const ExportResultPDF = ({ item }: ExportResultPDFProps) => {
  const exportResultToPDF = async () => {
    const today = new Date().toLocaleDateString('vi-VN');

    // Chuyển đổi logo và sign thành base64
    let logoBase64 = '';
    let signBase64 = '';

    try {
      logoBase64 = await getImageBase64(Logo);
      signBase64 = await getImageBase64(Sign);
    } catch (error) {
      console.warn('Không thể tải hình ảnh:', error);
      // Sử dụng fallback nếu không tải được hình ảnh
    }

    const tableBody = item.patientAppointmentResponse
      ?.slice(0, 2)
      .map((patient: any, i: number) => [
        (i + 1).toString(),
        patient.fullName,
        patient.relationship,
        item.sampleAppointmentResponse?.[0].sampleType || 'Tế bào miệng',
        item.showAppointmentResponse?.appointmentDate || '',
        item.sampleAppointmentResponse?.[i]?.sampleCode || '---',
      ]);

    const locusTableBody = item.resultLocusAppointmentResponse?.map(
      (locus: any) => [
        locus.locusName,
        `${locus.allele1} - ${locus.allele2}`,
        `${locus.fatherAllele1 ?? 'N/A'} - ${locus.fatherAllele2 ?? 'N/A'}`,
        locus.pi?.toFixed(6) || 'N/A',
      ]
    );

    const paternityProb =
      item.resultDetailAppointmentResponse?.[0]?.paternityProbability;
    const conclusionText =
      paternityProb >= 99
        ? 'CÓ QUAN HỆ HUYẾT THỐNG'
        : 'KHÔNG CÓ QUAN HỆ HUYẾT THỐNG';

    const docDefinition: any = {
      content: [
        // Header với logo và thông tin công ty
        {
          columns: [
            {
              width: 80,
              stack: [
                logoBase64
                  ? {
                      image: logoBase64,
                      width: 90,
                      height: 50,
                      alignment: 'center',
                    }
                  : {
                      canvas: [
                        {
                          type: 'rect',
                          x: 0,
                          y: 0,
                          w: 70,
                          h: 70,
                          r: 8,
                          color: '#2E86AB',
                        },
                        {
                          type: 'text',
                          x: 35,
                          y: 35,
                          text: 'DNA',
                          options: {
                            color: 'white',
                            fontSize: 16,
                            bold: true,
                          },
                        },
                      ],
                    },
              ],
            },
            {
              width: '*',
              stack: [
                { text: 'CÔNG TY TNHH GENELINK', style: 'companyName' },
                { text: 'TRUNG TÂM PHÂN TÍCH ADN', style: 'centerName' },
                {
                  text: 'Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM',
                  style: 'address',
                },
                {
                  text: 'Hotline: 1900-xxxx | Email: info@genelink.vn',
                  style: 'contact',
                },
                {
                  text: 'Website: www.genelink.vn',
                  style: 'contact',
                },
              ],
            },
            {
              width: 120,
              stack: [
                {
                  table: {
                    widths: ['*'],
                    body: [
                      [
                        {
                          text: `Số: ${
                            item.showAppointmentResponse?.appointmentId ||
                            'KQ-001'
                          }`,
                          style: 'reportNumber',
                        },
                      ],
                      [
                        {
                          text: `Ngày: ${today}`,
                          style: 'reportDate',
                        },
                      ],
                    ],
                  },
                  layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => '#2E86AB',
                    vLineColor: () => '#2E86AB',
                    paddingLeft: () => 8,
                    paddingRight: () => 8,
                    paddingTop: () => 6,
                    paddingBottom: () => 6,
                  },
                },
              ],
            },
          ],
          margin: [0, 0, 0, 30],
        },

        // Đường kẻ ngang
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 2,
              lineColor: '#2E86AB',
            },
          ],
          margin: [0, 0, 0, 20],
        },

        // Tiêu đề chính với background
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  stack: [
                    { text: 'PHIẾU KẾT QUẢ PHÂN TÍCH ADN', style: 'mainTitle' },
                    {
                      text: '(Xét nghiệm quan hệ huyết thống)',
                      style: 'subtitle',
                    },
                  ],
                  fillColor: '#F8F9FA',
                  margin: [0, 15, 0, 15],
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
          },
          margin: [0, 0, 0, 25],
        },

        // Phần I: Thông tin khách hàng
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: 'I. THÔNG TIN KHÁCH HÀNG',
                  style: 'sectionHeader',
                  fillColor: '#E3F2FD',
                  margin: [10, 8, 10, 8],
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
          },
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            widths: ['30%', '70%'],
            body: [
              [
                { text: 'Họ và tên người yêu cầu:', style: 'infoLabel' },
                {
                  text: item.userAppointmentResponse.fullName || '',
                  style: 'infoValue',
                },
              ],
              [
                { text: 'Số điện thoại:', style: 'infoLabel' },
                {
                  text: item.userAppointmentResponse.phone || '',
                  style: 'infoValue',
                },
              ],
              [
                { text: 'Địa chỉ:', style: 'infoLabel' },
                {
                  text: item.userAppointmentResponse.address || '',
                  style: 'infoValue',
                },
              ],
              [
                { text: 'Ngày tiếp nhận mẫu:', style: 'infoLabel' },
                {
                  text: item.showAppointmentResponse?.appointmentDate || '',
                  style: 'infoValue',
                },
              ],
            ],
          },
          layout: {
            hLineWidth: (i: number) => (i === 0 || i === 5 ? 1 : 0.5),
            vLineWidth: () => 0.5,
            hLineColor: () => '#DDDDDD',
            vLineColor: () => '#DDDDDD',
            paddingLeft: () => 12,
            paddingRight: () => 12,
            paddingTop: () => 8,
            paddingBottom: () => 8,
          },
          margin: [0, 0, 0, 20],
        },

        // Phần II: Thông tin mẫu phân tích
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: 'II. THÔNG TIN MẪU PHÂN TÍCH',
                  style: 'sectionHeader',
                  fillColor: '#E3F2FD',
                  margin: [10, 8, 10, 8],
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
          },
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            widths: ['8%', '25%', '20%', '15%', '15%', '17%'],
            body: [
              [
                { text: 'STT', style: 'tableHeader', fillColor: '#2E86AB' },
                {
                  text: 'Họ và tên',
                  style: 'tableHeader',
                  fillColor: '#2E86AB',
                },
                { text: 'Quan hệ', style: 'tableHeader', fillColor: '#2E86AB' },
                {
                  text: 'Loại mẫu',
                  style: 'tableHeader',
                  fillColor: '#2E86AB',
                },
                {
                  text: 'Ngày thu mẫu',
                  style: 'tableHeader',
                  fillColor: '#2E86AB',
                },
                {
                  text: 'Ký hiệu mẫu',
                  style: 'tableHeader',
                  fillColor: '#2E86AB',
                },
              ],
              ...tableBody.map((row: any, rowIndex: number) =>
                row.map((cell: any) => ({
                  text: cell,
                  style: 'tableCell',
                  fillColor: rowIndex % 2 === 0 ? '#F8F9FA' : '#FFFFFF',
                }))
              ),
            ],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#DDDDDD',
            vLineColor: () => '#DDDDDD',
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 6,
            paddingBottom: () => 6,
          },
          margin: [0, 0, 0, 25],
        },

        // Phần III: Kết quả phân tích
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: 'III. KẾT QUẢ PHÂN TÍCH',
                  style: 'sectionHeader',
                  fillColor: '#E3F2FD',
                  margin: [10, 8, 10, 8],
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
          },
          margin: [0, 0, 0, 10],
        },
        {
          text: 'Sau khi phân tích các mẫu ADN có ký hiệu trên bằng bộ kit Identifiler Plus của hãng Applied Biosystems - Mỹ, chúng tôi có kết quả như sau:',
          style: 'analysisDescription',
          margin: [0, 0, 0, 15],
        },

        // Bảng kết quả Locus với thiết kế cải tiến
        {
          table: {
            widths: ['20%', '25%', '25%', '30%'],
            body: [
              [
                {
                  text: 'Locus GEN',
                  style: 'tableHeader',
                  fillColor: '#2E86AB',
                },
                {
                  text:
                    item.resultLocusAppointmentResponse?.[0]?.sampleCode1 ||
                    'M1',
                  style: 'tableHeader',
                  fillColor: '#2E86AB',
                },
                {
                  text:
                    item.resultLocusAppointmentResponse?.[0]?.sampleCode2 ||
                    'M2',
                  style: 'tableHeader',
                  fillColor: '#2E86AB',
                },
                {
                  text: 'Chỉ số PI',
                  style: 'tableHeader',
                  fillColor: '#2E86AB',
                },
              ],
              ...locusTableBody.map((row: any, rowIndex: number) =>
                row.map((cell: any) => ({
                  text: cell,
                  style: 'tableCell',
                  fillColor: rowIndex % 2 === 0 ? '#F8F9FA' : '#FFFFFF',
                }))
              ),
              [
                {
                  text: 'Tổng CPI:',
                  style: 'totalRow',
                  colSpan: 3,
                  fillColor: '#FFF3E0',
                },
                {},
                {},
                {
                  text: (paternityProb / (100 - paternityProb)).toFixed(6),
                  style: 'totalValue',
                  fillColor: '#FFF3E0',
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#DDDDDD',
            vLineColor: () => '#DDDDDD',
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 6,
            paddingBottom: () => 6,
          },
          margin: [0, 0, 0, 20],
        },

        // Xác suất huyết thống với box đặc biệt
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  stack: [
                    {
                      text: 'XÁC SUẤT HUYẾT THỐNG',
                      style: 'probabilityLabel',
                    },
                    {
                      text: `${paternityProb?.toFixed(4) || '---'}%`,
                      style: 'probabilityValue',
                    },
                  ],
                  fillColor: '#FFF3E0',
                  margin: [0, 15, 0, 15],
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 2,
            vLineWidth: () => 2,
            hLineColor: () => '#FF9800',
            vLineColor: () => '#FF9800',
          },
          margin: [0, 0, 0, 25],
        },

        // Phần IV: Kết luận
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: 'IV. KẾT LUẬN',
                  style: 'sectionHeader',
                  fillColor: '#E3F2FD',
                  margin: [10, 8, 10, 8],
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
          },
          margin: [0, 0, 0, 10],
        },
        {
          text: [
            'Dựa trên kết quả phân tích ADN, người có mẫu ký hiệu ',
            {
              text:
                item.resultLocusAppointmentResponse?.[0]?.sampleCode1 || 'M1',
              bold: true,
              color: '#2E86AB',
            },
            ' và người có mẫu ký hiệu ',
            {
              text:
                item.resultLocusAppointmentResponse?.[0]?.sampleCode2 || 'M2',
              bold: true,
              color: '#2E86AB',
            },
            ' có kết luận: ',
          ],
          style: 'conclusionText',
          margin: [0, 0, 0, 15],
        },
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: conclusionText,
                  style: 'conclusionResult',
                  fillColor: paternityProb >= 99 ? '#E8F5E8' : '#FFEBEE',
                  margin: [0, 15, 0, 15],
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 2,
            vLineWidth: () => 2,
            hLineColor: () => (paternityProb >= 99 ? '#4CAF50' : '#F44336'),
            vLineColor: () => (paternityProb >= 99 ? '#4CAF50' : '#F44336'),
          },
          margin: [0, 0, 0, 25],
        },

        // Phần V: Ghi chú
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: 'V. GHI CHÚ',
                  style: 'sectionHeader',
                  fillColor: '#E3F2FD',
                  margin: [10, 8, 10, 8],
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
          },
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  ul: [
                    'Kết quả xét nghiệm này được sử dụng cho mục đích dân sự, chỉ mang tính tham khảo cá nhân và không có giá trị pháp lý.',
                  ],
                  style: 'noteList',
                  fillColor: '#F8F9FA',
                  margin: [15, 10, 15, 10],
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#DDDDDD',
            vLineColor: () => '#DDDDDD',
          },
          margin: [0, 0, 0, 30],
        },

        // Chữ ký với sign image
        {
          table: {
            widths: ['50%', '50%'],
            body: [
              [
                {
                  stack: [
                    { text: 'TÊN NGƯỜI THANH TOÁN', style: 'signatureTitle' },
                  ],
                  margin: [0, 10, 0, 10],
                },
                {
                  stack: [
                    { text: 'GIÁM ĐỐC TRUNG TÂM', style: 'signatureTitle' },
                    {
                      text: '(Ký tên và đóng dấu)',
                      style: 'signatureInstruction',
                    },
                    signBase64
                      ? {
                          image: signBase64,
                          width: 120,
                          height: 70,
                          alignment: 'center',
                          margin: [0, 10, 0, 10],
                        }
                      : { text: '\n\n', style: 'signatureSpace' },
                    { text: 'Trần Đình Bảo', style: 'signatureName' },
                  ],
                  margin: [0, 10, 0, 10],
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#DDDDDD',
            vLineColor: () => '#DDDDDD',
          },
          margin: [0, 0, 0, 0],
        },
      ],

      styles: {
        companyName: {
          fontSize: 16,
          bold: true,
          color: '#2E86AB',
          margin: [0, 0, 0, 3],
        },
        centerName: {
          fontSize: 14,
          bold: true,
          color: '#34495E',
          margin: [0, 0, 0, 8],
        },
        address: {
          fontSize: 11,
          color: '#7F8C8D',
          margin: [0, 0, 0, 3],
        },
        contact: {
          fontSize: 10,
          color: '#7F8C8D',
          margin: [0, 0, 0, 2],
        },
        reportNumber: {
          fontSize: 12,
          bold: true,
          color: '#2E86AB',
          alignment: 'center',
        },
        reportDate: {
          fontSize: 11,
          color: '#34495E',
          alignment: 'center',
        },
        mainTitle: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          color: '#2E86AB',
          margin: [0, 0, 0, 5],
        },
        subtitle: {
          fontSize: 13,
          alignment: 'center',
          color: '#34495E',
        },
        sectionHeader: {
          fontSize: 13,
          bold: true,
          color: '#2E86AB',
        },
        infoLabel: {
          fontSize: 11,
          bold: true,
          color: '#34495E',
        },
        infoValue: {
          fontSize: 11,
          color: '#2C3E50',
        },
        tableHeader: {
          fontSize: 11,
          bold: true,
          alignment: 'center',
          color: '#FFFFFF',
        },
        tableCell: {
          fontSize: 10,
          alignment: 'center',
          color: '#2C3E50',
        },
        totalRow: {
          fontSize: 11,
          bold: true,
          alignment: 'right',
          color: '#E67E22',
        },
        totalValue: {
          fontSize: 11,
          bold: true,
          alignment: 'center',
          color: '#E67E22',
        },
        analysisDescription: {
          fontSize: 11,
          lineHeight: 1.4,
          color: '#34495E',
        },
        probabilityLabel: {
          fontSize: 13,
          bold: true,
          alignment: 'center',
          color: '#E67E22',
        },
        probabilityValue: {
          fontSize: 20,
          bold: true,
          alignment: 'center',
          color: '#D35400',
        },
        conclusionText: {
          fontSize: 11,
          lineHeight: 1.4,
          color: '#34495E',
        },
        conclusionResult: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          color: paternityProb >= 99 ? '#27AE60' : '#E74C3C',
        },
        noteList: {
          fontSize: 10,
          lineHeight: 1.4,
          color: '#34495E',
        },
        signatureTitle: {
          fontSize: 12,
          bold: true,
          alignment: 'center',
          color: '#2E86AB',
        },
        signatureInstruction: {
          fontSize: 10,
          alignment: 'center',
          italics: true,
          color: '#7F8C8D',
        },
        signatureSpace: {
          fontSize: 10,
        },
        signatureName: {
          fontSize: 11,
          bold: true,
          alignment: 'center',
          color: '#2C3E50',
        },
      },

      defaultStyle: {
        font: 'Roboto',
        fontSize: 10,
        lineHeight: 1.3,
        color: '#2C3E50',
      },

      pageMargins: [40, 40, 40, 40],
      pageOrientation: 'portrait',
      pageSize: 'A4',
    };

    pdfMake
      .createPdf(docDefinition)
      .download(
        `phieu-ket-qua-ADN-${
          item.showAppointmentResponse?.appointmentId || 'KQ001'
        }-${today.replace(/\//g, '-')}.pdf`
      );
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <button
        onClick={exportResultToPDF}
        style={{
          marginTop: 20,
          padding: '14px 28px',
          borderRadius: 12,
          border: 'none',
          cursor: 'pointer',
          backgroundColor: '#2E86AB',
          color: 'white',
          fontSize: '15px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(46, 134, 171, 0.3)',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1E5F7A';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow =
            '0 6px 20px rgba(46, 134, 171, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#2E86AB';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow =
            '0 4px 12px rgba(46, 134, 171, 0.3)';
        }}
      >
        <span style={{ fontSize: '18px' }}>📋</span>
        Tải phiếu kết quả PDF
      </button>

      <div
        style={{
          marginTop: 15,
          padding: '10px 20px',
          backgroundColor: '#F8F9FA',
          borderRadius: 8,
          border: '1px solid #E9ECEF',
          fontSize: '13px',
          color: '#6C757D',
          textAlign: 'center',
          maxWidth: '400px',
        }}
      >
        <span style={{ fontWeight: 'bold', color: '#2E86AB' }}>💡 Lưu ý:</span>{' '}
        Phiếu kết quả được thiết kế chuyên nghiệp với logo và chữ ký tự động
        chèn vào PDF.
      </div>
    </div>
  );
};

export default ExportResultPDF;
