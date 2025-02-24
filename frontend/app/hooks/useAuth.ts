import { useEffect, useState } from 'react';
import axios from 'axios';

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

  const fetchUserPermissionsFromDB = async (userId: string): Promise<UserPermissions | null> => {
    try {
      const response = await axios.get(`/api/auth/userID/${userId}`);
      return response.data.permissions;
    } catch (error) {
      console.error('Database fetch error:', error);
      return null;
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get('/api/auth/verifytoken');
        const data = response.data;
        
        if (data.valid) {
          const dbPermissions = await fetchUserPermissionsFromDB(data.userId);
          setPermissions(dbPermissions);
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
