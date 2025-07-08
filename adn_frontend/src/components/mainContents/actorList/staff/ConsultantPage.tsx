/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './GetConsultant.module.css';

const GetConsultant = () => {
  const [consultants, setConsultants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);



  const fetchConsultants = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'http://localhost:8080/api/register-for-consultation/get-register-consultation',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setConsultants(data);
      } else {
        console.error('Lỗi khi lấy danh sách tư vấn');
        toast.error('Không thể tải danh sách tư vấn');
      }
    } catch (error) {
      console.error('Lỗi kết nối API:', error);
      toast.error('Lỗi kết nối mạng');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    registerForConsultationId: number,
    newStatus: string
  ) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/register-for-consultation/update-register-consultation-status?registerForConsultationId=${registerForConsultationId}&consultationStatus=${newStatus}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.ok) {
        toast.success('Cập nhật trạng thái thành công!');
        fetchConsultants();
      } else {
        toast.error('Cập nhật thất bại. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      toast.error('Lỗi kết nối mạng');
    }
  };

  useEffect(() => {
    fetchConsultants();
  }, []);

  return (
    <div className={styles.container} style={{ marginTop: 50 }}>
      <h2 className={styles.title}>Danh Sách Đăng Ký Tư Vấn</h2>

      {loading ? (
        <p className={styles.loadingText}>Đang tải dữ liệu...</p>
      ) : consultants.length === 0 ? (
        <p className={styles.emptyText}>Không có đăng ký tư vấn nào.</p>
      ) : (
        consultants.map((item) => (
          <div key={item.registerForConsultationId} className={styles.card}>
            <p>
               <strong>Họ Tên:</strong> {item.name}
            </p>
            <p>
              <strong>SĐT:</strong> {item.phone}
            </p>
            <p>
              <strong>Trạng Thái:</strong>{' '}
              <select
                value={item.consultationStatus}
                onChange={(e) =>
                  handleStatusChange(
                    item.registerForConsultationId,
                    e.target.value
                  )
                }
                className={styles.selectStatus}
              >
                <option value="PENDING"> Chờ xử lý</option>
                <option value="CONFIRMED"> Đã xác nhận</option>
                <option value="IN_PROGRESS"> Đang tiến hành</option>
                <option value="COMPLETED"> Hoàn thành</option>
                <option value="CANCELLED"> Đã hủy</option>
              </select>
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default GetConsultant;
