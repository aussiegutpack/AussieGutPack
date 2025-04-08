// src/pages/PlanView.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { ThemeContext } from "../App";

const PlanView = () => {
  const { id } = useParams();
  const { isDarkMode } = useContext(ThemeContext);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      const db = getFirestore();
      const planDoc = await getDoc(doc(db, "customPlans", id));
      if (planDoc.exists()) {
        setPlan({ id: planDoc.id, ...planDoc.data() });
      }
      setLoading(false);
    };
    fetchPlan();
  }, [id]);

  if (loading) {
    return (
      <div
        className={`min-h-screen pt-20 flex items-center justify-center ${
          isDarkMode ? "bg-stone-900 text-red-400" : "bg-white text-red-800"
        }`}
      >
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div
        className={`min-h-screen pt-20 flex items-center justify-center ${
          isDarkMode ? "bg-stone-900 text-red-400" : "bg-white text-red-800"
        }`}
      >
        <p className="text-xl">Plan not found.</p>
      </div>
    );
  }

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
                Week {week.week}
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
                    {day.day}
                  </h3>
                  <div className="mt-2">
                    <h4
                      className={`font-semibold mb-1 ${
                        isDarkMode ? "text-red-400" : "text-red-800"
                      }`}
                    >
                      Workouts:
                    </h4>
                    <ul className="list-disc pl-5">
                      {day.workouts.map((workout, workoutIndex) => (
                        <li key={workoutIndex}>
                          {workout.name}: {workout.sets} sets x {workout.reps}{" "}
                          reps
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2">
                    <h4
                      className={`font-semibold mb-1 ${
                        isDarkMode ? "text-red-400" : "text-red-800"
                      }`}
                    >
                      Macro Goals:
                    </h4>
                    <p>
                      Protein: {day.macros.protein}g, Carbs: {day.macros.carbs}
                      g, Fats: {day.macros.fats}g
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanView;
