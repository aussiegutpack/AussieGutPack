import React, { useContext } from 'react';
import { ThemeContext } from '../../App'; // Assuming ThemeContext is needed
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa';

function Footer() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <footer className={`p-6 text-center ${
      isDarkMode ? "bg-stone-800 text-white" : "bg-red-800 text-white"
    }`}>
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
  );
}

export default Footer; 