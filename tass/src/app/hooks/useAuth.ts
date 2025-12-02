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
  const [firstName, setFirstName] = useState<string>("");
  const [role, setRole] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [rolesList, setRolesList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://atasstaging.avetiumconsult.com/api";

  // Redirect based on role (normalized to uppercase)
  const determineRedirectPath = (userRole: string): string => {
    if (userRole?.toUpperCase() === "ADMINISTRATOR") return "/dashboard/admin";
    return "/dashboard/agent";
  };

  // Fetch user profile
  const fetchUserProfile = async (token: string): Promise<UserProfile | null> => {
    try {
      const res = await fetch(`${BASE_URL}/profile/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        if (requireAuth) logout();
        return null;
      }

      const result = await res.json();
      const userData: UserProfile = result?.data;

      if (!userData) {
        if (requireAuth) logout();
        return null;
      }

      setUser(userData);
      setFirstName(userData.first_name);

      // Only update role if API returns a valid string
      if (userData.role_name && userData.role_name.trim() !== "") {
        setRole(userData.role_name.toUpperCase());
      }

      // Redirect from login if needed
      if (requireAuth && pathname === "/login") {
        router.replace(determineRedirectPath(userData.role_name));
      }

      return userData;
    } catch (err) {
      console.error("Auth error:", err);
      if (requireAuth) logout();
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles list
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

  // Refresh user manually (without overwriting role incorrectly)
  const refreshUser = async (): Promise<UserProfile | null> => {
    const token =
      Cookies.get("accessToken") ||
      Cookies.get("access_token") ||
      localStorage.getItem("accessToken");

    if (!token) return null;

    setAccessToken(token);

    try {
      await fetchRoles(token);
      const userData = await fetchUserProfile(token);

      // Ensure role stays consistent
      if (userData?.role_name) setRole(userData.role_name.toUpperCase());

      return userData || null;
    } catch (err) {
      console.error("Refresh user error:", err);
      return null;
    }
  };

  // Set auth after login
  const setAuth = (userData: UserProfile, token: string) => {
    setUser(userData);
    setFirstName(userData.first_name);
    setRole(userData.role_name.toUpperCase());
    setAccessToken(token);

    Cookies.set("accessToken", token, { expires: 7 });
    localStorage.setItem("accessToken", token);

    Cookies.set("userData", JSON.stringify(userData), { expires: 7 });
    localStorage.setItem("userData", JSON.stringify(userData));

    Cookies.set("role", userData.role_name.toUpperCase(), { expires: 7 });
    localStorage.setItem("role", userData.role_name.toUpperCase());
  };

  // Logout
  const logout = () => {
    Cookies.remove("accessToken");
    localStorage.removeItem("accessToken");
    setUser(null);
    setRole(null);
    setAccessToken(null);
    router.replace("/login");
  };

  // On mount, check token
  useEffect(() => {
    const token =
      Cookies.get("accessToken") ||
      Cookies.get("access_token") ||
      localStorage.getItem("accessToken");

    if (!token) {
      if (requireAuth) router.replace("/login");
      setLoading(false);
      return;
    }

    setAccessToken(token);
    fetchUserProfile(token);
    fetchRoles(token);
  }, [pathname]);

  return {
    user,
    firstName,
    role,
    accessToken,
    rolesList,
    loading,
    logout,
    BASE_URL,
    refreshUser,
    setAuth,
  };
}
