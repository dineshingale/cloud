// src/hooks/useAppController.ts
import { useState, useCallback } from 'react';
import type { FullscreenMedia } from '../types';
import type { User as AppUser } from '../types';

// Import the lower-level hooks
import { useCollections } from './useCollections';
import { useModal } from './useModal';
import { useToast } from './useToast';

export function useAppController() {
  // State that is truly for the UI components
  const [searchQuery, setSearchQuery] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [fullscreenMedia, setFullscreenMedia] = useState<FullscreenMedia | null>(null);

  // Lower-level hooks
  const { modal, showModal, hideModal } = useModal();
  const { toast, showToast } = useToast();
  const { collections, addCollection, updateCollection, deleteCollection, ...dragHandlers } = useCollections();

  // Handler for adding a new collection
  const handleAddCollection = useCallback(() => {
    if (newCollectionName.trim() === '') return;
    addCollection(newCollectionName);
    setNewCollectionName('');
    showToast('Collection created!');
  }, [newCollectionName, addCollection, showToast]);

  // Handler for deleting a collection
  const handleDeleteCollection = useCallback((id: number) => {
    showModal('Are you sure you want to delete this collection permanently?', () => {
      deleteCollection(id, () => {});
      showToast('Collection deleted!');
    });
  }, [showModal, deleteCollection, showToast]);

  // Handler for media deletion
  const requestMediaDelete = useCallback((media: FullscreenMedia) => {
    showModal('Are you sure you want to delete this file?', () => {
      const collectionToUpdate = collections.find(c => c.id === media.collectionId);
      if (collectionToUpdate) {
        const fileType = media.type.split('/')[0] as keyof typeof collectionToUpdate.files;
        const updatedFiles = collectionToUpdate.files[fileType].filter(file => file.url !== media.url);
        updateCollection(media.collectionId, {
          ...collectionToUpdate,
          files: { ...collectionToUpdate.files, [fileType]: updatedFiles },
        });
        showToast('Media deleted!');
      }
    });
  }, [collections, showModal, updateCollection, showToast]);

  // Filtering logic
  const filteredCollections = collections.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase().replace('#', '')))
  );

  // Return everything the UI needs to render and function
  return {
    // State and handlers for Header
    searchQuery,
    setSearchQuery,
    newCollectionName,
    setNewCollectionName,
    handleAddCollection,
    // State and handlers for CollectionList
    filteredCollections,
    updateCollection,
    handleDeleteCollection,
    setFullscreenMedia,
    requestMediaDelete,
    dragHandlers,
    // State and handlers for Modals/Popups
    modal,
    hideModal,
    fullscreenMedia,
    toast,
  };
}