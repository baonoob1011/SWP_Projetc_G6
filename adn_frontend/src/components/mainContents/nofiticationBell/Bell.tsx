/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Chip,
  Badge,
  Tabs,
  Tab,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Type declarations

type WalletTransaction = {
  walletTransactionId: number;
  type: string;
  amount: number;
  timestamp: string;
  transactionStatus: string;
  bankCode: string;
};

type Appointment = {
  appointmentId: number;
  appointmentDate: string;
  appointmentStatus: string;
  note: string;
  appointmentType: string;
};

export default function WalletNotification() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const [tabIndex, setTabIndex] = useState(0);

  // Wallet transaction states
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [newTransactionCount, setNewTransactionCount] = useState(0);
  const [lastSeenTransactionId, setLastSeenTransactionId] = useState<
    number | null
  >(() => {
    const savedId = localStorage.getItem('lastSeenTransactionId');
    return savedId ? parseInt(savedId) : null;
  });
  const prevMoneyRef = useRef<any>(null);
  const [money, setMoney] = useState<any>(null);

  // Appointment states
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [newAppointmentCount, setNewAppointmentCount] = useState(0);
  const [lastSeenAppointmentId, setLastSeenAppointmentId] = useState<
    number | null
  >(() => {
    const saved = localStorage.getItem('lastSeenAppointmentId');
    return saved ? parseInt(saved) : null;
  });

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        'http://localhost:8080/api/wallet/get-all-wallet-transition',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Không thể lấy dữ liệu');

      const data = await res.json();
      const sortedData = data.sort(
        (a: any, b: any) => b.walletTransactionId - a.walletTransactionId
      );
      setTransactions(sortedData);

      const lastSeenId = lastSeenTransactionId;
      if (lastSeenId !== null) {
        const count = sortedData.filter(
          (tx: any) => tx.walletTransactionId > lastSeenId
        ).length;
        setNewTransactionCount(count);
      } else {
        setNewTransactionCount(0);
      }
    } catch (error) {
      console.error('Lỗi khi fetch giao dịch:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        'http://localhost:8080/api/appointment/get-appointment',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      const homeAppointments: Appointment[] =
        data?.allAppointmentAtHomeResponse?.map(
          (item: any) => item.showAppointmentResponse
        ) || [];

      const centerAppointments: Appointment[] =
        data?.allAppointmentAtCenterResponse?.map(
          (item: any) => item.showAppointmentResponse
        ) || [];

      const combinedAppointments = [...homeAppointments, ...centerAppointments];
      const sorted = combinedAppointments.sort(
        (a, b) => b.appointmentId - a.appointmentId
      );
      setAppointments(sorted);

      // Lấy dữ liệu cũ từ localStorage
      const storedNoteMap = JSON.parse(
        localStorage.getItem('appointmentNoteMap') || '{}'
      ) as Record<number, string>;

      let count = 0;
      const updatedNoteMap: Record<number, string> = {};

      for (const appt of sorted) {
        const oldNote = storedNoteMap[appt.appointmentId];
        const isNewNote = oldNote !== undefined && oldNote !== appt.note;

        if (appt.appointmentId > (lastSeenAppointmentId ?? 0) || isNewNote) {
          count++;
        }

        updatedNoteMap[appt.appointmentId] = appt.note;
      }

      localStorage.setItem(
        'appointmentNoteMap',
        JSON.stringify(updatedNoteMap)
      );
      setNewAppointmentCount(count);
    } catch (error) {
      console.error('Lỗi khi fetch appointment:', error);
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
      if (prevMoneyRef.current !== null && data !== prevMoneyRef.current) {
        fetchTransactions();
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
    fetchAppointments();

    const handleReload = () => {
      fetchMoneyData();
      fetchTransactions();
      fetchAppointments();
    };

    window.addEventListener('reloadProfile', handleReload);
    return () => window.removeEventListener('reloadProfile', handleReload);
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);

    if (transactions.length > 0) {
      const latestId = transactions[0].walletTransactionId;
      localStorage.setItem('lastSeenTransactionId', latestId.toString());
      setLastSeenTransactionId(latestId);
      setNewTransactionCount(0);
    }

    if (appointments.length > 0) {
      const latestAppId = appointments[0].appointmentId;
      localStorage.setItem('lastSeenAppointmentId', latestAppId.toString());
      setLastSeenAppointmentId(latestAppId);
      setNewAppointmentCount(0);
    }
    if (appointments.length > 0) {
      const latestAppId = appointments[0].appointmentId;
      localStorage.setItem('lastSeenAppointmentId', latestAppId.toString());
      setLastSeenAppointmentId(latestAppId);

      const noteMap: Record<number, string> = {};
      appointments.forEach((appt) => {
        noteMap[appt.appointmentId] = appt.note;
      });
      localStorage.setItem('appointmentNoteMap', JSON.stringify(noteMap));
      setNewAppointmentCount(0);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return 'Nạp tiền';
      case 'REFUNDED':
        return 'Hoàn tiền';
      case 'WITHDRAW':
        return 'Rút tiền';
      case 'PAYMENT':
        return 'Thanh toán';
      case 'SUCCESS':
        return 'Thành công';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'PENDING':
        return 'Đang xử lý';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'confirmed':
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
        <Badge
          badgeContent={newTransactionCount + newAppointmentCount}
          color="error"
        >
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
            maxHeight: 600,
            '& .MuiMenuItem-root': { py: 1.5 },
          },
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(_, newValue) => setTabIndex(newValue)}
          variant="fullWidth"
        >
          <Tab label="Lịch hẹn" />
          <Tab label="Giao dịch ví" />
        </Tabs>
        <Divider />

        {tabIndex === 0 && (
          <>
            {appointments.slice(0, 5).map((appt, index) => (
              <Box key={appt.appointmentId}>
                <MenuItem sx={{ py: 1.5, px: 2 }}>
                  <Box sx={{ width: '100%' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {appt.appointmentType === 'HOME'
                            ? 'Tại nhà'
                            : 'Tại cơ sở'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {appt.appointmentDate}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip
                          label={getTransactionTypeLabel(
                            appt.appointmentStatus
                          )}
                          color={getStatusColor(appt.appointmentStatus) as any}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                        {appt.appointmentId > (lastSeenAppointmentId ?? 0) && (
                          <Chip label="+1" color="warning" size="small" />
                        )}
                      </Box>
                    </Box>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{
                        fontStyle: 'italic',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {appt.note}
                    </Typography>
                  </Box>
                </MenuItem>
                {index < 4 && <Divider />}
              </Box>
            ))}
            <Box sx={{ textAlign: 'center', py: 1.5 }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': { opacity: 0.8 },
                }}
                onClick={() => {
                  handleClose();
                  navigate('/u-profile');
                }}
              >
                Xem chi tiết
              </Typography>
            </Box>
          </>
        )}

        {tabIndex === 1 && (
          <>
            {transactions.slice(0, 5).map((tx, index) => {
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
                          mb: 1,
                        }}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
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
                            sx={{ color: amountColor }}
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
                  {index < 4 && <Divider />}
                </Box>
              );
            })}

            <Box sx={{ textAlign: 'center', py: 1.5 }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': { opacity: 0.8 },
                }}
                onClick={() => {
                  handleClose();
                  navigate('/u-profile');
                }}
              >
                Xem chi tiết
              </Typography>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
}
