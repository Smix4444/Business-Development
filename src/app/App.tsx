import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { ApplicationProvider } from "./context/application-context";
import { AuthProvider } from "./context/auth-context";

export default function App() {
  return (
    <AuthProvider>
      <ApplicationProvider>
        <RouterProvider router={router} />
        <Toaster />
      </ApplicationProvider>
    </AuthProvider>
  );
}