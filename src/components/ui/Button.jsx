import React from "react";
import { Link } from "react-router-dom";

function Button({ to, children, variant, className, ...props }) {
  const baseStyles =
    "px-4 py-2 rounded transition-colors duration-300 ease-in-out";
  const variantStyles =
    variant === "primary"
      ? "bg-red-800 text-white hover:bg-red-900"
      : "bg-stone-200 text-red-600 hover:bg-stone-300";

  if (to) {
    return (
      <Link
        to={to}
        className={`${baseStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
