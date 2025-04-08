// src/components/layout/Navigation.jsx
import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dog, Menu, X, Sun, Moon } from "lucide-react";
import { ThemeContext } from "../../App";

function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contact" },
    { name: "Fitness Tracker", href: "/fitness-tracker" },
    { name: "Nutrition", href: "/nutrition" }, // Updated to standalone /nutrition
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Helper function to determine if a nav item is active
  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    if (href === "/fitness-tracker") {
      return location.pathname.startsWith(href);
    }
    return location.pathname === href; // Simplified logic for other pages
  };

  // Debug: Log to check if the hamburger menu button is being rendered
  console.log("Rendering Navigation component. isMenuOpen:", isMenuOpen);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 shadow-md transition-colors duration-300 ease-in-out ${
        isDarkMode ? "bg-stone-900 text-red-400" : "bg-red-800 text-white"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Title */}
        <Link
          to="/"
          className="flex items-center space-x-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <Dog
            className={`w-6 h-6 ${isDarkMode ? "text-red-400" : "text-white"}`}
          />
          <span className="text-xl font-bold">Aussie Gut Pack</span>
        </Link>

        {/* Hamburger Menu (Mobile) */}
        <div className="block md:hidden">
          <button
            onClick={toggleMenu}
            className="focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Desktop Navigation Links and Theme Toggle */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                isActive(item.href)
                  ? "bg-red-600 text-white"
                  : "hover:bg-red-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-md transition-colors duration-200 ${
              isDarkMode
                ? "bg-red-800 hover:bg-red-900 W"
                : "bg-red-700 hover:bg-red-800"
            }`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6 text-white" />
            ) : (
              <Moon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`block md:hidden flex flex-col space-y-2 py-4 px-6 transition-all duration-300 ease-in-out ${
            isDarkMode ? "bg-stone-900 text-red-400" : "bg-red-800 text-white"
          } border-t ${isDarkMode ? "border-stone-700" : "border-red-900"}`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                isActive(item.href)
                  ? "bg-red-600 text-white"
                  : "hover:bg-red-700"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className={`px-3 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2 ${
              isDarkMode
                ? "bg-red-800 hover:bg-red-900"
                : "bg-red-700 hover:bg-red-800"
            }`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6 text-white" />
            ) : (
              <Moon className="w-6 h-6 text-white" />
            )}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
