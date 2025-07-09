import { useEffect, useState } from 'react';

type Invoice = {
  walletTransactionId: number;
  amount: number;
  type: string;
  transactionStatus: string;
  timestamp: string; // ISO format
  bankCode: string;
};

const Deposit = () => {
  const [status, setStatus] = useState<'pending' | 'success' | 'fail'>(
    'pending'
  );
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DEPOSIT':
        return 'Nạp Tiền';
      case 'SUCCESS':
        return 'THÀNH CÔNG';
      case 'FAIL':
        return 'THẤT BẠI';
      default:
        return 'Chờ xác nhận';
    }
  };
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

      fetch(`http://localhost:8080/api/wallet/vnpay-return?${queryString}`, {
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
      <div className="text-center" style={{ marginTop: 100 }}>
        ⏳ Đang xử lý kết quả thanh toán...
      </div>
    );
  }

  if (status === 'fail') {
    return (
      <div className="alert alert-danger text-center mt-5" role="alert">
        Thanh toán thất bại hoặc không hợp lệ.
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: 150 }}>
      <div className="alert alert-success text-center" role="alert">
        Nạp tiền thành công!
      </div>

      {invoice && (
        <table className="table table-bordered bg-white mt-5">
          <tbody>
            <tr>
              <th>Mã ngân hàng</th>
              <td>{invoice.bankCode}</td>
            </tr>
            <tr>
              <th>Số tiền</th>
              <td>{invoice.amount.toLocaleString()} VNĐ</td>
            </tr>
            <tr>
              <th>Loại giao dịch</th>
              <td>{getStatusText(invoice.type)}</td>
            </tr>
            <tr>
              <th>Trạng thái</th>
              <td>{getStatusText(invoice.transactionStatus)}</td>
            </tr>
            <tr>
              <th>Thời gian</th>
              <td>{new Date(invoice.timestamp).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      )}

      <div className="text-center mt-4">
        <a href="/u-profile" className="btn btn-primary">
          Quay về hồ sơ cá nhân
        </a>
      </div>
    </div>
  );
};

export default Deposit;
