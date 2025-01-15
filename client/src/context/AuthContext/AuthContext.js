import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser } from "../../api/auth/login";
import { useNotification } from "../NotificationContext/NotificationContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const notify = useNotification();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const adminStatus = localStorage.getItem("isAdmin") === "true";

    if (token) {
      setIsLoggedIn(true);
      setIsAdmin(adminStatus);
    }
  }, []);

  // Login function to handle the entire login process
  const login = async (data) => {
    try {
      const { token, admin, username } = await loginUser(data);

      // Update localStorage and state
      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", admin);

      setIsLoggedIn(true);
      setIsAdmin(admin);

      // Trigger Successful Login Notification
      notify("success", `Welcome, ${username}!`);
      console.log(username)

      return { username };
    } catch (err) {
      throw err;
    }
  };

  // Logout function to clear localStorage and reset state
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    setIsLoggedIn(false);
    setIsAdmin(false);
    notify('info', "You have been logged out.")
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
