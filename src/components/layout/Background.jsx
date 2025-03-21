// src/components/layout/Background.jsx
import React, { useState, useEffect } from "react";
import aussie from "../../assets/images/aussie.png";
import goggins from "../../assets/images/goggins.png";

const images = [aussie, goggins];

const Background = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-gray-900">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-[120%] h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
    </div>
  );
};

export default Background;
