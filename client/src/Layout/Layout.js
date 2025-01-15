// Import Libraries
import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.scss";

// Import Components
import Header from "./Header/Header.js";
import Footer from "./Footer/Footer.js";
import Map from "../Components/Map/Map/Map.js";

function Layout({ children }) {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <div className={styles.background}>
      </div>
      <Footer />
    </>
  );
}

export default Layout;
