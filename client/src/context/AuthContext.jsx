import { createContext, useEffect, useState } from "react";
import { makeRequest } from "../requestMethod";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle Login - only store token, get user from database
  const login = async (token) => {
    try {
      // Store only the token
      localStorage.setItem("token", token);

      // Get fresh user data from database
      const response = await makeRequest.get("/users/me");

      setCurrentUser(response.data);
    } catch (error) {
      console.error("Login error:", error);
      localStorage.removeItem("token");
      setCurrentUser(null);
      throw error;
    }
  };

  // Handle Logout
  const logout = async () => {
    try {
      await makeRequest.post("/auth/logout");
      toast.success("LoggedOut Success 🥲");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Only remove token, no user data stored
      localStorage.removeItem("token");
      setCurrentUser(null);
    }
  };

  // Check if user is authenticated - only check token, get user from database
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Always get fresh user data from database
          const response = await makeRequest.get("/users/me");

          if (response.data) {
            // Set user data from database response
            setCurrentUser(response.data);
          } else {
            console.error("Auth check failed:", response.data.errors);
            localStorage.removeItem("token");
            setCurrentUser(null);
          }
        } catch (error) {
          console.error("Auth check failed:", error);

          // If token is invalid, remove it
          localStorage.removeItem("token");
          setCurrentUser(null);
        }
      } else {
        // No token, user is not authenticated
        setCurrentUser(null);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Loading
  if (loading) {
    return (
      <LoadingSpinner fullScreen={true} text="Initializing..." size="lg" />
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
