import * as React from "react";

export interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  onAddToCart?: () => void;
}

export function ProductCard({ name, price, image, onAddToCart }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 flex flex-col items-center">
      <img src={image} alt={name} className="w-32 h-32 object-cover mb-2 rounded" />
      <div className="font-semibold text-lg mb-1">{name}</div>
      <div className="text-primary font-bold mb-2">{price.toFixed(2)} RON</div>
      <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90" onClick={onAddToCart}>
        Adaugă în coș
      </button>
    </div>
  );
}
