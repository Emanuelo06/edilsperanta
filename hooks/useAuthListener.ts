"use client"
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {useDispatch} from "react-redux"
import { auth } from "@/lib/firebase";
import { setUser } from "@/redux/slices/authSlice";
import { Timestamp } from "firebase/firestore/lite";

export const useAuthListener = () => {
   const dispatch = useDispatch();

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
         if(user){
            dispatch(
               setUser({
                  uid: user.uid,
                  email: user.email || "",
                  name: user.displayName || "",
                  role: "customer" as const,
                  createdAt: Timestamp.now(),
               })
            );
         } else {
            dispatch(setUser(null));
         }
      });
      return () => unsubscribe();
   }, [dispatch]);
}