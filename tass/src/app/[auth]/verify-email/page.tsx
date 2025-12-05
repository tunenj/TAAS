"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<string>("Preparing verification...");
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      setStatus("No token found in the URL.");
      return;
    }

    const verifyEmail = async () => {
      setStatus("Verifying your email, please wait...");
      try {
        const response = await fetch(
          "https://atasstaging.avetiumconsult.com/api/auth/verify-email/token/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus("✅ Email verified successfully!");
          setVerified(true);
        } else if (data.message) {
          setStatus(`Verification failed: ${data.message}`);
        } else {
          setStatus("Verification failed: Unknown error.");
        }
      } catch (error) {
        console.error("Email verification error:", error);
        setStatus("Something went wrong. Please try again later.");
      }
    };

    verifyEmail();
  }, [token]);

  const handleLogin = () => {
    router.push("/login"); // Redirect to your login page
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 text-center border border-gray-200 rounded-lg shadow-sm bg-white">
      <h1 className="text-2xl font-bold text-gray-800">Email Verification</h1>
      <p className="mt-5 text-gray-700 text-base">{status}</p>

      {verified && (
        <button
          onClick={handleLogin}
          className="mt-6 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition-colors duration-200"
        >
          Go to Login
        </button>
      )}
    </div>
  );
}
