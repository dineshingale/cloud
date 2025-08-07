// src/components/CollectionList/CollectionList.tsx
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CollectionCard from '../CollectionCard/CollectionCard';
import type { Collection, FullscreenMedia, UploadableFile, FileType } from '../../types';

interface CollectionListProps {
  collections: Collection[];
  dragOverId: number | null;
  onUpdate: (id: number, updated: Collection) => void;
  onDelete: (id: number) => void;
  onPreview: (media: FullscreenMedia) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  requestMediaDelete: (media: FullscreenMedia) => void;
}

const CollectionList =({ collections, dragOverId, ...props }: CollectionListProps) => {
  return (
    <main className="grid grid-cols-1 gap-4">
      <AnimatePresence>
        {collections.length > 0 ? (
          collections.map(c => (
            <CollectionCard
              key={c.id}
              collection={c}
              isDragOver={dragOverId === c.id}
              onUpdate={props.onUpdate}
              onDelete={() => props.onDelete(c.id)}
              onPreview={props.onPreview}
              onDragStart={(e) => props.onDragStart(e, c.id)}
              onDragOver={(e) => props.onDragOver(e, c.id)}
              onDrop={(e) => props.onDrop(e, c.id)}
              requestMediaDelete={props.requestMediaDelete}
          
            />
          ))
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 text-zinc-500"
          >
            <h2 className="text-2xl font-bold mb-2">No collections yet.</h2>
            <p>Create your first one to get started!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default CollectionList;

//this