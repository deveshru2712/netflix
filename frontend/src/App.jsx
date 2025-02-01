import { Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import { useAuthStore } from "./Store/AuthStore";

// Lazy load components
const HomePage = React.lazy(() => import("./Pages/Home/HomePage"));
const LoginPage = React.lazy(() => import("./Pages/LoginPage"));
const SignupPage = React.lazy(() => import("./Pages/SignupPage"));
const WatchPage = React.lazy(() => import("./Pages/WatchPage"));
const SearchPage = React.lazy(() => import("./Pages/SearchPage"));
const HistoryPage = React.lazy(() => import("./Pages/HistoryPage"));
const NotFoundPage = React.lazy(() => import("./Pages/NotFoundPage"));
const Footer = React.lazy(() => import("./Components/Footer"));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="h-screen">
    <div className="flex justify-center items-center bg-black h-full">
      <Loader className="animate-spin text-red-600 size-10" />
    </div>
  </div>
);

const App = () => {
  const { user, isCheckingAuth, authCheck } = useAuthStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <div className="text-red-500">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!user ? <SignupPage /> : <Navigate to="/" />}
          />
          <Route
            path="/watch/:id"
            element={user ? <WatchPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/search"
            element={user ? <SearchPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/history"
            element={user ? <HistoryPage /> : <Navigate to="/login" />}
          />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
        <Toaster />
      </Suspense>
    </div>
  );
};

export default App;
