// src/components/layout/Layout.jsx
import React, { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ThemeContext } from "../../App";
import { AuthContext } from "../../context/AuthContext";
import Navigation from "./Navigation";
import Footer from './Footer';
// Import social media icons from react-icons
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";

console.log('Layout.jsx: Loading Layout component');

const Layout = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  console.log('Layout.jsx: Rendering Layout. Pathname:', location.pathname, 'User:', user ? 'Authenticated' : 'Not Authenticated');

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <div className="min-h-screen flex flex-col bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
        {/* Navigation */}
        <Navigation location={location} />

        {/* Main Content */}
        <main className="flex-1 pt-20 sm:pt-24 md:pt-28">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
