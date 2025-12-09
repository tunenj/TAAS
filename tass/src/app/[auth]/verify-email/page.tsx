"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Fallback API URL (staging)
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://atasstaging.avetiumconsult.com/api";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("Preparing verification...");

  useEffect(() => {
    // No token found
    if (!token) {
      setStatus("No token found. Redirecting...");
      setTimeout(() => router.replace("/login?error=no_token"), 1500);
      return;
    }

    const verifyEmail = async () => {
      try {
        setStatus("Verifying your email...");

        const res = await fetch(
          `${API_BASE}/auth/verify-email/token/?token=${encodeURIComponent(
            token
          )}`,
          { method: "GET" }
        );

        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("✅ Email verified! Redirecting...");
        } else {
          const msg =
            data?.errors?.non_field_errors?.[0] ||
            "Invalid or expired token";
          setStatus(`❌ ${msg}`);
        }
      } catch (error) {
        console.error(error);
        setStatus("❌ Server error.");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Email Verification
        </h1>

        <p className="text-gray-700">{status}</p>

        <div className="mt-4">
          <div className="h-1 w-full bg-gray-200 rounded overflow-hidden">
            <div className="h-1 bg-orange-600 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
