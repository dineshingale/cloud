// src/hooks/useCollections.ts

import { useState, useRef, useCallback } from 'react';
import type { Collection } from '../types';

export function useCollections(initialCollections: Collection[] = []) {
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const dragItem = useRef<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  const addCollection = useCallback((newCollectionName: string) => {
    if (newCollectionName.trim() === '') return;
    const newCollection: Collection = {
      id: Date.now(),
      title: newCollectionName.trim(),
      note: '',
      files: { image: [], video: [], audio: [] },
      tags: [],
    };
    setCollections(prev => [newCollection, ...prev]);
  }, []);

  const updateCollection = (id: number, updated: Collection) => {
    setCollections(prev => prev.map(c => (c.id === id ? updated : c)));
  };

  const deleteCollection = (id: number, showModal: (onConfirm: () => void) => void) => {
    // This hook provides the action to perform when the modal is confirmed.
    // The component itself will handle showing the modal with the right message.
    showModal(() => {
      setCollections(prev => prev.filter(c => c.id !== id));
    });
  };
  
  const onDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, id: number) => {
    dragItem.current = id;
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.preventDefault();
    setDragOverId(id);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.preventDefault();
    if (dragItem.current === null || dragItem.current === id) {
      setDragOverId(null);
      return;
    };

    const fromIndex = collections.findIndex(c => c.id === dragItem.current);
    const toIndex = collections.findIndex(c => c.id === id);

    if (fromIndex === -1 || toIndex === -1) return;

    const newCollections = [...collections];
    const [movedItem] = newCollections.splice(fromIndex, 1);
    newCollections.splice(toIndex, 0, movedItem);
    
    setCollections(newCollections);
    dragItem.current = null;
    setDragOverId(null);
  }, [collections]);

  return {
    collections,
    setCollections,
    addCollection,
    updateCollection,
    deleteCollection,
    dragItem,
    dragOverId,
    onDragStart,
    onDragOver,
    onDrop,
    setDragOverId
  };
}