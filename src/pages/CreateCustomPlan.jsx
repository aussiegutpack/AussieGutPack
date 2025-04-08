// src/pages/CreateCustomPlan.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { ThemeContext } from "../App";
import { ChevronDown, ChevronUp } from "lucide-react";

const CreateCustomPlan = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const [planName, setPlanName] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today
  const [workouts, setWorkouts] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState({}); // Grouped workouts by muscle group
  const [weeks, setWeeks] = useState(
    Array.from({ length: 6 }, (_, i) => ({
      week: i + 1,
      days: [
        { day: "Monday", workouts: [] },
        { day: "Tuesday", workouts: [] },
        { day: "Wednesday", workouts: [] },
        { day: "Thursday", workouts: [] },
        { day: "Friday", workouts: [] },
        { day: "Saturday", workouts: [] },
        { day: "Sunday", workouts: [] },
      ],
    }))
  );
  const [expandedWeeks, setExpandedWeeks] = useState(Array(6).fill(false));

  useEffect(() => {
    const fetchWorkouts = async () => {
      const db = getFirestore();
      const workoutsSnapshot = await getDocs(collection(db, "workouts"));
      const workoutList = workoutsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Group workouts by muscleGroup
      const groupedWorkouts = workoutList.reduce((acc, workout) => {
        const muscleGroup = workout.muscleGroup || "Other"; // Default to "Other" if muscleGroup is missing
        if (!acc[muscleGroup]) {
          acc[muscleGroup] = [];
        }
        acc[muscleGroup].push(workout);
        return acc;
      }, {});

      setWorkouts(workoutList);
      setMuscleGroups(groupedWorkouts);
    };
    fetchWorkouts();
  }, []);

  const toggleWeek = (weekIndex) => {
    const newExpandedWeeks = [...expandedWeeks];
    newExpandedWeeks[weekIndex] = !newExpandedWeeks[weekIndex];
    setExpandedWeeks(newExpandedWeeks);
  };

  const handleAddWorkout = (weekIndex, dayIndex) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].days[dayIndex].workouts.push({
      name: workouts[0]?.name || "",
      sets: 3,
      reps: 10,
    });
    setWeeks(newWeeks);
  };

  const handleWorkoutChange = (
    weekIndex,
    dayIndex,
    workoutIndex,
    field,
    value
  ) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].days[dayIndex].workouts[workoutIndex][field] = value;
    setWeeks(newWeeks);
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
    const docRef = await addDoc(collection(db, "customPlans"), newPlan);
    navigate(`/fitness-tracker/plan/${docRef.id}`);
  };

  // Calculate the date for each week and day based on the start date
  const getWeekDate = (weekIndex) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + weekIndex * 7); // Add 7 days for each week
    return start.toLocaleDateString();
  };

  const getDayDate = (weekIndex, dayIndex) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + weekIndex * 7 + dayIndex); // Add days for the week and day
    return start.toLocaleDateString();
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
          Create Custom Plan
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
                            Workouts:
                          </h4>
                          {day.workouts.length > 0 ? (
                            day.workouts.map((workout, workoutIndex) => (
                              <div
                                key={workoutIndex}
                                className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-3"
                              >
                                <select
                                  value={workout.name}
                                  onChange={(e) =>
                                    handleWorkoutChange(
                                      weekIndex,
                                      dayIndex,
                                      workoutIndex,
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
                                  {Object.keys(muscleGroups).map(
                                    (muscleGroup) => (
                                      <optgroup
                                        key={muscleGroup}
                                        label={muscleGroup}
                                      >
                                        {muscleGroups[muscleGroup].map((w) => (
                                          <option key={w.id} value={w.name}>
                                            {w.name}
                                          </option>
                                        ))}
                                      </optgroup>
                                    )
                                  )}
                                </select>
                                <input
                                  type="number"
                                  value={workout.sets}
                                  onChange={(e) =>
                                    handleWorkoutChange(
                                      weekIndex,
                                      dayIndex,
                                      workoutIndex,
                                      "sets",
                                      Number(e.target.value)
                                    )
                                  }
                                  className={`w-full sm:w-20 p-2 border rounded-md focus:outline-none focus:ring-2 mb-2 sm:mb-0 ${
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
                                    handleWorkoutChange(
                                      weekIndex,
                                      dayIndex,
                                      workoutIndex,
                                      "reps",
                                      e.target.value
                                    )
                                  }
                                  className={`w-full sm:w-20 p-2 border rounded-md focus:outline-none focus:ring-2 ${
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
                            onClick={() =>
                              handleAddWorkout(weekIndex, dayIndex)
                            }
                            className={`mt-2 w-full p-2 rounded-md transition-colors duration-200 ${
                              isDarkMode
                                ? "bg-red-800 text-white hover:bg-red-900"
                                : "bg-red-800 text-white hover:bg-red-900"
                            }`}
                          >
                            Add Workout
                          </button>
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
    </div>
  );
};

export default CreateCustomPlan;
