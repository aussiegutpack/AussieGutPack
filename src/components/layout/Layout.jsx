// src/components/layout/Layout.jsx
import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { ThemeContext } from "../../App";
import Navigation from "./Navigation";

function Layout() {
  const { isDarkMode } = useContext(ThemeContext);

  const socialLinks = [
    {
      name: "Facebook",
      icon: "fab fa-facebook-f",
      url: "https://facebook.com",
    },
    { name: "Twitter/X", icon: "fab fa-x-twitter", url: "https://x.com" },
    {
      name: "Instagram",
      icon: "fab fa-instagram",
      url: "https://instagram.com",
    },
    {
      name: "LinkedIn",
      icon: "fab fa-linkedin-in",
      url: "https://linkedin.com",
    },
    { name: "YouTube", icon: "fab fa-youtube", url: "https://youtube.com" },
    {
      name: "Pinterest",
      icon: "fab fa-pinterest-p",
      url: "https://pinterest.com",
    },
    { name: "TikTok", icon: "fab fa-tiktok", url: "https://tiktok.com" },
    { name: "GitHub", icon: "fab fa-github", url: "https://github.com" },
  ];

  return (
    <div
      className={`relative min-h-screen ${
        isDarkMode ? "bg-stone-900" : "bg-white"
      }`}
    >
      <Navigation />
      <main className="container mx-auto px-4 py-8 md:pt-16">
        <Outlet />
      </main>
      <footer
        className={`py-4 text-center text-sm backdrop-blur-sm ${
          isDarkMode
            ? "bg-stone-900/80 text-white"
            : "bg-white/80 text-stone-600"
        }`}
      >
        <div className="mb-2">
          © 2025 Aussie Gut Pack - Your Gut Health Companion
        </div>
        <div className="flex justify-center space-x-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-lg transition-colors duration-300 ${
                isDarkMode
                  ? "text-stone-400 hover:text-stone-200"
                  : "text-stone-600 hover:text-red-800"
              }`}
              aria-label={`Follow us on ${social.name}`}
            >
              <i className={social.icon}></i>
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default Layout;
