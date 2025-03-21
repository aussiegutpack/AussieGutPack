import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../App";
import { gutHealthFacts } from "../../data/gutHealthFacts";
import Button from "../../components/ui/Button";

function GutHealthDetail() {
  const { id } = useParams();
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const fact = gutHealthFacts.find((f) => f.id.toString() === id);

  if (!fact) {
    return (
      <div
        className={`min-h-screen container mx-auto p-6 ${
          isDarkMode ? "bg-stone-900" : "bg-white"
        }`}
      >
        <h1
          className={`text-3xl font-bold mb-6 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          }`}
        >
          Fact Not Found
        </h1>
        <Button
          to="/gut-health"
          variant="primary"
          className="bg-red-800 text-white hover:bg-red-900 transition-colors duration-300 ease-in-out"
        >
          Back to Gut Health
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen container mx-auto p-6 ${
        isDarkMode ? "bg-stone-900" : "bg-white"
      }`}
    >
      <h1
        className={`text-3xl font-bold mb-4 transition-colors duration-300 ease-in-out ${
          isDarkMode ? "text-red-400" : "text-red-800"
        }`}
      >
        {fact.title}
      </h1>
      <p
        className={`mb-4 transition-colors duration-300 ease-in-out ${
          isDarkMode ? "text-white" : "text-red-600"
        }`}
      >
        Category: {fact.category}
      </p>
      {Array.isArray(fact.content) ? (
        <ul
          className={`text-lg mb-6 list-disc pl-6 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-white" : "text-red-600"
          }`}
        >
          {fact.content.map((item, index) => (
            <li key={index} className="mb-2">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p
          className={`text-lg mb-6 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-white" : "text-red-600"
          }`}
        >
          {fact.content}
        </p>
      )}
      <Button
        to="/gut-health"
        variant="primary"
        className="bg-red-800 text-white hover:bg-red-900 transition-colors duration-300 ease-in-out"
      >
        Back to Gut Health
      </Button>
    </div>
  );
}

export default GutHealthDetail;
