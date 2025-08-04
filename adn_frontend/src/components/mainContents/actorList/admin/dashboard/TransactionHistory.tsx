/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
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

  const filteredTransactions =
    bankCodeFilter.trim() === ''
      ? transactions
      : transactions.filter((tx) =>
          tx.userPhone?.toLowerCase().includes(bankCodeFilter.toLowerCase())
        );

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Lịch sử giao dịch</h3>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && transactions.length === 0 && (
        <Alert variant="info">Không có giao dịch nào.</Alert>
      )}

      {/* Form tìm kiếm */}
      <div className="mb-3">
        <label htmlFor="bankCodeInput" className="form-label">
          Tìm theo số điện thoại
        </label>
        <div className="input-group">
          <input
            type="text"
            id="bankCodeInput"
            className="form-control"
            value={bankCodeInput}
            onChange={(e) => setBankCodeInput(e.target.value)}
          />
          <Button
            variant="primary"
            onClick={() => setBankCodeFilter(bankCodeInput)}
          >
            Tìm
          </Button>
        </div>
      </div>

      {!loading && filteredTransactions.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Số điện thoại</th>
              <th>Tên người dùng</th>
              <th>Loại giao dịch</th>
              <th>Số tiền</th>
              <th>Số dư sau</th>
              <th>Loại dịch vụ</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx.transactionId}>
                <td>{tx.userPhone || 'N/A'}</td>
                <td>{tx.userName}</td>
                <td>{translate(tx.category)}</td>
                <td
                  className={
                    tx.transactionType === 'INCOME'
                      ? 'text-success'
                      : 'text-danger'
                  }
                >
                  {formatCurrency(tx.amount)}
                </td>
                <td>
                  {tx.walletBalanceAfter
                    ? formatCurrency(tx.walletBalanceAfter)
                    : 'N/A'}
                </td>
                <td>{tx.serviceName}</td>
                <td>{dayjs(tx.appointmentDate).format('DD/MM/YYYY')}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {!loading && !error && filteredTransactions.length === 0 && (
        <Alert variant="warning">Không tìm thấy giao dịch phù hợp.</Alert>
      )}

      {summary && (
        <div className="mt-4">
          <h5>Tổng kết giao dịch</h5>
          <Table bordered>
            <tbody>
              <tr>
                <td>
                  <strong>Người dùng chi</strong>
                </td>
                <td className="text-success">
                  {formatCurrency(summary.totalIncome)}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Hoàn tiền dịch vụ</strong>
                </td>
                <td className="text-danger">
                  {formatCurrency(summary.totalExpense)}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Lợi nhuận</strong>
                </td>
                <td>
                  <strong>{formatCurrency(summary.netAmount)}</strong>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
