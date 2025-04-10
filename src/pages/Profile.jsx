// src/pages/Profile.jsx
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../App";
import { supabase } from "../supabaseClient";

const Profile = () => {
  const { user, loading, refreshUser } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.displayName || ""
  );
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchNutritionPlans = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("nutrition_plans")
          .select("*")
          .eq("user_id", user.id);
        if (error) throw error;
        setNutritionPlans(data || []);
      } catch (err) {
        console.error("Error fetching nutrition plans:", err.message);
      }
    };

    fetchNutritionPlans();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { displayName },
      });
      if (error) throw error;
      setSuccess("Profile updated successfully!");
      await refreshUser();
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Update profile error:", err.message);
    }
  };

  // Capitalize the username and fallback to "User" if not set
  const username = user?.user_metadata?.displayName
    ? user.user_metadata.displayName.charAt(0).toUpperCase() +
      user.user_metadata.displayName.slice(1)
    : "User";

  return (
    <div className="container mx-auto px-4 py-12">
      <h1
        className={`text-4xl md:text-5xl font-extrabold text-center mb-4 tracking-tight ${
          isDarkMode ? "text-red-400" : "text-red-800"
        }`}
      >
        {username} - Dashboard {/* Use a dash instead of possessive form */}
      </h1>
      <p
        className={`text-center text-lg mb-10 ${
          isDarkMode ? "text-stone-300" : "text-stone-600"
        }`}
      >
        Welcome back, {username}!
      </p>

      <div className="max-w-2xl mx-auto">
        {/* Profile Information */}
        <div
          className={`p-6 rounded-lg shadow-md mb-6 ${
            isDarkMode ? "bg-stone-800 text-red-400" : "bg-white text-red-800"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">Username:</span>{" "}
              {user.user_metadata?.displayName || "Not set"}
            </p>
            <p>
              <span className="font-medium">Account Created:</span>{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Last Updated:</span>{" "}
              {new Date(user.updated_at).toLocaleDateString()}
            </p>
            {user.user_metadata &&
            Object.keys(user.user_metadata).length > 0 ? (
              <div>
                <span className="font-medium">Additional Info:</span>
                <ul className="list-disc list-inside ml-4">
                  {Object.entries(user.user_metadata).map(([key, value]) => (
                    <li key={key}>
                      {key}: {value}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No additional user metadata available.</p>
            )}
          </div>
        </div>

        {/* Nutrition Plans */}
        <div
          className={`p-6 rounded-lg shadow-md mb-6 ${
            isDarkMode ? "bg-stone-800 text-red-400" : "bg-white text-red-800"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-4">Your Nutrition Plans</h2>
          {nutritionPlans.length > 0 ? (
            <ul className="space-y-2">
              {nutritionPlans.map((plan) => (
                <li key={plan.id}>
                  <Link
                    to={`/nutrition-plan/${plan.id}`}
                    className="hover:text-red-600 transition-colors duration-200"
                  >
                    {plan.name || `Plan ${plan.id}`}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No nutrition plans found.</p>
          )}
        </div>

        {/* Update Profile */}
        <div
          className={`p-6 rounded-lg shadow-md mb-6 ${
            isDarkMode ? "bg-stone-800 text-red-400" : "bg-white text-red-800"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label
                className={`block text-lg font-semibold mb-2 ${
                  isDarkMode ? "text-red-400" : "text-red-800"
                } tracking-wide`}
              >
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  isDarkMode
                    ? "bg-stone-700 border-stone-600 text-red-400 focus:ring-red-600"
                    : "bg-white border-red-200 text-red-800 focus:ring-red-600"
                } placeholder-stone-400`}
                placeholder="Enter your display name"
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
            {success && (
              <p
                className={`text-center text-sm mb-4 ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                {success}
              </p>
            )}
            <button
              type="submit"
              className={`w-full p-3 rounded-lg font-semibold text-lg ${
                isDarkMode
                  ? "bg-red-700 text-white hover:bg-red-800"
                  : "bg-red-600 text-white hover:bg-red-700"
              } transition-all duration-200 shadow-md hover:shadow-lg`}
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Account Actions */}
        <div
          className={`p-6 rounded-lg shadow-md ${
            isDarkMode ? "bg-stone-800 text-red-400" : "bg-white text-red-800"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-4">Account Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/nutrition")}
              className={`w-full p-3 rounded-lg font-semibold text-lg ${
                isDarkMode
                  ? "bg-red-700 text-white hover:bg-red-800"
                  : "bg-red-600 text-white hover:bg-red-700"
              } transition-all duration-200 shadow-md hover:shadow-lg`}
            >
              Create Nutrition Plan
            </button>
            <button
              onClick={() => navigate("/fitness-tracker")}
              className={`w-full p-3 rounded-lg font-semibold text-lg ${
                isDarkMode
                  ? "bg-red-700 text-white hover:bg-red-800"
                  : "bg-red-600 text-white hover:bg-red-700"
              } transition-all duration-200 shadow-md hover:shadow-lg`}
            >
              Fitness Tracker
            </button>
            <button
              onClick={() => navigate("/nutrition")}
              className={`w-full p-3 rounded-lg font-semibold text-lg ${
                isDarkMode
                  ? "bg-red-700 text-white hover:bg-red-800"
                  : "bg-red-600 text-white hover:bg-red-700"
              } transition-all duration-200 shadow-md hover:shadow-lg`}
            >
              View Nutrition Plans
            </button>
            <button
              onClick={() => navigate("/reset-password")}
              className={`w-full p-3 rounded-lg font-semibold text-lg ${
                isDarkMode
                  ? "bg-red-700 text-white hover:bg-red-800"
                  : "bg-red-600 text-white hover:bg-red-700"
              } transition-all duration-200 shadow-md hover:shadow-lg`}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
