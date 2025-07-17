// System Test Utilities for IDARAH WALI UL ASER
import { supabase } from '../lib/supabase';
import { authService } from '../services/auth';
import { booksService } from '../services/books';
import { usersService } from '../services/users';
import { coursesService } from '../services/courses';
import { dataManager } from '../services/dataManager';
import { localStorageService } from '../services/localStorage';
import { errorHandler } from '../services/errorHandler';

export interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  duration: number;
}

export class SystemTester {
  private results: TestResult[] = [];

  async runAllTests(): Promise<TestResult[]> {
    console.log('🧪 Starting IDARAH WALI UL ASER System Tests...');
    
    this.results = [];
    
    // Database connectivity tests
    await this.testDatabaseConnection();
    await this.testRLSPolicies();
    
    // Authentication tests
    await this.testAuthenticationFlow();
    await this.testProfileCreation();
    
    // Service tests
    await this.testBooksService();
    await this.testCoursesService();
    
    // Local storage tests
    await this.testLocalStorage();
    await this.testDraftManagement();
    
    // Real-time tests
    await this.testRealtimeSubscriptions();
    
    // Error handling tests
    await this.testErrorHandling();
    
    console.log('✅ System Tests Completed');
    this.printResults();
    
    return this.results;
  }

  private async runTest(testName: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    
    try {
      await testFn();
      this.results.push({
        test: testName,
        status: 'PASS',
        message: 'Test completed successfully',
        duration: Date.now() - startTime
      });
    } catch (error) {
      this.results.push({
        test: testName,
        status: 'FAIL',
        message: (error as Error).message,
        duration: Date.now() - startTime
      });
    }
  }

  private async testDatabaseConnection(): Promise<void> {
    await this.runTest('Database Connection', async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (error) {
        throw new Error(`Database connection failed: ${error.message}`);
      }
    });
  }

  private async testRLSPolicies(): Promise<void> {
    await this.runTest('RLS Policies', async () => {
      // Test if RLS helper functions exist
      const { data, error } = await supabase.rpc('get_current_user_role');
      
      if (error && error.code === '42883') {
        throw new Error('RLS helper functions not found. Run verify-rls-policies.sql');
      }
      
      // Test basic table access
      const { error: booksError } = await supabase
        .from('books')
        .select('id')
        .limit(1);
      
      if (booksError && booksError.code === 'PGRST301') {
        throw new Error('RLS policies blocking access. Check authentication.');
      }
    });
  }

  private async testAuthenticationFlow(): Promise<void> {
    await this.runTest('Authentication Flow', async () => {
      // Test getting current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw new Error(`Session error: ${error.message}`);
      }
      
      // Test getting current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error(`User error: ${userError.message}`);
      }
      
      if (user) {
        // Test profile access
        const profile = await authService.getProfile(user.id);
        if (!profile) {
          console.warn('User authenticated but no profile found - this is normal for new users');
        }
      }
    });
  }

  private async testProfileCreation(): Promise<void> {
    await this.runTest('Profile Creation', async () => {
      // This test only runs if we have a current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('SKIP: No authenticated user for profile test');
      }
      
      const profile = await authService.getProfile(user.id);
      
      if (!profile) {
        throw new Error('Profile not found and auto-creation failed');
      }
      
      if (!profile.role) {
        throw new Error('Profile missing required role field');
      }
    });
  }

  private async testBooksService(): Promise<void> {
    await this.runTest('Books Service', async () => {
      // Test getting books
      const { data, error } = await booksService.getBooks({ limit: 1 });
      
      if (error) {
        throw new Error(`Books service error: ${error}`);
      }
      
      // Test books statistics
      const { data: stats, error: statsError } = await booksService.getBookStatistics();
      
      if (statsError) {
        throw new Error(`Books statistics error: ${statsError}`);
      }
    });
  }

  private async testCoursesService(): Promise<void> {
    await this.runTest('Courses Service', async () => {
      // Test getting courses
      const { data, error } = await coursesService.getCourses();
      
      if (error) {
        throw new Error(`Courses service error: ${error}`);
      }
      
      // Test getting quizzes
      const { data: quizzes, error: quizError } = await coursesService.getQuizzes();
      
      if (quizError) {
        throw new Error(`Quizzes service error: ${quizError}`);
      }
    });
  }

  private async testLocalStorage(): Promise<void> {
    await this.runTest('Local Storage', async () => {
      // Test basic local storage operations
      const testData = { test: 'data', timestamp: Date.now() };
      
      // Test saving and retrieving
      const success = localStorageService.saveSettings(testData);
      if (!success) {
        throw new Error('Failed to save to local storage');
      }
      
      const retrieved = localStorageService.getSettings();
      if (!retrieved.test) {
        throw new Error('Failed to retrieve from local storage');
      }
      
      // Test storage info
      const storageInfo = localStorageService.getStorageInfo();
      if (storageInfo.percentage > 90) {
        console.warn('Local storage usage is high:', storageInfo.percentage + '%');
      }
    });
  }

  private async testDraftManagement(): Promise<void> {
    await this.runTest('Draft Management', async () => {
      const testDraft = {
        id: 'test-draft',
        type: 'book' as const,
        data: { title: 'Test Book', author: 'Test Author' },
        userId: 'test-user',
        timestamp: Date.now()
      };
      
      // Test saving draft
      const success = localStorageService.saveDraft(testDraft);
      if (!success) {
        throw new Error('Failed to save draft');
      }
      
      // Test retrieving draft
      const retrieved = localStorageService.getDraft('book', 'test-draft');
      if (!retrieved) {
        throw new Error('Failed to retrieve draft');
      }
      
      // Test deleting draft
      const deleted = localStorageService.deleteDraft('book', 'test-draft');
      if (!deleted) {
        throw new Error('Failed to delete draft');
      }
    });
  }

  private async testRealtimeSubscriptions(): Promise<void> {
    await this.runTest('Realtime Subscriptions', async () => {
      let subscriptionWorking = false;
      
      // Test subscription setup
      const unsubscribe = dataManager.subscribeToTable(
        'books',
        (payload) => {
          subscriptionWorking = true;
          console.log('📡 Realtime test received:', payload);
        }
      );
      
      // Wait a moment for subscription to establish
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clean up
      unsubscribe();
      
      // Note: We can't easily test if the subscription actually works without making changes
      console.log('Realtime subscription setup completed (actual functionality requires database changes to test)');
    });
  }

  private async testErrorHandling(): Promise<void> {
    await this.runTest('Error Handling', async () => {
      // Test error classification
      const testError = new Error('Test error message');
      const errorDetails = errorHandler.classifyError(testError);
      
      if (!errorDetails.message) {
        throw new Error('Error handler failed to classify error');
      }
      
      if (!errorDetails.severity) {
        throw new Error('Error handler failed to assign severity');
      }
      
      // Test user message generation
      const userMessage = errorHandler.getUserMessage(errorDetails);
      if (!userMessage.includes('Allah') && !userMessage.includes('SubhanAllah')) {
        throw new Error('Error handler not generating Islamic context messages');
      }
    });
  }

  private printResults(): void {
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const skipped = this.results.filter(r => r.status === 'SKIP').length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    
    console.log('\nDetailed Results:');
    this.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
      console.log(`${icon} ${result.test} (${result.duration}ms)`);
      if (result.status === 'FAIL') {
        console.log(`   Error: ${result.message}`);
      }
    });
    
    if (failed > 0) {
      console.log('\n🔧 Recommendations:');
      console.log('- Run verify-rls-policies.sql if RLS tests failed');
      console.log('- Check Supabase connection if database tests failed');
      console.log('- Verify environment variables are set correctly');
      console.log('- Check browser console for additional error details');
    }
  }
}

// Export a simple function to run tests
export async function runSystemTests(): Promise<TestResult[]> {
  const tester = new SystemTester();
  return await tester.runAllTests();
}

// Export for use in development
export const systemTester = new SystemTester();
