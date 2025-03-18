import React, { useContext } from "react";
import { ThemeContext } from "../App"; // Import ThemeContext
import ProductCard from "../components/ProductCard";
import { longTermPro } from "../data/longTermPro";
import { beginnerPro } from "../data/beginnerPro";
import { preBiotics } from "../data/prebiotics";
import { bloodSugar } from "../data/bloodsugar";
import { anemia } from "../data/anemia";
import { nitricOxide } from "../data/nitricoxide";
import { IBS } from "../data/IBS";
import { sleep } from "../data/sleep";
import { sports } from "../data/sports";
import { skincare } from "../data/skincare";
import { womenhealth } from "../data/womenhealth";

// Product categories with data
const productCategories = [
  { title: "Long-Term Supplements", data: longTermPro },
  { title: "Beginner Probiotics", data: beginnerPro },
  { title: "Prebiotics", data: preBiotics },
  { title: "Blood Sugar Support", data: bloodSugar },
  { title: "Anemia Support", data: anemia },
  { title: "Nitric Oxide Boosters", data: nitricOxide },
  { title: "IBS (Irritable Bowel Syndrome)", data: IBS },
  { title: "Sleep Aids", data: sleep },
  { title: "Sports Nutrition", data: sports },
  { title: "Skincare Essentials", data: skincare },
  { title: "Women's Health", data: womenhealth },
];

function Products() {
  const { isDarkMode } = useContext(ThemeContext); // Access theme state

  return (
    <div
      className={`min-h-screen py-12 transition-colors duration-300 ease-in-out ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1
            className={`text-3xl font-semibold tracking-tight transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-green-300" : "text-green-900"
            }`}
          >
            Shop Supplements
          </h1>
          <p
            className={`mt-2 text-sm transition-colors duration-300 ease-in-out ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Explore our curated selection of high-quality supplements.
          </p>
        </header>

        {productCategories.map((category, index) => (
          <section key={index} className="mb-12">
            <h2
              className={`text-xl font-medium mb-4 pb-2 border-b transition-colors duration-300 ease-in-out ${
                isDarkMode
                  ? "text-green-200 border-gray-700"
                  : "text-green-800 border-gray-200"
              }`}
            >
              {category.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default Products;
