import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

function AdminPage() {
  const { isDarkMode } = useContext(ThemeContext);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [quotes, setQuotes] = useState([""]);
  const [workoutDesc, setWorkoutDesc] = useState("");
  const [exercises, setExercises] = useState([""]);
  const [scheduledWorkouts, setScheduledWorkouts] = useState([]);
  const [aboutUs, setAboutUs] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchContent = async () => {
        try {
          const homeDocRef = doc(db, "content", "home");
          const homeDocSnap = await getDoc(homeDocRef);
          if (homeDocSnap.exists()) {
            const data = homeDocSnap.data();
            setQuotes(data.quotes?.length ? data.quotes : [""]);
            setWorkoutDesc(data.currentWorkout?.description || "");
            setExercises(
              data.currentWorkout?.exercises?.length
                ? data.currentWorkout.exercises
                : [""]
            );
            setScheduledWorkouts(
              data.scheduledWorkouts?.length ? data.scheduledWorkouts : []
            );
            setAboutUs(data.aboutUs || "");
          }

          const blogCollectionRef = collection(db, "content", "blog", "posts");
          const blogSnapshot = await getDocs(blogCollectionRef);
          const blogData = blogSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBlogPosts(
            blogData.length
              ? blogData
              : [{ id: "", title: "", date: "", content: "" }]
          );
        } catch (err) {
          setError("Failed to load content: " + err.message);
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
    setError(null);
    const updatedContent = {
      quotes: quotes.filter((quote) => quote.trim() !== ""),
      currentWorkout: {
        description: workoutDesc,
        exercises: exercises.filter((exercise) => exercise.trim() !== ""),
      },
      scheduledWorkouts: scheduledWorkouts.filter(
        (workout) =>
          workout.description.trim() &&
          workout.exercises.length > 0 &&
          workout.updateDateTime.trim()
      ),
      aboutUs: aboutUs.trim(),
      lastUpdated: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, "content", "home"), updatedContent);

      const blogCollectionRef = collection(db, "content", "blog", "posts");
      const existingPosts = await getDocs(blogCollectionRef);
      for (const docSnap of existingPosts.docs) {
        await deleteDoc(docSnap.ref);
      }
      for (const post of blogPosts) {
        if (post.title.trim() && post.date.trim() && post.content.trim()) {
          const postId = post.id || Date.now().toString();
          await setDoc(doc(blogCollectionRef, postId), {
            id: postId,
            title: post.title,
            date: post.date,
            content: post.content,
          });
        }
      }
      alert("Changes saved successfully!");
      navigate("/");
    } catch (err) {
      setError("Error saving changes: " + err.message);
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

  const addScheduledWorkout = () =>
    setScheduledWorkouts([
      ...scheduledWorkouts,
      { description: "", exercises: [""], updateDateTime: "" },
    ]);
  const removeScheduledWorkout = (index) =>
    setScheduledWorkouts(scheduledWorkouts.filter((_, i) => i !== index));
  const updateScheduledWorkout = (index, field, value) => {
    const newScheduledWorkouts = [...scheduledWorkouts];
    if (field === "exercises") {
      newScheduledWorkouts[index].exercises = value;
    } else {
      newScheduledWorkouts[index][field] = value;
    }
    setScheduledWorkouts(newScheduledWorkouts);
  };
  const addScheduledExercise = (index) => {
    const newScheduledWorkouts = [...scheduledWorkouts];
    newScheduledWorkouts[index].exercises.push("");
    setScheduledWorkouts(newScheduledWorkouts);
  };
  const removeScheduledExercise = (index, exerciseIndex) => {
    const newScheduledWorkouts = [...scheduledWorkouts];
    newScheduledWorkouts[index].exercises = newScheduledWorkouts[
      index
    ].exercises.filter((_, i) => i !== exerciseIndex);
    setScheduledWorkouts(newScheduledWorkouts);
  };
  const updateScheduledExercise = (index, exerciseIndex, value) => {
    const newScheduledWorkouts = [...scheduledWorkouts];
    newScheduledWorkouts[index].exercises[exerciseIndex] = value;
    setScheduledWorkouts(newScheduledWorkouts);
  };

  const addBlogPost = () =>
    setBlogPosts([...blogPosts, { id: "", title: "", date: "", content: "" }]);
  const removeBlogPost = (index) =>
    setBlogPosts(blogPosts.filter((_, i) => i !== index));
  const updateBlogPost = (index, field, value) => {
    const newBlogPosts = [...blogPosts];
    newBlogPosts[index] = { ...newBlogPosts[index], [field]: value };
    setBlogPosts(newBlogPosts);
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
            isDarkMode ? "text-red-400" : "text-red-800"
          } mt-4 mb-2`}
        >
          Exercises
        </h4>
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
            {workout.exercises.map((exercise, exIndex) => (
              <div key={exIndex} className="flex mb-2">
                <input
                  type="text"
                  value={exercise}
                  onChange={(e) =>
                    updateScheduledExercise(index, exIndex, e.target.value)
                  }
                  className={`border p-2 w-full mr-2 ${
                    isDarkMode
                      ? "bg-stone-700 border-stone-600 text-white"
                      : "bg-white border-red-300 text-red-600"
                  }`}
                  placeholder={`Exercise ${exIndex + 1}`}
                />
                <button
                  onClick={() => removeScheduledExercise(index, exIndex)}
                  className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out"
                  disabled={workout.exercises.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => addScheduledExercise(index)}
              className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2 mr-2"
            >
              Add Exercise
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
          Blog Posts
        </h3>
        {blogPosts.map((post, index) => (
          <div
            key={index}
            className={`mb-4 border p-4 rounded ${
              isDarkMode ? "border-stone-600" : "border-red-300"
            }`}
          >
            <input
              type="text"
              value={post.title}
              onChange={(e) => updateBlogPost(index, "title", e.target.value)}
              className={`border p-2 w-full mb-2 ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white"
                  : "bg-white border-red-300 text-red-600"
              }`}
              placeholder="Blog Title"
            />
            <input
              type="text"
              value={post.date}
              onChange={(e) => updateBlogPost(index, "date", e.target.value)}
              className={`border p-2 w-full mb-2 ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white"
                  : "bg-white border-red-300 text-red-600"
              }`}
              placeholder="Date (e.g., January 15, 2025)"
            />
            <textarea
              value={post.content}
              onChange={(e) => updateBlogPost(index, "content", e.target.value)}
              className={`border p-2 w-full h-24 ${
                isDarkMode
                  ? "bg-stone-700 border-stone-600 text-white"
                  : "bg-white border-red-300 text-red-600"
              }`}
              placeholder="Blog Content"
            />
            <button
              onClick={() => removeBlogPost(index)}
              className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2"
              disabled={blogPosts.length === 1}
            >
              Remove Post
            </button>
          </div>
        ))}
        <button
          onClick={addBlogPost}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-300 ease-in-out mt-2"
        >
          Add Blog Post
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
