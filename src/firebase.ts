// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEB3uFsg2nkYPhsG-6vtSnrSL0VTPT-Ek",
  authDomain: "cloudkeep-ffaa5.firebaseapp.com",
  projectId: "cloudkeep-ffaa5",
  storageBucket: "cloudkeep-ffaa5.firebasestorage.app",
  messagingSenderId: "766999111672",
  appId: "1:766999111672:web:724087ababe2f8ccfed80d",
  measurementId: "G-GHHQDRZ686"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth instance for use in other components
export const auth = getAuth(app);