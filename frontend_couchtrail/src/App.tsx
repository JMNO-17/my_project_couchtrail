import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth/AuthContext";
import { Navbar } from "@/components/navigation/Navbar";

import Index from "./pages/Index";
import { AuthPage } from "./pages/AuthPage";
import { CommunityPage } from "./pages/CommunityPage";
import { MessagesPage } from "./pages/MessagesPage";
import { RequestsPage } from "./pages/RequestsPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { AdminPanel } from "@/components/admin/AdminPanel";
import NotFound from "./pages/NotFound";
import { HostingPage } from "./pages/HostingPage";

const ProtectedRoute = ({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) => {
  const { user } = useAuth();

  if (!user) {
    return <AuthPage />;
  }

  if (adminOnly && !user.isAdmin) {
    return <NotFound />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Show AdminPanel if admin, CommunityPage otherwise */}
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              {user?.role === "admin" ? <AdminPanel /> : <CommunityPage />}
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
          path="/reviews"
          element={
            <ProtectedRoute>
              <ReviewsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route path="/profile/:hostId" element={<ProfilePage />} />


        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

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
