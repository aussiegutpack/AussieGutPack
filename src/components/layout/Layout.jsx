// src/components/layout/Layout.jsx
import React, { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ThemeContext } from "../../App";
import { AuthContext } from "../../context/AuthContext";
import Navigation from "./Navigation";
// Import social media icons from react-icons
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";

const Layout = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <div className="min-h-screen flex flex-col bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
        {/* Navigation */}
        <Navigation location={location} />

        {/* Main Content */}
        <main className="flex-1 pt-20 sm:pt-24 md:pt-28">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-red-800 text-white p-6 text-center">
          <div className="mb-4">
            {/* Social Media Icons */}
            <div className="flex justify-center space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-400 transition-colors duration-200"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-400 transition-colors duration-200"
                aria-label="Twitter"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-400 transition-colors duration-200"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-400 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-400 transition-colors duration-200"
                aria-label="YouTube"
              >
                <FaYoutube size={24} />
              </a>
            </div>
          </div>
          <p>
            © {new Date().getFullYear()} Aussie Gut Pack. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
