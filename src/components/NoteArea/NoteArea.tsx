import React, { useRef, useEffect } from 'react';
import styles from './NoteArea.module.css';
import type { NoteAreaProps } from '../../types';

const NoteArea: React.FC<NoteAreaProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // reset
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'; // grow
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className={styles.textarea}
      placeholder="Write your thoughts..."
      value={value}
      onChange={onChange}
    />
  );
};

export default NoteArea;
