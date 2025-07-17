-- Create Admin User Script for Supabase
-- This script creates an admin user profile in the profiles table
-- Note: You'll need to create the actual auth user through Supabase Auth first

-- First, let's make sure the profiles table exists with the correct structure
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    name_arabic TEXT,
    avatar_url TEXT,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female')),
    role TEXT DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
    
    -- Student-specific fields
    guardian_name TEXT,
    guardian_phone TEXT,
    student_id TEXT UNIQUE,
    class_level TEXT,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    
    -- System fields
    is_active BOOLEAN DEFAULT true,
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('ar', 'en', 'ur', 'fa', 'tr')),
    bookmarks TEXT[] DEFAULT '{}',
    recent_reads TEXT[] DEFAULT '{}',
    total_books_borrowed INTEGER DEFAULT 0,
    current_borrowed_count INTEGER DEFAULT 0,
    max_borrow_limit INTEGER DEFAULT 5,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
CREATE POLICY "Admins can insert profiles" ON profiles FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ) OR NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'admin')
);

-- Function to create admin user profile
-- This function should be called after creating the auth user
CREATE OR REPLACE FUNCTION create_admin_profile(
    user_id UUID,
    user_email TEXT,
    admin_name TEXT DEFAULT 'Admin User',
    admin_name_arabic TEXT DEFAULT 'مدير النظام'
)
RETURNS UUID AS $$
DECLARE
    profile_id UUID;
BEGIN
    -- Insert admin profile
    INSERT INTO profiles (
        id,
        email,
        full_name,
        name_arabic,
        role,
        is_active,
        preferred_language,
        max_borrow_limit,
        created_at,
        updated_at
    ) VALUES (
        user_id,
        user_email,
        admin_name,
        admin_name_arabic,
        'admin',
        true,
        'en',
        999, -- Unlimited borrowing for admin
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        is_active = true,
        max_borrow_limit = 999,
        updated_at = NOW()
    RETURNING id INTO profile_id;
    
    RETURN profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Instructions for creating admin user:
-- 1. First create an auth user through Supabase Auth UI or API
-- 2. Then call this function with the user's UUID and email:
-- SELECT create_admin_profile(
--     'USER_UUID_HERE'::UUID, 
--     'admin@example.com', 
--     'Admin Name', 
--     'اسم المدير'
-- );

-- Example: Uncomment and modify the following line with actual values
-- SELECT create_admin_profile(
--     '00000000-0000-0000-0000-000000000000'::UUID,
--     'admin@idarah.com',
--     'IDARAH Admin',
--     'مدير إدارة ولي العصر'
-- );
