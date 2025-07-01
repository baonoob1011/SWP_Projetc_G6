import { Box, Button } from '@mui/material';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import styles from './AllDataList.module.css';

const DataList = () => {
  const location = useLocation();

  const adminNavItems = [
    { path: '/admin/user', label: 'Danh sách người dùng' },
    { path: '/admin/manager', label: 'Danh sách quản lý' },
    { path: '/admin/staff', label: 'Danh sách nhân viên' },
    { path: '/admin/collector', label: 'Danh sách nhân viên thu mẫu' },
    { path: '/admin/staff-at-home', label: 'Danh sách nhân viên dịch vụ tại nhà' },
    { path: '/admin/cashier', label: 'Danh sách nhân viên thu ngân' },
    { path: '/admin/technical', label: 'Danh sách nhân viên phòng lab' },
    { path: '/admin/appointment', label: 'Danh sách lịch hẹn' },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Quản Trị Hệ Thống</h1>
        <p className={styles.subtitle}>Quản lý toàn bộ dữ liệu và người dùng trong hệ thống</p>
      </div>

      {/* Content Card */}
      <div className={styles.contentCard}>
        {/* Navigation */}
        <div className={styles.navigationContainer}>
          <div className={styles.breadcrumb}>
            <span className={styles.breadcrumbItem}>Admin</span>
            <span className={styles.breadcrumbSeparator}>›</span>
            <span>Danh sách dữ liệu</span>
          </div>
          
          <div className={`${styles.navigationGrid} ${styles.adminNav}`}>
            {adminNavItems.map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                className={`${styles.navButton} ${location.pathname === item.path ? styles.active : ''}`}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DataList;

export const DataList2 = () => {
  const location = useLocation();

  const managerNavItems = [
    { path: '/manager/user', label: 'Danh sách người dùng' },
    { path: '/manager/staff', label: 'Danh sách nhân viên' },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Quản Lý Dữ Liệu</h1>
        <p className={styles.subtitle}>Quản lý người dùng và nhân viên trong phạm vi quyền hạn</p>
      </div>

      {/* Content Card */}
      <div className={styles.contentCard}>
        {/* Navigation */}
        <div className={styles.navigationContainer}>
          <div className={styles.breadcrumb}>
            <span className={styles.breadcrumbItem}>Manager</span>
            <span className={styles.breadcrumbSeparator}>›</span>
            <span>Quản lý dữ liệu</span>
          </div>
          
          <div className={`${styles.navigationGrid} ${styles.managerNav}`}>
            {managerNavItems.map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                className={`${styles.navButton} ${location.pathname === item.path ? styles.active : ''}`}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
