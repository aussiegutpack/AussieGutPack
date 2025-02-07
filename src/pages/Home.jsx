import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="text-center">
      {/* Hero Section */}
      <div className="bg-green-100 py-16 px-6">
        <h1 className="text-5xl font-extrabold text-green-800 mb-4">
          Welcome to Aussie Gut Pack
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          Empowering Your Digestive Health, Naturally.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/gut-health"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            Learn About Gut Health
          </Link>
          <Link
            to="/products"
            className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800"
          >
            Shop Supplements
          </Link>
        </div>
      </div>

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
    </div>
  );
}

export default Home;
