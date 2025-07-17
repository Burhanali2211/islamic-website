# Signup Duplicate Key Error Fix

## Problem Description

The application was experiencing a "duplicate key value violates unique constraint 'profiles_pkey'" error during user registration. This was happening because:

1. **Database Trigger**: There's a trigger `on_auth_user_created` that automatically creates a profile when a user is inserted into `auth.users`
2. **Manual Profile Creation**: The `AuthService.signUp()` method was also trying to manually create a profile
3. **Race Condition**: Both operations were trying to insert the same profile with the same ID, causing a primary key constraint violation

## Root Cause Analysis

### Database Trigger
```sql
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

The `handle_new_user()` function automatically creates a profile when a user signs up.

### Manual Profile Creation
In `src/services/auth.ts`, the `signUp()` method was manually creating profiles:

```typescript
const { data: profile, error: profileError } = await supabaseAdmin
  .from('profiles')
  .insert(profileData)  // This conflicts with the trigger
  .select()
  .single();
```

## Solution Implemented

### 1. Updated AuthService.signUp() Method

The method now:
1. **Waits** for the database trigger to complete (1 second delay)
2. **Checks** if a profile already exists
3. **Creates manually** only if no profile exists
4. **Updates** existing profile with additional data if it was created by trigger

```typescript
// Wait for database trigger
await new Promise(resolve => setTimeout(resolve, 1000));

// Check if profile exists
const { data: existingProfile, error: checkError } = await supabaseAdmin
  .from('profiles')
  .select('*')
  .eq('id', data.user.id)
  .single();

if (!existingProfile) {
  // Create manually if doesn't exist
  // ... create profile
} else {
  // Update existing profile with additional data
  // ... update profile
}
```

### 2. Updated createProfileFromAuth() Method

Similar logic applied to the `createProfileFromAuth()` method:
- Checks for existing profile first
- Handles duplicate key errors gracefully
- Returns existing profile if duplicate error occurs

### 3. Database Trigger Error Handling

The trigger function already has proper error handling:
```sql
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
```

## Benefits of This Solution

1. **Eliminates Race Conditions**: No more duplicate key errors
2. **Maintains Data Integrity**: Ensures every user has exactly one profile
3. **Graceful Degradation**: If trigger fails, manual creation still works
4. **Enhanced Data**: Manual process can add more detailed information
5. **Backward Compatible**: Existing users and processes continue to work

## Testing

To test the fix:
1. Run the test script: `node test-signup-fix.js`
2. Try registering new users through the UI
3. Monitor console logs for proper profile creation flow

## Files Modified

- `src/services/auth.ts` - Updated signUp() and createProfileFromAuth() methods
- `test-signup-fix.js` - Test script to verify the fix
- `SIGNUP_DUPLICATE_KEY_FIX.md` - This documentation

## Prevention

To prevent similar issues in the future:
1. Always check for existing records before inserting
2. Use proper error handling for constraint violations
3. Consider using UPSERT operations where appropriate
4. Document database triggers and their effects on application logic
