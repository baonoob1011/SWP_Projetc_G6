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
        toast.error('Không thể lấy hóa đơn');
      } else {
        const data = await res.json();
        setIsResult(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  });

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

              {/* Thông tin lịch hẹn */}
              <div className="mb-3">
                <p className="mb-1">
                  <strong>Ngày hẹn:</strong>{' '}
                  {item.showAppointmentResponse?.appointmentDate}
                </p>
                <p className="mb-1">
                  <strong>Trạng thái lịch hẹn:</strong>{' '}
                  {item.showAppointmentResponse?.appointmentStatus}
                </p>
                <p className="mb-1">
                  <strong>Ghi chú:</strong> {item.showAppointmentResponse?.note}
                </p>
                <p className="mb-1">
                  <strong>Hình thức xét nghiệm:</strong>{' '}
                  {item.showAppointmentResponse?.appointmentType}
                </p>
              </div>

              <hr />

              {/* Nhân viên thực hiện */}
              <div className="mb-3">
                <h6 className="mb-2">Nhân viên phụ trách</h6>
                <p className="mb-1">
                  - Họ tên: {item.staffAppointmentResponse?.fullName}
                </p>
                <p className="mb-1">
                  - Email: {item.staffAppointmentResponse?.email}
                </p>
                <p className="mb-1">
                  - SĐT: {item.staffAppointmentResponse?.phone}
                </p>
              </div>

              <hr />

              {/* Dịch vụ */}
              <div className="mb-3">
                <h6 className="mb-2">Dịch vụ</h6>
                <p className="mb-1">
                  - Mã dịch vụ: {item.serviceAppointmentResponses?.serviceId}
                </p>
                <p className="mb-1">
                  - Tên dịch vụ: {item.serviceAppointmentResponses?.serviceName}
                </p>
                <p className="mb-1">
                  - Ngày đăng ký:{' '}
                  {item.serviceAppointmentResponses?.registerDate}
                </p>
                <p className="mb-1">
                  - Mô tả: {item.serviceAppointmentResponses?.description}
                </p>
                <p className="mb-1">
                  - Loại dịch vụ:{' '}
                  {item.serviceAppointmentResponses?.serviceType}
                </p>
              </div>

              <hr />

              {/* Kết quả */}
              <div className="mb-3">
                <h6 className="mb-2">Kết quả</h6>
                <p className="mb-1">
                  - Mã kết quả: {item.resultAppointmentResponse?.[0]?.result_id}
                </p>
                <p className="mb-1">
                  - Ngày trả kết quả:{' '}
                  {item.resultAppointmentResponse?.[0]?.resultDate}
                </p>
                <p className="mb-1">
                  - Trạng thái:{' '}
                  {item.resultAppointmentResponse?.[0]?.resultStatus}
                </p>
              </div>

              <hr />

              {/* Locus */}
              <div className="mb-3">
                <h6 className="mb-2">Chi tiết các locus</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Locus</th>
                        <th>Sample 1</th>
                        <th>Sample 2</th>
                        <th>Allele 1</th>
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
                            <td>{locus.allele1}</td>
                            <td>{locus.allele2}</td>
                            <td>{locus.frequency}</td>
                            <td>{locus.pi}</td>
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
                      <p className="mb-1">- Kết luận: {detail.conclusion}</p>
                      <p className="mb-1">
                        - Combined PI: {detail.combinedPaternityIndex}
                      </p>
                      <p className="mb-1">
                        - Xác suất cha con:{' '}
                        {detail.paternityProbability.toFixed(4)}%
                      </p>
                      <p className="mb-1">- Tóm tắt: {detail.resultSummary}</p>
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
