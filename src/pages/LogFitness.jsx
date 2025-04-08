// src/pages/LogFitness.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { ThemeContext } from "../App";

const LogFitness = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const [workouts, setWorkouts] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loggedWorkouts, setLoggedWorkouts] = useState([]);
  const [loggedMeals, setLoggedMeals] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const workoutsSnapshot = await getDocs(collection(db, "workouts"));
      const foodsSnapshot = await getDocs(collection(db, "foods"));
      setWorkouts(
        workoutsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setFoods(
        foodsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchData();
  }, []);

  const handleAddWorkout = () => {
    setLoggedWorkouts([
      ...loggedWorkouts,
      { name: workouts[0]?.name || "", sets: 3, reps: 10 },
    ]);
  };

  const handleWorkoutChange = (index, field, value) => {
    const newWorkouts = [...loggedWorkouts];
    newWorkouts[index][field] = value;
    setLoggedWorkouts(newWorkouts);
  };

  const handleAddMeal = () => {
    const defaultFood = foods[0];
    setLoggedMeals([
      ...loggedMeals,
      { name: defaultFood?.name || "", quantity: defaultFood?.portion || 100 },
    ]);
  };

  const handleMealChange = (index, field, value) => {
    const newMeals = [...loggedMeals];
    newMeals[index][field] = field === "quantity" ? Number(value) : value;
    setLoggedMeals(newMeals);
  };

  const calculateMealMacros = (meal) => {
    const food = foods.find((f) => f.name === meal.name);
    if (!food) return { protein: 0, carbs: 0, fats: 0 };
    const factor = meal.quantity / food.portion;
    return {
      protein: food.macros.protein * factor,
      carbs: food.macros.carbs * factor,
      fats: food.macros.fats * factor,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getFirestore();
    const log = {
      userId: "anonymous",
      date: new Date(date).toISOString(),
      workouts: loggedWorkouts,
      meals: loggedMeals.map((meal) => ({
        ...meal,
        macros: calculateMealMacros(meal),
      })),
    };
    await addDoc(collection(db, "userLogs"), log);
    navigate("/fitness-tracker/history");
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
          Log Meals & Workouts
        </h1>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="mb-6">
            <label
              className={`block text-lg font-semibold mb-2 ${
                isDarkMode ? "text-red-400" : "text-red-800"
              }`}
            >
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-stone-800 border-stone-600 text-red-400 focus:ring-red-800"
                  : "bg-white border-red-200 text-red-800 focus:ring-red-800"
              }`}
              required
            />
          </div>
          <div
            className={`mb-8 p-6 rounded-lg shadow-md ${
              isDarkMode ? "bg-stone-800" : "bg-red-50"
            }`}
          >
            <h2
              className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-red-400" : "text-red-800"
              }`}
            >
              Workouts
            </h2>
            {loggedWorkouts.map((workout, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-3"
              >
                <select
                  value={workout.name}
                  onChange={(e) =>
                    handleWorkoutChange(index, "name", e.target.value)
                  }
                  className={`w-full sm:w-1/3 p-2 border rounded-md focus:outline-none focus:ring-2 mb-2 sm:mb-0 ${
                    isDarkMode
                      ? "bg-stone-800 border-stone-600 text-red-400 focus:ring-red-800"
                      : "bg-white border-red-200 text-red-800 focus:ring-red-800"
                  }`}
                >
                  {workouts.map((w) => (
                    <option key={w.id} value={w.name}>
                      {w.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={workout.sets}
                  onChange={(e) =>
                    handleWorkoutChange(index, "sets", Number(e.target.value))
                  }
                  className={`w-full sm:w-24 p-2 border rounded-md focus:outline-none focus:ring-2 mb-2 sm:mb-0 ${
                    isDarkMode
                      ? "bg-stone-800 border-stone-600 text-red-400 focus:ring-red-800"
                      : "bg-white border-red-200 text-red-800 focus:ring-red-800"
                  }`}
                  placeholder="Sets"
                />
                <input
                  type="text"
                  value={workout.reps}
                  onChange={(e) =>
                    handleWorkoutChange(index, "reps", e.target.value)
                  }
                  className={`w-full sm:w-24 p-2 border rounded-md focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-stone-800 border-stone-600 text-red-400 focus:ring-red-800"
                      : "bg-white border-red-200 text-red-800 focus:ring-red-800"
                  }`}
                  placeholder="Reps"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddWorkout}
              className={`mt-2 px-4 py-1 rounded-md transition-colors duration-200 ${
                isDarkMode
                  ? "bg-red-800 text-white hover:bg-red-900"
                  : "bg-red-800 text-white hover:bg-red-900"
              }`}
            >
              Add Workout
            </button>
          </div>
          <div
            className={`mb-8 p-6 rounded-lg shadow-md ${
              isDarkMode ? "bg-stone-800" : "bg-red-50"
            }`}
          >
            <h2
              className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-red-400" : "text-red-800"
              }`}
            >
              Meals
            </h2>
            {loggedMeals.map((meal, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-3"
              >
                <select
                  value={meal.name}
                  onChange={(e) => {
                    const selectedFood = foods.find(
                      (f) => f.name === e.target.value
                    );
                    handleMealChange(index, "name", e.target.value);
                    handleMealChange(
                      index,
                      "quantity",
                      selectedFood?.portion || 100
                    );
                  }}
                  className={`w-full sm:w-2/3 p-2 border rounded-md focus:outline-none focus:ring-2 mb-2 sm:mb-0 ${
                    isDarkMode
                      ? "bg-stone-800 border-stone-600 text-red-400 focus:ring-red-800"
                      : "bg-white border-red-200 text-red-800 focus:ring-red-800"
                  }`}
                >
                  {foods.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={meal.quantity}
                  onChange={(e) =>
                    handleMealChange(index, "quantity", e.target.value)
                  }
                  className={`w-full sm:w-24 p-2 border rounded-md focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-stone-800 border-stone-600 text-red-400 focus:ring-red-800"
                      : "bg-white border-red-200 text-red-800 focus:ring-red-800"
                  }`}
                  placeholder="Quantity (g)"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddMeal}
              className={`mt-2 px-4 py-1 rounded-md transition-colors duration-200 ${
                isDarkMode
                  ? "bg-red-800 text-white hover:bg-red-900"
                  : "bg-red-800 text-white hover:bg-red-900"
              }`}
            >
              Add Meal
            </button>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                isDarkMode
                  ? "bg-red-800 text-white hover:bg-red-900"
                  : "bg-red-800 text-white hover:bg-red-900"
              }`}
            >
              Save Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogFitness;
