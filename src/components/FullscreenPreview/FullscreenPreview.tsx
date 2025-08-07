import React from 'react';
import styles from './FullscreenPreview.module.css';
import type { FullscreenPreviewProps } from '../../types';

const FullscreenPreview: React.FC<FullscreenPreviewProps> = ({ media, onClose, onDelete }) => {
  if (!media) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = media.url;
    a.download = media.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = () => {
    onDelete(media);
    onClose();
  };

  return (
    <div className={styles.modal} onClick={handleBackdropClick}>
      <span className={styles.close} onClick={onClose}>&times;</span>
      <div className={styles.content}>
        {media.type.startsWith('image/') && (
          <img src={media.url} alt="Preview" className={styles.media} />
        )}
        {media.type.startsWith('video/') && (
          <video src={media.url} className={styles.media} controls autoPlay />
        )}
      </div>
      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles.download}`} onClick={handleDownload}>Download</button>
        <button className={`${styles.btn} ${styles.delete}`} onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default FullscreenPreview;
