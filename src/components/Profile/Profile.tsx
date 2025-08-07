// src/components/Profile/Profile.tsx
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ThemeToggle from '../../utils/ThemeToggle';
import type { User } from '../../types'; // Adjust the import path as necessary
import type { ProfileProps } from '../../types'; // Adjust the import path as necessary

// --- Placeholder User Type ---
// In your actual app, you'd import this from your types file
// and likely get it from a Firebase auth context.


export default function Profile({ user, onSignOut }: ProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // FIX: Add a guard clause to prevent rendering if the user prop is null or undefined.
  // This resolves the "Cannot read properties of undefined (reading 'photoURL')" error.
  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-zinc-800"
      >
        <img
          src={user.photoURL}
          alt="User profile"
          className="w-full h-full object-cover"
          // Fallback for broken image URLs
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop
            target.src = `https://placehold.co/40x40/E0E0E0/333?text=${user.displayName.charAt(0)}`;
          }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full right-0 mt-2 w-64 bg-zinc-800 rounded-xl shadow-2xl border border-zinc-700 z-10"
          >
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                   <img
                    src={user.photoURL}
                    alt="User profile" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer" 
                    />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-zinc-100 truncate">{user.displayName}</p>
                  <p className="text-sm text-zinc-400 truncate">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                 <div className="p-2 rounded-lg hover:bg-zinc-700 transition-colors">
                   <ThemeToggle />
                 </div>
                 {/* You can add more items here like Language, etc. */}
              </div>

            </div>
            <div className="border-t border-zinc-700 px-4 py-2">
               <button 
                 onClick={onSignOut}
                 className="w-full text-left text-sm text-red-500 hover:font-semibold transition-all"
               >
                 Sign Out
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}