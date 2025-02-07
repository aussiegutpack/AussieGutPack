import React, { useState } from "react";

function Quiz() {
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
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Gut Health Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p>1. What nutrient is essential for gut health?</p>
          <label>
            <input type="radio" name="question" value="fiber" /> Fiber
          </label>
          <label className="ml-4">
            <input type="radio" name="question" value="sugar" /> Sugar
          </label>
        </div>

        <div>
          <p>2. What type of food contains good bacteria for your gut?</p>
          <label>
            <input type="radio" name="question" value="probiotic" /> Probiotic
            foods
          </label>
          <label className="ml-4">
            <input type="radio" name="question" value="fried" /> Fried foods
          </label>
        </div>

        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>

      {score !== null && (
        <p className="mt-4 text-xl font-bold">Your score: {score}/2</p>
      )}
    </div>
  );
}

export default Quiz;
