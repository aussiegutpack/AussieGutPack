// src/pages/NutritionPlanView.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ThemeContext } from "../App";
import { ClipLoader } from "react-spinners";
import { ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react";

const NutritionPlanView = () => {
  const { id } = useParams();
  const { isDarkMode } = useContext(ThemeContext);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedWeeks, setExpandedWeeks] = useState([]);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from("nutrition_plans")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        const weeks = JSON.parse(data.weeks);
        setPlan({
          ...data,
          weeks,
        });
        setExpandedWeeks(Array(weeks.length).fill(false));
      } catch (error) {
        console.error("Error fetching nutrition plan:", error);
        setError("Failed to load nutrition plan. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  const toggleWeek = (weekIndex) => {
    const newExpandedWeeks = [...expandedWeeks];
    newExpandedWeeks[weekIndex] = !newExpandedWeeks[weekIndex];
    setExpandedWeeks(newExpandedWeeks);
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
    const start = new Date(plan.start_date);
    start.setDate(start.getDate() + weekIndex * 7);
    return start.toLocaleDateString();
  };

  const getDayDate = (weekIndex, dayIndex) => {
    const start = new Date(plan.start_date);
    start.setDate(start.getDate() + weekIndex * 7 + dayIndex);
    return start.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 text-center text-lg">
        <ClipLoader color={isDarkMode ? "#f87171" : "#b91c1c"} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 text-center text-lg text-red-500">
        {error}
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container mx-auto px-4 py-10 text-center text-lg">
        Nutrition plan not found.
      </div>
    );
  }

  const mealTimes = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1
        className={`text-4xl md:text-5xl font-extrabold text-center mb-10 tracking-tight ${
          isDarkMode ? "text-red-400" : "text-red-800"
        }`}
      >
        {plan.name}
      </h1>
      <p
        className={`text-center text-lg mb-10 ${
          isDarkMode ? "text-stone-400" : "text-stone-600"
        }`}
      >
        Start Date: {new Date(plan.start_date).toLocaleDateString()}
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {plan.weeks.map((week, weekIndex) => (
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
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-stone-400" : "text-stone-600"
                            }`}
                          >
                            {day.macros.protein}g
                          </p>
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-1 ${
                              isDarkMode ? "text-red-400" : "text-red-800"
                            }`}
                          >
                            Carbs (g)
                          </label>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-stone-400" : "text-stone-600"
                            }`}
                          >
                            {day.macros.carbs}g
                          </p>
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-1 ${
                              isDarkMode ? "text-red-400" : "text-red-800"
                            }`}
                          >
                            Fats (g)
                          </label>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-stone-400" : "text-stone-600"
                            }`}
                          >
                            {day.macros.fats}g
                          </p>
                        </div>
                      </div>
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
                                <span className="w-24 font-medium">Carbs:</span>
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
                                <span className="w-24 font-medium">Fats:</span>
                                <div className="flex-1 bg-stone-200 dark:bg-stone-600 rounded-full h-4 overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      goalsMet.fats
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    }`}
                                    style={{
                                      width: `${Math.min(
                                        (loggedMacros.fats / day.macros.fats) *
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
    </div>
  );
};

export default NutritionPlanView;
