// app/hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role_name: string;
  [key: string]: any;
}

export function useAuth(requireAuth: boolean = true) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [rolesList, setRolesList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Record<string, any> | null>(null);

  const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://atasstaging.avetiumconsult.com/api/v1";


  const normalizeRole = (role?: string | null) =>
    role ? role.toUpperCase() : null;

  const getStoredAccessToken = (): string | null => {
    return (
      Cookies.get("accessToken") ||
      null
    );
  };

  const getStoredRefreshToken = (): string | null => {
    return (
      Cookies.get("refreshToken") ||
      null
    );
  };

  const determineRedirectPath = (userRole: string): string => {
    if (userRole?.toUpperCase() === "ADMINISTRATOR") {
      return "/dashboard/admin";
    }
    return "/dashboard/agent";
  };



  const fetchUserProfile = async (
    token: string
  ): Promise<UserProfile | null> => {
    try {
      const res = await fetch(`${BASE_URL}/profile/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        return null;
      }

      const result = await res.json();
      const userData: UserProfile = result?.data;

      if (!userData) return null;

      setUser(userData);
      setFirstName(userData.first_name);
      setRole(normalizeRole(userData.role_name));

      if (requireAuth && pathname === "/Login") {
        router.replace(determineRedirectPath(userData.role_name));
      }

      return userData;
    } catch (err) {
      console.error("Auth error:", err);
      return null;
    }
  };

  const fetchRoles = async (token: string) => {
    try {
      const res = await fetch(`${BASE_URL}/org/all/roles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setRolesList(data?.results || []);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const fetchUserLocation = async (token: string) => {
    try {
      const res = await fetch(`${BASE_URL}/profile/me/location/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;

      const result = await res.json();
      const loc = result?.data?.location;
      setLocation(loc);
      return loc;
    } catch (err) {
      console.error("Location fetch error:", err);
      return null;
    }
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    const storedRefreshToken = getStoredRefreshToken();
    if (!storedRefreshToken) return null;

    try {
      const res = await fetch(`${BASE_URL}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: storedRefreshToken }),
      });

      if (!res.ok) return null;

      const data = await res.json();
      const newAccessToken = data.access;
      if (!newAccessToken) return null;

      setAccessToken(newAccessToken);
      Cookies.set("accessToken", newAccessToken, { expires: 1 });

      return newAccessToken;
    } catch (err) {
      console.error("Token refresh error:", err);
      return null;
    }
  };


  const refreshUser = async (): Promise<UserProfile | null> => {
    let token = getStoredAccessToken();

    if (!token) {
      token = await refreshAccessToken();
      if (!token) {
        if (requireAuth) logout();
        return null;
      }
    }

    setAccessToken(token);

    try {
      const [userData] = await Promise.all([
        fetchUserProfile(token),
        fetchRoles(token),
        fetchUserLocation(token),
      ]);

      if (!userData && requireAuth) logout();
      return userData;
    } catch (err) {
      console.error("Refresh user error:", err);
      return null;
    }
  };

  const setAuth = (
    userData: UserProfile,
    token: string,
    refreshToken?: string
  ) => {
    setUser(userData);
    setFirstName(userData.first_name);
    setRole(normalizeRole(userData.role_name));
    setAccessToken(token);

    Cookies.set("accessToken", token, { expires: 1 });

    if (refreshToken) {
      setRefreshToken(refreshToken);
      Cookies.set("refreshToken", refreshToken, { expires: 7 });
    }

    Cookies.set("userData", JSON.stringify(userData), { expires: 7 });
    Cookies.set("role", normalizeRole(userData.role_name) || "", { expires: 7 });
  };



  const clearCookies = () => {
    [
      "accessToken",
      "access_token",
      "refreshToken",
      "refresh_token",
      "userData",
      "role",
    ].forEach((c) => {
      Cookies.remove(c);
      Cookies.remove(c, { path: "/" });
    });
  };

  const clearStorage = () => {
    [
      "attendanceStatus",
      "checkInTime",
      "lastResetDate",
    ].forEach((key) => localStorage.removeItem(key));
  };


  const clearAuthData = () => {
    clearCookies();
    clearStorage();

    setUser(null);
    setFirstName("");
    setRole(null);
    setAccessToken(null);
    setRefreshToken(null);
    setRolesList([]);
    setLocation(null);
  };

  const logout = () => {
    clearAuthData();
    router.replace("/login");
  };


  const isAuthenticated = () => !!accessToken && !!user;

  const getUserInitials = (): string => {
    if (!user) return "U";
    return (
      (user.first_name?.[0] || "") +
      (user.last_name?.[0] || "")
    ).toUpperCase();
  };

  const hasRole = (checkRole: string): boolean =>
    role?.toUpperCase() === checkRole.toUpperCase();

  const hasAnyRole = (checkRoles: string[]): boolean =>
    !!role && checkRoles.some((r) => r.toUpperCase() === role.toUpperCase());

  /* =========================
     Init
  ========================== */

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      const token = getStoredAccessToken();
      if (!token) {
        if (requireAuth) router.replace("/login");
        setLoading(false);
        return;
      }

      setAccessToken(token);

      const userData = await Promise.all([
        fetchUserProfile(token),
        fetchRoles(token),
        fetchUserLocation(token),
      ]);

      if (!userData[0] && requireAuth) logout();

      setLoading(false);
    };

    initAuth();
  }, [pathname]);

  return {
    user,
    firstName,
    role,
    accessToken,
    refreshToken,
    rolesList,
    loading,
    location,
    BASE_URL,
    logout,
    refreshUser,
    setAuth,
    fetchUserLocation,
    determineRedirectPath,
    refreshAccessToken,
    isAuthenticated,
    getUserInitials,
    hasRole,
    hasAnyRole,
    clearAuthData,
    get roleName() {
      return role;
    },
  };
}
