import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";

function AdminPage() {
  const { isDarkMode } = useContext(ThemeContext);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === "agp9489") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
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
          />
          <button
            onClick={handleLogin}
            className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
          >
            Login
          </button>
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
          onClick={() => navigate("/")}
          className="bg-red-800 text-white px-6 py-3 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default AdminPage;
