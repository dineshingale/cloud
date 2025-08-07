// src/App.tsx
import React, { useMemo } from 'react'; // Import useMemo
import { AnimatePresence } from 'framer-motion';

// --- (1) Import both your custom User type and the Firebase hook ---
import type { User as AppUser } from './types'; // Rename your custom type on import to avoid name conflicts
import { useAuth } from './hooks/useAuth';
import { useAppController } from './hooks/useAppController';

// UI Components
import HomePage from './components/HomePage/HomePage';
import Header from './components/Header/Header';
import CollectionList from './components/CollectionList/CollectionList';
import FullscreenPreview from './components/FullscreenPreview/FullscreenPreview';
import Modal from './components/Modal/Modal';

// Styles
import './App.css';

export default function App() {
  // Get the user object from Firebase auth
  const { user: firebaseUser, loading, handleGoogleSignIn, handleSignOut } = useAuth();
  
  // --- (2) Create a memoized, app-safe user object ---
  // This bridges the Firebase user (which can have nulls) and your app's user type.
  const appUser: AppUser | null = useMemo(() => {
    if (!firebaseUser) return null;
    
    // Create an object that matches your AppUser type, providing default values for nulls.
    return {
      displayName: firebaseUser.displayName || 'Cloudkeep User',
      email: firebaseUser.email || 'No email provided',
      photoURL: firebaseUser.photoURL || 'default-avatar.png' // Or a path to a default image
    };
  }, [firebaseUser]);
  
  // Pass the correctly typed appUser to your controller hook
  const {
    searchQuery, setSearchQuery, newCollectionName, setNewCollectionName, handleAddCollection,
    filteredCollections, updateCollection, handleDeleteCollection, setFullscreenMedia, requestMediaDelete, dragHandlers,
    modal, hideModal, fullscreenMedia, toast
  } = useAppController();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <p className="text-white">Loading Cloudkeep...</p>
      </div>
    );
  }
  
  // Now, the conditional rendering logic uses the Firebase user object directly.
  if (!firebaseUser) {
    return <HomePage onSignIn={handleGoogleSignIn} />;
  }
  
  return (
    <div className="app-container bg-zinc-900 text-zinc-100 transition-colors duration-300 min-h-screen">
      <div className="p-4">
        {/* --- (3) Pass the app-safe `appUser` to the Header --- */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          newCollectionName={newCollectionName}
          onNewCollectionNameChange={(e) => setNewCollectionName(e.target.value)}
          onAddCollection={handleAddCollection}
          onAddCollectionKeyDown={(e) => e.key === 'Enter' && handleAddCollection()}
          user={appUser} // Pass the correctly typed user
          onSignOut={handleSignOut}
        />

        <CollectionList
          collections={filteredCollections}
          onUpdate={updateCollection}
          onDelete={handleDeleteCollection}
          onPreview={setFullscreenMedia}
          requestMediaDelete={requestMediaDelete}
          {...dragHandlers}
        />

        <AnimatePresence>
          {modal.isOpen && modal.onConfirm && (
            <Modal
              message={modal.message}
              onConfirm={() => {
                modal.onConfirm!();
                hideModal();
              }}
              onCancel={hideModal}
            />
          )}
          {fullscreenMedia && (
            <FullscreenPreview
              media={fullscreenMedia}
              onClose={() => setFullscreenMedia(null)}
              onDelete={requestMediaDelete}
            />
          )}
        </AnimatePresence>

        <div className={`toast-notification ${toast.show ? 'show' : ''}`}>
          {toast.message}
        </div>
      </div>
    </div>
  );
}