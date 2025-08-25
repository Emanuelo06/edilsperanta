import { Timestamp } from "firebase/firestore/lite";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrl: string;
  images?: string[]; // Add images array for multiple product images
  featured?: boolean; // Add featured flag for home page
  createdAt: Timestamp;
  updatedAt: Timestamp;
}