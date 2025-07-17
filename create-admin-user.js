// Script to create an admin user for IDARAH WALI UL ASER Islamic Library
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bxyzvaujvhumupwdmysh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4eXp2YXVqdmh1bXVwd2RteXNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjcxMjc5OCwiZXhwIjoyMDY4Mjg4Nzk4fQ.VABQbqQOcmqih7Z7jB-O43-xSCvckNBPyXYJ6doirzU';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  console.log('🔐 Creating admin user for IDARAH WALI UL ASER Islamic Library...');
  
  // Admin user details
  const adminEmail = 'admin@idarah-wali-ul-asr.org';
  const adminPassword = 'Admin@123456'; // Change this to a secure password
  const adminData = {
    email: adminEmail,
    password: adminPassword,
    user_metadata: {
      full_name: 'System Administrator',
      name_arabic: 'مدير النظام',
      role: 'admin'
    }
  };
  
  try {
    console.log('1. Creating admin user in auth.users...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminData.email,
      password: adminData.password,
      user_metadata: adminData.user_metadata,
      email_confirm: true // Auto-confirm email
    });
    
    if (authError) {
      console.error('❌ Error creating admin user:', authError);
      return;
    }
    
    console.log('✅ Admin user created in auth:', authData.user.id);
    
    // Wait for trigger to create profile
    console.log('2. Waiting for profile creation...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if profile was created by trigger
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (profileError && profileError.code === 'PGRST116') {
      // Profile doesn't exist, create it manually
      console.log('3. Creating admin profile manually...');
      const { data: newProfile, error: createError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: adminData.email,
          full_name: adminData.user_metadata.full_name,
          name_arabic: adminData.user_metadata.name_arabic,
          role: 'admin',
          is_active: true,
          preferred_language: 'en',
          max_borrow_limit: 50,
          enrollment_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();
      
      if (createError) {
        console.error('❌ Error creating admin profile:', createError);
        return;
      }
      
      console.log('✅ Admin profile created:', newProfile.id);
    } else if (profileError) {
      console.error('❌ Error checking profile:', profileError);
      return;
    } else {
      // Profile exists, update it to ensure admin role
      console.log('3. Updating existing profile to admin...');
      const { data: updatedProfile, error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          role: 'admin',
          full_name: adminData.user_metadata.full_name,
          name_arabic: adminData.user_metadata.name_arabic,
          max_borrow_limit: 50,
          is_active: true
        })
        .eq('id', authData.user.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('❌ Error updating profile to admin:', updateError);
        return;
      }
      
      console.log('✅ Profile updated to admin:', updatedProfile.id);
    }
    
    console.log('\n🎉 Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Role: admin');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    console.log('🌐 Login at: http://localhost:5173/login');
    
  } catch (error) {
    console.error('💥 Error creating admin user:', error);
  }
}

// Run the script
createAdminUser();
