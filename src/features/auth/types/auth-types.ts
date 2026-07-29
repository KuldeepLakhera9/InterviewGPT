export type UserRole = 'owner' | 'member' | 'viewer';

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  workspaceId: string;
  role: UserRole;
  emailVerified: boolean;
}

export interface AuthActionResult {
  success: boolean;
  message?: string;
  error?: string;
  redirectTo?: string;
  fieldErrors?: Record<string, string[]>;
}
