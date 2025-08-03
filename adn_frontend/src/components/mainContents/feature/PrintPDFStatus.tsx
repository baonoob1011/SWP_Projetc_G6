/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const HardCopyStatusList = () => {
  const [resultStatus, setResultStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResultStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'http://localhost:8080/api/result/get-hard-copy-result',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!res.ok) {
        toast.error('Không thể lấy danh sách trạng thái kết quả.');
        return;
      }

      const data = await res.json();
      const sortedData = [...data].sort((a, b) => b.result_id - a.result_id);
      setResultStatus(sortedData);
    } catch (error) {
      console.error('Lỗi:', error);
      toast.error('Lỗi hệ thống khi lấy dữ liệu trạng thái.');
    } finally {
      setLoading(false);
    }
  };
  const handleUpdate = async (appointmentId: string) => {
    const result = await Swal.fire({
      title: 'Xác nhận thay đổi?',
      text: 'Bạn có chắc chắn muốn đổi trạng thái này?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `http://localhost:8080/api/result/update-hard-copy-result?appointmentId=${appointmentId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ hardCopyDeliveryStatus: 'DELIVERED' }),
          }
        );
        if (res.ok) {
          toast.success('Cập nhật thành công');
          fetchResultStatus();
        } else {
          toast.error('Cập nhật thất bại');
        }
      } catch (error) {
        console.error('Lỗi cập nhật:', error);
      }
    }
  };
  useEffect(() => {
    fetchResultStatus();
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xử lý';
      case 'PRINTED':
        return 'Đã in';
      case 'SHIPPED':
        return 'Đang vận chuyển';
      case 'DELIVERED':
        return 'Đã giao';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Trạng thái bản cứng kết quả xét nghiệm</h4>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Mã kết quả</th>
              <th>Trạng thái bản cứng</th>
              <th>cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {resultStatus.map((item, index) => (
              <tr key={item.result_id}>
                <td>{index + 1}</td>
                <td>{item.result_id}</td>
                <td>{getStatusText(item.hardCopyDeliveryStatus)}</td>
                <td>
                  <button
                    type="submit"
                    onClick={() => handleUpdate(item.appointmentId)}
                  >
                    Đã nhận
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default HardCopyStatusList;
