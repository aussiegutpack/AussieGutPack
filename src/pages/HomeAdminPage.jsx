import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { db, auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

function HomeAdminPage() {
  const { isDarkMode } = useContext(ThemeContext);
  const [quotes, setQuotes] = useState([""]);
  const [workoutDesc, setWorkoutDesc] = useState("");
  const [warmupExercises, setWarmupExercises] = useState([""]);
  const [workoutSections, setWorkoutSections] = useState([
    { title: "Main Workout", exercises: [""] },
  ]);
  const [scheduledWorkouts, setScheduledWorkouts] = useState([]);
  const [aboutUs, setAboutUs] = useState("");
  const [dailyChallenges, setDailyChallenges] = useState([""]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/admin");
      }
    });
    return () => unsubscribe();
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
          setWorkoutSections(
            data.currentWorkout?.sections?.length
              ? data.currentWorkout.sections
              : [{ title: "Main Workout", exercises: [""] }]
          );
          setScheduledWorkouts(
            data.scheduledWorkouts?.length
              ? data.scheduledWorkouts.map((workout) => {
                  const sections = workout.sections?.length
                    ? workout.sections
                    : [
                        { title: "Warm Up", exercises: workout.warmup || [""] },
                        {
                          title: "Main Workout",
                          exercises: workout.main || [""],
                        },
                      ];
                  return {
                    description: workout.description || "",
                    sections,
                    updateDateTime: workout.updateDateTime || "",
                  };
                })
              : [
                  {
                    description: "",
                    sections: [
                      { title: "Warm Up", exercises: [""] },
                      { title: "Main Workout", exercises: [""] },
                    ],
                    updateDateTime: new Date().toISOString(),
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
        sections: workoutSections
          .filter(
            (section) =>
              section.title.trim() && section.exercises.some((ex) => ex.trim())
          )
          .map((section) => ({
            title: section.title,
            exercises: section.exercises.filter((ex) => ex.trim() !== ""),
          })),
      },
      scheduledWorkouts: scheduledWorkouts
        .filter(
          (workout) =>
            workout.description.trim() &&
            workout.sections.some(
              (section) =>
                section.title.trim() &&
                section.exercises.some((ex) => ex.trim())
            ) &&
            workout.updateDateTime.trim()
        )
        .map((workout) => ({
          description: workout.description,
          sections: workout.sections
            .filter(
              (section) =>
                section.title.trim() &&
                section.exercises.some((ex) => ex.trim())
            )
            .map((section) => ({
              title: section.title,
              exercises: section.exercises.filter((ex) => ex.trim() !== ""),
            })),
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
      navigate("/admin");
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

  const addWorkoutSection = () =>
    setWorkoutSections([...workoutSections, { title: "", exercises: [""] }]);
  const removeWorkoutSection = (index) =>
    setWorkoutSections(workoutSections.filter((_, i) => i !== index));
  const updateWorkoutSectionTitle = (index, value) => {
    const newSections = [...workoutSections];
    newSections[index].title = value;
    setWorkoutSections(newSections);
  };
  const addSectionExercise = (index) => {
    const newSections = [...workoutSections];
    newSections[index].exercises.push("");
    setWorkoutSections(newSections);
  };
  const removeSectionExercise = (index, exerciseIndex) => {
    const newSections = [...workoutSections];
    newSections[index].exercises = newSections[index].exercises.filter(
      (_, i) => i !== exerciseIndex
    );
    setWorkoutSections(newSections);
  };
  const updateSectionExercise = (index, exerciseIndex, value) => {
    const newSections = [...workoutSections];
    newSections[index].exercises[exerciseIndex] = value;
    setWorkoutSections(newSections);
  };

  const addScheduledWorkout = () =>
    setScheduledWorkouts([
      ...scheduledWorkouts,
      {
        description: "",
        sections: [
          { title: "Warm Up", exercises: [""] },
          { title: "Main Workout", exercises: [""] },
        ],
        updateDateTime: new Date().toISOString(),
      },
    ]);
  const removeScheduledWorkout = (index) =>
    setScheduledWorkouts(scheduledWorkouts.filter((_, i) => i !== index));

  // Convert UTC ISO string to EST (UTC-5) for datetime-local format (YYYY-MM-DDThh:mm)
  const toESTDateTimeString = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    // EST is UTC-5, so subtract 5 hours (5 * 60 * 60 * 1000 milliseconds)
    const estDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);
    return estDate.toISOString().slice(0, 16);
  };

  const updateScheduledWorkout = (index, field, value) => {
    const newScheduledWorkouts = [...scheduledWorkouts];
    if (field === "updateDateTime") {
      // Treat the selected time as EST (UTC-5) and convert to UTC for storage
      const estDate = new Date(value);
      // Subtract 5 hours to convert EST to UTC
      const utcDate = new Date(estDate.getTime() - 5 * 60 * 60 * 1000);
      newScheduledWorkouts[index][field] = utcDate.toISOString();
      console.log(
        `Scheduled workout ${index} updateDateTime set to (UTC): ${newScheduledWorkouts[index][field]}`
      );
    } else {
      newScheduledWorkouts[index][field] = value;
    }
    setScheduledWorkouts(newScheduledWorkouts);
  };

  const addScheduledWorkoutSection = (workoutIndex) => {
    const newScheduledWorkouts = [...scheduledWorkouts];
    newScheduledWorkouts[workoutIndex].sections.push({
      title: "",
      exercises: [""],
    });
    setScheduledWorkouts(newScheduledWorkouts);
  };
  const removeScheduledWorkoutSection = (workoutIndex, sectionIndex) => {
    const newScheduledWorkouts = [...scheduledWorkouts];
    newScheduledWorkouts[workoutIndex].sections = newScheduledWorkouts[
      workoutIndex
    ].sections.filter((_, i) => i !== sectionIndex);
    setScheduledWorkouts(newScheduledWorkouts);
  };
  const updateScheduledWorkoutSectionTitle = (
    workoutIndex,
    sectionIndex,
    value
  ) => {
    const newScheduledWorkouts = [...scheduledWorkouts];
    newScheduledWorkouts[workoutIndex].sections[sectionIndex].title = value;
    setScheduledWorkouts(newScheduledWorkouts);
  };
  const addScheduledSectionExercise = (workoutIndex, sectionIndex) => {
    const newScheduledWorkouts = [...scheduledWorkouts];
    newScheduledWorkouts[workoutIndex].sections[sectionIndex].exercises.push(
      ""
    );
    setScheduledWorkouts(newScheduledWorkouts);
  };
  const removeScheduledSectionExercise = (
    workoutIndex,
    sectionIndex,
    exerciseIndex
  ) => {
    const newScheduledWorkouts = [...scheduledWorkouts];
    newScheduledWorkouts[workoutIndex].sections[sectionIndex].exercises =
      newScheduledWorkouts[workoutIndex].sections[
        sectionIndex
      ].exercises.filter((_, i) => i !== exerciseIndex);
    setScheduledWorkouts(newScheduledWorkouts);
  };
  const updateScheduledSectionExercise = (
    workoutIndex,
    sectionIndex,
    exerciseIndex,
    value
  ) => {
    const newScheduledWorkouts = [...scheduledWorkouts];
    newScheduledWorkouts[workoutIndex].sections[sectionIndex].exercises[
      exerciseIndex
    ] = value;
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

        {workoutSections.map((section, index) => (
          <div key={`section-${index}`} className="mt-4">
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={section.title}
                onChange={(e) =>
                  updateWorkoutSectionTitle(index, e.target.value)
                }
                className={`border p-2 w-full mr-2 ${
                  isDarkMode
                    ? "bg-stone-700 border-stone-600 text-white"
                    : "bg-white border-red-300 text-red-600"
                }`}
                placeholder="Section Title (e.g., Strength, Conditioning)"
              />
              <button
                onClick={() => removeWorkoutSection(index)}
                className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
                disabled={workoutSections.length === 1}
              >
                Remove Section
              </button>
            </div>
            {section.exercises.map((exercise, exIndex) => (
              <div
                key={`section-${index}-exercise-${exIndex}`}
                className="flex mb-2"
              >
                <input
                  type="text"
                  value={exercise}
                  onChange={(e) =>
                    updateSectionExercise(index, exIndex, e.target.value)
                  }
                  className={`border p-2 w-full mr-2 ${
                    isDarkMode
                      ? "bg-stone-700 border-stone-600 text-white"
                      : "bg-white border-red-300 text-red-600"
                  }`}
                  placeholder={`Exercise ${exIndex + 1}`}
                />
                <button
                  onClick={() => removeSectionExercise(index, exIndex)}
                  className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
                  disabled={section.exercises.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => addSectionExercise(index)}
              className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2"
            >
              Add Exercise
            </button>
          </div>
        ))}
        <button
          onClick={addWorkoutSection}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-4"
        >
          Add Workout Section
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
              value={toESTDateTimeString(workout.updateDateTime)}
              onChange={(e) =>
                updateScheduledWorkout(index, "updateDateTime", e.target.value)
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

            {workout.sections.map((section, sectionIndex) => (
              <div
                key={`scheduled-section-${index}-${sectionIndex}`}
                className="mt-4"
              >
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) =>
                      updateScheduledWorkoutSectionTitle(
                        index,
                        sectionIndex,
                        e.target.value
                      )
                    }
                    className={`border p-2 w-full mr-2 ${
                      isDarkMode
                        ? "bg-stone-700 border-stone-600 text-white"
                        : "bg-white border-red-300 text-red-600"
                    }`}
                    placeholder="Section Title (e.g., Strength, Conditioning)"
                  />
                  <button
                    onClick={() =>
                      removeScheduledWorkoutSection(index, sectionIndex)
                    }
                    className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
                    disabled={workout.sections.length === 1}
                  >
                    Remove Section
                  </button>
                </div>
                {section.exercises.map((exercise, exIndex) => (
                  <div
                    key={`scheduled-section-${index}-${sectionIndex}-exercise-${exIndex}`}
                    className="flex mb-2"
                  >
                    <input
                      type="text"
                      value={exercise}
                      onChange={(e) =>
                        updateScheduledSectionExercise(
                          index,
                          sectionIndex,
                          exIndex,
                          e.target.value
                        )
                      }
                      className={`border p-2 w-full mr-2 ${
                        isDarkMode
                          ? "bg-stone-700 border-stone-600 text-white"
                          : "bg-white border-red-300 text-red-600"
                      }`}
                      placeholder={`Exercise ${exIndex + 1}`}
                    />
                    <button
                      onClick={() =>
                        removeScheduledSectionExercise(
                          index,
                          sectionIndex,
                          exIndex
                        )
                      }
                      className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
                      disabled={section.exercises.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    addScheduledSectionExercise(index, sectionIndex)
                  }
                  className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2"
                >
                  Add Exercise
                </button>
              </div>
            ))}
            <button
              onClick={() => addScheduledWorkoutSection(index)}
              className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-4 mr-2"
            >
              Add Workout Section
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
