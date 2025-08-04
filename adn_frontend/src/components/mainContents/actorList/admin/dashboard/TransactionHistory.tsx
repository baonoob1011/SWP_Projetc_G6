/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [summary, setSummary] = useState<any>(null);
  const [bankCodeInput, setBankCodeInput] = useState<string>(''); // 👈 user input
  const [bankCodeFilter, setBankCodeFilter] = useState<string>(''); // 👈 actual filter

  const translate = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'deposit':
        return 'Nạp tiền';
      case 'payment':
        return 'Thanh toán';
      case 'refund':
        return 'Hoàn tiền';
      default:
        return 'Không xác định';
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        'http://localhost:8080/api/dashboard/transaction-history',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        setTransactions(data);
      } else if (Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
        setSummary({
          totalIncome: data.totalIncome,
          totalExpense: data.totalExpense,
          netAmount: data.netAmount,
          description: data.description,
        });
      } else {
        setError('Dữ liệu không hợp lệ từ server');
        console.error('Invalid data format:', data);
      }
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatCurrency = (value: number) =>
    value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  // Hàm format currency với dấu +/-
  const formatCurrencyWithSign = (value: number, transactionType: string) => {
    const formattedValue = value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
    const sign = transactionType === 'INCOME' ? '+' : '-';
    return `${sign}${formattedValue}`;
  };

  const filteredTransactions =
    bankCodeFilter.trim() === ''
      ? transactions
      : transactions.filter((tx) =>
          tx.userPhone?.toLowerCase().includes(bankCodeFilter.toLowerCase())
        );

  return (
    <div className="min-h-screen bg-white ml-10">
      <div className="max-w-full">
        {/* Statistics Header */}
        <div className="bg-[#405EF3] rounded-lg p-6 mb-6 relative">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-white text-lg font-semibold">
              Lịch sử giao dịch
            </h2>
          </div>
          {/* Breadcrumb */}
          <div className="flex items-center mb-6 text-blue-100">
            <span className="text-white font-medium">Dashboard</span>
            <span className="mx-2">›</span>
            <span>Giao dịch</span>
          </div>
          <div className="bg-green-500 bg-opacity-30 rounded-lg p-2 max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="text-blue-100 text-xl">
              Tổng giao dịch: {transactions.length}
            </div>
          </div>

          {/* Transaction icon in header */}
          <div className="absolute right-0 bottom-0 mb-4 mr-40">
            <svg
              className="h-40 w-40 text-white opacity-20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        </div>

        {loading && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && transactions.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">Không có giao dịch nào.</p>
              </div>
            </div>
          </div>
        )}

        {/* Form tìm kiếm */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6 shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Tìm kiếm giao dịch
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label
                  htmlFor="bankCodeInput"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tìm theo số điện thoại
                </label>
                <input
                  type="text"
                  id="bankCodeInput"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={bankCodeInput}
                  onChange={(e) => setBankCodeInput(e.target.value)}
                  placeholder="Nhập số điện thoại cần tìm"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setBankCodeFilter(bankCodeInput)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Tìm
                </button>
              </div>
            </div>
          </div>
        </div>

        {!loading && filteredTransactions.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6 shadow-sm">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-24 px-6 py-4 text-left text-sm font-semibold text-gray-700 border-r-2 border-gray-300">
                    <div className="flex items-center gap-1">
                      Số ĐT
                      <svg
                        className="w-3 h-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                        />
                      </svg>
                    </div>
                  </th>
                  <th className="w-32 px-6 py-4 text-left text-sm font-semibold text-gray-700 border-r-2 border-gray-300">
                    <div className="flex items-center gap-1">
                      Tên người dùng
                      <svg
                        className="w-3 h-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                        />
                      </svg>
                    </div>
                  </th>
                  <th className="w-28 px-6 py-4 text-left text-sm font-semibold text-gray-700 border-r-2 border-gray-300">
                    <div className="flex items-center gap-1">
                      Loại GD
                      <svg
                        className="w-3 h-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                        />
                      </svg>
                    </div>
                  </th>
                  <th className="w-32 px-6 py-4 text-right text-sm font-semibold text-gray-700 border-r-2 border-gray-300">
                    <div className="flex items-center justify-end gap-1">
                      Số tiền
                      <svg
                        className="w-3 h-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                        />
                      </svg>
                    </div>
                  </th>
                  <th className="w-32 px-6 py-4 text-right text-sm font-semibold text-gray-700 border-r-2 border-gray-300">
                    <div className="flex items-center justify-end gap-1">
                      Số dư sau
                      <svg
                        className="w-3 h-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                        />
                      </svg>
                    </div>
                  </th>
                  <th className="w-36 px-6 py-4 text-left text-sm font-semibold text-gray-700 border-r-2 border-gray-300">
                    <div className="flex items-center gap-1">
                      Loại dịch vụ
                      <svg
                        className="w-3 h-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                        />
                      </svg>
                    </div>
                  </th>
                  <th className="w-24 px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    <div className="flex items-center justify-center gap-1">
                      Thời gian
                      <svg
                        className="w-3 h-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                        />
                      </svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-200 bg-white">
                {filteredTransactions.map((tx, index) => (
                  <tr
                    key={tx.transactionId}
                    className={`hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-blue-600 font-semibold border-r-2 border-gray-200">
                      <div className="truncate">{tx.userPhone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-r-2 border-gray-200">
                      <div className="truncate font-medium">{tx.userName}</div>
                    </td>
                    <td className="px-6 py-4 text-sm border-r-2 border-gray-200">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {translate(tx.category)}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-bold border-r-2 border-gray-200 text-right ${
                        tx.transactionType === 'INCOME'
                          ? 'text-green-600 bg-green-50'
                          : 'text-red-600 bg-red-50'
                      }`}
                    >
                      <div className="truncate">
                        {formatCurrencyWithSign(tx.amount, tx.transactionType)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium border-r-2 border-gray-200 text-right">
                      <div className="truncate">
                        {tx.walletBalanceAfter
                          ? formatCurrency(tx.walletBalanceAfter)
                          : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 border-r-2 border-gray-200">
                      <div className="truncate">{tx.serviceName}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center">
                      <div className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                        {dayjs(tx.timestamp).format('HH:mm:ss DD/MM/YYYY')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading &&
          !error &&
          filteredTransactions.length === 0 &&
          transactions.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    Không tìm thấy giao dịch phù hợp.
                  </p>
                </div>
              </div>
            </div>
          )}

        {summary && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">
                Tổng kết giao dịch
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">
                        Người dùng chi
                      </p>
                      <p className="text-2xl font-semibold text-green-900">
                        {formatCurrency(summary.totalIncome)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-red-600">
                        Hoàn tiền dịch vụ
                      </p>
                      <p className="text-2xl font-semibold text-red-900">
                        {formatCurrency(summary.totalExpense)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">
                        Lợi nhuận
                      </p>
                      <p className="text-2xl font-semibold text-blue-900">
                        {formatCurrency(summary.netAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
