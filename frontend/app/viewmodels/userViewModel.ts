import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { initialFormState, User } from '../models/user';
import { UserServices } from '../services/userService';
import { removeEmptyValues } from '../hooks/function';
export function useUserViewModel() {
    const UserService = UserServices
    const removeEmptyValue = removeEmptyValues
    const router = useRouter();
  const [formData, setFormData] = useState<User>({
    email: '',
    firstName: '',
    lastName: '',
    social: {
      facebook: '',
      twitter: '',
      github: '',
      website: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('social.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanedData = removeEmptyValue(formData);
      await UserService.createUser(cleanedData);
      setFormData(initialFormState);
      router.push('/'); 

      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit
  };
}