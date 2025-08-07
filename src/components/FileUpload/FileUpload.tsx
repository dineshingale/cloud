// src/components/FileUpload/FileUpload.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import FilePreview from '../FilePreview/FilePreview';
import type { UploadableFile, FileUploadProps, FileType, MediaFile } from '../../types';
import styles from './FileUpload.module.css';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
const API_BASE_URL = 'http://localhost:3000/api'; // *** Replace with your Render.com backend URL ***

const FileUpload: React.FC<FileUploadProps> = ({ type, files, onFilesAdded, onPreview, onDelete }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFiles, setUploadingFiles] = useState<UploadableFile[]>([]);

  const emojiMap = { image: '🖼️', video: '🎬', audio: '🎵' };
  const textMap = { image: 'Images', video: 'Videos', audio: 'Audios' };
  const acceptMap = { image: 'image/*', video: 'video/*', audio: 'audio/*' };

  const handleStartUpload = useCallback(async (uploadableFile: UploadableFile) => {
    const file = uploadableFile.file;
    const fileId = uploadableFile.id;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    
    const controller = new AbortController();
    setUploadingFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'uploading', source: controller } : f));
    
    let uploadedChunksCount = 0;
    
    try {
      const statusResponse = await axios.get(`${API_BASE_URL}/upload-status`, { params: { fileId } });
      uploadedChunksCount = statusResponse.data.uploadedChunksCount;
      if (uploadedChunksCount === totalChunks) {
        setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
        return;
      }
    } catch (err) {
      console.log('No previous upload found, starting from scratch.');
    }

    for (let i = uploadedChunksCount; i < totalChunks; i++) {
      const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('fileId', fileId);
      formData.append('originalName', file.name);
      formData.append('chunkIndex', i.toString());
      formData.append('totalChunks', totalChunks.toString());

      try {
        const response = await axios.post(`${API_BASE_URL}/upload-chunk`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          signal: controller.signal,
        });

        const newProgress = ((i + 1) / totalChunks) * 100;
        setUploadingFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: newProgress } : f));
        
        if (i + 1 === totalChunks) {
          // The last chunk was uploaded successfully.
          const completedFile: MediaFile = {
            url: response.data.url, // Get the final URL from the backend response
            type: file.type,
            name: file.name
          };
          onFilesAdded([completedFile]);
          setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
        }

      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Upload cancelled');
        } else {
          console.error(`Upload failed at chunk ${i}:`, err);
          setUploadingFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'error', error: 'Upload failed' } : f));
        }
        return;
      }
    }
  }, [onFilesAdded]);

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    const newUploads = newFiles.map(file => {
      const uploadableFile: UploadableFile = {
        id: uuidv4(),
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: 'pending',
        source: null,
      };
      handleStartUpload(uploadableFile);
      return uploadableFile;
    });
    setUploadingFiles(prev => [...prev, ...newUploads]);
  }, [handleStartUpload]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFilesAdded(droppedFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFilesAdded(Array.from(e.target.files));
    }
  };
  
  // Combine existing files with files currently being uploaded
  const allFiles = [...files, ...uploadingFiles];

  return (
    <div className="flex flex-col gap-2 w-full">
      <div
        className={`border-2 p-4 rounded-md transition text-center cursor-pointer ${
          isDragOver ? 'border-dashed border-zinc-400 bg-zinc-700' : 'border-zinc-600 bg-zinc-800'
        } hover:bg-zinc-700 dark:hover:bg-zinc-700 text-zinc-300`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleDrop(e);
        }}
      >
        <span className="text-3xl">{emojiMap[type]}</span>
        <p className="text-sm mt-2">Drop {textMap[type]}</p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept={acceptMap[type]}
          onChange={handleFileChange}
        />
      </div>

      <div className={`grid gap-2 ${type === 'image' ? 'grid-cols-4' : type === 'video' ? 'grid-cols-3' : 'grid-cols-1'} p-2 rounded-md bg-zinc-700`}>
        {allFiles.map((file, index) => {
          // Check if it's an UploadableFile (has a 'file' property) or a MediaFile (has a 'url' property).
          // This fixes the type error by rendering different UI for each type.
          if ('url' in file) {
            // It's a completed MediaFile, so render the FilePreview component
            return (
              <FilePreview key={file.url} file={file} onPreview={onPreview} onDelete={onDelete} />
            );
          } else {
            // It's an UploadableFile still in progress
            return (
              <div key={file.id} className="relative">
                {/* The 'preview' property of UploadableFile is a temporary URL that can be used here */}
                {file.file.type.startsWith('image/') && (
                  <img src={file.preview} alt="Preview" className={styles.image} />
                )}
                {file.file.type.startsWith('video/') && (
                  <video src={file.preview} muted loop autoPlay className={styles.video} />
                )}
                {file.file.type.startsWith('audio/') && (
                  <audio controls src={file.preview} className="w-full h-8 flex-grow" />
                )}
                <div className="absolute inset-0 flex items-center justify-center  bg-opacity-70 text-white">
                  <span className="text-sm font-semibold">{file.progress.toFixed(0)}%</span>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default FileUpload;


