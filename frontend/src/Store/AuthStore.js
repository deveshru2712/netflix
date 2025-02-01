import axios from "axios";
import { create } from "zustand";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isCheckingAuth: true,
  isLoggingIn: false,
  isLoggingOut: false,
  signup: async (credentials) => {
    set({ isSigningUp: true });
    try {
      const response = await axios.post(`/api/auth/signup`, credentials);

      set({ user: response.data.user, isSigningUp: false });

      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.message || "An error occurred");
      set({ user: null, isSigningUp: false });
    }
  },
  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const response = await axios.post(`/api/auth/login`, credentials);

      set({ user: response.data.user, isLoggingIn: false });

      toast.success("Successfully logged in");
    } catch (error) {
      set({
        user: null,
        isLoggingIn: false,
      });
      console.log(error.response.data.message || "Error Occurred");
    }
  },
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      const response = await axios.post(`/api/auth/logout`);
      console.log(`logging out`);
      set({
        user: null,
        isLoggingOut: false,
      });
      toast.success(`User logged out successfully`);
    } catch (error) {
      set({ user: null, isLoggingOut: false });
      console.log(error.response.data.message || `Error occurred`);
    }
  },
  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get(`/api/auth/check`);
      set({ user: response.data.user, isCheckingAuth: false });
    } catch (error) {
      set({ isCheckingAuth: false, user: null });
    }
  },
}));
