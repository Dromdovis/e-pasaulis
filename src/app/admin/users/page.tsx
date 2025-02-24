'use client';

import { useEffect, useState } from 'react';
import { AuthService } from '@/lib/auth';
import type { AuthModel } from '@/types/auth';
import DataTable from '@/components/admin/DataTable';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/db';

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();
  const [users, setUsers] = useState<AuthModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<{
    role?: UserRole;
    verified?: boolean;
  }>({});

  // Filter users based on active filters
  const filteredUsers = users.filter(user => {
    if (activeFilters.role && user.role !== activeFilters.role) {
      return false;
    }
    if (activeFilters.verified !== undefined && user.verified !== activeFilters.verified) {
      return false;
    }
    return true;
  });

  const handleFilterChange = (
    key: keyof typeof activeFilters,
    value: typeof activeFilters[keyof typeof activeFilters]
  ) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const removeFilter = (key: keyof typeof activeFilters) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  useEffect(() => {
    // Check authentication and role
    if (isInitialized && !isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      
      if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN)) {
        router.push('/');
        return;
      }
    }
  }, [isInitialized, isLoading, isAuthenticated, user, router]);

  const fetchUsers = async () => {
    try {
      setError(null);
      const usersList = await AuthService.getAllUsers();
      setUsers(usersList);
    } catch (err) {
      console.error('Error fetching users:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to fetch users');
      } else {
        setError('Failed to fetch users');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user && (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN)) {
      fetchUsers();
    }
  }, [isAuthenticated, user]);

  const handleEditUser = async (user: AuthModel) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleDeleteUser = async (userToDelete: AuthModel) => {
    try {
      // Only allow deletion if:
      // 1. Current user is super_admin, or
      // 2. Current user is admin and target user is not an admin/super_admin
      if (user?.role !== UserRole.SUPER_ADMIN && 
          (userToDelete.role === UserRole.ADMIN || userToDelete.role === UserRole.SUPER_ADMIN)) {
        setError('Only super admins can delete admin users');
        return;
      }

      // Show confirmation dialog
      if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
      }

      await pb.collection('users').delete(userToDelete.id, {
        requestKey: null
      });
      
      // Refresh the users list
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
    }
  };

  const columns = [
    { key: 'name' as keyof AuthModel, label: 'Name', sortable: true },
    { key: 'email' as keyof AuthModel, label: 'Email', sortable: true },
    {
      key: 'role' as keyof AuthModel,
      label: 'Role',
      sortable: true,
      render: (value: AuthModel[keyof AuthModel]) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === UserRole.SUPER_ADMIN
            ? 'bg-purple-100 text-purple-800'
            : value === UserRole.ADMIN
            ? 'bg-blue-100 text-blue-800'
            : 'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'created' as keyof AuthModel,
      label: 'Created',
      sortable: true,
      render: (value: AuthModel[keyof AuthModel]) =>
        new Date(value as string).toLocaleDateString(),
    },
  ];

  // Show loading state
  if (loading || isLoading || !isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={activeFilters.role || ''}
              onChange={(e) => handleFilterChange('role', e.target.value ? e.target.value as UserRole : undefined)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">All Roles</option>
              <option value={UserRole.USER}>User</option>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Verified</label>
            <select
              value={activeFilters.verified === undefined ? '' : activeFilters.verified.toString()}
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange('verified', value === '' ? undefined : value === 'true');
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.role && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Role: {activeFilters.role}
                <button
                  onClick={() => removeFilter('role')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            )}
            {activeFilters.verified !== undefined && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {activeFilters.verified ? 'Verified' : 'Not Verified'}
                <button
                  onClick={() => removeFilter('verified')}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <DataTable
        data={filteredUsers}
        columns={columns}
        searchable={true}
        searchKeys={['name', 'email', 'role']}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
} 