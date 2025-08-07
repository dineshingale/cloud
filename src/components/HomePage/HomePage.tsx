// src/components/HomePage/HomePage.tsx
import React from 'react';
import { motion } from 'framer-motion';

// SVG for the Google G logo
const GoogleIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
      c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
      c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
      C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
      c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
      c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

interface HomePageProps {
  onSignIn: () => void; // A function to call when the user clicks the sign-in button
}

// FIX: Changed to a default export to resolve the "Element type is invalid" error.
// This is a common convention for page-level components and helps avoid import/export mismatches.
export default function HomePage({ onSignIn }: HomePageProps) {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 flex flex-col items-center justify-center p-4 focus:outline-none">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        <header className="mb-8">
          <div className="inline-block mb-4">
             <div className="w-20 h-20 bg-zinc-200 rounded-2xl overflow-hidden shadow-lg">
              <img src="./logo.png" alt="Cloudkeep Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Welcome to Cloudkeep
          </h1>
          <p className="mt-3 text-lg text-zinc-600 ">
            Your personal space to organize, note, and keep everything that matters.
          </p>
        </header>

        <main className="mb-12">
          <button
            onClick={onSignIn}
            className="w-full max-w-xs mx-auto flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <GoogleIcon />
            <span>Sign in with Google</span>
          </button>
        </main>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-sm text-zinc-500"
        >
          <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
        </motion.footer>
      </motion.div>
    </div>
  );
}
