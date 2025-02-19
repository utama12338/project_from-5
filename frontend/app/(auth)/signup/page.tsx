'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';

const signUpSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await authService.signup({
        username: data.username,
        email: data.email,
        password: data.password
      });
      router.push('/login');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
      <div className="relative p-8 rounded-xl backdrop-blur-md bg-white/30 shadow-xl border border-white/20 w-96">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign Up</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/50 text-white rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('username')}
              placeholder="Username"
              className="w-full p-3 rounded bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            {errors.username && (
              <p className="text-red-200 text-sm mt-1">{`${errors.username.message}`}</p>
            )}
          </div>

          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            {errors.email && (
              <p className="text-red-200 text-sm mt-1">{`${errors.email.message}`}</p>
            )}
          </div>

          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            {errors.password && (
              <p className="text-red-200 text-sm mt-1">{`${errors.password.message}`}</p>
            )}
          </div>

          <div>
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 rounded bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            {errors.confirmPassword && (
              <p className="text-red-200 text-sm mt-1">{`${errors.confirmPassword.message}`}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-3 rounded bg-white/30 text-white font-semibold hover:bg-white/40 transition duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
