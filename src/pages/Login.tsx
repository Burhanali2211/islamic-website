import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSupabaseApp } from '../context/SupabaseContext';
import { BookOpen, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  // ✅ INFINITE LOOP DETECTOR: Monitor for excessive re-renders

  const { state, signIn } = useSupabaseApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  // ✅ FIXED: Add useRef guard to prevent multiple redirects
  const hasRedirected = useRef(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already logged in
  // ✅ FIXED: Using stable references in dependencies and useRef guard to prevent infinite loops
  useEffect(() => {
    console.log('🔍 [LOGIN] useEffect triggered - checking auth state:', {
      hasUser: !!state.user,
      hasProfile: !!state.profile,
      userEmail: state.user?.email,
      userRole: state.profile?.role,
      isLoading: state.isLoading,
      hasRedirected: hasRedirected.current
    });

    // Don't redirect while loading to avoid race conditions
    if (state.isLoading) {
      console.log('⏳ [LOGIN] Still loading, skipping redirect check');
      return;
    }

    // ✅ FIXED: Prevent multiple redirects using useRef guard
    if (hasRedirected.current) {
      console.log('🚫 [LOGIN] Already redirected, skipping');
      return;
    }

    // If user is authenticated and has profile, redirect immediately
    if (state.user && state.profile) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
      const redirectPath = state.profile.role === 'admin' ? '/admin/dashboard' :
                          state.profile.role === 'teacher' ? '/teacher' : '/student';

      console.log('🚀 [LOGIN] Redirecting authenticated user:', {
        from,
        redirectPath,
        userRole: state.profile.role
      });

      // If user came from a protected route, redirect there
      // Otherwise, redirect to role-based dashboard
      // Don't redirect to homepage (/) as it's not a protected route
      const targetPath = (from && from !== '/login' && from !== '/') ? from : redirectPath;

      console.log('🎯 [LOGIN] Final redirect target:', targetPath);

      // ✅ FIXED: Set redirect flag before navigating
      hasRedirected.current = true;
      navigate(targetPath, { replace: true });
    }
  }, [
    // ✅ FIXED: Optimized dependency array with only necessary stable references
    state.user?.id,           // Instead of state.user (object)
    state.profile?.role,      // Instead of state.profile (object)
    state.isLoading,
    navigate,
    location.state?.from?.pathname  // Instead of location.state (object)
  ]);

  // ✅ FIXED: Reset redirect guard when user logs out or component unmounts
  useEffect(() => {
    if (!state.user) {
      hasRedirected.current = false;
    }
  }, [state.user]);

  const onSubmit = async (data: LoginFormData) => {
    console.log('📝 [LOGIN] Form submitted:', { email: data.email, timestamp: new Date().toISOString() });

    try {
      console.log('🔐 [LOGIN] Calling signIn function...');
      await signIn(data.email, data.password);
      console.log('✅ [LOGIN] SignIn completed successfully - navigation will be handled by useEffect');
      // Navigation will be handled by the useEffect above
    } catch (error) {
      console.error('❌ [LOGIN] Login error caught in component:', error);
      // Error is already set in the context by signIn function
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
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...register('email')}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                  placeholder="admin@idarah.com"
                  disabled={state.isLoading}
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
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                  placeholder="••••••••"
                  disabled={state.isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={state.isLoading}
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
              disabled={state.isLoading}
              className="w-full neomorph-button py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.isLoading ? (
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
                <p className="text-red-600 dark:text-red-300 text-xs mt-2">
                  إذا استمرت المشكلة، يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني
                  <br />
                  If the problem persists, please try again or contact technical support
                </p>
              </div>
            )}

            {/* Loading State Display */}
            {state.isLoading && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="text-blue-800 dark:text-blue-200 text-sm flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  جاري المعالجة... - Processing authentication...
                </div>
              </div>
            )}
          </form>



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
