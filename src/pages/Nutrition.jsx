// src/pages/Nutrition.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { ThemeContext } from "../App";
import { ChevronDown, ChevronUp } from "lucide-react";

const Nutrition = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const [planName, setPlanName] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [meals, setMeals] = useState([]);
  const [weeks, setWeeks] = useState(
    Array.from({ length: 6 }, (_, i) => ({
      week: i + 1,
      days: [
        {
          day: "Monday",
          meals: [],
          macros: { protein: 0, carbs: 0, fats: 0 },
          loggedMeals: [],
        },
        {
          day: "Tuesday",
          meals: [],
          macros: { protein: 0, carbs: 0, fats: 0 },
          loggedMeals: [],
        },
        {
          day: "Wednesday",
          meals: [],
          macros: { protein: 0, carbs: 0, fats: 0 },
          loggedMeals: [],
        },
        {
          day: "Thursday",
          meals: [],
          macros: { protein: 0, carbs: 0, fats: 0 },
          loggedMeals: [],
        },
        {
          day: "Friday",
          meals: [],
          macros: { protein: 0, carbs: 0, fats: 0 },
          loggedMeals: [],
        },
        {
          day: "Saturday",
          meals: [],
          macros: { protein: 0, carbs: 0, fats: 0 },
          loggedMeals: [],
        },
        {
          day: "Sunday",
          meals: [],
          macros: { protein: 0, carbs: 0, fats: 0 },
          loggedMeals: [],
        },
      ],
    }))
  );
  const [expandedWeeks, setExpandedWeeks] = useState(Array(6).fill(false));

  useEffect(() => {
    const fetchMeals = async () => {
      const db = getFirestore();
      const mealsSnapshot = await getDocs(collection(db, "meals"));
      const mealList = mealsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMeals(mealList);
    };
    fetchMeals();
  }, []);

  const toggleWeek = (weekIndex) => {
    const newExpandedWeeks = [...expandedWeeks];
    newExpandedWeeks[weekIndex] = !newExpandedWeeks[weekIndex];
    setExpandedWeeks(newExpandedWeeks);
  };

  const handleAddMeal = (weekIndex, dayIndex) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].days[dayIndex].meals.push({
      name: meals[0]?.name || "",
      grams: meals[0]?.portion || 100, // Default to the meal's portion size or 100g
    });
    setWeeks(newWeeks);
  };

  const handleMealChange = (weekIndex, dayIndex, mealIndex, field, value) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].days[dayIndex].meals[mealIndex][field] =
      field === "grams" ? Number(value) : value;
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
    const loggedMeal = { ...day.meals[day.meals.length - 1] }; // Log the last added meal
    if (loggedMeal.name) {
      day.loggedMeals.push(loggedMeal);
      setWeeks(newWeeks);
    }
  };

  const calculateLoggedMacros = (loggedMeals) => {
    return loggedMeals.reduce(
      (totals, meal) => {
        const mealData = meals.find((m) => m.name === meal.name);
        if (!mealData) return totals;
        const scaleFactor = meal.grams / mealData.portion; // Scale macros based on portion size
        return {
          protein: totals.protein + mealData.macros.protein * scaleFactor,
          carbs: totals.carbs + mealData.macros.carbs * scaleFactor,
          fats: totals.fats + mealData.macros.fats * scaleFactor,
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
    const db = getFirestore();
    const newPlan = {
      userId: "anonymous",
      name: planName,
      startDate: new Date(startDate).toISOString(),
      weeks,
    };
    const docRef = await addDoc(collection(db, "nutritionPlans"), newPlan);
    navigate(`/fitness-tracker/nutrition-plan/${docRef.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1
        className={`text-4xl font-bold text-center mb-8 ${
          isDarkMode ? "text-red-400" : "text-red-800"
        }`}
      >
        Create Nutrition Plan
      </h1>
      <form onSubmit={handleSubmit}>
        <div
          className={`mb-8 p-6 rounded-lg shadow-md ${
            isDarkMode ? "bg-stone-800" : "bg-red-50"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                className={`block text-xl font-semibold mb-2 ${
                  isDarkMode ? "text-red-400" : "text-red-800"
                }`}
              >
                Plan Name
              </label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "bg-stone-800 border-stone-600 text-red-400 focus:ring-red-800"
                    : "bg-white border-red-200 text-red-800 focus:ring-red-800"
                }`}
                required
              />
            </div>
            <div>
              <label
                className={`block text-xl font-semibold mb-2 ${
                  isDarkMode ? "text-red-400" : "text-red-800"
                }`}
              >
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "bg-stone-800 border-stone-600 text-red-400 focus:ring-red-800"
                    : "bg-white border-red-200 text-red-800 focus:ring-red-800"
                }`}
                required
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              className={`p-6 rounded-lg shadow-md ${
                isDarkMode ? "bg-stone-800" : "bg-red-50"
              }`}
            >
              <div
                className={`flex justify-between items-center cursor-pointer p-2 rounded-md transition-colors duration-200 ${
                  isDarkMode ? "hover:bg-stone-700" : "hover:bg-red-100"
                }`}
                onClick={() => toggleWeek(weekIndex)}
              >
                <h2
                  className={`text-2xl font-semibold ${
                    isDarkMode ? "text-red-400" : "text-red-800"
                  }`}
                >
                  Week {week.week} ({getWeekDate(weekIndex)})
                </h2>
                {expandedWeeks[weekIndex] ? (
                  <ChevronUp
                    className={`w-6 h-6 ${
                      isDarkMode ? "text-red-400" : "text-red-800"
                    }`}
                  />
                ) : (
                  <ChevronDown
                    className={`w-6 h-6 ${
                      isDarkMode ? "text-red-400" : "text-red-800"
                    }`}
                  />
                )}
              </div>
              {expandedWeeks[weekIndex] && (
                <div className="mt-4">
                  {week.days.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`border p-4 rounded-md mb-4 ${
                        isDarkMode ? "border-stone-600" : "border-red-200"
                      }`}
                    >
                      <h3
                        className={`text-xl font-semibold mb-2 ${
                          isDarkMode ? "text-red-400" : "text-red-800"
                        }`}
                      >
                        {day.day} ({getDayDate(weekIndex, dayIndex)})
                      </h3>
                      <div className="mb-4">
                        <h4
                          className={`text-base font-semibold mb-2 ${
                            isDarkMode ? "text-red-400" : "text-red-800"
                          }`}
                        >
                          Macro Goals:
                        </h4>
                        <div className="flex flex-col sm:flex-row sm:space-x-4">
                          <div className="mb-3 sm:mb-0">
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
                              className={`w-full sm:w-20 p-2 border rounded-md focus:outline-none focus:ring-2 ${
                                isDarkMode
                                  ? "bg-stone-800 border-stone-600 text-red-400 focus:ring-red-800"
                                  : "bg-white border-red-200 text-red-800 focus:ring-red-800"
                              }`}
                            />
                          </div>
                          <div className="mb-3 sm:mb-0">
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
                              className={`w-full sm:w-20 p-2 border rounded-md focus:outline-none focus:ring-2 ${
                                isDarkMode
                                  ? "bg-stone-800 border-stone-600 text-red-400 focus:ring-red-800"
                                  : "bg-white border-red-200 text-red-800 focus:ring-red-800"
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
                              className={`w-full sm:w-20 p-2 border rounded-md focus:outline-none focus:ring-2 ${
                                isDarkMode
                                  ? "bg-stone-800 border-stone-600 text-red-400 focus:ring-red-800"
                                  : "bg-white border-red-200 text-red-800 focus:ring-red-800"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4
                          className={`text-base font-semibold mb-2 ${
                            isDarkMode ? "text-red-400" : "text-red-800"
                          }`}
                        >
                          Planned Meals:
                        </h4>
                        {day.meals.length > 0 ? (
                          day.meals.map((meal, mealIndex) => (
                            <div
                              key={mealIndex}
                              className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-3"
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
                                className={`w-full sm:w-1/3 p-2 border rounded-md focus:outline-none focus:ring-2 mb-2 sm:mb-0 ${
                                  isDarkMode
                                    ? "bg-stone-800 border-stone-600 text-red-400 focus:ring-red-800"
                                    : "bg-white border-red-200 text-red-800 focus:ring-red-800"
                                }`}
                              >
                                {meals.map((m) => (
                                  <option key={m.id} value={m.name}>
                                    {m.name}
                                  </option>
                                ))}
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
                                className={`w-full sm:w-24 p-2 border rounded-md focus:outline-none focus:ring-2 ${
                                  isDarkMode
                                    ? "bg-stone-800 border-stone-600 text-red-400 focus:ring-red-800"
                                    : "bg-white border-red-200 text-red-800 focus:ring-red-800"
                                }`}
                                placeholder="Grams"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleLogMeal(weekIndex, dayIndex)
                                }
                                className={`mt-2 sm:mt-0 px-4 py-2 rounded-md transition-colors duration-200 ${
                                  isDarkMode
                                    ? "bg-red-800 text-white hover:bg-red-900"
                                    : "bg-red-800 text-white hover:bg-red-900"
                                }`}
                              >
                                Log Meal
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
                          className={`mt-2 w-full p-2 rounded-md transition-colors duration-200 ${
                            isDarkMode
                              ? "bg-red-800 text-white hover:bg-red-900"
                              : "bg-red-800 text-white hover:bg-red-900"
                          }`}
                        >
                          Add Meal
                        </button>
                      </div>
                      <div>
                        <h4
                          className={`text-base font-semibold mb-2 ${
                            isDarkMode ? "text-red-400" : "text-red-800"
                          }`}
                        >
                          Logged Meals:
                        </h4>
                        {day.loggedMeals.length > 0 ? (
                          <>
                            <ul className="list-disc pl-5 mb-4">
                              {day.loggedMeals.map((meal, index) => (
                                <li key={index}>
                                  {meal.name}: {meal.grams}g
                                </li>
                              ))}
                            </ul>
                            <div>
                              <h5
                                className={`text-sm font-semibold mb-2 ${
                                  isDarkMode ? "text-red-400" : "text-red-800"
                                }`}
                              >
                                Total Macros:
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
                                  <div className="flex flex-col sm:flex-row sm:space-x-4">
                                    <div>
                                      <p>
                                        Protein:{" "}
                                        {loggedMacros.protein.toFixed(1)}g /{" "}
                                        {day.macros.protein}g
                                        <span
                                          className={`ml-2 ${
                                            goalsMet.protein
                                              ? "text-green-500"
                                              : "text-red-500"
                                          }`}
                                        >
                                          {goalsMet.protein ? "✓" : "✗"}
                                        </span>
                                      </p>
                                    </div>
                                    <div>
                                      <p>
                                        Carbs: {loggedMacros.carbs.toFixed(1)}g
                                        / {day.macros.carbs}g
                                        <span
                                          className={`ml-2 ${
                                            goalsMet.carbs
                                              ? "text-green-500"
                                              : "text-red-500"
                                          }`}
                                        >
                                          {goalsMet.carbs ? "✓" : "✗"}
                                        </span>
                                      </p>
                                    </div>
                                    <div>
                                      <p>
                                        Fats: {loggedMacros.fats.toFixed(1)}g /{" "}
                                        {day.macros.fats}g
                                        <span
                                          className={`ml-2 ${
                                            goalsMet.fats
                                              ? "text-green-500"
                                              : "text-red-500"
                                          }`}
                                        >
                                          {goalsMet.fats ? "✓" : "✗"}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </>
                        ) : (
                          <p
                            className={`text-sm italic ${
                              isDarkMode ? "text-red-400" : "text-red-800"
                            }`}
                          >
                            No meals logged yet.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 max-w-md mx-auto">
          <button
            type="submit"
            className={`w-full p-3 rounded-md transition-colors duration-200 ${
              isDarkMode
                ? "bg-red-800 text-white hover:bg-red-900"
                : "bg-red-800 text-white hover:bg-red-900"
            }`}
          >
            Save Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default Nutrition;
