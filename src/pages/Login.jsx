// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../App";

const Login = () => {
  const navigate = useNavigate();
  const { login, signup } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate("/fitness-tracker");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1
        className={`text-4xl font-bold text-center mb-8 ${
          isDarkMode ? "text-red-400" : "text-red-800"
        }`}
      >
        {isSignup ? "Sign Up" : "Login"}
      </h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label
            className={`block text-xl font-semibold mb-2 ${
              isDarkMode ? "text-red-400" : "text-red-800"
            }`}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
              isDarkMode
                ? "bg-stone-800 border-stone-600 text-red-400 focus:ring-red-800"
                : "bg-white border-red-200 text-red-800 focus:ring-red-800"
            }`}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className={`block text-xl font-semibold mb-2 ${
              isDarkMode ? "text-red-400" : "text-red-800"
            }`}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
              isDarkMode
                ? "bg-stone-800 border-stone-600 text-red-400 focus:ring-red-800"
                : "bg-white border-red-200 text-red-800 focus:ring-red-800"
            }`}
            required
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className={`w-full p-3 rounded-md transition-colors duration-200 ${
            isDarkMode
              ? "bg-red-800 text-white hover:bg-red-900"
              : "bg-red-800 text-white hover:bg-red-900"
          }`}
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>
        <p className="mt-4 text-center">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className={`hover:underline ${
              isDarkMode ? "text-red-400" : "text-red-800"
            }`}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
