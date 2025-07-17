import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useSupabaseApp } from '../../context/SupabaseContext';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { UserForm } from '../../components/forms/UserForm';
import { User } from '../../types';

export function ManageUsers() {
  const { state, deleteUser } = useSupabaseApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const handleAddNew = () => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = useCallback(async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }, [deleteUser]);

  const columns = useMemo(() => [
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
    { accessor: 'role', header: 'Role' },
    { 
      accessor: 'joinDate', 
      header: 'Join Date',
      render: (user: User) => new Date(user.joinDate).toLocaleDateString()
    },
    {
      accessor: 'actions',
      header: 'Actions',
      render: (user: User) => (
        <div className="flex space-x-2">
          <button onClick={() => handleEdit(user)} className="neomorph-button p-2 rounded-lg"><Edit size={16} /></button>
          <button onClick={() => handleDelete(user.id)} className="neomorph-button p-2 rounded-lg text-red-500"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ], [handleDelete]);

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Manage Users
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Add, edit, or delete users.
          </p>
        </div>
        <button onClick={handleAddNew} className="neomorph-button px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105 transition-transform flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add New User</span>
        </button>
      </motion.div>

      <DataTable columns={columns} data={state.users} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedUser ? 'Edit User' : 'Add New User'}>
        <UserForm onClose={() => setIsModalOpen(false)} user={selectedUser} />
      </Modal>
    </div>
  );
}
