'use client';

import Image from 'next/image';
import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import PasswordRequirements from '@/components/PasswordRequirements';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const SignupForm: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { BASE_URL } = useAuth(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);

  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone_number: '',
    password: '',
    password2: '',
    agreement: false,
    organization: {
      name: '',
      job_title: '',
      sector: '',
      state: '',
      country: '',
    },
  });

  const requirements = useMemo(
    () => [
      { label: 'At least 8 characters', valid: formData.password.length >= 8 },
      { label: '1 uppercase letter (A-Z)', valid: /[A-Z]/.test(formData.password) },
      { label: '1 number', valid: /\d/.test(formData.password) },
      { label: '1 special character (!@#$%^&*)', valid: /[!@#$%^&*]/.test(formData.password) },
    ],
    [formData.password]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('org_')) {
      const key = name.replace('org_', '');
      setFormData((prev) => ({
        ...prev,
        organization: { ...prev.organization, [key]: value },
      }));
      setErrors((prev: any) => ({ ...prev, [name]: false }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setErrors((prev: any) => ({ ...prev, [name]: false }));
  };

  const handleNext = () => {
    const {
      first_name,
      last_name,
      username,
      email,
      phone_number,
      password,
      password2,
    } = formData;

    let newErrors: any = {};

    if (!first_name) newErrors.first_name = true;
    if (!last_name) newErrors.last_name = true;
    if (!username) newErrors.username = true;
    if (!email) newErrors.email = true;
    if (!phone_number) newErrors.phone_number = true;
    if (!password) newErrors.password = true;
    if (!password2) newErrors.password2 = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill all required fields.');
      return;
    }

    if (password !== password2) {
      toast.error('Passwords do not match.');
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let newErrors: any = {};

    if (!formData.organization.name) newErrors.org_name = true;
    if (!formData.organization.job_title) newErrors.org_job_title = true;
    if (!formData.organization.sector) newErrors.org_sector = true;
    if (!formData.organization.state) newErrors.org_state = true;
    if (!formData.organization.country) newErrors.org_country = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required organization fields.");
      return;
    }

    if (!formData.agreement) {
      toast.error('You must agree to the terms.');
      return;
    }

    const passwordValid = requirements.every((r) => r.valid);
    if (!passwordValid) {
      toast.error('Password does not meet all requirements.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          if (data.errors.detail?.includes('phone_number')) {
            toast.error('Phone number already exists.');
          } else {
            Object.values(data.errors).forEach((errorItem: any) => {
              if (Array.isArray(errorItem)) {
                errorItem.forEach((msg) => toast.error(msg));
              } else if (typeof errorItem === 'object') {
                Object.values(errorItem).forEach((nested: any) => {
                  nested.forEach((msg: string) => toast.error(msg));
                });
              }
            });
          }
        } else {
          toast.error(data.message || 'Registration failed');
        }
        setLoading(false);
        return;
      }

      if (
        data?.message === 'Activation email sent' ||
        data?.detail === 'Activation email sent'
      ) {
        toast.success('Check your email to activate your account.');
        router.push(`/auth/email-sent?email=${encodeURIComponent(formData.email)}`);
        return;
      }

      toast.success('Registration successful!');
      router.push(`/auth/email-sent?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center bg-gray-100 min-h-screen">
      <Image
        src="/images/imag.png"
        alt="Background"
        fill
        className="absolute inset-0 object-cover"
      />

      <div className="relative bg-white rounded-lg shadow-lg p-10 max-w-2xl w-[827px] z-10 my-8">
        <h2 className="text-2xl font-bold mb-2">
          {step === 1 ? 'Create an account' : 'Organization Details'}
        </h2>

        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mb-4 flex items-center text-sm text-orange-500"
          >
            <ArrowLeft size={18} className="mr-1" /> Go Back
          </button>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              {/* FIRST NAME / LAST NAME */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-black">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="first_name"
                    placeholder="First name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                      errors.first_name ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">First name is required</p>
                  )}
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-black">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="last_name"
                    placeholder="Last name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                      errors.last_name ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1">Last name is required</p>
                  )}
                </div>
              </div>

              {/* USERNAME */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-black">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded-md ${
                    errors.username ? 'border-red-500' : ''
                  }`}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">Username is required</p>
                )}
              </div>

              {/* EMAIL */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-black">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded-md ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">Email is required</p>
                )}
              </div>

              {/* PHONE */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-black">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  name="phone_number"
                  placeholder="Phone"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded-md ${
                    errors.phone_number ? 'border-red-500' : ''
                  }`}
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-xs mt-1">Phone number is required</p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <label className="block text-sm font-medium text-black">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setShowRequirements(true)}
                  onBlur={() => setShowRequirements(false)}
                  className={`w-full border px-3 py-2 pr-10 rounded-md ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">Password is required</p>
                )}

                {showRequirements && (
                  <PasswordRequirements password={formData.password} />
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative">
                <label className="block text-sm font-medium text-black">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  name="password2"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={formData.password2}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 pr-10 rounded-md ${
                    errors.password2 ? 'border-red-500' : ''
                  }`}
                />

                <button
                  type="button"
                  className="absolute right-3 top-8 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                {errors.password2 && (
                  <p className="text-red-500 text-xs mt-1">
                    Confirm Password is required
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-orange-500 text-white py-2 rounded-full font-semibold hover:bg-orange-600"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {/* ORG NAME */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-black">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="org_name"
                  placeholder="Organization Name"
                  value={formData.organization.name}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded-md ${
                    errors.org_name ? 'border-red-500' : ''
                  }`}
                />
                {errors.org_name && (
                  <p className="text-red-500 text-xs mt-1">Organization name is required</p>
                )}
              </div>

              {/* JOB TITLE */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-black">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="org_job_title"
                  placeholder="Job Title"
                  value={formData.organization.job_title}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded-md ${
                    errors.org_job_title ? 'border-red-500' : ''
                  }`}
                />
                {errors.org_job_title && (
                  <p className="text-red-500 text-xs mt-1">Job title is required</p>
                )}
              </div>

              {/* SECTOR */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-black">
                  Sector <span className="text-red-500">*</span>
                </label>
                <input
                  name="org_sector"
                  placeholder="Sector"
                  value={formData.organization.sector}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded-md ${
                    errors.org_sector ? 'border-red-500' : ''
                  }`}
                />
                {errors.org_sector && (
                  <p className="text-red-500 text-xs mt-1">Sector is required</p>
                )}
              </div>

              {/* STATE */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-black">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  name="org_state"
                  placeholder="State"
                  value={formData.organization.state}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded-md ${
                    errors.org_state ? 'border-red-500' : ''
                  }`}
                />
                {errors.org_state && (
                  <p className="text-red-500 text-xs mt-1">State is required</p>
                )}
              </div>

              {/* COUNTRY */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-black">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  name="org_country"
                  placeholder="Country"
                  value={formData.organization.country}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded-md ${
                    errors.org_country ? 'border-red-500' : ''
                  }`}
                />
                {errors.org_country && (
                  <p className="text-red-500 text-xs mt-1">Country is required</p>
                )}
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="agreement"
                  checked={formData.agreement}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <span className="text-xs">
                  I agree to the{' '}
                  <span className="text-orange-500">Terms & Conditions</span>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-2 rounded-full font-semibold hover:bg-orange-600"
              >
                {loading ? 'Submitting...' : 'Create Account'}
              </button>
            </>
          )}
        </form>

        <p className="mt-6 text-xs text-black text-center">
          Already have an account?{' '}
          <a href="/login" className="text-orange-500 underline">
            Login now
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
