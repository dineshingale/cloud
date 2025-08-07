import React, { useState, useEffect } from 'react';
import type { Collection, FileType, FullscreenMedia, CollectionCardProps, MediaFile } from '../../types';
import FileUpload from '../FileUpload/FileUpload';
import NoteArea from '../NoteArea/NoteArea';
import { motion } from 'framer-motion';

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection, onUpdate, onDelete, onPreview,
  onDragStart, onDragOver, onDrop, requestMediaDelete, isDragOver
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(collection.title);
  const [newTag, setNewTag] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const handleTitleBlur = () => {
    onUpdate(collection.id, { ...collection, title });
    setIsEditing(false);
  };

  // This function now receives the final MediaFile object from the FileUpload component
  const handleFilesUploaded = (type: FileType, newFiles: MediaFile[]) => {
    const updatedFiles = [...(collection.files[type] || []), ...newFiles];
    onUpdate(collection.id, { ...collection, files: { ...collection.files, [type]: updatedFiles } });
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(collection.id, { ...collection, note: e.target.value });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      onUpdate(collection.id, { ...collection, tags: [...collection.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    onUpdate(collection.id, { ...collection, tags: collection.tags.filter(t => t !== tag) });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className={`bg-zinc-800 text-zinc-100 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:scale-[1.01] ${
        isDragOver ? 'border-t-2 border-dashed border-zinc-400' : ''
      }`}
    >
      <div
        className="p-4"
        draggable
        onDragStart={(e: React.DragEvent<HTMLDivElement>) => onDragStart(e, collection.id)}
        onDragOver={onDragOver}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => onDrop(e, collection.id)}
      >
        <div className="flex justify-between items-start mb-4">
          {isEditing ? (
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className="text-xl font-semibold bg-transparent border-b border-zinc-500 focus:outline-none w-full"
              autoFocus
            />
          ) : (
            <h2 className="text-xl font-semibold flex items-center gap-2">
              {title}
              <button
                onClick={() => setIsEditing(true)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5z"/>
                </svg>
              </button>
            </h2>
          )}
          <button
            type="button"
            onClick={() => onDelete(collection.id)}
            className="text-zinc-500 hover:text-red-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <NoteArea value={collection.note} onChange={handleNoteChange} />
          {(['image', 'video', 'audio'] as FileType[]).map(type => (
            <FileUpload
              key={type}
              type={type}
              files={collection.files[type]}
              onFilesAdded={files => handleFilesUploaded(type, files)}
              onPreview={file => onPreview({ ...file, collectionId: collection.id })}
              onDelete={file => requestMediaDelete({ ...file, collectionId: collection.id })}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-300 mt-4">
          {collection.tags.map(tag => (
            <div key={tag} className="bg-zinc-600 text-zinc-200 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <span>{tag}</span>
              <button onClick={() => removeTag(tag)} className="text-zinc-400 hover:text-white transition-colors">&times;</button>
            </div>
          ))}
          <input
            type="text"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="+ Add tag"
            className="bg-zinc-700 text-sm text-zinc-100 placeholder-zinc-400 px-2 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-400 transition"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CollectionCard;



//this