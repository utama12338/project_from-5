import { UserPermissions } from "./AuthContext";

export type PermissionRequirement = {
  requiredPermissions: Partial<UserPermissions>;
  requireAny?: boolean;
  redirectPath?: string;
};

// Map of path patterns to permission requirements
export const pathPermissions: Record<string, PermissionRequirement> = {
  // Input form paths
  '/inputform': { 
    requiredPermissions: { canCreate: true } 
  },
  
  // Admin paths
  '/admin': { 
    requiredPermissions: { role: 'ADMIN' } 
  },
  
  // System management paths
  '/systems/edit': { 
    requiredPermissions: { canEdit: true } 
  },
  '/systems/delete': { 
    requiredPermissions: { canDelete: true } 
  },
  
  // History paths
  '/history': { 
    requiredPermissions: { viewHistory: true } 
  },
  
  // User management paths
  '/users/create': { 
    requiredPermissions: { canCreateuser: true } 
  },
  '/users/manage': { 
    requiredPermissions: { role: 'ADMIN'} 
  },
  
  // Super admin features
  '/test': { 
    requiredPermissions: { role: 'SUPERUSER' } 
  },
  
  // Dashboard available to all authenticated users
  '/dashboard': { 
    requiredPermissions: {} 
  }
};

// Function to check if a user has permission for a specific path
export function checkPathPermission(
  path: string, 
  permissions: UserPermissions | null
): boolean {
  if (!permissions) return false;
  
  // Find matching path pattern
  const matchingPattern = Object.keys(pathPermissions)
    .find(pattern => path.startsWith(pattern));
    
  if (!matchingPattern) return true; // If no pattern defined, allow access
  
  const { requiredPermissions, requireAny = false } = pathPermissions[matchingPattern];
  
  // If no specific permissions required
  if (Object.keys(requiredPermissions).length === 0) return true;
  
  if (requireAny) {
    // Check if user has ANY of the required permissions
    return Object.entries(requiredPermissions).some(([key, value]) => 
      permissions[key as keyof UserPermissions] === value
    );
  } else {
    // Check if user has ALL required permissions
    return Object.entries(requiredPermissions).every(([key, value]) => 
      permissions[key as keyof UserPermissions] === value
    );
  }
}