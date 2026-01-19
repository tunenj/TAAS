"use client";

import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import Cookies from "js-cookie";
import { Eye, EyeOff } from "lucide-react";

interface LoginResponse {
  success?: boolean;
  message?: string;
  errors?: { non_field_errors?: string[] };
  access_token?: string;
  data?: {
    access?: string;
    user?: {
      id?: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      role_name?: string;
    };
  };
}

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role_name: string;
}

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

  // Fetch user profile after login to get correct role
  const fetchUserProfile = async (token: string): Promise<UserProfile | null> => {
    try {
      const res = await fetch(`${BASE_URL}/profile/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      return result?.data as UserProfile;
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!BASE_URL) {
      toast.error("Server URL not found");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include",
      });

      const result: LoginResponse = await res.json();

      if (!res.ok || result.success === false) {
        const errorMsg =
          result?.errors?.non_field_errors?.[0] ||
          result?.message?.replace(/[{}']/g, "") ||
          "Login failed. Check your credentials.";
        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      const token = result?.data?.access || result?.access_token;
      if (!token) {
        toast.error("No access token returned.");
        setLoading(false);
        return;
      }

      // Store token first
      if (formData.remember) {
        Cookies.set("accessToken", token, { expires: 7 });
      } else {
        Cookies.set("accessToken", token);
      }
      localStorage.setItem("accessToken", token);

      // Fetch the actual user profile to get correct role
      const userProfile = await fetchUserProfile(token);
      
      if (!userProfile) {
        toast.error("Failed to fetch user profile");
        setLoading(false);
        return;
      }

      // Use the profile data from /profile/me/ endpoint which has correct role
      const userData: UserProfile = {
        id: userProfile.id,
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        email: userProfile.email,
        role_name: userProfile.role_name, // This will be "ADMINISTRATOR" from the API
      };

      setAuth(userData, token);
      toast.success("Login successful!");

      // Redirect based on actual role from profile
      const role = userData.role_name.toUpperCase();
      if (role === "ADMINISTRATOR") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/agent");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Network error. Please try again.");
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
        <h2 className="text-2xl font-bold mb-2">
          Welcome <b>back</b>
        </h2>
        <p className="text-gray-600 mb-8 text-sm">
         We're glad to see you again. Let's get you started.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10"
              required
            />
            <div className="absolute right-3 top-9 cursor-pointer" onClick={togglePassword}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <div className="flex items-center space-x-2">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={formData.remember}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="remember" className="text-black text-xs cursor-pointer">
                Remember my password
              </label>
            </div>

            <Link href="/auth/forgot-password" className="text-xs text-orange-500">
              forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-full py-2 text-white font-semibold ${
              loading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500"
            }`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-xs text-black text-center">
          Don&apos;t have an account?{" "}
          <a href="/Register" className="text-orange-500 hover:underline">
            Signup now
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;