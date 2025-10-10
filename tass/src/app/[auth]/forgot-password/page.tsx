// components/ForgotPasswordForm.tsx
"use client"
import Image from 'next/image'
import React, { useState } from 'react'


const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // handle sending reset link logic here
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
      <div className="relative bg-white p-10 rounded-lg shadow-lg max-w-2xl w-[827px] z-10">
        <h2 className="text-2xl font-bold mb-2">Forgot password</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis morbi pulvinar venenatis non.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
              Organisation email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Ormaniventure@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-orange-500 py-2 text-white font-semibold hover:bg-orange-600 transition"
          >
            Send reset link
          </button>
        </form>

        <p className="text-xs mt-4 text-gray-700">
          Still experiencing issues?{' '}
          <a href="#" className="text-orange-500 hover:underline">
            Contact Support
          </a>
        </p>

        <p className="text-xs mt-20 text-black">
          Remember your password?{' '}
          <a href="/Login" className="text-orange-500 hover:underline">
            Signin now
          </a>
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordForm
