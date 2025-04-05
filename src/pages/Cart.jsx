// src/pages/shop/Cart.jsx
import React, { useState, useContext } from "react";
import { ThemeContext } from "../App";
import { useCart } from "../context/CartContext";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { isDarkMode } = useContext(ThemeContext);
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice } =
    useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!checkoutData.name || !checkoutData.email || !checkoutData.address) {
      alert("Please fill in all fields to proceed with checkout.");
      return;
    }

    setIsCheckingOut(true);
    try {
      const order = {
        items: cart,
        total: getTotalPrice(),
        customer: checkoutData,
        createdAt: new Date().toISOString(),
        status: "pending",
      };
      await addDoc(collection(db, "orders"), order);
      clearCart();
      alert("Order placed successfully! Thank you for your purchase.");
      navigate("/"); // Use relative path
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsCheckingOut(false);
      setCheckoutData({ name: "", email: "", address: "" });
    }
  };

  return (
    <div
      className={`min-h-screen container mx-auto px-6 py-12 ${
        isDarkMode ? "bg-stone-900" : "bg-stone-50"
      }`}
    >
      <h1
        className={`text-4xl font-bold mb-8 transition-colors duration-300 ease-in-out ${
          isDarkMode ? "text-red-400" : "text-red-800"
        }`}
      >
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center">
          <p
            className={`text-lg mb-4 ${
              isDarkMode ? "text-stone-300" : "text-stone-600"
            }`}
          >
            Your cart is empty.
          </p>
          <button
            onClick={() => navigate("/products")} // Use relative path
            className="bg-red-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-900 transition-colors duration-300 ease-in-out"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 border rounded-md ${
                  isDarkMode
                    ? "border-stone-600 bg-stone-800"
                    : "border-red-300 bg-white"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80";
                  }}
                />
                <div className="flex-1">
                  <h3
                    className={`text-lg font-medium ${
                      isDarkMode ? "text-white" : "text-red-600"
                    }`}
                  >
                    {item.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-stone-300" : "text-stone-600"
                    }`}
                  >
                    Price: ${item.price.toFixed(2)}
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-stone-300" : "text-stone-600"
                    }`}
                  >
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-gray-300 text-black px-2 py-1 rounded-md hover:bg-gray-400 transition-colors duration-300 ease-in-out"
                    disabled={isCheckingOut}
                  >
                    -
                  </button>
                  <span
                    className={`text-lg ${
                      isDarkMode ? "text-white" : "text-red-600"
                    }`}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-gray-300 text-black px-2 py-1 rounded-md hover:bg-gray-400 transition-colors duration-300 ease-in-out"
                    disabled={isCheckingOut}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-600 text-white px-4 py-1 rounded-md font-semibold hover:bg-red-700 transition-colors duration-300 ease-in-out"
                  disabled={isCheckingOut}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary and Checkout Form */}
          <div
            className={`p-6 border rounded-md ${
              isDarkMode
                ? "border-stone-600 bg-stone-800"
                : "border-red-300 bg-white"
            }`}
          >
            <h2
              className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-red-600"
              }`}
            >
              Order Summary
            </h2>
            <p
              className={`text-lg mb-4 ${
                isDarkMode ? "text-stone-300" : "text-stone-600"
              }`}
            >
              Total: ${getTotalPrice().toFixed(2)}
            </p>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-white" : "text-red-600"
                  }`}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={checkoutData.name}
                  onChange={(e) =>
                    setCheckoutData({ ...checkoutData, name: e.target.value })
                  }
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                    isDarkMode
                      ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                      : "bg-white border-red-300 text-red-600 focus:ring-red-500"
                  }`}
                  placeholder="John Doe"
                  disabled={isCheckingOut}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-white" : "text-red-600"
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={checkoutData.email}
                  onChange={(e) =>
                    setCheckoutData({ ...checkoutData, email: e.target.value })
                  }
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                    isDarkMode
                      ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                      : "bg-white border-red-300 text-red-600 focus:ring-red-500"
                  }`}
                  placeholder="john.doe@example.com"
                  disabled={isCheckingOut}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-white" : "text-red-600"
                  }`}
                >
                  Shipping Address
                </label>
                <textarea
                  value={checkoutData.address}
                  onChange={(e) =>
                    setCheckoutData({
                      ...checkoutData,
                      address: e.target.value,
                    })
                  }
                  required
                  rows="3"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                    isDarkMode
                      ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500"
                      : "bg-white border-red-300 text-red-600 focus:ring-red-500"
                  }`}
                  placeholder="123 Main St, City, Country"
                  disabled={isCheckingOut}
                />
              </div>
              <button
                type="submit"
                className={`w-full px-4 py-2 rounded-md font-semibold transition-colors duration-300 ease-in-out ${
                  isCheckingOut
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-red-800 text-white hover:bg-red-900"
                }`}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
