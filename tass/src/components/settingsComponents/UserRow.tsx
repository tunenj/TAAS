import React, { useState } from 'react';
import { Pencil, Trash2 } from "lucide-react";
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: 'Active' | 'Inactive';
  username?: string;
}

interface Props {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onToggleStatus: (userId: string) => void;
}

const UserRow: React.FC<Props> = ({ user, onEdit, onDelete, onToggleStatus }) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  return (
    <>
      <tr className="text-xs sm:text-sm border-b border-gray-300 font-normal text-[13px] sm:text-[14.97px] leading-[20px] sm:leading-[22.45px]">
        <td className="p-2 sm:p-3">
          <input type="checkbox" className="w-4 h-4" />
        </td>
        <td className="p-2 sm:p-3 text-black">{user.name}</td>
        <td className="p-2 sm:p-3 text-black">{user.email}</td>
        <td className="p-2 sm:p-3 text-black">{user.role}</td>
        <td className="p-2 sm:p-3 text-black">{user.lastLogin}</td>
        <td className={`p-2 sm:p-3 font-semibold ${user.status === 'Active' ? 'text-[#08A47B]' : 'text-[#D54467]'}`}>
          {user.status}
        </td>
        <td className="p-2 sm:p-3">
          <button
            className="flex items-center gap-1 text-[#E95D28] border-[#E95D28] border-2 px-2 py-1 sm:px-3 sm:py-1 rounded-xl hover:bg-red-50 text-xs sm:text-sm cursor-pointer"
            onClick={() => onEdit(user)}
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        </td>
        <td className="p-2 sm:p-3 flex gap-2">
          <button
            className="flex items-center gap-1 px-2 sm:px-4 py-1 rounded-xl text-xs sm:text-sm bg-red-500 text-white cursor-pointer"
            onClick={() => setIsDeleteConfirmOpen(true)}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </td>
      </tr>

      {/* Delete Confirmation Modal - MOVED OUTSIDE THE TABLE STRUCTURE */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <h3 className="text-lg text-[#E95D28] font-semibold mb-4">Are you sure you want to delete this user?</h3>
            <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex justify-between gap-4">
              <button
                className="px-4 py-2 rounded-2xl bg-gray-300 text-gray-700 w-full cursor-pointer hover:bg-gray-400 transition-colors"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-2xl bg-[#E95D28] text-white w-full cursor-pointer hover:bg-[#d44a1a] transition-colors"
                onClick={() => {
                  onDelete(user.id);
                  setIsDeleteConfirmOpen(false);
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserRow;