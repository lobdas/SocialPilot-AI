import { AuthSession, AuthUser } from "./auth-types";

export const AUTH_COOKIE_NAME = "socialpilot_auth_token";
export const AUTH_STORAGE_KEY = "socialpilot_auth_session_v1";

export const DEFAULT_DEMO_USER: AuthUser = {
  id: "usr-demo-lead",
  name: "Alex Rivera",
  email: "alex@apexgrowth.io",
  workspaceId: "ws-1",
  workspaceName: "Apex Growth Agency",
  role: "OWNER",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  createdAt: new Date().toISOString(),
};

export function getClientSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read auth session from storage", err);
    return null;
  }
}

export function saveClientSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    // Set cookie with 30-day expiry
    const maxAge = 60 * 60 * 24 * 30;
    document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(session.token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch (err) {
    console.error("Failed to persist auth session", err);
  }
}

export function clearClientSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  } catch (err) {
    console.error("Failed to clear auth session", err);
  }
}
