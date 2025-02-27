'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';



export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  
  useEffect(() => {
    // Check if access token exists and verify it
    const checkAccessToken = async () => {

      try {
        const res = await axios.get('/api/auth/verifytoken');
        if (res.status === 200 && res.data.valid) {
          // Check user role for redirection
          console.log({'res': res});
          console.log({'resfull': res.data.user.role});
      
          console.log({'resfulldecoded': res.data.decoded});
          if (res.data.decoded && (res.data.user.role === 'ADMIN' || res.data.user.role === 'SUPERUSER')) {
            router.push('/admin'); // Redirect admin users to admin page
          } else {
            router.push('/form'); // Redirect regular users to form page
          }
        }
      } catch (error) {
        console.error('Error verifying access token:', error);
      }
    };

    checkAccessToken();
  }, [router]);

  useEffect(() => {
    // Get CSRF token when component mounts
    axios.get('/api/auth/csrf')
      .then(res => setCsrfToken(res.data.csrfToken))
      .catch(err => console.error('Error fetching CSRF token:', err));
  }, []);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/login', {
        ...formData,
        csrfToken,
      });

      const data = res.data;

      if (res.status !== 200) {
        throw new Error(data.message || 'Login failed');
      }

      // Check user role for redirection
      console.log({'data': data});
      console.log({'data.user': data.user});
      console.log({'data.user.role': data.user.role});
      if (data.user && (data.user.role === 'ADMIN' || data.user.role === 'SUPERUSER')) {
        router.push('/admin'); // Redirect admin users to admin page
      } else {
        router.push('/form'); // Redirect regular users to form page
      }
    } catch (error) {
        setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  username: e.target.value
                }))}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !csrfToken}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading || !csrfToken 
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


