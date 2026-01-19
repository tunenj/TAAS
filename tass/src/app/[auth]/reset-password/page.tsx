"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { BASE_URL } = useAuth(false);

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validToken, setValidToken] = useState(false);

  // ✅ Verify token on page load
  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/auth/reset-password/verify?token=${token}`
        );

        if (!res.ok) throw new Error("Invalid or expired token");

        setValidToken(true);
      } catch {
        setError("Reset link is invalid or expired");
      }
    };

    verifyToken();
  }, [token, BASE_URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/auth/reset-password/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return <p className="text-center mt-20">{error || "Verifying token..."}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 space-y-4">
      <h2 className="text-xl font-bold">Reset Password</h2>

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2"
        required
      />

      <input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full border p-2"
        required
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        disabled={loading}
        className="w-full bg-orange-500 text-white py-2 rounded"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}
