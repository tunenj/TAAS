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
  const [firstName, setFirstName] = useState<string>("");
  const [role, setRole] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [rolesList, setRolesList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<any>(null);

  const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://atasstaging.avetiumconsult.com/api";

  // Redirect based on role
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

      if (userData.role_name && userData.role_name.trim() !== "") {
        setRole(userData.role_name.toUpperCase());
      }

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

  // Fetch user location
  const fetchUserLocation = async (token: string) => {
    try {
      const res = await fetch(`${BASE_URL}/profile/me/location/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("Failed to fetch location");
        return null;
      }

      const result = await res.json();
      const loc = result?.data?.location;

      setLocation(loc);
      return loc;
    } catch (err) {
      console.error("Location fetch error:", err);
      return null;
    }
  };

  // Refresh access token using refresh token
  const refreshAccessToken = async (): Promise<string | null> => {
    const storedRefreshToken = 
      Cookies.get("refreshToken") || 
      Cookies.get("refresh_token") || 
      localStorage.getItem("refreshToken");

    if (!storedRefreshToken) {
      logout();
      return null;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: storedRefreshToken }),
      });

      if (!response.ok) {
        logout();
        return null;
      }

      const data = await response.json();
      const newAccessToken = data.access;

      if (newAccessToken) {
        setAccessToken(newAccessToken);
        Cookies.set("accessToken", newAccessToken, { expires: 1 });
        localStorage.setItem("accessToken", newAccessToken);
        
        // Also store as access_token for compatibility
        Cookies.set("access_token", newAccessToken, { expires: 1 });
        
        return newAccessToken;
      }
      
      logout();
      return null;
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
      return null;
    }
  };

  // Refresh user profile + location
  const refreshUser = async (): Promise<UserProfile | null> => {
    let token =
      Cookies.get("accessToken") ||
      Cookies.get("access_token") ||
      localStorage.getItem("accessToken");

    // If no access token, try to refresh
    if (!token) {
      token = await refreshAccessToken();
      if (!token) return null;
    }

    setAccessToken(token);

    try {
      await fetchRoles(token);
      const userData = await fetchUserProfile(token);

      if (userData?.role_name) setRole(userData.role_name.toUpperCase());

      await fetchUserLocation(token);

      return userData || null;
    } catch (err) {
      console.error("Refresh user error:", err);
      return null;
    }
  };

  // Set auth after login or verification
  const setAuth = (userData: UserProfile, token: string, refreshToken?: string) => {
    setUser(userData);
    setFirstName(userData.first_name);
    setRole(userData.role_name.toUpperCase());
    setAccessToken(token);

    // Store access token
    Cookies.set("accessToken", token, { expires: 1 });
    localStorage.setItem("accessToken", token);
    Cookies.set("access_token", token, { expires: 1 }); // For compatibility

    // Store refresh token if provided
    if (refreshToken) {
      setRefreshToken(refreshToken);
      Cookies.set("refreshToken", refreshToken, { expires: 7 });
      localStorage.setItem("refreshToken", refreshToken);
      Cookies.set("refresh_token", refreshToken, { expires: 7 }); // For compatibility
    }

    // Store user data
    Cookies.set("userData", JSON.stringify(userData), { expires: 7 });
    localStorage.setItem("userData", JSON.stringify(userData));

    Cookies.set("role", userData.role_name.toUpperCase(), { expires: 7 });
    localStorage.setItem("role", userData.role_name.toUpperCase());
  };

  // Clear all auth data
  const clearAuthData = () => {
    // Clear all auth-related cookies
    const authCookies = [
      "accessToken", "access_token", 
      "refreshToken", "refresh_token",
      "userData", "role"
    ];
    
    authCookies.forEach(cookie => {
      Cookies.remove(cookie);
      Cookies.remove(cookie, { path: "/" });
    });

    // Clear localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("role");

    // Reset state
    setUser(null);
    setFirstName("");
    setRole(null);
    setAccessToken(null);
    setRefreshToken(null);
    setRolesList([]);
    setLocation(null);
  };

  // Logout
  const logout = () => {
    clearAuthData();
    router.replace("/login");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Get current auth state
  const isAuthenticated = () => {
    return !!accessToken && !!user;
  };

  // Get user initials
  const getUserInitials = (): string => {
    if (!user) return "U";
    const first = user.first_name?.[0] || "";
    const last = user.last_name?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  // Check if user has specific role
  const hasRole = (checkRole: string): boolean => {
    return role?.toUpperCase() === checkRole.toUpperCase();
  };

  // Check if user has any of the given roles
  const hasAnyRole = (checkRoles: string[]): boolean => {
    if (!role) return false;
    return checkRoles.some(r => r.toUpperCase() === role.toUpperCase());
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
    fetchUserLocation(token);
  }, [pathname]);

  return {
    // State
    user,
    firstName,
    role,
    accessToken,
    refreshToken,
    rolesList,
    loading,
    location,
    BASE_URL,
    
    // Functions
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
    }
  };
}