// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmEsZgK9ZhYHszKYjsb8FkaHvs8ZdlsLo",
  authDomain: "edilsperanta.firebaseapp.com",
  projectId: "edilsperanta",
  storageBucket: "edilsperanta.firebasestorage.app",
  messagingSenderId: "328638989945",
  appId: "1:328638989945:web:d5c494165dd940756bf6a8",
  measurementId: "G-28W6PS0G2S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
