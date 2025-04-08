// src/pages/LogFitness.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { ThemeContext } from "../App";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const LogFitness = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const { user, loading } = useContext(AuthContext); // Get user and loading state
  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loggedWorkouts, setLoggedWorkouts] = useState([]);
  const [loggedMeals, setLoggedMeals] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        const workoutsSnapshot = await getDocs(collection(db, "workouts"));
        const mealsSnapshot = await getDocs(collection(db, "foods"));
        const workoutList = workoutsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const mealList = mealsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(
          "Fetched workouts from 'workouts' collection:",
          workoutList
        );
        console.log("Fetched meals from 'foods' collection:", mealList);
        setWorkouts(workoutList);
        setMeals(mealList);
        if (workoutList.length === 0) {
          console.warn("No workouts found in Firestore 'workouts' collection.");
        }
        if (mealList.length === 0) {
          console.warn("No meals found in Firestore 'foods' collection.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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

  const handleAddWorkout = () => {
    if (workouts.length === 0) {
      alert("No workouts available to add. Please add workouts in Firestore.");
      return;
    }
    setLoggedWorkouts([
      ...loggedWorkouts,
      { name: workouts[0].name, sets: 0, reps: 0 },
    ]);
  };

  const handleWorkoutChange = (index, field, value) => {
    const newWorkouts = [...loggedWorkouts];
    newWorkouts[index][field] =
      field === "sets" || field === "reps" ? Number(value) : value;
    setLoggedWorkouts(newWorkouts);
  };

  const handleAddMeal = () => {
    if (meals.length === 0) {
      alert("No meals available to add. Please add meals in Firestore.");
      return;
    }
    setLoggedMeals([...loggedMeals, { name: meals[0].name, quantity: 1 }]);
  };

  const handleMealChange = (index, field, value) => {
    const newMeals = [...loggedMeals];
    newMeals[index][field] = field === "quantity" ? Number(value) : value;
    setLoggedMeals(newMeals);
  };

  const calculateMealMacros = (meal) => {
    const mealData = meals.find((m) => m.name === meal.name);
    if (!mealData) return { protein: 0, carbs: 0, fats: 0 };
    return {
      protein: mealData.macros.protein * meal.quantity,
      carbs: mealData.macros.carbs * meal.quantity,
      fats: mealData.macros.fats * meal.quantity,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to save a fitness log.");
      navigate("/login");
      return;
    }
    const db = getFirestore();
    const log = {
      userId: user.uid, // Use the logged-in user's UID
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

  if (loading) {
    return <div className="container mx-auto px-4 py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1
        className={`text-4xl font-bold text-center mb-8 ${
          isDarkMode ? "text-red-400" : "text-red-800"
        }`}
      >
        Log Fitness
      </h1>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div
          className={`mb-8 p-6 rounded-lg shadow-md ${
            isDarkMode ? "bg-stone-800" : "bg-red-50"
          }`}
        >
          <label
            className={`block text-xl font-semibold mb-2 ${
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

        {/* Workouts Section */}
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
          {workouts.length === 0 ? (
            <p
              className={`text-sm italic ${
                isDarkMode ? "text-red-400" : "text-red-800"
              }`}
            >
              No workouts available. Please add workouts in Firestore.
            </p>
          ) : loggedWorkouts.length > 0 ? (
            loggedWorkouts.map((workout, index) => (
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
                    handleWorkoutChange(index, "sets", e.target.value)
                  }
                  className={`w-full sm:w-24 p-2 border rounded-md focus:outline-none focus:ring-2 mb-2 sm:mb-0 ${
                    isDarkMode
                      ? "bg-stone-800 border-stone-600 text-red-400 focus:ring-red-800"
                      : "bg-white border-red-200 text-red-800 focus:ring-red-800"
                  }`}
                  placeholder="Sets"
                />
                <input
                  type="number"
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
            ))
          ) : (
            <p
              className={`text-sm italic ${
                isDarkMode ? "text-red-400" : "text-red-800"
              }`}
            >
              No workouts added yet.
            </p>
          )}
          <button
            type="button"
            onClick={handleAddWorkout}
            className={`mt-2 px-4 py-2 rounded-md transition-colors duration-200 ${
              isDarkMode
                ? "bg-red-800 text-white hover:bg-red-900"
                : "bg-red-800 text-white hover:bg-red-900"
            }`}
          >
            Add Workout
          </button>
        </div>

        {/* Meals Section */}
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
          {meals.length === 0 ? (
            <p
              className={`text-sm italic ${
                isDarkMode ? "text-red-400" : "text-red-800"
              }`}
            >
              No meals available. Please add meals in Firestore.
            </p>
          ) : loggedMeals.length > 0 ? (
            loggedMeals.map((meal, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-3"
              >
                <select
                  value={meal.name}
                  onChange={(e) =>
                    handleMealChange(index, "name", e.target.value)
                  }
                  className={`w-full sm:w-1/3 p-2 border rounded-md focus:outline-none focus:ring-2 mb-2 sm:mb-0 ${
                    isDarkMode
                      ? "bg-stone-800 border-stone-600 text-red-400 focus:ring-red-800"
                      : "bg-white border-red-200 text-red-800 focus:ring-red-800"
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
                  value={meal.quantity}
                  onChange={(e) =>
                    handleMealChange(index, "quantity", e.target.value)
                  }
                  className={`w-full sm:w-24 p-2 border rounded-md focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-stone-800 border-stone-600 text-red-400 focus:ring-red-800"
                      : "bg-white border-red-200 text-red-800 focus:ring-red-800"
                  }`}
                  placeholder="Quantity"
                />
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
            onClick={handleAddMeal}
            className={`mt-2 px-4 py-2 rounded-md transition-colors duration-200 ${
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
  );
};

export default LogFitness;
