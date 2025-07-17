import { describe, test, expect, vi, beforeEach } from 'vitest';
import { authService } from '../../services/auth';
import { mockUser, mockProfile } from '../../test/setup';

// Mock Supabase client
const mockSupabase = {
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
    onAuthStateChange: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn()
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    upsert: vi.fn().mockReturnThis()
  }))
};

// Mock the supabase module
vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabase
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    test('signs up user successfully', async () => {
      const signUpData = {
        email: 'newuser@test.com',
        password: 'password123',
        full_name: 'New User',
        role: 'student'
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: {
          user: { ...mockUser, email: signUpData.email },
          session: { access_token: 'token123' }
        },
        error: null
      });

      mockSupabase.from().upsert().mockResolvedValue({
        data: [{ ...mockProfile, email: signUpData.email, full_name: signUpData.full_name }],
        error: null
      });

      const result = await authService.signUp(signUpData);

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            full_name: signUpData.full_name,
            role: signUpData.role
          }
        }
      });

      expect(result.data?.user?.email).toBe(signUpData.email);
      expect(result.error).toBeNull();
    });

    test('handles signup error for existing email', async () => {
      const signUpData = {
        email: 'existing@test.com',
        password: 'password123',
        full_name: 'Test User',
        role: 'student'
      };

      const mockError = {
        message: 'User already registered',
        status: 422
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      });

      const result = await authService.signUp(signUpData);

      expect(result.data).toBeNull();
      expect(result.error).toEqual(mockError);
    });

    test('validates email format', async () => {
      const invalidSignUpData = {
        email: 'invalid-email',
        password: 'password123',
        full_name: 'Test User',
        role: 'student'
      };

      const result = await authService.signUp(invalidSignUpData);

      expect(result.error?.message).toContain('Invalid email format');
    });

    test('validates password strength', async () => {
      const weakPasswordData = {
        email: 'test@test.com',
        password: '123',
        full_name: 'Test User',
        role: 'student'
      };

      const result = await authService.signUp(weakPasswordData);

      expect(result.error?.message).toContain('Password must be at least 6 characters');
    });

    test('validates required fields', async () => {
      const incompleteData = {
        email: 'test@test.com',
        password: 'password123'
        // Missing full_name and role
      };

      const result = await authService.signUp(incompleteData as any);

      expect(result.error?.message).toContain('Full name is required');
    });
  });

  describe('signIn', () => {
    test('signs in user successfully', async () => {
      const signInData = {
        email: 'user@test.com',
        password: 'password123'
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: {
          user: mockUser,
          session: { access_token: 'token123' }
        },
        error: null
      });

      const result = await authService.signIn(signInData);

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: signInData.email,
        password: signInData.password
      });

      expect(result.data?.user).toEqual(mockUser);
      expect(result.error).toBeNull();
    });

    test('handles invalid credentials', async () => {
      const signInData = {
        email: 'user@test.com',
        password: 'wrongpassword'
      };

      const mockError = {
        message: 'Invalid login credentials',
        status: 400
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      });

      const result = await authService.signIn(signInData);

      expect(result.data).toBeNull();
      expect(result.error).toEqual(mockError);
    });

    test('handles account not confirmed', async () => {
      const signInData = {
        email: 'unconfirmed@test.com',
        password: 'password123'
      };

      const mockError = {
        message: 'Email not confirmed',
        status: 400
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      });

      const result = await authService.signIn(signInData);

      expect(result.error?.message).toContain('Email not confirmed');
    });
  });

  describe('signOut', () => {
    test('signs out user successfully', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        error: null
      });

      const result = await authService.signOut();

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(result.error).toBeNull();
    });

    test('handles signout error', async () => {
      const mockError = { message: 'Signout failed' };

      mockSupabase.auth.signOut.mockResolvedValue({
        error: mockError
      });

      const result = await authService.signOut();

      expect(result.error).toEqual(mockError);
    });
  });

  describe('getCurrentUser', () => {
    test('gets current user successfully', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      const result = await authService.getCurrentUser();

      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
      expect(result.data?.user).toEqual(mockUser);
    });

    test('handles no current user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null
      });

      const result = await authService.getCurrentUser();

      expect(result.data?.user).toBeNull();
    });
  });

  describe('getUserProfile', () => {
    test('gets user profile successfully', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockProfile,
        error: null
      });

      const result = await authService.getUserProfile('test-user-id');

      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('id', 'test-user-id');
      expect(result.data).toEqual(mockProfile);
    });

    test('handles profile not found', async () => {
      const mockError = { message: 'Profile not found' };

      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: mockError
      });

      const result = await authService.getUserProfile('non-existent-id');

      expect(result.error).toEqual(mockError);
    });
  });

  describe('updateUserProfile', () => {
    test('updates user profile successfully', async () => {
      const updateData = {
        full_name: 'Updated Name',
        phone: '+1234567890'
      };

      const updatedProfile = { ...mockProfile, ...updateData };

      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: updatedProfile,
        error: null
      });

      const result = await authService.updateUserProfile('test-user-id', updateData);

      expect(mockSupabase.from().update).toHaveBeenCalledWith(updateData);
      expect(result.data).toEqual(updatedProfile);
    });

    test('validates profile update data', async () => {
      const invalidData = {
        email: 'invalid-email' // Invalid email format
      };

      const result = await authService.updateUserProfile('test-user-id', invalidData);

      expect(result.error?.message).toContain('Invalid email format');
    });
  });

  describe('resetPassword', () => {
    test('sends password reset email successfully', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null
      });

      const result = await authService.resetPassword('user@test.com');

      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('user@test.com');
      expect(result.error).toBeNull();
    });

    test('handles invalid email for password reset', async () => {
      const mockError = { message: 'Invalid email' };

      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: null,
        error: mockError
      });

      const result = await authService.resetPassword('invalid@test.com');

      expect(result.error).toEqual(mockError);
    });
  });

  describe('changePassword', () => {
    test('changes password successfully', async () => {
      mockSupabase.auth.updateUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      const result = await authService.changePassword('newpassword123');

      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'newpassword123'
      });
      expect(result.error).toBeNull();
    });

    test('validates new password strength', async () => {
      const result = await authService.changePassword('123');

      expect(result.error?.message).toContain('Password must be at least 6 characters');
    });
  });

  describe('checkUserRole', () => {
    test('checks admin role correctly', async () => {
      const adminProfile = { ...mockProfile, role: 'admin' };
      
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: adminProfile,
        error: null
      });

      const result = await authService.checkUserRole('test-user-id', 'admin');

      expect(result.data?.hasRole).toBe(true);
    });

    test('checks role mismatch', async () => {
      const studentProfile = { ...mockProfile, role: 'student' };
      
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: studentProfile,
        error: null
      });

      const result = await authService.checkUserRole('test-user-id', 'admin');

      expect(result.data?.hasRole).toBe(false);
    });
  });

  describe('onAuthStateChange', () => {
    test('sets up auth state listener', () => {
      const mockCallback = vi.fn();
      
      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      });

      const subscription = authService.onAuthStateChange(mockCallback);

      expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalledWith(mockCallback);
      expect(subscription.data.subscription.unsubscribe).toBeDefined();
    });
  });

  describe('validateSession', () => {
    test('validates active session', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      const result = await authService.validateSession();

      expect(result.data?.isValid).toBe(true);
      expect(result.data?.user).toEqual(mockUser);
    });

    test('handles expired session', async () => {
      const mockError = { message: 'JWT expired' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: mockError
      });

      const result = await authService.validateSession();

      expect(result.data?.isValid).toBe(false);
    });
  });
});
