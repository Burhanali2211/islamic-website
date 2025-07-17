-- Verify and Fix RLS Policies for IDARAH WALI UL ASER Islamic Library
-- Run this script to ensure all RLS policies are working correctly

-- ============================================================================
-- VERIFY CURRENT RLS STATUS
-- ============================================================================

-- Check which tables have RLS enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    hasrls
FROM pg_tables 
LEFT JOIN pg_class ON pg_class.relname = pg_tables.tablename
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check existing policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- FIX AUTHENTICATION HELPER FUNCTIONS
-- ============================================================================

-- Ensure auth helper functions work correctly
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN auth.uid();
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$;

-- Enhanced role checking function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    user_role TEXT;
    current_user_id UUID;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RETURN 'anonymous';
    END IF;
    
    -- Try to get role from profiles table first
    SELECT role INTO user_role
    FROM public.profiles
    WHERE id = current_user_id;
    
    IF user_role IS NOT NULL THEN
        RETURN user_role;
    END IF;
    
    -- Fallback to auth metadata
    BEGIN
        SELECT COALESCE(
            (auth.jwt() -> 'user_metadata' ->> 'role'),
            (auth.jwt() -> 'app_metadata' ->> 'role'),
            'student'
        ) INTO user_role;
        
        RETURN COALESCE(user_role, 'student');
    EXCEPTION
        WHEN OTHERS THEN
            RETURN 'student';
    END;
END;
$$;

-- ============================================================================
-- PROFILES TABLE POLICIES (CRITICAL FOR AUTH)
-- ============================================================================

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Teachers can view student profiles" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users during signup" ON profiles;

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile (highest priority)
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (
    auth.uid() = id
);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (
    auth.uid() = id
) WITH CHECK (
    auth.uid() = id
);

-- Allow profile creation during signup (must be first for new users)
CREATE POLICY "Enable insert for authenticated users during signup" ON profiles
FOR INSERT WITH CHECK (
    auth.uid() = id AND auth.uid() IS NOT NULL
);

-- Admin can view all profiles (separate policy to avoid conflicts)
CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- Admin can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- Admin can insert profiles for others
CREATE POLICY "Admins can insert profiles" ON profiles
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- Teachers can view student profiles (avoid function dependency issues)
CREATE POLICY "Teachers can view student profiles" ON profiles
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'teacher')
    ) AND (
        role = 'student' OR id = auth.uid()
    )
);

-- ============================================================================
-- BOOKS TABLE POLICIES
-- ============================================================================

-- Enable RLS on books table first
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view books" ON books;
DROP POLICY IF EXISTS "Authenticated users can view books" ON books;
DROP POLICY IF EXISTS "Admins can manage books" ON books;
DROP POLICY IF EXISTS "Teachers can view books" ON books;

-- Books are viewable by all authenticated users
CREATE POLICY "Authenticated users can view books" ON books
FOR SELECT USING (
    auth.uid() IS NOT NULL
);

-- Admins can insert books
CREATE POLICY "Admins can insert books" ON books
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- Admins can update books
CREATE POLICY "Admins can update books" ON books
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- Admins can delete books
CREATE POLICY "Admins can delete books" ON books
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- ============================================================================
-- BORROWING RECORDS POLICIES
-- ============================================================================

-- Enable RLS on borrowing_records table
ALTER TABLE borrowing_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own borrowing records" ON borrowing_records;
DROP POLICY IF EXISTS "Admins can view all borrowing records" ON borrowing_records;
DROP POLICY IF EXISTS "Admins can manage all borrowing records" ON borrowing_records;
DROP POLICY IF EXISTS "Teachers can view student borrowing records" ON borrowing_records;
DROP POLICY IF EXISTS "Users can create borrowing records" ON borrowing_records;

-- Users can view their own borrowing records
CREATE POLICY "Users can view own borrowing records" ON borrowing_records
FOR SELECT USING (
    user_id = auth.uid()
);

-- Users can create their own borrowing records
CREATE POLICY "Users can create borrowing records" ON borrowing_records
FOR INSERT WITH CHECK (
    user_id = auth.uid()
);

-- Admins can view all borrowing records
CREATE POLICY "Admins can view all borrowing records" ON borrowing_records
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- Admins can insert borrowing records
CREATE POLICY "Admins can insert borrowing records" ON borrowing_records
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- Admins can update borrowing records
CREATE POLICY "Admins can update borrowing records" ON borrowing_records
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- Teachers can view borrowing records
CREATE POLICY "Teachers can view borrowing records" ON borrowing_records
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'teacher')
    )
);

-- ============================================================================
-- COURSES AND ACADEMIC TABLES POLICIES
-- ============================================================================

-- Enable RLS on courses table
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Drop existing courses policies
DROP POLICY IF EXISTS "Students can view enrolled courses" ON courses;
DROP POLICY IF EXISTS "Teachers can manage their courses" ON courses;
DROP POLICY IF EXISTS "Admins can manage all courses" ON courses;
DROP POLICY IF EXISTS "Teachers can view courses" ON courses;
DROP POLICY IF EXISTS "Students can view courses" ON courses;

-- Students and teachers can view courses
CREATE POLICY "Users can view courses" ON courses
FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('admin', 'teacher')
        ) OR
        EXISTS (
            SELECT 1 FROM course_enrollments
            WHERE course_id = courses.id
            AND student_id = auth.uid()
            AND status = 'active'
        )
    )
);

-- Teachers can insert their own courses
CREATE POLICY "Teachers can insert courses" ON courses
FOR INSERT WITH CHECK (
    teacher_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- Teachers can update their own courses, admins can update all
CREATE POLICY "Teachers can update their courses" ON courses
FOR UPDATE USING (
    teacher_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
) WITH CHECK (
    teacher_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- Enable RLS on course_enrollments table
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

-- Drop existing course enrollment policies
DROP POLICY IF EXISTS "Students can view own enrollments" ON course_enrollments;
DROP POLICY IF EXISTS "Teachers can manage course enrollments" ON course_enrollments;

-- Students can view their own enrollments
CREATE POLICY "Students can view own enrollments" ON course_enrollments
FOR SELECT USING (
    student_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'teacher')
    )
);

-- Students can enroll themselves
CREATE POLICY "Students can enroll themselves" ON course_enrollments
FOR INSERT WITH CHECK (
    student_id = auth.uid()
);

-- Teachers and admins can manage enrollments
CREATE POLICY "Teachers can manage enrollments" ON course_enrollments
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'teacher')
    )
);

-- ============================================================================
-- ASSIGNMENTS AND QUIZZES POLICIES
-- ============================================================================

-- Enable RLS on assignments table
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Drop existing assignment policies
DROP POLICY IF EXISTS "Students can view published assignments" ON assignments;
DROP POLICY IF EXISTS "Teachers can manage their assignments" ON assignments;

-- Students can view published assignments they're enrolled in
CREATE POLICY "Students can view published assignments" ON assignments
FOR SELECT USING (
    (is_published = true AND EXISTS (
        SELECT 1 FROM course_enrollments
        WHERE course_id = assignments.course_id
        AND student_id = auth.uid()
        AND status = 'active'
    )) OR
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'teacher')
    )
);

-- Teachers can insert assignments for their courses
CREATE POLICY "Teachers can insert assignments" ON assignments
FOR INSERT WITH CHECK (
    teacher_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- Teachers can update their assignments
CREATE POLICY "Teachers can update assignments" ON assignments
FOR UPDATE USING (
    teacher_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
) WITH CHECK (
    teacher_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- Enable RLS on assignment_submissions table
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing submission policies
DROP POLICY IF EXISTS "Students can manage own submissions" ON assignment_submissions;
DROP POLICY IF EXISTS "Teachers can view and grade submissions" ON assignment_submissions;

-- Students can view their own submissions
CREATE POLICY "Students can view own submissions" ON assignment_submissions
FOR SELECT USING (
    student_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'teacher')
    )
);

-- Students can insert their own submissions
CREATE POLICY "Students can insert submissions" ON assignment_submissions
FOR INSERT WITH CHECK (
    student_id = auth.uid()
);

-- Students can update their own submissions (before grading)
CREATE POLICY "Students can update own submissions" ON assignment_submissions
FOR UPDATE USING (
    student_id = auth.uid() AND status IN ('draft', 'submitted')
) WITH CHECK (
    student_id = auth.uid()
);

-- Teachers can update submissions for grading
CREATE POLICY "Teachers can grade submissions" ON assignment_submissions
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'teacher')
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'teacher')
    )
);

-- ============================================================================
-- QUIZZES POLICIES
-- ============================================================================

-- Enable RLS on quizzes table
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- Drop existing quiz policies
DROP POLICY IF EXISTS "Students can view published quizzes" ON quizzes;
DROP POLICY IF EXISTS "Teachers can manage quizzes" ON quizzes;

-- Students can view published quizzes
CREATE POLICY "Students can view published quizzes" ON quizzes
FOR SELECT USING (
    (is_published = true AND (
        course_id IS NULL OR
        EXISTS (
            SELECT 1 FROM course_enrollments
            WHERE course_id = quizzes.course_id
            AND student_id = auth.uid()
            AND status = 'active'
        )
    )) OR
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'teacher')
    )
);

-- Teachers can manage quizzes
CREATE POLICY "Teachers can manage quizzes" ON quizzes
FOR ALL USING (
    teacher_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- Enable RLS on quiz_attempts table
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Students can manage their own quiz attempts
CREATE POLICY "Students can manage quiz attempts" ON quiz_attempts
FOR ALL USING (
    student_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'teacher')
    )
);

-- ============================================================================
-- CATEGORIES POLICIES
-- ============================================================================

-- Enable RLS on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Everyone can view categories
CREATE POLICY "Everyone can view categories" ON categories
FOR SELECT USING (
    auth.uid() IS NOT NULL
);

-- Only admins can manage categories
CREATE POLICY "Admins can manage categories" ON categories
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- ============================================================================
-- NOTIFICATIONS POLICIES
-- ============================================================================

-- Enable RLS on notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing notification policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can manage all notifications" ON notifications;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
FOR SELECT USING (
    user_id = auth.uid()
);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON notifications
FOR UPDATE USING (
    user_id = auth.uid()
) WITH CHECK (
    user_id = auth.uid()
);

-- Admins can manage all notifications
CREATE POLICY "Admins can insert notifications" ON notifications
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

CREATE POLICY "Admins can view all notifications" ON notifications
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

CREATE POLICY "Admins can update all notifications" ON notifications
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- ============================================================================
-- VERIFY POLICIES ARE WORKING
-- ============================================================================

-- Test function to verify RLS is working
CREATE OR REPLACE FUNCTION public.test_rls_policies()
RETURNS TABLE (
    table_name TEXT,
    policy_test TEXT,
    result TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- This function can be used to test if RLS policies are working correctly
    -- Run as different user roles to verify access controls
    
    RETURN QUERY
    SELECT 
        'profiles'::TEXT as table_name,
        'Can access own profile'::TEXT as policy_test,
        CASE 
            WHEN EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()) 
            THEN 'PASS'::TEXT 
            ELSE 'FAIL'::TEXT 
        END as result;
        
    RETURN QUERY
    SELECT 
        'books'::TEXT as table_name,
        'Can view books'::TEXT as policy_test,
        CASE 
            WHEN EXISTS (SELECT 1 FROM books LIMIT 1) 
            THEN 'PASS'::TEXT 
            ELSE 'FAIL'::TEXT 
        END as result;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
