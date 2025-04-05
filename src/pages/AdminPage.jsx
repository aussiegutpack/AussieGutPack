// src/pages/admin/AdminPage.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { auth } from "../firebase"; // Import auth from your firebase config
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth"; // Import Firebase Auth methods

function AdminPage() {
  const { isDarkMode } = useContext(ThemeContext);
  const [email, setEmail] = useState(""); // Add email state
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null); // Add error state for login failures
  const navigate = useNavigate();

  // Check authentication state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is authenticated
      } else {
        setIsAuthenticated(false); // User is not authenticated
      }
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page
    setError(null); // Clear any previous errors
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true); // This will be handled by onAuthStateChanged, but we set it here for immediate feedback
    } catch (err) {
      setError("Failed to log in: " + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false); // This will be handled by onAuthStateChanged, but we set it here for immediate feedback
      navigate("/admin"); // Redirect back to the login screen
    } catch (err) {
      setError("Failed to log out: " + err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-stone-900" : "bg-white"
        }`}
      >
        <div
          className={`p-6 ${
            isDarkMode ? "bg-stone-800" : "bg-stone-100"
          } rounded shadow`}
        >
          <h2
            className={`text-2xl transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-red-400" : "text-red-800"
            } mb-4`}
          >
            Admin Login
          </h2>
          {error && (
            <p
              className={`text-red-500 mb-4 ${
                isDarkMode ? "text-red-400" : "text-red-600"
              }`}
            >
              {error}
            </p>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`border p-2 w-full mb-4 ${
                  isDarkMode
                    ? "bg-stone-700 border-stone-600 text-white"
                    : "bg-white border-red-300 text-red-600"
                }`}
                placeholder="Enter email"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`border p-2 w-full mb-4 ${
                  isDarkMode
                    ? "bg-stone-700 border-stone-600 text-white"
                    : "bg-white border-red-300 text-red-600"
                }`}
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        isDarkMode ? "bg-stone-900" : "bg-white"
      }`}
    >
      <h2
        className={`text-3xl transition-colors duration-300 ease-in-out ${
          isDarkMode ? "text-red-400" : "text-red-800"
        } mb-8`}
      >
        Admin Dashboard
      </h2>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/admin/home")}
          className="bg-red-800 text-white px-6 py-3 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
        >
          Edit Home Page Content
        </button>
        <button
          onClick={() => navigate("/admin/blog")}
          className="bg-red-800 text-white px-6 py-3 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
        >
          Manage Blog Posts
        </button>
        <button
          onClick={() => navigate("/admin/products")}
          className="bg-red-800 text-white px-6 py-3 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
        >
          Manage Products
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-red-800 text-white px-6 py-3 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
        >
          Back to Home
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-800 text-white px-6 py-3 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default AdminPage;
