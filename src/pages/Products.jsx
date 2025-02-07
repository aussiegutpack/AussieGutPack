import React from "react";
import { longTermPro } from "../data/longTermPro";
import ProductCard from "../components/ProductCard";
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

function Products() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 m-6">
        Long Term Supplements
      </h1>
      <div className="grid md:grid-cols-2 gap-6">
        {longTermPro.map((longTermPro) => (
          <ProductCard key={longTermPro.id} product={longTermPro} />
        ))}
      </div>
      <h1 className="text-3xl font-bold text-green-800 m-6">
        Beginner Probiotics
      </h1>
      <div className="grid md:grid-cols-2 gap-6">
        {beginnerPro.map((beginnerPro) => (
          <ProductCard key={beginnerPro.id} product={beginnerPro} />
        ))}
      </div>
      <h1 className="text-3xl font-bold text-green-800 m-6">Prebiotics</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {preBiotics.map((preBiotics) => (
          <ProductCard key={preBiotics.id} product={preBiotics} />
        ))}
      </div>
      <h1 className="text-3xl font-bold text-green-800 m-6">Blood Sugar</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {bloodSugar.map((bloodSugar) => (
          <ProductCard key={bloodSugar.id} product={bloodSugar} />
        ))}
      </div>
      <h1 className="text-3xl font-bold text-green-800 m-6">Anemia</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {anemia.map((anemia) => (
          <ProductCard key={anemia.id} product={anemia} />
        ))}
      </div>
      <h1 className="text-3xl font-bold text-green-800 m-6">Nitric Oxide</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {nitricOxide.map((nitricOxide) => (
          <ProductCard key={nitricOxide.id} product={nitricOxide} />
        ))}
      </div>
      <h1 className="text-3xl font-bold text-green-800 m-6">
        IBS (Irritable Bowel Syndroms)
      </h1>
      <div className="grid md:grid-cols-2 gap-6">
        {IBS.map((IBS) => (
          <ProductCard key={IBS.id} product={IBS} />
        ))}
      </div>
      <h1 className="text-3xl font-bold text-green-800 m-6">Sleep</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {sleep.map((sleep) => (
          <ProductCard key={sleep.id} product={sleep} />
        ))}
      </div>
      <h1 className="text-3xl font-bold text-green-800 m-6">
        Sports Supplements
      </h1>
      <div className="grid md:grid-cols-2 gap-6">
        {sports.map((sports) => (
          <ProductCard key={sports.id} product={sports} />
        ))}
      </div>
      <h1 className="text-3xl font-bold text-green-800 m-6">Skincare</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {skincare.map((skincare) => (
          <ProductCard key={skincare.id} product={skincare} />
        ))}
      </div>
      <h1 className="text-3xl font-bold text-green-800 m-6">Women's Health</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {womenhealth.map((womenhealth) => (
          <ProductCard key={womenhealth.id} product={womenhealth} />
        ))}
      </div>
    </div>
  );
}

export default Products;
