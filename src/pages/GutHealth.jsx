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
        {/* Benefits of Gut Health Section */}
        <div className="py-12 px-6">
          <h2 className="text-3xl font-bold text-green-800 mb-6">
            Why Gut Health Matters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold text-green-700">
                Boosts Cognition
              </h3>
              <p className="text-gray-600 mt-2">
                A healthy gut strengthens your immune system and helps fight off
                infections.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold text-green-700">
                Improves Digestion
              </h3>
              <p className="text-gray-600 mt-2">
                Proper gut health aids digestion, prevents bloating, and reduces
                stomach discomfort.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold text-green-700">
                Enhances Mental Health
              </h3>
              <p className="text-gray-600 mt-2">
                Your gut and brain are connected—good gut health can help reduce
                anxiety and improve mood.
              </p>
            </div>
          </div>
        </div>
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
