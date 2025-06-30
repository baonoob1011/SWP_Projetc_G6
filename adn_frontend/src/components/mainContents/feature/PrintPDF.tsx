/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // 👈 Import đúng cách để autoTable hoạt động

interface ExportResultPDFProps {
  item: any;
}

const ExportResultPDF = ({ item }: ExportResultPDFProps) => {
  const exportResultToPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');

    doc.setFont('helvetica');
    let currentY = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    // === HEADER SECTION ===
    // Company logo area (placeholder box)
    doc.setDrawColor(0, 0, 0);
    doc.rect(margin, currentY, 40, 15);
    doc.setFontSize(8);
    doc.text('LOGO', margin + 18, currentY + 8);

    // Company info
    doc.setFontSize(16).setFont('helvetica', 'bold');
    doc.text('GENELINK', margin + 50, currentY + 5);
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text(
      'Dia chi: 123 Duong ABC, Quan XYZ, TP.HCM',
      margin + 50,
      currentY + 12
    );
    doc.text(
      'Hotline: 1900-xxxx | Email: info@genelink.vn',
      margin + 50,
      currentY + 18
    );

    // Report number
    const reportId = `KQ ${item.showAppointmentResponse?.appointmentId}`;
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text(`So: ${reportId}`, pageWidth - margin - 40, currentY + 8);

    currentY += 35;

    // Horizontal line
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    // === TITLE SECTION ===
    doc.setFontSize(18).setFont('helvetica', 'bold');
    const title = 'PHIEU KET QUA PHAN TICH ADN';
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, currentY);

    doc.setFontSize(14).setFont('helvetica', 'normal');
    const subtitle = '(Xet nghiem quan he huyet thong)';
    const subtitleWidth = doc.getTextWidth(subtitle);
    doc.text(subtitle, (pageWidth - subtitleWidth) / 2, currentY + 8);

    currentY += 25;

    // === CUSTOMER INFO SECTION ===
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('I. THONG TIN KHACH HANG', margin, currentY);
    currentY += 8;

    doc.setFontSize(11).setFont('helvetica', 'normal');
    const customerInfo = [
      `• Can cu vao giay de nghi phan tich ADN so: HID15 5986`,
      `• Ho va ten nguoi yeu cau: ${item.userAppointmentResponse.fullName}`,
      `• So dien thoai: ${item.userAppointmentResponse.phone}`,
      `• Dia chi: ${item.userAppointmentResponse.address}`,
      `• Ngay tiep nhan mau: ${
        item.showAppointmentResponse?.appointmentDate || 'N/A'
      }`,
    ];

    customerInfo.forEach((line) => {
      doc.text(line, margin, currentY);
      currentY += 6;
    });
    currentY += 8;

    // === SAMPLE INFO SECTION ===
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('II. THONG TIN MAU PHAN TICH', margin, currentY);
    currentY += 10;

    const tableData = item.patientAppointmentResponse
      ?.slice(0, 2)
      .map((patient: any, i: number) => [
        (i + 1).toString(),
        patient.fullName,
        patient.relationship,
        item.sampleAppointmentResponse?.[0].sampleType || 'Te bao mieng',
        item.showAppointmentResponse?.appointmentDate || '',
        item.sampleAppointmentResponse?.[i]?.sampleCode || '---',
      ]);

    (doc as any).autoTable({
      head: [
        [
          'STT',
          'Ho va ten',
          'Quan he',
          'Loai mau',
          'Ngay thu mau',
          'Ky hieu mau',
        ],
      ],
      body: tableData,
      startY: currentY,
      styles: {
        fontSize: 10,
        cellPadding: 4,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [230, 230, 230],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 45, halign: 'left' },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 30, halign: 'center' },
        5: { cellWidth: 25, halign: 'center' },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;

    // === ANALYSIS SECTION ===
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('III. KET QUA PHAN TICH', margin, currentY);
    currentY += 8;

    doc.setFontSize(11).setFont('helvetica', 'normal');
    const analysisNote =
      'Sau khi phan tich cac mau ADN co ky hieu tren bang bo kit Identifiler-Plus cua hang Applied Biosystems - My, chung toi co ket qua nhu sau:';
    const splitNote = doc.splitTextToSize(analysisNote, contentWidth);
    doc.text(splitNote, margin, currentY);
    currentY += splitNote.length * 6 + 10;

    // Locus Table with better formatting
    const locusTableHead = [
      [
        'Locus',
        `${item.resultLocusAppointmentResponse?.[0]?.sampleCode1 || 'Mau 1'}`,
        `${item.resultLocusAppointmentResponse?.[0]?.sampleCode2 || 'Mau 2'}`,
        'PI',
      ],
    ];

    const locusTableData = item.resultLocusAppointmentResponse?.map(
      (locus: any) => [
        locus.locusName,
        `${locus.allele1}, ${locus.allele2}`,
        `${locus.fatherAllele1 ?? 'N/A'}, ${locus.fatherAllele2 ?? 'N/A'}`,
        locus.pi?.toFixed(6) || 'N/A',
      ]
    );

    // Check if need new page
    if (
      currentY + (locusTableData?.length || 0) * 8 >
      doc.internal.pageSize.getHeight() - 60
    ) {
      doc.addPage();
      currentY = 20;
    }

    (doc as any).autoTable({
      head: locusTableHead,
      body: locusTableData,
      startY: currentY,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 35, halign: 'center', fontStyle: 'bold' },
        1: { cellWidth: 45, halign: 'center' },
        2: { cellWidth: 45, halign: 'center' },
        3: { cellWidth: 40, halign: 'center' },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 20;
    const paternityProb =
      item.resultDetailAppointmentResponse?.[0]?.paternityProbability;

    (doc as any).autoTable({
      body: [
        [
          {
            content: `Xac xuat huyet thong : ${paternityProb?.toFixed(4)}%`,
            colSpan: 4,
            styles: {
              halign: 'left',
              fontStyle: 'bold',
              textColor: [200, 0, 0],
            },
          },
        ],
      ],
      startY: currentY,
      theme: 'plain',
      styles: {
        fontSize: 11,
        cellPadding: 4,
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;

    // === CONCLUSION SECTION (Updated - No border/box) ===
    // Check if enough space for conclusion section, if not create new page
    const conclusionEstimatedHeight = 80; // Estimated height needed for conclusion section
    if (
      currentY + conclusionEstimatedHeight >
      doc.internal.pageSize.getHeight() - 20
    ) {
      doc.addPage();
      currentY = 30;
    }

    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('IV. KET LUAN', margin, currentY);
    currentY += 10;

    doc.setFontSize(11).setFont('helvetica', 'normal');
    const conclusionText = `Hoi dong khoa hoc Cong ty GENELINK ket luan: Nguoi co mau ADN ky hieu ${item.resultLocusAppointmentResponse?.[0]?.sampleCode1} va nguoi co mau ADN ky hieu ${item.resultLocusAppointmentResponse?.[0]?.sampleCode2}:`;
    const splitConclusion = doc.splitTextToSize(conclusionText, contentWidth);
    doc.text(splitConclusion, margin, currentY);
    currentY += splitConclusion.length * 6 + 10;

    // Main result - simplified without box
    const probability =
      item.resultDetailAppointmentResponse?.[0]?.paternityProbability || 0;
    const mainResult =
      probability >= 99
        ? 'CO QUAN HE HUYET THONG'
        : 'KHONG CO QUAN HE HUYET THONG';

    doc.setFontSize(14).setFont('helvetica', 'bold');
    const resultWidth = doc.getTextWidth(mainResult);
    doc.text(mainResult, (pageWidth - resultWidth) / 2, currentY);
    currentY += 10;

    // Statistical details
    const detail = item.resultDetailAppointmentResponse?.[0];
    if (detail) {
      doc.setFontSize(10).setFont('helvetica', 'normal');
      const statsText = `(Combined PI: ${
        detail.combinedPaternityIndex
      } | Xac suat: ${detail.paternityProbability?.toFixed(4)}%)`;
      const statsWidth = doc.getTextWidth(statsText);
      doc.text(statsText, (pageWidth - statsWidth) / 2, currentY);
      currentY += 15;
    }

    // === DISCLAIMER SECTION ===
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text('V. GHI CHU VA CAM KET', margin, currentY);
    currentY += 8;

    doc.setFont('helvetica', 'normal');
    const disclaimerText =
      item.serviceAppointmentResponses?.serviceType === 'ADMINISTRATIVE'
        ? '• Ket qua xet nghiem nay duoc su dung cho muc dich hanh chinh, co the lam can cu phap ly trong cac thu tuc nhu xac nhan cha con, khai sinh, hoac cac van de phap ly lien quan.\n• Cong ty cam ket ve tinh chinh xac va bao mat thong tin khach hang.'
        : '• Ket qua xet nghiem nay duoc su dung cho muc dich dan su, chi mang tinh tham khao ca nhan va khong co gia tri phap ly.\n• Cong ty cam ket ve tinh chinh xac va bao mat thong tin khach hang.';

    const splitDisclaimer = doc.splitTextToSize(disclaimerText, contentWidth);
    doc.text(splitDisclaimer, margin, currentY);
    currentY += splitDisclaimer.length * 6 + 20;

    // Check if need new page for signatures
    if (currentY > doc.internal.pageSize.getHeight() - 80) {
      doc.addPage();
      currentY = 30;
    }

    // === SIGNATURE SECTION ===
    const signatureY = currentY;

    // Left signature
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text('KHACH HANG', margin + 30, signatureY);
    doc.setFont('helvetica', 'normal');
    doc.text('(Ky va ghi ro ho ten)', margin + 20, signatureY + 6);

    // Right signature
    doc.setFont('helvetica', 'bold');
    doc.text('GIAM DOC GENELINK', pageWidth - margin - 60, signatureY);
    doc.setFont('helvetica', 'normal');
    doc.text('(Ky va dong dau)', pageWidth - margin - 50, signatureY + 6);

    // Date
    const today = new Date().toLocaleDateString('vi-VN');
    doc.setFontSize(10);
    const dateText = `TP.HCM, ngay ${today}`;
    const dateWidth = doc.getTextWidth(dateText);
    doc.text(dateText, (pageWidth - dateWidth) / 2, signatureY + 30);

    // Footer with page number and processing info
    const pageCount = (doc as any).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Trang ${i}/${pageCount}`,
        pageWidth - margin - 20,
        doc.internal.pageSize.getHeight() - 10
      );
      doc.text(
        `Ngay xu ly: ${
          item.resultAppointmentResponse?.[0]?.resultDate || today
        }`,
        margin,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    const fileName = `phieu-ket-qua-ADN-${
      item.showAppointmentResponse?.appointmentId
    }-${today.replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
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
