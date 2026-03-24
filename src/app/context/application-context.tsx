import { createContext, useContext, useState, ReactNode } from "react";
import { Internship } from "../data/internships";

interface Application {
  internship: Internship;
  message: string;
  appliedAt: Date;
}

interface ApplicationContextType {
  applications: Application[];
  addApplication: (internship: Internship, message: string) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([]);

  const addApplication = (internship: Internship, message: string) => {
    setApplications((prev) => [
      ...prev,
      {
        internship,
        message,
        appliedAt: new Date(),
      },
    ]);
  };

  return (
    <ApplicationContext.Provider value={{ applications, addApplication }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error("useApplications must be used within ApplicationProvider");
  }
  return context;
}
