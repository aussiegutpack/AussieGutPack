import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../App";
import Button from "../components/ui/Button";
import Background from "../components/layout/Background";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Home() {
  const { isDarkMode } = useContext(ThemeContext);
  const headerRef = useRef(null);
  const roofRef = useRef(null);

  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isRoofVisible, setIsRoofVisible] = useState(false);
  const [content, setContent] = useState({
    quotes: [],
    currentWorkout: { description: "", exercises: [] },
    scheduledWorkouts: [],
    lastUpdated: null,
  });
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const fetchAndUpdateContent = async () => {
      const docRef = doc(db, "content", "home");
      const docSnap = await getDoc(docRef);

      let newContent = {
        quotes: [
          "An athlete won't judge you for working out.",
          "A millionaire won't judge you for starting a business.",
          "A musician won't judge you for trying to sing a song.",
          "It's always the people going nowhere that have something to say.",
          "Idle hands do the devil's work",
        ],
        currentWorkout: {
          description:
            "A quick 20-minute routine to kickstart your metabolism and improve digestion.",
          exercises: [
            "5-minute brisk walk or jog",
            "3 sets of 15 squats",
            "3 sets of 10 push-ups",
            "2 sets of 20 jumping jacks",
            "1-minute plank hold",
          ],
        },
        scheduledWorkouts: [],
        lastUpdated: null,
      };

      if (docSnap.exists()) {
        newContent = { ...newContent, ...docSnap.data() };
      }

      const now = new Date();
      const updatedScheduledWorkouts = [...newContent.scheduledWorkouts];
      let shouldUpdate = false;

      // Sort scheduled workouts by date/time
      updatedScheduledWorkouts.sort(
        (a, b) => new Date(a.updateDateTime) - new Date(b.updateDateTime)
      );

      // Check if any scheduled workout should replace the current one
      if (updatedScheduledWorkouts.length > 0) {
        const nextWorkout = updatedScheduledWorkouts[0];
        const nextUpdateTime = new Date(nextWorkout.updateDateTime);
        if (
          now >= nextUpdateTime &&
          (!newContent.lastUpdated ||
            new Date(newContent.lastUpdated) < nextUpdateTime)
        ) {
          newContent.currentWorkout = {
            description: nextWorkout.description,
            exercises: nextWorkout.exercises,
          };
          updatedScheduledWorkouts.shift(); // Remove the used workout
          newContent.scheduledWorkouts = updatedScheduledWorkouts;
          newContent.lastUpdated = now.toISOString();
          shouldUpdate = true;
        }
      }

      if (shouldUpdate) {
        await setDoc(docRef, newContent, { merge: true });
      }

      setContent(newContent);
    };

    fetchAndUpdateContent();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting;
          if (entry.target === headerRef.current) setIsHeaderVisible(isVisible);
          if (entry.target === roofRef.current) setIsRoofVisible(isVisible);
        });
      },
      { threshold: 0.2 }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    if (roofRef.current) observer.observe(roofRef.current);

    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current);
      if (roofRef.current) observer.unobserve(roofRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex(
        (prevIndex) => (prevIndex + 1) % content.quotes.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [content.quotes.length]);

  const quoteVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5, ease: "easeIn" } },
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-stone-900" : "bg-white"
      }`}
    >
      <section
        ref={headerRef}
        className={`py-20 px-6 ${isDarkMode ? "bg-stone-900" : "bg-white"}`}
      >
        <div className="container mx-auto text-center">
          <h1
            className={`text-5xl md:text-6xl font-extrabold mb-4 transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-red-400" : "text-red-800"
            }`}
          >
            Welcome to Aussie Gut Pack
          </h1>
          <p
            className={`text-xl md:text-2xl max-w-2xl mx-auto mb-8 transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-white" : "text-red-600"
            }`}
          >
            Empowering Your Digestive Health, Naturally.
          </p>
          <div
            className={`flex flex-col md:flex-row gap-6 transition-all duration-700 ease-in-out ${
              isHeaderVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="md:w-1/2 p-6 flex flex-col justify-center">
              <h2
                className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300 ease-in-out ${
                  isDarkMode ? "text-red-400" : "text-red-800"
                }`}
              >
                About Us
              </h2>
              <p
                className={`text-lg transition-colors duration-300 ease-in-out ${
                  isDarkMode ? "text-white" : "text-red-600"
                }`}
              >
                We are dedicated to bringing you information about Australian
                Shepherds and how to maintain a healthy gut. Our mission is to
                educate and inspire a natural approach to wellness for you and
                your furry friends.
              </p>
              <Button
                to="/fitness-tips"
                variant="primary"
                className={`mx-auto mt-6 ${
                  isDarkMode
                    ? "bg-red-800 text-white hover:bg-red-900"
                    : "bg-red-800 text-white hover:bg-red-900"
                }`}
              >
                Learn More
              </Button>
            </div>
            <div className="md:w-1/2 flex justify-center items-center">
              <div className="h-80 w-80 md:h-[400px] md:w-[400px] overflow-hidden relative rounded-full">
                <Background className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={roofRef}
        className={`py-20 px-6 ${isDarkMode ? "bg-stone-900" : "bg-white"}`}
      >
        <div
          className={`container mx-auto text-center transition-all duration-700 ease-in-out ${
            isRoofVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-red-400" : "text-red-800"
            }`}
          >
            Wisdom to Win The Day
          </h2>
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentQuoteIndex}
                variants={quoteVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`text-lg italic mb-6 transition-colors duration-300 ease-in-out ${
                  isDarkMode ? "text-white" : "text-red-600"
                }`}
              >
                "{content.quotes[currentQuoteIndex]}"
              </motion.p>
            </AnimatePresence>
          </div>
          <h3
            className={`text-2xl font-semibold mb-4 transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-red-400" : "text-red-800"
            }`}
          >
            Workout of the Day
          </h3>
          <p
            className={`text-lg mb-6 max-w-3xl mx-auto transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-white" : "text-red-600"
            }`}
          >
            {content.currentWorkout.description}
          </p>
          <ul
            className={`text-left list-disc pl-6 mb-8 max-w-md mx-auto transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-white" : "text-red-600"
            }`}
          >
            {content.currentWorkout.exercises.map((exercise, index) => (
              <li key={index} className="mb-2 text-lg">
                {exercise}
              </li>
            ))}
          </ul>
          <Button
            to="/fitness-tips"
            variant="primary"
            className={`mx-auto ${
              isDarkMode
                ? "bg-red-800 text-white hover:bg-red-900"
                : "bg-red-800 text-white hover:bg-red-900"
            }`}
          >
            More Fitness Tips
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Home;
