// src/components/layout/Layout.jsx
import React, { useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import { ThemeContext } from "../../App";
import { AuthContext } from "../../context/AuthContext";
import Navigation from "./Navigation";

const Layout = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <div className="min-h-screen flex flex-col bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main className="flex-1 pt-20 sm:pt-24 md:pt-28">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-red-800 text-white p-4 text-center">
          <p>
            © {new Date().getFullYear()} Aussie Gut Pack. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
