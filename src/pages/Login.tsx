import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSupabaseApp } from '../context/SupabaseContext';
import { BookOpen, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح - Invalid email address'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل - Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const { state, signIn } = useSupabaseApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already logged in
  useEffect(() => {
    if (state.user && state.profile) {
      const from = (location.state as any)?.from?.pathname || '/';
      const redirectPath = state.profile.role === 'admin' ? '/admin' :
                          state.profile.role === 'teacher' ? '/teacher' : '/student';
      navigate(from !== '/login' ? from : redirectPath, { replace: true });
    }
  }, [state.user, state.profile, navigate, location]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      // Navigation will be handled by the useEffect above
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login function for testing
  const handleDemoLogin = async (role: 'admin' | 'teacher' | 'student') => {
    const demoCredentials = {
      admin: { email: 'admin@idarah.com', password: 'admin123' },
      teacher: { email: 'teacher@idarah.com', password: 'teacher123' },
      student: { email: 'student@idarah.com', password: 'student123' }
    };

    const credentials = demoCredentials[role];
    setIsLoading(true);
    try {
      await signIn(credentials.email, credentials.password);
    } catch (error) {
      console.error('Demo login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-block neomorph-icon p-3 rounded-2xl mb-4">
              <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              مرحباً بكم في مكتبة إدارة ولي العصر
            </h1>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-1">
              Welcome to IDARAH WALI UL ASER Islamic Library
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              يرجى تسجيل الدخول للمتابعة - Please login to continue
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                البريد الإلكتروني - Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...register('email')}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                  placeholder="admin@idarah.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                كلمة المرور - Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full neomorph-button py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  جاري تسجيل الدخول... - Logging in...
                </div>
              ) : (
                'تسجيل الدخول - Login'
              )}
            </button>

            {/* Error Display */}
            {state.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {state.error}
                </p>
              </div>
            )}
          </form>

          {/* Demo Login Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              تسجيل دخول تجريبي - Demo Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
                className="text-xs py-2 px-3 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                مدير - Admin
              </button>
              <button
                onClick={() => handleDemoLogin('teacher')}
                disabled={isLoading}
                className="text-xs py-2 px-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                أستاذ - Teacher
              </button>
              <button
                onClick={() => handleDemoLogin('student')}
                disabled={isLoading}
                className="text-xs py-2 px-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
              >
                طالب - Student
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ليس لديك حساب؟ - Don't have an account?{' '}
              <Link to="/register" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">
                إنشاء حساب - Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
