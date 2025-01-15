import React, { useState } from "react";
import { Link, Form } from "react-router-dom";
import { useAuth } from "../../context/AuthContext/AuthContext"; // Import useAuth from AuthContext
import { useNotification } from "../../context/NotificationContext/NotificationContext"; // Import useNotification from NotificationContext
import styles from "./LoginPage.module.scss";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth(); // Access the login function from AuthContext
  const notify = useNotification(); // Access the notification function

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData); // Login now triggers notifications
      window.location.href = "/all-adventures"; // Redirect to a protected route
    } catch (err) {
      setError(err.message || "An error occurred during login");
    }
  };

  // Test Notification Handler
  const handleTestNotification = () => {
    notify("success", "This is a test notification!");
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <Form method="post" className={styles.loginForm} onSubmit={handleSubmit}>
          <h1 className={styles.title}>Login</h1>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
          <Link className={styles.linkButton} to="/register">
            Register Here
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
