import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../../lib/api';
import { getToken, setToken, removeToken } from '../../lib/auth';

export type UserRole = 'student' | 'company' | 'school' | null;

export interface UserProfile {
  name: string;
  email: string;
  photo?: string;
  bio?: string;
  cvFile?: string;
  company?: string;
  schoolId?: number | null;
}

interface RegisterOptions {
  name?: string;
  companyName?: string;
  schoolName?: string;
  schoolDomain?: string;
  contactName?: string;
  schoolId?: number | null;
}

interface AuthContextType {
  role: UserRole;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, role: UserRole, opts?: RegisterOptions) => Promise<void>;
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
    api.get<{ id: number; email: string; role: string; name: string; bio: string; photo: string | null; cvFile: string | null; company: string; schoolId: number | null }>('/profile')
      .then(data => {
        setRole(data.role as UserRole);
        setProfile({
          name: data.name,
          email: data.email,
          bio: data.bio,
          photo: data.photo ?? undefined,
          cvFile: data.cvFile ?? undefined,
          company: data.company,
          schoolId: data.schoolId ?? null,
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

  const register = async (email: string, password: string, selectedRole: UserRole, opts: RegisterOptions = {}) => {
    const data = await api.post<{ token: string; role: string; schoolId?: number }>('/auth/register', {
      email,
      password,
      role: selectedRole,
      name: opts.name,
      companyName: opts.companyName,
      schoolName: opts.schoolName,
      schoolDomain: opts.schoolDomain,
      contactName: opts.contactName,
      schoolId: opts.schoolId,
    });
    setToken(data.token);
    setRole(data.role as UserRole);
    setProfile({
      name: opts.name || opts.contactName || '',
      email,
      company: opts.companyName || '',
      schoolId: data.schoolId || opts.schoolId || null,
    });
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
