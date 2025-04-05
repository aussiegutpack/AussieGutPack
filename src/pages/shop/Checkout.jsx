// src/pages/shop/Checkout.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../../App";
import { useCart } from "../../context/CartContext";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

function Checkout() {
  const { isDarkMode } = useContext(ThemeContext);
  const { cart, updateQuantity, removeFromCart } = useCart();

  // Calculate total price
  const totalPrice = Object.values(cart).reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handlePlaceOrder = () => {
    alert("Order placed successfully!"); // Replace with actual order processing logic
    // Optionally clear the cart after placing the order
    Object.keys(cart).forEach((productId) => removeFromCart(productId));
  };

  return (
    <div
      className={`min-h-screen container mx-auto px-6 py-12 ${
        isDarkMode ? "bg-stone-900" : "bg-stone-50"
      }`}
    >
      {/* Header */}
      <header className="text-center mb-12">
        <h1
          className={`text-4xl font-bold mb-4 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          }`}
        >
          Checkout
        </h1>
        <p
          className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-stone-300" : "text-stone-600"
          }`}
        >
          Review your cart and place your order.
        </p>
      </header>

      {/* Cart Items */}
      {Object.keys(cart).length === 0 ? (
        <div className="text-center">
          <p
            className={`text-lg transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-stone-300" : "text-stone-600"
            }`}
          >
            Your cart is empty.
          </p>
          <Button
            to="/shop"
            variant="primary"
            className={`mt-4 ${
              isDarkMode
                ? "bg-red-800 text-white hover:bg-red-900"
                : "bg-red-800 text-white hover:bg-red-900"
            }`}
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {Object.entries(cart).map(([productId, item]) => (
              <div
                key={productId}
                className={`flex items-center py-3 transition-colors duration-300 ease-in-out`}
              >
                {/* Product Image */}
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={item.image || "https://via.placeholder.com/80"}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 ml-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className={`text-base font-semibold transition-colors duration-300 ease-in-out ${
                          isDarkMode ? "text-white" : "text-red-600"
                        }`}
                      >
                        {item.name}
                      </h3>
                      <p
                        className={`text-sm transition-colors duration-300 ease-in-out ${
                          isDarkMode ? "text-stone-400" : "text-stone-500"
                        }`}
                      >
                        Color: {item.color}
                      </p>
                      <p
                        className={`text-sm transition-colors duration-300 ease-in-out ${
                          isDarkMode ? "text-stone-400" : "text-stone-500"
                        }`}
                      >
                        Size: {item.size}
                      </p>
                    </div>
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(productId)}
                      className={`text-lg transition-colors duration-300 ease-in-out ${
                        isDarkMode
                          ? "text-stone-400 hover:text-stone-300"
                          : "text-stone-500 hover:text-stone-600"
                      }`}
                    >
                      ✕
                    </button>
                  </div>
                  {/* Quantity Selector */}
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(productId, -1)}
                      className={`w-8 h-8 flex items-center justify-center border rounded-l transition-colors duration-300 ease-in-out ${
                        isDarkMode
                          ? "border-stone-600 bg-stone-700 text-white hover:bg-stone-600"
                          : "border-stone-300 bg-stone-200 text-stone-600 hover:bg-stone-300"
                      }`}
                    >
                      -
                    </button>
                    <span
                      className={`w-10 h-8 flex items-center justify-center border-t border-b transition-colors duration-300 ease-in-out ${
                        isDarkMode
                          ? "border-stone-600 text-white"
                          : "border-stone-300 text-stone-600"
                      }`}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(productId, 1)}
                      className={`w-8 h-8 flex items-center justify-center border rounded-r transition-colors duration-300 ease-in-out ${
                        isDarkMode
                          ? "border-stone-600 bg-stone-700 text-white hover:bg-stone-600"
                          : "border-stone-300 bg-stone-200 text-stone-600 hover:bg-stone-300"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right ml-4">
                  {item.originalPrice ? (
                    <div>
                      <p
                        className={`text-sm line-through transition-colors duration-300 ease-in-out ${
                          isDarkMode ? "text-stone-400" : "text-stone-500"
                        }`}
                      >
                        ${(item.originalPrice * item.quantity).toFixed(2)}
                      </p>
                      <p
                        className={`text-base font-semibold transition-colors duration-300 ease-in-out ${
                          isDarkMode ? "text-white" : "text-red-600"
                        }`}
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <p
                      className={`text-base font-semibold transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-white" : "text-red-600"
                      }`}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total Price and Place Order */}
          <div className="mt-12 text-right">
            <p
              className={`text-xl font-semibold transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-white" : "text-red-600"
              }`}
            >
              Total: ${totalPrice.toFixed(2)}
            </p>
            <Button
              onClick={handlePlaceOrder}
              variant="primary"
              className={`mt-4 ${
                isDarkMode
                  ? "bg-red-800 text-white hover:bg-red-900"
                  : "bg-red-800 text-white hover:bg-red-900"
              }`}
            >
              Place Order
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Checkout;
