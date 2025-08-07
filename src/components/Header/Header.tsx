// src/components/Header/Header.tsx
import React from 'react';
import type { User } from '../../types'; // Make sure to import the User type
import Profile from '../Profile/Profile';
import type { HeaderProps } from '../../types'; // adjust the path if needed


const Header = ({
  searchQuery,
  onSearchChange,
  newCollectionName,
  onNewCollectionNameChange,
  onAddCollection,
  onAddCollectionKeyDown,
  user,
  onSignOut,
}: HeaderProps) => {
  return (
    <header className="control-strip p-4 mb-4 rounded-xl flex flex-col gap-4 bg-zinc-800">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-300 rounded-lg overflow-hidden">
            <img src="./logo.png" alt="Cloudkeep Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold">Cloudkeep</h1>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search collections or #tags..."
            className="w-full sm:w-64 px-4 py-2 rounded-full focus:ring-2 focus:ring-zinc-400 focus:outline-none bg-zinc-200 text-zinc-900 placeholder-zinc-500 "
            value={searchQuery}
            onChange={onSearchChange}
          />
          {user ? (
            <Profile user={user} onSignOut={onSignOut} />
          ) : (
            <button
              onClick={() => alert('Sign in functionality not implemented')}
              className="btn-primary px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white "
            >
              Sign In
            </button>
          )}
        </div>
      </div>
      <hr className="w-full border-zinc-300" />
      <div className="flex items-center gap-2 w-full">
        <input
          type="text"
          placeholder="Name your new collection..."
          className="min-w-0 flex-grow px-4 py-2 rounded-full bg-zinc-200 text-zinc-900 placeholder-zinc-500 focus:ring-2 focus:ring-zinc-400 focus:outline-none"
          value={newCollectionName}
          onChange={onNewCollectionNameChange}
          onKeyDown={onAddCollectionKeyDown}
        />
        <button
          onClick={onAddCollection}
          className="btn-primary px-6 py-2 rounded-full whitespace-nowrap flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add
        </button>
      </div>
    </header>
  );
}

export default Header;