/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';

type WalletTransaction = {
  walletTransactionId: number;
  amount: number;
  type: 'PAYMENT' | 'DEPOSIT';
  transactionStatus: string;
  timestamp: string;
  bankCode: string;
};

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          'http://localhost:8080/api/wallet/get-all-wallet-transition',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error('Không thể lấy dữ liệu');

        const data = await res.json();
        const sortedData = data.sort(
          (a: any, b: any) => b.walletTransactionId - a.walletTransactionId
        );

        setTransactions(sortedData);
      } catch (error) {
        console.error('Lỗi khi lấy giao dịch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatAmount = (type: string, amount: number) => {
    const formatted = amount.toLocaleString('vi-VN') + ' đ';
    return type === 'PAYMENT' ? `- ${formatted}` : `+ ${formatted}`;
  };

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);

  const paginatedData = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>
      <table
        border={1}
        cellPadding={10}
        style={{ width: '100%', textAlign: 'center' }}
      >
        <thead>
          <tr>
            <th>Mã GD</th>
            <th>Loại</th>
            <th>Số tiền</th>
            <th>Trạng thái</th>
            <th>Thời gian</th>
            <th>Mã hóa đơn</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((tx) => (
            <tr key={tx.walletTransactionId}>
              <td>{tx.walletTransactionId}</td>
              <td>{tx.type === 'PAYMENT' ? 'Thanh toán' : 'Nạp tiền'}</td>
              <td style={{ color: tx.type === 'PAYMENT' ? 'red' : 'green' }}>
                {formatAmount(tx.type, tx.amount)}
              </td>
              <td>
                {tx.transactionStatus === 'SUCCESS'
                  ? 'Thành công'
                  : tx.transactionStatus}
              </td>
              <td>{new Date(tx.timestamp).toLocaleString('vi-VN')}</td>
              <td>{tx.bankCode}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang với số trang */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ⬅ Trang trước
        </button>

        {/* Nút số trang */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            style={{
              margin: '0 5px',
              fontWeight: currentPage === page ? 'bold' : 'normal',
              backgroundColor: currentPage === page ? '#ccc' : 'white',
            }}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Trang sau ➡
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
