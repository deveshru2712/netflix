import { Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { Loader } from "lucide-react";

import HomePage from "./Pages/Home/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import WatchPage from "./Pages/WatchPage";
import SearchPage from "./Pages/SearchPage";
import HistoryPage from "./Pages/HistoryPage";
import NotFoundPage from "./Pages/NotFoundPage";

import Footer from "./Components/Footer";

import { useAuthStore } from "./Store/AuthStore";

const App = () => {
  const { user, isCheckingAuth, authCheck } = useAuthStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-black h-full">
          <Loader className="animate-spin text-red-600 size-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="text-red-500">
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

        <Route path="/*" element={<NotFoundPage />}></Route>
      </Routes>
      <Footer />
      <Toaster />
    </div>
  );
};

export default App;
