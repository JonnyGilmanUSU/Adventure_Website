import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext/AuthContext"; // Import your AuthContext
import styles from "./Header.module.scss";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons
import logo from "../../Assets/logo.png";

const Header = () => {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={styles.background}>
      <nav className={styles.desktopNav}>
        <div>
          <Link to="/">
            <img className={styles.logo} src={logo} alt="" />
          </Link>
        </div>
        <ul>
          <li>
            <Link to="/all-adventures">Adventures</Link>
          </li>
          <li>
            <Link to="/adventure-categories">Categories</Link>
          </li>
          <li>
            <Link to="/adventure-locations">Locations</Link>
          </li>
          <li>
            <Link to="/map">Map</Link>
          </li>
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <li>
                  <Link to="/admin">Admin</Link>
                </li>
              )}
              <li onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </li>
            </>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Mobile Navigation */}
      <nav className={styles.mobileNav}>
        <div className={styles.mobileHeader}>
          <Link className={styles.logo} to="/">
            <img className={styles.logo} src={logo} alt="" />
          </Link>
          <FaBars className={styles.menuIcon} onClick={toggleMobileMenu} />
        </div>
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <ul>
              <li onClick={closeMobileMenu}>
                <Link to="/all-adventures">Adventures</Link>
              </li>
              <li onClick={closeMobileMenu}>
                <Link to="/adventure-categories">Categories</Link>
              </li>
              <li onClick={closeMobileMenu}>
                <Link to="/adventure-locations">Locations</Link>
              </li>
              <li>
                <Link to="/map">Map</Link>
              </li>
              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <li onClick={closeMobileMenu}>
                      <Link to="/admin">Admin</Link>
                    </li>
                  )}
                  <li
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className={styles.logoutButton}
                  >
                    Logout
                  </li>
                </>
              ) : (
                <li onClick={closeMobileMenu}>
                  <Link to="/login">Login</Link>
                </li>
              )}
              <li>
                <FaTimes
                  className={styles.closeIcon}
                  onClick={toggleMobileMenu}
                />
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Header;
