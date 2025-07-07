import { useEffect, useState } from 'react';
import styles from './VNPAY.module.css';

type Invoice = {
  invoiceId: number;
  amount: number;
  createdDate: string;
  serviceName: string;
  userFullName: string;
  bankCode: string;
};

const VNPayResult = () => {
  const [status, setStatus] = useState<'pending' | 'success' | 'fail'>(
    'pending'
  );
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryParams: Record<string, string> = {};
    params.forEach((value, key) => {
      queryParams[key] = value;
    });

    const { vnp_ResponseCode, vnp_TransactionStatus } = queryParams;

    if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
      const queryString = new URLSearchParams(queryParams).toString();
      const token = localStorage.getItem('token'); // 🔐 Lấy token từ localStorage

      fetch(`http://localhost:8080/api/payment/vnpay-return?${queryString}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, //
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Không tìm thấy hóa đơn');
          return res.json();
        })
        .then((data: Invoice) => {
          setInvoice(data);
          setStatus('success');
        })
        .catch((err) => {
          console.error('❌ Lỗi:', err);
          setStatus('fail');
        });
    } else {
      setStatus('fail');
    }
  }, []);

  if (status === 'pending') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>
            Đang xử lý kết quả thanh toán...
          </div>
        </div>
      </div>
    );
  }

  if (status === 'fail') {
    return (
      <div className={styles.container}>
        <div className={styles.alertDanger} role="alert">
          Thanh toán thất bại hoặc không hợp lệ.
        </div>
        <div className={styles.buttonContainer}>
          <a href="/" className={styles.homeButton}>
            Quay về trang chủ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} style={{ marginTop: 120 }}>
      <div className={styles.alertSuccess} role="alert">
        Thanh toán thành công!
      </div>

      {invoice && (
        <div className={styles.invoiceCard}>
          <div className={styles.invoiceHeader}>Chi Tiết Hóa Đơn</div>
          <table className={styles.invoiceTable}>
            <tbody>
              <tr>
                <th>Mã hóa đơn</th>
                <td>{invoice.bankCode}</td>
              </tr>
              <tr>
                <th>Dịch vụ</th>
                <td>{invoice.serviceName}</td>
              </tr>
              <tr>
                <th>Khách hàng</th>
                <td>{invoice.userFullName}</td>
              </tr>
              <tr>
                <th>Số tiền</th>
                <td className={styles.amount}>
                  {invoice.amount.toLocaleString()} VNĐ
                </td>
              </tr>
              <tr>
                <th>Ngày thanh toán</th>
                <td>{new Date(invoice.createdDate).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.buttonContainer}>
        <a href="/" className={styles.homeButton}>
          Quay về trang chủ
        </a>
      </div>
    </div>
  );
};

export default VNPayResult;
