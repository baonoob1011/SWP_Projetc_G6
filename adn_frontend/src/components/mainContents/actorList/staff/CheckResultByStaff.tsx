/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import CheckHistoryAppointment from './CheckHistoryAppoiment';

const CheckResultByStaff = () => {
  const [data, setData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xử lý';
      case 'PRINTED':
        return 'Đã in xong';
      case 'SHIPPED':
        return 'Đã gửi vận chuyển';
      case 'DELIVERED':
        return 'Đã giao cho khách';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return 'Chờ xác nhận';
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/appointment/get-all-appointment-by-staff-to-send-hard-copy',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.ok) {
        const jsonData = await res.json();
        setData(jsonData);
      }
    } catch (error) {
      console.error('Lỗi fetch dữ liệu:', error);
    }
  };

  const handleUpdate = async (appointmentId: string, newStatus: string) => {
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
            body: JSON.stringify({ hardCopyDeliveryStatus: newStatus }),
          }
        );
        if (res.ok) {
          toast.success('Cập nhật thành công');
          fetchData();
        } else {
          toast.error('Cập nhật thất bại');
        }
      } catch (error) {
        console.error('Lỗi cập nhật:', error);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'current') {
      fetchData();
    }
  }, [activeTab]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Quản lý bản cứng kết quả</h2>

      {/* Tab buttons */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'current' ? 'active' : ''}`}
            onClick={() => setActiveTab('current')}
          >
            Danh sách cần xử lý
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Lịch sử bản cứng
          </button>
        </li>
      </ul>

      {/* Tab content */}
      {activeTab === 'current' ? (
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-primary">
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Ngày hẹn</th>
              <th scope="col">Trạng thái lịch hẹn</th>
              <th scope="col">Ghi chú</th>
              <th scope="col">Trạng thái bản cứng</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: any, idx: number) => (
              <tr key={item.appointmentId || idx}>
                <td>{idx + 1}</td>
                <td>
                  {item.appointmentDate
                    ? new Date(item.appointmentDate).toLocaleDateString()
                    : 'Không rõ'}
                </td>
                <td>{getStatusText(item.appointmentStatus)}</td>
                <td>{item.note || 'Không có'}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={item.hardCopyDeliveryStatus || 'PENDING'}
                    onChange={(e) =>
                      handleUpdate(item.appointmentId, e.target.value)
                    }
                  >
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="PRINTED">Đã in xong</option>
                    <option value="SHIPPED">Đã gửi vận chuyển</option>
                    <option value="DELIVERED">Đã giao cho khách</option>
                  </select>
                </td>
                <td>
                  <NavLink
                    to={`/checkResultById/${item.appointmentId}`}
                    className="btn btn-primary btn-sm"
                  >
                    Xem chi tiết
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <CheckHistoryAppointment />
      )}
    </div>
  );
};

export default CheckResultByStaff;
