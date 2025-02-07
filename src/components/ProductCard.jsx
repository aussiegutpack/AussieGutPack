import React from "react";
import { ShoppingCart } from "lucide-react";

function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold text-green-800 mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-green-700">
          ${product.price}
        </span>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center">
          <ShoppingCart className="mr-2" size={20} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
