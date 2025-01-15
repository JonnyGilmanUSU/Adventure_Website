// Import Libraries
import React from "react";

// Import Context Providers
import { NotificationProvider } from "./NotificationContext/NotificationContext";
import { AuthProvider } from "./AuthContext/AuthContext";
import { BlogPostProvider } from "./BlogPostContext/BlogPostContext";

const AppProvider = ({ children }) => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <BlogPostProvider>
          {children}
        </BlogPostProvider>
        </AuthProvider>
    </NotificationProvider>
  );
};

export default AppProvider;
