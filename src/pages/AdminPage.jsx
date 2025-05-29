// src/pages/admin/AdminPage.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../App";
import { auth } from "../firebase"; // Import auth from your firebase config
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth"; // Import Firebase Auth methods
import { AuthContext } from "../context/AuthContext";
import AdminHomePage from "./HomeAdminPage";
import AdminBlogPage from "./BlogAdminPage";
import ProductsAdminPage from "./ProductsAdminPage";
import Layout from "../components/layout/Layout";
import { Route, Routes } from "react-router-dom";

console.log('AdminPage.jsx: Loading AdminPage component');

function AdminPage() {
  const { isDarkMode } = useContext(ThemeContext);
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  console.log('AdminPage.jsx: AdminPage rendering. User:', user ? 'Authenticated' : 'Not Authenticated', 'Loading:', loading);
  console.log('AdminPage.jsx: Current location in AdminPage:', location.pathname, location.hash);

  // Effect to check authentication status and redirect if necessary
  useEffect(() => {
    console.log('AdminPage.jsx: Auth check useEffect triggered. User:', user, 'Loading:', loading);
    if (!loading && !user) {
      console.log('AdminPage.jsx: User not authenticated, navigating to login');
      // navigate("/login", { replace: true }); // Redirect to a login page if needed
    } else if (!loading && user) {
      console.log('AdminPage.jsx: User authenticated:', user);
    }
  }, [user, loading, navigate]);

  const [email, setEmail] = useState(""); // Add email state
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null); // Add error state for login failures

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

  console.log('AdminPage.jsx: Render login form or admin content. User:', user);

  if (loading) {
    console.log('AdminPage.jsx: Still loading auth state...');
    return <div className="text-center py-8">Loading authentication status...</div>;
  }

  if (!user) {
    console.log('AdminPage.jsx: Rendering login form');
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

  console.log('AdminPage.jsx: Rendering admin content');
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AdminHomePage />} />
        <Route path="/home" element={<AdminHomePage />} />
        <Route path="/blog" element={<AdminBlogPage />} />
        <Route path="/products" element={<ProductsAdminPage />} />
      </Routes>
    </Layout>
  );
}

export default AdminPage;
