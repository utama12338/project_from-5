import { useEffect, useState } from 'react';

export interface UserPermissions {
    viewHistory: boolean;
  canCreateuser: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  role: 'USER' | 'ADMIN' | 'SUPERUSER';
}

export const useAuth = () => {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/auth/verifytoken');
        const data = await response.json();
        
        if (data.valid) {
          setPermissions(data.userPermissions);
        } else {
          setPermissions(null);
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        setPermissions(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  return { permissions, loading };
};
