// src/pages/shop/Products.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { ThemeContext } from "../../App";
import { useCart } from "../../context/CartContext";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group"; // For cart item removal animation

function Products() {
  const { isDarkMode } = useContext(ThemeContext);
  const { cart, addToCart, updateQuantity, removeFromCart, getTotalPrice } =
    useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [loading, setLoading] = useState(true); // For loading state
  const [openedByAdd, setOpenedByAdd] = useState(false);
  const timerRef = useRef(null);
  const lastAddToCartClick = useRef(null); // Added to track last Add to Cart click
  const navigate = useNavigate();

  // Log when isMiniCartOpen changes
  useEffect(() => {
    console.log("isMiniCartOpen updated to:", isMiniCartOpen);
  }, [isMiniCartOpen]);

  // Log when show's state changes
  useEffect(() => {
    console.log("showAll updated to:", showAll);
  }, [showAll]);

  // Close sidebar on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const cartButton = document.querySelector(".cart-button");
      const addToCartButton = e.target.closest(".add-to-cart-button");
      const now = Date.now();
      const timeSinceLastAdd = lastAddToCartClick.current
        ? now - lastAddToCartClick.current
        : Infinity;
      console.log("Outside click handler triggered, target:", e.target);
      console.log("Is target an Add to Cart button?", !!addToCartButton);
      console.log("Time since last Add to Cart click:", timeSinceLastAdd);
      console.log("IsMiniCartOpen?", isMiniCartOpen);
      console.log("OpenedByAdd?", openedByAdd);
      if (
        isMiniCartOpen &&
        !e.target.closest(".mini-cart-sidebar") &&
        !cartButton?.contains(e.target) &&
        !addToCartButton &&
        timeSinceLastAdd > 100 && // Ignore clicks within 100ms of an Add to Cart click
        !openedByAdd
      ) {
        console.log("Outside click detected, closing sidebar");
        setIsMiniCartOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isMiniCartOpen, openedByAdd]);

  // Fetch data from Firestore with loading state
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categoriesList = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesList);

        const productsSnapshot = await getDocs(collection(db, "products"));
        const productsList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-open/close sidebar when cart updates
  useEffect(() => {
    if (cart.length > 0) {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      console.log("Cart updated, opening sidebar, cart length:", cart.length);
      setOpenedByAdd(true);
      setIsMiniCartOpen(true);
      if (cart.length !== 1) {
        timerRef.current = setTimeout(() => {
          console.log("Auto-closing sidebar after 3 seconds");
          setIsMiniCartOpen(false);
          setOpenedByAdd(false);
        }, 3000);
      }
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [cart]);

  // Close sidebar when cart becomes empty
  useEffect(() => {
    if (cart.length === 0 && isMiniCartOpen) {
      console.log("Cart is empty, closing sidebar");
      setIsMiniCartOpen(false);
      setOpenedByAdd(false);
    }
  }, [cart, isMiniCartOpen]);

  // Handle adding to cart
  const handleAddToCart = (product) => {
    lastAddToCartClick.current = Date.now(); // Set timestamp for last Add to Cart click
    addToCart(product);
  };

  const sortProducts = (productsToSort) => {
    const sortedProducts = [...productsToSort];
    switch (sortOption) {
      case "price-asc":
        return sortedProducts.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sortedProducts.sort((a, b) => b.price - a.price);
      case "name-asc":
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sortedProducts;
    }
  };

  const filteredProducts = filterCategory
    ? products.filter((product) => product.categoryId === filterCategory)
    : products;

  const displayedProducts = sortProducts(filteredProducts);

  return (
    <div
      className={`min-h-screen container mx-auto px-6 py-12 flex ${
        isDarkMode ? "bg-stone-900" : "bg-stone-50"
      }`}
    >
      {/* Main Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1
            className={`text-4xl font-bold transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-red-400" : "text-red-800"
            }`}
          >
            Products
          </h1>
          <button
            className="cart-button relative flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out bg-red-800 text-white hover:bg-red-900 active:bg-red-950"
            onClick={(e) => {
              e.stopPropagation();
              console.log(
                "Cart button clicked, isMiniCartOpen:",
                isMiniCartOpen
              );
              setIsMiniCartOpen(!isMiniCartOpen);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transition-transform duration-300 ease-in-out group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>Cart</span>
            {Array.isArray(cart) && cart.length > 0 && (
              <span
                className={`absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full h-6 w-6 flex items-center justify-center text-sm transition-all duration-300 ease-in-out ${
                  cart.length > 0 ? "animate-bounce" : ""
                }`}
              >
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Sorting, Filtering, and View Options */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <label
                className={`text-lg font-medium transition-colors duration-300 ease-in-out ${
                  isDarkMode ? "text-white" : "text-red-600"
                }`}
              >
                Filter by Section:
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`px-4 py-2 border rounded-md focus:outline-none transition-all duration-300 ease-in-out ${
                  isDarkMode
                    ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500 focus:border-red-500"
                    : "bg-white border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500"
                }`}
              >
                <option value="">All Sections</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label
                className={`text-lg font-medium transition-colors duration-300 ease-in-out ${
                  isDarkMode ? "text-white" : "text-red-600"
                }`}
              >
                Sort By:
              </label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className={`px-4 py-2 border rounded-md focus:outline-none transition-all duration-300 ease-in-out ${
                  isDarkMode
                    ? "bg-stone-700 border-stone-600 text-white focus:ring-red-500 focus:border-red-500"
                    : "bg-white border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500"
                }`}
              >
                <option value="">None</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => {
              console.log("Show All button clicked, current showAll:", showAll);
              setShowAll((prev) => {
                const newShowAll = !prev;
                console.log("Setting showAll to:", newShowAll);
                if (newShowAll) {
                  console.log("Resetting filterCategory to show all products");
                  setFilterCategory(""); // Reset filter when showing all products
                }
                return newShowAll;
              });
            }}
            className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out ${
              isDarkMode
                ? "bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
                : "bg-red-800 text-white hover:bg-red-900 active:bg-red-950"
            }`}
          >
            {showAll ? "Group by Category" : "Show All Products"}
          </button>
        </div>

        {/* Display Products with Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600"></div>
          </div>
        ) : filterCategory ? (
          <div className="mb-12">
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-white" : "text-red-600"
              }`}
            >
              {categories.find((cat) => cat.id === filterCategory)?.name ||
                "Section"}
            </h2>
            {displayedProducts.length === 0 ? (
              <p
                className={`text-lg transition-colors duration-300 ease-in-out ${
                  isDarkMode ? "text-stone-300" : "text-stone-600"
                }`}
              >
                No products found in this section.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`p-4 border rounded-md shadow-md transition-all duration-300 ease-in-out hover:shadow-lg ${
                      isDarkMode
                        ? "border-stone-600 bg-stone-800"
                        : "border-red-300 bg-white"
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-md mb-4 transition-transform duration-300 ease-in-out hover:scale-105"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80";
                        console.error(
                          `Failed to load image for ${product.name}`
                        );
                      }}
                    />
                    <h3
                      className={`text-lg font-medium mb-2 transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-white" : "text-red-600"
                      }`}
                    >
                      {product.name}
                    </h3>
                    <p
                      className={`text-sm mb-2 transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      {product.description}
                    </p>
                    <p
                      className={`text-sm mb-2 transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      Price: ${product.price.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm mb-2 transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      Color: {product.color}
                    </p>
                    <p
                      className={`text-sm mb-4 transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      Size: {product.size}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        lastAddToCartClick.current = Date.now();
                        handleAddToCart(product);
                      }}
                      className="add-to-cart-button bg-red-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-900 active:bg-red-950 transition-all duration-300 ease-in-out w-full"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : showAll ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className={`p-4 border rounded-md shadow-md transition-all duration-300 ease-in-out hover:shadow-lg ${
                  isDarkMode
                    ? "border-stone-600 bg-stone-800"
                    : "border-red-300 bg-white"
                }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4 transition-transform duration-300 ease-in-out hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80";
                    console.error(`Failed to load image for ${product.name}`);
                  }}
                />
                <h3
                  className={`text-lg font-medium mb-2 transition-colors duration-300 ease-in-out ${
                    isDarkMode ? "text-white" : "text-red-600"
                  }`}
                >
                  {product.name}
                </h3>
                <p
                  className={`text-sm mb-2 transition-colors duration-300 ease-in-out ${
                    isDarkMode ? "text-stone-300" : "text-stone-600"
                  }`}
                >
                  {product.description}
                </p>
                <p
                  className={`text-sm mb-2 transition-colors duration-300 ease-in-out ${
                    isDarkMode ? "text-stone-300" : "text-stone-600"
                  }`}
                >
                  Price: ${product.price.toFixed(2)}
                </p>
                <p
                  className={`text-sm mb-2 transition-colors duration-300 ease-in-out ${
                    isDarkMode ? "text-stone-300" : "text-stone-600"
                  }`}
                >
                  Color: {product.color}
                </p>
                <p
                  className={`text-sm mb-4 transition-colors duration-300 ease-in-out ${
                    isDarkMode ? "text-stone-300" : "text-stone-600"
                  }`}
                >
                  Size: {product.size}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    lastAddToCartClick.current = Date.now();
                    handleAddToCart(product);
                  }}
                  className="add-to-cart-button bg-red-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-900 active:bg-red-950 transition-all duration-300 ease-in-out w-full"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="mb-12">
              <h2
                className={`text-2xl font-semibold mb-4 transition-colors duration-300 ease-in-out ${
                  isDarkMode ? "text-white" : "text-red-600"
                }`}
              >
                {category.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortProducts(
                  products.filter(
                    (product) => product.categoryId === category.id
                  )
                ).map((product) => (
                  <div
                    key={product.id}
                    className={`p-4 border rounded-md shadow-md transition-all duration-300 ease-in-out hover:shadow-lg ${
                      isDarkMode
                        ? "border-stone-600 bg-stone-800"
                        : "border-red-300 bg-white"
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-md mb-4 transition-transform duration-300 ease-in-out hover:scale-105"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80";
                        console.error(
                          `Failed to load image for ${product.name}`
                        );
                      }}
                    />
                    <h3
                      className={`text-lg font-medium mb-2 transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-white" : "text-red-600"
                      }`}
                    >
                      {product.name}
                    </h3>
                    <p
                      className={`text-sm mb-2 transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      {product.description}
                    </p>
                    <p
                      className={`text-sm mb-2 transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      Price: ${product.price.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm mb-2 transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      Color: {product.color}
                    </p>
                    <p
                      className={`text-sm mb-4 transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      Size: {product.size}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        lastAddToCartClick.current = Date.now();
                        handleAddToCart(product);
                      }}
                      className="add-to-cart-button bg-red-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-900 active:bg-red-950 transition-all duration-300 ease-in-out w-full"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Backdrop and Mini Cart Sidebar */}
      {isMiniCartOpen && (
        <>
          {/* Backdrop */}
          <div
            className={`mini-cart-backdrop fixed inset-0 bg-black bg-opacity-50 z-40 active`} // Added active class
            onClick={(e) => {
              e.stopPropagation();
              console.log("Backdrop clicked, closing sidebar");
              setIsMiniCartOpen(false);
            }}
          ></div>

          {/* Mini Cart Sidebar */}
          <div
            className={`mini-cart-sidebar w-80 p-6 border-l shadow-lg h-screen fixed right-0 top-0 z-50 overflow-y-auto transition-transform duration-300 ease-in-out transform ${
              isMiniCartOpen ? "translate-x-0" : "translate-x-full"
            } ${
              isDarkMode
                ? "border-stone-600 bg-stone-800"
                : "border-red-300 bg-white"
            }`}
          >
            <div
              className={`mini-cart-content ${isMiniCartOpen ? "active" : ""}`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-xl font-semibold transition-colors duration-300 ease-in-out ${
                    isDarkMode ? "text-white" : "text-red-600"
                  }`}
                >
                  Your Cart
                </h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Close button clicked, closing sidebar");
                    setIsMiniCartOpen(false);
                  }}
                  className={`text-lg transition-colors duration-300 ease-in-out ${
                    isDarkMode
                      ? "text-stone-300 hover:text-red-400"
                      : "text-stone-600 hover:text-red-600"
                  }`}
                >
                  ✕
                </button>
              </div>
              {!Array.isArray(cart) || cart.length === 0 ? (
                <p
                  className={`text-sm transition-colors duration-300 ease-in-out ${
                    isDarkMode ? "text-stone-300" : "text-stone-600"
                  }`}
                >
                  Your cart is empty.
                </p>
              ) : (
                <div className="space-y-4">
                  <TransitionGroup component={null}>
                    {cart.map((item) => (
                      <CSSTransition
                        key={item.id}
                        timeout={300}
                        classNames="cart-item"
                      >
                        <div
                          className={`flex items-center gap-4 p-3 border rounded-md transition-all duration-300 ease-in-out ${
                            isDarkMode ? "border-stone-600" : "border-red-300"
                          }`}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/80";
                            }}
                          />
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium transition-colors duration-300 ease-in-out ${
                                isDarkMode ? "text-white" : "text-red-600"
                              }`}
                            >
                              {item.name}
                            </p>
                            <p
                              className={`text-xs transition-colors duration-300 ease-in-out ${
                                isDarkMode ? "text-stone-300" : "text-stone-600"
                              }`}
                            >
                              ${item.price.toFixed(2)} x {item.quantity}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center border-2 border-red-300 rounded-full px-2 py-1">
                                {item.quantity === 1 ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeFromCart(item.id);
                                    }}
                                    className="text-red-600 hover:text-red-800 active:text-red-900 transition-all duration-300 ease-in-out"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M9 7h6m-5 4v6m4-6v6"
                                      />
                                    </svg>
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateQuantity(
                                        item.id,
                                        item.quantity - 1
                                      );
                                    }}
                                    className="text-black px-2 py-1 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-all duration-300 ease-in-out"
                                  >
                                    -
                                  </button>
                                )}
                                <span
                                  className={`text-sm mx-2 transition-colors duration-300 ease-in-out ${
                                    isDarkMode ? "text-white" : "text-red-600"
                                  }`}
                                >
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(item.id, item.quantity + 1);
                                  }}
                                  className="text-black px-2 py-1 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-all duration-300 ease-in-out"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(item.id);
                            }}
                            className="text-red-600 hover:text-red-800 active:text-red-900 transition-colors duration-300 ease-in-out"
                          >
                            ✕
                          </button>
                        </div>
                      </CSSTransition>
                    ))}
                  </TransitionGroup>
                  <div className="border-t pt-4 mt-4">
                    <p
                      className={`text-lg font-semibold transition-colors duration-300 ease-in-out ${
                        isDarkMode ? "text-white" : "text-red-600"
                      }`}
                    >
                      Subtotal: ${getTotalPrice().toFixed(2)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMiniCartOpen(false);
                        navigate("/cart");
                      }}
                      className="w-full bg-red-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-900 active:bg-red-950 transition-all duration-300 ease-in-out mt-4"
                    >
                      Go to Cart
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMiniCartOpen(false);
                        navigate("/cart");
                      }}
                      className="w-full bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 active:bg-red-800 transition-all duration-300 ease-in-out mt-2"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Products;
