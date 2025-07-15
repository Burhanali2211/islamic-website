import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '../../types';
import { useApp } from '../../context/AppContext';
import { faker } from '@faker-js/faker';

const userSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['user', 'teacher', 'admin']),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  onClose: () => void;
  user?: User;
}

export function UserForm({ onClose, user }: UserFormProps) {
  const { dispatch } = useApp();
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'user',
    },
  });

  const onSubmit = (data: UserFormData) => {
    if (user) {
      const updatedUser: User = { ...user, ...data };
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    } else {
      const newUser: User = {
        id: faker.string.uuid(),
        ...data,
        avatar: `https://i.pravatar.cc/150?u=${faker.string.uuid()}`,
        joinDate: new Date().toISOString(),
        bookmarks: [],
        recentReads: [],
      };
      dispatch({ type: 'ADD_USER', payload: newUser });
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input {...register('name')} className="w-full glass-input p-3 rounded-lg" />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input {...register('email')} className="w-full glass-input p-3 rounded-lg" />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <select {...register('role')} className="w-full glass-input p-3 rounded-lg">
          <option value="user">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
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
