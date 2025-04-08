// src/pages/NutritionPlanView.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { ThemeContext } from "../App";
import { AuthContext } from "../context/AuthContext";
import { ChevronDown, ChevronUp } from "lucide-react";

const NutritionPlanView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const { user, loading } = useContext(AuthContext);
  const [plan, setPlan] = useState(null);
  const [expandedWeeks, setExpandedWeeks] = useState([]);
  const mealTimes = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const db = getFirestore();
        const planDoc = await getDoc(doc(db, "nutritionPlans", id));
        if (planDoc.exists()) {
          const planData = planDoc.data();
          if (planData.userId !== user?.uid) {
            alert("You do not have permission to view this plan.");
            navigate("/nutrition");
            return;
          }
          setPlan(planData);
          setExpandedWeeks(Array(planData.weeks.length).fill(false));
        } else {
          console.error("Plan not found");
          navigate("/nutrition");
        }
      } catch (error) {
        console.error("Error fetching plan:", error);
        navigate("/nutrition");
      }
    };

    if (!loading && user) {
      fetchPlan();
    } else if (!loading && !user) {
      alert("Please log in to view your nutrition plan.");
      navigate("/login");
    }
  }, [id, user, loading, navigate]);

  const toggleWeek = (weekIndex) => {
    const newExpandedWeeks = [...expandedWeeks];
    newExpandedWeeks[weekIndex] = !newExpandedWeeks[weekIndex];
    setExpandedWeeks(newExpandedWeeks);
  };

  const getWeekDate = (weekIndex) => {
    const start = new Date(plan.startDate);
    start.setDate(start.getDate() + weekIndex * 7);
    return start.toLocaleDateString();
  };

  const getDayDate = (weekIndex, dayIndex) => {
    const start = new Date(plan.startDate);
    start.setDate(start.getDate() + weekIndex * 7 + dayIndex);
    return start.toLocaleDateString();
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

  if (loading) {
    return <div className="container mx-auto px-4 py-10">Loading...</div>;
  }

  if (!plan) {
    return <div className="container mx-auto px-4 py-10">Loading plan...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1
        className={`text-4xl font-bold text-center mb-8 ${
          isDarkMode ? "text-red-400" : "text-red-800"
        }`}
      >
        {plan.name}
      </h1>
      <p
        className={`text-center mb-8 ${
          isDarkMode ? "text-red-400" : "text-red-800"
        }`}
      >
        Start Date: {new Date(plan.startDate).toLocaleDateString()}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plan.weeks.map((week, weekIndex) => (
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
                        <div>
                          <p>Protein: {day.macros.protein}g</p>
                        </div>
                        <div>
                          <p>Carbs: {day.macros.carbs}g</p>
                        </div>
                        <div>
                          <p>Fats: {day.macros.fats}g</p>
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
                        <ul className="list-disc pl-5">
                          {day.meals.map((meal, mealIndex) => (
                            <li key={mealIndex}>
                              {meal.name}: {meal.grams}g ({meal.mealTime})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p
                          className={`text-sm italic ${
                            isDarkMode ? "text-red-400" : "text-red-800"
                          }`}
                        >
                          No meals planned.
                        </p>
                      )}
                    </div>
                    <div>
                      <h4
                        className={`text-base font-semibold mb-2 ${
                          isDarkMode ? "text-red-400" : "text-red-800"
                        }`}
                      >
                        Logged Meals:
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
                          <div key={mealTime} className="mb-4">
                            <h5
                              className={`text-lg font-semibold mb-2 ${
                                isDarkMode ? "text-red-400" : "text-red-800"
                              }`}
                            >
                              {mealTime}
                            </h5>
                            {day.loggedMeals[mealTime].length > 0 ? (
                              <ul className="list-disc pl-5 mb-4">
                                {day.loggedMeals[mealTime].map(
                                  (meal, index) => (
                                    <li key={index}>
                                      {meal.name}: {meal.grams}g
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
                                  Protein: {loggedMacros.protein.toFixed(1)}g /{" "}
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
                                  Carbs: {loggedMacros.carbs.toFixed(1)}g /{" "}
                                  {day.macros.carbs}g
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
