import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";
import logo from "../../Assets/logo.png";

const Footer = () => {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        {/* Left Column */}
        <div className={styles.column}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <p className={styles.description}>PIGBOT AND SAYDIE ADVENTURES</p>
        </div>

        {/* Middle Column */}
        <div className={styles.column}>
          <h3 className={styles.title}>Quick Links</h3>
          <ul className={styles.links}>
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
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
