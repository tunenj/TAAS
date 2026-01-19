"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";

const ForgotPasswordForm: React.FC = () => {
  const { BASE_URL } = useAuth(false);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/auth/forget-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to send reset link");
      }

      setMessage("Password reset link has been sent to your email.");
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
          No worries, we'll send you reset instructions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black mb-1"
            >
              Organisation email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Ormaniventure@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
              required
            />
          </div>

          {message && (
            <p className="text-sm text-green-600">{message}</p>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-orange-500 py-2 text-white font-semibold hover:bg-orange-600 transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="text-xs mt-4 text-gray-700">
          Still experiencing issues?{" "}
          <a href="#" className="text-orange-500 hover:underline">
            Contact Support
          </a>
        </p>

        <p className="text-xs mt-20 text-black">
          Remember your password?{" "}
          <a href="/Login" className="text-orange-500 hover:underline">
            Signin now
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
