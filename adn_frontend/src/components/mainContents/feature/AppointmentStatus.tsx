/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const GetKitDeliveryStatus = () => {
  const [kitStatus, setKitStatus] = useState<any[]>([]);

  const fetchKitStatus = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/kit-delivery-status/get-kit-status-user',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!res.ok) {
        toast.error('Không thể lấy dữ liệu trạng thái kit');
        return;
      }

      const data = await res.json();
      setKitStatus(data);
    } catch (error) {
      console.error('Lỗi:', error);
      toast.error('Lỗi hệ thống khi lấy trạng thái kit');
    }
  };

  useEffect(() => {
    fetchKitStatus();
  }, []);

  return (
    <div className="container mt-4" style={{ maxWidth: 800 }}>
      <h5 className="mb-4">Trạng thái giao bộ kit</h5>

      {kitStatus.length === 0 ? (
        <p>Không có dữ liệu.</p>
      ) : (
        <table className="table table-bordered text-center">
          <thead className="table-light">
            <tr>
              <th>Trạng thái giao</th>
              <th>Ngày tạo đơn</th>
            </tr>
          </thead>
          <tbody>
            {kitStatus.map((item: any, index: number) => (
              <tr key={index}>
                <td>{item.deliveryStatus}</td>
                <td>{item.createOrderDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GetKitDeliveryStatus;
