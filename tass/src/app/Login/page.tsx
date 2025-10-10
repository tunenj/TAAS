// components/SignInForm.tsx
"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import Link from 'next/link'


const SignInForm: React.FC = () => {
    const [formData, setFormData] = useState({
        organisation: '',
        password: '',
        remember: false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Add sign-in submit logic here
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
                <h2 className="text-2xl font-bold mb-2">
                    Welcome <b>back</b>
                </h2>
                <p className="text-gray-600 mb-8 text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis morbi pulvinar venenatis non.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="organisation" className="block text-sm font-medium text-black mb-1">
                            Organisation name
                        </label>
                        <input
                            id="organisation"
                            name="organisation"
                            type="text"
                            placeholder="Organisation name"
                            value={formData.organisation}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                            required
                        />
                        <div className='flex justify-between mt-2'>
                            <div className="flex items-center space-x-2">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                                />
                                <label htmlFor="remember" className="text-black text-xs select-none cursor-pointer">
                                    Remember my password
                                </label>
                            </div>
                            <div className="text-right">
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-xs text-orange-500 cursor-pointer hover:underline select-none"
                                >
                                    forgot password?
                                </Link>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-full bg-orange-500 py-2 text-white font-semibold hover:bg-orange-600 transition"
                    >
                        Sign in
                    </button>

                    <div className="flex items-center my-4 space-x-2 text-gray-400 text-xs before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
                        <span>or</span>
                    </div>

                    <button
                        type="button"
                        className="w-full rounded-full border border-gray-300 py-2 shadow-2xl text-black font-semibold hover:bg-gray-100 transition"
                    >
                        Sign in with organisation ID
                    </button>
                </form>

                <p className="mt-6 text-xs text-black text-center">
                    Don&apos;t have an account?{' '}
                    <a href="/Register" className="text-orange-500 hover:underline">
                        Signup now
                    </a>
                </p>
            </div>
        </div>
    )
}

export default SignInForm
