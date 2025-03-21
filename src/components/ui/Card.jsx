import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../App";

function Card({ title, content, footer, className }) {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={`p-4 border rounded-lg shadow-md ${
        isDarkMode ? "bg-stone-800 border-stone-700" : "bg-white border-red-300"
      } ${className}`}
    >
      <h3
        className={`text-xl font-semibold transition-colors duration-300 ease-in-out ${
          isDarkMode ? "text-red-400" : "text-red-800"
        }`}
      >
        {title}
      </h3>
      {content && (
        <p
          className={`mt-2 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-white" : "text-red-600"
          }`}
        >
          {content}
        </p>
      )}
      {footer && (
        <p
          className={`mt-2 text-sm transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-white" : "text-red-600"
          }`}
        >
          {footer}
        </p>
      )}
    </div>
  );
}

export default Card;
