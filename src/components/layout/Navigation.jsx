// src/components/layout/Navigation.jsx
import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dog } from "lucide-react";
import { ThemeContext } from "../../App";

function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const navItems = [
    { name: "Home", href: "/" },

    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/faq" },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contact" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-20 shadow-md transition-colors duration-300 ease-in-out ${
        isDarkMode ? "bg-stone-900 text-red-400" : "bg-white text-red-800"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="focus:outline-none"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-1 mb-1.5 transition-all duration-300 ${
                isDarkMode ? "bg-stone-400" : "bg-red-800"
              } ${isMenuOpen ? "rotate-45 translate-y-2.5" : ""}`}
            />
            <span
              className={`block w-6 h-1 mb-1.5 transition-all duration-300 ${
                isDarkMode ? "bg-stone-400" : "bg-red-800"
              } ${isMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-1 transition-all duration-300 ${
                isDarkMode ? "bg-stone-400" : "bg-red-800"
              } ${isMenuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}
            />
          </button>
        </div>
        <div className="flex-grow text-center">
          <Link
            to="/"
            className="flex justify-center items-center space-x-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <Dog
              className={`w-6 h-6 ${
                isDarkMode ? "text-stone-400" : "text-red-800"
              }`}
            />
            <span className="text-xl font-bold">Aussie Gut Pack</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                location.pathname === item.href
                  ? isDarkMode
                    ? "bg-red-800 text-white"
                    : "bg-red-100 text-red-800"
                  : isDarkMode
                  ? "hover:bg-red-900"
                  : "hover:bg-red-200"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className={`px-3 py-2 rounded-md transition-colors duration-200 ${
              isDarkMode
                ? "bg-red-800 text-white hover:bg-red-900"
                : "bg-red-800 text-white hover:bg-red-900"
            }`}
          >
            {isDarkMode ? "Light" : "Dark"}
          </button>
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleTheme}
            className={`px-3 py-1 rounded-md transition-colors duration-200 ${
              isDarkMode
                ? "bg-red-800 text-white hover:bg-red-900"
                : "bg-red-800 text-white hover:bg-red-900"
            }`}
          >
            {isDarkMode ? "L" : "D"}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div
          className={`md:hidden flex flex-col space-y-2 py-4 px-6 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "bg-stone-900 text-stone-400" : "bg-white text-red-800"
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                location.pathname === item.href
                  ? isDarkMode
                    ? "bg-red-800 text-white"
                    : "bg-red-100 text-red-800"
                  : isDarkMode
                  ? "hover:bg-red-900"
                  : "hover:bg-red-200"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navigation;
