/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

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

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      if (totalPages > 1) rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Đơn số
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Mã hóa đơn
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {paginatedData.map((tx) => (
                  <tr
                    key={tx.walletTransactionId}
                    className="hover:bg-slate-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">
                        {tx.walletTransactionId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {tx.type === 'PAYMENT' ? (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            tx.type === 'PAYMENT'
                              ? 'text-red-700'
                              : 'text-green-700'
                          }`}
                        >
                          {tx.type === 'PAYMENT'
                            ? 'Thanh toán'
                            : tx.type === 'DEPOSIT'
                            ? 'Nạp tiền'
                            : 'Hoàn tiền'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span
                        className={`text-sm font-bold ${
                          tx.type === 'PAYMENT'
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}
                      >
                        {formatAmount(tx.type, tx.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        {tx.transactionStatus === 'SUCCESS' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.transactionStatus === 'SUCCESS'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {tx.transactionStatus === 'SUCCESS'
                            ? 'Thành công'
                            : tx.transactionStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600">
                        {new Date(tx.timestamp).toLocaleString('vi-VN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        {tx.bankCode}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1} đến{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, transactions.length)}{' '}
                  trong tổng số {transactions.length} giao dịch
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Trước
                  </button>

                  {getVisiblePages().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === '...' ? (
                        <span className="px-3 py-2 text-sm text-slate-400">
                          ...
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePageClick(page as number)}
                          className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                            currentPage === page
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}

                  <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    Sau
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
