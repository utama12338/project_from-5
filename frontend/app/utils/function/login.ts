// import { useRouter } from 'next/navigation';
// import axios from 'axios';

// const router = useRouter();
// const [error, setError] = useState('');
// const [loading, setLoading] = useState(false);


// const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const res = await axios.post('/api/auth/login', {
//         ...formData,
//         csrfToken,
//       });

//       const data = res.data;

//       if (res.status !== 200) {
//         throw new Error(data.message || 'Login failed');
//       }

//       // Check user role for redirection
//       console.log({'data': data});
//       console.log({'data.user': data.user});
//       console.log({'data.user.role': data.user.role});
//       if (data.user && (data.user.role === 'ADMIN' || data.user.role === 'SUPERUSER')) {
//         router.push('/admin'); // Redirect admin users to admin page
//       } else {
//         router.push('/form'); // Redirect regular users to form page
//       }
//     } catch (error) {
//         setError(error instanceof Error ? error.message : 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };