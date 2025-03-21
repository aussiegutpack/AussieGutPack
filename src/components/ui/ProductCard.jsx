// src/components/ui/ProductCard.jsx
import React from "react";
import Card from "./Card";

const ProductCard = ({ product }) => (
  <Card
    title={product.name}
    content={product.description}
    footer={`$${product.price}`}
    className="hover:shadow-lg"
  />
);

export default ProductCard;
