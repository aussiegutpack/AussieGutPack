import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../App";
import Button from "./Button";
import Card from "./Card";

const ProductCard = ({ product }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <Card
      title={product.name}
      content={
        <p
          className={`text-base transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-stone-300" : "text-stone-600"
          }`}
        >
          {product.description}
        </p>
      }
      footer={
        <div className="flex justify-between items-center">
          <span
            className={`text-sm transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-stone-400" : "text-stone-500"
            }`}
          >
            ${product.price.toFixed(2)}
          </span>
          <Button
            to={`/shop/product/${product.id}`}
            variant="primary"
            className={`text-sm py-1 px-3 ${
              isDarkMode
                ? "bg-red-800 text-white hover:bg-red-900"
                : "bg-red-800 text-white hover:bg-red-900"
            }`}
          >
            View Details
          </Button>
        </div>
      }
      className={`p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
        isDarkMode
          ? "bg-stone-800 hover:bg-stone-700"
          : "bg-white hover:bg-stone-100"
      } hover:shadow-lg`}
    />
  );
};

export default ProductCard;
