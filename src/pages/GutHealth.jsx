import React from "react";
import { gutHealthFacts } from "../data/gutHealthFacts";

function GutHealth() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        Understanding Gut Health
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">
          What is Gut Health?
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Gut health refers to the balance and function of bacteria in the
          digestive system. A healthy gut contains healthy bacteria and immune
          cells that ward off infectious agents like bacteria, viruses, and
          fungi.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-green-700 mb-4">
          Gut Health Facts
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {gutHealthFacts.map((fact) => (
            <div
              key={fact.id}
              className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500"
            >
              <h3 className="text-xl font-bold text-green-800 mb-2">
                {fact.title}
              </h3>
              <p className="text-gray-600">{fact.content}</p>
              <span className="text-sm text-green-600 mt-2 block">
                Category: {fact.category}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default GutHealth;
