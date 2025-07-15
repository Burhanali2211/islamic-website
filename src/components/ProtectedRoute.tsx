import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: User['role'][];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { state } = useApp();
  const location = useLocation();

  if (state.isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>; // Or a spinner component
  }

  if (!state.currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(state.currentUser.role)) {
    const roleDashboard = `/${state.currentUser.role === 'user' ? 'student' : state.currentUser.role}/dashboard`;
    return <Navigate to={roleDashboard} replace />;
  }

  return <>{children}</>;
}
