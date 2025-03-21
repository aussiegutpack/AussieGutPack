// src/components/ui/Button.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../App";

const Button = ({
  to,
  children,
  variant = "primary",
  className = "",
  onClick,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const baseStyles =
    "px-6 py-3 rounded-lg text-white transition-colors duration-300 ease-in-out";
  const variantStyles =
    variant === "primary"
      ? isDarkMode
        ? "bg-gray-700 hover:bg-gray-600"
        : "bg-green-600 hover:bg-green-700"
      : isDarkMode
      ? "bg-gray-600 hover:bg-gray-500"
      : "bg-purple-600 hover:bg-purple-700";

  if (to) {
    return (
      <Link
        to={to}
        className={`${baseStyles} ${variantStyles} ${className}`}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
