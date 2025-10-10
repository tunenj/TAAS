"use client"
import Image from 'next/image'
import React, { useState } from 'react'


const passwordChecks = [
    {
        label: 'Minimum 8 characters',
        test: (pw: string) => pw.length >= 8,
    },
    {
        label: '1 UPPERCASE',
        test: (pw: string) => /[A-Z]/.test(pw),
    },
    {
        label: '1 Number',
        test: (pw: string) => /\d/.test(pw),
    },
    {
        label: '1 Special character',
        test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
    },
]

const ResetPasswordForm: React.FC = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // handle reset password submission logic here
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
            <Image
                src="/images/imag.png"
                alt="Background underground"
                fill
                className="absolute inset-0 object-cover"
                priority
            />
            <div className="relative z-10 bg-white p-10 rounded-lg shadow-lg max-w-2xl w-[827px]">
                <h2 className="text-2xl font-bold mb-2">Reset password</h2>
                <p className="text-gray-600 mb-6 text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis morbi pulvinar venenatis non.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-black text-sm mb-1 font-medium">
                            Enter password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                        />
                    </div>

                    <div className="mt-4">
                        <div className="font-semibold text-black mb-2">Requirements</div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                            {passwordChecks.map(({ label, test }) => {
                                const passed = test(password)
                                return (
                                    <div key={label} className="flex items-center gap-1">
                                        <span
                                            className={`h-4 w-4 rounded-full flex items-center justify-center border ${passed ? 'bg-green-200 border-green-400 text-green-600' : 'bg-gray-100 border-gray-300 text-gray-300'
                                                }`}
                                        >
                                            {passed ? (
                                                <svg width="14" height="14" fill="none" viewBox="0 0 20 20">
                                                    <path stroke="currentColor" strokeWidth="2" d="M5 10l4 4 6-7" />
                                                </svg>
                                            ) : (
                                                <span className="block bg-gray-300 rounded-full w-2 h-2" />
                                            )}
                                        </span>
                                        <span className={passed ? 'text-gray-600' : 'text-gray-400'}>{label}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-black text-sm mb-1 font-medium">
                            Confirm password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
                    >
                        Reset Password
                    </button>
                </form>

                <p className="text-xs mt-4 text-gray-700">
                    Still experiencing issues?{' '}
                    <a href="#" className="text-orange-500 hover:underline">
                        Contact Support
                    </a>
                </p>

                <p className="text-xs mt-20 text-center text-black">
                    Remember your password?{' '}
                    <a href="/Login" className="text-orange-500 hover:underline">
                        Signin now
                    </a>
                </p>
            </div>
        </div>
    )
}

export default ResetPasswordForm
