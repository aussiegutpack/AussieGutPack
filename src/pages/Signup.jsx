// src/pages/Signup.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../App";

const Signup = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const { signup, user, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signup(email, password);
      navigate("/login");
    } catch (err) {
      if (err.message.includes("User already exists")) {
        setError("Email already in use. A confirmation email has been resent.");
      } else if (err.message.includes("rate limit")) {
        setError("Too many signup attempts. Please wait and try again later.");
      } else {
        setError("An error occurred during signup. Please try again.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    navigate("/nutrition");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1
        className={`text-4xl md:text-5xl font-extrabold text-center mb-10 tracking-tight ${
          isDarkMode ? "text-red-400" : "text-red-800"
        }`}
      >
        Sign Up
      </h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-6">
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
            className={`text-center text-sm mb-6 ${
              isDarkMode ? "text-red-400" : "text-red-800"
            }`}
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          className={`w-full p-4 rounded-lg transition-all duration-200 font-semibold text-lg ${
            isDarkMode
              ? "bg-red-700 text-white hover:bg-red-800"
              : "bg-red-600 text-white hover:bg-red-700"
          } shadow-md hover:shadow-lg`}
        >
          Sign Up
        </button>
      </form>
      <p
        className={`text-center mt-6 text-sm ${
          isDarkMode ? "text-stone-400" : "text-stone-600"
        }`}
      >
        Already have an account?{" "}
        <a href="/login" className="text-red-600 hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
};

export default Signup;
