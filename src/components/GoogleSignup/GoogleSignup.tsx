// src/components/Login.tsx

import { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '../../firebase'; // Adjust the import path as necessary

const GoogleSignup = () => {
  // Use TypeScript to define the user state, which can be User object or null
  const [user, setUser] = useState<User | null>(null);

  // Sign-in function
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
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

  // Set up an auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        // If user is logged in, show their info and a sign-out button
        <div>
          <h2>Welcome to CloudKeep, {user.displayName}!</h2>
          <p>Email: {user.email}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        // If user is not logged in, show the sign-in button
        <button onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default GoogleSignup;