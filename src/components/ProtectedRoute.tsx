import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupabaseApp } from '../context/SupabaseContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { state } = useSupabaseApp();
  const location = useLocation();

  if (state.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!state.user || !state.profile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = state.profile.role || 'student';

  // Map old role names to new ones for backward compatibility
  const roleMapping: Record<string, UserRole> = {
    'user': 'student',
    'admin': 'admin',
    'teacher': 'teacher'
  };

  const mappedAllowedRoles = allowedRoles.map(role => roleMapping[role] || role);

  if (!mappedAllowedRoles.includes(userRole)) {
    const roleDashboard = `/${userRole === 'student' ? 'student' : userRole}`;
    return <Navigate to={roleDashboard} replace />;
  }

  return <>{children}</>;
}
