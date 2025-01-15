// Import Libraries
import React, { useState } from "react";
import { Link, Form } from "react-router-dom";
import { registerUser } from "../../api/auth/register";

// Import Styles
import styles from "./RegisterPage.module.scss";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      // API call to register the user
      const response = await registerUser(formData);
      setSuccess(true);
      alert(response.message);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred during registration");
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <Form method="post" className={styles.loginForm} onSubmit={handleSubmit}>
          <h1 className={styles.title}>Register</h1>
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
          {success && <p className={styles.success}>Registration successful! You can now <Link to="/login">Login</Link>.</p>}
          <button type="submit" className={styles.loginButton}>
            Register
          </button>
          <Link className={styles.linkButton} to="/login">
            Login Here
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;