import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../../lib/api';
import { getToken, setToken, removeToken } from '../../lib/auth';

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
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, role: UserRole, name?: string, companyName?: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from token on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api.get<{ id: number; email: string; role: string; name: string; bio: string; photo: string | null; cvFile: string | null; company: string }>('/profile')
      .then(data => {
        setRole(data.role as UserRole);
        setProfile({
          name: data.name,
          email: data.email,
          bio: data.bio,
          photo: data.photo ?? undefined,
          cvFile: data.cvFile ?? undefined,
          company: data.company,
        });
      })
      .catch(() => removeToken())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string, selectedRole: UserRole) => {
    const data = await api.post<{ token: string; role: string; profile: UserProfile }>('/auth/login', { email, password });
    setToken(data.token);
    setRole(data.role as UserRole);
    setProfile(data.profile);
  };

  const register = async (email: string, password: string, selectedRole: UserRole, name?: string, companyName?: string) => {
    const data = await api.post<{ token: string; role: string }>('/auth/register', {
      email,
      password,
      role: selectedRole,
      name,
      companyName,
    });
    setToken(data.token);
    setRole(data.role as UserRole);
    setProfile({ name: name || '', email, company: companyName || '' });
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const data = await api.put<UserProfile>('/profile', {
      name: updates.name,
      bio: updates.bio,
      photo: updates.photo,
      cvFile: updates.cvFile,
      company: updates.company,
    });
    setProfile(prev => prev ? { ...prev, ...data } : data);
  };

  const logout = () => {
    removeToken();
    setRole(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ role, profile, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
