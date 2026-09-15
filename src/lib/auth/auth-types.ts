export interface AuthUser {
  id: string;
  name: string;
  email: string;
  workspaceId: string;
  workspaceName: string;
  role: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: string;
}
