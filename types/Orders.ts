import { Timestamp } from "firebase/firestore/lite";

export interface Orders {
   id: string;
  userId: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "completed" | "canceled";
  createdAt: Timestamp;
}