import { Timestamp } from "firebase/firestore";
import { User } from "@/types/User";

/**
 * Converts any Firebase user data to a Redux-serializable format
 * @param userData - Raw user data that might contain Timestamps
 * @returns Serializable user data for Redux store
 */
export const serializeUserForRedux = (userData: Record<string, unknown>): User => {
  return {
    uid: String(userData.uid || ""),
    name: String(userData.name || userData.displayName || ""),
    email: String(userData.email || ""),
    role: (userData.role as "admin" | "customer") || "customer",
    createdAt: userData.createdAt instanceof Timestamp 
      ? userData.createdAt.toDate().toISOString()
      : typeof userData.createdAt === 'string' 
        ? userData.createdAt
        : new Date().toISOString()
  };
};

/**
 * Converts serialized user data back to Firestore format for database operations
 * @param user - Serialized user data from Redux
 * @returns User data with Timestamp for Firestore
 */
export const deserializeUserForFirestore = (user: User) => {
  return {
    uid: user.uid,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: Timestamp.fromDate(new Date(user.createdAt))
  };
};
