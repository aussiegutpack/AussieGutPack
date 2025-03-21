import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

function AdminPage() {
  const { isDarkMode } = useContext(ThemeContext);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [quotes, setQuotes] = useState([""]);
  const [workoutDesc, setWorkoutDesc] = useState("");
  const [exercises, setExercises] = useState([""]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchContent = async () => {
        const docRef = doc(db, "content", "home");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setQuotes(data.quotes.length ? data.quotes : [""]);
          setWorkoutDesc(data.dailyFitnessBoost?.description || "");
          setExercises(
            data.dailyFitnessBoost?.exercises.length
              ? data.dailyFitnessBoost.exercises
              : [""]
          );
        }
      };
      fetchContent();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === "aussie123") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  const handleSave = async () => {
    const updatedContent = {
      quotes: quotes.filter((quote) => quote.trim() !== ""),
      dailyFitnessBoost: {
        description: workoutDesc,
        exercises: exercises.filter((exercise) => exercise.trim() !== ""),
      },
    };
    try {
      await setDoc(doc(db, "content", "home"), updatedContent);
      alert("Changes saved successfully!");
      navigate("/");
    } catch (error) {
      alert("Error saving changes: " + error.message);
    }
  };

  const addQuote = () => setQuotes([...quotes, ""]);
  const removeQuote = (index) =>
    setQuotes(quotes.filter((_, i) => i !== index));
  const updateQuote = (index, value) => {
    const newQuotes = [...quotes];
    newQuotes[index] = value;
    setQuotes(newQuotes);
  };

  const addExercise = () => setExercises([...exercises, ""]);
  const removeExercise = (index) =>
    setExercises(exercises.filter((_, i) => i !== index));
  const updateExercise = (index, value) => {
    const newExercises = [...exercises];
    newExercises[index] = value;
    setExercises(newExercises);
  };

  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-stone-900" : "bg-white"
        }`}
      >
        <div
          className={`p-6 ${
            isDarkMode ? "bg-stone-800" : "bg-stone-100"
          } rounded shadow`}
        >
          <h2
            className={`text-2xl transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-red-400" : "text-red-800"
            } mb-4`}
          >
            Admin Login
          </h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`border p-2 w-full mb-4 ${
              isDarkMode
                ? "bg-stone-700 border-stone-600 text-white"
                : "bg-white border-red-300 text-red-600"
            }`}
            placeholder="Enter password"
          />
          <button
            onClick={handleLogin}
            className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 ${isDarkMode ? "bg-stone-900" : "bg-white"}`}
    >
      <h2
        className={`text-3xl transition-colors duration-300 ease-in-out ${
          isDarkMode ? "text-red-400" : "text-red-800"
        } mb-6`}
      >
        Edit Website Content
      </h2>
      <div className="mb-6">
        <h3
          className={`text-xl transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          } mb-2`}
        >
          Quotes
        </h3>
        {quotes.map((quote, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={quote}
              onChange={(e) => updateQuote(index, e.target.value)}
              className={`border p-2 w-full mr-2 ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white"
                  : "bg-white border-red-300 text-red-600"
              }`}
              placeholder={`Quote ${index + 1}`}
            />
            <button
              onClick={() => removeQuote(index)}
              className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
              disabled={quotes.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addQuote}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2"
        >
          Add Quote
        </button>
      </div>
      <div className="mb-6">
        <h3
          className={`text-xl transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          } mb-2`}
        >
          Workout Description
        </h3>
        <textarea
          value={workoutDesc}
          onChange={(e) => setWorkoutDesc(e.target.value)}
          className={`border p-2 w-full h-24 ${
            isDarkMode
              ? "bg-stone-700 border-stone-600 text-white"
              : "bg-white border-red-300 text-red-600"
          }`}
        />
      </div>
      <div className="mb-6">
        <h3
          className={`text-xl transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          } mb-2`}
        >
          Exercises
        </h3>
        {exercises.map((exercise, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={exercise}
              onChange={(e) => updateExercise(index, e.target.value)}
              className={`border p-2 w-full mr-2 ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white"
                  : "bg-white border-red-300 text-red-600"
              }`}
              placeholder={`Exercise ${index + 1}`}
            />
            <button
              onClick={() => removeExercise(index)}
              className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
              disabled={exercises.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addExercise}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2"
        >
          Add Exercise
        </button>
      </div>
      <button
        onClick={handleSave}
        className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mr-4"
      >
        Save Changes
      </button>
      <button
        onClick={() => navigate("/")}
        className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
      >
        Back to Home
      </button>
    </div>
  );
}

export default AdminPage;
