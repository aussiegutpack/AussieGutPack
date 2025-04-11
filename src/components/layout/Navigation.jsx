// src/components/layout/Navigation.jsx
import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../App";

const Navigation = ({ location }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const menuButtonRef = useRef(null);
  const firstMenuItemRef = useRef(null);

  console.log("Rendering Navigation component. isMenuOpen:", isMenuOpen);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  const toggleMenu = () => {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
      // Focus the first menu item when the menu opens
      setTimeout(() => firstMenuItemRef.current?.focus(), 100);
    } else {
      setIsMenuOpen(false);
      // Return focus to the menu button when the menu closes
      menuButtonRef.current?.focus();
    }
  };

  // Close menu on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  // Helper function to determine if a link is active
  const isActive = (path) => location.pathname === path;

  // Get the username from user_metadata, fallback to "User" if not set
  const username = user?.user_metadata?.displayName || "User";

  return (
    <>
      {/* Skip to Content Link */}
      <a
        href="#main-content"
        className="fixed top-0 left-0 p-2 bg-red-600 text-white focus:top-4 focus:left-4 z-50 transition-all duration-200"
      >
        Skip to Content
      </a>

      <nav
        className={`sticky top-0 z-50 shadow-md ${
          isDarkMode ? "bg-stone-900 text-red-400" : "bg-white text-red-800"
        } transition-colors duration-300`}
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-tight">
            Aussie Gut Pack
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6 items-center">
            <Link
              to="/"
              className={`nav-link hover:text-red-600 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 rounded transition-colors duration-200 ${
                isActive("/") ? "text-red-600 font-semibold" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`nav-link hover:text-red-600 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 rounded transition-colors duration-200 ${
                isActive("/products") ? "text-red-600 font-semibold" : ""
              }`}
            >
              Products
            </Link>
            <Link
              to="/blog"
              className={`nav-link hover:text-red-600 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 rounded transition-colors duration-200 ${
                isActive("/blog") ? "text-red-600 font-semibold" : ""
              }`}
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className={`nav-link hover:text-red-600 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 rounded transition-colors duration-200 ${
                isActive("/contact") ? "text-red-600 font-semibold" : ""
              }`}
            >
              Contact
            </Link>

            {/* Auth Links */}
            {loading ? (
              <span>Loading...</span>
            ) : user ? (
              <>
                <Link
                  to="/profile"
                  className={`nav-link text-sm hover:text-red-600 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 rounded transition-colors duration-200 ${
                    isActive("/profile") ? "text-red-600 font-semibold" : ""
                  }`}
                >
                  Welcome, {username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-200"
              >
                Login
              </Link>
            )}
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-200"
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="lg:hidden p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-200"
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Mobile Menu Backdrop */}
        {isMenuOpen && (
          <div
            className="mobile-menu-backdrop active lg:hidden"
            onClick={toggleMenu}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                toggleMenu();
              }
            }}
            aria-label="Close mobile menu"
          ></div>
        )}

        {/* Mobile Menu */}
        <div
          className={`lg:hidden px-4 py-4 ${
            isMenuOpen ? "mobile-menu-open" : "mobile-menu-closed"
          } ${
            isDarkMode
              ? "bg-stone-800 border-t border-stone-700"
              : "bg-red-50 border-t border-red-200"
          } shadow-md`}
        >
          <Link
            ref={firstMenuItemRef}
            to="/"
            onClick={toggleMenu}
            className={`nav-link block py-2 px-3 rounded-lg hover:text-red-600 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-200 ${
              isActive("/") ? "text-red-600 font-semibold" : ""
            } ${isDarkMode ? "text-red-400" : "text-red-800"}`}
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={toggleMenu}
            className={`nav-link block py-2 px-3 rounded-lg hover:text-red-600 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-200 ${
              isActive("/products") ? "text-red-600 font-semibold" : ""
            } ${isDarkMode ? "text-red-400" : "text-red-800"}`}
          >
            Products
          </Link>
          <Link
            to="/blog"
            onClick={toggleMenu}
            className={`nav-link block py-2 px-3 rounded-lg hover:text-red-600 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-200 ${
              isActive("/blog") ? "text-red-600 font-semibold" : ""
            } ${isDarkMode ? "text-red-400" : "text-red-800"}`}
          >
            Blog
          </Link>
          <Link
            to="/faq"
            onClick={toggleMenu}
            className={`nav-link block py-2 px-3 rounded-lg hover:text-red-600 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-200 ${
              isActive("/faq") ? "text-red-600 font-semibold" : ""
            } ${isDarkMode ? "text-red-400" : "text-red-800"}`}
          >
            FAQ
          </Link>
          <Link
            to="/contact"
            onClick={toggleMenu}
            className={`nav-link block py-2 px-3 rounded-lg hover:text-red-600 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-200 ${
              isActive("/contact") ? "text-red-600 font-semibold" : ""
            } ${isDarkMode ? "text-red-400" : "text-red-800"}`}
          >
            Contact
          </Link>
          <Link
            to="/nutrition"
            onClick={toggleMenu}
            className={`nav-link block py-2 px-3 rounded-lg hover:text-red-600 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-200 ${
              isActive("/nutrition") ? "text-red-600 font-semibold" : ""
            } ${isDarkMode ? "text-red-400" : "text-red-800"}`}
          >
            Nutrition
          </Link>

          {/* Profile Link in Mobile Menu */}
          {user && (
            <Link
              to="/profile"
              onClick={toggleMenu}
              className={`nav-link block py-2 px-3 rounded-lg hover:text-red-600 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-200 ${
                isActive("/profile") ? "text-red-600 font-semibold" : ""
              } ${isDarkMode ? "text-red-400" : "text-red-800"}`}
            >
              Profile
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => {
              toggleTheme();
              toggleMenu();
            }}
            className={`nav-link block py-2 px-3 rounded-lg hover:text-red-600 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-200 ${
              isDarkMode ? "text-red-400" : "text-red-800"
            }`}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          {/* Auth Links */}
          {loading ? (
            <span className="block py-2 px-3">Loading...</span>
          ) : user ? (
            <>
              <span
                className={`block py-2 px-3 text-sm ${
                  isDarkMode ? "text-red-400" : "text-red-800"
                }`}
              >
                Welcome, {username}
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="block py-2 px-3 text-left w-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={toggleMenu}
              className="block py-2 px-3 text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 rounded-lg transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
