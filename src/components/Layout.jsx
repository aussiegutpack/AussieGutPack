import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { ThemeContext } from "../App";
import Navigation from "./Navigation";

function Layout() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ease-in-out ${
        isDarkMode ? "bg-transparent" : "bg-transparent"
      }`}
    >
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer
        className={`py-4 text-center text-sm transition-colors duration-300 ease-in-out ${
          isDarkMode
            ? "bg-gray-800 text-gray-300"
            : "bg-green-100/80 text-gray-700"
        } backdrop-blur-sm`}
      >
        © 2024 Aussie Gut Pack - Your Gut Health Companion
      </footer>
    </div>
  );
}

export default Layout;
