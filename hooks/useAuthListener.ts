"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { setUser, clearUser } from "@/redux/slices/authSlice";
import { AppDispatch } from "@/lib/store";
import { serializeUserForRedux } from "@/utils/userSerialization";

export const useAuthListener = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Check if user document exists in Firestore
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            // User document exists, serialize for Redux
            const firestoreData = userDocSnap.data();
            const userData = serializeUserForRedux({
              uid: firebaseUser.uid,
              ...firestoreData
            });
            dispatch(setUser(userData));
          } else {
            // Create new user document
            const now = Timestamp.now();
            const newUserDataForFirestore = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || "",
              email: firebaseUser.email || "",
              role: "customer" as const,
              createdAt: now,
              preferences: {
                newsletter: false,
                notifications: true
              }
            };
            
            await setDoc(userDocRef, newUserDataForFirestore);
            
            // Serialize for Redux state
            const userData = serializeUserForRedux({
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || "",
              email: firebaseUser.email || "",
              role: "customer",
              createdAt: now
            });
            dispatch(setUser(userData));
          }
        } catch (error) {
          console.error("Error handling auth state change:", error);
          // Fallback to basic Firebase user data
          const userData = serializeUserForRedux({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
            role: "customer"
          });
          dispatch(setUser(userData));
        }
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
};