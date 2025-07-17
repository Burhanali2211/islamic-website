import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '../../types';
import { useSupabaseApp } from '../../context/SupabaseContext';

const userSchema = z.object({
  full_name: z.string().min(3, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['student', 'teacher', 'admin']),
  phone: z.string().optional(),
  class_level: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  onClose: () => void;
  user?: User;
}

export function UserForm({ onClose, user }: UserFormProps) {
  const { createUser, updateUser } = useSupabaseApp();
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      full_name: user?.full_name || user?.name || '',
      email: user?.email || '',
      role: user?.role || 'student',
      phone: user?.phone || '',
      class_level: user?.class_level || '',
    },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      if (user) {
        // Update existing user
        const updatedUserData = {
          full_name: data.full_name,
          email: data.email,
          role: data.role,
          phone: data.phone,
          class_level: data.class_level,
        };
        await updateUser(user.id, updatedUserData);
      } else {
        // Create new user - the service will handle ID generation and defaults
        const newUserData = {
          full_name: data.full_name,
          email: data.email,
          role: data.role,
          phone: data.phone,
          class_level: data.class_level,
          is_active: true,
        };
        await createUser(newUserData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input {...register('full_name')} className="w-full glass-input p-3 rounded-lg" />
        {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input {...register('email')} type="email" className="w-full glass-input p-3 rounded-lg" />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <select {...register('role')} className="w-full glass-input p-3 rounded-lg">
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone (Optional)</label>
        <input {...register('phone')} type="tel" className="w-full glass-input p-3 rounded-lg" />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Class Level (Optional)</label>
        <input {...register('class_level')} className="w-full glass-input p-3 rounded-lg" placeholder="e.g., Grade 10, Senior Teacher" />
        {errors.class_level && <p className="text-red-500 text-sm mt-1">{errors.class_level.message}</p>}
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onClose} className="neomorph-button px-6 py-2 rounded-lg">Cancel</button>
        <button type="submit" className="neomorph-button px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white">
          {user ? 'Update User' : 'Add User'}
        </button>
      </div>
    </form>
  );
}
