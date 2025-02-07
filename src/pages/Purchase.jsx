import React, { useState } from "react";
import { longTermPro } from "../data/longTermPro";

function Purchase() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        Purchase Gut Health Supplements
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Products</h2>
          {longTermPro.map((product) => (
            <div
              key={product.id}
              className="border p-4 mb-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-green-700">${product.price}</p>
              </div>
              <button
                onClick={() => addToCart(product)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <span>{item.name}</span>
                  <div>
                    <span className="mr-4">${item.price}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-4 font-bold">
                Total: ${totalPrice.toFixed(2)}
              </div>
              <button
                className="mt-4 w-full bg-green-600 text-white py-2 rounded"
                disabled={cart.length === 0}
              >
                Checkout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Purchase;
