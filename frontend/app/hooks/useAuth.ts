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
        console.log({'getuser':userId})
      const response = await axios.get(`/api/auth/userID/${userId}`); // ปรับ URL ให้ตรงกับ API
      console.log({'response':response})
      return response.data.permissions;
    } catch (error) {
      console.error('Database fetch error:', error);
      return null;
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // สมมติว่า /api/auth/verifytoken return { valid: boolean, userId: string }
        const response = await axios.get('/api/auth/verifytoken');
        console.log({'get verifytoken ':response})
        const data = response.data;
        console.log({'data':data})
        if (data.valid) {
            console.log({'fetchUserPermissionsFromDB':data.decoded.userId})
          const dbPermissions = await fetchUserPermissionsFromDB(data.decoded.userId);
          
          if (dbPermissions) {
            setPermissions(dbPermissions); // set เฉพาะเมื่อมีข้อมูล
          } else {
            setPermissions(null); // ถ้า DB หาไม่เจอ
          }
        } else {
          setPermissions(null); // token ไม่ถูกต้อง
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