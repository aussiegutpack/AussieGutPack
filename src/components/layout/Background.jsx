// src/components/layout/Background.jsx (with cycling)
import React, { useState, useEffect } from "react";
import aussie from "../../assets/images/aussie.png";
import goggins from "../../assets/images/goggins.png";

const images = [
  { src: aussie, alt: "Australian Shepherd dog" },
  { src: goggins, alt: "David Goggins running" },
];

const Background = ({ className }) => {
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
        <img
          key={index}
          src={image.src}
          alt={image.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentImage ? "opacity-100" : "opacity-0"
          } ${className || ""}`}
        />
      ))}
    </div>
  );
};

export default Background;
