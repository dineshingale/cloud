// src/hooks/useModal.ts
import { useState, useCallback } from 'react';
import type { ModalState } from '../types';

const initialState: ModalState = {
  isOpen: false,
  message: '',
  onConfirm: null,
};

export function useModal() {
  const [modal, setModal] = useState<ModalState>(initialState);

  const showModal = useCallback((message: string, onConfirm: () => void) => {
    setModal({
      isOpen: true,
      message,
      onConfirm,
    });
  }, []);

  const hideModal = useCallback(() => {
    setModal(initialState);
  }, []);

  return {
    modal,
    showModal,
    hideModal,
  };
}