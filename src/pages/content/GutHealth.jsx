import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../App";
import { gutHealthFacts } from "../../data/gutHealthFacts";
import Card from "../../components/ui/Card";

function GutHealth() {
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {});

  const whyGutHealthMattersFacts = gutHealthFacts.filter(
    (fact) => fact.category === "Benefits"
  );
  const otherFacts = gutHealthFacts.filter(
    (fact) => fact.category !== "Benefits"
  );

  return (
    <div
      className={`container mx-auto px-4 py-8 min-h-screen flex flex-col ${
        isDarkMode ? "bg-stone-900" : "bg-white"
      }`}
    >
      <div className="pt-16"></div>
      <h1
        className={`text-3xl font-bold mb-6 transition-colors duration-300 ease-in-out ${
          isDarkMode ? "text-red-400" : "text-red-800"
        }`}
      >
        Understanding Gut Health
      </h1>
      <section className="mb-8 flex-grow">
        <h2
          className={`text-2xl font-semibold mb-4 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          }`}
        >
          What is Gut Health?
        </h2>
        <p
          className={`leading-relaxed transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-white" : "text-red-600"
          }`}
        >
          Gut health refers to the balance and function of bacteria in the
          digestive system...
        </p>
      </section>
      <section className="py-12 px-6 flex-grow">
        <h2
          className={`text-3xl font-bold mb-6 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          }`}
        >
          Why Gut Health Matters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {whyGutHealthMattersFacts.map((fact) => (
            <Link to={`/gut-health/${fact.id}`} key={fact.id}>
              <Card
                title={fact.title}
                content={fact.content}
                className="hover:shadow-lg transition-shadow duration-300 ease-in-out"
              />
            </Link>
          ))}
        </div>
      </section>
      <section className="flex-grow">
        <h2
          className={`text-2xl font-semibold mb-4 transition-colors duration-300 ease-in-out ${
            isDarkMode ? "text-red-400" : "text-red-800"
          }`}
        >
          Gut Health Facts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          {otherFacts.map((fact) => (
            <Link to={`/gut-health/${fact.id}`} key={fact.id}>
              <Card
                title={fact.title}
                content={fact.content}
                footer={`Category: ${fact.category}`}
                className={`border-l-4 border-red-500 hover:shadow-lg transition-shadow duration-300 ease-in-out ${
                  isDarkMode ? "bg-stone-800" : "bg-stone-50"
                }`}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default GutHealth;
