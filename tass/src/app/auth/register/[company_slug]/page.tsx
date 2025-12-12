"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

interface FormState {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
  password: string;
  password2: string;
  agreement: boolean;
}

export default function RegisterPage() {
  const params = useParams();

  const company_slug = Array.isArray(params?.company_slug)
    ? params.company_slug[0]
    : params?.company_slug;

  const [form, setForm] = useState<FormState>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    password2: "",
    agreement: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!company_slug) {
      toast.error("Invalid registration link.");
      return;
    }

    // Frontend validation
    for (const [key, value] of Object.entries(form)) {
      if (key !== "agreement" && value === "") {
        toast.error("All fields are required.");
        return;
      }
    }

    if (!form.agreement) {
      toast.error("You must accept the terms.");
      return;
    }

    if (form.password !== form.password2) {
      toast.error("Passwords do not match.");
      return;
    }

    const loadingToast = toast.loading("Processing...");

    try {
      const res = await fetch(
        `https://atasstaging.avetiumconsult.com/api/auth/user/${company_slug}/register/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success("Registration successful");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Network error. Try again.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register Under Organization</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* FIRST NAME */}
        <label className="block text-sm font-medium mb-1">
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          name="first_name"
          placeholder="First Name"
          onChange={handleChange}
          className="border p-2 w-full placeholder-gray-500 rounded-md"
        />

        {/* LAST NAME */}
        <label className="block text-sm font-medium mb-1">
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          name="last_name"
          placeholder="Last Name"
          onChange={handleChange}
          className="border p-2 w-full placeholder-gray-500 rounded-md"
        />

        {/* USERNAME */}
        <label className="block text-sm font-medium mb-1">
          Username <span className="text-red-500">*</span>
        </label>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="border p-2 w-full placeholder-gray-500 rounded-md"
        />

        {/* EMAIL */}
        <label className="block text-sm font-medium mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="border p-2 w-full placeholder-gray-500 rounded-md"
        />

        {/* PHONE */}
        <label className="block text-sm font-medium mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          name="phone_number"
          placeholder="Phone Number"
          onChange={handleChange}
          className="border p-2 w-full placeholder-gray-500 rounded-md"
        />

        {/* PASSWORD */}
        <label className="block text-sm font-medium mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="border p-2 w-full placeholder-gray-500 rounded-md"
        />

        {/* CONFIRM PASSWORD */}
        <label className="block text-sm font-medium mb-1">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <input
          name="password2"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="border p-2 w-full placeholder-gray-500 rounded-md"
        />

        {/* AGREEMENT */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="agreement"
            onChange={handleChange}
          />
          <span>
            Accept Terms <span className="text-red-500">*</span>
          </span>
        </label>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="bg-orange-500 text-white w-full py-2 rounded-md"
        >
          Register
        </button>
      </form>
    </div>
  );
}
