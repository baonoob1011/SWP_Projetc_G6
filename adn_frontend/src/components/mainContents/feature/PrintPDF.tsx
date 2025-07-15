/* eslint-disable @typescript-eslint/no-explicit-any */
import pdfMake from 'pdfmake/build/pdfmake';
import { customVfs } from '../../../../pdf-font-gen/vfs_fonts'; // import file đã build từ Roboto.ttf

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

const ExportResultPDF = ({ item }: ExportResultPDFProps) => {
  const exportResultToPDF = () => {
    const today = new Date().toLocaleDateString('vi-VN');

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
        // Header công ty
        {
          columns: [
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
              ],
            },
            {
              width: 'auto',
              stack: [
                {
                  text: `Số: ${
                    item.showAppointmentResponse?.appointmentId || 'KQ-001'
                  }`,
                  style: 'reportNumber',
                },
                { text: `Ngày: ${today}`, style: 'reportDate' },
              ],
            },
          ],
          margin: [0, 0, 0, 20],
        },

        // Tiêu đề chính
        { text: 'PHIẾU KẾT QUẢ PHÂN TÍCH ADN', style: 'mainTitle' },
        { text: '(Xét nghiệm quan hệ huyết thống)', style: 'subtitle' },

        // Phần I: Thông tin khách hàng
        { text: 'I. THÔNG TIN KHÁCH HÀNG', style: 'sectionHeader' },
        {
          table: {
            widths: ['25%', '75%'],
            body: [
              [
                'Họ và tên người yêu cầu:',
                item.userAppointmentResponse.fullName || '',
              ],
              ['Số điện thoại:', item.userAppointmentResponse.phone || ''],
              ['Địa chỉ:', item.userAppointmentResponse.address || ''],
              [
                'Ngày tiếp nhận mẫu:',
                item.showAppointmentResponse?.appointmentDate || '',
              ],
              [
                'Căn cứ theo giấy đề nghị số:',
                `HID15 ${
                  item.showAppointmentResponse?.appointmentId || '5986'
                }`,
              ],
            ],
          },
          layout: 'noBorders',
          margin: [0, 5, 0, 15],
        },

        // Phần II: Thông tin mẫu phân tích
        { text: 'II. THÔNG TIN MẪU PHÂN TÍCH', style: 'sectionHeader' },
        {
          table: {
            widths: ['8%', '25%', '20%', '15%', '15%', '17%'],
            body: [
              [
                { text: 'STT', style: 'tableHeader' },
                { text: 'Họ và tên', style: 'tableHeader' },
                { text: 'Quan hệ', style: 'tableHeader' },
                { text: 'Loại mẫu', style: 'tableHeader' },
                { text: 'Ngày thu mẫu', style: 'tableHeader' },
                { text: 'Ký hiệu mẫu', style: 'tableHeader' },
              ],
              ...tableBody.map((row: any) =>
                row.map((cell: any) => ({ text: cell, style: 'tableCell' }))
              ),
            ],
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#333333',
            vLineColor: () => '#333333',
          },
          margin: [0, 5, 0, 15],
        },

        // Phần III: Kết quả phân tích
        { text: 'III. KẾT QUẢ PHÂN TÍCH', style: 'sectionHeader' },
        {
          text: 'Sau khi phân tích các mẫu ADN có ký hiệu trên bằng bộ kit Identifiler Plus của hãng Applied Biosystems - Mỹ, chúng tôi có kết quả như sau:',
          style: 'analysisDescription',
          margin: [0, 5, 0, 10],
        },

        // Bảng kết quả Locus
        {
          table: {
            widths: ['20%', '25%', '25%', '30%'],
            body: [
              [
                { text: 'Locus', style: 'tableHeader' },
                { text: 'Mẫu 1', style: 'tableHeader' },
                { text: 'Mẫu 2', style: 'tableHeader' },
                { text: 'Chỉ số PI', style: 'tableHeader' },
              ],
              ...locusTableBody.map((row: any) =>
                row.map((cell: any) => ({ text: cell, style: 'tableCell' }))
              ),
              [
                { text: 'Tổng CPI:', style: 'totalRow', colSpan: 3 },
                {},
                {},
                {
                  text: (paternityProb / (100 - paternityProb)).toFixed(6),
                  style: 'totalValue',
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#333333',
            vLineColor: () => '#333333',
          },
          margin: [0, 0, 0, 15],
        },

        // Xác suất huyết thống
        {
          text: [
            'Xác suất huyết thống (W): ',
            {
              text: `${paternityProb?.toFixed(4) || '---'}%`,
              bold: true,
              color: '#c0392b',
            },
          ],
          style: 'probabilityText',
          margin: [0, 10, 0, 20],
        },

        // Phần IV: Kết luận
        { text: 'IV. KẾT LUẬN', style: 'sectionHeader' },
        {
          text: [
            'Dựa trên kết quả phân tích ADN, người có mẫu ký hiệu ',
            {
              text:
                item.resultLocusAppointmentResponse?.[0]?.sampleCode1 || 'M1',
              bold: true,
            },
            ' và người có mẫu ký hiệu ',
            {
              text:
                item.resultLocusAppointmentResponse?.[0]?.sampleCode2 || 'M2',
              bold: true,
            },
            ' có kết luận: ',
          ],
          style: 'conclusionText',
          margin: [0, 5, 0, 10],
        },
        {
          text: conclusionText,
          style: 'conclusionResult',
          margin: [0, 0, 0, 20],
        },

        // Phần V: Ghi chú
        { text: 'V. GHI CHÚ', style: 'sectionHeader' },
        {
          ul: [
            'Phương pháp sử dụng: PCR-STR với bộ kit Identifiler Plus',
            'Tiêu chuẩn đánh giá: Xác suất ≥ 99.9% được coi là có quan hệ huyết thống',
            item.serviceAppointmentResponses?.serviceType === 'ADMINISTRATIVE'
              ? 'Kết quả này có thể sử dụng cho mục đích hành chính/pháp lý.'
              : 'Kết quả này chỉ mang tính chất tham khảo, không có giá trị pháp lý.',
            'Kết quả này chỉ áp dụng cho các mẫu đã được phân tích.',
          ],
          style: 'noteList',
          margin: [0, 5, 0, 30],
        },

        // Chữ ký
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: 'NGƯỜI THỰC HIỆN', style: 'signatureTitle' },
                { text: '(Ký tên và đóng dấu)', style: 'signatureInstruction' },
                { text: '\n\n\n', style: 'signatureSpace' },
                { text: 'Kỹ thuật viên', style: 'signatureName' },
              ],
            },
            {
              width: '50%',
              stack: [
                { text: 'GIÁM ĐỐC TRUNG TÂM', style: 'signatureTitle' },
                { text: '(Ký tên và đóng dấu)', style: 'signatureInstruction' },
                { text: '\n\n\n', style: 'signatureSpace' },
                { text: 'PGS.TS. Nguyễn Văn A', style: 'signatureName' },
              ],
            },
          ],
          margin: [0, 20, 0, 0],
        },
      ],

      styles: {
        companyName: {
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 2],
        },
        centerName: {
          fontSize: 12,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 5],
        },
        address: {
          fontSize: 10,
          alignment: 'center',
          margin: [0, 0, 0, 2],
        },
        contact: {
          fontSize: 10,
          alignment: 'center',
        },
        reportNumber: {
          fontSize: 11,
          bold: true,
          alignment: 'right',
        },
        reportDate: {
          fontSize: 10,
          alignment: 'right',
        },
        mainTitle: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 15, 0, 5],
        },
        subtitle: {
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        sectionHeader: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableHeader: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [2, 4, 2, 4],
        },
        tableCell: {
          fontSize: 10,
          alignment: 'center',
          margin: [2, 4, 2, 4],
        },
        totalRow: {
          fontSize: 10,
          bold: true,
          alignment: 'right',
          margin: [2, 4, 2, 4],
        },
        totalValue: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [2, 4, 2, 4],
        },
        analysisDescription: {
          fontSize: 11,
          lineHeight: 1.3,
        },
        probabilityText: {
          fontSize: 12,
          bold: true,
          alignment: 'center',
        },
        conclusionText: {
          fontSize: 11,
          lineHeight: 1.3,
        },
        conclusionResult: {
          fontSize: 14,
          bold: true,
          alignment: 'center',
          color: '#e74c3c',
        },
        noteList: {
          fontSize: 10,
          lineHeight: 1.3,
        },
        signatureTitle: {
          fontSize: 11,
          bold: true,
          alignment: 'center',
        },
        signatureInstruction: {
          fontSize: 9,
          alignment: 'center',
          italics: true,
        },
        signatureSpace: {
          fontSize: 10,
        },
        signatureName: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
        },
      },

      defaultStyle: {
        font: 'Roboto',
        fontSize: 10,
        lineHeight: 1.2,
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
    <button
      onClick={exportResultToPDF}
      style={{
        marginTop: 20,
        padding: '12px 20px',
        borderRadius: 8,
        border: '2px solid #007bff',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,123,255,0.3)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#0056b3';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,123,255,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#007bff';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,123,255,0.3)';
      }}
    >
      📄 Tải phiếu kết quả PDF
    </button>
  );
};

export default ExportResultPDF;
