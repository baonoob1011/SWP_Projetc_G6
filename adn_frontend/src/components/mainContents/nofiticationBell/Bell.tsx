/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import {
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Typography,
  Box,
  Divider,
  Chip,
  Badge,
} from '@mui/material';
type WalletTransaction = {
  walletTransactionId: number;
  type: string;
  amount: number;
  timestamp: string;
  transactionStatus: string;
  bankCode: string;
};

export default function WalletNotification() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [newTransactionCount, setNewTransactionCount] = useState(0);
  const [money, setMoney] = useState<any>(null);
  const open = Boolean(anchorEl);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  // ✅ Lưu ID đã xem cuối cùng từ localStorage
  const [lastSeenId, setLastSeenId] = useState<number | null>(() => {
    const savedId = localStorage.getItem('lastSeenTransactionId');
    return savedId ? parseInt(savedId) : null;
  });

  const prevMoneyRef = useRef<any>(null);

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
      const savedId = localStorage.getItem('lastSeenTransactionId');
      const lastSeenId = savedId ? parseInt(savedId) : null;
      // ✅ Đảm bảo chỉ tính đúng số lượng giao dịch mới
      if (lastSeenId !== null) {
        const count = sortedData.filter(
          (tx: WalletTransaction) => tx.walletTransactionId > lastSeenId
        ).length;

        setNewTransactionCount(count); // ✅ set chính xác
      } else {
        // Lần đầu, coi như không có đơn mới cần thông báo
        setNewTransactionCount(0);
      }
    } catch (error) {
      console.error('Lỗi khi fetch giao dịch:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoneyData = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/wallet/get-amount', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();

      // Nếu đã có số dư cũ và thay đổi → cập nhật giao dịch
      if (prevMoneyRef.current !== null && data !== prevMoneyRef.current) {
        fetchTransactions(); // Gọi để kiểm tra giao dịch mới
      }

      prevMoneyRef.current = data;
      setMoney(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMoneyData();
    fetchTransactions();

    const handleReload = () => {
      fetchMoneyData();
      fetchTransactions();
    };

    window.addEventListener('reloadProfile', handleReload);

    return () => {
      window.removeEventListener('reloadProfile', handleReload);
    };
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);

    // ✅ Reset thông báo khi user đã xem
    if (transactions.length > 0) {
      const latestId = transactions[0].walletTransactionId;
      setLastSeenId(latestId);
      localStorage.setItem('lastSeenTransactionId', latestId.toString());
      setNewTransactionCount(0); // ✅ reset về 0 sau khi mở chuông
    }

    if (transactions.length === 0) {
      setLoading(true);
      await fetchTransactions();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return 'Nạp tiền';
      case 'REFUND':
        return 'Hoàn tiền';
      case 'WITHDRAW':
        return 'Rút tiền';
      case 'PAYMENT':
        return 'Thanh toán';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'Thành công';
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Đang xử lý';
      case 'failed':
        return 'Thất bại';
      case 'error':
        return 'Lỗi';
      default:
        return status;
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={newTransactionCount} color="error">
          <Bell />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            '& .MuiMenuItem-root': {
              py: 1.5,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Giao dịch ví gần đây
          </Typography>
        </Box>
        <Divider />

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 3,
            }}
          >
            <CircularProgress size={24} />
            <Typography sx={{ ml: 2 }}>Đang tải dữ liệu...</Typography>
          </Box>
        ) : transactions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography color="textSecondary">
              Không có giao dịch nào
            </Typography>
          </Box>
        ) : (
          <>
            {transactions.slice(0, 10).map((tx, index) => {
              const isIncome = tx.type === 'DEPOSIT' || tx.type === 'REFUND';
              const amountFormatted = `${
                isIncome ? '+' : '-'
              }${tx.amount.toLocaleString()}₫`;
              const amountColor = isIncome ? '#4caf50' : '#f44336';

              return (
                <Box key={tx.walletTransactionId}>
                  <MenuItem sx={{ py: 1.5, px: 2 }}>
                    <Box sx={{ width: '100%' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            sx={{ mb: 0.5 }}
                          >
                            {getTransactionTypeLabel(tx.type)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(tx.timestamp).toLocaleString('vi-VN')}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            sx={{ color: amountColor, mb: 0.5 }}
                          >
                            {amountFormatted}
                          </Typography>
                          <Chip
                            label={getStatusLabel(tx.transactionStatus)}
                            color={getStatusColor(tx.transactionStatus) as any}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        </Box>
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        Mã Hóa Đơn: {tx.bankCode}
                      </Typography>
                    </Box>
                  </MenuItem>
                  {index < Math.min(transactions.length, 10) - 1 && <Divider />}
                </Box>
              );
            })}
            {transactions.length > 10 && (
              <Box sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  Hiển thị 10 giao dịch gần nhất
                </Typography>
              </Box>
            )}
          </>
        )}
      </Menu>
    </>
  );
}
