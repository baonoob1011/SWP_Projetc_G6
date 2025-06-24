/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const GetAllResult = () => {
  const [isResult, setIsResult] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/appointment/get-all-result',
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
    fetchData();
  }, []);

  return (
    <div
      className="container"
      style={{ maxWidth: 1000, margin: 'auto', padding: 20 }}
    >
      <h5 className="mb-4">Hóa đơn kết quả hoàn tất</h5>

      {isResult
        .filter(
          (item) =>
            item.resultAppointmentResponse?.[0]?.resultStatus === 'COMPLETED'
        )
        .map((item, index) => (
          <div key={index} className="card mb-4 shadow-sm">
            <div className="card-body p-4">
              <h6 className="card-title mb-3">
                Hóa đơn #{item.showAppointmentResponse?.appointmentId}
              </h6>

              {/* Thông tin cuộc hẹn */}
              <div className="mb-3">
                <p>
                  <strong>Ngày hẹn:</strong>{' '}
                  {item.showAppointmentResponse?.appointmentDate}
                </p>
                <p>
                  <strong>Trạng thái lịch hẹn:</strong>{' '}
                  {item.showAppointmentResponse?.appointmentStatus}
                </p>
                <p>
                  <strong>Ghi chú:</strong> {item.showAppointmentResponse?.note}
                </p>
                <p>
                  <strong>Hình thức xét nghiệm:</strong>{' '}
                  {item.showAppointmentResponse?.appointmentType}
                </p>
              </div>

              <hr />

              {/* Thông tin bệnh nhân */}
              <h6 className="mb-3">Thông tin mẫu giám định</h6>
              <div className="table-responsive">
                <table className="table table-bordered text-center">
                  <thead className="table-light">
                    <tr>
                      <th>TT</th>
                      <th>Họ tên</th>
                      <th>Ngày sinh</th>
                      <th>Quan hệ</th>
                      <th>Loại mẫu</th>
                      <th>Ngày thu mẫu</th>
                      <th>Mã mẫu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.patientAppointmentResponse
                      ?.slice(0, 2)
                      .map((patient: any, i: number) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{patient.fullName}</td>
                          <td>{patient.dateOfBirth}</td>
                          <td>{patient.relationship}</td>
                          <td>{patient.relationship}</td>
                          <td>
                            {item.showAppointmentResponse?.appointmentDate}
                          </td>
                          <td>
                            {i === 0
                              ? item.resultLocusAppointmentResponse?.[0]
                                  ?.sampleCode1 || '---'
                              : item.resultLocusAppointmentResponse?.[0]
                                  ?.sampleCode2 || '---'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <hr />

              {/* Dịch vụ */}
              <div className="mb-3">
                <h6 className="mb-2">Dịch vụ</h6>
                <p>
                  - Mã dịch vụ: {item.serviceAppointmentResponses?.serviceId}
                </p>
                <p>
                  - Tên dịch vụ: {item.serviceAppointmentResponses?.serviceName}
                </p>
                <p>
                  - Ngày đăng ký:{' '}
                  {item.serviceAppointmentResponses?.registerDate}
                </p>
                <p>- Mô tả: {item.serviceAppointmentResponses?.description}</p>
                <p>
                  - Loại dịch vụ:{' '}
                  {item.serviceAppointmentResponses?.serviceType}
                </p>
              </div>

              <hr />

              {/* Kết quả */}
              <div className="mb-3">
                <h6 className="mb-2">Kết quả</h6>
                <p>
                  - Mã kết quả: {item.resultAppointmentResponse?.[0]?.result_id}
                </p>
                <p>
                  - Ngày trả kết quả:{' '}
                  {item.resultAppointmentResponse?.[0]?.resultDate}
                </p>
                <p>
                  - Trạng thái:{' '}
                  {item.resultAppointmentResponse?.[0]?.resultStatus}
                </p>
              </div>

              <hr />

              {/* Chi tiết locus */}
              <div className="mb-3">
                <h6 className="mb-2">Chi tiết các locus</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered text-center">
                    <thead className="table-light">
                      <tr>
                        <th>Locus</th>
                        <th>Sample 1</th>
                        <th>Sample 2</th>
                        <th>Father Allele 1</th>
                        <th>Allele 2</th>
                        <th>Tần suất</th>
                        <th>PI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.resultLocusAppointmentResponse?.map(
                        (locus: any, i: number) => (
                          <tr key={i}>
                            <td>{locus.locusName}</td>
                            <td>{locus.sampleCode1}</td>
                            <td>{locus.sampleCode2}</td>
                            <td>
                              {locus.allele1} - {locus.allele2}
                            </td>
                            <td>
                              {locus.fatherAllele1 ?? 'N/A'} -{' '}
                              {locus.fatherAllele1 ?? 'N/A'}
                            </td>
                            <td>{locus.frequency?.toFixed(3)}</td>
                            <td>{locus.pi?.toFixed(2)}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <hr />

              {/* Tổng kết */}
              <div className="mb-3">
                <h6 className="mb-2">Tổng kết</h6>
                {item.resultDetailAppointmentResponse?.map(
                  (detail: any, i: number) => (
                    <div key={i}>
                      <p>- Kết luận: {detail.conclusion}</p>
                      <p>- Combined PI: {detail.combinedPaternityIndex}</p>
                      <p>
                        - Xác suất cha con:{' '}
                        {detail.paternityProbability?.toFixed(4)}%
                      </p>
                      <p>- Tóm tắt: {detail.resultSummary}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default GetAllResult;
