import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = 'student' | 'company' | null;

export interface UserProfile {
  name: string;
  email: string;
  photo?: string;
  bio?: string;
  cvFile?: string;
  company?: string;
}

interface AuthContextType {
  role: UserRole;
  profile: UserProfile | null;
  login: (email: string, role: UserRole) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const login = (email: string, selectedRole: UserRole) => {
    setRole(selectedRole);
    setProfile({ name: '', email });
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile(prev => prev ? { ...prev, ...data } : null);
  };

  const logout = () => {
    setRole(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ role, profile, login, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
