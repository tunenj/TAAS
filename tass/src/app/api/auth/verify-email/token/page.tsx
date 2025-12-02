"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function RedirectVerify() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token: string | null = params.get("token");

    if (!token) {
      router.replace(`/auth/verify-email?error=missing-token`);
      return;
    }

    // Detect environment (replace with your own staging URL check)
    const isStaging = window.location.hostname !== "localhost";

    if (isStaging) {
      // POST token to staging backend
      fetch("https://atasstaging.avetiumconsult.com/api/auth/verify-email/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            toast.success("Email verified successfully!");
            router.replace("/auth/login"); // redirect to login after verification
          } else {
            toast.error(data.message || "Verification failed");
            router.replace("/auth/verify-email?error=verification-failed");
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Verification failed");
          router.replace("/auth/verify-email?error=verification-failed");
        })
        .finally(() => setLoading(false));
    } else {
      // Local dev: just redirect via GET
      router.replace(`/auth/verify-email?token=${token}`);
    }
  }, [params, router]);

  return <p>{loading ? "Verifying your email..." : "Redirecting..."}</p>;
}
