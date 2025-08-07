// src/hooks/useToast.ts
import { useState, useCallback, useRef, useEffect } from 'react';

interface ToastState {
  show: boolean;
  message: string;
}

export function useToast(duration: number = 3000) {
  const [toast, setToast] = useState<ToastState>({ show: false, message: '' });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string) => {
      // Clear any existing timeout if a new toast is shown
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setToast({ show: true, message });

      timeoutRef.current = setTimeout(() => {
        setToast({ show: false, message: '' });
        timeoutRef.current = null;
      }, duration);
    },
    [duration]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    toast,
    showToast,
  };
}