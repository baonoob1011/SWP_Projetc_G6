/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CheckHistoryAppointment = () => {
  const [phone, setPhone] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fetchData = async () => {
    if (!phone) return;

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8080/api/appointment/get-appointment-by-phone?phone=${phone}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const combinedAppointments = [
          ...(data.allAppointmentAtCenterResponse || []),
          ...(data.allAppointmentAtHomeResponse || []),
        ];
        setHistory(combinedAppointments);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Lỗi khi fetch dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };
  const completedAppointments = history.filter(
    (item) => item.showAppointmentResponse?.appointmentStatus === 'COMPLETED'
  );

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Tra cứu lịch sử đặt lịch bằng số điện thoại</h4>
      <div className="d-flex gap-2 mb-4">
        <Form.Control
          type="text"
          placeholder="Nhập số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <Button onClick={fetchData} disabled={loading}>
          {loading ? 'Đang tải...' : 'Tra cứu'}
        </Button>
      </div>

      <div>
        {completedAppointments.length > 0 ? (
          completedAppointments.map((item: any, index: number) => (
            <div key={index} className="mb-4 p-3 border rounded">
              <h5>Lịch hẹn #{item.showAppointmentResponse?.appointmentId}</h5>
              <p>
                <strong>Ngày hẹn:</strong>{' '}
                {new Date(
                  item.showAppointmentResponse?.appointmentDate
                ).toLocaleDateString()}
              </p>
              <p>
                <strong>Trạng thái:</strong>{' '}
                {item.showAppointmentResponse?.appointmentStatus}
              </p>
              <p>
                <strong>Ghi chú:</strong>{' '}
                {item.showAppointmentResponse?.note || 'Không có'}
              </p>

              <h6>Dịch vụ</h6>
              <ul>
                {item.serviceAppointmentResponses?.map((svc: any) => (
                  <li key={svc.serviceId}>
                    <strong>{svc.serviceName}</strong> - {svc.description} (
                    {svc.serviceType})
                  </li>
                ))}
              </ul>

              <h6>Bệnh nhân</h6>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Ngày sinh</th>
                    <th>Giới tính</th>
                    <th>Mối quan hệ</th>
                  </tr>
                </thead>
                <tbody>
                  {item.patientAppointmentResponse?.map((p: any) => (
                    <tr key={p.patientId}>
                      <td>{p.fullName}</td>
                      <td>{p.dateOfBirth}</td>
                      <td>{p.gender}</td>
                      <td>{p.relationship}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {item.kitAppointmentResponse && (
                <>
                  <h6>Thông tin Kit</h6>
                  <ul>
                    <li>
                      <strong>Mã Kit:</strong>{' '}
                      {item.kitAppointmentResponse.kitCode}
                    </li>
                    <li>
                      <strong>Tên Kit:</strong>{' '}
                      {item.kitAppointmentResponse.kitName}
                    </li>
                    <li>
                      <strong>Số người xét nghiệm:</strong>{' '}
                      {item.kitAppointmentResponse.targetPersonCount}
                    </li>
                    <li>
                      <strong>Nội dung:</strong>{' '}
                      {item.kitAppointmentResponse.contents}
                    </li>
                    <li>
                      <strong>Số lượng:</strong>{' '}
                      {item.kitAppointmentResponse.quantity}
                    </li>
                  </ul>
                  <button
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                    onClick={() =>
                      navigate(
                        `/result/${item.showAppointmentResponse?.appointmentId}`
                      )
                    }
                  >
                    <FaEye className="mr-2" />
                    Xem kết quả
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>Không có dữ liệu.</p>
        )}
      </div>
    </div>
  );
};

export default CheckHistoryAppointment;
