
import React, { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { RBACProvider } from "@/contexts/RBACContext";
import { RBACDebugProvider } from "@/contexts/rbac/RBACDebugProvider";
import { TripProvider } from "@/contexts/TripContext";
import { ProgressiveLoadingProvider } from "@/contexts/ProgressiveLoadingContext";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/ErrorBoundary";
import NetworkStatusSimple from "@/components/NetworkStatusSimple";
import ProtectedRoute from "@/components/ProtectedRoute";

// Import main components directly instead of lazy loading to fix 404 errors
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

// Optimize QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppLoadingSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="space-y-4 text-center">
      <Skeleton className="h-8 w-32 mx-auto" />
      <Skeleton className="h-4 w-48 mx-auto" />
      <div className="flex space-x-2 justify-center">
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-2 w-2 rounded-full" />
      </div>
    </div>
  </div>
);

const App = () => {
  console.log('🚀 App: Starting application render');
  
  return (
    <ErrorBoundary>
      <NetworkStatusSimple>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <LanguageProvider>
                <RBACDebugProvider>
                  <RBACProvider>
                    <TripProvider>
                      <ProgressiveLoadingProvider>
                        <Suspense fallback={<AppLoadingSkeleton />}>
                          <Routes>
                            <Route path="/auth" element={<AuthPage />} />
                            <Route path="/*" element={
                              <ProtectedRoute>
                                <Index />
                              </ProtectedRoute>
                            } />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </Suspense>
                      </ProgressiveLoadingProvider>
                    </TripProvider>
                  </RBACProvider>
                </RBACDebugProvider>
              </LanguageProvider>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </NetworkStatusSimple>
    </ErrorBoundary>
  );
};

export default App;
