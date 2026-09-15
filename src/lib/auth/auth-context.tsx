"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthSession, AuthUser } from "./auth-types";
import {
  AUTH_STORAGE_KEY,
  DEFAULT_DEMO_USER,
  clearClientSession,
  getClientSession,
  saveClientSession,
} from "./session";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; workspaceName: string; email: string; pass: string }) => Promise<{ success: boolean; error?: string }>;
  demoLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getClientSession();
    if (session?.user) {
      setUser(session.user);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    // Artificial latency for authentic SaaS feel
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!email || !email.includes("@")) {
      return { success: false, error: "Please enter a valid email address." };
    }
    if (!pass || pass.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    const sessionUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      email,
      workspaceId: "ws-1",
      workspaceName: "Apex Growth Agency",
      role: "OWNER",
      avatarUrl: DEFAULT_DEMO_USER.avatarUrl,
      createdAt: new Date().toISOString(),
    };

    const session: AuthSession = {
      user: sessionUser,
      token: `fp_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    };

    saveClientSession(session);
    setUser(sessionUser);
    return { success: true };
  };

  const register = async (data: {
    name: string;
    workspaceName: string;
    email: string;
    pass: string;
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (!data.name.trim()) return { success: false, error: "Name is required." };
    if (!data.workspaceName.trim()) return { success: false, error: "Workspace name is required." };
    if (!data.email.includes("@")) return { success: false, error: "Valid email is required." };
    if (data.pass.length < 8) return { success: false, error: "Password must be at least 8 characters." };

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      workspaceId: `ws-${Date.now()}`,
      workspaceName: data.workspaceName,
      role: "OWNER",
      avatarUrl: DEFAULT_DEMO_USER.avatarUrl,
      createdAt: new Date().toISOString(),
    };

    const session: AuthSession = {
      user: newUser,
      token: `fp_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    };

    saveClientSession(session);
    setUser(newUser);
    return { success: true };
  };

  const demoLogin = () => {
    const session: AuthSession = {
      user: DEFAULT_DEMO_USER,
      token: `fp_jwt_demo_${Date.now()}`,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    };
    saveClientSession(session);
    setUser(DEFAULT_DEMO_USER);
  };

  const logout = () => {
    clearClientSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
