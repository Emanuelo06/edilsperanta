import { Timestamp } from "firebase/firestore/lite";

export interface User {
    uid: string;
    name: string;
    email: string;
    role: "admin" | "customer";
    createdAt: Timestamp;
  }

  