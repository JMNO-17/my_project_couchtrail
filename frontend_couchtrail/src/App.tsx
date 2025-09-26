// App.tsx
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth/AuthContext";
import { Navbar } from "@/components/navigation/Navbar";

// Pages
import Index from "./pages/Index"; // default export
import { AuthPage } from "./pages/AuthPage"; // named export
import { CommunityPage } from "./pages/CommunityPage"; // named export
import { MessagesPage } from "./pages/MessagesPage"; // named export
import { RequestsPage } from "./pages/RequestsPage"; // named export
import { ReviewsPage } from "./pages/ReviewsPage"; // named export
// named export
import { UserProfilePage } from "./pages/UserProfilePage"; // named export
import { HostingPage } from "./pages/HostingPage"; // named export
import { AdminPanel } from "@/components/admin/AdminPanel"; // named export
import NotFound from "./pages/NotFound"; // default export
import { ProfilePage } from "./pages/ProfilePage";

type ProtectedProps = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

// Protected route wrapper
const ProtectedRoute = ({ children, adminOnly = false }: ProtectedProps) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth" replace />;

  const isAdmin = user.role === "admin" || user.isAdmin === true;
  if (adminOnly && !isAdmin) return <NotFound />;

  return <>{children}</>;
};

// Main App content
const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected */}
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <CommunityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hosting"
          element={
            <ProtectedRoute>
              <HostingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <RequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />

        {/* Reviews page */}
        <Route
          path="/reviews/:userId"
          element={
            <ProtectedRoute>
              <ReviewsPage />
            </ProtectedRoute>
          }
        />

        {/* Own profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Other user's profile */}
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admin panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

// Main App
const App: React.FC = () => {
  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
    []
  );

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <AuthProvider>
              <AppContent />
              <Toaster />
              <Sonner />
            </AuthProvider>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
