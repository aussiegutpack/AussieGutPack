// src/pages/content/GutHealthDetail.jsx
import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../App";
import { gutHealthFacts } from "../../data/gutHealthFacts";
import Button from "../../components/ui/Button";

function GutHealthDetail() {
  const { id } = useParams();
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const fact = gutHealthFacts.find((f) => f.id.toString() === id); // Convert id to string for consistency

  if (!fact) {
    return (
      <div className="container mx-auto p-6">
        <h1
          className={`text-3xl font-bold mb-6 ${
            isDarkMode ? "text-green-300" : "text-green-900"
          }`} // Fixed: Removed extra quote
        >
          Fact Not Found
        </h1>
        <Button to="/gut-health" variant="primary">
          Back to Gut Health
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1
        className={`text-3xl font-bold mb-4 ${
          isDarkMode ? "text-green-300" : "text-green-900"
        }`}
      >
        {fact.title}
      </h1>
      <p
        className={`text-gray-600 mb-4 ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Category: {fact.category}
      </p>
      {Array.isArray(fact.content) ? (
        <ul
          className={`text-lg mb-6 ${
            isDarkMode ? "text-gray-300" : "text-gray-800"
          } list-disc list-inside`} // Added list-disc for bullet points
        >
          {fact.content.map((item, index) => (
            <li key={index} className="mb-2">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p
          className={`text-lg mb-6 ${
            isDarkMode ? "text-gray-300" : "text-gray-800"
          }`}
        >
          {fact.content}
        </p>
      )}
      <Button onClick={() => navigate("/gut-health")} variant="primary">
        Back to Gut Health
      </Button>
    </div>
  );
}

export default GutHealthDetail;
