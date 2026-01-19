'use client';

import React, { useState, useEffect } from 'react';
import UserRow from '@/components/settingsComponents/UserRow';
import Pagination from '../Pagination/Pagination';
import { useAuth } from '@/app/hooks/useAuth';
import { RefreshCw } from 'lucide-react';

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: 'Active' | 'Inactive';
  username?: string;
}

// Simple Role type for UserTable dropdown only
interface UserTableRole {
  id: string;
  name: string;
}

// Props
interface UserTableProps {
  users?: User[];
  newRole?: UserTableRole | null;
  deletedRoleId?: string | null; // Add deleted role ID prop
}

const UserTable: React.FC<UserTableProps> = ({ 
  users: initialUsers = [], 
  newRole,
  deletedRoleId 
}) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [roles, setRoles] = useState<UserTableRole[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { accessToken, BASE_URL } = useAuth();

  // Effect to add new role to roles list when it's provided
  useEffect(() => {
    if (newRole && !roles.some(role => role.id === newRole.id)) {
      console.log('Adding new role to UserTable dropdown:', newRole);
      setRoles(prevRoles => [...prevRoles, newRole]);
      
      // Auto-select the new role if modal is open
      if (isModalOpen) {
        setSelectedRoleId(newRole.id);
        console.log('Auto-selecting new role in modal:', newRole.name);
      }
    }
  }, [newRole, roles, isModalOpen]);

  // Effect to remove deleted role from dropdown
  useEffect(() => {
    if (deletedRoleId) {
      console.log('Removing deleted role from dropdown:', deletedRoleId);
      setRoles(prevRoles => prevRoles.filter(role => role.id !== deletedRoleId));
      
      // Clear selected role if it matches the deleted role
      if (selectedRoleId === deletedRoleId) {
        setSelectedRoleId('');
        console.log('Cleared selected role as it was deleted');
      }
    }
  }, [deletedRoleId, selectedRoleId]);

  // Modal handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    resetFormFields();
  };

  const resetFormFields = () => {
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setEmail('');
    setUsername('');
    setSelectedRoleId('');
  };

 

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/org/admin/users/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();

      const mappedUsers: User[] = (data.results || []).map((user: any) => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role,
        lastLogin: new Date(user.date_joined).toLocaleString(),
        status: user.is_active ? 'Active' : 'Inactive',
        username: user.username,
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Roles
  const fetchRoles = async () => {
    try {
      const response = await fetch(`${BASE_URL}/org/all/roles/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch roles');
      const data = await response.json();

      console.log('Roles API response:', data);

      const formattedRoles: UserTableRole[] = (data.data || []).map((role: any) => ({
        id: role.role_id?.toString() || role.id?.toString() || '',
        name: role.name.charAt(0).toUpperCase() + role.name.slice(1).toLowerCase(),
      }));

      console.log('Formatted roles for dropdown:', formattedRoles);
      setRoles(formattedRoles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    fetchUsers();
    fetchRoles();
  }, [accessToken]);

  // Create User
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId) {
      alert('Please select a role');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/org/admin/users/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email,
          username,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          role: selectedRoleId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to create user.');
        return;
      }

      alert('User created successfully!');
      closeModal();
      await fetchUsers(); // Refresh users list
    } catch (error) {
      alert('Network error while creating user.');
    } finally {
      setIsLoading(false);
    }
  };

  // Edit User
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    const nameParts = user.name.split(' ');
    setFirstName(nameParts[0]);
    setLastName(nameParts.slice(1).join(' '));
    setEmail(user.email);
    setUsername(user.username || '');

    // Safe lookup of role
    const userRole = roles.find(
      (r) => r.name?.toLowerCase() === user.role?.toLowerCase()
    );
    setSelectedRoleId(userRole?.id?.toString() || '');

    openModal();
  };

  // Update User
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/org/admin/users/${selectedUser.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email,
          username,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          role: selectedRoleId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to update user.');
        return;
      }

      alert('User updated successfully!');
      closeModal();
      await fetchUsers(); // Refresh users list
    } catch (error) {
      alert('Network error while updating user.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete User
  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/org/admin/users/${userId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || 'Failed to delete user.');
        return;
      }

      alert('User deleted successfully!');
      await fetchUsers();
    } catch (error) {
      alert('Network error while deleting user.');
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const pagedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white shadow rounded-lg p-4 overflow-x-auto relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-[20px] sm:text-[24px] text-black">
          User
        </h2>
        <div className="flex gap-2">
          <button
            className="bg-[#E95D28] text-white px-3 py-2 rounded-md disabled:opacity-50"
            onClick={openModal}
            disabled={isLoading}
          >
            + Add New User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#FDF2EE] overflow-x-auto">
        <table className="min-w-[900px] w-full table-auto text-left border-collapse">
          <thead className="border-b border-gray-400 text-black text-sm">
            <tr>
              <th className="p-2 text-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer"
                  checked={selectAll}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectAll(checked);
                    setSelectedUsers(checked ? users.map((u) => u.id) : []);
                  }}
                />
              </th>
              <th className="p-2 min-w-[150px]">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2 min-w-[200px]">Date/Time Created</th>
              <th className="p-2">Status</th>
              <th className="p-2">Edit</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pagedUsers.length > 0 ? (
              pagedUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={() => { }}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-4">
                  {isLoading ? 'Loading users...' : 'No users found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div> */}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg text-[#E95D28] font-semibold mb-4">
              {selectedUser ? 'Edit User' : 'Add New User'}
            </h3>

            <form onSubmit={selectedUser ? handleUpdate : handleSubmit}>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2 rounded border placeholder-gray-400 text-black border-gray-400"
                    required
                  />

                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2 rounded border border-gray-400 placeholder-gray-400 text-black"
                    required
                  />
                </div>

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2 rounded border border-gray-400 placeholder-gray-400 text-black"
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded border border-gray-400 placeholder-gray-400 text-black"
                  required
                />

                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 rounded border border-gray-400 placeholder-gray-400 text-black"
                  required
                />

                <div>
                  <label className="block text-sm text-[#E95D28] mb-1">
                    Select Role ({roles.length} available)
                    {newRole && (
                      <span className="text-green-600 text-xs ml-2">
                        • New role added!
                      </span>
                    )}
                    {deletedRoleId && (
                      <span className="text-red-600 text-xs ml-2">
                        • Role removed!
                      </span>
                    )}
                  </label>
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="w-full p-2 rounded border border-gray-400"
                    required
                  >
                   <option value="" className="text-black">-- Select Role --</option>
                    {roles.length > 0 ? (
                      roles.map((r) => (
                        <option key={r.id} className='text-black' value={r.id
                        }> 
                          {r.name}
                        </option>
                      ))
                    ) : (
                      <option disabled className='text-red-500'>No roles available</option>
                    )}
                  </select>
                </div>

                <div className="flex justify-between gap-4 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-[#E95D28] text-[#E95D28] rounded w-full"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#E95D28] text-white rounded w-full"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? 'Processing...'
                      : selectedUser
                        ? 'Update User'
                        : 'Add New User'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;