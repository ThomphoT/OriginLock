import type { User } from "@/types";

// Stub service - backend integration will be connected later
const AUTH_KEY = "originlock_auth";

const mockUser: User = {
  id: "usr_001",
  email: "creator@originlock.io",
  name: "Alex Rivera",
  walletAddress: "7xKX...m9Fk",
  avatar: undefined,
  createdAt: new Date().toISOString(),
};

export const authService = {
  async login(_email: string, _password: string): Promise<User> {
    // Simulated delay
    await new Promise((r) => setTimeout(r, 800));
    localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
    return mockUser;
  },

  async register(_name: string, _email: string, _password: string): Promise<User> {
    await new Promise((r) => setTimeout(r, 800));
    localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
    return mockUser;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(AUTH_KEY);
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_KEY);
  },
};