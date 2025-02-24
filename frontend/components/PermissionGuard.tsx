'use client'
import { ReactNode } from 'react';
import { useAuth, UserPermissions } from '../app/hooks/useAuth';

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermissions?: Partial<UserPermissions>;
  requireAny?: boolean;
}

export const PermissionGuard = ({
  children,
  requiredPermissions = {},
  requireAny = false,
}: PermissionGuardProps) => {
  const { permissions, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!permissions) {
    return null;
  }

  const hasPermission = Object.entries(requiredPermissions).every(([key, value]) => {
    return permissions[key as keyof UserPermissions] === value;
  });

  const hasAnyPermission = Object.entries(requiredPermissions).some(([key, value]) => {
    return permissions[key as keyof UserPermissions] === value;
  });

  if ((requireAny && !hasAnyPermission) || (!requireAny && !hasPermission)) {
    return null;
  }

  return <>{children}</>;
};
