// src/components/auth/ProtectedRoute.tsx
import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: JSX.Element;
  allowedRoles?: string[]; // ví dụ: ['ADMIN']
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role || '')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
