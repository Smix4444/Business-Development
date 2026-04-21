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
  needsVerification: boolean;
  pendingEmail: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, role: UserRole, opts?: RegisterOptions) => Promise<void>;
  resendVerification: () => Promise<string>;
  clearVerification: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

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

  const login = async (email: string, password: string, _selectedRole: UserRole) => {
    try {
      const data = await api.post<{ token: string; role: string; profile: UserProfile }>('/auth/login', { email, password });
      setToken(data.token);
      setRole(data.role as UserRole);
      setProfile(data.profile);
      setNeedsVerification(false);
      setPendingEmail(null);
    } catch (err: any) {
      // Check if the error response contains needsVerification
      if (err.message?.includes('verify your email')) {
        setNeedsVerification(true);
        setPendingEmail(email);
      }
      throw err;
    }
  };

  const register = async (email: string, password: string, selectedRole: UserRole, opts: RegisterOptions = {}) => {
    const data = await api.post<{ token?: string; role?: string; needsVerification?: boolean; email?: string; schoolId?: number }>('/auth/register', {
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

    if (data.needsVerification) {
      setNeedsVerification(true);
      setPendingEmail(email);
      // Don't set token or role — user must verify first
      return;
    }

    // Fallback for already-verified users (shouldn't happen normally)
    if (data.token) {
      setToken(data.token);
      setRole((data.role as UserRole) || selectedRole);
      setProfile({
        name: opts.name || opts.contactName || '',
        email,
        company: opts.companyName || '',
        schoolId: data.schoolId || opts.schoolId || null,
      });
    }
  };

  const resendVerification = async (): Promise<string> => {
    if (!pendingEmail) throw new Error('No email to resend to');
    const data = await api.post<{ success: boolean; message: string; error?: string; retryAfter?: number }>('/auth/resend-verification', { email: pendingEmail });
    return data.message || 'Verification email sent!';
  };

  const clearVerification = () => {
    setNeedsVerification(false);
    setPendingEmail(null);
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
    setNeedsVerification(false);
    setPendingEmail(null);
  };

  return (
    <AuthContext.Provider value={{ role, profile, loading, needsVerification, pendingEmail, login, register, resendVerification, clearVerification, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
