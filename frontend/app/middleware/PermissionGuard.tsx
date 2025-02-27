// components/PermissionGuard.tsx
'use client'
import { ReactNode, MouseEvent } from 'react';
import { useAuth, UserPermissions } from './AuthContext';
import Swal from 'sweetalert2';


interface PermissionGuardProps {
  children: ReactNode;
  requiredPermissions?: Partial<UserPermissions>;
  requireAny?: boolean;
  checkOnClick?: boolean;
}

export const PermissionGuard = ({
  children,
  requiredPermissions = {},
  requireAny = false,
  checkOnClick = false,
}: PermissionGuardProps) => {
  const { permissions, loading } = useAuth();

  const checkPermissions = () => {
    if (!permissions) return false;
    if (Object.keys(requiredPermissions).length === 0) return true;

    const hasPermission = Object.entries(requiredPermissions).every(([key, value]) => {
      return permissions[key as keyof UserPermissions] === value;
    });

    const hasAnyPermission = Object.entries(requiredPermissions).some(([key, value]) => {
      return permissions[key as keyof UserPermissions] === value;
    });

    return requireAny ? hasAnyPermission : hasPermission;
  };

  const handleClick = (e: MouseEvent) => {
    if (checkOnClick && !checkPermissions()) {
      e.preventDefault();
      e.stopPropagation();
      Swal.fire({
        icon: 'warning',
        title: 'Insufficient Permissions',
        text: `You need ${JSON.stringify(requiredPermissions)} to perform this action.`,
        confirmButtonText: 'OK',
      });
    }
  };

  if (loading) {
    return null; // หรือ loading spinner
  }

  if (!permissions) {
    Swal.fire({
      icon: 'error',
      title: 'Access You need ADMIN role',
      text: 'ไม่มีสิทธิ์เข้าถึงหน้านี้',
      confirmButtonText: 'OK',
    });
    return null;
  }

  if (!checkOnClick) {
    if (!checkPermissions()) {
      return null;
    }
    return <>{children}</>;
  }

  return <div onClick={handleClick}>{children}</div>;
};




// 'use client'
// import { ReactNode } from 'react';
// import { useAuth, UserPermissions } from '../hooks/useAuth';
// // import Swal from 'sweetalert2';


// interface PermissionGuardProps {
//   children: ReactNode;
//   requiredPermissions?: Partial<UserPermissions>;
//   requireAny?: boolean;
 
// }

// export const PermissionGuard = ({
//   children,
//   requiredPermissions = {},
//   requireAny = false,
// }: PermissionGuardProps) => {
//   const { permissions, loading } = useAuth();

//   if (loading) {
//     return null; // Or a loading spinner
//   }

//   if (!permissions) {
//     return null;  // แจ้งเตือน
//   }

//   const hasPermission = Object.entries(requiredPermissions).every(([key, value]) => {
//     return permissions[key as keyof UserPermissions] === value;
//   });

//   const hasAnyPermission = Object.entries(requiredPermissions).some(([key, value]) => {
//     return permissions[key as keyof UserPermissions] === value;
//   });

//   if ((requireAny && !hasAnyPermission) || (!requireAny && !hasPermission)) {
//     return null; // หรือแสดงข้อความ "Access Denied" ก็ได้
//   }

//   return <>{children}</>;
// };
