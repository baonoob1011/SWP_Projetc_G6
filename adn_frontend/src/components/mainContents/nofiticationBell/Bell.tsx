import React, { useState, useRef, useEffect } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import {
  Badge,
  ClickAwayListener,
  Paper,
  Popper,
  MenuList,
  MenuItem,
} from '@mui/material';

type Notification = {
  id: number;
  message: string;
  time: string;
};

const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  const addNotification = (message: string) => {
    const newNotification: Notification = {
      id: new Date().getTime(),
      message,
      time: 'Vừa xong',
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  // Giả lập có thông báo mới sau 5 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification('Một thông báo mới từ hệ thống!');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={anchorRef}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <Badge badgeContent={notifications.length} color="error">
        <IoNotificationsOutline
          size={28}
          style={{ cursor: 'pointer' }}
          onClick={handleToggle}
        />
      </Badge>

      <Popper open={open} anchorEl={anchorRef.current} placement="bottom-end">
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            style={{
              width: 300,
              maxHeight: 300,
              overflowY: 'auto',
              zIndex: 9999,
            }}
          >
            <MenuList>
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <MenuItem key={n.id}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{n.message}</div>
                      <small style={{ color: '#888' }}>{n.time}</small>
                    </div>
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Không có thông báo mới</MenuItem>
              )}
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

export default NotificationBell;
