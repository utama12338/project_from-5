'use client'
import { ReactNode } from 'react';
import { useAuth, UserPermissions } from '../hooks/useAuth';
import Swal from 'sweetalert2';


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
    // เพิ่มขึ้นมาเอง
    Swal.fire({
      icon: 'error',
      title: 'Access Denied',
      text: 'You are not authenticated or lack permissions.',
      confirmButtonText: 'OK',
    });
    // เพิ่มขึ้นมาเอง
    return null;  // แจ้งเตือน
  }

  const hasPermission = Object.entries(requiredPermissions).every(([key, value]) => {
    return permissions[key as keyof UserPermissions] === value;
  });

  const hasAnyPermission = Object.entries(requiredPermissions).some(([key, value]) => {
    return permissions[key as keyof UserPermissions] === value;
  });

  if ((requireAny && !hasAnyPermission) || (!requireAny && !hasPermission)) {
    return null; // หรือแสดงข้อความ "Access Denied" ก็ได้
  }

  return <>{children}</>;
};
