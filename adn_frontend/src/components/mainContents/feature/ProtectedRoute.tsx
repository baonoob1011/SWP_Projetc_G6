import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type ProtectedRouteProps = {
  children: JSX.Element;
  allowedRoles?: string[]; // ví dụ: ['ADMIN', 'STAFF']
};

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.exp < now;
  } catch {
    return true; // lỗi khi parse token cũng coi như hết hạn
  }
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || isTokenExpired(token)) {
    localStorage.clear();
    toast.error('Phiên đăng nhập đã hết hạn');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role || '')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
