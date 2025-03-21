// src/pages/content/Quiz.jsx
import React, { useState, useContext } from "react";
import { ThemeContext } from "../../App";
import Button from "../../components/ui/Button";

function Quiz() {
  const { isDarkMode } = useContext(ThemeContext);
  const [score, setScore] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const answers = form.getAll("question");
    const correctAnswers = ["fiber", "probiotic"];
    let totalScore = 0;

    answers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) totalScore++;
    });

    setScore(totalScore);
  };

  return (
    <div className="p-6">
      <h1
        className={`text-3xl font-bold mb-4 ${
          isDarkMode ? "text-green-300" : "text-green-900"
        }`}
      >
        Gut Health Quiz
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className={`p-4 rounded-lg shadow-md ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-800"}`}>
            1. What nutrient is essential for gut health?
          </p>
          <div className="mt-2 space-x-4">
            <label
              className={`inline-flex items-center ${
                isDarkMode ? "text-gray-300" : "text-gray-800"
              }`}
            >
              <input
                type="radio"
                name="question1"
                value="fiber"
                className="mr-2"
              />
              Fiber
            </label>
            <label
              className={`inline-flex items-center ${
                isDarkMode ? "text-gray-300" : "text-gray-800"
              }`}
            >
              <input
                type="radio"
                name="question1"
                value="sugar"
                className="mr-2"
              />
              Sugar
            </label>
          </div>
        </div>

        <div
          className={`p-4 rounded-lg shadow-md ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-800"}`}>
            2. What type of food contains good bacteria for your gut?
          </p>
          <div className="mt-2 space-x-4">
            <label
              className={`inline-flex items-center ${
                isDarkMode ? "text-gray-300" : "text-gray-800"
              }`}
            >
              <input
                type="radio"
                name="question2"
                value="probiotic"
                className="mr-2"
              />
              Probiotic foods
            </label>
            <label
              className={`inline-flex items-center ${
                isDarkMode ? "text-gray-300" : "text-gray-800"
              }`}
            >
              <input
                type="radio"
                name="question2"
                value="fried"
                className="mr-2"
              />
              Fried foods
            </label>
          </div>
        </div>

        <Button type="submit" variant="primary">
          Submit
        </Button>
      </form>

      {score !== null && (
        <p
          className={`mt-4 text-xl font-bold ${
            isDarkMode ? "text-green-300" : "text-green-900"
          }`}
        >
          Your score: {score}/2
        </p>
      )}
    </div>
  );
}

export default Quiz;
