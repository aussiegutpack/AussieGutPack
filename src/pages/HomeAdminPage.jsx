// src/pages/HomeAdminPage.js
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { db, auth } from "../firebase"; // Import auth
import { onAuthStateChanged, signOut } from "firebase/auth"; // Import Firebase Auth methods
import { doc, setDoc, getDoc } from "firebase/firestore";

function HomeAdminPage() {
  const { isDarkMode } = useContext(ThemeContext);
  const [quotes, setQuotes] = useState([""]);
  const [workoutDesc, setWorkoutDesc] = useState("");
  const [warmupExercises, setWarmupExercises] = useState([""]);
  const [mainExercises, setMainExercises] = useState([""]);
  const [scheduledWorkouts, setScheduledWorkouts] = useState([]);
  const [aboutUs, setAboutUs] = useState("");
  const [dailyChallenges, setDailyChallenges] = useState([""]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/admin"); // Redirect to /admin if not authenticated
      }
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, [navigate]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const homeDocRef = doc(db, "content", "home");
        const homeDocSnap = await getDoc(homeDocRef);
        if (homeDocSnap.exists()) {
          const data = homeDocSnap.data();
          setQuotes(data.quotes?.length ? data.quotes : [""]);
          setWorkoutDesc(data.currentWorkout?.description || "");
          setWarmupExercises(
            data.currentWorkout?.warmup?.length
              ? data.currentWorkout.warmup
              : [""]
          );
          setMainExercises(
            data.currentWorkout?.main?.length ? data.currentWorkout.main : [""]
          );
          setScheduledWorkouts(
            data.scheduledWorkouts?.length
              ? data.scheduledWorkouts.map((workout) => ({
                  ...workout,
                  warmup: workout.warmup || [""],
                  main: workout.main || [""],
                }))
              : [
                  {
                    description: "",
                    warmup: [""],
                    main: [""],
                    updateDateTime: "",
                  },
                ]
          );
          setAboutUs(data.aboutUs || "");
          setDailyChallenges(
            data.dailyChallenges?.length ? data.dailyChallenges : [""]
          );
        }
      } catch (err) {
        setError("Failed to load content: " + err.message);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setError(null);
    const updatedContent = {
      quotes: quotes.filter((quote) => quote.trim() !== ""),
      currentWorkout: {
        description: workoutDesc,
        warmup: warmupExercises.filter((exercise) => exercise.trim() !== ""),
        main: mainExercises.filter((exercise) => exercise.trim() !== ""),
      },
      scheduledWorkouts: scheduledWorkouts
        .filter(
          (workout) =>
            workout.description.trim() &&
            (workout.warmup.length > 0 || workout.main.length > 0) &&
            workout.updateDateTime.trim()
        )
        .map((workout) => ({
          description: workout.description,
          warmup: workout.warmup.filter((ex) => ex.trim() !== ""),
          main: workout.main.filter((ex) => ex.trim() !== ""),
          updateDateTime: workout.updateDateTime,
        })),
      aboutUs: aboutUs.trim(),
      dailyChallenges: dailyChallenges.filter(
        (challenge) => challenge.trim() !== ""
      ),
      lastUpdated: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, "content", "home"), updatedContent);
      alert("Home page content saved successfully!");
      navigate("/admin");
    } catch (err) {
      setError("Error saving changes: " + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin"); // Redirect to /admin after logout
    } catch (err) {
      setError("Failed to log out: " + err.message);
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

  const addWarmupExercise = () => setWarmupExercises([...warmupExercises, ""]);
  const removeWarmupExercise = (index) =>
    setWarmupExercises(warmupExercises.filter((_, i) => i !== index));
  const updateWarmupExercise = (index, value) => {
    const newExercises = [...warmupExercises];
    newExercises[index] = value;
    setWarmupExercises(newExercises);
  };

  const addMainExercise = () => setMainExercises([...mainExercises, ""]);
  const removeMainExercise = (index) =>
    setMainExercises(mainExercises.filter((_, i) => i !== index));
  const updateMainExercise = (index, value) => {
    const newExercises = [...mainExercises];
    newExercises[index] = value;
    setMainExercises(newExercises);
  };

  const addScheduledWorkout = () =>
    setScheduledWorkouts([
      ...scheduledWorkouts,
      { description: "", warmup: [""], main: [""], updateDateTime: "" },
    ]);
  const removeScheduledWorkout = (index) =>
    setScheduledWorkouts(scheduledWorkouts.filter((_, i) => i !== index));
  const updateScheduledWorkout = (index, field, value) => {
    const newScheduledWorkouts = [...scheduledWorkouts];
    newScheduledWorkouts[index][field] = value;
    setScheduledWorkouts(newScheduledWorkouts);
  };

  const addScheduledWarmupExercise = (index) => {
    const newScheduledWorkouts = [...scheduledWorkouts];
    newScheduledWorkouts[index].warmup.push("");
    setScheduledWorkouts(newScheduledWorkouts);
  };
  const removeScheduledWarmupExercise = (index, exerciseIndex) => {
    const newScheduledWorkouts = [...scheduledWorkouts];
    newScheduledWorkouts[index].warmup = newScheduledWorkouts[
      index
    ].warmup.filter((_, i) => i !== exerciseIndex);
    setScheduledWorkouts(newScheduledWorkouts);
  };
  const updateScheduledWarmupExercise = (index, exerciseIndex, value) => {
    const newScheduledWorkouts = [...scheduledWorkouts];
    newScheduledWorkouts[index].warmup[exerciseIndex] = value;
    setScheduledWorkouts(newScheduledWorkouts);
  };

  const addScheduledMainExercise = (index) => {
    const newScheduledWorkouts = [...scheduledWorkouts];
    newScheduledWorkouts[index].main.push("");
    setScheduledWorkouts(newScheduledWorkouts);
  };
  const removeScheduledMainExercise = (index, exerciseIndex) => {
    const newScheduledWorkouts = [...scheduledWorkouts];
    newScheduledWorkouts[index].main = newScheduledWorkouts[index].main.filter(
      (_, i) => i !== exerciseIndex
    );
    setScheduledWorkouts(newScheduledWorkouts);
  };
  const updateScheduledMainExercise = (index, exerciseIndex, value) => {
    const newScheduledWorkouts = [...scheduledWorkouts];
    newScheduledWorkouts[index].main[exerciseIndex] = value;
    setScheduledWorkouts(newScheduledWorkouts);
  };

  const addDailyChallenge = () => setDailyChallenges([...dailyChallenges, ""]);
  const removeDailyChallenge = (index) =>
    setDailyChallenges(dailyChallenges.filter((_, i) => i !== index));
  const updateDailyChallenge = (index, value) => {
    const newChallenges = [...dailyChallenges];
    newChallenges[index] = value;
    setDailyChallenges(newChallenges);
  };

  return (
    <div
      className={`min-h-screen p-6 ${isDarkMode ? "bg-stone-900" : "bg-white"}`}
    >
      <h2
        className={`text-3xl transition-colors duration-300 ease-in-out ${
          isDarkMode ? "text-red-400" : "text-red-800"
        } mb-6`}
      >
        Edit Home Page Content
      </h2>

      {error && (
        <p
          className={`text-red-500 mb-4 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          {error}
        </p>
      )}

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
          About Us
        </h3>
        <textarea
          value={aboutUs}
          onChange={(e) => setAboutUs(e.target.value)}
          className={`border p-2 w-full h-24 ${
            isDarkMode
              ? "bg-stone-700 border-stone-600 text-white"
              : "bg-white border-red-300 text-red-600"
          }`}
          placeholder="About Us text"
        />
      </div>

      <div className="mb-6">
        <h3
          className={`text-xl transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          } mb-2`}
        >
          Current Workout of the Day
        </h3>
        <textarea
          value={workoutDesc}
          onChange={(e) => setWorkoutDesc(e.target.value)}
          className={`border p-2 w-full h-24 ${
            isDarkMode
              ? "bg-stone-700 border-stone-600 text-white"
              : "bg-white border-red-300 text-red-600"
          }`}
          placeholder="Current workout description"
        />

        <h4
          className={`text-lg transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-blue-300" : "text-blue-600"
          } mt-4 mb-2`}
        >
          Warm Up Exercises
        </h4>
        {warmupExercises.map((exercise, index) => (
          <div key={`warmup-${index}`} className="flex mb-2">
            <input
              type="text"
              value={exercise}
              onChange={(e) => updateWarmupExercise(index, e.target.value)}
              className={`border p-2 w-full mr-2 ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white"
                  : "bg-white border-red-300 text-red-600"
              }`}
              placeholder={`Warm Up ${index + 1}`}
            />
            <button
              onClick={() => removeWarmupExercise(index)}
              className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
              disabled={warmupExercises.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addWarmupExercise}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2 mb-4"
        >
          Add Warm Up Exercise
        </button>

        <h4
          className={`text-lg transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          } mt-4 mb-2`}
        >
          Main Workout Exercises
        </h4>
        {mainExercises.map((exercise, index) => (
          <div key={`main-${index}`} className="flex mb-2">
            <input
              type="text"
              value={exercise}
              onChange={(e) => updateMainExercise(index, e.target.value)}
              className={`border p-2 w-full mr-2 ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white"
                  : "bg-white border-red-300 text-red-600"
              }`}
              placeholder={`Main Exercise ${index + 1}`}
            />
            <button
              onClick={() => removeMainExercise(index)}
              className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
              disabled={mainExercises.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addMainExercise}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2"
        >
          Add Main Exercise
        </button>
      </div>

      <div className="mb-6">
        <h3
          className={`text-xl transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          } mb-2`}
        >
          Scheduled Workouts
        </h3>
        {scheduledWorkouts.map((workout, index) => (
          <div
            key={index}
            className={`mb-4 border p-4 rounded ${
              isDarkMode ? "border-stone-600" : "border-red-300"
            }`}
          >
            <input
              type="datetime-local"
              value={
                workout.updateDateTime
                  ? workout.updateDateTime.slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                updateScheduledWorkout(
                  index,
                  "updateDateTime",
                  new Date(e.target.value).toISOString()
                )
              }
              className={`border p-2 w-full mb-2 ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white"
                  : "bg-white border-red-300 text-red-600"
              }`}
              placeholder="Update Date and Time"
            />
            <textarea
              value={workout.description}
              onChange={(e) =>
                updateScheduledWorkout(index, "description", e.target.value)
              }
              className={`border p-2 w-full h-24 mb-2 ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white"
                  : "bg-white border-red-300 text-red-600"
              }`}
              placeholder="Workout Description"
            />

            <h4
              className={`text-lg transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-blue-300" : "text-blue-600"
              } mt-2 mb-2`}
            >
              Warm Up Exercises
            </h4>
            {workout.warmup.map((exercise, exIndex) => (
              <div key={`warmup-${index}-${exIndex}`} className="flex mb-2">
                <input
                  type="text"
                  value={exercise}
                  onChange={(e) =>
                    updateScheduledWarmupExercise(
                      index,
                      exIndex,
                      e.target.value
                    )
                  }
                  className={`border p-2 w-full mr-2 ${
                    isDarkMode
                      ? "bg-stone-700 border-stone-600 text-white"
                      : "bg-white border-red-300 text-red-600"
                  }`}
                  placeholder={`Warm Up ${exIndex + 1}`}
                />
                <button
                  onClick={() => removeScheduledWarmupExercise(index, exIndex)}
                  className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
                  disabled={workout.warmup.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => addScheduledWarmupExercise(index)}
              className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2 mb-4"
            >
              Add Warm Up Exercise
            </button>

            <h4
              className={`text-lg transition-colors duration-300 ease-in-out ${
                isDarkMode ? "text-red-400" : "text-red-800"
              } mt-2 mb-2`}
            >
              Main Workout Exercises
            </h4>
            {workout.main.map((exercise, exIndex) => (
              <div key={`main-${index}-${exIndex}`} className="flex mb-2">
                <input
                  type="text"
                  value={exercise}
                  onChange={(e) =>
                    updateScheduledMainExercise(index, exIndex, e.target.value)
                  }
                  className={`border p-2 w-full mr-2 ${
                    isDarkMode
                      ? "bg-stone-700 border-stone-600 text-white"
                      : "bg-white border-red-300 text-red-600"
                  }`}
                  placeholder={`Main Exercise ${exIndex + 1}`}
                />
                <button
                  onClick={() => removeScheduledMainExercise(index, exIndex)}
                  className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
                  disabled={workout.main.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => addScheduledMainExercise(index)}
              className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2 mr-2"
            >
              Add Main Exercise
            </button>

            <button
              onClick={() => removeScheduledWorkout(index)}
              className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2"
              disabled={
                scheduledWorkouts.length === 1 &&
                !scheduledWorkouts[0].description
              }
            >
              Remove Workout
            </button>
          </div>
        ))}
        <button
          onClick={addScheduledWorkout}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2"
        >
          Add Scheduled Workout
        </button>
      </div>

      <div className="mb-6">
        <h3
          className={`text-xl transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          } mb-2`}
        >
          Daily Gut Health Challenges
        </h3>
        {dailyChallenges.map((challenge, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={challenge}
              onChange={(e) => updateDailyChallenge(index, e.target.value)}
              className={`border p-2 w-full mr-2 ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white"
                  : "bg-white border-red-300 text-red-600"
              }`}
              placeholder={`Challenge ${index + 1}`}
            />
            <button
              onClick={() => removeDailyChallenge(index)}
              className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
              disabled={dailyChallenges.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addDailyChallenge}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2"
        >
          Add Challenge
        </button>
      </div>

      <button
        onClick={handleSave}
        className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mr-4"
      >
        Save Changes
      </button>
      <button
        onClick={() => navigate("/admin")}
        className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mr-4"
      >
        Back to Admin Dashboard
      </button>
      <button
        onClick={handleLogout}
        className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
      >
        Log Out
      </button>
    </div>
  );
}

export default HomeAdminPage;
