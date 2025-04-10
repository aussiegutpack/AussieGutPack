// src/pages/Nutrition.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ThemeContext } from "../App";
import { AuthContext } from "../context/AuthContext";
import { ClipLoader } from "react-spinners";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

const Nutrition = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const { user, loading } = useContext(AuthContext);
  const [planName, setPlanName] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [meals, setMeals] = useState([]);
  const [plans, setPlans] = useState([]); // To store user's existing plans
  const [weeks, setWeeks] = useState(
    Array.from({ length: 6 }, (_, i) => ({
      week: i + 1,
      days: [
        {
          day: "Monday",
          meals: [],
          macros: { protein: 0, carbs: 0, fats: 0 },
          loggedMeals: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] },
        },
        {
          day: "Tuesday",
          meals: [],
          macros: { protein: 0, carbs: 0, fats: 0 },
          loggedMeals: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] },
        },
        {
          day: "Wednesday",
          meals: [],
          macros: { protein: 0, carbs: 0, fats: 0 },
          loggedMeals: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] },
        },
        {
          day: "Thursday",
          meals: [],
          macros: { protein: 0, carbs: 0, fats: 0 },
          loggedMeals: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] },
        },
        {
          day: "Friday",
          meals: [],
          macros: { protein: 0, carbs: 0, fats: 0 },
          loggedMeals: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] },
        },
        {
          day: "Saturday",
          meals: [],
          macros: { protein: 0, carbs: 0, fats: 0 },
          loggedMeals: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] },
        },
        {
          day: "Sunday",
          meals: [],
          macros: { protein: 0, carbs: 0, fats: 0 },
          loggedMeals: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] },
        },
      ],
    }))
  );
  const [expandedWeeks, setExpandedWeeks] = useState(Array(6).fill(false));
  const [editingMeal, setEditingMeal] = useState(null);

  // Fetch meals from Supabase
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const { data, error } = await supabase.from("foods").select("*");
        if (error) throw error;
        console.log("Fetched meals from Supabase 'foods' table:", data);
        setMeals(data);
        if (data.length === 0) {
          console.warn("No meals found in Supabase 'foods' table.");
        }
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };
    fetchMeals();
  }, []);

  // Fetch user's existing nutrition plans from Supabase
  useEffect(() => {
    const fetchPlans = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("nutrition_plans")
          .select("*");
        if (error) throw error;
        console.log("Fetched nutrition plans from Supabase:", data);
        setPlans(data);
      } catch (error) {
        console.error("Error fetching nutrition plans:", error);
      }
    };
    fetchPlans();
  }, [user]);

  // Group meals by category
  const groupedMeals = meals.reduce((acc, meal) => {
    const category = meal.category || "Misc";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(meal);
    return acc;
  }, {});

  const categories = ["Meat", "Fruit", "Vegetable", "Starch", "Misc"];
  const mealTimes = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  const toggleWeek = (weekIndex) => {
    const newExpandedWeeks = [...expandedWeeks];
    newExpandedWeeks[weekIndex] = !newExpandedWeeks[weekIndex];
    setExpandedWeeks(newExpandedWeeks);
  };

  const handleAddMeal = (weekIndex, dayIndex) => {
    if (meals.length === 0) {
      alert("No meals available to add. Please add meals in Supabase.");
      return;
    }
    const newWeeks = [...weeks];
    newWeeks[weekIndex].days[dayIndex].meals.push({
      name: meals[0].name,
      grams: meals[0].portion || 100,
      referencePortion: meals[0].portion || 100,
      macros: meals[0].macros,
      mealTime: "Breakfast",
    });
    setWeeks(newWeeks);
  };

  const handleMealChange = (weekIndex, dayIndex, mealIndex, field, value) => {
    const newWeeks = [...weeks];
    const meal = newWeeks[weekIndex].days[dayIndex].meals[mealIndex];
    if (field === "name") {
      const selectedMeal = meals.find((m) => m.name === value);
      meal.name = value;
      meal.grams = selectedMeal.portion || 100;
      meal.referencePortion = selectedMeal.portion || 100;
      meal.macros = selectedMeal.macros;
    } else {
      meal[field] = field === "grams" ? Number(value) : value;
    }
    setWeeks(newWeeks);
  };

  const handleMacroChange = (weekIndex, dayIndex, macro, value) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].days[dayIndex].macros[macro] = Number(value);
    setWeeks(newWeeks);
  };

  const handleLogMeal = (weekIndex, dayIndex) => {
    const newWeeks = [...weeks];
    const day = newWeeks[weekIndex].days[dayIndex];
    const mealToLog = { ...day.meals[day.meals.length - 1] };
    if (mealToLog.name) {
      day.loggedMeals[mealToLog.mealTime].push(mealToLog);
      day.meals[day.meals.length - 1] = {
        name: meals[0].name,
        grams: meals[0].portion || 100,
        referencePortion: meals[0].portion || 100,
        macros: meals[0].macros,
        mealTime: "Breakfast",
      };
      setWeeks(newWeeks);
    }
  };

  const handleEditMeal = (weekIndex, dayIndex, mealTime, mealIndex, meal) => {
    setEditingMeal({ weekIndex, dayIndex, mealTime, mealIndex, meal });
  };

  const handleSaveEdit = () => {
    if (!editingMeal) return;
    const { weekIndex, dayIndex, mealTime, mealIndex, meal } = editingMeal;
    const newWeeks = [...weeks];
    newWeeks[weekIndex].days[dayIndex].loggedMeals[mealTime][mealIndex] = meal;
    setWeeks(newWeeks);
    setEditingMeal(null);
  };

  const handleDeleteMeal = (weekIndex, dayIndex, mealTime, mealIndex) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].days[dayIndex].loggedMeals[mealTime].splice(
      mealIndex,
      1
    );
    setWeeks(newWeeks);
  };

  const calculateLoggedMacros = (loggedMeals) => {
    const allMeals = Object.values(loggedMeals).flat();
    return allMeals.reduce(
      (totals, meal) => {
        const scaleFactor = meal.grams / meal.referencePortion;
        return {
          protein: totals.protein + meal.macros.protein * scaleFactor,
          carbs: totals.carbs + meal.macros.carbs * scaleFactor,
          fats: totals.fats + meal.macros.fats * scaleFactor,
        };
      },
      { protein: 0, carbs: 0, fats: 0 }
    );
  };

  const checkMacroGoals = (loggedMacros, targetMacros) => {
    return {
      protein: loggedMacros.protein >= targetMacros.protein,
      carbs: loggedMacros.carbs >= targetMacros.carbs,
      fats: loggedMacros.fats >= targetMacros.fats,
    };
  };

  const getWeekDate = (weekIndex) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + weekIndex * 7);
    return start.toLocaleDateString();
  };

  const getDayDate = (weekIndex, dayIndex) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + weekIndex * 7 + dayIndex);
    return start.toLocaleDateString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to save a nutrition plan.");
      navigate("/login");
      return;
    }

    try {
      const newPlan = {
        user_id: user.id, // Use Supabase user ID
        name: planName,
        start_date: new Date(startDate).toISOString().split("T")[0],
        weeks: JSON.stringify(weeks), // Store weeks as JSON
      };
      const { data, error } = await supabase
        .from("nutrition_plans")
        .insert(newPlan)
        .select();
      if (error) throw error;
      navigate(`/nutrition-plan/${data[0].id}`);
    } catch (error) {
      console.error("Error saving nutrition plan:", error);
      alert("Failed to save nutrition plan. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 text-center text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1
        className={`text-4xl md:text-5xl font-extrabold text-center mb-10 tracking-tight ${
          isDarkMode ? "text-red-400" : "text-red-800"
        }`}
      >
        Create Your Nutrition Plan
      </h1>

      {/* Display Existing Plans */}
      {plans.length > 0 && (
        <div className="mb-12">
          <h2
            className={`text-3xl font-bold mb-6 ${
              isDarkMode ? "text-red-400" : "text-red-800"
            } tracking-tight`}
          >
            Your Nutrition Plans
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-200 ${
                  isDarkMode
                    ? "bg-stone-800/90 hover:bg-stone-700"
                    : "bg-red-50/90 hover:bg-red-100"
                } border ${isDarkMode ? "border-stone-700" : "border-red-200"}`}
                onClick={() => navigate(`/nutrition-plan/${plan.id}`)}
              >
                <h3
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-red-400" : "text-red-800"
                  } tracking-tight`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mt-2 ${
                    isDarkMode ? "text-stone-400" : "text-stone-600"
                  }`}
                >
                  Start Date: {plan.start_date}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          className={`mb-10 p-6 rounded-xl shadow-lg ${
            isDarkMode ? "bg-stone-800/90" : "bg-red-50/90"
          } backdrop-blur-sm border ${
            isDarkMode ? "border-stone-700" : "border-red-200"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                className={`block text-lg font-semibold mb-2 ${
                  isDarkMode ? "text-red-400" : "text-red-800"
                } tracking-wide`}
              >
                Plan Name
              </label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  isDarkMode
                    ? "bg-stone-700 border-stone-600 text-red-400 focus:ring-red-600"
                    : "bg-white border-red-200 text-red-800 focus:ring-red-600"
                } placeholder-stone-400`}
                placeholder="Enter plan name"
                required
              />
            </div>
            <div>
              <label
                className={`block text-lg font-semibold mb-2 ${
                  isDarkMode ? "text-red-400" : "text-red-800"
                } tracking-wide`}
              >
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  isDarkMode
                    ? "bg-stone-700 border-stone-600 text-red-400 focus:ring-red-600"
                    : "bg-white border-red-200 text-red-800 focus:ring-red-600"
                }`}
                required
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              className={`p-6 rounded-xl shadow-lg ${
                isDarkMode ? "bg-stone-800/90" : "bg-red-50/90"
              } backdrop-blur-sm border ${
                isDarkMode ? "border-stone-700" : "border-red-200"
              } transition-all duration-300`}
            >
              <div
                className={`flex justify-between items-center cursor-pointer p-4 rounded-lg transition-colors duration-200 ${
                  isDarkMode ? "hover:bg-stone-700" : "hover:bg-red-100"
                }`}
                onClick={() => toggleWeek(weekIndex)}
              >
                <h2
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-red-400" : "text-red-800"
                  } tracking-tight`}
                >
                  Week {week.week}{" "}
                  <span className="text-sm font-normal">
                    ({getWeekDate(weekIndex)})
                  </span>
                </h2>
                {expandedWeeks[weekIndex] ? (
                  <ChevronUp
                    className={`w-6 h-6 ${
                      isDarkMode ? "text-red-400" : "text-red-800"
                    } transition-transform duration-200`}
                  />
                ) : (
                  <ChevronDown
                    className={`w-6 h-6 ${
                      isDarkMode ? "text-red-400" : "text-red-800"
                    } transition-transform duration-200`}
                  />
                )}
              </div>
              {expandedWeeks[weekIndex] && (
                <div className="mt-6 space-y-6">
                  {week.days.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`border p-6 rounded-lg ${
                        isDarkMode
                          ? "border-stone-600 bg-stone-700/50"
                          : "border-red-200 bg-white/50"
                      } transition-all duration-200`}
                    >
                      <h3
                        className={`text-xl font-semibold mb-4 ${
                          isDarkMode ? "text-red-400" : "text-red-800"
                        } tracking-tight`}
                      >
                        {day.day}{" "}
                        <span className="text-sm font-normal">
                          ({getDayDate(weekIndex, dayIndex)})
                        </span>
                      </h3>
                      <div className="mb-6">
                        <h4
                          className={`text-lg font-semibold mb-3 ${
                            isDarkMode ? "text-red-400" : "text-red-800"
                          } tracking-wide`}
                        >
                          Macro Goals
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label
                              className={`block text-sm font-medium mb-1 ${
                                isDarkMode ? "text-red-400" : "text-red-800"
                              }`}
                            >
                              Protein (g)
                            </label>
                            <input
                              type="number"
                              value={day.macros.protein}
                              onChange={(e) =>
                                handleMacroChange(
                                  weekIndex,
                                  dayIndex,
                                  "protein",
                                  e.target.value
                                )
                              }
                              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                isDarkMode
                                  ? "bg-stone-700 border-stone-600 text-red-400 focus:ring-red-600"
                                  : "bg-white border-red-200 text-red-800 focus:ring-red-600"
                              }`}
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium mb-1 ${
                                isDarkMode ? "text-red-400" : "text-red-800"
                              }`}
                            >
                              Carbs (g)
                            </label>
                            <input
                              type="number"
                              value={day.macros.carbs}
                              onChange={(e) =>
                                handleMacroChange(
                                  weekIndex,
                                  dayIndex,
                                  "carbs",
                                  e.target.value
                                )
                              }
                              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                isDarkMode
                                  ? "bg-stone-700 border-stone-600 text-red-400 focus:ring-red-600"
                                  : "bg-white border-red-200 text-red-800 focus:ring-red-600"
                              }`}
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium mb-1 ${
                                isDarkMode ? "text-red-400" : "text-red-800"
                              }`}
                            >
                              Fats (g)
                            </label>
                            <input
                              type="number"
                              value={day.macros.fats}
                              onChange={(e) =>
                                handleMacroChange(
                                  weekIndex,
                                  dayIndex,
                                  "fats",
                                  e.target.value
                                )
                              }
                              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                isDarkMode
                                  ? "bg-stone-700 border-stone-600 text-red-400 focus:ring-red-600"
                                  : "bg-white border-red-200 text-red-800 focus:ring-red-600"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-6">
                        <h4
                          className={`text-lg font-semibold mb-3 ${
                            isDarkMode ? "text-red-400" : "text-red-800"
                          } tracking-wide`}
                        >
                          Plan a Meal
                        </h4>
                        {meals.length === 0 ? (
                          <p
                            className={`text-sm italic ${
                              isDarkMode ? "text-red-400" : "text-red-800"
                            }`}
                          >
                            No meals available. Please add meals in Supabase.
                          </p>
                        ) : day.meals.length > 0 ? (
                          day.meals.map((meal, mealIndex) => (
                            <div
                              key={mealIndex}
                              className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4 p-4 rounded-lg bg-opacity-50 border border-opacity-30"
                            >
                              <select
                                value={meal.name}
                                onChange={(e) =>
                                  handleMealChange(
                                    weekIndex,
                                    dayIndex,
                                    mealIndex,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className={`w-full sm:w-1/3 p-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                  isDarkMode
                                    ? "bg-stone-700 border-stone-600 text-red-400 focus:ring-red-600"
                                    : "bg-white border-red-200 text-red-800 focus:ring-red-600"
                                }`}
                              >
                                {categories.map(
                                  (category) =>
                                    groupedMeals[category] && (
                                      <optgroup key={category} label={category}>
                                        {groupedMeals[category].map((m) => (
                                          <option key={m.id} value={m.name}>
                                            {m.name}
                                          </option>
                                        ))}
                                      </optgroup>
                                    )
                                )}
                              </select>
                              <input
                                type="number"
                                value={meal.grams}
                                onChange={(e) =>
                                  handleMealChange(
                                    weekIndex,
                                    dayIndex,
                                    mealIndex,
                                    "grams",
                                    e.target.value
                                  )
                                }
                                className={`w-full sm:w-24 p-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                  isDarkMode
                                    ? "bg-stone-700 border-stone-600 text-red-400 focus:ring-red-600"
                                    : "bg-white border-red-200 text-red-800 focus:ring-red-600"
                                }`}
                                placeholder="Grams"
                              />
                              <select
                                value={meal.mealTime}
                                onChange={(e) =>
                                  handleMealChange(
                                    weekIndex,
                                    dayIndex,
                                    mealIndex,
                                    "mealTime",
                                    e.target.value
                                  )
                                }
                                className={`w-full sm:w-24 p-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                  isDarkMode
                                    ? "bg-stone-700 border-stone-600 text-red-400 focus:ring-red-600"
                                    : "bg-white border-red-200 text-red-800 focus:ring-red-600"
                                }`}
                              >
                                {mealTimes.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() =>
                                  handleLogMeal(weekIndex, dayIndex)
                                }
                                className={`mt-2 sm:mt-0 px-3 py-1 text-sm rounded-lg transition-all duration-200 font-medium ${
                                  isDarkMode
                                    ? "bg-red-700 text-white hover:bg-red-800"
                                    : "bg-red-600 text-white hover:bg-red-700"
                                } shadow-sm hover:shadow-md`}
                              >
                                Log
                              </button>
                            </div>
                          ))
                        ) : (
                          <p
                            className={`text-sm italic ${
                              isDarkMode ? "text-red-400" : "text-red-800"
                            }`}
                          >
                            No meals added yet.
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => handleAddMeal(weekIndex, dayIndex)}
                          className={`mt-4 w-full p-3 rounded-lg transition-all duration-200 font-medium ${
                            isDarkMode
                              ? "bg-red-700 text-white hover:bg-red-800"
                              : "bg-red-600 text-white hover:bg-red-700"
                          } shadow-sm hover:shadow-md`}
                        >
                          Add Meal
                        </button>
                      </div>
                      <div>
                        <h4
                          className={`text-lg font-semibold mb-3 ${
                            isDarkMode ? "text-red-400" : "text-red-800"
                          } tracking-wide`}
                        >
                          Logged Meals
                        </h4>
                        {Object.keys(day.loggedMeals).every(
                          (mealTime) => day.loggedMeals[mealTime].length === 0
                        ) ? (
                          <p
                            className={`text-sm italic ${
                              isDarkMode ? "text-red-400" : "text-red-800"
                            }`}
                          >
                            No meals logged yet.
                          </p>
                        ) : (
                          mealTimes.map((mealTime) => (
                            <div key={mealTime} className="mb-6">
                              <h5
                                className={`text-base font-semibold mb-2 ${
                                  isDarkMode ? "text-red-400" : "text-red-800"
                                } tracking-wide border-b ${
                                  isDarkMode
                                    ? "border-stone-600"
                                    : "border-red-200"
                                } pb-1`}
                              >
                                {mealTime}
                              </h5>
                              {day.loggedMeals[mealTime].length > 0 ? (
                                <ul className="space-y-2">
                                  {day.loggedMeals[mealTime].map(
                                    (meal, index) => (
                                      <li
                                        key={index}
                                        className={`flex items-center justify-between p-2 rounded-lg ${
                                          isDarkMode
                                            ? "bg-stone-600/30"
                                            : "bg-red-100/30"
                                        } transition-all duration-200 hover:bg-opacity-50`}
                                      >
                                        <span className="text-sm">
                                          {meal.name}: {meal.grams}g
                                        </span>
                                        <div className="flex space-x-2">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleEditMeal(
                                                weekIndex,
                                                dayIndex,
                                                mealTime,
                                                index,
                                                { ...meal }
                                              )
                                            }
                                            className={`p-1 rounded-md transition-colors duration-200 ${
                                              isDarkMode
                                                ? "text-red-400 hover:bg-stone-500"
                                                : "text-red-800 hover:bg-red-200"
                                            }`}
                                          >
                                            <Edit className="w-5 h-5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleDeleteMeal(
                                                weekIndex,
                                                dayIndex,
                                                mealTime,
                                                index
                                              )
                                            }
                                            className={`p-1 rounded-md transition-colors duration-200 ${
                                              isDarkMode
                                                ? "text-red-400 hover:bg-stone-500"
                                                : "text-red-800 hover:bg-red-200"
                                            }`}
                                          >
                                            <Trash2 className="w-5 h-5" />
                                          </button>
                                        </div>
                                      </li>
                                    )
                                  )}
                                </ul>
                              ) : (
                                <p
                                  className={`text-sm italic ${
                                    isDarkMode ? "text-red-400" : "text-red-800"
                                  }`}
                                >
                                  No {mealTime.toLowerCase()} logged.
                                </p>
                              )}
                            </div>
                          ))
                        )}
                        <div className="mt-6">
                          <h5
                            className={`text-base font-semibold mb-3 ${
                              isDarkMode ? "text-red-400" : "text-red-800"
                            } tracking-wide border-b ${
                              isDarkMode ? "border-stone-600" : "border-red-200"
                            } pb-1`}
                          >
                            Total Macros
                          </h5>
                          {(() => {
                            const loggedMacros = calculateLoggedMacros(
                              day.loggedMeals
                            );
                            const goalsMet = checkMacroGoals(
                              loggedMacros,
                              day.macros
                            );
                            return (
                              <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                  <span className="w-24 font-medium">
                                    Protein:
                                  </span>
                                  <div className="flex-1 bg-stone-200 dark:bg-stone-600 rounded-full h-4 overflow-hidden">
                                    <div
                                      className={`h-full ${
                                        goalsMet.protein
                                          ? "bg-green-500"
                                          : "bg-red-500"
                                      }`}
                                      style={{
                                        width: `${Math.min(
                                          (loggedMacros.protein /
                                            day.macros.protein) *
                                            100,
                                          100
                                        )}%`,
                                      }}
                                    />
                                  </div>
                                  <span className="text-sm">
                                    {loggedMacros.protein.toFixed(1)}g /{" "}
                                    {day.macros.protein}g
                                  </span>
                                  {goalsMet.protein ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                  )}
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className="w-24 font-medium">
                                    Carbs:
                                  </span>
                                  <div className="flex-1 bg-stone-200 dark:bg-stone-600 rounded-full h-4 overflow-hidden">
                                    <div
                                      className={`h-full ${
                                        goalsMet.carbs
                                          ? "bg-green-500"
                                          : "bg-red-500"
                                      }`}
                                      style={{
                                        width: `${Math.min(
                                          (loggedMacros.carbs /
                                            day.macros.carbs) *
                                            100,
                                          100
                                        )}%`,
                                      }}
                                    />
                                  </div>
                                  <span className="text-sm">
                                    {loggedMacros.carbs.toFixed(1)}g /{" "}
                                    {day.macros.carbs}g
                                  </span>
                                  {goalsMet.carbs ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                  )}
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className="w-24 font-medium">
                                    Fats:
                                  </span>
                                  <div className="flex-1 bg-stone-200 dark:bg-stone-600 rounded-full h-4 overflow-hidden">
                                    <div
                                      className={`h-full ${
                                        goalsMet.fats
                                          ? "bg-green-500"
                                          : "bg-red-500"
                                      }`}
                                      style={{
                                        width: `${Math.min(
                                          (loggedMacros.fats /
                                            day.macros.fats) *
                                            100,
                                          100
                                        )}%`,
                                      }}
                                    />
                                  </div>
                                  <span className="text-sm">
                                    {loggedMacros.fats.toFixed(1)}g /{" "}
                                    {day.macros.fats}g
                                  </span>
                                  {goalsMet.fats ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-12 max-w-md mx-auto">
          <button
            type="submit"
            className={`w-full p-4 rounded-lg transition-all duration-200 font-semibold text-lg ${
              isDarkMode
                ? "bg-red-700 text-white hover:bg-red-800"
                : "bg-red-600 text-white hover:bg-red-700"
            } shadow-md hover:shadow-lg`}
          >
            Save Plan
          </button>
        </div>
      </form>

      {/* Edit Meal Modal */}
      {editingMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div
            className={`p-8 rounded-xl shadow-2xl max-w-md w-full ${
              isDarkMode ? "bg-stone-800" : "bg-red-50"
            } border ${isDarkMode ? "border-stone-700" : "border-red-200"}`}
          >
            <h3
              className={`text-2xl font-semibold mb-6 ${
                isDarkMode ? "text-red-400" : "text-red-800"
              } tracking-tight`}
            >
              Edit Meal
            </h3>
            <div className="mb-6">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-red-400" : "text-red-800"
                } tracking-wide`}
              >
                Meal
              </label>
              <select
                value={editingMeal.meal.name}
                onChange={(e) => {
                  const selectedMeal = meals.find(
                    (m) => m.name === e.target.value
                  );
                  setEditingMeal({
                    ...editingMeal,
                    meal: {
                      ...editingMeal.meal,
                      name: e.target.value,
                      grams: selectedMeal.portion || 100,
                      referencePortion: selectedMeal.portion || 100,
                      macros: selectedMeal.macros,
                    },
                  });
                }}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  isDarkMode
                    ? "bg-stone-700 border-stone-600 text-red-400 focus:ring-red-600"
                    : "bg-white border-red-200 text-red-800 focus:ring-red-600"
                }`}
              >
                {categories.map(
                  (category) =>
                    groupedMeals[category] && (
                      <optgroup key={category} label={category}>
                        {groupedMeals[category].map((m) => (
                          <option key={m.id} value={m.name}>
                            {m.name}
                          </option>
                        ))}
                      </optgroup>
                    )
                )}
              </select>
            </div>
            <div className="mb-6">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-red-400" : "text-red-800"
                } tracking-wide`}
              >
                Grams
              </label>
              <input
                type="number"
                value={editingMeal.meal.grams}
                onChange={(e) =>
                  setEditingMeal({
                    ...editingMeal,
                    meal: {
                      ...editingMeal.meal,
                      grams: Number(e.target.value),
                    },
                  })
                }
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  isDarkMode
                    ? "bg-stone-700 border-stone-600 text-red-400 focus:ring-red-600"
                    : "bg-white border-red-200 text-red-800 focus:ring-red-600"
                }`}
              />
            </div>
            <div className="mb-6">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-red-400" : "text-red-800"
                } tracking-wide`}
              >
                Meal Time
              </label>
              <select
                value={editingMeal.meal.mealTime}
                onChange={(e) =>
                  setEditingMeal({
                    ...editingMeal,
                    meal: { ...editingMeal.meal, mealTime: e.target.value },
                  })
                }
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  isDarkMode
                    ? "bg-stone-700 border-stone-600 text-red-400 focus:ring-red-600"
                    : "bg-white border-red-200 text-red-800 focus:ring-red-600"
                }`}
              >
                {mealTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleSaveEdit}
                className={`flex-1 p-3 rounded-lg transition-all duration-200 font-medium ${
                  isDarkMode
                    ? "bg-red-700 text-white hover:bg-red-800"
                    : "bg-red-600 text-white hover:bg-red-700"
                } shadow-sm hover:shadow-md`}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingMeal(null)}
                className={`flex-1 p-3 rounded-lg transition-all duration-200 font-medium ${
                  isDarkMode
                    ? "bg-stone-600 text-white hover:bg-stone-700"
                    : "bg-red-200 text-red-800 hover:bg-red-300"
                } shadow-sm hover:shadow-md`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nutrition;
