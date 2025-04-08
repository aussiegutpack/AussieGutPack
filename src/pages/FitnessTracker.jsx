// src/pages/FitnessTracker.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../App";

const FitnessTracker = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  const handleCreateCustomPlan = () => {
    navigate("/fitness-tracker/create-custom-plan");
  };

  return (
    <div
      className={`min-h-screen pt-20 ${
        isDarkMode ? "bg-stone-900 text-red-400" : "bg-white text-red-800"
      }`}
    >
      <div className="container mx-auto px-4 py-10">
        <h1
          className={`text-4xl font-bold text-center mb-8 ${
            isDarkMode ? "text-red-400" : "text-red-800"
          }`}
        >
          Fitness Tracker
        </h1>
        <div className="max-w-2xl mx-auto">
          <div
            className={`p-6 rounded-lg shadow-md mb-6 ${
              isDarkMode ? "bg-stone-800" : "bg-red-50"
            }`}
          >
            <h2
              className={`text-2xl font-semibold text-center mb-4 ${
                isDarkMode ? "text-red-400" : "text-red-800"
              }`}
            >
              Create a Custom Plan
            </h2>
            <div className="text-center">
              <button
                onClick={handleCreateCustomPlan}
                className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-red-800 text-white hover:bg-red-900"
                    : "bg-red-800 text-white hover:bg-red-900"
                }`}
              >
                Create Custom Plan
              </button>
            </div>
          </div>
          <div
            className={`p-6 rounded-lg shadow-md ${
              isDarkMode ? "bg-stone-800" : "bg-red-50"
            }`}
          >
            <h2
              className={`text-2xl font-semibold text-center mb-4 ${
                isDarkMode ? "text-red-400" : "text-red-800"
              }`}
            >
              Track Your Progress
            </h2>
            <div className="flex justify-center space-x-4">
              <Link
                to="/fitness-tracker/log"
                className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-red-800 text-white hover:bg-red-900"
                    : "bg-red-800 text-white hover:bg-red-900"
                }`}
              >
                Log Meals & Workouts
              </Link>
              <Link
                to="/fitness-tracker/history"
                className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-red-800 text-white hover:bg-red-900"
                    : "bg-red-800 text-white hover:bg-red-900"
                }`}
              >
                View History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessTracker;
