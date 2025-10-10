"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import PasswordRequirements from '@/components/PasswordRequirements'

const SignupForm: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [showRequirements, setShowRequirements] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // handle form submission logic
    }

    return (
        <div className="relative flex items-center justify-center bg-gray-100 min-h-screen">
            <Image
                src="/images/imag.png"
                alt="Background underground"
                fill
                className="absolute inset-0 object-cover"
                priority
            />

            {/* Form container with top & bottom margin */}
            <div className="relative bg-white rounded-lg shadow-lg p-10 max-w-2xl w-[827px] z-10 my-8">
                <h2 className="text-2xl font-bold mb-2">Create an account</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="firstName" className="block text-sm font-medium text-black">
                                First name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="First name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <label htmlFor="lastName" className="block text-sm font-medium text-black">
                                Last name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-black">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-black">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                onFocus={() => setShowRequirements(true)}
                                onBlur={() => setShowRequirements(false)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-700 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {showRequirements && (
                            <div className="mt-2">
                                <PasswordRequirements password={formData.password} />
                            </div>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
                            Confirm password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Retype password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-700 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            id="agreeTerms"
                            name="agreeTerms"
                            type="checkbox"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                            className="h-4 w-4 text-orange-500 border-gray-300 rounded"
                            required
                        />
                        <label htmlFor="agreeTerms" className="text-xs text-black">
                            I agree to the{' '}
                            <a href="#" className="text-orange-500 hover:underline">
                                Terms & Conditions
                            </a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-full bg-orange-500 py-2 text-white font-semibold hover:bg-orange-600 transition cursor-pointer"
                    >
                        Create account
                    </button>
                </form>

                <p className="mt-6 text-xs text-black">
                    Already have an account?{' '}
                    <a href="/Login" className="text-orange-500 hover:underline">
                        Login now
                    </a>
                </p>
            </div>
        </div>
    )
}

export default SignupForm
