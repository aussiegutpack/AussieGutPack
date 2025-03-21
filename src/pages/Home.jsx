import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../App";
import Button from "../components/ui/Button";
import Background from "../components/layout/Background";
import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const { isDarkMode } = useContext(ThemeContext);

  const headerRef = useRef(null);
  const roofRef = useRef(null);

  const [isHeaderVisible, setIsHeaderVisible] = React.useState(false);
  const [isRoofVisible, setIsRoofVisible] = React.useState(false);

  const quotes = [
    "An athlete won't judge you for working out.",
    "A millionaire won't judge you for starting a business.",
    "A musician won't judge you for trying to sing a song.",
    "It's always the people going nowhere that have something to say.",
    "Idle hands do the devil's work",
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

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
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  const dailyFitnessBoost = {
    title: "Full-Body Energizer",
    description:
      "A quick 20-minute routine to kickstart your metabolism and improve digestion.",
    exercises: [
      "5-minute brisk walk or jog",
      "3 sets of 15 squats",
      "3 sets of 10 push-ups",
      "2 sets of 20 jumping jacks",
      "1-minute plank hold",
    ],
  };

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
      {/* Header Section: Welcome to Aussie Gut Pack with About and Background */}
      <section
        ref={headerRef}
        className={`py-20 px-6 ${isDarkMode ? "bg-stone-900" : "bg-white"}`}
      >
        <div className="container mx-auto text-center">
          <h1
            className={`text-5xl md:text-6xl font-extrabold mb-4 transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-stone-400" : "text-red-800"
            }`}
          >
            Welcome to Aussie Gut Pack
          </h1>
          <p
            className={`text-xl md:text-2xl max-w-2xl mx-auto mb-8 transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-white" : "text-stone-600"
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
            {/* Left Half: About Section */}
            <div className="md:w-1/2 p-6 flex flex-col justify-center">
              <h2
                className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300 ease-in-out ${
                  isDarkMode ? "text-stone-400" : "text-red-800"
                }`}
              >
                About Us
              </h2>
              <p
                className={`text-lg transition-colors duration-300 ease-in-out ${
                  isDarkMode ? "text-white" : "text-stone-600"
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
            {/* Right Half: Background/Rotating Images */}
            <div className="md:w-1/2 flex justify-center items-center">
              <div className="h-80 w-80 md:h-[400px] md:w-[400px] overflow-hidden relative rounded-full">
                <Background className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Wisdom 2 Win The Day */}
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
              isDarkMode ? "text-stone-400" : "text-red-800"
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
                  isDarkMode ? "text-white" : "text-stone-600"
                }`}
              >
                "{quotes[currentQuoteIndex]}"
              </motion.p>
            </AnimatePresence>
          </div>
          <p
            className={`text-lg mb-6 max-w-3xl mx-auto transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-white" : "text-stone-600"
            }`}
          >
            {dailyFitnessBoost.description}
          </p>
          <ul
            className={`text-left list-disc list-inside mb-8 max-w-md mx-auto transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-white" : "text-stone-600"
            }`}
          >
            {dailyFitnessBoost.exercises.map((exercise, index) => (
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
