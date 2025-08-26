import { Timestamp } from "firebase/firestore";

export interface User {
    uid: string;
    name: string;
    email: string;
    role: "admin" | "customer";
    createdAt: string; // Changed to string for Redux serialization
}

// Helper type for Firestore operations that still use Timestamp
export interface UserFirestore {
    uid: string;
    name: string;
    email: string;
    role: "admin" | "customer";
    createdAt: Timestamp;
}  