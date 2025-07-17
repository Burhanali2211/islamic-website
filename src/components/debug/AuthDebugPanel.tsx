import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Database, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useSupabaseApp } from '../../context/SupabaseContext';
import { authService } from '../../services/auth';

interface AuthDebugInfo {
  supabaseUser: any;
  profile: any;
  session: any;
  rlsTest: any;
  dbConnection: boolean;
  errors: string[];
}

export function AuthDebugPanel() {
  const { state } = useSupabaseApp();
  const [debugInfo, setDebugInfo] = useState<AuthDebugInfo>({
    supabaseUser: null,
    profile: null,
    session: null,
    rlsTest: null,
    dbConnection: false,
    errors: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const runDiagnostics = async () => {
    setIsLoading(true);
    const errors: string[] = [];
    
    try {
      // Test 1: Check Supabase connection
      console.log('🔍 Testing Supabase connection...');
      const { data: connectionTest, error: connectionError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      const dbConnection = !connectionError;
      if (connectionError) {
        errors.push(`Database connection failed: ${connectionError.message}`);
      }

      // Test 2: Get current session
      console.log('🔍 Testing current session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        errors.push(`Session error: ${sessionError.message}`);
      }

      // Test 3: Get current user
      console.log('🔍 Testing current user...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        errors.push(`User error: ${userError.message}`);
      }

      // Test 4: Get profile if user exists
      let profile = null;
      if (user) {
        console.log('🔍 Testing profile fetch...');
        profile = await authService.getProfile(user.id);
        if (!profile) {
          errors.push('Profile not found or inaccessible');
        }
      }

      // Test 5: Test RLS policies
      console.log('🔍 Testing RLS policies...');
      let rlsTest = null;
      if (user) {
        try {
          // Test if user can access their own profile
          const { data: profileTest, error: profileError } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('id', user.id)
            .single();

          if (profileError) {
            errors.push(`RLS Profile test failed: ${profileError.message}`);
          }

          // Test if user can access books
          const { data: booksTest, error: booksError } = await supabase
            .from('books')
            .select('id')
            .limit(1);

          if (booksError) {
            errors.push(`RLS Books test failed: ${booksError.message}`);
          }

          rlsTest = {
            profileAccess: !profileError,
            booksAccess: !booksError,
            profileData: profileTest,
            booksCount: booksTest?.length || 0
          };
        } catch (error) {
          errors.push(`RLS test error: ${(error as Error).message}`);
        }
      }

      setDebugInfo({
        supabaseUser: user,
        profile,
        session,
        rlsTest,
        dbConnection,
        errors
      });

    } catch (error) {
      errors.push(`Diagnostic error: ${(error as Error).message}`);
      setDebugInfo(prev => ({ ...prev, errors }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const createTestUser = async () => {
    try {
      const testEmail = 'test@idarah.com';
      const testPassword = 'TestPassword123!';
      
      console.log('🔧 Creating test user...');
      const { user, profile, session, error } = await authService.signUp(
        testEmail,
        testPassword,
        {
          full_name: 'Test User',
          name_arabic: 'مستخدم تجريبي',
          role: 'student'
        }
      );

      if (error) {
        alert(`Test user creation failed: ${error}`);
      } else {
        alert('Test user created successfully! Check your email for verification.');
        runDiagnostics();
      }
    } catch (error) {
      alert(`Error creating test user: ${(error as Error).message}`);
    }
  };

  const testDatabaseQueries = async () => {
    try {
      console.log('🔍 Testing database queries...');
      
      // Test various table access
      const tests = [
        { table: 'profiles', query: supabase.from('profiles').select('count').limit(1) },
        { table: 'books', query: supabase.from('books').select('count').limit(1) },
        { table: 'categories', query: supabase.from('categories').select('count').limit(1) },
        { table: 'borrowing_records', query: supabase.from('borrowing_records').select('count').limit(1) }
      ];

      const results = await Promise.allSettled(
        tests.map(async ({ table, query }) => {
          const { data, error } = await query;
          return { table, success: !error, error: error?.message };
        })
      );

      const testResults = results.map((result, index) => ({
        table: tests[index].table,
        ...(result.status === 'fulfilled' ? result.value : { success: false, error: 'Promise rejected' })
      }));

      console.log('Database test results:', testResults);
      alert(`Database tests completed. Check console for details.`);
    } catch (error) {
      alert(`Database test error: ${(error as Error).message}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Shield className="h-6 w-6 mr-2 text-blue-600" />
          Authentication Debug Panel
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={runDiagnostics}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Running...' : 'Run Diagnostics'}
          </button>
          
          <button
            onClick={createTestUser}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Create Test User
          </button>
          
          <button
            onClick={testDatabaseQueries}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Test DB Queries
          </button>
        </div>
      </div>

      {/* Current State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Current State
          </h3>
          <div className="space-y-2 text-sm">
            <div>User ID: {state.user?.id || 'Not authenticated'}</div>
            <div>Email: {state.user?.email || 'N/A'}</div>
            <div>Role: {state.profile?.role || 'N/A'}</div>
            <div>Profile ID: {state.profile?.id || 'N/A'}</div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Database Status
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              {debugInfo.dbConnection ? (
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
              )}
              Connection: {debugInfo.dbConnection ? 'Connected' : 'Failed'}
            </div>
            <div>Session: {debugInfo.session ? 'Active' : 'None'}</div>
            <div>Profile: {debugInfo.profile ? 'Found' : 'Not found'}</div>
          </div>
        </div>
      </div>

      {/* Errors */}
      {debugInfo.errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Errors Found
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
            {debugInfo.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* RLS Test Results */}
      {debugInfo.rlsTest && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            RLS Policy Test Results
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              {debugInfo.rlsTest.profileAccess ? (
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
              )}
              Profile Access: {debugInfo.rlsTest.profileAccess ? 'PASS' : 'FAIL'}
            </div>
            <div className="flex items-center">
              {debugInfo.rlsTest.booksAccess ? (
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
              )}
              Books Access: {debugInfo.rlsTest.booksAccess ? 'PASS' : 'FAIL'}
            </div>
          </div>
        </div>
      )}

      {/* Raw Debug Data */}
      <details className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
          Raw Debug Data (Click to expand)
        </summary>
        <pre className="mt-4 text-xs text-gray-600 dark:text-gray-300 overflow-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </details>
    </motion.div>
  );
}
