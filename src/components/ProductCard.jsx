import React, { useContext } from "react";
import { ThemeContext } from "../App";

const ProductCard = ({ product }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={`p-4 rounded-lg shadow-md transition-colors duration-300 ease-in-out ${
        isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-800"
      }`}
    >
      <h3
        className={`text-lg font-semibold transition-colors duration-300 ease-in-out ${
          isDarkMode ? "text-green-300" : "text-green-900"
        }`}
      >
        {product.name}
      </h3>
      <p className="text-sm mt-2">{product.description}</p>
      <p
        className={`mt-2 font-medium transition-colors duration-300 ease-in-out ${
          isDarkMode ? "text-green-400" : "text-green-700"
        }`}
      >
        ${product.price}
      </p>
    </div>
  );
};

export default ProductCard;
