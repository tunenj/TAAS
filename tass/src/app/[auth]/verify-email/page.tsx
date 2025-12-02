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
    <div
      style={{
        maxWidth: 600,
        margin: "50px auto",
        padding: "20px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h1>Email Verification</h1>
      <p style={{ marginTop: 20, fontSize: 16 }}>{status}</p>

      {verified && (
        <button
          onClick={handleLogin}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            backgroundColor: "#E95D28",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Go to Login
        </button>
      )}
    </div>
  );
}
