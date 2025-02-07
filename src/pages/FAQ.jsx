import React from "react";
import faqData from "../data/faqData"; // Importing the FAQ data from the external file

function FAQ() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-transparent relative">
      <div className="faq-background"></div>
      <h1 className="text-4xl font-extrabold text-center text-green-700 mb-6">
        Frequently Asked Questions
      </h1>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <details
            key={index}
            className="group border border-gray-300 p-4 rounded-lg shadow-md bg-white transition-all duration-300"
          >
            <summary className="cursor-pointer font-semibold text-lg flex justify-between items-center text-gray-800 group-open:text-green-600">
              {faq.question}
              <span className="text-green-500 group-open:rotate-180 transition-transform duration-300">
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
