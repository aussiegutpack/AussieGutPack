import React, { useState, useEffect } from "react";
import "../styles/Background.css";
import aussie from "../assets/images/aussie.png"; // Import from src/assets/images/
import goggins from "../assets/images/goggins.png"; // Import from src/assets/images/

// Use imported images directly
const images = [aussie, goggins];

const Background = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="background-container">
      {images.map((image, index) => (
        <div
          key={index}
          className={`background-image ${
            index === currentImage ? "active" : ""
          }`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
    </div>
  );
};

export default Background;
