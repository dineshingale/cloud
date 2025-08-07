// src/types/index.ts

export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

export interface UploadableFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: UploadStatus;
  error?: string;
  source?: any;
}

export type FileType = 'image' | 'video' | 'audio';

export interface User {
  displayName: string;
  email: string;
  photoURL: string;
}

export interface MediaFile {
  url: string;
  type: string;
  name: string;
}

export interface HeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newCollectionName: string;
  onNewCollectionNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddCollection: () => void;
  onAddCollectionKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  user: User | null;
  onSignOut: () => void;
}

export interface ProfileProps {
  user: User | null;
  onSignOut: () => void;
}

export interface FullscreenMedia extends MediaFile {
  collectionId: number;
}

export interface Collection {
  id: number;
  title: string;
  note: string;
  files: Record<FileType, MediaFile[]>;
  tags: string[];
}

export interface ModalState {
  isOpen: boolean;
  message: string;
  onConfirm: (() => void) | null;
}

// Props Interfaces
export interface ModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface FullscreenPreviewProps {
  media: FullscreenMedia | null;
  onClose: () => void;
  onDelete: (media: FullscreenMedia) => void;
}

export interface FilePreviewProps {
  file: MediaFile;
  onPreview: (file: MediaFile) => void;
  onDelete: (file: MediaFile) => void;
}

export interface FileUploadProps {
  type: FileType;
  files: MediaFile[];
  onFilesAdded: (files: MediaFile[]) => void;
  onPreview: (file: MediaFile) => void;
  onDelete: (file: MediaFile) => void;
}

export interface NoteAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface CollectionCardProps {
  collection: Collection;
  onUpdate: (id: number, updatedCollection: Collection) => void;
  onDelete: (id: number) => void;
  onPreview: (media: FullscreenMedia) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  requestMediaDelete: (media: FullscreenMedia) => void;
  isDragOver: boolean;
}