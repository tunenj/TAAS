"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role_name: string;
}

export default function LocationPermissionCard() {
    const router = useRouter();
    const { BASE_URL, setAuth } = useAuth(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const fetchUserProfile = async (token: string): Promise<UserProfile> => {
        const res = await fetch(`${BASE_URL}/profile/me/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch user profile");
        }

        const result = await res.json();
        return result.data as UserProfile;
    };

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported on this device.");
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    if (!BASE_URL) throw new Error("Server URL not found");

                    const token =
                        Cookies.get("accessToken") ||
                        localStorage.getItem("accessToken");

                    if (!token) throw new Error("Authentication token missing");

                    const res = await fetch(`${BASE_URL}/location/current/`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            latitude: position.coords.latitude.toString(),
                            longitude: position.coords.longitude.toString(),
                        }),
                    });

                    if (!res.ok) {
                        const msg = await res.text();
                        throw new Error(msg || "Failed to update location");
                    }

                    const profile = await fetchUserProfile(token);
                    setAuth(profile, token);

                    toast.success("Location verified successfully");
                    setSuccess(true);

                    setTimeout(() => {
                        const role = profile.role_name.toUpperCase();
                        if (role === "ADMINISTRATOR") {
                            router.push("/dashboard/admin");
                        } else {
                            router.push("/dashboard/agent");
                        }
                    }, 1200);
                } catch (err: any) {
                    console.error(err);
                    toast.error(err.message || "Unable to update location");
                    setError(err.message || "Unable to update location");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                if (err.code === err.PERMISSION_DENIED) {
                    setError(
                        "Location permission denied. Please enable it in your browser settings."
                    );
                } else if (err.code === err.POSITION_UNAVAILABLE) {
                    setError("Location information is unavailable.");
                } else {
                    setError("Unable to retrieve location.");
                }
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4">
            {/* Background cover image */}
            <Image
                src="/images/imag.png"
                alt="Location background"
                fill
                priority
                className="absolute inset-0 object-cover"
            />

            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/30" />

            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                        <MapPin className="h-7 w-7 text-orange-500" />
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900">
                        Enable Location Access
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Helps validate your location.
                    </p>
                </div>

                <div className="mt-6 space-y-4">
                    {!success && (
                        <button
                            onClick={requestLocation}
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 py-2.5 text-sm font-semibold text-white"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Verifying location…
                                </>
                            ) : (
                                "Allow Location Access"
                            )}
                        </button>
                    )}

                    {error && (
                        <p className="text-center text-sm text-red-600">{error}</p>
                    )}

                    {success && (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">
                                Location verified. Redirecting…
                            </span>
                        </div>
                    )}
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                    Your location is only used for verification purposes.
                </p>
            </div>
        </div>
    );
}
