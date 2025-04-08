// src/pages/NutritionPlanView.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { ThemeContext } from "../App";

const NutritionPlanView = () => {
  const { id } = useParams();
  const { isDarkMode } = useContext(ThemeContext);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      const db = getFirestore();
      const planDoc = await getDoc(doc(db, "nutritionPlans", id));
      if (planDoc.exists()) {
        setPlan({ id: planDoc.id, ...planDoc.data() });
      }
      setLoading(false);
    };
    fetchPlan();
  }, [id]);

  const getWeekDate = (weekIndex) => {
    if (!plan?.startDate) return "";
    const start = new Date(plan.startDate);
    start.setDate(start.getDate() + weekIndex * 7);
    return start.toLocaleDateString();
  };

  const getDayDate = (weekIndex, dayIndex) => {
    if (!plan?.startDate) return "";
    const start = new Date(plan.startDate);
    start.setDate(start.getDate() + weekIndex * 7 + dayIndex);
    return start.toLocaleDateString();
  };

  const calculateLoggedMacros = (loggedMeals) => {
    // Note: We don't have access to the meals collection here, so we'll assume loggedMeals include macros
    // In a real app, you might fetch meals again or store macros in loggedMeals when logging
    return loggedMeals.reduce(
      (totals, meal) => {
        const scaleFactor = meal.grams / meal.referencePortion; // Scale macros based on portion size
        return {
          protein: totals.protein + (meal.macros?.protein || 0) * scaleFactor,
          carbs: totals.carbs + (meal.macros?.carbs || 0) * scaleFactor,
          fats: totals.fats + (meal.macros?.fats || 0) * scaleFactor,
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
    return (
      <div className="container mx-auto px-4 py-10 flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container mx-auto px-4 py-10 flex items-center justify-center">
        <p className="text-xl">Plan not found.</p>
      </div>
    );
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
      <div className="max-w-4xl mx-auto">
        {plan.weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className={`mb-8 p-6 rounded-lg shadow-md ${
              isDarkMode ? "bg-stone-800" : "bg-red-50"
            }`}
          >
            <h2
              className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-red-400" : "text-red-800"
              }`}
            >
              Week {week.week} ({getWeekDate(weekIndex)})
            </h2>
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
                    <p>Protein: {day.macros.protein}g</p>
                    <p>Carbs: {day.macros.carbs}g</p>
                    <p>Fats: {day.macros.fats}g</p>
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
                  <ul className="list-disc pl-5">
                    {day.meals.map((meal, index) => (
                      <li key={index}>
                        {meal.name}: {meal.grams}g
                      </li>
                    ))}
                  </ul>
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
        ))}
      </div>
    </div>
  );
};

export default NutritionPlanView;
