import React from 'react';
import { motion } from 'framer-motion';
import { useSupabaseApp } from '../../context/SupabaseContext';
import { DataTable } from '../../components/ui/DataTable';
import { User } from '../../types';

export function ManageStudents() {
  const { state } = useSupabaseApp();
  const students = state.users.filter(u => u.role === 'student').slice(0, 10); // Mock student list

  const columns = [
    { 
      accessor: 'name', 
      header: 'Name',
      render: (user: User) => (
        <div className="flex items-center space-x-3">
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
          <span>{user.name}</span>
        </div>
      )
    },
    { accessor: 'email', header: 'Email' },
    { 
      accessor: 'joinDate', 
      header: 'Join Date',
      render: (user: User) => new Date(user.joinDate).toLocaleDateString()
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          My Students
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          View students enrolled in your courses.
        </p>
      </motion.div>
      <DataTable columns={columns} data={students} />
    </div>
  );
}
