// src/pages/shop/Purchase.jsx
import React, { useState, useContext } from "react";
import { ThemeContext } from "../../App";
import { longTermPro } from "../../data/longTermPro";
import Button from "../../components/ui/Button";

function Purchase() {
  const { isDarkMode } = useContext(ThemeContext);
  const [cart, setCart] = useState([]);

  const addToCart = (product) => setCart([...cart, product]);
  const removeFromCart = (productId) =>
    setCart(cart.filter((item) => item.id !== productId));
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1
        className={`text-3xl font-bold mb-6 ${
          isDarkMode ? "text-green-300" : "text-green-800"
        }`}
      >
        Purchase Gut Health Supplements
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2
            className={`text-2xl font-semibold mb-4 ${
              isDarkMode ? "text-green-200" : "text-green-700"
            }`}
          >
            Available Products
          </h2>
          {longTermPro.map((product) => (
            <div
              key={product.id}
              className={`border p-4 mb-4 rounded-lg flex justify-between items-center ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-300 bg-white"
              }`}
            >
              <div>
                <h3
                  className={`font-bold ${
                    isDarkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  {product.name}
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-green-400" : "text-green-700"
                  }`}
                >
                  ${product.price}
                </p>
              </div>
              <Button onClick={() => addToCart(product)} variant="primary">
                Add to Cart
              </Button>
            </div>
          ))}
        </div>

        <div>
          <h2
            className={`text-2xl font-semibold mb-4 ${
              isDarkMode ? "text-green-200" : "text-green-700"
            }`}
          >
            Your Cart
          </h2>
          {cart.length === 0 ? (
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Your cart is empty
            </p>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className={`flex justify-between items-center border-b py-2 ${
                    isDarkMode ? "border-gray-700" : "border-gray-300"
                  }`}
                >
                  <span
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-800"
                    }`}
                  >
                    {item.name}
                  </span>
                  <div>
                    <span
                      className={`mr-4 ${
                        isDarkMode ? "text-green-400" : "text-green-700"
                      }`}
                    >
                      ${item.price}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div
                className={`mt-4 font-bold ${
                  isDarkMode ? "text-green-300" : "text-green-800"
                }`}
              >
                Total: ${totalPrice.toFixed(2)}
              </div>
              <Button
                className="mt-4 w-full"
                variant="primary"
                disabled={cart.length === 0}
              >
                Checkout
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Purchase;
