// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../App";
import { FaSpinner } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      // Check if the user was redirected from a protected route
      const from = location.state?.from?.pathname || "/profile";
      navigate(from, { replace: true }); // Redirect to the original location or /profile
    } catch (err) {
      setError(err.message);
      console.error("Login error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1
        className={`text-4xl md:text-5xl font-extrabold text-center mb-10 tracking-tight ${
          isDarkMode ? "text-red-400" : "text-red-800"
        }`}
      >
        Login
      </h1>
      <div
        className={`max-w-md mx-auto p-6 rounded-lg shadow-md ${
          isDarkMode ? "bg-stone-800 text-red-400" : "bg-white text-red-800"
        }`}
      >
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className={`block text-lg font-semibold mb-2 ${
                isDarkMode ? "text-red-400" : "text-red-800"
              } tracking-wide`}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-red-400 focus:ring-red-600"
                  : "bg-white border-red-200 text-red-800 focus:ring-red-600"
              } placeholder-stone-400`}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className={`block text-lg font-semibold mb-2 ${
                isDarkMode ? "text-red-400" : "text-red-800"
              } tracking-wide`}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-red-400 focus:ring-red-600"
                  : "bg-white border-red-200 text-red-800 focus:ring-red-600"
              } placeholder-stone-400`}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && (
            <p
              className={`text-center text-sm mb-4 ${
                isDarkMode ? "text-red-400" : "text-red-800"
              }`}
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg font-semibold text-lg flex items-center justify-center ${
              isDarkMode
                ? "bg-red-700 text-white hover:bg-red-800"
                : "bg-red-600 text-white hover:bg-red-700"
            } transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className={`text-sm hover:underline ${
              isDarkMode
                ? "text-red-400 hover:text-red-300"
                : "text-red-800 hover:text-red-600"
            }`}
          >
            Forgot Password?
          </Link>
        </div>
        <div className="mt-2 text-center">
          <p
            className={`text-sm ${
              isDarkMode ? "text-stone-300" : "text-stone-600"
            }`}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className={`hover:underline ${
                isDarkMode
                  ? "text-red-400 hover:text-red-300"
                  : "text-red-800 hover:text-red-600"
              }`}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
