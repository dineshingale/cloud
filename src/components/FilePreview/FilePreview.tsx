import React from 'react';
import styles from './FilePreview.module.css';
import type { MediaFile, FilePreviewProps } from '../../types';

const FilePreview: React.FC<FilePreviewProps> = ({ file, onPreview, onDelete }) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (file.type.startsWith('image/')) {
    return <img src={file.url} alt={file.name} className={styles.image} onClick={() => onPreview(file)} />;
  }

  if (file.type.startsWith('video/')) {
    return <video src={file.url} muted loop autoPlay className={styles.video} onClick={() => onPreview(file)} />;
  }

  if (file.type.startsWith('audio/')) {
  return (
    <div className="w-full flex flex-col p-2 bg-zinc- rounded-md gap-1">
      <span className="text-xs text-zinc-300 truncate w-full text-center font-semibold">{file.name}</span>
      <div className="flex items-center gap-2">
        <audio controls src={file.url} className="w-full h-8 flex-grow" />
        <button
          onClick={handleDownload}
          className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-black hover:bg-zinc-200 transition-colors"
        >
          {/* download icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
        </button>
        <button
          onClick={() => onDelete(file)}
          className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 text-white hover:bg-red-700 transition-colors"
        >
          {/* trash icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}


  return null;
};

export default FilePreview;


//this