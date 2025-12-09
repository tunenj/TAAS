"use client";

import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import Cookies from "js-cookie";
import { Eye, EyeOff } from "lucide-react";

const SignInForm: React.FC = () => {
  const router = useRouter();
  const { BASE_URL, setAuth } = useAuth(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePassword = () => setShowPassword(prev => !prev);

  // Fetching user profile after login to get correct user role
  const fetchUserProfile = async (token: string) => {
    try {
      const res = await fetch(`${BASE_URL}/profile/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      return result?.data || null;
    } catch (err) {
      console.error("PROFILE FETCH ERROR:", err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await res.json();

      if (!res.ok || result.success === false) {
        const errorMsg =
          result?.errors?.non_field_errors?.[0] ||
          result?.message ||
          "Invalid login credentials";
        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      const token = result?.data?.access || result?.access_token;

      if (!token) {
        toast.error("Token not returned");
        setLoading(false);
        return;
      }

      // Store token
      if (formData.remember) {
        Cookies.set("accessToken", token, { expires: 7 });
      } else {
        Cookies.set("accessToken", token);
      }
      localStorage.setItem("accessToken", token);

      // Get user profile (correct role)
      const profile = await fetchUserProfile(token);

      if (!profile) {
        toast.error("Failed to fetch profile");
        setLoading(false);
        return;
      }

      // Build data for Auth Context
      const userData = {
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        role_name: profile.role_name,
      };

      // Save to useAuth state
      setAuth(userData, token);

      toast.success("Login successful!");

      // Redirect based on role
      const role = userData.role_name?.toUpperCase();

      if (role === "ADMINISTRATOR") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/agent");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      <Image
        src="/images/imag.png"
        alt="Background"
        fill
        className="absolute inset-0 object-cover"
        priority
      />

      <div className="relative z-10 bg-white p-10 rounded-lg shadow-lg max-w-2xl w-[827px]">
        <h2 className="text-2xl font-bold mb-2">Welcome <b>back</b></h2>
        <p className="text-gray-600 mb-8 text-sm">
          We're glad to see you again. Let's get you started.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md pr-10"
              required
            />
            <div
              className="absolute right-3 top-9 cursor-pointer"
              onClick={togglePassword}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <div className="flex items-center space-x-2">
              <input
                name="remember"
                type="checkbox"
                checked={formData.remember}
                onChange={handleChange}
              />
              <label className="text-xs cursor-pointer">Remember me</label>
            </div>

            <Link href="/auth/forgot-password" className="text-xs text-orange-500">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-full text-white font-semibold ${
              loading ? "bg-orange-300" : "bg-orange-500"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-xs text-center">
          Don’t have an account?{" "}
          <Link href="/Register" className="text-orange-500">Signup now</Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
