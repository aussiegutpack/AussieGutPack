// src/pages/content/FAQ.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../../App";
import faqData from "../../data/faqData";

function FAQ() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1
        className={`text-4xl font-extrabold text-center mb-6 ${
          isDarkMode ? "text-green-300" : "text-green-700"
        }`}
      >
        Frequently Asked Questions
      </h1>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <details
            key={index}
            className={`group border p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-gray-300"
                : "bg-white border-gray-300 text-gray-800"
            }`}
          >
            <summary
              className={`cursor-pointer font-semibold text-lg flex justify-between items-center ${
                isDarkMode
                  ? "group-open:text-green-400"
                  : "group-open:text-green-600"
              }`}
            >
              {faq.question}
              <span
                className={`${
                  isDarkMode ? "text-green-500" : "text-green-500"
                } group-open:rotate-180 transition-transform duration-300`}
              >
                ▼
              </span>
            </summary>
            <p className="mt-2 text-gray-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
