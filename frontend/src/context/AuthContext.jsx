import React, { createContext, useContext, useState, useEffect } from "react";
import { customerAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current session on mount via GET /customers/me
  const checkAuth = async () => {
    try {
      const response = await customerAPI.getMe();
      // Handle response shapes (either customer object directly or { success, customer })
      const customerData = response.data?.customer || response.data;
      setUser(customerData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await customerAPI.login({ email, password });
    await checkAuth();
    return res.data;
  };

  const register = async (userData) => {
    const res = await customerAPI.register(userData);
    return res.data;
  };

  const logout = async () => {
    try {
      await customerAPI.logout();
    } catch (e) {
      console.warn("Logout error:", e.message);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
