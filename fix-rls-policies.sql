-- Fix RLS policies to avoid infinite recursion
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;

-- Create helper functions that don't cause recursion
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'user_metadata' ->> 'role'),
    (auth.jwt() ->> 'app_metadata' ->> 'role'),
    'student'
  );
$$;

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id 
    AND (
      raw_user_meta_data ->> 'role' = 'admin' OR
      raw_app_meta_data ->> 'role' = 'admin'
    )
  );
$$;

-- Function to check if current user is teacher or admin
CREATE OR REPLACE FUNCTION is_teacher_or_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id 
    AND (
      raw_user_meta_data ->> 'role' IN ('admin', 'teacher') OR
      raw_app_meta_data ->> 'role' IN ('admin', 'teacher')
    )
  );
$$;

-- Function to check if current user is teacher
CREATE OR REPLACE FUNCTION is_teacher(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id 
    AND (
      raw_user_meta_data ->> 'role' = 'teacher' OR
      raw_app_meta_data ->> 'role' = 'teacher'
    )
  );
$$;

-- Create new RLS policies using the helper functions
CREATE POLICY "Admins can view all profiles" ON profiles 
FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all profiles" ON profiles 
FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can insert profiles" ON profiles 
FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can delete profiles" ON profiles 
FOR DELETE USING (is_admin());

-- Also allow teachers to view profiles for their classes
CREATE POLICY "Teachers can view student profiles" ON profiles 
FOR SELECT USING (is_teacher_or_admin() AND role = 'student');
