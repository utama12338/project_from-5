// import { ReactNode } from 'react';
// import { useAuth } from '@/app/hooks/useAuth';

// interface RoleBasedComponentProps {
//   children: ReactNode;
//   requiredRole?: 'USER' | 'ADMIN' | 'SUPERUSER';
//   requiredPermissions?: Array<'canCreateuser' | 'canCreate' | 'canEdit' | 'canDelete'>;
// }

// export const RoleBasedComponent = ({
//   children,
//   requiredRole,
//   requiredPermissions = [],
// }: RoleBasedComponentProps) => {
//   const { permissions, loading, hasRole, hasPermission } = useAuth();

//   if (loading) {
//     return null;
//   }

//   if (!permissions) {
//     return null;
//   }

//   if (requiredRole && !hasRole(requiredRole)) {
//     return null;
//   }

//   if (requiredPermissions.length > 0 && 
//       !requiredPermissions.every(permission => hasPermission(permission))) {
//     return null;
//   }

//   return <>{children}</>;
// };
