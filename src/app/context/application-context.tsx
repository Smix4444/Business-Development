import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { api } from '../../lib/api';

export interface Internship {
  id: string | number;
  company: string;
  role: string;
  location: string;
  duration: string;
  description: string;
  requirements: string[];
  tags: string[];
  logo: string;
}

interface Application {
  id?: number;
  internship: Internship;
  message: string;
  appliedAt: Date;
  status?: string;
}

interface ApplicationContextType {
  applications: Application[];
  addApplication: (internship: Internship, message: string) => Promise<void>;
  refreshApplications: () => Promise<void>;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([]);

  const refreshApplications = useCallback(async () => {
    try {
      const data = await api.get<Array<{ id: number; message: string; status: string; appliedAt: string; internship: Internship }>>('/applications');
      setApplications(
        data.map(a => ({
          id: a.id,
          internship: a.internship,
          message: a.message,
          appliedAt: new Date(a.appliedAt),
          status: a.status,
        }))
      );
    } catch {
      // User not logged in yet — leave empty
    }
  }, []);

  const addApplication = async (internship: Internship, message: string) => {
    await api.post('/applications', { internshipId: internship.id, message });
    setApplications(prev => [
      ...prev,
      { internship, message, appliedAt: new Date(), status: 'pending' },
    ]);
  };

  return (
    <ApplicationContext.Provider value={{ applications, addApplication, refreshApplications }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationContext);
  if (!context) throw new Error('useApplications must be used within ApplicationProvider');
  return context;
}
