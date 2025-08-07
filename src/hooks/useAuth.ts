// src/hooks/useAuth.ts

import { useState, useEffect } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut, 
  type User 
} from 'firebase/auth';
import { auth } from '../firebase'; // Your firebase config file

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  // Sign-in function
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The onAuthStateChanged listener will handle the user state update
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  // Sign-out function
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };
  
  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false once we have a user or know there isn't one
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user, loading, handleGoogleSignIn, handleSignOut };
}