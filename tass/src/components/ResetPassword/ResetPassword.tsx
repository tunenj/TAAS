'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export interface ResetPasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  twoFactorCode: string;
}

export interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
  };
  onSubmit: (data: ResetPasswordFormData) => Promise<void>;
}

export default function ResetPasswordModal({
  isOpen,
  onClose,
  user,
  onSubmit
}: ResetPasswordModalProps) {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    twoFactorCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ResetPasswordFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ResetPasswordFormData> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 12) {
      newErrors.newPassword = 'Password must be at least 12 characters';
    }

    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }

    if (!formData.twoFactorCode) {
      newErrors.twoFactorCode = 'Two-factor code is required';
    } else if (!/^\d{6}$/.test(formData.twoFactorCode)) {
      newErrors.twoFactorCode = 'Must be a 6-digit code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSubmit(formData);
      // Reset form on successful submission
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        twoFactorCode: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Password reset failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ResetPasswordFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      twoFactorCode: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-14 inset-0 flex items-center justify-center p-4 z-50 mt-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full h-[569px] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center ml-2 -mb-6 border-gray-200">
          <h2 className="text-sm font-bold text-gray-900">Reset Password</h2>
          <div className='flex flex-row items-center mr-4'>
            <Image
              src="/icons/secure.png"
              alt=""
              width={16}
              height={16}
              className='mr-2'
            />
            <p className='text-sm text-black'>Secure step</p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-2">
            For {user.name} ({user.email})
          </p>

          {/* Password Tips */}
          <div className="mb-2 bg-[#F97316] rounded-md">
            <div className="flex items-center ml-2">
              <Image
                src="/icons/strong.png"
                alt=""
                width={20}
                height={20}
                className='mr-2'
              />
              <span className="text-sm text-black">
                Use a strong password: 12+ characters, mix of letters, numbers, and symbols.
              </span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange('currentPassword')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="Enter current password"
              />
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange('newPassword')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="Create a new password"
              />
              {errors.newPassword ? (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">Must be at least 12 characters</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm new password
              </label>
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                value={formData.confirmNewPassword}
                onChange={handleInputChange('confirmNewPassword')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="Re-enter new password"
              />
              {errors.confirmNewPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmNewPassword}</p>
              )}
            </div>

            {/* Two-Factor Code */}
            <div>
              <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-700 mb-1">
                Two-factor code
              </label>
              <input
                id="twoFactorCode"
                name="twoFactorCode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={formData.twoFactorCode}
                onChange={handleInputChange('twoFactorCode')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="Enter 6-digit code from your authenticator"
              />
              {errors.twoFactorCode && (
                <p className="mt-1 text-sm text-red-600">{errors.twoFactorCode}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Having trouble? <a href="#" className="font-medium text-orange-600 hover:text-orange-500">Use a backup code.</a>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-1 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 flex-1 py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Image src="/icons/key.png" alt="Loading" width={16} height={16} />
                    Updating...
                  </>
                ) : (
                  <>
                    <Image src="/icons/key.png" alt="Update" width={16} height={16} />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <p className="mt-2 text-center text-sm text-gray-500">
            A confirmation email will be sent after a successful update.
          </p>
        </div>
      </div>
    </div>
  );
}