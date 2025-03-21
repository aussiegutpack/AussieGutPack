// src/components/ui/Card.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../../App";

const Card = ({ title, content, footer, onClick, className = "" }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={`p-4 rounded-lg shadow-md transition-shadow duration-300 ease-in-out ${
        isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-800"
      } ${className}`}
      onClick={onClick}
    >
      {title && (
        <h3
          className={`text-lg font-semibold ${
            isDarkMode ? "text-green-300" : "text-green-900"
          }`}
        >
          {title}
        </h3>
      )}
      {content && <p className="text-sm mt-2">{content}</p>}
      {footer && (
        <div
          className={`mt-2 font-medium ${
            isDarkMode ? "text-green-400" : "text-green-700"
          }`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
