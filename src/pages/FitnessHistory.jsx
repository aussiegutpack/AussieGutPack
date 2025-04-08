// src/pages/FitnessHistory.jsx
import React, { useState, useEffect, useContext } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { ThemeContext } from "../App";

const FitnessHistory = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const db = getFirestore();
      const logsSnapshot = await getDocs(collection(db, "userLogs"));
      const allLogs = logsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLogs(allLogs.sort((a, b) => new Date(b.date) - new Date(a.date)));
    };
    fetchLogs();
  }, []);

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
          Fitness History
        </h1>
        <div className="max-w-2xl mx-auto">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div
                key={log.id}
                className={`border p-6 rounded-lg shadow-md mb-6 ${
                  isDarkMode
                    ? "border-stone-600 bg-stone-800"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <h2
                  className={`text-xl font-semibold mb-2 ${
                    isDarkMode ? "text-red-400" : "text-red-800"
                  }`}
                >
                  {new Date(log.date).toLocaleDateString()}
                </h2>
                <div className="mt-2">
                  <h3
                    className={`font-semibold mb-1 ${
                      isDarkMode ? "text-red-400" : "text-red-800"
                    }`}
                  >
                    Workouts:
                  </h3>
                  <ul className="list-disc pl-5">
                    {log.workouts.map((workout, index) => (
                      <li key={index}>
                        {workout.name}: {workout.sets} sets x {workout.reps}{" "}
                        reps
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2">
                  <h3
                    className={`font-semibold mb-1 ${
                      isDarkMode ? "text-red-400" : "text-red-800"
                    }`}
                  >
                    Meals:
                  </h3>
                  <ul className="list-disc pl-5">
                    {log.meals.map((meal, index) => (
                      <li key={index}>
                        {meal.name} ({meal.quantity}g): Protein{" "}
                        {meal.macros.protein.toFixed(1)}g, Carbs{" "}
                        {meal.macros.carbs.toFixed(1)}g, Fats{" "}
                        {meal.macros.fats.toFixed(1)}g
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p
              className={`text-center text-lg ${
                isDarkMode ? "text-red-400" : "text-red-800"
              }`}
            >
              No logs found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FitnessHistory;
