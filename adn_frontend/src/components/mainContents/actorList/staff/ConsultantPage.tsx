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
    consultationStatus: string
  ) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/register-for-consultation/update-register-consultation-status?registerForConsultationId=${registerForConsultationId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ consultationStatus }),
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Danh Sách Đăng Ký Tư Vấn</h1>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : consultants.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>Không có đăng ký tư vấn nào</h3>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell}>Họ Tên</th>
                <th className={styles.tableHeaderCell}>Số Điện Thoại</th>
                <th className={styles.tableHeaderCell}>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {consultants.map((item) => (
                <tr
                  key={item.registerForConsultationId}
                  className={styles.tableRow}
                >
                  <td className={styles.tableCell}>{item.name}</td>
                  <td className={styles.tableCell}>{item.phone}</td>
                  <td className={styles.tableCell}>
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
                      <option value="PENDING">Chờ xử lý</option>
                      <option value="CONFIRMED">Đã xác nhận</option>
                      <option value="IN_PROGRESS">Đang tiến hành</option>
                      <option value="COMPLETED">Hoàn thành</option>
                      <option value="CANCELLED">Đã hủy</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GetConsultant;
