// src/components/layout/Navigation.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../App";

const Navigation = ({ location }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

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
    setIsMenuOpen(!isMenuOpen);
  };

  // Helper function to determine if a link is active
  const isActive = (path) => location.pathname === path;

  // Get the username from user_metadata, fallback to "User" if not set
  const username = user?.user_metadata?.displayName || "User";

  return (
    <nav
      className={`sticky top-0 z-50 shadow-md ${
        isDarkMode ? "bg-stone-900 text-red-400" : "bg-white text-red-800"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Aussie Gut Pack
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            to="/"
            className={`hover:text-red-600 transition-colors duration-200 ${
              isActive("/") ? "text-red-600 font-semibold" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`hover:text-red-600 transition-colors duration-200 ${
              isActive("/products") ? "text-red-600 font-semibold" : ""
            }`}
          >
            Products
          </Link>

          <Link
            to="/blog"
            className={`hover:text-red-600 transition-colors duration-200 ${
              isActive("/blog") ? "text-red-600 font-semibold" : ""
            }`}
          >
            Blog
          </Link>

          <Link
            to="/contact"
            className={`hover:text-red-600 transition-colors duration-200 ${
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
                className={`text-sm hover:text-red-600 transition-colors duration-200 ${
                  isActive("/profile") ? "text-red-600 font-semibold" : ""
                }`}
              >
                Welcome, {username} {/* Display username instead of email */}
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
            >
              Login
            </Link>
          )}
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors duration-200"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors duration-200"
        >
          {isMenuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-2 border-t border-stone-200 dark:border-stone-700">
          <Link
            to="/"
            onClick={toggleMenu}
            className={`block py-2 hover:text-red-600 transition-colors duration-200 ${
              isActive("/") ? "text-red-600 font-semibold" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={toggleMenu}
            className={`block py-2 hover:text-red-600 transition-colors duration-200 ${
              isActive("/products") ? "text-red-600 font-semibold" : ""
            }`}
          >
            Products
          </Link>

          <Link
            to="/blog"
            onClick={toggleMenu}
            className={`block py-2 hover:text-red-600 transition-colors duration-200 ${
              isActive("/blog") ? "text-red-600 font-semibold" : ""
            }`}
          >
            Blog
          </Link>
          <Link
            to="/faq"
            onClick={toggleMenu}
            className={`block py-2 hover:text-red-600 transition-colors duration-200 ${
              isActive("/faq") ? "text-red-600 font-semibold" : ""
            }`}
          >
            FAQ
          </Link>
          <Link
            to="/contact"
            onClick={toggleMenu}
            className={`block py-2 hover:text-red-600 transition-colors duration-200 ${
              isActive("/contact") ? "text-red-600 font-semibold" : ""
            }`}
          >
            Contact
          </Link>
          <Link
            to="/nutrition"
            onClick={toggleMenu}
            className={`block py-2 hover:text-red-600 transition-colors duration-200 ${
              isActive("/nutrition") ? "text-red-600 font-semibold" : ""
            }`}
          >
            Nutrition
          </Link>

          {/* Profile Link in Mobile Menu */}
          {user && (
            <Link
              to="/profile"
              onClick={toggleMenu}
              className={`block py-2 hover:text-red-600 transition-colors duration-200 ${
                isActive("/profile") ? "text-red-600 font-semibold" : ""
              }`}
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
            className="block py-2 hover:text-red-600 transition-colors duration-200"
          >
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          {/* Auth Links */}
          {loading ? (
            <span className="block py-2">Loading...</span>
          ) : user ? (
            <>
              <span className="block py-2 text-sm">
                Welcome, {username} {/* Display username instead of email */}
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="block py-2 text-left w-full text-white bg-red-600 hover:bg-red-700 rounded-lg px-4 transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={toggleMenu}
              className="block py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg px-4 transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
