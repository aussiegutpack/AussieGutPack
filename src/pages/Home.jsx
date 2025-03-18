import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../App";
import Background from "../components/Background";
import "../styles/Home.css";

function Home() {
  const { isDarkMode } = useContext(ThemeContext);

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

  const quotes = [
    "An athlete won't judge you for working out.",
    "A millionaire won't judge you for starting a business.",
    "A musician won't judge you for trying to sing a song.",
    "It's always the people going nowhere that have something to say.",
    "Idle hands do the Devil's work",
  ];

  return (
    <div className="relative min-h-screen">
      <Background />
      <div className="relative z-10 text-center">
        <section className="py-16 px-6">
          <h1
            className={`text-5xl font-extrabold mb-4 transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-purple-300" : "text-purple-900"
            }`}
          >
            Welcome to Aussie Gut Pack
          </h1>
          <p
            className={`text-xl mb-6 max-w-2xl mx-auto transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-gray-300" : "text-purple-800"
            }`}
          >
            Empowering Your Digestive Health, Naturally.
          </p>
        </section>

        <section className="blurred-section py-12 px-6 mx-4 md:mx-20 mb-12 rounded-lg shadow-lg">
          <h2
            className={`text-3xl font-bold mb-4 transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-purple-300" : "text-purple-900"
            }`}
          >
            Rolling Out Of Fatness (ROOF)
          </h2>
          <p
            className={`text-lg mb-4 transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-gray-300" : "text-purple-800"
            }`}
          >
            {dailyFitnessBoost.description}
          </p>
          <ul
            className={`text-left list-disc list-inside mb-6 max-w-md mx-auto transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-gray-400" : "text-purple-700"
            }`}
          >
            {dailyFitnessBoost.exercises.map((exercise, index) => (
              <li key={index} className="mb-2">
                {exercise}
              </li>
            ))}
          </ul>
          <Link
            to="/fitness-tips"
            className={`px-6 py-3 rounded-lg text-white transition-colors duration-300 ease-in-out ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-purple-600 hover:bg-green-700"
            }`}
          >
            More Fitness Tips
          </Link>
        </section>

        <section className="blurred-section py-12 px-6 mx-4 md:mx-20 mb-12 rounded-lg shadow-lg">
          <h2
            className={`text-3xl font-bold mb-6 transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-purple-300" : "text-purple-900"
            }`}
          >
            Words to Live By
          </h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {quotes.map((quote, index) => (
              <p
                key={index}
                className={`text-lg italic border-l-4 pl-4 transition-colors duration-300 ease-in-out ${
                  isDarkMode
                    ? "text-gray-300 border-green-400"
                    : "text-purple-800 border-green-600"
                }`}
              >
                "{quote}"
              </p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
