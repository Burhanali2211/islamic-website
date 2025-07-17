import React, { useState } from 'react';
import { useSupabaseApp } from '../context/SupabaseContext';

export function AuthTest() {
  const { state, signIn, signOut } = useSupabaseApp();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testCredentials = async (email: string, password: string, expectedRole: string) => {
    try {
      addResult(`🧪 Testing ${email}...`);
      await signIn(email, password);
      
      // Wait a moment for state to update
      setTimeout(() => {
        if (state.user && state.profile) {
          const actualRole = state.profile.role;
          if (actualRole === expectedRole) {
            addResult(`✅ SUCCESS: ${email} -> ${actualRole} (expected: ${expectedRole})`);
          } else {
            addResult(`❌ FAIL: ${email} -> ${actualRole} (expected: ${expectedRole})`);
          }
        } else {
          addResult(`❌ FAIL: ${email} -> No user/profile found`);
        }
      }, 1000);
      
    } catch (error) {
      addResult(`❌ ERROR: ${email} -> ${error}`);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    addResult('🚀 Starting authentication tests...');

    const testCases = [
      { email: 'admin@idarah.com', password: 'admin123', role: 'admin' },
      { email: 'admin@demo.idarah.com', password: 'demo123', role: 'admin' },
      { email: 'teacher@demo.idarah.com', password: 'demo123', role: 'teacher' },
      { email: 'student@demo.idarah.com', password: 'demo123', role: 'student' }
    ];

    for (const testCase of testCases) {
      await testCredentials(testCase.email, testCase.password, testCase.role);
      
      // Sign out between tests
      try {
        await signOut();
        addResult(`🚪 Signed out`);
      } catch (error) {
        addResult(`⚠️ Sign out error: ${error}`);
      }
      
      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    addResult('🎯 All tests completed!');
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Authentication Test Panel</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Current Auth State:
        </p>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm">
          <p>User: {state.user?.email || 'None'}</p>
          <p>Role: {state.profile?.role || 'None'}</p>
          <p>Loading: {state.isLoading ? 'Yes' : 'No'}</p>
          <p>Error: {state.error || 'None'}</p>
        </div>
      </div>

      <div className="space-x-2 mb-4">
        <button
          onClick={runAllTests}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={state.isLoading}
        >
          Run All Tests
        </button>
        
        <button
          onClick={clearResults}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Results
        </button>

        {state.user && (
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        )}
      </div>

      <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
        {testResults.length === 0 ? (
          <p>Click "Run All Tests" to start testing authentication...</p>
        ) : (
          testResults.map((result, index) => (
            <div key={index}>{result}</div>
          ))
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>This component tests all demo credentials and verifies proper authentication flow.</p>
        <p>Check the console for detailed logs during testing.</p>
      </div>
    </div>
  );
}
